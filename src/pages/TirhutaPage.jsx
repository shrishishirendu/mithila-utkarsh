import { useState } from "react";
import { Languages, Copy, Check, ArrowDown, Info } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { transliterate } from "../data/tirhuta.js";

const EXAMPLES = {
  devanagari: ["मिथिला", "मैथिली", "जय मिथिला", "सीता", "मिथिला उत्कर्ष", "ॐ"],
  roman: ["mithilaa", "maithilii", "jaya mithilaa", "siitaa", "panchaang", "dhanyavaad"],
};

const PLACEHOLDER = {
  devanagari: "देवनागरी में टाइप करू…  (e.g. मिथिला)",
  roman: "Type phonetically…  (e.g. mithilaa)",
};

export default function TirhutaPage() {
  const [mode, setMode] = useState("devanagari");
  const [input, setInput] = useState("मिथिला");
  const [copied, setCopied] = useState(false);

  const { devanagari, tirhuta } = transliterate(input, mode);

  function copy() {
    if (!tirhuta) return;
    navigator.clipboard?.writeText(tirhuta).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function pick(example) {
    setInput(example);
  }

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Mithilakshar · Tirhuta"
        title="Transliteration"
        devanagari="लिपि प्रवर्तक"
        accentColor="var(--indigo)"
        description="Convert Devanagari or phonetic English into the Tirhuta (Mithilakshar) script — the script of the brand wordmark itself."
      />

      {/* Mode toggle */}
      <section className="px-6 lg:px-10 pb-4 max-w-4xl mx-auto">
        <div className="inline-flex p-1 rounded-2xl" style={{ background: "var(--cream-2)" }}>
          <ModeButton active={mode === "devanagari"} onClick={() => setMode("devanagari")}
                      title="देवनागरी" sub="Devanagari · exact" />
          <ModeButton active={mode === "roman"} onClick={() => setMode("roman")}
                      title="English" sub="Phonetic · approx" />
        </div>
      </section>

      {/* Input */}
      <section className="px-6 lg:px-10 max-w-4xl mx-auto">
        <label className="block">
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--indigo)" }}>
            Input — {mode === "devanagari" ? "Devanagari" : "English (phonetic)"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            placeholder={PLACEHOLDER[mode]}
            className="mt-2 w-full px-4 py-3 rounded-2xl text-xl border outline-none focus:ring-2 resize-none"
            style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}
          />
        </label>

        {/* Example chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px]" style={{ opacity: 0.5 }}>Try:</span>
          {EXAMPLES[mode].map((ex) => (
            <button key={ex} onClick={() => pick(ex)}
                    className="px-2.5 py-1 rounded-full text-[13px] border transition-colors hover:opacity-80"
                    style={{ background: "var(--cream)", borderColor: "var(--cream-2)" }}>
              {ex}
            </button>
          ))}
        </div>
      </section>

      {/* Arrow */}
      <div className="flex justify-center py-4" style={{ color: "var(--indigo)", opacity: 0.5 }}>
        <ArrowDown className="w-5 h-5" />
      </div>

      {/* Output */}
      <section className="px-6 lg:px-10 pb-6 max-w-4xl mx-auto">
        <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid var(--cream-2)" }}>
          <div className="px-5 py-3 flex items-center justify-between"
               style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--indigo)" }}>
              Tirhuta · Mithilakshar
            </span>
            <button onClick={copy} disabled={!tirhuta}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-40"
                    style={{ background: copied ? "var(--leaf)" : "var(--ink)", color: "var(--paper)" }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="px-6 py-8 min-h-[120px] flex items-center" style={{ background: "var(--paper)" }}>
            {tirhuta ? (
              <span className="font-tirhuta leading-relaxed break-words"
                    style={{ fontSize: "2.4rem", color: "var(--vermillion-dark)" }}>
                {tirhuta}
              </span>
            ) : (
              <span className="text-sm" style={{ opacity: 0.4 }}>Tirhuta output appears here…</span>
            )}
          </div>

          {/* Parsed Devanagari — transparency for the phonetic path */}
          {mode === "roman" && devanagari && (
            <div className="px-6 py-3 text-sm flex flex-wrap items-baseline gap-2"
                 style={{ background: "var(--cream)", borderTop: "1px solid var(--cream-2)" }}>
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--indigo)", opacity: 0.8 }}>
                Parsed as
              </span>
              <span className="text-lg">{devanagari}</span>
            </div>
          )}
        </div>
      </section>

      {/* Accuracy note */}
      <section className="px-6 lg:px-10 pb-12 max-w-4xl mx-auto">
        <div className="rounded-3xl p-5 flex items-start gap-3" style={{ background: "var(--cream-2)" }}>
          <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--indigo)" }} />
          <div className="text-sm leading-relaxed" style={{ opacity: 0.8 }}>
            <span className="font-semibold" style={{ color: "var(--indigo)" }}>Devanagari → Tirhuta is exact</span> —
            a 1:1 script mapping. <span className="font-semibold" style={{ color: "var(--indigo)" }}>English is phonetic and approximate</span>:
            Latin can't distinguish retroflex from dental, so <em>t, th, d, dh, n, sh</em> default to dental/श.
            For precision use IAST (ṭ ḍ ṇ ṣ ś), double vowels for long ones (<em>aa, ii, uu</em>), and prefer the
            Devanagari tab for anything you'll publish.
          </div>
        </div>
      </section>
    </div>
  );
}

function ModeButton({ active, onClick, title, sub }) {
  return (
    <button onClick={onClick}
            className="px-4 py-2 rounded-xl text-left transition-colors"
            style={active
              ? { background: "var(--paper)", boxShadow: "inset 0 0 0 1px var(--cream-2)" }
              : { background: "transparent", opacity: 0.7 }}>
      <div className="font-display text-base leading-tight"
           style={{ color: active ? "var(--vermillion-dark)" : "var(--ink)" }}>
        {title}
      </div>
      <div className="text-[10px] tracking-wider uppercase mt-0.5" style={{ opacity: 0.6 }}>
        {sub}
      </div>
    </button>
  );
}
