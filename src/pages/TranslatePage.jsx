import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRightLeft, Copy, Check, Info, BookText, AlertTriangle, Sparkles, Loader2, LogIn } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { translateToMaithili, PHRASES, PHRASE_CATEGORIES } from "../data/phrasebook.js";

const EXAMPLES = ["thank you", "how are you?", "I am from Mithila", "mother", "water", "let's go"];

export default function TranslatePage() {
  const { user } = useAuth();
  const [input, setInput] = useState("thank you");
  const [ai, setAi] = useState(null);          // { devanagari, iast, confidence, note }
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const result = translateToMaithili(input);
  // Offer the AI fallback only when the curated lookup doesn't have a clean hit.
  const canAiTranslate = input.trim() && (result.kind === "none" || result.kind === "gloss");

  // Clear any AI result when the input changes — it no longer matches.
  useEffect(() => { setAi(null); setAiError(null); }, [input]);

  async function aiTranslate() {
    const text = input.trim();
    if (!text || !user) return;
    setAiLoading(true);
    setAiError(null);
    setAi(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { "Content-Type": "application/json" };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
      const r = await fetch("/api/translate", {
        method: "POST",
        headers,
        body: JSON.stringify({ text }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setAi(j);
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      {/* Hero */}
      <section className="px-6 lg:px-10 pt-8 pb-6 max-w-4xl mx-auto">
        <div className="mb-2 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold"
             style={{ color: "var(--indigo)" }}>
          <ArrowRightLeft className="w-3.5 h-3.5" /> English → Maithili
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-tight">
          Translate into <span className="italic" style={{ color: "var(--indigo)" }}>Maithili.</span>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>
          Type English and get Maithili in both scripts — Devanagari and Tirhuta — plus pronunciation.
          A dictionary &amp; phrasebook lookup: every result is human-curated, no AI guessing.
        </p>
        <div className="mt-6" style={{ color: "var(--indigo)", opacity: 0.5 }}>
          <BorderPattern />
        </div>
      </section>

      {/* Translate box */}
      <section className="px-6 lg:px-10 max-w-4xl mx-auto">
        <label className="block">
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--indigo)" }}>
            English
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a word or phrase…"
            className="mt-2 w-full px-4 py-3 rounded-2xl text-xl border outline-none focus:ring-2"
            style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px]" style={{ opacity: 0.5 }}>Try:</span>
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => setInput(ex)}
                    className="px-2.5 py-1 rounded-full text-[13px] border transition-colors hover:opacity-80"
                    style={{ background: "var(--cream)", borderColor: "var(--cream-2)" }}>
              {ex}
            </button>
          ))}
        </div>
      </section>

      {/* Result */}
      <section className="px-6 lg:px-10 py-6 max-w-4xl mx-auto">
        <Result result={result} />

        {/* AI fallback — only when the curated lookup has no clean hit */}
        {canAiTranslate && !ai && (
          user ? (
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <button onClick={aiTranslate} disabled={aiLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity disabled:opacity-60"
                      style={{ background: "var(--indigo)", color: "var(--paper)" }}>
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? "Translating…" : "Translate with AI"}
              </button>
              <span className="text-[11px]" style={{ opacity: 0.55 }}>
                AI handles full sentences — result is unverified.
              </span>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl p-4 flex flex-wrap items-center gap-3"
                 style={{ background: "var(--cream-2)" }}>
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: "var(--indigo)" }} />
              <span className="text-sm flex-1 min-w-0" style={{ opacity: 0.8 }}>
                <span className="font-semibold" style={{ color: "var(--indigo)" }}>AI translation is for members.</span>{" "}
                Sign in to translate full sentences with AI.
              </span>
              <Link to="/signin" state={{ from: "/translate" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shrink-0"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}>
                <LogIn className="w-4 h-4" /> Sign in
              </Link>
            </div>
          )
        )}

        {aiError && (
          <div className="mt-3 rounded-2xl p-4 flex items-start gap-3"
               style={{ background: "var(--paper)", border: "1px solid var(--vermillion)" }}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--vermillion)" }} />
            <div className="text-sm" style={{ opacity: 0.8 }}>{aiError}</div>
          </div>
        )}

        {ai && ai.devanagari && (
          <div className="mt-3 rounded-3xl overflow-hidden" style={{ border: "1px solid var(--cream-2)" }}>
            <div className="px-5 py-2.5 flex items-center justify-between"
                 style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
              <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase font-semibold"
                    style={{ color: "var(--indigo)" }}>
                <Sparkles className="w-3.5 h-3.5" /> AI translation · unverified
              </span>
              {ai.confidence && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
                  {ai.confidence} confidence
                </span>
              )}
            </div>
            <div className="px-6 py-6" style={{ background: "var(--paper)" }}>
              <ScriptStack dev={ai.devanagari} iast={ai.iast} />
              {ai.note && (
                <div className="text-sm mt-4 pt-3" style={{ opacity: 0.7, borderTop: "1px solid var(--cream-2)" }}>
                  {ai.note}
                </div>
              )}
              <div className="text-[11px] mt-3" style={{ opacity: 0.5 }}>
                Generated by AI from your verified vocabulary — double-check before relying on it.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Phrasebook */}
      <section className="px-6 lg:px-10 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <BookText className="w-4 h-4" style={{ color: "var(--indigo)" }} />
          <h2 className="font-display text-2xl">Phrasebook</h2>
        </div>
        {PHRASE_CATEGORIES.map((cat) => {
          const items = PHRASES.filter((p) => p.category === cat.id);
          if (!items.length) return null;
          return (
            <div key={cat.id} className="mb-5">
              <div className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-2"
                   style={{ color: "var(--indigo)" }}>
                {cat.label}
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--cream-2)" }}>
                {items.map((p, i) => (
                  <button key={p.id} onClick={() => setInput(p.english)}
                          className="w-full text-left px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 transition-colors hover:opacity-90"
                          style={{ background: "var(--paper)", borderTop: i ? "1px solid var(--cream-2)" : "none" }}>
                    <div className="sm:w-1/3 text-sm flex items-center gap-2" style={{ opacity: 0.8 }}>
                      {p.english}
                      {p.draft && <DraftDot />}
                    </div>
                    <div className="sm:flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="text-lg">{p.dev}</span>
                      <span className="font-tirhuta text-lg" style={{ color: "var(--vermillion-dark)" }}>
                        {devanagariToTirhuta(p.dev)}
                      </span>
                      <span className="text-xs italic" style={{ opacity: 0.6 }}>{p.iast}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Notes */}
      <section className="px-6 lg:px-10 pb-12 max-w-4xl mx-auto space-y-3">
        <NoteCard tone="indigo" icon={Info}>
          <span className="font-semibold" style={{ color: "var(--indigo)" }}>Lookup, not AI.</span> Results come from a
          curated dictionary &amp; phrasebook. The Tirhuta is derived exactly from the Devanagari. Coverage grows as the
          dictionary grows — words not yet added won't translate.
        </NoteCard>
        <NoteCard tone="vermillion" icon={AlertTriangle}>
          <span className="font-semibold" style={{ color: "var(--vermillion-dark)" }}>Some phrases are drafts</span>
          {" "}(marked with a dot) — drafted for review and not yet verified by a Maithili speaker. Verify before
          relying on them.
        </NoteCard>
      </section>
    </div>
  );
}

function Result({ result }) {
  if (!result || result.kind === "empty") {
    return <Empty>Type something above to translate.</Empty>;
  }
  if (result.kind === "none") {
    return (
      <Empty>
        <span className="font-display text-lg" style={{ color: "var(--vermillion-dark)" }}>Not in the dictionary yet.</span>
        <div className="text-sm mt-1" style={{ opacity: 0.7 }}>
          “{result.source}” isn’t covered. As the dictionary grows, more will translate.
        </div>
      </Empty>
    );
  }

  if (result.kind === "gloss") {
    const devLine = result.parts.map((p) => (p.known ? p.dev : `[${p.token}]`)).join(" ");
    return (
      <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid var(--cream-2)" }}>
        <div className="px-5 py-2.5 flex items-center gap-2"
             style={{ background: "var(--cream-2)" }}>
          <AlertTriangle className="w-3.5 h-3.5" style={{ color: "var(--vermillion-dark)" }} />
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--vermillion-dark)" }}>
            Rough · word-by-word (grammar not adjusted)
          </span>
        </div>
        <div className="px-6 py-5" style={{ background: "var(--paper)" }}>
          <ScriptStack dev={devLine} />
          <div className="mt-4 flex flex-wrap gap-2">
            {result.parts.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm"
                    style={{ background: p.known ? "var(--cream)" : "var(--cream-2)", opacity: p.known ? 1 : 0.7 }}>
                <span style={{ opacity: 0.55 }}>{p.token}</span>
                <span>→</span>
                {p.known ? <span>{p.dev}</span> : <span className="italic" style={{ opacity: 0.6 }}>not found</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // phrase | word
  return (
    <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid var(--cream-2)" }}>
      <div className="px-5 py-2.5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--indigo)" }}>
          Maithili {result.kind === "phrase" ? "· phrase" : "· word"}
        </span>
        {result.draft && <DraftBadge />}
      </div>
      <div className="px-6 py-6" style={{ background: "var(--paper)" }}>
        <ScriptStack dev={result.dev} iast={result.iast} />
        {result.note && (
          <div className="text-sm mt-4 pt-3" style={{ opacity: 0.7, borderTop: "1px solid var(--cream-2)" }}>
            {result.note}
          </div>
        )}
      </div>
    </div>
  );
}

// Devanagari (large) + Tirhuta (large) + IAST, each with a copy button.
function ScriptStack({ dev, iast }) {
  const tir = devanagariToTirhuta(dev);
  return (
    <div className="space-y-3">
      <ScriptRow label="Devanagari" text={dev} className="text-3xl" />
      <ScriptRow label="Tirhuta" text={tir} className="font-tirhuta text-3xl" style={{ color: "var(--vermillion-dark)" }} />
      {iast && (
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] tracking-[0.16em] uppercase font-semibold w-20 shrink-0" style={{ color: "var(--indigo)", opacity: 0.7 }}>
            Pronounce
          </span>
          <span className="text-lg italic" style={{ opacity: 0.75 }}>{iast}</span>
        </div>
      )}
    </div>
  );
}

function ScriptRow({ label, text, className, style }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[10px] tracking-[0.16em] uppercase font-semibold w-20 shrink-0 pt-2" style={{ color: "var(--indigo)", opacity: 0.7 }}>
        {label}
      </span>
      <span className={`leading-snug break-words flex-1 ${className}`} style={style}>{text}</span>
      <button onClick={copy} aria-label={`Copy ${label}`}
              className="shrink-0 w-8 h-8 rounded-lg grid place-items-center transition-colors"
              style={{ background: copied ? "var(--leaf)" : "var(--cream-2)", color: copied ? "var(--paper)" : "var(--ink)" }}>
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function Empty({ children }) {
  return (
    <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
      <div style={{ opacity: 0.7 }}>{children}</div>
    </div>
  );
}

function DraftBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--vermillion)" }} /> Draft · verify
    </span>
  );
}

function DraftDot() {
  return <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--vermillion)" }} title="Draft — needs verification" />;
}

function NoteCard({ tone, icon: Icon, children }) {
  return (
    <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "var(--cream-2)" }}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: tone === "vermillion" ? "var(--vermillion-dark)" : "var(--indigo)" }} />
      <div className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>{children}</div>
    </div>
  );
}
