-- ============================================================
-- Mithila Utkarsh — Ghatkaiti: withdraw (pause/delete) + safety (block/report)
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- - paused: a member can hide themselves from the pool without deleting.
-- - delete_my_biodata(): wipe my profile + interests + credits + blocks.
-- - matrimony_blocks: either side blocked => never shown to each other, and any
--   photo access is revoked (browse, matches and is_matched all honour it).
-- - matrimony_reports: a member flags another for the admin to review.
-- ============================================================

-- 1. Pause flag -----------------------------------------------------------------
ALTER TABLE public.matrimony_profiles
    ADD COLUMN IF NOT EXISTS paused BOOLEAN NOT NULL DEFAULT false;

-- 2. Blocks ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matrimony_blocks (
    blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);
ALTER TABLE public.matrimony_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Own blocks insert" ON public.matrimony_blocks;
CREATE POLICY "Own blocks insert" ON public.matrimony_blocks
    FOR INSERT WITH CHECK (auth.uid() = blocker_id);
DROP POLICY IF EXISTS "Own blocks select" ON public.matrimony_blocks;
CREATE POLICY "Own blocks select" ON public.matrimony_blocks
    FOR SELECT USING (auth.uid() = blocker_id);
DROP POLICY IF EXISTS "Own blocks delete" ON public.matrimony_blocks;
CREATE POLICY "Own blocks delete" ON public.matrimony_blocks
    FOR DELETE USING (auth.uid() = blocker_id);

-- 3. Reports --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matrimony_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reported_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason      TEXT,
    status      TEXT NOT NULL DEFAULT 'open',   -- 'open' | 'reviewed'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.matrimony_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members file reports" ON public.matrimony_reports;
CREATE POLICY "Members file reports" ON public.matrimony_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);
DROP POLICY IF EXISTS "Admins read reports" ON public.matrimony_reports;
CREATE POLICY "Admins read reports" ON public.matrimony_reports
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));
DROP POLICY IF EXISTS "Admins update reports" ON public.matrimony_reports;
CREATE POLICY "Admins update reports" ON public.matrimony_reports
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- 4. Delete my biodata (and everything tied to it) ------------------------------
-- Photos in Storage are removed client-side first (own-folder delete policy);
-- this clears the DB rows. Reports ABOUT the member are kept for the record.
CREATE OR REPLACE FUNCTION public.delete_my_biodata()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE me uuid := auth.uid();
BEGIN
    IF me IS NULL THEN RETURN; END IF;
    DELETE FROM public.matrimony_interests WHERE from_id = me OR to_id = me;
    DELETE FROM public.matrimony_blocks    WHERE blocker_id = me OR blocked_id = me;
    DELETE FROM public.matrimony_credits   WHERE id = me;
    DELETE FROM public.matrimony_profiles  WHERE id = me;
END;
$$;
GRANT EXECUTE ON FUNCTION public.delete_my_biodata() TO authenticated;

-- 5. Re-create the read functions so they honour paused + blocks ----------------

-- Browse: skip paused (mine or theirs) and anyone blocked in either direction.
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
      AND me.paused = false
      AND p.paused = false
      AND p.id <> me.id
      AND ( (me.looking_for = 'groom' AND p.gender = 'male')
         OR (me.looking_for = 'bride' AND p.gender = 'female') )
      AND ( (p.looking_for = 'groom' AND me.gender = 'male')
         OR (p.looking_for = 'bride' AND me.gender = 'female') )
      AND (me.gotra IS NULL OR p.gotra IS NULL OR lower(trim(p.gotra)) <> lower(trim(me.gotra)))
      AND (me.mool  IS NULL OR p.mool  IS NULL OR lower(trim(p.mool))  <> lower(trim(me.mool)))
      AND NOT EXISTS (SELECT 1 FROM public.matrimony_interests i
                      WHERE i.from_id = me.id AND i.to_id = p.id)
      AND NOT EXISTS (SELECT 1 FROM public.matrimony_blocks b
                      WHERE (b.blocker_id = me.id AND b.blocked_id = p.id)
                         OR (b.blocker_id = p.id AND b.blocked_id = me.id))
    ORDER BY age NULLS LAST;
$$;

-- Matches: hide any pair where either side has blocked the other.
CREATE OR REPLACE FUNCTION public.my_matches()
RETURNS TABLE (
    id uuid, full_name text, contact text, contact_email text, age int, height text,
    education text, profession text, about text, expectations text, photos text[]
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    SELECT p.id, p.full_name, p.contact, p.contact_email,
           CASE WHEN p.dob IS NOT NULL THEN date_part('year', age(p.dob))::int END AS age,
           p.height, p.education, p.profession, p.about, p.expectations, p.photos
    FROM public.matrimony_profiles p
    WHERE p.status = 'approved'
      AND EXISTS (SELECT 1 FROM public.matrimony_interests i
                  WHERE i.from_id = auth.uid() AND i.to_id = p.id)
      AND EXISTS (SELECT 1 FROM public.matrimony_interests i
                  WHERE i.from_id = p.id AND i.to_id = auth.uid())
      AND NOT EXISTS (SELECT 1 FROM public.matrimony_blocks b
                      WHERE (b.blocker_id = auth.uid() AND b.blocked_id = p.id)
                         OR (b.blocker_id = p.id AND b.blocked_id = auth.uid()));
$$;

-- Photo access: matched AND not blocked either way.
CREATE OR REPLACE FUNCTION public.is_matched(other uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.matrimony_interests a
        JOIN public.matrimony_interests b ON a.to_id = b.from_id AND a.from_id = b.to_id
        WHERE a.from_id = auth.uid() AND a.to_id = other
    )
    AND NOT EXISTS (
        SELECT 1 FROM public.matrimony_blocks bl
        WHERE (bl.blocker_id = auth.uid() AND bl.blocked_id = other)
           OR (bl.blocker_id = other AND bl.blocked_id = auth.uid())
    );
$$;
