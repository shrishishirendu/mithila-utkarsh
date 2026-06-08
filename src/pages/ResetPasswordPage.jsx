import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { AuthShell } from "../components/AuthShell.jsx";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true); // verifying the recovery link
  const [ready, setReady] = useState(false);       // valid recovery session present
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  // The reset email link lands here with a recovery token in the URL hash.
  // supabase-js parses it automatically (detectSessionInUrl) and either
  // establishes a session or fires a PASSWORD_RECOVERY event.
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) setReady(true);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setChecking(false);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password should be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setLoading(true);
    const { error } = await updatePassword({ password });
    if (error) {
      setLoading(false);
      setError(error.message || "Could not update your password. The link may have expired.");
      return;
    }
    // Sign out of the recovery session so the user logs in fresh with the new password.
    await supabase.auth.signOut();
    setLoading(false);
    setDone(true);
    setTimeout(() => navigate("/signin", { replace: true }), 2500);
  }

  if (done) {
    return (
      <AuthShell
        eyebrow="All set"
        title="Password updated"
        footer={
          <Link to="/signin" className="font-semibold" style={{ color: "var(--vermillion)" }}>
            Go to sign in
          </Link>
        }
      >
        <div className="text-center py-4">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--leaf)" }} />
          <p className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>
            Your password has been changed. Please sign in with your new password — taking you there now…
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Choose a new password"
      title="Reset password"
      footer={
        <Link to="/signin" className="font-semibold" style={{ color: "var(--vermillion)" }}>
          Back to sign in
        </Link>
      }
    >
      {checking ? (
        <div className="text-center py-6 text-sm" style={{ opacity: 0.7 }}>
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
          Verifying your link…
        </div>
      ) : !ready ? (
        <div className="rounded-xl px-4 py-3 text-sm"
             style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>
          This reset link is invalid or has expired.{" "}
          <Link to="/forgot-password" className="font-semibold underline" style={{ color: "var(--vermillion)" }}>
            Request a new one
          </Link>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field icon={Lock} label="New password (8+ characters)" type="password"
                 value={password} onChange={setPassword} autoComplete="new-password" required />
          <Field icon={Lock} label="Confirm new password" type="password"
                 value={confirm} onChange={setConfirm} autoComplete="new-password" required />

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm"
                 style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--paper)" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

function Field({ icon: Icon, label, type, value, onChange, autoComplete, required }) {
  return (
    <label className="block">
      <div className="text-[11px] tracking-[0.18em] uppercase mb-1.5"
           style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>
        {label}
      </div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--vermillion)", opacity: 0.55 }} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm"
          style={{ background: "var(--paper)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" }}
        />
      </div>
    </label>
  );
}
