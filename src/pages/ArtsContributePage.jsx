import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Send, Lock, CheckCircle2, ImagePlus, X } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { ART_FORM_OPTIONS } from "../data/arts.js";

const GALLERY_BUCKET = "arts-gallery";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — matches the bucket cap
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export default function ArtsContributePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    title_devanagari: "",
    artist_name: "",
    art_form: ART_FORM_OPTIONS[0]?.[0] || "",
    medium: "",
    description: "",
    location: "",
    year: "",
    contact_email: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  function pickFile(f) {
    setError(null);
    if (!f) return;
    if (!ALLOWED.includes(f.type)) { setError("Please choose a JPG, PNG or WebP image."); return; }
    if (f.size > MAX_BYTES) { setError("That image is over 5 MB — please choose a smaller file."); return; }
    setFile(f);
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(f); });
  }

  function clearFile() {
    setFile(null);
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.artist_name.trim()) {
      setError("Please fill in the title and the artist name.");
      return;
    }
    if (!file) { setError("Please add a photo of the artwork."); return; }

    setSubmitting(true);

    // 1. Upload the image into the member's own folder in the public bucket.
    const ext = EXT[file.type] || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      setSubmitting(false);
      setError(upErr.message || "Could not upload the image. Please try again.");
      return;
    }

    // 2. Insert the (pending) submission row referencing the uploaded image.
    const { error: insErr } = await supabase.from("arts_submissions").insert({
      title: form.title.trim(),
      title_devanagari: form.title_devanagari.trim() || null,
      artist_name: form.artist_name.trim(),
      art_form: form.art_form || null,
      medium: form.medium.trim() || null,
      description: form.description.trim() || null,
      image_path: path,
      location: form.location.trim() || null,
      year: form.year.trim() || null,
      contact_email: form.contact_email.trim() || user.email || null,
      created_by: user.id,
    });
    setSubmitting(false);
    if (insErr) {
      // Roll back the orphaned upload so we don't leave a stray image behind.
      await supabase.storage.from(GALLERY_BUCKET).remove([path]);
      setError(insErr.message || "Could not submit. Please try again.");
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
          eyebrow="Contribute · कला"
          title="Share your art"
          devanagari="अपन कला देखाउ"
          description="Mithila's art belongs to everyone who makes it. Sign in to submit a photo of your work — an editor will review it before it appears in the gallery."
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
              <Link to="/signin" state={{ from: "/arts/contribute" }}
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
        <PageHero eyebrow="Contribute · कला" title="Thank you" devanagari="धन्यवाद" />
        <section className="px-6 lg:px-10 max-w-md mx-auto">
          <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
            <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: "var(--leaf)" }} />
            <div className="font-display text-xl mt-3">Submitted for review</div>
            <p className="text-sm mt-2" style={{ opacity: 0.75 }}>
              Your piece has reached us. An editor will look at it, and once approved it will appear in the gallery.
            </p>
            <div className="mt-5 flex gap-2 justify-center">
              <button
                onClick={() => {
                  setForm((f) => ({ ...f, title: "", title_devanagari: "", medium: "", description: "", location: "", year: "" }));
                  clearFile();
                  setDone(false);
                }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--ink)", color: "var(--paper)" }}>
                Submit another
              </button>
              <button onClick={() => navigate("/arts")}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold border"
                      style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
                Back to the gallery
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
        eyebrow="Contribute · कला"
        title="Share your art"
        devanagari="अपन कला देखाउ"
        description="Submit a photo of your Mithila artwork with a short note. An editor reviews every submission before it appears in the community gallery."
      />

      <section className="px-6 lg:px-10 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image upload */}
          <div>
            <FieldLabel>Photo of the artwork *</FieldLabel>
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "var(--cream-2)" }}>
                <img src={preview} alt="Preview" className="w-full max-h-80 object-contain" style={{ background: "var(--cream-2)" }} />
                <button type="button" onClick={clearFile} aria-label="Remove image"
                        className="absolute top-3 right-3 w-9 h-9 rounded-lg grid place-items-center"
                        style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-10 cursor-pointer text-center"
                     style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
                <ImagePlus className="w-7 h-7" style={{ color: "var(--vermillion)", opacity: 0.7 }} />
                <div className="text-sm font-medium">Tap to choose a photo</div>
                <div className="text-xs" style={{ opacity: 0.6 }}>JPG, PNG or WebP · up to 5 MB</div>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                       onChange={(e) => pickFile(e.target.files?.[0])} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Text label="Title" value={form.title} onChange={set("title")} required placeholder="The name of the piece" />
            <Text label="Title in Devanagari (optional)" value={form.title_devanagari} onChange={set("title_devanagari")} placeholder="शीर्षक" />
            <Text label="Artist name (as it should appear)" value={form.artist_name} onChange={set("artist_name")} required placeholder="Your name" />
            <Text label="Contact email (optional)" type="email" value={form.contact_email} onChange={set("contact_email")} placeholder={user.email} />
            <Select label="Art form" value={form.art_form} onChange={set("art_form")} options={ART_FORM_OPTIONS} />
            <Text label="Medium (optional)" value={form.medium} onChange={set("medium")} placeholder="e.g. Acrylic on handmade paper" />
            <Text label="Place (optional)" value={form.location} onChange={set("location")} placeholder="e.g. Madhubani" />
            <Text label="Year (optional)" value={form.year} onChange={set("year")} placeholder="e.g. 2024" />
          </div>

          <Area label="About this piece (optional)" value={form.description} onChange={set("description")}
                rows={4} placeholder="A line or two about the work, its story, or the technique." />

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
            By submitting, you confirm this is your own work (or that you have the right to share it), and that we may
            show it in the gallery with your credit.
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

function Area({ label, value, onChange, rows = 3, required, placeholder }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} required={required} placeholder={placeholder}
                className="w-full px-4 py-3 rounded-2xl text-sm leading-relaxed" style={inputStyle} />
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
