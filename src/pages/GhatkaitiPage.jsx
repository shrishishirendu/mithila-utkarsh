import {
  Sparkles, FileText, Users, Clock, MapPin, ScrollText, Star
} from "lucide-react";
import {
  PageHero, CapabilityGrid, RoadmapBar, NotifyMe, PreviewCard
} from "../components/PageBuildingBlocks.jsx";

const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "Personalised muhurat",
    description: "Auspicious dates and times calculated against your family's traditions, not generic almanac entries.",
  },
  {
    icon: Users,
    title: "All life events",
    description: "Weddings, naming ceremonies (nāmkaraṇ), upanayan, housewarming (gṛhapraveśa), business openings — all in one place.",
  },
  {
    icon: Clock,
    title: "Multiple options ranked",
    description: "Not just one date — a ranked list of windows so you can plan around family and venue availability.",
  },
  {
    icon: MapPin,
    title: "Your timezone, calculated correctly",
    description: "Adjusted for your local time anywhere in the world, with sunrise/sunset based on coordinates — not generic IST.",
  },
  {
    icon: FileText,
    title: "Shareable PDF for your priest",
    description: "Export a formatted document with details, references, and explanations — ready to send to your family priest.",
  },
  {
    icon: ScrollText,
    title: "Maithili tradition, transparent",
    description: "Every recommendation explains which texts and customs it draws from, so nothing feels like a black box.",
  },
];

const ROADMAP = [
  { id: "p0", when: "M5",       title: "Calculation core", what: "Panchang engine, sunrise data" },
  { id: "p1", when: "M6",       title: "Customs library", what: "Maithili-specific rules" },
  { id: "p2", when: "M7",       title: "PDF + sharing",   what: "Document export" },
  { id: "p3", when: "M9 beta", title: "Premium beta",     what: "Paid members get early access" },
];

function GhatkaitiSampleCard() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="rounded-2xl p-5 border" style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4" style={{ color: "var(--indigo)" }} fill="currentColor" />
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: "var(--indigo)" }}>
            Top recommendation
          </span>
        </div>
        <div className="font-display text-2xl leading-tight">
          Vivaha Muhurat
        </div>
        <div className="text-sm mt-1" style={{ opacity: 0.7 }}>For wedding ceremony</div>

        <div className="mt-4 space-y-2 text-sm">
          <Row label="Date"     value="Friday, 4 Dec 2026" />
          <Row label="Window"   value="5:18 AM – 7:42 AM" />
          <Row label="Nakshatra" value="Rohini" />
          <Row label="Tithi"    value="Shukla Panchami" />
          <Row label="Rating"   value="★★★★★ (excellent)" />
        </div>
      </div>

      <div className="rounded-2xl p-5 border" style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
        <div className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-3"
             style={{ color: "var(--vermillion-dark)" }}>
          Alternative dates
        </div>
        <div className="space-y-3 text-sm">
          <AltRow date="Sat, 12 Dec 2026" window="6:02 AM – 8:14 AM" rating="★★★★☆" />
          <AltRow date="Wed, 23 Dec 2026" window="5:44 AM – 7:30 AM" rating="★★★★☆" />
          <AltRow date="Mon, 11 Jan 2027" window="6:18 AM – 8:48 AM" rating="★★★☆☆" />
        </div>
        <p className="text-xs mt-4" style={{ opacity: 0.6 }}>
          Based on Maithili Panji tradition. Adjusted for your location.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[10px] tracking-wider uppercase w-20 shrink-0" style={{ opacity: 0.55 }}>{label}</span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}

function AltRow({ date, window, rating }) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: "var(--cream)" }}>
      <div className="font-medium">{date}</div>
      <div className="flex items-baseline justify-between mt-0.5 text-xs" style={{ opacity: 0.7 }}>
        <span>{window}</span>
        <span style={{ color: "var(--turmeric)" }}>{rating}</span>
      </div>
    </div>
  );
}

export default function GhatkaitiPage() {
  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Ghatkaiti · Muhurat"
        title="The right moment,"
        titleAccent="calculated rightly."
        description="In Mithila, big moments — a wedding, a naming, a new home — aren't just scheduled, they're chosen. Ghatkaiti finds the auspicious windows for your life events, calculated against the Maithili Panji tradition and your real timezone."
        phase="Premium flagship · Phase 5"
        accentColor="var(--indigo)"
      >
        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold"
             style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <Sparkles className="w-3 h-3" style={{ color: "var(--turmeric)" }} /> Paid tier
        </div>
      </PageHero>

      <CapabilityGrid
        title="What's planned"
        capabilities={CAPABILITIES}
        accentColor="var(--indigo)"
      />

      <PreviewCard
        eyebrow="Sample result"
        title="Wedding muhurat — what the answer will look like"
        accentColor="var(--indigo)"
      >
        <GhatkaitiSampleCard />
        <p className="text-xs mt-4" style={{ opacity: 0.6 }}>
          Mock-up — calculation engine will use real panchang data and Maithili-specific rules.
          Dates shown are illustrative.
        </p>
      </PreviewCard>

      {/* Why it matters callout */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8"
             style={{ background: "var(--cream-2)" }}>
          <div className="font-display text-sm uppercase tracking-[0.2em] mb-3"
               style={{ color: "var(--vermillion-dark)" }}>
            Why this matters
          </div>
          <p className="text-[15px] leading-relaxed" style={{ opacity: 0.8 }}>
            Most Hindu calendars on the internet assume north Indian customs and IST.
            For a Mithil family in Sydney planning a wedding for cousins in Toronto and Janakpur,
            none of that is quite right. Ghatkaiti is built specifically for our tradition,
            for our diaspora, with the math done in your timezone — not converted from it.
          </p>
        </div>
      </section>

      <RoadmapBar
        phases={ROADMAP}
        currentPhase="p0"
        accentColor="var(--indigo)"
      />

      <NotifyMe ctaLabel="Tell me when it's ready" accentColor="var(--indigo)" />

      <div className="h-12" />
    </div>
  );
}
