import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, ArrowRight, Star, Sparkles, Bell
} from "lucide-react";
import { FESTIVALS, getNextFestival } from "../data/festivals.js";
import { BorderPattern, LotusMotif, FishMotif } from "../components/Motifs.jsx";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CATEGORY_LABELS = {
  "flagship-mithila": "Mithila signature",
  "mithila":          "Mithila",
  "pan-hindu":        "Pan-Hindu",
};

const CATEGORY_FILTERS = [
  { id: "all",       label: "All festivals" },
  { id: "flagship-mithila", label: "Mithila signature" },
  { id: "mithila",   label: "All Mithila" },
];

export default function FestivalsPage() {
  const [filter, setFilter] = useState("all");
  const nextFest = useMemo(() => getNextFestival(), []);

  const filtered = useMemo(() => {
    if (filter === "all") return FESTIVALS;
    if (filter === "flagship-mithila") return FESTIVALS.filter((f) => f.category === "flagship-mithila");
    if (filter === "mithila") return FESTIVALS.filter((f) => f.category !== "pan-hindu");
    return FESTIVALS;
  }, [filter]);

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      {/* HERO */}
      <section className="px-6 lg:px-10 pt-8 pb-6 max-w-5xl mx-auto relative">
        <div className="absolute right-2 top-2 hidden md:block opacity-15" style={{ color: "var(--turmeric)" }}>
          <LotusMotif className="w-44" />
        </div>
        <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--leaf)" }}>
          Pavain · Tyohar
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
          The festivals <br />
          <span className="italic" style={{ color: "var(--turmeric)" }}>of a Mithil year.</span>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ opacity: 0.78 }}>
          Thirteen festivals that shape the year in Mithila — from Jur Sital in spring
          to Vivaha Panchami in early winter. Tap any to learn its rituals, foods,
          and songs, and why it matters in our tradition.
        </p>

        <div className="mt-6" style={{ color: "var(--turmeric)", opacity: 0.5 }}>
          <BorderPattern />
        </div>
      </section>

      {/* NEXT FESTIVAL HIGHLIGHT */}
      {nextFest && (
        <section className="px-6 lg:px-10 pb-6 max-w-5xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
               style={{ background: "var(--ink)", color: "var(--paper)" }}>
            <div className="absolute -top-4 -right-4 opacity-15" style={{ color: "var(--turmeric)" }}>
              <FishMotif className="w-44" />
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
                   style={{ background: "rgba(214, 153, 38, 0.20)" }}>
                <Star className="w-5 h-5" style={{ color: "var(--turmeric)" }} fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-[0.22em] uppercase font-semibold"
                     style={{ color: "var(--turmeric)" }}>
                  Next on the Mithila calendar
                </div>
                <div className="font-display text-3xl sm:text-4xl leading-tight mt-1">
                  {nextFest.name}
                  {nextFest.altName && (
                    <span className="font-display italic opacity-60 ml-2 text-2xl">/ {nextFest.altName}</span>
                  )}
                </div>
                <div className="font-display italic text-lg mt-1" style={{ opacity: 0.85 }}>
                  {nextFest.nameDevanagari}
                </div>
                <p className="text-sm mt-3 opacity-85 max-w-xl">
                  {nextFest.shortDesc}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <Link to={`/festivals/${nextFest.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                        style={{ background: "var(--turmeric)", color: "var(--ink)" }}>
                    Open festival page <ArrowRight className="w-4 h-4" />
                  </Link>
                  {nextFest.approxDate && (
                    <span className="text-xs" style={{ opacity: 0.75 }}>
                      {nextFest.approxDate.range}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY FILTERS */}
      <section className="px-6 lg:px-10 pb-3 max-w-5xl mx-auto">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold mr-2" style={{ opacity: 0.55 }}>
            View
          </span>
          {CATEGORY_FILTERS.map((c) => {
            const active = filter === c.id;
            return (
              <button key={c.id}
                      onClick={() => setFilter(c.id)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all"
                      style={{
                        background: active ? "var(--ink)" : "transparent",
                        color: active ? "var(--paper)" : "var(--ink)",
                        borderColor: active ? "var(--ink)" : "var(--cream-2)",
                      }}>
                {c.label}
              </button>
            );
          })}
          <span className="text-xs ml-auto" style={{ opacity: 0.55 }}>
            {filtered.length} festival{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      {/* FESTIVAL GRID */}
      <section className="px-6 lg:px-10 pb-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((f) => (
            <FestivalCard key={f.slug} festival={f} isNext={f.slug === nextFest?.slug} />
          ))}
        </div>
      </section>

      {/* COMMUNITY INPUT CTA */}
      <section className="px-6 lg:px-10 pb-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
             style={{ background: "var(--cream-2)" }}>
          <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
               style={{ background: "var(--paper)", color: "var(--leaf)" }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-display text-xl leading-tight">
              Know more than we do?
            </div>
            <div className="text-sm mt-1" style={{ opacity: 0.78 }}>
              These entries are drafts — written from general knowledge, marked clearly where they need a Maithili scholar's eye.
              If your family's tradition differs, or there's a song or story we're missing, please tell us.
              Maithili scholars and elders especially welcome.
            </div>
          </div>
          <button
            onClick={() => alert("Community feedback form coming with Membership (Phase 1). For now, send a note via the contact form.")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap"
            style={{ background: "var(--ink)", color: "var(--paper)" }}>
            Suggest a correction
          </button>
        </div>
      </section>

      {/* DATES DISCLAIMER */}
      <section className="px-6 lg:px-10 pb-12 max-w-5xl mx-auto">
        <div className="text-xs flex items-start gap-2" style={{ opacity: 0.55 }}>
          <Bell className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            Approximate dates shown are best estimates — please verify against a current panchang.
            A real panchang API integration is planned for Phase 1, which will give exact dates and push reminders.
          </span>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Festival Card
// ============================================================
function FestivalCard({ festival, isNext }) {
  const accentVar = `var(--${festival.accent})`;
  const monthLabel = MONTH_NAMES[festival.approxMonth - 1];
  const isFlagship = festival.category === "flagship-mithila";

  return (
    <Link to={`/festivals/${festival.slug}`}
          className="group rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
          style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl grid place-items-center"
               style={{ background: "var(--cream)", color: accentVar }}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
                 style={{ color: accentVar }}>
              {monthLabel}
            </div>
            <div className="text-[9px] tracking-wider uppercase" style={{ opacity: 0.55 }}>
              {festival.duration.label}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isNext && (
            <span className="text-[9px] tracking-[0.18em] uppercase font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--ink)", color: "var(--turmeric)" }}>
              Up Next
            </span>
          )}
          {isFlagship && !isNext && (
            <span className="text-[9px] tracking-[0.18em] uppercase font-semibold"
                  style={{ color: "var(--vermillion-dark)" }}>
              ✦ Signature
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="font-display text-2xl leading-tight" style={{ color: "var(--ink)" }}>
          {festival.name}
        </div>
        {festival.altName && (
          <div className="font-display italic text-sm mt-0.5" style={{ opacity: 0.6 }}>
            {festival.altName}
          </div>
        )}
        <div className="font-display italic text-sm mt-1" style={{ color: accentVar }}>
          {festival.nameDevanagari}
        </div>
        <p className="text-sm mt-3 leading-relaxed" style={{ opacity: 0.75 }}>
          {festival.shortDesc}
        </p>
      </div>

      <div className="mt-4 text-xs font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
           style={{ color: accentVar }}>
        Read about {festival.name} <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
