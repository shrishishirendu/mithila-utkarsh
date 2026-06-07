import { useState, useEffect } from "react";
import { Check, X, RotateCcw, Loader2, Lock } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";

const FILTERS = [
  ["suggested", "To review"],
  ["verified", "Verified"],
  ["rejected", "Rejected"],
  ["all", "All"],
];

export default function AdminWordsPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("suggested");

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
          .from("ai_word_bank")
          .select("id, source_en, devanagari, iast, confidence, status, created_at")
          .order("created_at", { ascending: false });
        if (cancelled) return;
        if (error) setError(error.message);
        else setWords(data || []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function setStatus(id, status) {
    setWords((ws) => ws.map((w) => (w.id === id ? { ...w, status } : w)));
    await supabase.from("ai_word_bank").update({ status }).eq("id", id);
  }

  const counts = {
    suggested: words.filter((w) => w.status === "suggested").length,
    verified: words.filter((w) => w.status === "verified").length,
    rejected: words.filter((w) => w.status === "rejected").length,
    all: words.length,
  };
  const shown = filter === "all" ? words : words.filter((w) => w.status === filter);

  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Admin · review"
        title="AI Word Bank"
        devanagari="शब्द संग्रह"
        description="Unverified Maithili captured from AI translations, deduped by the English source. Verify the good ones and reject the wrong ones — verified words are the queue for promoting into the real dictionary."
      />

      <section className="px-6 lg:px-10 max-w-4xl mx-auto">
        {authLoading || loading ? (
          <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
        ) : !isAdmin ? (
          <Locked>{!user ? "Sign in as an admin to view the word bank." : "This page is for admins only."}</Locked>
        ) : error ? (
          <div className="rounded-2xl px-4 py-3 text-sm"
               style={{ background: "rgba(180,58,46,0.08)", color: "var(--vermillion-dark)" }}>
            Couldn't load — {error}
          </div>
        ) : (
          <>
            {/* Filter tabs */}
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
                  {filter === "suggested" ? "Nothing to review yet — translations will collect here." : "None here."}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--cream-2)" }}>
                {shown.map((w, i) => (
                  <div key={w.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                       style={{ background: "var(--paper)", borderTop: i ? "1px solid var(--cream-2)" : "none" }}>
                    <div className="sm:w-1/4 text-sm" style={{ opacity: 0.75 }}>{w.source_en}</div>
                    <div className="sm:flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="text-lg">{w.devanagari}</span>
                      <span className="font-tirhuta text-lg" style={{ color: "var(--vermillion-dark)" }}>
                        {devanagariToTirhuta(w.devanagari || "")}
                      </span>
                      {w.iast && <span className="text-xs italic" style={{ opacity: 0.6 }}>{w.iast}</span>}
                      {w.confidence && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--cream-2)", opacity: 0.8 }}>
                          {w.confidence}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {w.status !== "verified" && (
                        <IconBtn onClick={() => setStatus(w.id, "verified")} title="Verify" bg="var(--leaf)"><Check className="w-4 h-4" /></IconBtn>
                      )}
                      {w.status !== "rejected" && (
                        <IconBtn onClick={() => setStatus(w.id, "rejected")} title="Reject" bg="var(--vermillion)"><X className="w-4 h-4" /></IconBtn>
                      )}
                      {w.status !== "suggested" && (
                        <IconBtn onClick={() => setStatus(w.id, "suggested")} title="Back to review" bg="var(--cream-2)" fg="var(--ink)"><RotateCcw className="w-4 h-4" /></IconBtn>
                      )}
                    </div>
                  </div>
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
