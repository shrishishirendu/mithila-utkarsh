// ============================================================
// Maithili phrasebook + lookup-based translation (NO LLM)
// ============================================================
// Maithili is stored in Devanagari only; Tirhuta is derived at render via
// devanagariToTirhuta(). Translation is deterministic lookup:
//   1. whole-phrase exact match (phrasebook)  -> best, human-written
//   2. single-word dictionary match           -> reliable
//   3. word-by-word gloss                      -> rough, grammar NOT adjusted
//
// HONESTY: phrases marked `draft: true` are AI-drafted and need verification by
// the founder / a Maithili speaker before being treated as authoritative. The
// UI badges them. Maithili pronouns/verbs used: हम (I), हमर (my), अहाँ (you,
// honorific), अहाँक (your), अछि (is), छी (am/are) — these are distinctively
// Maithili, not Hindi.
// ============================================================

import { WORDS } from "./dictionary.js";

export const PHRASE_CATEGORIES = [
  { id: "greetings", label: "Greetings & courtesy" },
  { id: "intro",     label: "Introductions" },
  { id: "everyday",  label: "Everyday" },
];

// Maithili in Devanagari (`dev`); Tirhuta derived on the fly.
export const PHRASES = [
  // ----- Greetings & courtesy (mostly from verified dictionary words) -----
  { id: "pranam",      english: "Hello / greetings",        dev: "प्रणाम",                 iast: "praṇām",              category: "greetings", draft: false, note: "Respectful greeting, especially to elders." },
  { id: "jai-mithila", english: "Hail Mithila",             dev: "जय मिथिला",              iast: "jay mithilā",         category: "greetings", draft: false },
  { id: "dhanyavad",   english: "Thank you",                dev: "धन्यवाद",                iast: "dhanyavād",           category: "greetings", draft: false },
  { id: "maf-karu",    english: "Please forgive me / excuse me", dev: "माफ करू",           iast: "māf karū",            category: "greetings", draft: false, note: "'karū' is the Maithili imperative." },
  { id: "ki-hal",      english: "How are you?",             dev: "की हाल?",                iast: "kī hāl?",             category: "greetings", draft: false, note: "Lit. 'what condition'. Reply: भाल (bhāl) — good." },
  { id: "kehan-chi",   english: "How are you? (honorific)", dev: "अहाँ केहन छी?",          iast: "ahā̃ kehan chī?",      category: "greetings", draft: true },
  { id: "ham-thik",    english: "I am fine",                dev: "हम ठीक छी",              iast: "ham ṭhīk chī",        category: "greetings", draft: true },

  // ----- Introductions -----
  { id: "naam-ki",     english: "What is your name?",       dev: "अहाँक नाम की अछि?",      iast: "ahā̃k nām kī achi?",   category: "intro", draft: true },
  { id: "hamar-naam",  english: "My name is …",             dev: "हमर नाम … अछि",          iast: "hamar nām … achi",    category: "intro", draft: true },
  { id: "katay-se",    english: "Where are you from?",      dev: "अहाँ कतय सँ छी?",        iast: "ahā̃ katay sã chī?",   category: "intro", draft: true },
  { id: "mithila-se",  english: "I am from Mithila",        dev: "हम मिथिला सँ छी",        iast: "ham mithilā sã chī",  category: "intro", draft: true },

  // ----- Everyday -----
  { id: "ha",          english: "Yes",                      dev: "हँ",                     iast: "hã",                  category: "everyday", draft: true },
  { id: "nahi",        english: "No",                       dev: "नहि",                    iast: "nahi",                category: "everyday", draft: true },
  { id: "aau",         english: "Please come",              dev: "आउ",                     iast: "āu",                  category: "everyday", draft: true },
  { id: "baisu",       english: "Please sit",               dev: "बैसू",                   iast: "baisū",               category: "everyday", draft: true },
  { id: "calu",        english: "Let's go",                 dev: "चलू",                    iast: "calū",                category: "everyday", draft: true },
  { id: "bhukh",       english: "I am hungry",              dev: "हमरा भूख लागल अछि",      iast: "hamrā bhūkh lāgal achi", category: "everyday", draft: true },
  { id: "ham-bujhi",   english: "I understand",             dev: "हम बुझि गेलहुँ",         iast: "ham bujhi gelahũ",    category: "everyday", draft: true },
];

// ----- normalization + indexes -----

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// English term(s) for a dictionary entry, stripped of parentheticals.
function englishTerms(entry) {
  const list = Array.isArray(entry.english) ? entry.english : [entry.english];
  const terms = [];
  for (const e of list) {
    const base = e.replace(/\(.*?\)/g, " ");
    base.split(/[/,;]/).forEach((t) => {
      const tt = norm(t);
      if (tt) terms.push(tt);
    });
  }
  return terms;
}

const WORD_INDEX = (() => {
  const map = new Map();
  for (const w of WORDS) {
    for (const t of englishTerms(w)) {
      if (!map.has(t)) map.set(t, w);
    }
  }
  return map;
})();

const PHRASE_INDEX = (() => {
  const map = new Map();
  for (const p of PHRASES) map.set(norm(p.english), p);
  return map;
})();

export function lookupWord(token) {
  return WORD_INDEX.get(norm(token)) || null;
}

// Returns a structured result; the page derives Tirhuta + IAST for display.
export function translateToMaithili(text) {
  const input = (text || "").trim();
  if (!input) return { kind: "empty" };
  const key = norm(input);

  // 1. whole-phrase exact match
  const phrase = PHRASE_INDEX.get(key);
  if (phrase) {
    return { kind: "phrase", dev: phrase.dev, iast: phrase.iast, note: phrase.note, draft: phrase.draft, source: input };
  }

  const tokens = key.split(" ").filter(Boolean);

  // 2. single word
  if (tokens.length === 1) {
    const w = lookupWord(tokens[0]);
    if (w) return { kind: "word", dev: w.dev, iast: w.iast, note: w.note, entry: w, source: input };
    return { kind: "none", source: input };
  }

  // 3. word-by-word gloss (rough)
  const parts = tokens.map((tok) => {
    const w = lookupWord(tok);
    return w ? { token: tok, dev: w.dev, iast: w.iast, known: true } : { token: tok, known: false };
  });
  if (!parts.some((p) => p.known)) return { kind: "none", source: input };
  return { kind: "gloss", parts, source: input };
}
