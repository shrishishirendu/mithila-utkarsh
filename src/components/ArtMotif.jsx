import { SunMotif, LotusMotif, FishMotif, PeacockMotif } from "./Motifs.jsx";

// Maps an ART_FORMS `motif` key to a Madhubani SVG. Used as the on-brand visual
// for any art form that doesn't yet have a properly-licensed photograph — so a
// card is never empty and never shows a broken image.
const MOTIFS = {
  sun: SunMotif,
  lotus: LotusMotif,
  fish: FishMotif,
  peacock: PeacockMotif,
};

export default function ArtMotif({ motif, className = "" }) {
  const Motif = MOTIFS[motif] || LotusMotif;
  return <Motif className={className} />;
}
