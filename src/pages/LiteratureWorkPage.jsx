import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { getWork, getAuthor, FORM_LABELS, ERAS } from "../data/literature.js";

// The three scripts a reader can switch between.
const SCRIPTS = [
  { id: "tirhuta", label: "Mithilakshar" },
  { id: "devanagari", label: "Devanagari" },
  { id: "roman", label: "Roman" },
];

export default function LiteratureWorkPage() {
  const { slug } = useParams();
  const work = getWork(slug);
  const [script, setScript] = useState("tirhuta");

  if (!work) {
    return (
      <div className="font-body min-h-screen px-6 lg:px-10 py-16 max-w-3xl mx-auto" style={{ color: "var(--ink)" }}>
        <div className="font-display text-2xl">Work not found</div>
        <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
          This text may have moved.{" "}
          <Link to="/literature" className="underline" style={{ color: "var(--vermillion)" }}>
            Back to the library
          </Link>
          .
        </p>
      </div>
    );
  }

  const author = getAuthor(work.authorId);
  const era = ERAS.find((e) => e.id === work.era);
  const isDraft = work.status === "draft";

  // Which scripts actually have text to show.
  const available = {
    tirhuta: !!work.text.devanagari,
    devanagari: !!work.text.devanagari,
    roman: !!work.text.transliteration,
  };

  const rendered =
    script === "tirhuta"
      ? devanagariToTirhuta(work.text.devanagari)
      : script === "devanagari"
      ? work.text.devanagari
      : work.text.transliteration;

  const verseClass =
    script === "tirhuta"
      ? "font-tirhuta text-2xl sm:text-3xl leading-[1.7]"
      : script === "devanagari"
      ? "font-display text-xl sm:text-2xl leading-[1.8]"
      : "text-lg sm:text-xl italic leading-[1.8]";

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <article className="px-6 lg:px-10 pt-8 pb-14 max-w-3xl mx-auto">
        <Link
          to="/literature"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-6"
          style={{ color: "var(--vermillion-dark)" }}
        >
          <ArrowLeft className="w-4 h-4" /> The library
        </Link>

        {/* Meta chips */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
            style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}
          >
            {FORM_LABELS[work.form] ?? work.form}
          </span>
          {era && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--leaf)" }}>
              {era.title} · {era.span}
            </span>
          )}
          {isDraft && (
            <span
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ background: "var(--cream)", color: "var(--ink)", opacity: 0.6 }}
            >
              Draft
            </span>
          )}
        </div>

        {/* Title — three scripts, Mithilakshar leading */}
        {work.titleDevanagari && (
          <div className="font-tirhuta text-3xl sm:text-4xl leading-tight" style={{ color: "var(--vermillion-dark)" }}>
            {devanagariToTirhuta(work.titleDevanagari)}
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight mt-1">{work.title}</h1>
        {work.titleDevanagari && (
          <div className="text-base mt-1" style={{ opacity: 0.6 }}>
            {work.titleDevanagari}
          </div>
        )}
        {author && (
          <div className="text-sm mt-3" style={{ opacity: 0.7 }}>
            {author.name}
            {author.dates ? <span style={{ opacity: 0.7 }}> · {author.dates}</span> : null}
          </div>
        )}

        <div className="mt-5 mb-7" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
          <BorderPattern />
        </div>

        {isDraft && (
          <div
            className="rounded-2xl p-4 mb-6 text-sm"
            style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", opacity: 0.85 }}
          >
            This text is being prepared — the verses below are placeholders until the verified text is added.
          </div>
        )}

        {/* Script toggle */}
        <div className="inline-flex rounded-xl p-1 mb-5" style={{ background: "var(--cream-2)" }}>
          {SCRIPTS.map((s) => {
            const isActive = s.id === script;
            const disabled = !available[s.id];
            return (
              <button
                key={s.id}
                onClick={() => !disabled && setScript(s.id)}
                disabled={disabled}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isActive ? "var(--paper)" : "transparent",
                  color: isActive ? "var(--vermillion-dark)" : "var(--ink)",
                  opacity: disabled ? 0.35 : isActive ? 1 : 0.7,
                  cursor: disabled ? "not-allowed" : "pointer",
                  boxShadow: isActive ? "0 1px 3px rgba(27,26,46,0.1)" : "none",
                }}
                title={disabled ? "Not available for this text yet" : `Read in ${s.label}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* The text, in the chosen script */}
        <div
          className={`${verseClass} whitespace-pre-line`}
          style={{ color: "var(--ink)" }}
          lang={script === "roman" ? undefined : "mai"}
        >
          {rendered}
        </div>

        {/* English translation */}
        {work.text.translation && (
          <div className="mt-8">
            <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--leaf)" }}>
              Translation
            </div>
            <div
              className="rounded-2xl p-5 text-[16px] leading-relaxed whitespace-pre-line"
              style={{ background: "var(--paper)", border: "1px solid var(--cream-2)", opacity: 0.9 }}
            >
              {work.text.translation}
            </div>
          </div>
        )}

        {/* Editorial note */}
        {work.notes && (
          <p className="mt-6 text-sm leading-relaxed" style={{ opacity: 0.7 }}>
            {work.notes}
          </p>
        )}

        {/* Source / provenance */}
        {work.source && (
          <p className="mt-4 text-xs" style={{ opacity: 0.5 }}>
            Source: {work.source}
          </p>
        )}
      </article>
    </div>
  );
}
