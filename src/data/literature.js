// ============================================================
// Sāhitya — the literature of Mithila
// ============================================================
// Data-driven anthology, spanning Classical (Vidyāpati) → Contemporary.
// Same shape as blog.js / festivals.js: data here, pages just render it.
//
// HOW TO ADD A WORK
// -----------------
// 1. Pick (or add) an ERA id and an AUTHOR id below.
// 2. Add an entry to WORKS. The ONLY text you author is Maithili text in
//    Devanagari + (optional) a Roman transliteration + an English translation.
//    The Mithilakshar (Tirhuta) rendering is generated automatically from the
//    Devanagari — you never type Tirhuta by hand.
// 3. Set status: "published" once the text is verified. Until then leave it
//    "draft" — drafts are hidden from the public index when SHOW_DRAFTS = false.
//
// Multi-line verse: keep line breaks inside the string (use \n or a template
// literal). The reading view honours them in every script.
//
// NOTE ON THE SCAFFOLD: the eras and authors below are a starting point — real,
// well-known names and broad date ranges, meant to be corrected and expanded.
// The verse/prose text is intentionally left as bracketed placeholders for you
// to paste in. Nothing here invents a literary text.
// ============================================================

// Flip to false at launch to hide every "draft" entry from the public library.
// (Drafts stay reachable by direct URL so you can preview the reading view.)
export const SHOW_DRAFTS = false;

// ------------------------------------------------------------
// Eras — the periods of Maithili literature (broad, editable).
// ------------------------------------------------------------
export const ERAS = [
  {
    id: "classical",
    title: "Classical",
    devanagari: "विद्यापति-युग",
    span: "14th–15th century",
    blurb:
      "The age of Vidyāpati — the Maithil Kokil — whose padāvalī gave Maithili its written voice and was sung from Mithila to Bengal and Assam.",
  },
  {
    id: "bhakti",
    title: "Bhakti & Medieval",
    devanagari: "भक्ति-काल",
    span: "15th–18th century",
    blurb:
      "The devotional padāvalī tradition that followed Vidyāpati — songs of Rādhā and Kṛṣṇa, of Śiva and Śakti, and treatises like Lochana's Rāga-taraṅgiṇī.",
  },
  {
    id: "renaissance",
    title: "Renaissance",
    devanagari: "नवजागरण",
    span: "19th – early 20th century",
    blurb:
      "Print reaches Mithila. Chandā Jhā renders the Rāmāyaṇa into Maithili, scholars begin to gather and publish the old songs, and Maithili prose takes its first steps.",
  },
  {
    id: "modern",
    title: "Modern",
    devanagari: "आधुनिक काल",
    span: "20th century",
    blurb:
      "The Maithili novel and short story arrive — Harimohan Jhā's gentle satire — alongside poets such as Yātrī (Nāgārjun) and Surendra Jhā 'Suman'.",
  },
  {
    id: "contemporary",
    title: "Contemporary",
    devanagari: "समकालीन",
    span: "late 20th century – today",
    blurb:
      "Maithili recognised by the Sahitya Akademi and in the Constitution's Eighth Schedule — and now carried onward by diaspora and digital voices.",
  },
];

// ------------------------------------------------------------
// Authors — real, factual introductions (a starting scaffold you can expand).
// `blurb` is the one-line summary; `intro` is the longer note shown on the card.
// Dates are kept broad on purpose where the record is uncertain.
// ------------------------------------------------------------
export const AUTHORS = [
  {
    id: "vidyapati",
    name: "Vidyāpati",
    devanagari: "विद्यापति",
    era: "classical",
    dates: "14th–15th century",
    blurb: "The Maithil Kavi Kokil — father of Maithili poetry.",
    intro:
      "Revered as the Maithil Kavi Kokil, the 'poet-cuckoo of Mithila'. A court poet under the Oinwar kings, he sang of Rādhā and Kṛṣṇa and of Śiva and the Goddess in Maithili, alongside Sanskrit and Avahaṭṭha works such as Puruṣa-parīkṣā and Kīrtilatā. His padāvalī travelled far beyond Mithila — into Bengal, Assam and Odisha — and shaped the whole Vaishnava bhakti song tradition.",
  },
  {
    id: "lochana",
    name: "Lochana",
    devanagari: "लोचन",
    era: "bhakti",
    dates: "",
    blurb: "Compiler of the Rāga-taraṅgiṇī.",
    intro:
      "Traditionally credited with the Rāga-taraṅgiṇī, a treatise on rāga and song that gathered and classified many early padas — an important early source for how Maithili verse was sung.",
  },
  {
    id: "chanda-jha",
    name: "Chandā Jhā",
    devanagari: "चन्दा झा",
    era: "renaissance",
    dates: "19th century",
    blurb: "Author of the Mithilā-bhāṣā Rāmāyaṇa.",
    intro:
      "A leading poet of the Maithili renaissance, best known for the Mithilā-bhāṣā Rāmāyaṇa, which carried the Rāma story into everyday Maithili and helped establish the language in print.",
  },
  {
    id: "harimohan-jha",
    name: "Harimohan Jhā",
    devanagari: "हरिमोहन झा",
    era: "modern",
    dates: "1908–1984",
    blurb: "Novelist and satirist — Kanyādān, Dvirāgaman.",
    intro:
      "One of the most beloved figures of modern Maithili prose. His gently satirical novels Kanyādān and Dvirāgaman, and the witty Khattar Kakak Tarang, hold a mirror to Maithil society with affection and humour.",
  },
  {
    id: "yatri-nagarjun",
    name: "Yātrī (Nāgārjun)",
    devanagari: "यात्री / नागार्जुन",
    era: "modern",
    dates: "1911–1998",
    blurb: "A major poet in both Maithili and Hindi.",
    intro:
      "Baidyanāth Mishra wrote as 'Yātrī' in Maithili and as 'Nāgārjun' in Hindi. A people's poet with a sharp political voice, his Maithili verse helped bring the language firmly into the modern era.",
  },
];

