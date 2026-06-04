// Navadhikara (year's officers) for Lakshmana Samvat 908 / Bangla Sann 1434 / Vikram Samvat 2083–84 / Gregorian 2026–27.
// Hard-coded from the printed Mithila Vishwavidyalaya Panchang. Future years require pandit-validated formulas.
// The year runs roughly Mesha Sankranti to Mesha Sankranti — ~14 April 2026 to ~13 April 2027.

export const PANCHANG_META_908 = {
  samvats: {
    lakshmana: 908,
    bangla: 1434,
    vikram: { from: 2083, to: 2084 },
    gregorian: { from: 2026, to: 2027 },
  },
  yearName: { devanagari: "रौद्र", roman: "Raudra" },
  cloudName: { devanagari: "पुरुष", roman: "Purush" },
  rainfall: 17,
  grain: 11,
  officers: [
    { role: "राजा",      roleEn: "King",        planet: "शनि",       planetEn: "Saturn" },
    { role: "मंत्री",     roleEn: "Minister",    planet: "मंगल",      planetEn: "Mars" },
    { role: "पालक",      roleEn: "Sustainer",   planet: "सूर्य",      planetEn: "Sun" },
    { role: "मेघाधिप",   roleEn: "Cloud-lord",  planet: "शुक्र",      planetEn: "Venus" },
    { role: "तोयाधिप",   roleEn: "Water-lord",  planet: "शनि",       planetEn: "Saturn" },
    { role: "शस्याधिप",  roleEn: "Crop-lord",   planet: "वृहस्पति",  planetEn: "Jupiter" },
    { role: "लोकाधिप",   roleEn: "People-lord", planet: "बुध",       planetEn: "Mercury" },
  ],
  validFrom: "2026-04-14",
  validTo:   "2027-04-13",
};

// Returns the meta block whose range contains the given ISO date, or null if out of range.
export function metaForDate(dateIso) {
  if (dateIso >= PANCHANG_META_908.validFrom && dateIso <= PANCHANG_META_908.validTo) {
    return PANCHANG_META_908;
  }
  return null;
}