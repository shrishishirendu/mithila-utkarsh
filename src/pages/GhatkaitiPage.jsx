import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart, Lock, ScrollText, Loader2, CheckCircle2, Clock, ShieldCheck,
  LogIn, UserPlus, Send, Save,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

const BLANK = {
  gender: "", looking_for: "", dob: "", birth_time: "", birth_place: "",
  height: "", mool: "", gotra: "", caste: "", education: "", profession: "",
  family: "", about: "", expectations: "",
};

export default function GhatkaitiPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("draft");
  const [form, setForm] = useState(BLANK);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("matrimony_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) setError("Couldn't load your biodata. " + error.message);
      else if (data) {
        setStatus(data.status || "draft");
        setForm({
          gender: data.gender || "", looking_for: data.looking_for || "",
          dob: data.dob || "", birth_time: data.birth_time || "", birth_place: data.birth_place || "",
          height: data.height || "", mool: data.mool || "", gotra: data.gotra || "",
          caste: data.caste || "", education: data.education || "", profession: data.profession || "",
          family: data.family || "", about: data.about || "", expectations: data.expectations || "",
        });
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function save(submitForReview) {
    setSaving(true);
    setError(null);
    setSavedAt(null);
    const nextStatus = submitForReview ? "submitted" : status;
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, (typeof v === "string" ? v.trim() : v) || null])
    );
    const { error } = await supabase.from("matrimony_profiles").upsert({
      id: user.id,
      ...clean,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { setError("Couldn't save. " + error.message); return; }
    setStatus(nextStatus);
    setSavedAt(new Date());
  }

  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Maithil matchmaking · by introduction"
        title="Matrimony"
        devanagari="घटकैती"
        accentColor="var(--indigo)"
        description="The Maithil matchmaking tradition, brought to the diaspora. Share your biodata privately — only the Ghatkaiti admin reviews it and reaches out about suitable matches. Members never see each other's biodata."
      />

      <section className="px-6 lg:px-10 max-w-2xl mx-auto">
        {authLoading ? (
          <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
        ) : !user ? (
          <SignedOutTeaser />
        ) : (
          <>
            {/* How it works */}
            <div className="rounded-3xl p-5 sm:p-6 mb-5"
                 style={{ background: "var(--cream-2)" }}>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-semibold mb-2"
                   style={{ color: "var(--indigo)" }}>
                <Lock className="w-3.5 h-3.5" /> Private &amp; admin-mediated
              </div>
              <ul className="text-sm space-y-1.5" style={{ opacity: 0.8 }}>
                <li className="flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--leaf)" }} />Your biodata is visible only to you and the Ghatkaiti admin — never to other members.</li>
                <li className="flex gap-2"><ScrollText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--vermillion-dark)" }} />Mool &amp; Gotra follow the Maithil Panji tradition (lineage compatibility).</li>
                <li className="flex gap-2"><Heart className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--vermillion)" }} />The admin reviews submitted biodatas and introduces suitable matches.</li>
              </ul>
            </div>

            <StatusBanner status={status} />

            {loading ? (
              <Center><Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); save(false); }}
                    className="rounded-3xl p-6 sm:p-8 space-y-6"
                    style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>

                <Section label="Basics">
                  <SelectField label="I am" value={form.gender} onChange={set("gender")}
                               options={[["male", "Male"], ["female", "Female"], ["other", "Other"]]} />
                  <SelectField label="Looking for" value={form.looking_for} onChange={set("looking_for")}
                               options={[["bride", "A bride"], ["groom", "A groom"]]} />
                  <DateField label="Date of birth" value={form.dob} onChange={set("dob")} />
                  <TextField label="Height" value={form.height} onChange={set("height")} placeholder="e.g. 5'6&quot;" />
                </Section>

                <Section label="Birth details (optional — for kundli)">
                  <TextField label="Birth time" value={form.birth_time} onChange={set("birth_time")} placeholder="e.g. 04:30 AM" />
                  <TextField label="Birth place" value={form.birth_place} onChange={set("birth_place")} placeholder="City / town" />
                </Section>

                <Section label="Lineage (Maithil Panji)">
                  <TextField label="Mool · मूल" value={form.mool} onChange={set("mool")} placeholder="Your मूल" />
                  <TextField label="Gotra · गोत्र" value={form.gotra} onChange={set("gotra")} placeholder="Your गोत्र" />
                  <TextField label="Caste / sub-caste (optional)" value={form.caste} onChange={set("caste")}
                             placeholder="Leave blank if you prefer" />
                </Section>

                <Section label="Background">
                  <TextField label="Education" value={form.education} onChange={set("education")} placeholder="e.g. M.Tech, Sydney" />
                  <TextField label="Profession" value={form.profession} onChange={set("profession")} placeholder="What you do" />
                  <TextareaField label="Family (optional)" value={form.family} onChange={set("family")}
                                 placeholder="Parents, family background — anything you'd like to share" />
                </Section>

                <Section label="About">
                  <TextareaField label="About you" value={form.about} onChange={set("about")}
                                 placeholder="A few lines about yourself" />
                  <TextareaField label="Partner expectations" value={form.expectations} onChange={set("expectations")}
                                 placeholder="What you're looking for in a partner" />
                </Section>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm"
                       style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>{error}</div>
                )}
                {savedAt && !error && (
                  <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                       style={{ background: "rgba(72, 107, 60, 0.08)", color: "var(--leaf)" }}>
                    <CheckCircle2 className="w-4 h-4" /> Saved.
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button type="submit" disabled={saving}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
                          style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--cream-2)" }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save draft
                  </button>
                  <button type="button" disabled={saving} onClick={() => save(true)}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
                          style={{ background: "var(--vermillion)", color: "var(--paper)" }}>
                    <Send className="w-4 h-4" /> Submit for review
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}

