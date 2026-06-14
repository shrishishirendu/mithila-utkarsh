import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Send, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { ERAS, FORM_LABELS } from "../data/literature.js";

export default function LiteratureContributePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    title_devanagari: "",
    author_name: "",
    era: "contemporary",
    form: "poem",
    body_devanagari: "",
    transliteration: "",
    translation: "",
    intro: "",
    contact_email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.author_name.trim() || !form.body_devanagari.trim()) {
      setError("Please fill in the title, author name, and the work itself (in Devanagari).");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("literature_submissions").insert({
      title: form.title.trim(),
      title_devanagari: form.title_devanagari.trim() || null,
      author_name: form.author_name.trim(),
      era: form.era,
      form: form.form,
      body_devanagari: form.body_devanagari,
      transliteration: form.transliteration.trim() || null,
      translation: form.translation.trim() || null,
      intro: form.intro.trim() || null,
      contact_email: form.contact_email.trim() || user.email || null,
      created_by: user.id,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message || "Could not submit. Please try again.");
      return;
    }
    setDone(true);
  }

  // ----- Gates -----
  if (authLoading) {
    return (
      <div className="font-body min-h-screen py-24 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
        <PageHero
          eyebrow="Contribute · रचना"
          title="Share your work"
          devanagari="अपन रचना दिअ"
          description="Maithili belongs to everyone who writes it. Sign in to submit your poem or prose — an editor will review it before it appears in the library."
        />
        <section className="px-6 lg:px-10 max-w-md mx-auto">
          <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
            <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
                 style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-sm mt-4" style={{ opacity: 0.75 }}>
              Please sign in to submit your work — it lets us credit you and follow up if needed.
            </p>
            <div className="mt-5 flex gap-2 justify-center">
              <Link to="/signin" state={{ from: "/literature/contribute" }}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}>
                Sign in
              </Link>
              <Link to="/signup"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold border"
                    style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
                Sign up
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (done) {
    return (
      <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
        <PageHero eyebrow="Contribute · रचना" title="Thank you" devanagari="धन्यवाद" />
        <section className="px-6 lg:px-10 max-w-md mx-auto">
          <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
            <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: "var(--leaf)" }} />
            <div className="font-display text-xl mt-3">Submitted for review</div>
            <p className="text-sm mt-2" style={{ opacity: 0.75 }}>
              Your work has reached us. An editor will read it, and once approved it will appear in the library.
            </p>
            <div className="mt-5 flex gap-2 justify-center">
              <button
                onClick={() => {
                  setForm((f) => ({ ...f, title: "", title_devanagari: "", body_devanagari: "", transliteration: "", translation: "", intro: "" }));
                  setDone(false);
                }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--ink)", color: "var(--paper)" }}>
                Submit another
              </button>
              <button onClick={() => navigate("/literature")}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold border"
                      style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
                Back to the library
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ----- The form -----
  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Contribute · रचना"
        title="Share your work"
        devanagari="अपन रचना दिअ"
        description="Submit your Maithili poem or prose with a short introduction. An editor reviews every submission before it appears in the library."
      />

      <section className="px-6 lg:px-10 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Text label="Title" value={form.title} onChange={set("title")} required placeholder="The title of your work" />
            <Text label="Title in Devanagari (optional)" value={form.title_devanagari} onChange={set("title_devanagari")} placeholder="शीर्षक" />
            <Text label="Your name (as it should appear)" value={form.author_name} onChange={set("author_name")} required placeholder="Poet / author name" />
            <Text label="Contact email (optional)" type="email" value={form.contact_email} onChange={set("contact_email")} placeholder={user.email} />
            <Select label="Era" value={form.era} onChange={set("era")}
                    options={ERAS.map((e) => [e.id, e.title])} />
            <Select label="Form" value={form.form} onChange={set("form")}
                    options={Object.entries(FORM_LABELS)} />
          </div>

          <Area label="A short introduction (optional)" value={form.intro} onChange={set("intro")}
                rows={3} placeholder="A line or two about you, or about this work." />

          <div>
            <Area label="Your work — in Devanagari" value={form.body_devanagari} onChange={set("body_devanagari")}
                  rows={6} required placeholder="अपन रचना एतय लिखू…" mono />
            {/* Live Mithilakshar preview */}
            {form.body_devanagari.trim() && (
              <div className="mt-2 rounded-2xl p-4" style={{ background: "var(--cream-2)" }}>
                <div className="text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>
                  In Mithilakshar
                </div>
                <div className="font-tirhuta text-xl leading-[1.7] whitespace-pre-line" style={{ color: "var(--ink)" }}>
                  {devanagariToTirhuta(form.body_devanagari)}
                </div>
              </div>
            )}
          </div>

          <Area label="Roman transliteration (optional)" value={form.transliteration} onChange={set("transliteration")}
                rows={3} placeholder="The same lines in Roman script." />
          <Area label="English translation (optional)" value={form.translation} onChange={set("translation")}
                rows={3} placeholder="What does it say in English?" />

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm"
                 style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--paper)" }}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? "Submitting…" : "Submit for review"}
          </button>

          <p className="text-xs text-center" style={{ opacity: 0.6 }}>
            By submitting, you confirm this is your own work (or that you have the right to share it).
          </p>
        </form>

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}

// ---- Small field helpers (match the app's input styling) ----
function FieldLabel({ children }) {
  return (
    <div className="text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>
      {children}
    </div>
  );
}

const inputStyle = { background: "var(--paper)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" };

function Text({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
             className="w-full px-4 py-3 rounded-2xl text-sm" style={inputStyle} />
    </label>
  );
}

function Area({ label, value, onChange, rows = 3, required, placeholder, mono }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} required={required} placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-2xl text-sm leading-relaxed ${mono ? "text-base" : ""}`} style={inputStyle} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm" style={inputStyle}>
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
    </label>
  );
}
