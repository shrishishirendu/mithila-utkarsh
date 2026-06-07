-- ============================================================
-- Mithila Utkarsh — Phase 1B follow-up: District + Village
-- ============================================================
-- Paste into the Supabase SQL Editor and click "Run".
-- Safe to re-run.
--
-- Splits the single "native place" field into optional District + Village.
-- "Mool" (मूल) is a matrimony-specific lineage concept (collected later in the
-- matrimony module, with Gotra etc.) — NOT a geographic field for the general
-- directory, so native_place (which used a "मूल / village" framing) is removed.
-- ============================================================

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS district TEXT,
    ADD COLUMN IF NOT EXISTS village  TEXT;

ALTER TABLE public.profiles
    DROP COLUMN IF EXISTS native_place;
