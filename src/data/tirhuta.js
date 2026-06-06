// ============================================================
// Tirhuta (Mithilakshar) transliteration
// ============================================================
// Two paths:
//   devanagariToTirhuta()  — EXACT. A deterministic 1:1 codepoint map between
//                            two Brahmic abugidas (same matra/virama logic).
//   romanToDevanagari()    — APPROXIMATE. Phonetic; Latin can't distinguish
//                            retroflex from dental, so t/th/d/dh/n/sh default
//                            to DENTAL/श. Use IAST diacritics or doubled vowels
//                            (aa, ii, uu) for precision; Devanagari for exactness.
//
// The Devanagari→Tirhuta map is verified against the brand wordmark:
//   मिथिला उत्कर्ष  →  𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭
// ============================================================

// Devanagari codepoint -> Tirhuta codepoint (U+11480 block).
const DEV_TIR_PAIRS = [
  // Independent vowels
  [0x0905, 0x11481], [0x0906, 0x11482], [0x0907, 0x11483], [0x0908, 0x11484],
  [0x0909, 0x11485], [0x090a, 0x11486], [0x090b, 0x11487], [0x0960, 0x11488],
  [0x090c, 0x11489], [0x0961, 0x1148a], [0x090f, 0x1148b], [0x0910, 0x1148c],
  [0x0913, 0x1148d], [0x0914, 0x1148e],
  // candra/short vowels -> nearest long-vowel equivalent
  [0x090d, 0x1148b], [0x090e, 0x1148b], [0x0911, 0x1148d], [0x0912, 0x1148d],

  // Consonants
  [0x0915, 0x1148f], [0x0916, 0x11490], [0x0917, 0x11491], [0x0918, 0x11492], [0x0919, 0x11493],
  [0x091a, 0x11494], [0x091b, 0x11495], [0x091c, 0x11496], [0x091d, 0x11497], [0x091e, 0x11498],
  [0x091f, 0x11499], [0x0920, 0x1149a], [0x0921, 0x1149b], [0x0922, 0x1149c], [0x0923, 0x1149d],
  [0x0924, 0x1149e], [0x0925, 0x1149f], [0x0926, 0x114a0], [0x0927, 0x114a1], [0x0928, 0x114a2],
  [0x092a, 0x114a3], [0x092b, 0x114a4], [0x092c, 0x114a5], [0x092d, 0x114a6], [0x092e, 0x114a7],
  [0x092f, 0x114a8], [0x0930, 0x114a9], [0x0932, 0x114aa], [0x0935, 0x114ab],
  [0x0936, 0x114ac], [0x0937, 0x114ad], [0x0938, 0x114ae], [0x0939, 0x114af],
  [0x0933, 0x114aa], // ळ LLA -> LA (no Tirhuta equivalent)

  // Vowel signs (matras)
  [0x093e, 0x114b0], [0x093f, 0x114b1], [0x0940, 0x114b2], [0x0941, 0x114b3], [0x0942, 0x114b4],
  [0x0943, 0x114b5], [0x0944, 0x114b6], [0x0962, 0x114b7], [0x0963, 0x114b8],
  [0x0947, 0x114b9], [0x0948, 0x114ba], [0x094b, 0x114bb], [0x094c, 0x114bc],
  [0x0945, 0x114b9], [0x0946, 0x114b9], [0x0949, 0x114bb], [0x094a, 0x114bb],

  // Signs
  [0x0901, 0x114bf], [0x0902, 0x114c0], [0x0903, 0x114c1], [0x094d, 0x114c2], [0x093c, 0x114c3],
  [0x093d, 0x114c4], [0x0950, 0x114c7],

  // Digits
  [0x0966, 0x114d0], [0x0967, 0x114d1], [0x0968, 0x114d2], [0x0969, 0x114d3], [0x096a, 0x114d4],
  [0x096b, 0x114d5], [0x096c, 0x114d6], [0x096d, 0x114d7], [0x096e, 0x114d8], [0x096f, 0x114d9],
];

