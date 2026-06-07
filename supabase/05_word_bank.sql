-- ============================================================
-- Mithila Utkarsh — AI word bank (capture AI translations for review)
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- Every AI translation is captured here (deduped by the English source) as an
-- UNVERIFIED suggestion. Admins review and promote good ones to the real
-- dictionary. Members can contribute (insert); only admins can read/curate.
-- ============================================================

-- 1. Admin flag on profiles (used by the word-bank policies + the admin page)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. The word bank
CREATE TABLE IF NOT EXISTS public.ai_word_bank (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_en   TEXT NOT NULL UNIQUE,   -- normalized English (lowercased) — the dedup key
    devanagari  TEXT,
    iast        TEXT,
    confidence  TEXT,
    status      TEXT NOT NULL DEFAULT 'suggested',   -- 'suggested' | 'verified' | 'rejected'
    created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_word_bank ENABLE ROW LEVEL SECURITY;

-- Any signed-in member may add a suggestion (their own translation).
DROP POLICY IF EXISTS "Members add suggestions" ON public.ai_word_bank;
CREATE POLICY "Members add suggestions"
    ON public.ai_word_bank FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Only admins can read the bank...
DROP POLICY IF EXISTS "Admins read word bank" ON public.ai_word_bank;
CREATE POLICY "Admins read word bank"
    ON public.ai_word_bank FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- ...and curate it (mark verified / rejected).
DROP POLICY IF EXISTS "Admins update word bank" ON public.ai_word_bank;
CREATE POLICY "Admins update word bank"
    ON public.ai_word_bank FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- ============================================================
-- 3. Make YOURSELF an admin (run once — replace the email):
--
--   UPDATE public.profiles SET is_admin = TRUE
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'you@example.com');
--
-- ============================================================
