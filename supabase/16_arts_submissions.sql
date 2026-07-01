-- ============================================================
-- Mithila Utkarsh — Arts & Culture community gallery
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- Artists and makers (signed-in members) submit a PHOTO of their work with a
-- short description. Every submission starts as 'pending'. An admin reviews it
-- and approves or rejects it. ONLY approved pieces are publicly readable, so
-- they appear in the Arts & Culture community gallery automatically once approved.
--
-- Unlike the matrimony photos (private, match-gated), gallery images are meant to
-- be SEEN — so they live in a PUBLIC bucket and are served over the CDN. The
-- table row is still gated: a piece only becomes visible after approval.
--
-- Reuses the profiles.is_admin flag (05_word_bank.sql). Mirrors the shape of
-- 06_literature_submissions.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.arts_submissions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,                       -- piece title (roman/English)
    title_devanagari TEXT,                                -- optional Devanagari title
    artist_name      TEXT NOT NULL,                       -- artist name to display
    art_form         TEXT,                                -- an ART_FORMS id (e.g. 'madhubani')
    medium           TEXT,                                -- free text, e.g. 'Acrylic on handmade paper'
    description      TEXT,                                -- the story / note about the piece
    image_path       TEXT NOT NULL,                       -- object path in the 'arts-gallery' bucket ('<uid>/xyz.jpg')
    location         TEXT,                                -- optional place (e.g. 'Madhubani')
    year             TEXT,                                -- optional year made
    contact_email    TEXT,                                -- optional, so the admin can reach out
    status           TEXT NOT NULL DEFAULT 'pending',     -- 'pending' | 'approved' | 'rejected'
    created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.arts_submissions ENABLE ROW LEVEL SECURITY;

-- Any signed-in member may submit their own piece.
DROP POLICY IF EXISTS "Members submit art" ON public.arts_submissions;
CREATE POLICY "Members submit art"
    ON public.arts_submissions FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Anyone (even signed-out visitors) can read APPROVED pieces — powers the gallery.
DROP POLICY IF EXISTS "Anyone reads approved art" ON public.arts_submissions;
CREATE POLICY "Anyone reads approved art"
    ON public.arts_submissions FOR SELECT
    USING (status = 'approved');

-- Artists can always see their own submissions (to check review status).
DROP POLICY IF EXISTS "Artists read own submissions" ON public.arts_submissions;
CREATE POLICY "Artists read own submissions"
    ON public.arts_submissions FOR SELECT
    USING (auth.uid() = created_by);

-- Admins can read everything pending review.
DROP POLICY IF EXISTS "Admins read art submissions" ON public.arts_submissions;
CREATE POLICY "Admins read art submissions"
    ON public.arts_submissions FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- ...and curate them (approve / reject).
DROP POLICY IF EXISTS "Admins update art submissions" ON public.arts_submissions;
CREATE POLICY "Admins update art submissions"
    ON public.arts_submissions FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- Helpful index for the admin review queue (newest first).
CREATE INDEX IF NOT EXISTS arts_submissions_status_created_idx
    ON public.arts_submissions (status, created_at DESC);

-- ------------------------------------------------------------
-- Storage: a PUBLIC bucket for gallery images (5 MB cap, images only).
-- Public read is served by the CDN; writes are still locked to the owner's folder.
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('arts-gallery', 'arts-gallery', true, 5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
    SET public = true,
        file_size_limit = 5242880,
        allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- The first path segment is the owner's user id, so (storage.foldername(name))[1]
-- identifies the owner. Members may write only into their OWN folder.
DROP POLICY IF EXISTS "Arts gallery insert own" ON storage.objects;
CREATE POLICY "Arts gallery insert own"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'arts-gallery'
                AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Arts gallery update own" ON storage.objects;
CREATE POLICY "Arts gallery update own"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'arts-gallery'
           AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Arts gallery delete own" ON storage.objects;
CREATE POLICY "Arts gallery delete own"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'arts-gallery'
           AND (storage.foldername(name))[1] = auth.uid()::text);

-- (No SELECT policy needed: the bucket is public, so images are readable via the
--  public CDN URL. The arts_submissions row RLS is what actually gates visibility.)

-- ============================================================
-- Reminder: make yourself an admin once (if you haven't already):
--
--   UPDATE public.profiles SET is_admin = TRUE
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'you@example.com');
-- ============================================================
