import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { AuthShell } from "../components/AuthShell.jsx";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password should be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { data, error } = await signUp({ email, password });
    setLoading(false);

    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("already registered") || m.includes("already exists") || error.status === 422) {
        setError("__already__");
      } else if (m.includes("rate limit") || m.includes("too many")) {
        setError("Too many emails were just sent. Please wait a minute or two, then try again.");
      } else {
        setError(error.message || "Could not create account.");
      }
      return;
    }

    // With email confirmation + enumeration protection ON (Supabase default),
    // signing up with an existing email returns NO error and an empty
    // `identities` array. Catch that and point the user at sign-in instead of
    // falsely telling them to "check your email".
    const identities = data?.user?.identities;
    if (Array.isArray(identities) && identities.length === 0) {
      setError("__already__");
      return;
    }

    // If confirmation is disabled, a session comes back and the user is signed in.
    if (data?.session) {
      navigate("/profile", { replace: true });
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <AuthShell
        eyebrow="Almost there"
        title="Check your email"
        footer={
          <>
            Already verified?{" "}
            <Link to="/signin" className="font-semibold" style={{ color: "var(--vermillion)" }}>
              Sign in
            </Link>
          </>
        }
      >
        <div className="text-center py-4">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--leaf)" }} />
          <p className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>
            We sent a confirmation link to <span className="font-semibold">{email}</span>. Click the link in the email to verify your account, then come back here to sign in.
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
      eyebrow="Join the community"
      title="Create your account"
      tirhuta="𑒮𑒠𑒮𑓂𑒨 𑒥𑒢𑒴"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold" style={{ color: "var(--vermillion)" }}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <Field icon={Lock} label="Password (8+ characters)" type="password" value={password} onChange={setPassword} autoComplete="new-password" required />

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm"
               style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>
            {error === "__already__" ? (
              <>
                This email is already registered.{" "}
                <Link to={`/signin?email=${encodeURIComponent(email)}`} className="font-semibold underline"
                      style={{ color: "var(--vermillion)" }}>
                  Sign in instead
                </Link>.
              </>
            ) : (
              error
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-xs leading-relaxed pt-2" style={{ opacity: 0.55 }}>
          By creating an account you agree to be a respectful member of the Mithila Utkarsh community. We'll send you a confirmation email; no marketing.
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
