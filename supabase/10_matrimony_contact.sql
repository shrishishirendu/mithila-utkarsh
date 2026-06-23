-- ============================================================
-- Mithila Utkarsh — Ghatkaiti contact: separate email/WhatsApp field
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- The phone number (with its country code) stays in `contact`; this adds an
-- optional secondary `contact_email` (email or WhatsApp link), and surfaces it
-- in my_matches() so it's revealed alongside the phone on a mutual match.
-- ============================================================

ALTER TABLE public.matrimony_profiles
    ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- my_matches() now also returns contact_email. (DROP first — the return type changes.)
DROP FUNCTION IF EXISTS public.my_matches();
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
                  WHERE i.from_id = p.id AND i.to_id = auth.uid());
$$;
GRANT EXECUTE ON FUNCTION public.my_matches() TO authenticated;
