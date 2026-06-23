import { useState, useEffect } from "react";
import { Check, RotateCcw, Loader2, Lock, Phone } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

const FILTERS = [
  ["submitted", "To review"],
  ["approved", "Approved"],
  ["draft", "Drafts"],
  ["all", "All"],
];

const FIELDS = "id, full_name, contact, contact_email, gender, looking_for, dob, birth_time, birth_place, height, mool, gotra, caste, education, profession, family, about, expectations, photos, status, created_at, updated_at";

export default function AdminGhatkaitiPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("submitted");

  useEffect(() => {
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data: prof } = await supabase
        .from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
      if (cancelled) return;
      const admin = !!prof?.is_admin;
      setIsAdmin(admin);
      if (admin) {
        const { data, error } = await supabase
          .from("matrimony_profiles")
          .select(FIELDS)
          .order("updated_at", { ascending: false });
        if (cancelled) return;
        if (error) { setError(error.message); }
        else {
          const enriched = await Promise.all((data || []).map(async (r) => {
            const photoUrls = [];
            for (const p of (r.photos || [])) {
              const { data: s } = await supabase.storage.from("matrimony-photos").createSignedUrl(p, 3600);
              if (s?.signedUrl) photoUrls.push(s.signedUrl);
            }
            return { ...r, photoUrls };
          }));
          if (!cancelled) setRows(enriched);
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function setStatus(id, status) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("matrimony_profiles").update({ status }).eq("id", id);
  }

  const counts = {
    submitted: rows.filter((r) => r.status === "submitted").length,
    approved: rows.filter((r) => r.status === "approved").length,
    draft: rows.filter((r) => r.status === "draft").length,
    all: rows.length,
  };
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Admin · review"
        title="Ghatkaiti biodatas"
        devanagari="घटकैती समीक्षा"
        accentColor="var(--indigo)"
        description="Submitted matrimony biodatas awaiting review. Approve a biodata to let that member browse matches and mark interest."
      />

      <section className="px-6 lg:px-10 max-w-4xl mx-auto">
        {authLoading || loading ? (
          <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
        ) : !isAdmin ? (
          <Locked>{!user ? "Sign in as an admin to review biodatas." : "This page is for admins only."}</Locked>
        ) : error ? (
          <div className="rounded-2xl px-4 py-3 text-sm"
               style={{ background: "rgba(180,58,46,0.08)", color: "var(--vermillion-dark)" }}>
            Couldn't load — {error}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(([key, label]) => (
                <button key={key} onClick={() => setFilter(key)}
                        className="px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
                        style={filter === key
                          ? { background: "var(--ink)", color: "var(--paper)" }
                          : { background: "var(--cream-2)", color: "var(--ink)" }}>
                  {label} <span style={{ opacity: 0.6 }}>{counts[key] ?? 0}</span>
                </button>
              ))}
            </div>

            {shown.length === 0 ? (
              <div className="mt-6 rounded-2xl p-8 text-center" style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
                <div className="text-sm" style={{ opacity: 0.6 }}>
                  {filter === "submitted" ? "Nothing to review yet — submitted biodatas will appear here." : "None here."}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {shown.map((r) => (
                  <BiodataCard key={r.id} row={r} onStatus={setStatus} />
                ))}
              </div>
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

function age(dob) {
  if (!dob) return null;
  const b = new Date(dob);
  if (isNaN(b)) return null;
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a >= 0 && a < 130 ? a : null;
}

function BiodataCard({ row, onStatus }) {
  const a = age(row.dob);
  const lookingFor = row.looking_for === "bride" ? "a bride" : row.looking_for === "groom" ? "a groom" : "—";
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusChip status={row.status} />
            {row.gender && <Chip>{cap(row.gender)}</Chip>}
            <Chip>looking for {lookingFor}</Chip>
            {a != null && <Chip>{a} yrs</Chip>}
          </div>
          <div className="font-display text-xl leading-tight">{row.full_name || "Unnamed"}</div>
          {row.contact && (
            <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--vermillion-dark)" }}>
              <Phone className="w-3.5 h-3.5" /> {row.contact}
            </div>
          )}
          {row.contact_email && (
            <div className="text-sm" style={{ opacity: 0.75 }}>{row.contact_email}</div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {row.status !== "approved" && (
            <IconBtn onClick={() => onStatus(row.id, "approved")} title="Approve" bg="var(--leaf)"><Check className="w-4 h-4" /></IconBtn>
          )}
          {row.status === "approved" && (
            <IconBtn onClick={() => onStatus(row.id, "submitted")} title="Unapprove (back to review)" bg="var(--cream-2)" fg="var(--ink)"><RotateCcw className="w-4 h-4" /></IconBtn>
          )}
        </div>
      </div>

      {row.photoUrls?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {row.photoUrls.map((url, i) => (
            <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <Field label="Mool · मूल" value={row.mool} />
        <Field label="Gotra · गोत्र" value={row.gotra} />
        <Field label="Caste" value={row.caste} />
        <Field label="Height" value={row.height} />
        <Field label="Education" value={row.education} />
        <Field label="Profession" value={row.profession} />
        <Field label="Birth time" value={row.birth_time} />
        <Field label="Birth place" value={row.birth_place} />
      </div>

      {row.family && <Para label="Family" text={row.family} />}
      {row.about && <Para label="About" text={row.about} />}
      {row.expectations && <Para label="Expectations" text={row.expectations} />}
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-[10px] tracking-[0.16em] uppercase mr-1.5" style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Para({ label, text }) {
  return (
    <div className="mt-2 text-sm">
      <div className="text-[10px] tracking-[0.16em] uppercase mb-0.5" style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>{label}</div>
      <div style={{ opacity: 0.82 }}>{text}</div>
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    draft:     { bg: "var(--cream-2)", fg: "var(--ink)",   label: "Draft" },
    submitted: { bg: "var(--turmeric)", fg: "var(--ink)",  label: "Submitted" },
    approved:  { bg: "var(--leaf)",    fg: "var(--paper)", label: "Approved" },
  };
  const s = map[status] || map.draft;
  return (
    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

function Chip({ children }) {
  return <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "var(--cream-2)", color: "var(--ink)" }}>{children}</span>;
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function IconBtn({ onClick, title, bg, fg = "var(--paper)", children }) {
  return (
    <button onClick={onClick} title={title}
            className="w-8 h-8 rounded-lg grid place-items-center transition-opacity hover:opacity-85"
            style={{ background: bg, color: fg }}>
      {children}
    </button>
  );
}

function Center({ children }) {
  return <div className="py-16 flex items-center justify-center">{children}</div>;
}

function Locked({ children }) {
  return (
    <div className="rounded-3xl p-8 text-center max-w-md mx-auto"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
           style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
        <Lock className="w-5 h-5" />
      </div>
      <p className="text-sm mt-4" style={{ opacity: 0.75 }}>{children}</p>
    </div>
  );
}
