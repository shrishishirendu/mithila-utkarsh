import { ScrollText } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";

export default function LiteraturePage() {
  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Coming soon"
        title="Literature"
        devanagari="साहित्य"
        description="The literary treasure of Mithila — from Vidyāpati's padāvalī to modern Maithili poetry and prose. Public-domain classics in full; a curated guide to the rest."
      />
      <section className="px-6 lg:px-10 max-w-3xl mx-auto">
        <div className="rounded-3xl p-8 text-center" style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
          <ScrollText className="w-8 h-8 mx-auto" style={{ color: "var(--vermillion-dark)", opacity: 0.6 }} />
          <div className="font-display text-xl mt-3">Sāhitya — coming soon</div>
          <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
            We're curating Maithili literature — beginning with Vidyāpati, the poet of Mithila. Check back soon.
          </p>
        </div>
        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}
