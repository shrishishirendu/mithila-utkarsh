import { Palette } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

export default function ArtsPage() {
  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Coming soon"
        title="Arts & Culture"
        devanagari="कला एवं संस्कृति"
        description="The living arts of Mithila — Madhubani painting, Sama-Chakeva, sujani and sikki craft, music and dance."
      />
      <section className="px-6 lg:px-10 max-w-3xl mx-auto">
        <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
          <Palette className="w-8 h-8 mx-auto" style={{ color: "var(--vermillion-dark)", opacity: 0.6 }} />
          <div className="font-display text-xl mt-3">Kalā evaṁ Sanskriti — coming soon</div>
          <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
            A home for Mithila's visual and performing arts is on the way.
          </p>
        </div>
        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}
