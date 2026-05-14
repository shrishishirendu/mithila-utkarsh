import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase.js";

// ============================================================
//  Auth context
//
//  Provides: { user, session, loading, signUp, signIn, signOut }
//  Wraps the entire app in main.jsx via <AuthProvider>.
// ============================================================

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // true until first session check completes

  useEffect(() => {
    // 1. On mount, check if there's an existing session (e.g. user already logged in from before).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    // 2. Subscribe to auth state changes (login, logout, token refresh, etc.).
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    },
    signIn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
