-- ============================================================
-- Mithila Utkarsh — Phase 2: Ghatkaiti matching (interests + credits)
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- Model: approved members browse ANONYMOUS, compatibility-filtered cards and
-- mark "interest". 2 interests are free; after that each costs 1 credit (credits
-- bought in packs — Stripe comes later). When interest is MUTUAL, name + contact
-- are revealed to both.
--
-- Privacy: matrimony_profiles stays own-row-only (from 04). Browsing/matching
-- happens ONLY through the SECURITY DEFINER functions below, which return safe
-- columns and hide name/contact until a match is mutual.
-- ============================================================

-- 1. Name + contact on the biodata (revealed only on a mutual match).
ALTER TABLE public.matrimony_profiles
    ADD COLUMN IF NOT EXISTS full_name TEXT,
    ADD COLUMN IF NOT EXISTS contact   TEXT;

-- 2. Credits — a SEPARATE table members can READ but never WRITE.
--    Only the SECURITY DEFINER functions (and the service role / Stripe webhook
--    later) modify it, so nobody can grant themselves credits from the browser.
CREATE TABLE IF NOT EXISTS public.matrimony_credits (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    free_interests_used INT NOT NULL DEFAULT 0,
    interest_credits    INT NOT NULL DEFAULT 0,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.matrimony_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Own credits select" ON public.matrimony_credits;
CREATE POLICY "Own credits select"
    ON public.matrimony_credits FOR SELECT USING (auth.uid() = id);
-- (No insert/update/delete policy on purpose — writes only via the functions below.)

-- 3. Interests — who marked interest in whom. One row per (from, to).
CREATE TABLE IF NOT EXISTS public.matrimony_interests (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    to_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (from_id, to_id)
);
ALTER TABLE public.matrimony_interests ENABLE ROW LEVEL SECURITY;
-- RLS enabled with NO policies => no direct access. All access is via the
-- SECURITY DEFINER functions, which bypass RLS as the table owner.

CREATE INDEX IF NOT EXISTS matrimony_interests_to_idx   ON public.matrimony_interests (to_id);
CREATE INDEX IF NOT EXISTS matrimony_interests_from_idx ON public.matrimony_interests (from_id);

-- ============================================================
-- Functions (SECURITY DEFINER, fixed search_path).
-- The free allowance is 2; change FREE_LIMIT in one place below if needed.
-- ============================================================

-- Browse: compatible, approved candidates as SAFE fields only (no name/contact).
-- Compatibility = complementary gender/looking_for, different Gotra AND Mool,
-- not yourself, not someone you've already shown interest in.
CREATE OR REPLACE FUNCTION public.browse_candidates()
RETURNS TABLE (
    id uuid, age int, height text, education text,
    profession text, about text, expectations text
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    WITH me AS (SELECT * FROM public.matrimony_profiles WHERE id = auth.uid())
    SELECT p.id,
           CASE WHEN p.dob IS NOT NULL THEN date_part('year', age(p.dob))::int END AS age,
           p.height, p.education, p.profession, p.about, p.expectations
    FROM public.matrimony_profiles p, me
    WHERE p.status = 'approved'
      AND me.status = 'approved'
      AND p.id <> me.id
      -- I want someone of p's gender:
      AND ( (me.looking_for = 'groom' AND p.gender = 'male')
         OR (me.looking_for = 'bride' AND p.gender = 'female') )
      -- p wants someone of my gender:
      AND ( (p.looking_for = 'groom' AND me.gender = 'male')
         OR (p.looking_for = 'bride' AND me.gender = 'female') )
      -- lineage: different Gotra AND different Mool (basic safety filter, not Panji)
      AND (me.gotra IS NULL OR p.gotra IS NULL OR lower(trim(p.gotra)) <> lower(trim(me.gotra)))
      AND (me.mool  IS NULL OR p.mool  IS NULL OR lower(trim(p.mool))  <> lower(trim(me.mool)))
      -- not already interested
      AND NOT EXISTS (
            SELECT 1 FROM public.matrimony_interests i
            WHERE i.from_id = me.id AND i.to_id = p.id)
    ORDER BY age NULLS LAST;
$$;

-- Send interest: spends a free interest (first 2) then a credit; atomic.
-- Returns: 'mutual' | 'sent' | 'no_credits' | 'already' | 'not_approved' | 'invalid'
CREATE OR REPLACE FUNCTION public.send_interest(candidate uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
    me uuid := auth.uid();
    free_limit CONSTANT int := 2;
    used int;
    credits int;
    is_mutual boolean;
BEGIN
    IF me IS NULL OR candidate IS NULL OR candidate = me THEN
        RETURN 'invalid';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.matrimony_profiles WHERE id = me AND status = 'approved') THEN
        RETURN 'not_approved';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.matrimony_profiles WHERE id = candidate AND status = 'approved') THEN
        RETURN 'invalid';
    END IF;
    IF EXISTS (SELECT 1 FROM public.matrimony_interests WHERE from_id = me AND to_id = candidate) THEN
        RETURN 'already';
    END IF;

    -- Ensure a credit row exists, then lock it.
    INSERT INTO public.matrimony_credits (id) VALUES (me) ON CONFLICT (id) DO NOTHING;
    SELECT free_interests_used, interest_credits INTO used, credits
        FROM public.matrimony_credits WHERE id = me FOR UPDATE;

    IF used < free_limit THEN
        UPDATE public.matrimony_credits
            SET free_interests_used = free_interests_used + 1, updated_at = NOW()
            WHERE id = me;
    ELSIF credits > 0 THEN
        UPDATE public.matrimony_credits
            SET interest_credits = interest_credits - 1, updated_at = NOW()
            WHERE id = me;
    ELSE
        RETURN 'no_credits';
    END IF;

    INSERT INTO public.matrimony_interests (from_id, to_id) VALUES (me, candidate);

    SELECT EXISTS (
        SELECT 1 FROM public.matrimony_interests
        WHERE from_id = candidate AND to_id = me
    ) INTO is_mutual;

    RETURN CASE WHEN is_mutual THEN 'mutual' ELSE 'sent' END;
END;
$$;

-- Mutual matches, WITH name + contact (only returned when interest is mutual).
CREATE OR REPLACE FUNCTION public.my_matches()
RETURNS TABLE (
    id uuid, full_name text, contact text, age int, height text,
    education text, profession text, about text, expectations text
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    SELECT p.id, p.full_name, p.contact,
           CASE WHEN p.dob IS NOT NULL THEN date_part('year', age(p.dob))::int END AS age,
           p.height, p.education, p.profession, p.about, p.expectations
    FROM public.matrimony_profiles p
    WHERE p.status = 'approved'
      AND EXISTS (SELECT 1 FROM public.matrimony_interests i
                  WHERE i.from_id = auth.uid() AND i.to_id = p.id)
      AND EXISTS (SELECT 1 FROM public.matrimony_interests i
                  WHERE i.from_id = p.id AND i.to_id = auth.uid());
$$;

-- Summary for the header bar: credits, free left, admirers (interested in me,
-- not yet reciprocated), sent count, mutual-match count.
CREATE OR REPLACE FUNCTION public.my_matrimony_summary()
RETURNS TABLE (free_used int, credits int, admirers int, sent int, matches int)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    SELECT
        COALESCE((SELECT free_interests_used FROM public.matrimony_credits WHERE id = auth.uid()), 0),
        COALESCE((SELECT interest_credits   FROM public.matrimony_credits WHERE id = auth.uid()), 0),
        (SELECT count(*) FROM public.matrimony_interests i
            WHERE i.to_id = auth.uid()
              AND NOT EXISTS (SELECT 1 FROM public.matrimony_interests r
                              WHERE r.from_id = auth.uid() AND r.to_id = i.from_id))::int,
        (SELECT count(*) FROM public.matrimony_interests i WHERE i.from_id = auth.uid())::int,
        (SELECT count(*) FROM public.matrimony_interests i
            WHERE i.from_id = auth.uid()
              AND EXISTS (SELECT 1 FROM public.matrimony_interests r
                          WHERE r.from_id = i.to_id AND r.to_id = auth.uid()))::int;
$$;

GRANT EXECUTE ON FUNCTION public.browse_candidates()        TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_interest(uuid)        TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_matches()               TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_matrimony_summary()     TO authenticated;

-- ============================================================
-- Admin review: let the Ghatkaiti admin read every biodata and approve them
-- in-app at /admin/ghatkaiti (reuses profiles.is_admin from 05_word_bank.sql).
-- These ADD to the own-row policies from 04 (RLS policies are OR'd), so members
-- still only see their own row; admins additionally see/curate all.
-- ============================================================
DROP POLICY IF EXISTS "Admins read matrimony" ON public.matrimony_profiles;
CREATE POLICY "Admins read matrimony"
    ON public.matrimony_profiles FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

DROP POLICY IF EXISTS "Admins update matrimony" ON public.matrimony_profiles;
CREATE POLICY "Admins update matrimony"
    ON public.matrimony_profiles FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- ============================================================
-- Phase-1 testing: grant yourself credits by hand (Stripe comes in Phase 2):
--
--   INSERT INTO public.matrimony_credits (id, interest_credits)
--   VALUES ((SELECT id FROM auth.users WHERE email='someone@example.com'), 5)
--   ON CONFLICT (id) DO UPDATE SET interest_credits = EXCLUDED.interest_credits;
-- ============================================================
