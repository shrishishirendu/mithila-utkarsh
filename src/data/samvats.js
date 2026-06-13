// Calendar-year systems for the Mithila panchang, derived from a Gregorian (ISO) date.
//
// Anchored to the printed Mithila Vishwavidyalaya Panchang block in
// panchang-meta-908.js — La. Sam. 908 = Bangla 1434 = Vikram 2083–84 =
// Gregorian 2026-04-14 … 2027-04-13. The offsets below REPRODUCE that block
// exactly (so the current year's display is unchanged) and extrapolate to any year.
//
// The civil year turns at Mesha Sankranti (~14 April). We approximate that
// boundary as 14 April; the exact instant (13–15 Apr) needs the ephemeris and
// only matters for a few days around the turn — fine for naming the *year*.
//
// NOTE: the Bangla offset reproduces the printed-panchang value (1434 for 2026);
// the Bangla epoch is worth a pandit's confirmation before leaning on far years.

export function computeSamvats(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  // Gregorian year in which the running Mithila year began.
  const G = (m > 4 || (m === 4 && d >= 14)) ? y : y - 1;
  return {
    lakshmana: G - 1118,
    bangla:    G - 592,
    saka:      G - 78,
    vikram:    { from: G + 57, to: G + 58 },
    gregorian: { from: G,      to: G + 1 },
  };
}
