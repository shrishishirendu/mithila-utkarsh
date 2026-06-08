import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { AuthShell } from "../components/AuthShell.jsx";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const location = useLocation();
  const prefillEmail = new URLSearchParams(location.search).get("email") || "";

  const [email, setEmail] = useState(prefillEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await requestPasswordReset({ email });
    setLoading(false);
    if (error) {
      setError(error.message || "Could not send the reset link. Please try again.");
      return;
    }
    // Supabase returns success even if the email isn't registered (anti-enumeration),
    // so we always show the same neutral confirmation.
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        eyebrow="Reset link sent"
        title="Check your email"
        footer={
          <Link to="/signin" className="font-semibold" style={{ color: "var(--vermillion)" }}>
            Back to sign in
          </Link>
        }
      >
        <div className="text-center py-4">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--leaf)" }} />
          <p className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>
            If <span className="font-semibold">{email}</span> is registered, a password-reset
            link is on its way. Click it to choose a new password.
          </p>
          <p className="text-xs leading-relaxed mt-4" style={{ opacity: 0.6 }}>
            From <span className="font-semibold">Mithila Utkarsh</span> — if it isn't in your inbox, check spam/junk.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Forgot your password?"
      title="Reset password"
      footer={
        <>
          Remembered it?{" "}
          <Link to="/signin" className="font-semibold" style={{ color: "var(--vermillion)" }}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />

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
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <p className="text-xs leading-relaxed pt-2" style={{ opacity: 0.55 }}>
          We'll email you a secure link to set a new password.
        </p>
      </form>
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
