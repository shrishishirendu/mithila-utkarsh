-- ============================================================
-- Mithila Utkarsh — Phase 1B: Member Directory
-- ============================================================
-- Paste this into the Supabase SQL Editor and click "Run".
-- Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- ============================================================

-- ---------- 1. New directory columns ----------
-- listed       : opt-in — a profile appears in the directory ONLY when TRUE.
-- native_place : ancestral place in Mithila (मूल / village / town).
-- profession   : what they do (optional).

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS listed       BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS native_place TEXT,
    ADD COLUMN IF NOT EXISTS profession   TEXT;


-- ---------- 2. Tighten read access to MEMBERS-ONLY ----------
-- Until now every profile was world-readable. Replace that with:
--   - a signed-in user can read their OWN row, AND
--   - any row that has opted in (listed = TRUE).
--   - unauthenticated visitors can read nothing.
-- (Insert/update policies are unchanged: a user only writes their own row.)

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Members can view listed profiles" ON public.profiles;
CREATE POLICY "Members can view listed profiles"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL
        AND (auth.uid() = id OR listed = TRUE)
    );

-- ============================================================
-- Done. profiles now has listed / native_place / profession,
-- and the directory is readable only by signed-in members.
-- ============================================================
