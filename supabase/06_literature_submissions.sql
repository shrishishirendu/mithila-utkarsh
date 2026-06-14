-- ============================================================
-- Mithila Utkarsh — Literature submissions (community contributions)
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- Poets and authors (signed-in members) submit their own Maithili work with a
-- short introduction. Every submission starts as 'pending'. An admin reviews it
-- and approves or rejects it. ONLY approved works are publicly readable, so
-- they appear on the Literature page automatically once approved.
--
-- Reuses the profiles.is_admin flag added in 05_word_bank.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.literature_submissions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,                       -- work title (roman/English)
    title_devanagari TEXT,                                -- optional Devanagari title
    author_name      TEXT NOT NULL,                       -- poet/author name to display
    era              TEXT,                                -- an ERAS id (usually 'contemporary')
    form             TEXT,                                -- 'pada'|'poem'|'song'|'couplet'|'prose'
    body_devanagari  TEXT NOT NULL,                       -- the work, in Devanagari
    transliteration  TEXT,                                -- optional Roman transliteration
    translation      TEXT,                                -- optional English translation
    intro            TEXT,                                -- short note about the poet / the work
    contact_email    TEXT,                                -- optional, so the admin can reach out
    status           TEXT NOT NULL DEFAULT 'pending',     -- 'pending' | 'approved' | 'rejected'
    created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.literature_submissions ENABLE ROW LEVEL SECURITY;

-- Any signed-in member may submit their own work.
DROP POLICY IF EXISTS "Members submit work" ON public.literature_submissions;
CREATE POLICY "Members submit work"
    ON public.literature_submissions FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Anyone (even signed-out visitors) can read APPROVED works — this is what
-- powers the public Literature page.
DROP POLICY IF EXISTS "Anyone reads approved work" ON public.literature_submissions;
CREATE POLICY "Anyone reads approved work"
    ON public.literature_submissions FOR SELECT
    USING (status = 'approved');

-- Authors can always see their own submissions (to check the review status).
DROP POLICY IF EXISTS "Authors read own submissions" ON public.literature_submissions;
CREATE POLICY "Authors read own submissions"
    ON public.literature_submissions FOR SELECT
    USING (auth.uid() = created_by);

-- Admins can read everything pending review.
DROP POLICY IF EXISTS "Admins read submissions" ON public.literature_submissions;
CREATE POLICY "Admins read submissions"
    ON public.literature_submissions FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- ...and curate them (approve / reject).
DROP POLICY IF EXISTS "Admins update submissions" ON public.literature_submissions;
CREATE POLICY "Admins update submissions"
    ON public.literature_submissions FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- Helpful index for the admin review queue (newest first).
CREATE INDEX IF NOT EXISTS literature_submissions_status_created_idx
    ON public.literature_submissions (status, created_at DESC);

-- ============================================================
-- Reminder: make yourself an admin once (if you haven't from 05_word_bank.sql):
--
--   UPDATE public.profiles SET is_admin = TRUE
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'you@example.com');
-- ============================================================
