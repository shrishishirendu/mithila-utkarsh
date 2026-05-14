import {
  Shirt, Book, Image as ImageIcon, Gift, Truck, Heart
} from "lucide-react";
import {
  PageHero, CapabilityGrid, RoadmapBar, NotifyMe, PreviewCard
} from "../components/PageBuildingBlocks.jsx";

const CAPABILITIES = [
  {
    icon: Shirt,
    title: "Apparel with intention",
    description: "T-shirts, hoodies, and saris with subtle Madhubani-inspired motifs — designed in collaboration with Mithil artists.",
  },
  {
    icon: Book,
    title: "Books that matter",
    description: "Maithili primers, children's books in Tirhuta script, cookbooks, art monographs — curated, not just listed.",
  },
  {
    icon: ImageIcon,
    title: "Madhubani prints",
    description: "Limited-edition prints commissioned directly from Madhubani artists, ethically sourced with full attribution.",
  },
  {
    icon: Gift,
    title: "Festival kits",
    description: "Curated bundles for Chhath, Sama-Chakeva, and Vivaha Panchami — everything you need, gathered for the diaspora.",
  },
  {
    icon: Truck,
    title: "Ships from Australia",
    description: "Local fulfilment, AUD pricing, no customs surprises. Australia-wide first, then expanding.",
  },
  {
    icon: Heart,
    title: "Margins fund the platform",
    description: "Every purchase keeps this app free and growing. Transparent reporting on where the money goes.",
  },
];

const ROADMAP = [
  { id: "p0", when: "M7",       title: "Vendor onboarding", what: "Artists, printers, suppliers" },
  { id: "p1", when: "M8",       title: "Shopify integration", what: "Headless store + checkout" },
  { id: "p2", when: "M9",       title: "Launch collection", what: "First 12 products live" },
  { id: "p3", when: "M10 live", title: "Open to all members", what: "Free + paid both shop" },
];

const CATEGORIES = [
  { name: "Apparel",      icon: Shirt,      tagline: "Wear it with pride" },
  { name: "Books",        icon: Book,       tagline: "Read it, share it" },
  { name: "Art prints",   icon: ImageIcon,  tagline: "Bring Mithila home" },
  { name: "Festival kits", icon: Gift,       tagline: "Curated for the season" },
];

export default function MerchandisePage() {
  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Merchandise"
        title="Wear the heritage."
        titleAccent="Read it. Share it."
        description="A small, carefully chosen store of apparel, books, Madhubani prints, and festival kits — designed with Mithil artists, fulfilled from Australia, with every purchase funding the platform that keeps the culture moving."
        phase="Coming Phase 4 · Month 10"
        accentColor="var(--vermillion)"
      />

      <CapabilityGrid
        title="What's planned"
        capabilities={CAPABILITIES}
        accentColor="var(--vermillion)"
      />

      <PreviewCard
        eyebrow="Categories"
        title="What you'll find at launch"
        accentColor="var(--vermillion)"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.name}
                   className="rounded-2xl p-4 aspect-square flex flex-col justify-between"
                   style={{ background: "var(--cream)", border: "1px solid var(--cream-2)" }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center"
                     style={{ background: "var(--paper)", color: "var(--vermillion)" }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display text-lg leading-tight">{c.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ opacity: 0.6 }}>
                    {c.tagline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-4" style={{ opacity: 0.6 }}>
          12 products planned for launch across these four categories. Madhubani prints will be limited editions, signed and numbered.
        </p>
      </PreviewCard>

      {/* Ethics note */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8"
             style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="font-display text-sm uppercase tracking-[0.2em] mb-3"
               style={{ color: "var(--turmeric)" }}>
            How we think about this
          </div>
          <p className="text-[15px] leading-relaxed" style={{ opacity: 0.85 }}>
            Cultural products are too often cheap reproductions made far from the
            culture they claim to represent. Our approach: source from the source.
            Madhubani prints commissioned from Madhubani artists.
            Books written by Maithili authors. Festival kits assembled in consultation
            with families who actually celebrate them. Margins shared, attribution
            visible, no shortcuts.
          </p>
        </div>
      </section>

      <RoadmapBar
        phases={ROADMAP}
        currentPhase="p0"
        accentColor="var(--vermillion)"
      />

      <NotifyMe ctaLabel="Tell me when the shop opens" accentColor="var(--vermillion)" />

      <div className="h-12" />
    </div>
  );
}
