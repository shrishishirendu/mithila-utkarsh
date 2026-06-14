import { Link } from "react-router-dom";
import { ArrowRight, ScrollText } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import {
  ERAS,
  FORM_LABELS,
  getWorksByEra,
  getAuthorsByEra,
  getAuthor,
} from "../data/literature.js";

// A single work, as a card on the era list.
function WorkCard({ work }) {
  const author = getAuthor(work.authorId);
  const isDraft = work.status === "draft";
  return (
    <Link
      to={`/literature/${work.slug}`}
      className="group rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
      style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
          style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}
        >
          {FORM_LABELS[work.form] ?? work.form}
        </span>
        {isDraft && (
          <span
            className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
            style={{ background: "var(--cream)", color: "var(--ink)", opacity: 0.6 }}
          >
            Draft
          </span>
        )}
      </div>

      {work.titleDevanagari && (
        <div className="font-tirhuta text-2xl leading-tight" style={{ color: "var(--vermillion-dark)" }}>
          {devanagariToTirhuta(work.titleDevanagari)}
        </div>
      )}
      <div className="font-display text-xl leading-tight mt-0.5" style={{ color: "var(--ink)" }}>
        {work.title}
      </div>
      {author && (
        <div className="text-sm mt-1" style={{ color: "var(--leaf)" }}>
          {author.name}
        </div>
      )}

      <p className="text-sm mt-3 leading-relaxed flex-1" style={{ opacity: 0.72 }}>
        {work.excerpt}
      </p>
      <div
        className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
        style={{ color: "var(--vermillion)" }}
      >
        Read <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}

// One era block: heading + poets of the era + its works.
function EraSection({ era }) {
  const works = getWorksByEra(era.id);
  const authors = getAuthorsByEra(era.id);

  return (
    <section className="mb-12">
      {/* Era heading */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: "var(--ink)" }}>
          {era.title}
        </h2>
        <span className="font-tirhuta text-xl" style={{ color: "var(--vermillion-dark)" }} title={era.devanagari}>
          {devanagariToTirhuta(era.devanagari)}
        </span>
        <span
          className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
          style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}
        >
          {era.span}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>
        {era.blurb}
      </p>

      {/* Poets / writers of the era */}
      {authors.length > 0 && (
        <div className="mt-3 text-sm" style={{ opacity: 0.7 }}>
          <span className="uppercase tracking-[0.18em] text-[10px] mr-2" style={{ color: "var(--leaf)" }}>
            Voices
          </span>
          {authors.map((a, i) => (
            <span key={a.id}>
              {i > 0 && <span style={{ opacity: 0.4 }}> · </span>}
              <span style={{ color: "var(--ink)" }}>{a.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* Works */}
      {works.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {works.map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </div>
      ) : (
        <div
          className="mt-5 rounded-2xl p-5 text-sm"
          style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", opacity: 0.75 }}
        >
          Texts from this era are being added to the library.
        </div>
      )}
    </section>
  );
}

export default function LiteraturePage() {
  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="From Vidyāpati to today · साहित्य"
        title="Literature"
        devanagari="साहित्य"
        description="The literary treasure of Mithila — from Vidyāpati's padāvalī to modern Maithili poetry and prose, read across three scripts: Mithilakshar, Devanagari and Roman."
      />

      <div className="px-6 lg:px-10 max-w-5xl mx-auto">
        {ERAS.map((era) => (
          <EraSection key={era.id} era={era} />
        ))}

        <div className="mt-2 flex items-center gap-3 text-sm" style={{ opacity: 0.7 }}>
          <ScrollText className="w-4 h-4 shrink-0" style={{ color: "var(--vermillion-dark)" }} />
          <span>
            The library is growing. Know a song, a pada or a passage we should add?{" "}
            <Link to="/blog" className="underline" style={{ color: "var(--vermillion)" }}>
              Tell us.
            </Link>
          </span>
        </div>

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </div>
    </div>
  );
}