function StatusBanner({ status }) {
  const map = {
    draft:     { icon: Save,        color: "var(--ink)",            text: "Draft — not yet submitted. Fill it in and submit for review." },
    submitted: { icon: Clock,       color: "var(--vermillion-dark)", text: "Submitted — under review by the Ghatkaiti admin. We'll reach out about matches." },
    approved:  { icon: CheckCircle2, color: "var(--leaf)",          text: "Approved — your biodata is active in the Ghatkaiti pool." },
  };
  const s = map[status] || map.draft;
  const Icon = s.icon;
  return (
    <div className="rounded-2xl px-4 py-3 mb-5 flex items-center gap-2 text-sm"
         style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", color: s.color }}>
      <Icon className="w-4 h-4 shrink-0" /> {s.text}
    </div>
  );
}

function SignedOutTeaser() {
  return (
    <div className="rounded-3xl p-8 text-center"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
           style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
        <Heart className="w-5 h-5" />
      </div>
      <div className="font-display text-xl mt-4">Ghatkaiti is for members</div>
      <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
        Sign in to create your matrimony biodata. It stays private — only the admin reviews it.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <Link to="/signin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <LogIn className="w-4 h-4" /> Sign in
        </Link>
        <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border"
              style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
          <UserPlus className="w-4 h-4" /> Sign up
        </Link>
      </div>
    </div>
  );
}

// ---------- form building blocks ----------

function Section({ label, children }) {
  return (
    <div className="space-y-4">
      <div className="text-[11px] tracking-[0.18em] uppercase font-semibold"
           style={{ color: "var(--indigo)" }}>{label}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Lbl({ label }) {
  return <div className="text-[11px] tracking-[0.14em] uppercase mb-1.5" style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>{label}</div>;
}

const inputStyle = { background: "var(--cream)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" };

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <Lbl label={label} />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
             className="w-full px-4 py-3 rounded-2xl text-sm" style={inputStyle} />
    </label>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label className="block">
      <Lbl label={label} />
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
             className="w-full px-4 py-3 rounded-2xl text-sm" style={inputStyle} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <Lbl label={label} />
      <select value={value} onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm appearance-none" style={inputStyle}>
        <option value="">—</option>
        {options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
      </select>
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block sm:col-span-2">
      <Lbl label={label} />
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
                className="w-full px-4 py-3 rounded-2xl text-sm resize-none" style={inputStyle} />
    </label>
  );
}

function Center({ children }) {
  return <div className="py-16 flex items-center justify-center">{children}</div>;
}
