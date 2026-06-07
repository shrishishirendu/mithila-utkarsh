import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { User, MapPin, FileText, Loader2, CheckCircle2, LogOut, Home, Building2, Briefcase, Users } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

// Seed list — we'll refine this once the diaspora map clarifies.
// Roughly ordered by where Maithil diaspora communities are known to exist.
const CITIES = [
  "Sydney, Australia",
  "Melbourne, Australia",
  "Brisbane, Australia",
  "Perth, Australia",
  "Auckland, New Zealand",
  "London, United Kingdom",
  "Birmingham, United Kingdom",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Calgary, Canada",
  "New York, USA",
  "New Jersey, USA",
  "Houston, USA",
  "Dallas, USA",
  "Atlanta, USA",
  "San Francisco Bay Area, USA",
  "Chicago, USA",
  "Boston, USA",
  "Washington DC, USA",
  "Dubai, UAE",
  "Doha, Qatar",
  "Singapore",
  "Kuala Lumpur, Malaysia",
  "Hong Kong",
  "Tokyo, Japan",
  "Frankfurt, Germany",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "—",
  "Darbhanga, India",
  "Madhubani, India",
  "Patna, India",
  "Delhi, India",
  "Mumbai, India",
  "Bangalore, India",
  "Hyderabad, India",
  "Kathmandu, Nepal",
  "Janakpur, Nepal",
  "Other",
];

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [district, setDistrict] = useState("");
  const [village, setVillage] = useState("");
  const [profession, setProfession] = useState("");
  const [listed, setListed] = useState(false);

  // Load the user's profile from Supabase
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, city, bio, district, village, profession, listed")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setError("Couldn't load your profile. " + error.message);
      } else if (data) {
        setDisplayName(data.display_name || "");
        setCity(data.city || "");
        setBio(data.bio || "");
        setDistrict(data.district || "");
        setVillage(data.village || "");
        setProfession(data.profession || "");
        setListed(!!data.listed);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user]);

  // Redirect to sign in if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" state={{ from: "/profile" }} replace />;
  }

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSavedAt(null);
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName.trim() || null,
        city: city || null,
        bio: bio.trim() || null,
        district: district.trim() || null,
        village: village.trim() || null,
        profession: profession.trim() || null,
        listed,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (error) {
      setError("Couldn't save. " + error.message);
      return;
    }
    setSavedAt(new Date());
  }

  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Your account"
        title="Profile"
        devanagari="अपन परिचय"
        description="Tell the community a little about yourself. Your name and city help other Maithils know who else is around."
      />

      <section className="px-6 lg:px-10 max-w-2xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>

          <div className="text-xs mb-5" style={{ opacity: 0.6 }}>
            Signed in as <span className="font-semibold" style={{ color: "var(--vermillion-dark)" }}>{user.email}</span>
          </div>

          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <Field
                icon={User}
                label="Display name"
                value={displayName}
                onChange={setDisplayName}
                placeholder="How you'd like others to see you"
              />

              <SelectField
                icon={MapPin}
                label="City"
                value={city}
                onChange={setCity}
                options={CITIES}
                placeholder="Pick the city closest to you"
              />

              <TextareaField
                icon={FileText}
                label="Short bio (optional)"
                value={bio}
                onChange={setBio}
                placeholder="A line or two about yourself — what you do, what you love about Mithila"
                maxLength={280}
              />

              <Field
                icon={Building2}
                label="District (optional)"
                value={district}
                onChange={setDistrict}
                placeholder="e.g. Madhubani, Darbhanga, Sitamarhi"
              />

              <Field
                icon={Home}
                label="Village (optional)"
                value={village}
                onChange={setVillage}
                placeholder="Your village or town"
              />

              <Field
                icon={Briefcase}
                label="Profession (optional)"
                value={profession}
                onChange={setProfession}
                placeholder="What you do — e.g. Software engineer, Teacher"
              />

              {/* Member Directory opt-in */}
              <div className="rounded-2xl p-4" style={{ background: "var(--cream)", border: "1px solid var(--cream-2)" }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={listed}
                    onChange={(e) => setListed(e.target.checked)}
                    className="mt-1 w-4 h-4"
                    style={{ accentColor: "var(--vermillion)" }}
                  />
                  <span>
                    <span className="font-display text-base flex items-center gap-1.5">
                      <Users className="w-4 h-4" style={{ color: "var(--indigo)" }} /> List me in the Member Directory
                    </span>
                    <span className="block text-[12px] mt-1" style={{ opacity: 0.65 }}>
                      Off by default. When on, signed-in members can find you in the directory by your
                      name, city, native place, profession and bio. Only signed-in members can browse it.
                    </span>
                  </span>
                </label>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm"
                     style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>
                  {error}
                </div>
              )}

              {savedAt && (
                <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                     style={{ background: "rgba(72, 107, 60, 0.08)", color: "var(--leaf)" }}>
                  <CheckCircle2 className="w-4 h-4" /> Profile saved.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold disabled:opacity-50"
                  style={{ background: "var(--ink)", color: "var(--paper)" }}
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving…" : "Save profile"}
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
                  style={{ background: "transparent", color: "var(--vermillion-dark)", border: "1px solid var(--cream-2)" }}
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}

// ============================================================
//  Form field building blocks
// ============================================================

function Field({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <FieldLabel label={label} />
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--vermillion)", opacity: 0.55 }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm"
          style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" }}
        />
      </div>
    </label>
  );
}

function SelectField({ icon: Icon, label, value, onChange, options, placeholder }) {
  return (
    <label className="block">
      <FieldLabel label={label} />
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10"
              style={{ color: "var(--vermillion)", opacity: 0.55 }} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm appearance-none"
          style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" }}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            opt === "—"
              ? <option key={opt} disabled>───────</option>
              : <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function TextareaField({ icon: Icon, label, value, onChange, placeholder, maxLength }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <FieldLabel label={label} />
        {maxLength && (
          <span className="text-[10px]" style={{ opacity: 0.5 }}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        <Icon className="absolute left-4 top-3.5 w-4 h-4"
              style={{ color: "var(--vermillion)", opacity: 0.55 }} />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={3}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm resize-none"
          style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" }}
        />
      </div>
    </label>
  );
}

function FieldLabel({ label }) {
  return (
    <div className="text-[11px] tracking-[0.18em] uppercase mb-1.5"
         style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>
      {label}
    </div>
  );
}
