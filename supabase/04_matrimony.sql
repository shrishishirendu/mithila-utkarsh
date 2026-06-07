-- ============================================================
-- Mithila Utkarsh — Phase 1C: Ghatkaiti (Matrimony) biodata
-- ============================================================
-- Paste into the Supabase SQL Editor and click "Run". Safe to re-run.
--
-- Admin-mediated (Ghatak) model: each member sees/edits ONLY their own biodata.
-- Members do NOT browse each other. The admin reviews submitted biodatas via the
-- Supabase dashboard (service role bypasses RLS) and makes introductions.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.matrimony_profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    gender        TEXT,             -- 'male' | 'female' | 'other'
    looking_for   TEXT,             -- 'bride' | 'groom'
    dob           DATE,
    birth_time    TEXT,             -- optional, for kundli
    birth_place   TEXT,             -- optional, for kundli
    height        TEXT,             -- free text, e.g. 5'6"
    mool          TEXT,             -- मूल — Maithil lineage (Panji)
    gotra         TEXT,             -- गोत्र
    caste         TEXT,             -- OPTIONAL, self-declared (Plan v3 §8)
    education     TEXT,
    profession    TEXT,
    family        TEXT,             -- optional: family background / parents
    about         TEXT,             -- about themselves
    expectations  TEXT,             -- partner expectations
    status        TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'submitted' | 'approved'
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.matrimony_profiles ENABLE ROW LEVEL SECURITY;

-- Own-row-only: members read/write only their own biodata. No cross-member SELECT.
DROP POLICY IF EXISTS "Own matrimony profile select" ON public.matrimony_profiles;
CREATE POLICY "Own matrimony profile select"
    ON public.matrimony_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Own matrimony profile insert" ON public.matrimony_profiles;
CREATE POLICY "Own matrimony profile insert"
    ON public.matrimony_profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Own matrimony profile update" ON public.matrimony_profiles;
CREATE POLICY "Own matrimony profile update"
    ON public.matrimony_profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- Review submitted biodatas in: Table Editor → matrimony_profiles
-- (filter status = 'submitted'). To approve, set status = 'approved'.
-- ============================================================
