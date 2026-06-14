import { useState, useEffect } from "react";
import { Check, X, RotateCcw, Loader2, Lock } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { FORM_LABELS, getEra } from "../data/literature.js";

const FILTERS = [
  ["pending", "To review"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
  ["all", "All"],
];

export default function AdminLiteraturePage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");

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
          .from("literature_submissions")
          .select("id, title, title_devanagari, author_name, era, form, body_devanagari, transliteration, translation, intro, contact_email, status, created_at")
          .order("created_at", { ascending: false });
        if (cancelled) return;
        if (error) setError(error.message);
        else setRows(data || []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function setStatus(id, status) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("literature_submissions").update({ status }).eq("id", id);
  }

  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    all: rows.length,
  };
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Admin · review"
        title="Literature submissions"
        devanagari="रचना समीक्षा"
        description="Community-submitted Maithili poetry and prose awaiting review. Approve the good ones and they appear in the library; reject the rest."
      />

      <section className="px-6 lg:px-10 max-w-4xl mx-auto">
        {authLoading || loading ? (
          <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
        ) : !isAdmin ? (
          <Locked>{!user ? "Sign in as an admin to review submissions." : "This page is for admins only."}</Locked>
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
                  {filter === "pending" ? "Nothing to review yet — submissions will collect here." : "None here."}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {shown.map((r) => (
                  <SubmissionCard key={r.id} row={r} onStatus={setStatus} />
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

function SubmissionCard({ row, onStatus }) {
  const era = getEra(row.era);
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
              {row.form ? FORM_LABELS[row.form] ?? row.form : "—"}
            </span>
            {era && (
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--leaf)" }}>
                {era.title}
              </span>
            )}
            <StatusChip status={row.status} />
          </div>
          <div className="font-display text-xl leading-tight">{row.title}</div>
          {row.title_devanagari && (
            <div className="text-sm" style={{ color: "var(--vermillion-dark)", opacity: 0.85 }}>{row.title_devanagari}</div>
          )}
          <div className="text-sm mt-1" style={{ opacity: 0.7 }}>
            by {row.author_name}
            {row.contact_email && <span style={{ opacity: 0.7 }}> · {row.contact_email}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {row.status !== "approved" && (
            <IconBtn onClick={() => onStatus(row.id, "approved")} title="Approve" bg="var(--leaf)"><Check className="w-4 h-4" /></IconBtn>
          )}
          {row.status !== "rejected" && (
            <IconBtn onClick={() => onStatus(row.id, "rejected")} title="Reject" bg="var(--vermillion)"><X className="w-4 h-4" /></IconBtn>
          )}
          {row.status !== "pending" && (
            <IconBtn onClick={() => onStatus(row.id, "pending")} title="Back to review" bg="var(--cream-2)" fg="var(--ink)"><RotateCcw className="w-4 h-4" /></IconBtn>
          )}
        </div>
      </div>

      {row.intro && (
        <p className="text-sm italic mt-3" style={{ opacity: 0.75 }}>{row.intro}</p>
      )}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "var(--cream)" }}>
          <Label>Devanagari</Label>
          <div className="text-base whitespace-pre-line leading-relaxed">{row.body_devanagari}</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: "var(--cream)" }}>
          <Label>Mithilakshar</Label>
          <div className="font-tirhuta text-lg whitespace-pre-line leading-[1.7]" style={{ color: "var(--vermillion-dark)" }}>
            {devanagariToTirhuta(row.body_devanagari || "")}
          </div>
        </div>
      </div>

      {row.transliteration && (
        <div className="mt-2 text-sm italic whitespace-pre-line" style={{ opacity: 0.7 }}>{row.transliteration}</div>
      )}
      {row.translation && (
        <div className="mt-2 text-sm whitespace-pre-line" style={{ opacity: 0.8 }}>
          <Label>Translation</Label>
          {row.translation}
        </div>
      )}
    </div>
  );
}

function StatusChip({ status }) {
  const map = {
    pending: { bg: "var(--cream-2)", fg: "var(--ink)", label: "Pending" },
    approved: { bg: "var(--leaf)", fg: "var(--paper)", label: "Approved" },
    rejected: { bg: "var(--vermillion)", fg: "var(--paper)", label: "Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

function Label({ children }) {
  return <div className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>{children}</div>;
}

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
