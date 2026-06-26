import { useState, useEffect } from "react";
import {
  Shirt, Book, Image as ImageIcon, Gift, Truck, Heart, ArrowUpRight, Loader2,
} from "lucide-react";
import {
  PageHero, CapabilityGrid, RoadmapBar, NotifyMe, PreviewCard,
} from "../components/PageBuildingBlocks.jsx";
import { FEATURED_PRODUCTS, ETSY_SHOP_URL } from "../data/shop.js";

const CAPABILITIES = [
  { icon: Shirt, title: "Apparel with intention",
    description: "T-shirts, hoodies, and saris with subtle Madhubani-inspired motifs — designed in collaboration with Mithil artists." },
  { icon: Book, title: "Books that matter",
    description: "Maithili primers, children's books in Tirhuta script, cookbooks, art monographs — curated, not just listed." },
  { icon: ImageIcon, title: "Madhubani prints",
    description: "Limited-edition prints commissioned directly from Madhubani artists, ethically sourced with full attribution." },
  { icon: Gift, title: "Festival kits",
    description: "Curated bundles for Chhath, Sama-Chakeva, and Vivaha Panchami — everything you need, gathered for the diaspora." },
  { icon: Truck, title: "Made & shipped by makers",
    description: "Artisan pieces ship from the makers; print-on-demand items print and post per order — no warehouse, no shortcuts." },
  { icon: Heart, title: "Margins fund the platform",
    description: "Every purchase keeps this app free and growing. Transparent reporting on where the money goes." },
];

const ROADMAP = [
  { id: "p0", when: "Now",   title: "Open the Etsy shop",  what: "Listings + Printful for merch" },
  { id: "p1", when: "Next",  title: "Surface on /shop",    what: "Branded grid, checkout on Etsy" },
  { id: "p2", when: "Then",  title: "First collection",    what: "First products go live" },
  { id: "p3", when: "Later", title: "Grow / graduate",    what: "Own store if we outgrow it" },
];

const CATEGORIES = [
  { name: "Apparel", icon: Shirt, tagline: "Wear it with pride" },
  { name: "Books", icon: Book, tagline: "Read it, share it" },
  { name: "Art prints", icon: ImageIcon, tagline: "Bring Mithila home" },
  { name: "Festival kits", icon: Gift, tagline: "Curated for the season" },
];

// ---- Live collection (Etsy listings, checkout on Etsy) ----
function ShopGrid({ products, shopUrl }) {
  return (
    <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <span className="font-display text-sm uppercase tracking-[0.2em]" style={{ color: "var(--vermillion-dark)" }}>
          The collection
        </span>
        {shopUrl && (
          <a href={shopUrl} target="_blank" rel="noreferrer"
             className="text-sm font-medium inline-flex items-center gap-1" style={{ color: "var(--vermillion)" }}>
            Visit our Etsy shop <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer"
             className="group rounded-2xl overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col"
             style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
            <div className="aspect-square overflow-hidden" style={{ background: "var(--cream-2)" }}>
              {p.image ? (
                <img src={p.image} alt={p.title} loading="lazy"
                     className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="w-full h-full grid place-items-center" style={{ color: "var(--vermillion)", opacity: 0.35 }}>
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="font-display text-base leading-snug line-clamp-2">{p.title}</div>
              <div className="mt-auto pt-3 flex items-center justify-between">
                {p.price && (
                  <span className="font-display text-lg" style={{ color: "var(--vermillion-dark)" }}>
                    {p.price}{p.currency ? ` ${p.currency}` : ""}
                  </span>
                )}
                <span className="text-xs font-medium inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                      style={{ color: "var(--vermillion)" }}>
                  View <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <p className="text-[11px] mt-4" style={{ opacity: 0.55 }}>
        Checkout is handled securely on Etsy. Prices shown as listed.
      </p>
    </section>
  );
}

// ---- Pre-launch content (shown until the Etsy shop has listings) ----
function ComingSoon() {
  return (
    <>
      <CapabilityGrid title="What's planned" capabilities={CAPABILITIES} accentColor="var(--vermillion)" />

      <PreviewCard eyebrow="Categories" title="What you'll find at launch" accentColor="var(--vermillion)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.name} className="rounded-2xl p-4 aspect-square flex flex-col justify-between"
                   style={{ background: "var(--cream)", border: "1px solid var(--cream-2)" }}>
                <div className="w-10 h-10 rounded-xl grid place-items-center"
                     style={{ background: "var(--paper)", color: "var(--vermillion)" }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display text-lg leading-tight">{c.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ opacity: 0.6 }}>{c.tagline}</div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-4" style={{ opacity: 0.6 }}>
          Madhubani prints will be limited editions, signed and numbered.
        </p>
      </PreviewCard>

      <RoadmapBar phases={ROADMAP} currentPhase="p0" accentColor="var(--vermillion)" />
      <NotifyMe ctaLabel="Tell me when the shop opens" accentColor="var(--vermillion)" />
    </>
  );
}

export default function MerchandisePage() {
  const [data, setData] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    fetch("/api/etsy-listings")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setData({ products: [] }); });
    return () => { cancelled = true; };
  }, []);

  // Live Etsy listings win when the API is connected; otherwise the curated list.
  const apiProducts = data?.products || [];
  const products = apiProducts.length > 0 ? apiProducts : FEATURED_PRODUCTS;
  const shopUrl = data?.shop_url || ETSY_SHOP_URL;
  const hasProducts = products.length > 0;

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Merchandise · दोकान"
        title="Wear the heritage."
        titleAccent="Read it. Share it."
        description="A small, carefully chosen store of apparel, books, Madhubani prints, and festival kits — designed with Mithil artists, with every purchase funding the platform that keeps the culture moving."
        phase={hasProducts ? undefined : "Opening soon"}
        accentColor="var(--vermillion)"
      />

      {data === null ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} />
        </div>
      ) : hasProducts ? (
        <ShopGrid products={products} shopUrl={shopUrl} />
      ) : (
        <ComingSoon />
      )}

      {/* Ethics note — always shown */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8" style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <div className="font-display text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "var(--turmeric)" }}>
            How we think about this
          </div>
          <p className="text-[15px] leading-relaxed" style={{ opacity: 0.85 }}>
            Cultural products are too often cheap reproductions made far from the
            culture they claim to represent. Our approach: source from the source.
            Madhubani prints commissioned from Madhubani artists. Books written by
            Maithili authors. Festival kits assembled in consultation with families
            who actually celebrate them. Margins shared, attribution visible, no shortcuts.
          </p>
        </div>
      </section>

      <div className="h-12" />
    </div>
  );
}
