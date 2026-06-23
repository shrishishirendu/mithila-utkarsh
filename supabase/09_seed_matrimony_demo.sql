-- ============================================================
-- Mithila Utkarsh — DEMO matrimony profiles (4 male + 4 female)
-- ============================================================
-- TEST DATA ONLY. Run in the Supabase SQL Editor. Safe to re-run (idempotent).
--
-- Creates 8 demo auth users + approved biodatas so Browse/Matches has content.
-- All 8 have DIFFERENT Mool + Gotra, so every male<->female pair is compatible.
-- Photos can't be seeded from SQL (they're binary in Storage) — demos have none;
-- that's fine, since photos only ever show after a mutual match.
--
-- Emails all end in "@demo.mithila" so cleanup is a one-liner (see bottom).
-- These users have NO password (they can't sign in) — they exist only to appear
-- in the pool. Remove before real launch.
--
-- If the auth.users INSERT errors on your Supabase/GoTrue version, use the
-- FALLBACK at the bottom: create the 8 users in the Dashboard, then re-run —
-- the biodata part keys off email, so it just works either way.
-- ============================================================

DO $$
DECLARE
    rec record;
    uid uuid;
BEGIN
    FOR rec IN
        SELECT * FROM (VALUES
            -- email,                gender,  looking_for, full_name,          dob,          height, mool,        gotra,       caste,            education,        profession,                    birth_place, about,                                              expectations,                                   contact
            ('m1@demo.mithila','male',  'bride','Aditya Jha',       '1995-03-12','5''9"', 'Khandbala','Shandilya','Maithil Brahmin','B.Tech (IIT)',    'Software Engineer, Bengaluru','Darbhanga', 'Engineer who loves Maithili poetry and cricket.',  'A kind, family-oriented partner.',             '+61 400 000 001 (demo)'),
            ('m2@demo.mithila','male',  'bride','Saurav Mishra',    '1993-08-05','5''11"','Sarisab',  'Vatsa',    'Maithil Brahmin','MBA',             'Banker, Mumbai',              'Madhubani', 'Banker, foodie and weekend trekker.',              'Someone caring and independent.',              '+61 400 000 002 (demo)'),
            ('m3@demo.mithila','male',  'bride','Nikhil Thakur',    '1997-11-20','5''8"', 'Karmaha',  'Kashyap',  'Maithil Brahmin','M.Sc Physics',    'Researcher, Sydney',          'Samastipur','Researcher abroad, rooted in Mithila.',            'A partner who values tradition and ambition.', '+61 400 000 003 (demo)'),
            ('m4@demo.mithila','male',  'bride','Raghav Choudhary', '1996-06-30','6''0"', 'Belauncha','Bharadwaj','Maithil Brahmin','MBBS',            'Doctor, Patna',               'Patna',     'Doctor who enjoys classical music.',               'A compassionate, grounded life partner.',      '+61 400 000 004 (demo)'),
            ('f1@demo.mithila','female','groom','Anjali Jha',       '1998-04-18','5''4"', 'Marada',   'Parashar', 'Maithil Brahmin','M.A. English',    'Teacher, Delhi',              'Darbhanga', 'Teacher and reader; loves Mithila painting.',      'A respectful, understanding partner.',         '+61 400 000 005 (demo)'),
            ('f2@demo.mithila','female','groom','Priya Mishra',     '1996-09-09','5''3"', 'Pali',     'Kaushik',  'Maithil Brahmin','CA',              'Chartered Accountant, Pune',  'Madhubani', 'A planner and classical dancer.',                  'Someone supportive and warm.',                 '+61 400 000 006 (demo)'),
            ('f3@demo.mithila','female','groom','Sneha Thakur',     '1999-12-02','5''6"', 'Ekma',     'Gautam',   'Maithil Brahmin','M.Tech',          'Data Scientist, Sydney',      'Samastipur','Data scientist, AI enthusiast and painter.',       'A partner who shares curiosity and respect.',  '+61 400 000 007 (demo)'),
            ('f4@demo.mithila','female','groom','Riya Choudhary',   '1997-07-25','5''5"', 'Ghosaut',  'Vashishtha','Maithil Brahmin','B.Des',          'Designer, Bengaluru',         'Patna',     'Designer who loves travel and food.',              'Kind, ambitious and family-loving.',           '+61 400 000 008 (demo)')
        ) AS t(email, gender, looking_for, full_name, dob, height, mool, gotra, caste, education, profession, birth_place, about, expectations, contact)
    LOOP
        -- Create the backing auth user if it doesn't exist (no password = no login).
        SELECT id INTO uid FROM auth.users WHERE email = rec.email;
        IF uid IS NULL THEN
            uid := gen_random_uuid();
            INSERT INTO auth.users (
                instance_id, id, aud, role, email,
                encrypted_password, email_confirmed_at, created_at, updated_at,
                raw_app_meta_data, raw_user_meta_data,
                confirmation_token, recovery_token, email_change_token_new, email_change
            ) VALUES (
                '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', rec.email,
                NULL, now(), now(), now(),
                '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
                '', '', '', ''
            );
        END IF;

        -- Upsert the (approved) biodata.
        INSERT INTO public.matrimony_profiles (
            id, full_name, contact, gender, looking_for, dob, height,
            mool, gotra, caste, education, profession, birth_place,
            about, expectations, status, updated_at
        ) VALUES (
            uid, rec.full_name, rec.contact, rec.gender, rec.looking_for, rec.dob::date, rec.height,
            rec.mool, rec.gotra, rec.caste, rec.education, rec.profession, rec.birth_place,
            rec.about, rec.expectations, 'approved', now()
        )
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name, contact = EXCLUDED.contact, gender = EXCLUDED.gender,
            looking_for = EXCLUDED.looking_for, dob = EXCLUDED.dob, height = EXCLUDED.height,
            mool = EXCLUDED.mool, gotra = EXCLUDED.gotra, caste = EXCLUDED.caste,
            education = EXCLUDED.education, profession = EXCLUDED.profession, birth_place = EXCLUDED.birth_place,
            about = EXCLUDED.about, expectations = EXCLUDED.expectations, status = 'approved', updated_at = now();
    END LOOP;
END $$;

-- ============================================================
-- OPTIONAL — instant matches for demoing the Matches tab.
-- Makes all 4 female demos "interested" in YOU, so the moment you (a male
-- profile) mark interest back, it becomes a mutual match. Replace the email.
--
--   INSERT INTO public.matrimony_interests (from_id, to_id)
--   SELECT f.id, (SELECT id FROM auth.users WHERE email = 'shri.shishirendu@gmail.com')
--   FROM auth.users f WHERE f.email IN ('f1@demo.mithila','f2@demo.mithila','f3@demo.mithila','f4@demo.mithila')
--   ON CONFLICT (from_id, to_id) DO NOTHING;
-- ============================================================

-- ============================================================
-- CLEANUP (run before real launch) — removes all demo users; the biodatas
-- and interests cascade away automatically:
--
--   DELETE FROM auth.users WHERE email LIKE '%@demo.mithila';
-- ============================================================

-- ============================================================
-- FALLBACK if the auth.users INSERT above errors on your version:
-- 1) Dashboard → Authentication → Users → "Add user" → create each email
--    (m1@demo.mithila … f4@demo.mithila), tick "Auto Confirm User".
-- 2) Re-run this whole file — the auth.users INSERT is skipped (they now exist)
--    and the biodata upsert fills them in by email.
-- ============================================================