// ------------------------------------------------------------
// Works — the texts themselves.
//
// Shape:
//   slug            unique, URL-safe (becomes /literature/<slug>)
//   title           English / roman title
//   titleDevanagari optional Devanagari title (rendered in Tirhuta too)
//   authorId        an AUTHORS id
//   era             an ERAS id
//   form            "pada" | "song" | "poem" | "couplet" | "prose"
//   status          "draft" | "published"
//   excerpt         one line shown on the index card
//   text: { devanagari, transliteration, translation }
//                   devanagari     — Maithili in Devanagari (Tirhuta auto-derived)
//                   transliteration— Roman (optional; toggle hidden if blank)
//                   translation    — English (optional)
//   notes           optional editorial note shown under the text
//   source          optional provenance line (edition, collection, etc.)
// ------------------------------------------------------------
export const WORKS = [
  {
    slug: "vidyapati-pada",
    title: "Pada",
    titleDevanagari: "पद",
    authorId: "vidyapati",
    era: "classical",
    form: "pada",
    status: "draft",
    excerpt: "A Vidyāpati pada — the verified text is being added.",
    text: {
      devanagari: "[ Maithili text in Devanagari — paste here ]",
      transliteration: "[ Roman transliteration — optional ]",
      translation: "[ English translation — paste here ]",
    },
    notes: "",
    source: "",
  },
  {
    slug: "bhakti-song",
    title: "Devotional song",
    titleDevanagari: "भक्ति-गीत",
    authorId: "lochana",
    era: "bhakti",
    form: "song",
    status: "draft",
    excerpt: "A devotional pada from the Bhakti era — text being added.",
    text: {
      devanagari: "[ Maithili text in Devanagari — paste here ]",
      transliteration: "",
      translation: "[ English translation — paste here ]",
    },
    notes: "",
    source: "",
  },
  {
    slug: "mithila-ramayana",
    title: "From the Mithilā-bhāṣā Rāmāyaṇa",
    titleDevanagari: "मिथिला-भाषा रामायण",
    authorId: "chanda-jha",
    era: "renaissance",
    form: "poem",
    status: "draft",
    excerpt: "A passage from Chandā Jhā's Maithili Rāmāyaṇa — text being added.",
    text: {
      devanagari: "[ Maithili text in Devanagari — paste here ]",
      transliteration: "",
      translation: "[ English translation — paste here ]",
    },
    notes: "",
    source: "",
  },
  {
    slug: "harimohan-jha-excerpt",
    title: "A prose excerpt",
    titleDevanagari: "गद्य",
    authorId: "harimohan-jha",
    era: "modern",
    form: "prose",
    status: "draft",
    excerpt: "A passage of modern Maithili prose — text being added.",
    text: {
      devanagari: "[ Maithili prose in Devanagari — paste here ]",
      transliteration: "",
      translation: "[ English translation — paste here ]",
    },
    notes: "",
    source: "",
  },
  {
    slug: "modern-poem",
    title: "A modern poem",
    titleDevanagari: "कविता",
    authorId: "yatri-nagarjun",
    era: "contemporary",
    form: "poem",
    status: "draft",
    excerpt: "A modern Maithili poem — text being added.",
    text: {
      devanagari: "[ Maithili text in Devanagari — paste here ]",
      transliteration: "",
      translation: "[ English translation — paste here ]",
    },
    notes: "",
    source: "",
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
export const FORM_LABELS = {
  pada: "Pada",
  song: "Song",
  poem: "Poem",
  couplet: "Couplet",
  prose: "Prose",
};

// Works visible in the public library (respects the SHOW_DRAFTS flag).
export function getVisibleWorks() {
  return SHOW_DRAFTS ? WORKS : WORKS.filter((w) => w.status === "published");
}

export function getWorksByEra(eraId) {
  return getVisibleWorks().filter((w) => w.era === eraId);
}

// Single work by slug — returns drafts too, so direct links always resolve.
export function getWork(slug) {
  return WORKS.find((w) => w.slug === slug) || null;
}

export function getAuthor(id) {
  return AUTHORS.find((a) => a.id === id) || null;
}

export function getAuthorsByEra(eraId) {
  return AUTHORS.filter((a) => a.era === eraId);
}

export function getEra(id) {
  return ERAS.find((e) => e.id === id) || null;
}
