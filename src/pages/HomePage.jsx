import { Link } from "react-router-dom";
import {
  BookOpen, BookA, CalendarHeart, Sparkles, ShoppingBag, UserCircle, ArrowRight
} from "lucide-react";
import { FishMotif, BorderPattern, LotusMotif } from "../components/Motifs.jsx";

const MODULES = [
  {
    path: "/learn",
    icon: BookOpen,
    label: "Mithilakshar",
    eyebrow: "Learn the script",
    description: "Vowels, consonants, mātrās, conjuncts — plus quiz and writing practice.",
    status: "Live now",
    statusColor: "var(--leaf)",
  },
  {
    path: "/dictionary",
    icon: BookA,
    label: "Dictionary",
    eyebrow: "Word by word, phrase by phrase",
    description: "Everyday words, Mithila-only native concepts, and fakrā — the proverbs that carry village wit.",
    status: "Live now",
    statusColor: "var(--leaf)",
  },
  {
    path: "/festivals",
    icon: CalendarHeart,
    label: "Pavain & Tyohar",
    eyebrow: "Festivals of Mithila",
    description: "13 festivals — Chhath, Sama-Chakeva, Madhushravani, Jur Sital — dates, rituals, songs.",
    status: "Live now",
    statusColor: "var(--leaf)",
  },
  {
    path: "/ghatkaiti",
    icon: Sparkles,
    label: "Ghatkaiti",
    eyebrow: "Auspicious moments",
    description: "Personalised auspicious-moment finder for weddings, naming, housewarming.",
    status: "Coming Phase 5",
    statusColor: "var(--indigo)",
  },
  {
    path: "/shop",
    icon: ShoppingBag,
    label: "Merchandise",
    eyebrow: "Wear the heritage",
    description: "Apparel, books, Madhubani prints — supporting the platform.",
    status: "Coming Phase 4",
    statusColor: "var(--vermillion)",
  },
  {
    path: "/membership",
    icon: UserCircle,
    label: "Membership",
    eyebrow: "Join the platform",
    description: "Free tier today. Premium $5/month or $50/year when ready.",
    status: "Free preview",
    statusColor: "var(--leaf)",
  },
];

