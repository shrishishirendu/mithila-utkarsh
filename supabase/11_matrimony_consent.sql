-- ============================================================
-- Mithila Utkarsh — Ghatkaiti: record age/consent confirmation
-- ============================================================
-- Paste into the Supabase SQL Editor and Run. Safe to re-run.
--
-- Stores WHEN a member confirmed they are 18+ and consented to their biodata
-- being shown to matches. Set on "Submit for review" (after the checkbox).
-- ============================================================

ALTER TABLE public.matrimony_profiles
    ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ;
