import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  // This will fail at app startup with a clear message rather than mysteriously
  // breaking later when auth calls don't work.
  throw new Error(
    "Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env (local) or in Vercel's Environment Variables (deployed). See .env.example for the shape."
  );
}

export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // handles magic-link / email-confirmation redirects
  },
});