export default function HomePage() {
  return (
    <div className="font-body" style={{ color: "var(--ink)" }}>
      {/* HERO */}
      <section className="px-6 lg:px-10 pt-10 pb-10 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--leaf)" }}>
              For the Maithil diaspora
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
              <span style={{ color: "var(--ink)" }}>The flourishing</span><br />
              <span className="italic" style={{ color: "var(--vermillion)" }}>of Mithila</span>
              <span style={{ color: "var(--ink)" }}> — carried to the world.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed" style={{ opacity: 0.78 }}>
              A digital home for the Maithil diaspora. Learn the script of our
              ancestors, walk through the festivals that shape our year, and stay
              connected to who we are — wherever in the world we are.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/learn"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}>
                Start with Mithilakshar <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/festivals"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border"
                    style={{ borderColor: "var(--cream-2)", background: "var(--paper)" }}>
                Explore festivals
              </Link>
            </div>
          </div>

          {/* Brand seal — Tirhuta wordmark as the logo */}
          <div className="order-1 lg:order-2">
            <div className="relative max-w-[420px] mx-auto rounded-3xl px-6 py-10 sm:px-8 sm:py-12 text-center"
                 style={{
                   background: "var(--paper)",
                   border: "1px solid var(--cream-2)",
                   boxShadow: "0 16px 40px -12px rgba(140, 42, 33, 0.18), 0 4px 12px -4px rgba(27, 26, 46, 0.08)"
                 }}>
              {/* Top aripan dots */}
              <div className="flex justify-center gap-2 mb-6" aria-hidden="true">
                {[0,1,2,3,4].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--vermillion)", opacity: 0.4 + (i === 2 ? 0.4 : 0) }} />
                ))}
              </div>

              {/* Tirhuta — primary brand mark */}
              <div className="font-tirhuta leading-tight"
                   style={{ color: "var(--vermillion)", fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}
                   title="Mithila Utkarsh in Tirhuta">
                𑒧𑒱𑒟𑒱𑒪𑒰
              </div>
              <div className="font-tirhuta leading-tight mt-1"
                   style={{ color: "var(--vermillion)", fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}>
                𑒅𑒞𑓂𑒏𑒩𑓂𑒭
              </div>

              {/* Roman — secondary */}
              <div className="font-display text-2xl sm:text-3xl mt-5"
                   style={{ color: "var(--vermillion-dark)" }}>
                Mithila Utkarsh
              </div>

              {/* Devanagari — tertiary */}
              <div className="text-base mt-1"
                   style={{ color: "var(--ink)", opacity: 0.6 }}>
                मिथिला उत्कर्ष
              </div>

              {/* Bottom decorative line */}
              <div className="mt-6 mb-2 flex items-center justify-center gap-2">
                <span className="h-px w-8" style={{ background: "var(--cream-2)" }} />
                <span className="font-display italic text-xs tracking-wider"
                      style={{ color: "var(--leaf)" }}>
                  Carrying Mithila to the world
                </span>
                <span className="h-px w-8" style={{ background: "var(--cream-2)" }} />
              </div>

              {/* Bottom aripan dots */}
              <div className="flex justify-center gap-2 mt-3" aria-hidden="true">
                {[0,1,2,3,4].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--vermillion)", opacity: 0.4 + (i === 2 ? 0.4 : 0) }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
          <BorderPattern />
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
          <div>
            <div className="font-display text-sm uppercase tracking-[0.2em] mb-3"
                 style={{ color: "var(--vermillion-dark)" }}>
              About this app
            </div>
            <p className="text-[15px] leading-relaxed" style={{ opacity: 0.78 }}>
              Mithila Utkarsh is built for the Maithil diaspora — the families,
              students, and second-generation children who live abroad and want a
              place to keep the language, the script, the festivals, and the
              traditions of Mithila close to hand.
            </p>
            <p className="text-[15px] leading-relaxed mt-3" style={{ opacity: 0.78 }}>
              Every module is drafted with care and intended to be refined with
              input from Maithili speakers, scholars, artists, and elders — so the
              content reflects how Mithila actually lives, not a textbook version of it.
            </p>
          </div>

          <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
               style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
            <div className="absolute -right-8 -bottom-8 opacity-10" style={{ color: "var(--vermillion)" }}>
              <LotusMotif className="w-44 h-44" />
            </div>
            <div className="font-display text-sm uppercase tracking-[0.2em] mb-3"
                 style={{ color: "var(--vermillion-dark)" }}>
              By the numbers
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-3xl leading-none">6</div>
                <div className="text-[11px] tracking-wider uppercase mt-1" style={{ opacity: 0.65 }}>
                  Modules
                </div>
              </div>
              <div>
                <div className="font-display text-3xl leading-none">13</div>
                <div className="text-[11px] tracking-wider uppercase mt-1" style={{ opacity: 0.65 }}>
                  Festivals
                </div>
              </div>
              <div>
                <div className="font-display text-3xl leading-none">65+</div>
                <div className="text-[11px] tracking-wider uppercase mt-1" style={{ opacity: 0.65 }}>
                  Maithili words
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES GRID */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-sm uppercase tracking-[0.2em]"
                style={{ color: "var(--vermillion-dark)" }}>
            What's inside
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.path} to={m.path}
                    className="group rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center"
                       style={{ background: "var(--cream)", color: "var(--vermillion)" }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] tracking-[0.15em] uppercase font-semibold"
                        style={{ color: m.statusColor }}>
                    {m.status}
                  </span>
                </div>
                <div className="text-[10px] tracking-wider uppercase" style={{ opacity: 0.55 }}>
                  {m.eyebrow}
                </div>
                <div className="font-display text-xl leading-tight mt-0.5"
                     style={{ color: "var(--ink)" }}>
                  {m.label}
                </div>
                <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.72 }}>
                  {m.description}
                </p>
                <div className="mt-3 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                     style={{ color: "var(--vermillion)" }}>
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CLOSING */}
      <section className="px-6 lg:px-10 py-10 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
             style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="absolute -top-4 -right-4 opacity-15" style={{ color: "var(--turmeric)" }}>
            <FishMotif className="w-48" />
          </div>
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--turmeric)" }}>
            Why this exists
          </div>
          <p className="font-display text-2xl sm:text-3xl leading-snug max-w-2xl">
            We grew up hearing a language and seeing a script our grandparents wrote in.
            Our children, born abroad, deserve to know it too.
            Mithila Utkarsh is the home where that knowledge lives — wherever we are.
          </p>
          <p className="font-display italic text-lg mt-5" style={{ color: "var(--turmeric)" }}>
            Carrying Mithila to the world.
          </p>
        </div>
      </section>

      <footer className="px-6 lg:px-10 pb-10 max-w-5xl mx-auto">
        <div style={{ color: "var(--turmeric)", opacity: 0.6 }}>
          <BorderPattern />
        </div>
        <div className="mt-3 text-xs" style={{ opacity: 0.55 }}>
          © Mithila Utkarsh · <span className="font-display italic">Carrying Mithila to the world</span>
        </div>
      </footer>
    </div>
  );
}
