import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Feather, Loader2 } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { supabase } from "../lib/supabase.js";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import {
  ERAS,
  FORM_LABELS,
  getWorksByEra,
  getAuthorsByEra,
  getAuthor,
  getEra,
} from "../data/literature.js";

// ---- A short introduction to an author/poet (real, factual seed content) ----
function AuthorCard({ author }) {
  return (
    <div className="rounded-2xl p-5 border" style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-tirhuta text-xl" style={{ color: "var(--vermillion-dark)" }} title={author.devanagari}>
          {devanagariToTirhuta(author.devanagari)}
        </span>
        <span className="font-display text-lg" style={{ color: "var(--ink)" }}>
          {author.name}
        </span>
        {author.dates && (
          <span className="text-[10px] tracking-[0.18em] uppercase" style={{ opacity: 0.55 }}>
            {author.dates}
          </span>
        )}
      </div>
      <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.78 }}>
        {author.intro || author.blurb}
      </p>
    </div>
  );
}

// ---- A curated work (from literature.js) ----
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
        <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
          {FORM_LABELS[work.form] ?? work.form}
        </span>
        {isDraft && (
          <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
                style={{ background: "var(--cream)", color: "var(--ink)", opacity: 0.6 }}>
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
      {author && <div className="text-sm mt-1" style={{ color: "var(--leaf)" }}>{author.name}</div>}
      <p className="text-sm mt-3 leading-relaxed flex-1" style={{ opacity: 0.72 }}>{work.excerpt}</p>
      <div className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
           style={{ color: "var(--vermillion)" }}>
        Read <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}

// ---- An approved community contribution (from Supabase) ----
function ContributionCard({ row }) {
  const era = getEra(row.era);
  const snippet = row.intro || row.body_devanagari;
  return (
    <Link
      to={`/literature/c/${row.id}`}
      className="group rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
      style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
          {row.form ? FORM_LABELS[row.form] ?? row.form : "Work"}
        </span>
        {era && (
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--leaf)" }}>
            {era.title}
          </span>
        )}
      </div>
      {row.title_devanagari && (
        <div className="font-tirhuta text-2xl leading-tight" style={{ color: "var(--vermillion-dark)" }}>
          {devanagariToTirhuta(row.title_devanagari)}
        </div>
      )}
      <div className="font-display text-xl leading-tight mt-0.5" style={{ color: "var(--ink)" }}>{row.title}</div>
      <div className="text-sm mt-1" style={{ color: "var(--leaf)" }}>{row.author_name}</div>
      <p className="text-sm mt-3 leading-relaxed flex-1 line-clamp-3" style={{ opacity: 0.72 }}>{snippet}</p>
      <div className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
           style={{ color: "var(--vermillion)" }}>
        Read <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}

// ---- One era: heading + voices (author intros) + curated works ----
function EraSection({ era }) {
  const works = getWorksByEra(era.id);
  const authors = getAuthorsByEra(era.id);

  return (
    <section className="mb-12">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: "var(--ink)" }}>{era.title}</h2>
        <span className="font-tirhuta text-xl" style={{ color: "var(--vermillion-dark)" }} title={era.devanagari}>
          {devanagariToTirhuta(era.devanagari)}
        </span>
        <span className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
              style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
          {era.span}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>{era.blurb}</p>

      {authors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {authors.map((a) => <AuthorCard key={a.id} author={a} />)}
        </div>
      )}

      {works.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {works.map((w) => <WorkCard key={w.slug} work={w} />)}
        </div>
      )}
    </section>
  );
}

// ---- Call to contribute ----
function ContributeCTA() {
  return (
    <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
         style={{ background: "var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
           style={{ background: "var(--paper)", color: "var(--vermillion)" }}>
        <Feather className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="font-display text-xl leading-tight">Are you a poet or writer?</div>
        <div className="text-sm mt-1" style={{ opacity: 0.78 }}>
          Share your own Maithili poem or prose. An editor reviews each piece, and once approved it joins the library.
        </div>
      </div>
      <Link to="/literature/contribute"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
            style={{ background: "var(--ink)", color: "var(--paper)" }}>
        Share your work <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function LiteraturePage() {
  const [contributions, setContributions] = useState([]);
  const [loadingContribs, setLoadingContribs] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // RLS returns only approved rows to the public.
      const { data } = await supabase
        .from("literature_submissions")
        .select("id, title, title_devanagari, author_name, era, form, body_devanagari, intro")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setContributions(data || []);
      setLoadingContribs(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="font-body min-h-screen pb-12" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="From Vidyāpati to today · साहित्य"
        title="Literature"
        devanagari="साहित्य"
        description="The literary treasure of Mithila — from Vidyāpati's padāvalī to living poets writing today — read across Mithilakshar, Devanagari and Roman."
      />

      <div className="px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="mb-12">
          <ContributeCTA />
        </div>

        {ERAS.map((era) => <EraSection key={era.id} era={era} />)}

        {/* New compositions — the living, community side of the library */}
        <section className="mb-10">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: "var(--ink)" }}>
              New compositions
            </h2>
            <span className="font-tirhuta text-xl" style={{ color: "var(--vermillion-dark)" }} title="नव रचना">
              {devanagariToTirhuta("नव रचना")}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>
            Work shared by today's Maithili poets and writers — reviewed and welcomed into the library.
          </p>

          {loadingContribs ? (
            <div className="mt-5 py-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--vermillion)" }} />
            </div>
          ) : contributions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {contributions.map((row) => <ContributionCard key={row.id} row={row} />)}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl p-6 text-sm"
                 style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)", opacity: 0.85 }}>
              No community works yet — yours could be the first.{" "}
              <Link to="/literature/contribute" className="underline" style={{ color: "var(--vermillion)" }}>
                Share your work.
              </Link>
            </div>
          )}
        </section>

        <div className="mt-2" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </div>
    </div>
  );
}
