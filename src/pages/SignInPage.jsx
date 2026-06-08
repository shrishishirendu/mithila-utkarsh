import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { AuthShell } from "../components/AuthShell.jsx";

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/profile";
  const prefillEmail = new URLSearchParams(location.search).get("email") || "";

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message || "Could not sign in. Check your email and password.");
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      tirhuta="𑒮𑒰𑒁𑒢 𑒂𑒢"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-semibold" style={{ color: "var(--vermillion)" }}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />

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
          {loading ? "Signing in…" : "Sign in"}
        </button>
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
