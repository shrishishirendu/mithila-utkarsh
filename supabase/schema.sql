-- ============================================================
-- Mithila Utkarsh — Phase 1A schema
-- ============================================================
-- Paste this into Supabase SQL Editor and click "Run".
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

-- ---------- 1. profiles table ----------
-- One row per user, with display info.
-- `id` matches the auth user's id, so we always know who owns which row.

CREATE TABLE IF NOT EXISTS public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name    TEXT,
    city            TEXT,
    bio             TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ---------- 2. Row Level Security (RLS) ----------
-- Without RLS, anyone with the publishable key could read or write any profile.
-- With RLS, the database itself enforces who can do what.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone (signed in or not) can READ profile rows.
-- We may tighten this later (e.g., only signed-in users can browse members).
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

-- A user can INSERT only their own profile row.
DROP POLICY IF EXISTS "Users insert their own profile" ON public.profiles;
CREATE POLICY "Users insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- A user can UPDATE only their own profile row.
DROP POLICY IF EXISTS "Users update their own profile" ON public.profiles;
CREATE POLICY "Users update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);


-- ---------- 3. Auto-create profile row on signup ----------
-- When a new auth user is created, automatically create their profile row.
-- This avoids the "user exists but has no profile" edge case.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id) VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- Done. You should see:
--   public.profiles            (in Table Editor)
--   3 policies on public.profiles
--   1 trigger on auth.users    (in Database → Triggers)
-- ============================================================
