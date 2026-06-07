-- ============================================================
-- RLS posture check — run in the Supabase SQL Editor any time.
-- ============================================================
-- What you SHOULD see:
--   • Both tables: rls_enabled = true
--   • profiles:
--       SELECT  -> (auth.uid() IS NOT NULL AND (auth.uid() = id OR listed = true))
--                  i.e. members-only; you see your own row + opted-in rows
--       INSERT/UPDATE -> auth.uid() = id  (own row only)
--   • matrimony_profiles:
--       SELECT/INSERT/UPDATE -> auth.uid() = id  (own row only — no cross-member read)
-- If any of these is missing or wider (e.g. a "USING (true)" SELECT), that's a leak.
-- ============================================================

-- 1. Row-Level Security is enabled on both tables
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('profiles', 'matrimony_profiles');

-- 2. The actual policies
SELECT tablename, policyname, cmd, qual AS using_expr, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('profiles', 'matrimony_profiles')
ORDER BY tablename, cmd, policyname;
