-- ============================================================
-- Mithila Utkarsh — Ghatkaiti: growth-phase free allowance
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- "Free to grow" launch: bump the free interest allowance so early members can
-- engage freely while the pool fills. Payments are OFF (PAYMENTS_LIVE=false in
-- the app). TO MONETISE LATER: change free_limit back to 2 here (re-run), set
-- PAYMENTS_LIVE=true, and switch Stripe to live keys.
-- ============================================================

CREATE OR REPLACE FUNCTION public.send_interest(candidate uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
    me uuid := auth.uid();
    free_limit CONSTANT int := 25;   -- growth phase (was 2); lower to monetise
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
GRANT EXECUTE ON FUNCTION public.send_interest(uuid) TO authenticated;
