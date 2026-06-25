-- ============================================================
-- Mithila Utkarsh — Ghatkaiti: "profile for" + current location
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- - profile_for: who the biodata is for (self / son / daughter / …) — parents and
--   relatives commonly create Maithil matrimony profiles.
-- - country / city: where the person currently lives (key for a diaspora pool).
-- Browse cards gain `country`; Matches gain country/city/profile_for.
-- ============================================================

ALTER TABLE public.matrimony_profiles
    ADD COLUMN IF NOT EXISTS profile_for TEXT,
    ADD COLUMN IF NOT EXISTS country     TEXT,
    ADD COLUMN IF NOT EXISTS city        TEXT;

-- Browse: add country to the anonymous card (not identifying).
DROP FUNCTION IF EXISTS public.browse_candidates();
CREATE OR REPLACE FUNCTION public.browse_candidates()
RETURNS TABLE (
    id uuid, age int, height text, education text,
    profession text, about text, expectations text, country text
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    WITH me AS (SELECT * FROM public.matrimony_profiles WHERE id = auth.uid())
    SELECT p.id,
           CASE WHEN p.dob IS NOT NULL THEN date_part('year', age(p.dob))::int END AS age,
           p.height, p.education, p.profession, p.about, p.expectations, p.country
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
GRANT EXECUTE ON FUNCTION public.browse_candidates() TO authenticated;

-- Matches: add country, city, profile_for.
DROP FUNCTION IF EXISTS public.my_matches();
CREATE OR REPLACE FUNCTION public.my_matches()
RETURNS TABLE (
    id uuid, full_name text, contact text, contact_email text, age int, height text,
    education text, profession text, about text, expectations text, photos text[],
    country text, city text, profile_for text
)
LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp AS $$
    SELECT p.id, p.full_name, p.contact, p.contact_email,
           CASE WHEN p.dob IS NOT NULL THEN date_part('year', age(p.dob))::int END AS age,
           p.height, p.education, p.profession, p.about, p.expectations, p.photos,
           p.country, p.city, p.profile_for
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
GRANT EXECUTE ON FUNCTION public.my_matches() TO authenticated;
