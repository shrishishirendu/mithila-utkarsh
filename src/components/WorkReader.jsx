import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BorderPattern } from "./Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";

// The three scripts a reader can switch between.
const SCRIPTS = [
  { id: "tirhuta", label: "Mithilakshar" },
  { id: "devanagari", label: "Devanagari" },
  { id: "roman", label: "Roman" },
];

// Presentational reading view shared by curated works (literature.js) and
// approved community contributions (Supabase). All copy is passed in as props
// so the same layout renders both.
//
// Props:
//   backTo, backLabel        — the "back" link target + label
//   formLabel                — e.g. "Pada", "Poem"
//   eraLabel                 — e.g. "Classical · 14th–15th century" (optional)
//   badge                    — small chip, e.g. "Draft" | "Contributed" (optional)
//   title, titleDevanagari   — work title (Devanagari rendered in Tirhuta too)
//   authorName, authorDates  — byline (dates optional)
//   intro                    — short note about the poet/work (optional)
//   noticeText               — full-width notice above the text (optional)
//   text: { devanagari, transliteration, translation }
//   notes, source            — optional footer copy
export default function WorkReader({
  backTo,
  backLabel,
  formLabel,
  eraLabel,
  badge,
  title,
  titleDevanagari,
  authorName,
  authorDates,
  intro,
  noticeText,
  text,
  notes,
  source,
}) {
  const [script, setScript] = useState("tirhuta");

  const available = {
    tirhuta: !!text?.devanagari,
    devanagari: !!text?.devanagari,
    roman: !!text?.transliteration,
  };

  const rendered =
    script === "tirhuta"
      ? devanagariToTirhuta(text?.devanagari || "")
      : script === "devanagari"
      ? text?.devanagari
      : text?.transliteration;

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
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-6"
          style={{ color: "var(--vermillion-dark)" }}
        >
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>

        {/* Meta chips */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {formLabel && (
            <span
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}
            >
              {formLabel}
            </span>
          )}
          {eraLabel && (
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--leaf)" }}>
              {eraLabel}
            </span>
          )}
          {badge && (
            <span
              className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ background: "var(--cream)", color: "var(--ink)", opacity: 0.6 }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Title — three scripts, Mithilakshar leading */}
        {titleDevanagari && (
          <div className="font-tirhuta text-3xl sm:text-4xl leading-tight" style={{ color: "var(--vermillion-dark)" }}>
            {devanagariToTirhuta(titleDevanagari)}
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl leading-tight tracking-tight mt-1">{title}</h1>
        {titleDevanagari && (
          <div className="text-base mt-1" style={{ opacity: 0.6 }}>
            {titleDevanagari}
          </div>
        )}
        {authorName && (
          <div className="text-sm mt-3" style={{ opacity: 0.7 }}>
            {authorName}
            {authorDates ? <span style={{ opacity: 0.7 }}> · {authorDates}</span> : null}
          </div>
        )}

        <div className="mt-5 mb-7" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
          <BorderPattern />
        </div>

        {/* About the poet / work */}
        {intro && (
          <p className="text-[15px] leading-relaxed italic mb-6" style={{ opacity: 0.8 }}>
            {intro}
          </p>
        )}

        {noticeText && (
          <div
            className="rounded-2xl p-4 mb-6 text-sm"
            style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", opacity: 0.85 }}
          >
            {noticeText}
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
        {text?.translation && (
          <div className="mt-8">
            <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--leaf)" }}>
              Translation
            </div>
            <div
              className="rounded-2xl p-5 text-[16px] leading-relaxed whitespace-pre-line"
              style={{ background: "var(--paper)", border: "1px solid var(--cream-2)", opacity: 0.9 }}
            >
              {text.translation}
            </div>
          </div>
        )}

        {/* Editorial note */}
        {notes && (
          <p className="mt-6 text-sm leading-relaxed" style={{ opacity: 0.7 }}>
            {notes}
          </p>
        )}

        {/* Source / provenance */}
        {source && (
          <p className="mt-4 text-xs" style={{ opacity: 0.5 }}>
            Source: {source}
          </p>
        )}
      </article>
    </div>
  );
}
