import { Link } from "react-router-dom";
import {
  BookOpen, BookA, CalendarHeart, ShoppingBag, ArrowRight,
  ArrowRightLeft, Languages, Sun, Heart, Users, ScrollText, Palette
} from "lucide-react";
import { FishMotif, BorderPattern, LotusMotif } from "../components/Motifs.jsx";

const MODULES = [
  {
    path: "/learn",
    icon: BookOpen,
    label: "Mithilakshar",
    eyebrow: "Learn the script",
    description: "Vowels, consonants, mātrās, conjuncts — with quiz and writing practice.",
    status: "Live",
    statusColor: "var(--leaf)",
  },
  {
    path: "/dictionary",
    icon: BookA,
    label: "Dictionary",
    eyebrow: "Shabdkosh",
    description: "Everyday words, Mithila-only native concepts, and fakrā — the proverbs that carry village wit.",
    status: "Live",
    statusColor: "var(--leaf)",
  },
  {
    path: "/translate",
    icon: ArrowRightLeft,
    label: "Translation",
    eyebrow: "Anuvaadak",
    description: "English → Maithili — a curated lookup first, with an AI fallback for anything else.",
    status: "Live",
    statusColor: "var(--leaf)",
  },
  {
    path: "/tirhuta",
    icon: Languages,
    label: "Transliteration",
    eyebrow: "Lipi Pravartak",
    description: "Convert Devanagari or phonetic English into the Tirhuta (Mithilakshar) script.",
    status: "Live",
    statusColor: "var(--leaf)",
  },
  {
    path: "/festivals",
    icon: CalendarHeart,
    label: "Festivals",
    eyebrow: "Pavain & Tyohar",
    description: "Chhath, Sama-Chakeva, Madhushravani, Jur Sital — dates, rituals, songs.",
    status: "Live",
    statusColor: "var(--leaf)",
  },
  {
    path: "/panchang",
    icon: Sun,
    label: "Panchang",
    eyebrow: "Mithila almanac",
    description: "Tithi, nakshatra, festivals and the Maithili calendar — calculated for any city.",
    status: "Beta",
    statusColor: "var(--turmeric)",
  },
  {
    path: "/ghatkaiti",
    icon: Heart,
    label: "Matrimony",
    eyebrow: "Ghatkaiti",
    description: "Admin-mediated biodata — Mool, Gotra and family details, shared only by introduction.",
    status: "Live",
    statusColor: "var(--leaf)",
  },
  {
    path: "/members",
    icon: Users,
    label: "Member Directory",
    eyebrow: "Sadasya",
    description: "An opt-in register of Maithils abroad — district, village and profession.",
    status: "Members",
    statusColor: "var(--indigo)",
  },
  {
    path: "/shop",
    icon: ShoppingBag,
    label: "Shopping",
    eyebrow: "Bazar-Haat",
    description: "Apparel, books, Madhubani prints — supporting the platform.",
    status: "Coming",
    statusColor: "var(--vermillion)",
  },
  {
    path: "/literature",
    icon: ScrollText,
    label: "Literature",
    eyebrow: "Sahitya",
    description: "Vidyapati and Maithili writing — a reading corner, growing over time.",
    status: "Coming",
    statusColor: "var(--vermillion)",
  },
  {
    path: "/arts",
    icon: Palette,
    label: "Arts & Culture",
    eyebrow: "Kala evam Sanskriti",
    description: "Madhubani painting, music and craft — the living arts of Mithila.",
    status: "Coming",
    statusColor: "var(--vermillion)",
  },
];

export default function HomePage() {
  return (
    <div className="font-body" style={{ color: "var(--ink)" }}>
      {/* HERO */}
      <section className="px-6 lg:px-10 pt-10 pb-10 max-w-5xl mx-auto">
        {/* Headline */}
        <div className="max-w-2xl">
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--leaf)" }}>
            For the Maithil diaspora
          </div>
          <div className="font-tirhuta text-3xl sm:text-4xl leading-tight"
               style={{ color: "var(--vermillion)" }}
               title="Mithila Utkarsh in Tirhuta">
            𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mt-3">
            <span style={{ color: "var(--ink)" }}>The flourishing</span>{" "}
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

        {/* Janaki Mandir panorama — Sita's birthplace, the heart of Mithila */}
        <figure className="mt-9">
          <div className="relative rounded-3xl overflow-hidden"
               style={{
                 border: "1px solid var(--cream-2)",
                 boxShadow: "0 16px 40px -12px rgba(140, 42, 33, 0.18), 0 4px 12px -4px rgba(27, 26, 46, 0.08)",
               }}>
            <img
              src="/hero-janaki.jpg"
              alt="The Janaki Mandir at Janakpur — birthplace of Sita, in the heart of Mithila"
              className="w-full object-cover h-[180px] sm:h-[240px] lg:h-[300px]"
              style={{ objectPosition: "center" }}
              loading="eager"
            />
            {/* soft grounding gradient + caption */}
            <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                 style={{ background: "linear-gradient(to top, rgba(27,26,46,0.45), transparent)" }} />
            <figcaption className="absolute left-4 bottom-3 text-[11px] font-medium"
                        style={{ color: "var(--paper)", textShadow: "0 1px 4px rgba(0,0,0,0.55)" }}>
              Janaki Mandir, Janakpur — Sita's birthplace, in the heart of Mithila
            </figcaption>
          </div>
          <div className="mt-2 text-[10px]" style={{ opacity: 0.5 }}>
            Photo: Adutta.np / Wikimedia Commons ·{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer"
               className="underline">CC BY-SA 4.0</a>
          </div>
        </figure>

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
                <div className="font-display text-3xl leading-none">8</div>
                <div className="text-[11px] tracking-wider uppercase mt-1" style={{ opacity: 0.65 }}>
                  Live modules
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
