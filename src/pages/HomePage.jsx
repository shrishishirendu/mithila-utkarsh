import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { FishMotif, BorderPattern, LotusMotif, PaagMotif, JoraMaachhMotif } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";
import { PANCHANG_FESTIVALS } from "../data/panchang-festivals.js";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(aIso, bIso) {
  const [ay, am, ad] = aIso.split("-").map(Number);
  const [by, bm, bd] = bIso.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

// Next dated festival from the Panchang's पर्व सूची (chronological list).
function nextFestival(fromIso) {
  return PANCHANG_FESTIVALS.find((f) => f.date >= fromIso) || null;
}

// Vidyapati padavali — three of his most beloved lines.
// DRAFT: romanisation/translation are interpretive and the wording is from
// memory of the tradition — pending founder/scholar verification before we
// treat them as authoritative. Tirhuta is auto-generated from the Devanagari.
const VIDYAPATI_LINES = [
  {
    dev: "जय जय भैरवि असुर भयाउनि, पशुपति भामिनि माया।",
    en: "Victory, O Bhairavi — dread of the demons, beloved of Pashupati, the cosmic Maya.",
  },
  {
    dev: "की कहब हे सखि आनन्द ओर। चिर दिने माधव मन्दिर मोर॥",
    en: "What shall I say, dear friend, of the bounds of my joy — after an age, Madhava stands at my door.",
  },
  {
    dev: "सरस बसन्त समय भल पाबलि, दछिन पवन बहु धीरे।",
    en: "The sweet spring has come at last, the south wind blowing soft and slow.",
  },
];

export default function HomePage() {
  return (
    <div className="font-body" style={{ color: "var(--ink)" }}>
      {/* HERO */}
      <section className="px-6 lg:px-10 pt-10 pb-8 max-w-5xl mx-auto relative">
        {/* Paag watermark — a Maithil presence presiding over the welcome */}
        <div className="absolute top-3 right-2 w-32 sm:w-44 pointer-events-none hidden sm:block"
             style={{ color: "var(--vermillion)", opacity: 0.09 }} aria-hidden="true">
          <PaagMotif className="w-full" />
        </div>
        {/* Headline */}
        <div className="max-w-2xl relative">
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--leaf)" }}>
            For the Maithil diaspora
          </div>
          <div className="font-tirhuta text-3xl sm:text-4xl leading-tight"
               style={{ color: "var(--vermillion)" }}
               title="Mithila Utkarsh in Tirhuta">
            𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight mt-3 text-balance">
            <span style={{ color: "var(--ink)" }}>The flourishing</span>{" "}
            <span className="italic whitespace-nowrap" style={{ color: "var(--vermillion)" }}>of Mithila</span>
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
      </section>

      {/* AAJ — a living thread: today's Mithila date + the next festival */}
      <AajLine />

      {/* VIDYAPATI — the voice that greets you in the Dalaan */}
      <VidyapatiVoice />

      {/* WHY THIS EXISTS — the mission */}
      <section className="px-6 lg:px-10 py-10 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
             style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="absolute -top-6 -right-6 opacity-25" style={{ color: "var(--turmeric)" }}>
            <FishMotif className="w-52" />
          </div>
          <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--turmeric)" }}>
            Why this exists
          </div>
          <p className="font-display text-2xl sm:text-3xl leading-[1.42] tracking-[0.012em] max-w-2xl">
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
        {/* Mithila culture strip — line-art motifs (paag · joṛā-maachh · lotus) */}
        <div className="flex items-center justify-center gap-6 mb-4"
             style={{ color: "var(--vermillion)", opacity: 0.5 }} aria-hidden="true">
          <PaagMotif className="w-9" />
          <JoraMaachhMotif className="w-16" />
          <LotusMotif className="w-7" />
        </div>
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

// ============================================================
// Aaj — today's Mithila date (from the Panchang engine) + the next festival.
// Gives the Dalaan a live pulse; degrades gracefully if the API is unreachable.
// ============================================================
function AajLine() {
  const today = todayISO();
  const fest = nextFestival(today);
  const daysAway = fest ? daysBetween(today, fest.date) : null;
  const [pan, setPan] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Janakpur — Sita's city — as the reference location for "today in Mithila".
    fetch(`/api/panchang?date=${today}&lat=26.73&lon=85.93&tz=${encodeURIComponent("Asia/Kathmandu")}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (!cancelled) setPan(j); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [today]);

  const longDate = new Date(today + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const maas = pan?.maas?.purnimanta;
  const tithi = pan?.tithi;
  const countdown = daysAway === 0 ? "today" : daysAway === 1 ? "tomorrow" : `in ${daysAway} days`;

  return (
    <section className="px-6 lg:px-10 max-w-5xl mx-auto">
      <div className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 flex-wrap"
           style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
        <div className="flex items-center gap-2 shrink-0">
          <CalendarDays className="w-4 h-4" style={{ color: "var(--indigo)" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "var(--indigo)" }}>
            Aaj · आइ
          </span>
        </div>
        <div className="text-sm" style={{ opacity: 0.85 }}>
          {longDate}
          {maas && tithi && (
            <span style={{ opacity: 0.7 }}>
              {" · "}{maas.devanagari} {tithi.name}, {tithi.paksha === "shukla" ? "Shukla" : "Krishna"} paksha
            </span>
          )}
        </div>
        {fest && (
          <Link to={fest.slug ? `/festivals/${fest.slug}` : "/festivals"}
                aria-label={`Next festival: ${fest.nameEnglish}, ${countdown} — open in Festivals`}
                className="group sm:ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm shrink-0 transition-all hover:brightness-110 hover:shadow-sm focus:outline-none focus-visible:ring-2"
                style={{ background: "var(--vermillion-dark)", color: "var(--paper)" }}>
            <span style={{ opacity: 0.85 }}>Next:</span>
            <span className="font-display font-medium">{fest.nameEnglish}</span>
            <span style={{ opacity: 0.85 }}>· {countdown}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </section>
  );
}

// ============================================================
// Vidyapati's voice — a rotating padavali couplet (Tirhuta · Devanagari · English).
// The Kavi Kokil greets every visitor to the Dalaan.
// ============================================================
function VidyapatiVoice() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % VIDYAPATI_LINES.length), 8000);
    return () => clearInterval(id);
  }, []);
  const line = VIDYAPATI_LINES[i];

  return (
    <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <div className="relative rounded-3xl px-7 py-9 sm:px-10 sm:py-11 overflow-hidden text-center"
           style={{
             background: "var(--paper)",
             // Matted double frame — an outer cream line + a faint vermillion inner
             // rule, reminiscent of a bordered manuscript / aripan mount.
             boxShadow: "inset 0 0 0 1px var(--cream-2), inset 0 0 0 5px var(--paper), inset 0 0 0 6px rgba(193, 39, 45, 0.16)",
           }}>
        <div className="absolute -right-10 -bottom-10 pointer-events-none" style={{ color: "var(--vermillion)", opacity: 0.07 }}>
          <LotusMotif className="w-56 h-56" />
        </div>
        <div className="relative">
          {/* Aripan-style top border accent (Maithil line art) */}
          <div className="mx-auto max-w-[200px] mb-5" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
            <BorderPattern />
          </div>

          <div className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-5" style={{ color: "var(--leaf)" }}>
            Vidyapati · विद्यापति — Kavi Kokil of Mithila
          </div>

          {/* Primary — Tirhuta, the largest focal point */}
          <div className="font-tirhuta text-3xl sm:text-4xl leading-relaxed" style={{ color: "var(--vermillion-dark)" }}>
            {devanagariToTirhuta(line.dev)}
          </div>
          {/* Secondary — Devanagari, medium */}
          <div className="font-display text-xl sm:text-2xl mt-3 leading-snug" style={{ color: "var(--ink)" }}>
            {line.dev}
          </div>
          {/* Tertiary — English, a step smaller, italic and softened */}
          <div className="font-display italic text-base sm:text-lg mt-4 max-w-2xl mx-auto" style={{ color: "var(--ink)", opacity: 0.7 }}>
            “{line.en}”
          </div>

          <div className="flex justify-center gap-1.5 mt-6">
            {VIDYAPATI_LINES.map((_, k) => (
              <span key={k} className="w-1.5 h-1.5 rounded-full transition-opacity"
                    style={{ background: "var(--vermillion)", opacity: k === i ? 0.9 : 0.25 }} />
            ))}
          </div>

          {/* Aripan-style bottom border accent (mirrored) */}
          <div className="mx-auto max-w-[200px] mt-6 rotate-180" style={{ color: "var(--vermillion)", opacity: 0.5 }}>
            <BorderPattern />
          </div>
        </div>
      </div>
    </section>
  );
}