const DEV_TO_TIR = new Map(
  DEV_TIR_PAIRS.map(([d, t]) => [String.fromCodePoint(d), String.fromCodePoint(t)])
);

// Exact, deterministic Devanagari -> Tirhuta.
export function devanagariToTirhuta(text) {
  if (!text) return "";
  // NFD decomposes precomposed nukta letters (क़, ड़, …) into base + nukta,
  // both of which are in the map.
  let out = "";
  for (const ch of text.normalize("NFD")) {
    out += DEV_TO_TIR.get(ch) ?? ch; // pass through spaces/danda/Latin/etc.
  }
  return out;
}

// ----- Approximate phonetic Roman -> Devanagari -----

// [token, independentVowel, matra]  — longest tokens first.
const R_VOWELS = [
  ["ai", "ऐ", "ै"], ["au", "औ", "ौ"],
  ["aa", "आ", "ा"], ["ā", "आ", "ा"],
  ["ii", "ई", "ी"], ["ī", "ई", "ी"], ["ee", "ई", "ी"],
  ["uu", "ऊ", "ू"], ["ū", "ऊ", "ू"], ["oo", "ऊ", "ू"],
  ["ṛ", "ऋ", "ृ"],
  ["a", "अ", ""], ["i", "इ", "ि"], ["u", "उ", "ु"],
  ["e", "ए", "े"], ["ē", "ए", "े"], ["o", "ओ", "ो"], ["ō", "ओ", "ो"],
];

// [token, consonant]  — longest first; dental/श defaults.
const R_CONS = [
  ["chh", "छ"], ["ṭh", "ठ"], ["ḍh", "ढ"],
  ["kh", "ख"], ["gh", "घ"], ["ch", "च"], ["jh", "झ"], ["th", "थ"], ["dh", "ध"],
  ["ph", "फ"], ["bh", "भ"], ["sh", "श"], ["ṣ", "ष"], ["ś", "श"], ["ng", "ङ"], ["ṅ", "ङ"],
  ["ny", "ञ"], ["ñ", "ञ"], ["ṭ", "ट"], ["ḍ", "ड"], ["ṇ", "ण"],
  ["k", "क"], ["g", "ग"], ["c", "च"], ["j", "ज"], ["t", "त"], ["d", "द"], ["n", "न"],
  ["p", "प"], ["f", "फ"], ["b", "ब"], ["m", "म"], ["y", "य"], ["r", "र"], ["l", "ल"],
  ["v", "व"], ["w", "व"], ["s", "स"], ["h", "ह"],
];

const R_SIGNS = [["ṃ", "ं"], ["ṁ", "ं"], ["ṅ̇", "ं"], ["ḥ", "ः"]];

function matchToken(list, src, pos) {
  const lower = src.toLowerCase();
  for (const entry of list) {
    const tok = entry[0];
    if (lower.startsWith(tok, pos)) return entry;
  }
  return null;
}

export function romanToDevanagari(text) {
  if (!text) return "";
  const src = text.normalize("NFC");
  let out = "";
  let i = 0;
  let pendingCons = false; // a consonant has been emitted, inherent 'a' unresolved
  while (i < src.length) {
    const c = matchToken(R_CONS, src, i);
    if (c) {
      if (pendingCons) out += "्"; // virama between consonants
      out += c[1];
      pendingCons = true;
      i += c[0].length;
      continue;
    }
    const v = matchToken(R_VOWELS, src, i);
    if (v) {
      out += pendingCons ? v[2] : v[1];
      pendingCons = false;
      i += v[0].length;
      continue;
    }
    const s = matchToken(R_SIGNS, src, i);
    if (s) {
      out += s[1];
      pendingCons = false;
      i += s[0].length;
      continue;
    }
    out += src[i]; // space/punctuation/unknown — inherent 'a' stays (no virama)
    pendingCons = false;
    i += 1;
  }
  return out;
}

// Convenience: returns both the Devanagari (for transparency) and the Tirhuta.
export function transliterate(text, mode) {
  const devanagari = mode === "roman" ? romanToDevanagari(text) : text;
  return { devanagari, tirhuta: devanagariToTirhuta(devanagari) };
}
