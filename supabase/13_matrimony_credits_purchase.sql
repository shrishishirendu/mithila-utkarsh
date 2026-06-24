-- ============================================================
-- Mithila Utkarsh — Ghatkaiti: credit purchases (Stripe)
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- The Stripe webhook calls grant_credits() with the service role. It is
-- idempotent (keyed on the Stripe checkout session id) so a retried webhook
-- never double-credits, and it is callable ONLY by the service role — a member
-- can never grant themselves credits.
-- ============================================================

-- Purchase log (also the idempotency guard).
CREATE TABLE IF NOT EXISTS public.matrimony_purchases (
    id          TEXT PRIMARY KEY,           -- Stripe checkout session id
    user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    credits     INT,
    amount      INT,                         -- smallest currency unit (cents)
    currency    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.matrimony_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Own purchases select" ON public.matrimony_purchases;
CREATE POLICY "Own purchases select" ON public.matrimony_purchases
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins read purchases" ON public.matrimony_purchases;
CREATE POLICY "Admins read purchases" ON public.matrimony_purchases
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));
-- No insert/update policy: only the service role (webhook) writes, via grant_credits().

-- Idempotent credit grant. Returns true if it granted, false if the session was
-- already processed (a duplicate webhook).
CREATE OR REPLACE FUNCTION public.grant_credits(
    session_id text, target uuid, n int, amt int, cur text
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE rc int;
BEGIN
    IF target IS NULL OR n IS NULL OR n <= 0 THEN RETURN false; END IF;

    INSERT INTO public.matrimony_purchases (id, user_id, credits, amount, currency)
    VALUES (session_id, target, n, amt, cur)
    ON CONFLICT (id) DO NOTHING;
    GET DIAGNOSTICS rc = ROW_COUNT;
    IF rc = 0 THEN
        RETURN false;  -- already processed
    END IF;

    INSERT INTO public.matrimony_credits (id, interest_credits)
    VALUES (target, n)
    ON CONFLICT (id) DO UPDATE
        SET interest_credits = public.matrimony_credits.interest_credits + n,
            updated_at = now();
    RETURN true;
END;
$$;

-- Only the service role (the webhook) may grant credits.
REVOKE EXECUTE ON FUNCTION public.grant_credits(text, uuid, int, int, text) FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.grant_credits(text, uuid, int, int, text) TO service_role;
