-- ============================================================
-- Mithila Utkarsh — Ghatkaiti photos (private, revealed only on a match)
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- Photos live in a PRIVATE storage bucket. A photo can be read ONLY by:
--   - its owner,
--   - an admin (for review),
--   - someone who is MUTUALLY matched with the owner.
-- Browsing stays anonymous (browse_candidates never returns photos), so a face
-- is never exposed before both sides have marked interest.
-- ============================================================

-- 1. Store the photo object paths on the biodata (e.g. '<uid>/abc.jpg').
ALTER TABLE public.matrimony_profiles
    ADD COLUMN IF NOT EXISTS photos TEXT[] NOT NULL DEFAULT '{}';

-- 2. Private bucket (5 MB cap, images only).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('matrimony-photos', 'matrimony-photos', false, 5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 3. Mutual-match check as SECURITY DEFINER, so the storage policy can use it
--    WITHOUT exposing the (private) matrimony_interests table to members.
CREATE OR REPLACE FUNCTION public.is_matched(other uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp STABLE AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.matrimony_interests a
        JOIN public.matrimony_interests b
          ON a.to_id = b.from_id AND a.from_id = b.to_id
        WHERE a.from_id = auth.uid() AND a.to_id = other
    );
$$;
GRANT EXECUTE ON FUNCTION public.is_matched(uuid) TO authenticated;

-- 4. Storage policies (on storage.objects). The first path segment is the
--    owner's user id, so (storage.foldername(name))[1] identifies the owner.

-- Upload only into your OWN folder.
DROP POLICY IF EXISTS "Matrimony photo insert own" ON storage.objects;
CREATE POLICY "Matrimony photo insert own"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'matrimony-photos'
                AND (storage.foldername(name))[1] = auth.uid()::text);

-- Replace/delete only your own.
DROP POLICY IF EXISTS "Matrimony photo update own" ON storage.objects;
CREATE POLICY "Matrimony photo update own"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'matrimony-photos'
           AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Matrimony photo delete own" ON storage.objects;
CREATE POLICY "Matrimony photo delete own"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'matrimony-photos'
           AND (storage.foldername(name))[1] = auth.uid()::text);

-- Read: own OR admin OR mutually matched. (Minting a signed URL needs this,
-- so a non-matched member simply cannot load another member's photo.)
DROP POLICY IF EXISTS "Matrimony photo read gated" ON storage.objects;
CREATE POLICY "Matrimony photo read gated"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'matrimony-photos' AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin)
            OR public.is_matched(((storage.foldername(name))[1])::uuid)
        )
    );

-- 5. my_matches() now also returns the matched person's photo paths.
--    (DROP first — adding a column changes the function's return type.)
DROP FUNCTION IF EXISTS public.my_matches();
CREATE OR REPLACE FUNCTION public.my_matches()
RETURNS TABLE (
    id uuid, full_name text, contact text, age int, height text,
    education text, profession text, about text, expectations text, photos text[]
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    SELECT p.id, p.full_name, p.contact,
           CASE WHEN p.dob IS NOT NULL THEN date_part('year', age(p.dob))::int END AS age,
           p.height, p.education, p.profession, p.about, p.expectations, p.photos
    FROM public.matrimony_profiles p
    WHERE p.status = 'approved'
      AND EXISTS (SELECT 1 FROM public.matrimony_interests i
                  WHERE i.from_id = auth.uid() AND i.to_id = p.id)
      AND EXISTS (SELECT 1 FROM public.matrimony_interests i
                  WHERE i.from_id = p.id AND i.to_id = auth.uid());
$$;
GRANT EXECUTE ON FUNCTION public.my_matches() TO authenticated;
