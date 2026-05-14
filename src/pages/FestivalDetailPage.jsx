import { Link, useParams, Navigate } from "react-router-dom";
import {
  ChevronLeft, Calendar, Sun, Users, MapPin, Soup, Music, ScrollText,
  Heart, Sparkles, AlertCircle, ChevronRight
} from "lucide-react";
import { getFestivalBySlug, getAdjacentFestivals } from "../data/festivals.js";
import { BorderPattern, LotusMotif, SunMotif } from "../components/Motifs.jsx";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function FestivalDetailPage() {
  const { slug } = useParams();
  const festival = getFestivalBySlug(slug);

  if (!festival) {
    return <Navigate to="/festivals" replace />;
  }

  const accent = `var(--${festival.accent})`;
  const { prev, next } = getAdjacentFestivals(slug);

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      {/* BACK */}
      <div className="px-6 lg:px-10 pt-6 max-w-5xl mx-auto">
        <Link to="/festivals"
              className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-medium hover:opacity-100"
              style={{ opacity: 0.65 }}>
          <ChevronLeft className="w-3.5 h-3.5" />
          All festivals
        </Link>
      </div>

      {/* HERO */}
      <section className="px-6 lg:px-10 pt-5 pb-6 max-w-5xl mx-auto relative">
        <div className="absolute right-2 top-2 hidden md:block opacity-12" style={{ color: accent }}>
          <SunMotif className="w-32 h-32" />
        </div>

        <div className="text-xs tracking-[0.22em] uppercase mb-2" style={{ color: accent }}>
          {MONTH_NAMES[festival.approxMonth - 1]} · {festival.duration.label}
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
          {festival.name}
          {festival.altName && (
            <span className="block font-display italic text-2xl sm:text-3xl mt-2" style={{ opacity: 0.55 }}>
              also called {festival.altName}
            </span>
          )}
        </h1>
        <div className="font-display italic text-2xl sm:text-3xl mt-3" style={{ color: accent }}>
          {festival.nameDevanagari}
        </div>

        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed" style={{ opacity: 0.8 }}>
          {festival.shortDesc}
        </p>

        {festival.needsReview && (
          <div className="mt-5 inline-flex items-start gap-2 px-3 py-2 rounded-xl text-xs max-w-2xl"
               style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              This entry covers a tradition that varies meaningfully between families and regions.
              The text below is a draft — community input from Maithili elders and scholars is especially welcome before this becomes the authoritative page.
            </span>
          </div>
        )}

        <div className="mt-7" style={{ color: accent, opacity: 0.5 }}>
          <BorderPattern />
        </div>
      </section>

      {/* KEY FACTS */}
      <section className="px-6 lg:px-10 pb-2 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-7"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <Fact icon={Sun} label="Honours" value={festival.honours} />
            <Fact icon={Calendar} label="Tithi" value={festival.tithi} />
            <Fact icon={Users} label="Category" value={CATEGORY_LABEL(festival.category)} />
            {festival.approxDate && (
              <Fact
                icon={MapPin}
                label="Approx. date"
                value={festival.approxDate.range}
                note={festival.approxDate.note}
              />
            )}
          </div>
        </div>
      </section>

      {/* IF NOT RICH: brief note then CTA */}
      {!festival.rich && (
        <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-7"
               style={{ background: "var(--cream-2)" }}>
            <div className="font-display text-xl leading-tight mb-3">
              More to come
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ opacity: 0.78 }}>
              We've outlined {festival.name} here with the key facts above and a short significance below.
              A fuller entry — with rituals, foods, songs, and regional variations — is planned for Phase 1,
              ideally co-written with Maithili contributors who celebrate it deeply.
            </p>
            <Section title="Significance" Icon={ScrollText} accent={accent}>
              <p className="text-[15px] leading-relaxed whitespace-pre-line" style={{ opacity: 0.85 }}>
                {festival.significance}
              </p>
            </Section>

            {festival.foods && festival.foods.length > 0 && (
              <div className="mt-6">
                <Section title="Foods of the festival" Icon={Soup} accent={accent}>
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {festival.foods.map((f, i) => (
                      <FoodChip key={i} food={f} />
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>
        </section>
      )}

      {/* IF RICH: full content */}
      {festival.rich && (
        <>
          {/* SIGNIFICANCE */}
          <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
            <Section title="Significance" Icon={ScrollText} accent={accent}>
              <p className="text-[15px] leading-relaxed whitespace-pre-line" style={{ opacity: 0.85 }}>
                {festival.significance}
              </p>
            </Section>
          </section>

          {/* RITUALS */}
          {festival.rituals && festival.rituals.length > 0 && (
            <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
              <Section title="Rituals" Icon={Sparkles} accent={accent}>
                <div className="space-y-3 mt-3">
                  {festival.rituals.map((r, i) => (
                    <div key={i}
                         className="rounded-2xl p-4 sm:p-5 border"
                         style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
                      <div className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-1.5"
                           style={{ color: accent }}>
                        {r.day}
                      </div>
                      <p className="text-[15px] leading-relaxed" style={{ opacity: 0.85 }}>
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            </section>
          )}

          {/* FOODS */}
          {festival.foods && festival.foods.length > 0 && (
            <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
              <Section title="Foods" Icon={Soup} accent={accent}>
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {festival.foods.map((f, i) => (
                    <FoodChip key={i} food={f} />
                  ))}
                </div>
              </Section>
            </section>
          )}

          {/* SONGS */}
          {festival.songs && festival.songs.length > 0 && (
            <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
              <Section title="Songs of the festival" Icon={Music} accent={accent}>
                <div className="space-y-2 mt-3">
                  {festival.songs.map((s, i) => (
                    <div key={i}
                         className="rounded-xl p-4 border flex items-start gap-3"
                         style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
                      <Music className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent, opacity: 0.7 }} />
                      <div>
                        <div className="font-display italic text-base" style={{ color: "var(--ink)" }}>
                          {s.name}
                        </div>
                        <div className="text-xs mt-1" style={{ opacity: 0.7 }}>
                          {s.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ opacity: 0.55 }}>
                  Songs referenced by title only. Full audio recordings by Maithili singers will be added in Phase 1.
                </p>
              </Section>
            </section>
          )}

          {/* REGIONAL VARIATIONS */}
          {festival.regional && (
            <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
              <Section title="Regional notes" Icon={MapPin} accent={accent}>
                <p className="text-[15px] leading-relaxed mt-3" style={{ opacity: 0.85 }}>
                  {festival.regional}
                </p>
              </Section>
            </section>
          )}

          {/* WHY IT MATTERS */}
          {festival.whyMatters && (
            <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
              <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                   style={{ background: "var(--ink)", color: "var(--paper)" }}>
                <div className="absolute -bottom-4 -right-4 opacity-15" style={{ color: accent }}>
                  <LotusMotif className="w-40 h-40" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4" style={{ color: accent }} fill="currentColor" />
                  <span className="text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: accent }}>
                    Why it matters to Mithila
                  </span>
                </div>
                <p className="font-display text-xl sm:text-2xl leading-snug max-w-2xl">
                  {festival.whyMatters}
                </p>
              </div>
            </section>
          )}
        </>
      )}

      {/* COMMUNITY INPUT */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4"
             style={{ background: "var(--cream-2)" }}>
          <div className="w-11 h-11 rounded-full grid place-items-center shrink-0"
               style={{ background: "var(--paper)", color: accent }}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-display text-lg leading-tight">
              Help improve this entry
            </div>
            <div className="text-sm mt-1" style={{ opacity: 0.75 }}>
              Does your family celebrate {festival.name} differently? Know songs, foods, or rituals we've missed?
              Tell us — every contribution makes the next reader's page better.
            </div>
          </div>
          <button
            onClick={() => alert("Community feedback form coming with Membership (Phase 1).")}
            className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
            style={{ background: "var(--ink)", color: "var(--paper)" }}>
            Suggest changes
          </button>
        </div>
      </section>

      {/* PREV / NEXT NAV */}
      <section className="px-6 lg:px-10 pt-2 pb-12 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-3">
          {prev && (
            <Link to={`/festivals/${prev.slug}`}
                  className="group rounded-2xl p-4 border flex items-center gap-3 transition-all hover:-translate-x-0.5"
                  style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
              <ChevronLeft className="w-4 h-4 shrink-0" style={{ opacity: 0.55 }} />
              <div>
                <div className="text-[10px] tracking-[0.18em] uppercase" style={{ opacity: 0.55 }}>
                  Previous
                </div>
                <div className="font-display text-base leading-tight">{prev.name}</div>
              </div>
            </Link>
          )}
          {next && (
            <Link to={`/festivals/${next.slug}`}
                  className="group rounded-2xl p-4 border flex items-center gap-3 transition-all hover:translate-x-0.5 sm:justify-end sm:text-right"
                  style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
              <div className="sm:order-1">
                <div className="text-[10px] tracking-[0.18em] uppercase" style={{ opacity: 0.55 }}>
                  Next
                </div>
                <div className="font-display text-base leading-tight">{next.name}</div>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 sm:order-2" style={{ opacity: 0.55 }} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

// ----- Small helpers ----------------------------------------

function CATEGORY_LABEL(cat) {
  if (cat === "flagship-mithila") return "Mithila signature";
  if (cat === "mithila") return "Mithila";
  if (cat === "pan-hindu") return "Pan-Hindu";
  return cat;
}

function Fact({ icon: Icon, label, value, note }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase mb-1.5"
           style={{ opacity: 0.55 }}>
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-sm leading-snug font-medium">{value}</div>
      {note && (
        <div className="text-[11px] mt-1 italic" style={{ opacity: 0.55 }}>
          {note}
        </div>
      )}
    </div>
  );
}

function Section({ title, Icon, accent, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4" style={{ color: accent }} />}
        <span className="font-display text-sm uppercase tracking-[0.2em]"
              style={{ color: "var(--vermillion-dark)" }}>
          {title}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }} />
      </div>
      {children}
    </div>
  );
}

function FoodChip({ food }) {
  return (
    <div className="rounded-xl p-3 border flex items-baseline gap-2"
         style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
      <span className="font-display italic text-base" style={{ color: "var(--vermillion)" }}>
        {food.name}
      </span>
      <span className="text-xs" style={{ opacity: 0.7 }}>— {food.desc}</span>
    </div>
  );
}
