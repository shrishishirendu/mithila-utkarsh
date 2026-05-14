// ============================================================
// Maithili Starter Dictionary
// ============================================================
//
// Three sections, each clearly marked as draft:
//   1. WORDS     — common vocabulary (family, food, time, etc.)
//   2. NATIVE    — Mithila-only concepts that have no Hindi equivalent
//   3. FAKRĀ     — Maithili idioms, proverbs, sayings
//
// HONESTY NOTES:
// - All three sections are STARTERS drafted from general knowledge.
//   Native words and fakrā especially need community verification.
// - Tirhuta included only where verifiable character by character.
// - Maithili has dialect variations (Tirhutia, Saptari, etc.). The
//   most widely used form is shown; alternates noted where helpful.
// - The "distinctive" flag flags words that differ meaningfully from
//   Hindi — these are the words the diaspora loses first.
// ============================================================

export const CATEGORIES = [
  { id: "family",      label: "Family & Relations",  icon: "Users" },
  { id: "greetings",   label: "Greetings",           icon: "MessageCircle" },
  { id: "numbers",     label: "Numbers",             icon: "Hash" },
  { id: "time",        label: "Time & Calendar",     icon: "Clock" },
  { id: "food",        label: "Food",                icon: "Soup" },
  { id: "body",        label: "Body Parts",          icon: "User" },
  { id: "verbs",       label: "Common Verbs",        icon: "PlayCircle" },
  { id: "adjectives",  label: "Adjectives",          icon: "Sparkles" },
  { id: "nature",      label: "Nature",              icon: "Sun" },
  { id: "festival",    label: "Ritual & Festival",   icon: "Flame" },
  { id: "everyday",    label: "Everyday",            icon: "Home" },
];

export const WORDS = [
  // ---------- Family ----------
  { id: "mai",      dev: "मै",        tirhuta: "𑒧𑒻",        iast: "mai",      english: "mother",                                  hindi: "माँ (mā̃)",         category: "family",    pos: "noun", distinctive: true,  note: "The everyday Maithili word for mother. More formal: मैया (maiyā)." },
  { id: "babu",     dev: "बाबू",      tirhuta: "𑒥𑒰𑒥𑒴",      iast: "bābū",     english: "father",                                  hindi: "पिता (pitā)",       category: "family",    pos: "noun", distinctive: true,  note: "Everyday Maithili for father. Sometimes 'babuji' as a respectful form." },
  { id: "dada",     dev: "दादा",      tirhuta: "𑒠𑒰𑒠𑒰",      iast: "dādā",     english: "paternal grandfather",                    hindi: "दादा",             category: "family",    pos: "noun" },
  { id: "dadi",     dev: "दादी",      tirhuta: "𑒠𑒰𑒠𑒲",      iast: "dādī",     english: "paternal grandmother",                    hindi: "दादी",             category: "family",    pos: "noun" },
  { id: "nana",     dev: "नाना",      tirhuta: "𑒢𑒰𑒢𑒰",      iast: "nānā",     english: "maternal grandfather",                    hindi: "नाना",             category: "family",    pos: "noun" },
  { id: "nani",     dev: "नानी",      tirhuta: "𑒢𑒰𑒢𑒲",      iast: "nānī",     english: "maternal grandmother",                    hindi: "नानी",             category: "family",    pos: "noun" },
  { id: "mama",     dev: "मामा",      tirhuta: "𑒧𑒰𑒧𑒰",      iast: "māmā",     english: "maternal uncle (mother's brother)",       hindi: "मामा",             category: "family",    pos: "noun" },
  { id: "mami",     dev: "मामी",      tirhuta: "𑒧𑒰𑒧𑒲",      iast: "māmī",     english: "maternal uncle's wife",                   hindi: "मामी",             category: "family",    pos: "noun" },
  { id: "kaka",     dev: "काका",      tirhuta: "𑒏𑒰𑒏𑒰",      iast: "kākā",     english: "paternal uncle (father's younger brother)", hindi: "चाचा (cācā)",    category: "family",    pos: "noun", distinctive: true, note: "Maithili uses 'kākā' where Hindi uses 'chāchā'." },
  { id: "kaki",     dev: "काकी",      tirhuta: "𑒏𑒰𑒏𑒲",      iast: "kākī",     english: "paternal uncle's wife",                   hindi: "चाची (cācī)",      category: "family",    pos: "noun", distinctive: true },
  { id: "didi",     dev: "दीदी",      tirhuta: "𑒠𑒲𑒠𑒲",      iast: "dīdī",     english: "older sister",                            hindi: "दीदी",             category: "family",    pos: "noun" },
  { id: "bhaiya",   dev: "भैया",                              iast: "bhaiyā",    english: "older brother",                           hindi: "भैया",             category: "family",    pos: "noun" },
  { id: "beta",     dev: "बेटा",      tirhuta: "𑒥𑒹𑒙𑒰",      iast: "beṭā",     english: "son",                                     hindi: "बेटा",             category: "family",    pos: "noun" },
  { id: "beti",     dev: "बेटी",      tirhuta: "𑒥𑒹𑒙𑒲",      iast: "beṭī",     english: "daughter",                                hindi: "बेटी",             category: "family",    pos: "noun" },
  { id: "ghar-wali", dev: "घरवाली",                            iast: "gharwālī", english: "wife (lit. 'one of the house')",          hindi: "पत्नी (patnī)",     category: "family",    pos: "noun", distinctive: true, note: "Informal Maithili. Formal: पत्नी (patnī)." },

  // ---------- Greetings ----------
  { id: "pranam",       dev: "प्रणाम",                          iast: "praṇām",      english: "respectful greeting (especially to elders)", hindi: "प्रणाम", category: "greetings", pos: "interj", note: "The most common respectful greeting in Mithila." },
  { id: "namaskar",     dev: "नमस्कार",                         iast: "namaskār",    english: "hello / greetings",                        hindi: "नमस्कार", category: "greetings", pos: "interj" },
  { id: "dhanyavad",    dev: "धन्यवाद",                         iast: "dhanyavād",   english: "thank you",                                hindi: "धन्यवाद", category: "greetings", pos: "interj" },
  { id: "jai-mithila",  dev: "जय मिथिला",                       iast: "jay mithilā", english: "Hail Mithila (cultural greeting)",        hindi: "जय मिथिला", category: "greetings", pos: "phrase", distinctive: true, note: "A Mithil-specific greeting and cheer." },
  { id: "ki-hal",       dev: "की हाल?",                         iast: "kī hāl?",     english: "how are you?",                             hindi: "क्या हाल है? (kyā hāl hai?)", category: "greetings", pos: "phrase", distinctive: true, note: "Literally 'what condition'. Reply: 'भाल (bhāl)' — good." },
  { id: "maf-karu",     dev: "माफ करू",                         iast: "māf karū",    english: "please forgive / excuse me",               hindi: "माफ कीजिए (māf kījie)", category: "greetings", pos: "phrase", distinctive: true, note: "'karū' is the Maithili imperative form." },

  // ---------- Numbers ----------
  { id: "ek",   dev: "एक",    tirhuta: "𑒋𑒏",   iast: "ek",   english: "one",   hindi: "एक",  category: "numbers", pos: "num" },
  { id: "du",   dev: "दू",    tirhuta: "𑒠𑒴",   iast: "dū",   english: "two",   hindi: "दो (do)", category: "numbers", pos: "num", distinctive: true, note: "Maithili 'dū' vs Hindi 'do'." },
  { id: "tin",  dev: "तीन",   tirhuta: "𑒞𑒲𑒢", iast: "tīn",  english: "three", hindi: "तीन", category: "numbers", pos: "num" },
  { id: "cari", dev: "चारि",                  iast: "cāri", english: "four",  hindi: "चार (cār)", category: "numbers", pos: "num", distinctive: true, note: "Maithili 'cāri' vs Hindi 'cār'." },
  { id: "panch",dev: "पाँच",                  iast: "pā̃c",  english: "five",  hindi: "पाँच", category: "numbers", pos: "num" },
  { id: "chha", dev: "छह",                    iast: "chah", english: "six",   hindi: "छह",  category: "numbers", pos: "num" },
  { id: "sat",  dev: "सात",                   iast: "sāt",  english: "seven", hindi: "सात", category: "numbers", pos: "num" },
  { id: "ath",  dev: "आठ",                    iast: "āṭh",  english: "eight", hindi: "आठ",  category: "numbers", pos: "num" },
  { id: "nau",  dev: "नौ",                    iast: "nau",  english: "nine",  hindi: "नौ",  category: "numbers", pos: "num" },
  { id: "das",  dev: "दस",                    iast: "das",  english: "ten",   hindi: "दस",  category: "numbers", pos: "num" },

  // ---------- Time ----------
  { id: "aju",     dev: "आजु",                    iast: "āju",     english: "today",                                    hindi: "आज (āj)",         category: "time", pos: "adv", distinctive: true, note: "Maithili 'āju' vs Hindi 'āj'." },
  { id: "kalhi",   dev: "काल्हि",                  iast: "kālhi",   english: "tomorrow / yesterday (context decides!)",  hindi: "कल (kal)",        category: "time", pos: "adv", distinctive: true, note: "One of Maithili's most striking features — the same word means both 'tomorrow' and 'yesterday'; context tells you which." },
  { id: "parsu",   dev: "परसू",                    iast: "parsū",   english: "day after tomorrow / day before yesterday", hindi: "परसों (parso)",  category: "time", pos: "adv", distinctive: true, note: "Like kālhi, parsū is bidirectional." },
  { id: "bhor",    dev: "भोर",                     iast: "bhor",    english: "morning",                                  hindi: "सुबह (subah)",     category: "time", pos: "noun", distinctive: true },
  { id: "dupahar", dev: "दुपहर",                   iast: "dupahar", english: "noon / midday",                            hindi: "दोपहर (dopahar)", category: "time", pos: "noun" },
  { id: "sanjh",   dev: "साँझ",                    iast: "sā̃jh",    english: "evening",                                  hindi: "शाम (śām)",       category: "time", pos: "noun", distinctive: true },
  { id: "rati",    dev: "राति",                    iast: "rāti",    english: "night",                                    hindi: "रात (rāt)",       category: "time", pos: "noun", distinctive: true },
  { id: "abhi",    dev: "अभी",                     iast: "abhi",    english: "now",                                      hindi: "अभी",             category: "time", pos: "adv" },

  // ---------- Food ----------
  { id: "bhat",     dev: "भात",       tirhuta: "𑒦𑒰𑒞",    iast: "bhāt",     english: "rice (cooked)",                hindi: "चावल (cāval)", category: "food", pos: "noun", distinctive: true, note: "In Maithili 'bhāt' is the staple word; common across eastern languages." },
  { id: "dal",      dev: "दाल",       tirhuta: "𑒠𑒰𑒪",    iast: "dāl",      english: "lentils",                      hindi: "दाल",           category: "food", pos: "noun" },
  { id: "tarkari",  dev: "तरकारी",                       iast: "tarkārī",  english: "vegetable curry",              hindi: "सब्ज़ी (sabzī)", category: "food", pos: "noun", distinctive: true },
  { id: "machhli",  dev: "मछली",      tirhuta: "𑒧𑒕𑒪𑒲",  iast: "machhlī",  english: "fish",                         hindi: "मछली",         category: "food", pos: "noun", note: "Mithila is fish country — the fish motif appears in Madhubani art for a reason." },
  { id: "dahi",     dev: "दही",       tirhuta: "𑒠𑒯𑒲",    iast: "dahī",     english: "yoghurt / curd",                hindi: "दही",           category: "food", pos: "noun" },
  { id: "chura",    dev: "चूड़ा",                         iast: "cūṛā",     english: "flattened (beaten) rice",       hindi: "चिवड़ा (civṛā)", category: "food", pos: "noun", distinctive: true, note: "Eaten with dahī or jaggery — a Mithila everyday food." },
  { id: "makhana",  dev: "मखाना",                        iast: "makhānā",  english: "fox nuts (lotus seeds)",        hindi: "मखाना",         category: "food", pos: "noun", note: "Mithila produces over 80% of the world's makhānā." },
  { id: "khir",     dev: "खीर",                          iast: "khīr",     english: "rice pudding",                  hindi: "खीर",           category: "food", pos: "noun" },
  { id: "pan",      dev: "पान",                          iast: "pān",      english: "betel leaf preparation",        hindi: "पान",           category: "food", pos: "noun" },
  { id: "roti",     dev: "रोटी",      tirhuta: "𑒩𑒼𑒙𑒲",  iast: "roṭī",     english: "flatbread",                    hindi: "रोटी",         category: "food", pos: "noun" },
  { id: "thekuwa",  dev: "ठेकुआ",                        iast: "ṭhekuā",   english: "Chhath sweet — fried wheat & jaggery", hindi: "ठेकुआ", category: "food", pos: "noun", distinctive: true, note: "The defining sweet of Chhath." },
  { id: "achar",    dev: "अचार",                         iast: "acār",     english: "pickle",                        hindi: "अचार",         category: "food", pos: "noun" },

  // ---------- Body ----------
  { id: "matha",  dev: "माथा",                  iast: "māthā", english: "head",     hindi: "सिर (sir)", category: "body", pos: "noun", distinctive: true },
  { id: "mukh",   dev: "मुख",                   iast: "mukh",  english: "face / mouth", hindi: "मुँह (mũh)", category: "body", pos: "noun" },
  { id: "ankh",   dev: "आँख",                   iast: "ā̃kh",   english: "eye",      hindi: "आँख",       category: "body", pos: "noun" },
  { id: "kan",    dev: "कान",                   iast: "kān",   english: "ear",      hindi: "कान",      category: "body", pos: "noun" },
  { id: "nak",    dev: "नाक",                   iast: "nāk",   english: "nose",     hindi: "नाक",      category: "body", pos: "noun" },
  { id: "hath",   dev: "हाथ",                   iast: "hāth",  english: "hand",     hindi: "हाथ",      category: "body", pos: "noun" },
  { id: "pair",   dev: "पैर",                   iast: "pair",  english: "foot / leg", hindi: "पैर",     category: "body", pos: "noun" },
  { id: "pet",    dev: "पेट",                   iast: "peṭ",   english: "stomach",  hindi: "पेट",      category: "body", pos: "noun" },
  { id: "dant",   dev: "दाँत",                  iast: "dā̃t",   english: "tooth",    hindi: "दाँत",     category: "body", pos: "noun" },
  { id: "kes",    dev: "केश",                   iast: "keś",   english: "hair",     hindi: "बाल (bāl)", category: "body", pos: "noun", distinctive: true },

  // ---------- Verbs (Maithili infinitive forms) ----------
  { id: "khaeb",   dev: "खाएब",                  iast: "khāeb",  english: "to eat",     hindi: "खाना (khānā)",  category: "verbs", pos: "verb", distinctive: true, note: "Maithili infinitives commonly end in -एब. Variant: 'khāy'." },
  { id: "jaeb",    dev: "जाएब",                  iast: "jāeb",   english: "to go",      hindi: "जाना (jānā)",   category: "verbs", pos: "verb", distinctive: true },
  { id: "aeb",     dev: "आएब",                   iast: "āeb",    english: "to come",    hindi: "आना (ānā)",    category: "verbs", pos: "verb", distinctive: true },
  { id: "karab",   dev: "करब",                   iast: "karab",  english: "to do",      hindi: "करना (karnā)", category: "verbs", pos: "verb", distinctive: true },
  { id: "dekhab",  dev: "देखब",                  iast: "dekhab", english: "to see",     hindi: "देखना (dekhnā)", category: "verbs", pos: "verb", distinctive: true },
  { id: "sunab",   dev: "सुनब",                  iast: "sunab",  english: "to hear",    hindi: "सुनना (sunnā)", category: "verbs", pos: "verb", distinctive: true },
  { id: "bajab",   dev: "बाजब",                  iast: "bājab",  english: "to speak / say", hindi: "बोलना (bolnā)", category: "verbs", pos: "verb", distinctive: true, note: "Maithili 'bājab' vs Hindi 'bolnā'." },
  { id: "sutab",   dev: "सूतब",                  iast: "sūtab",  english: "to sleep",   hindi: "सोना (sonā)",   category: "verbs", pos: "verb", distinctive: true },
  { id: "uthab",   dev: "उठब",                   iast: "uṭhab",  english: "to rise / wake", hindi: "उठना (uṭhnā)", category: "verbs", pos: "verb" },

  // ---------- Adjectives ----------
  { id: "bhal",    dev: "भाल",                   iast: "bhāl",     english: "good",   hindi: "अच्छा (acchā)", category: "adjectives", pos: "adj", distinctive: true, note: "Maithili 'bhāl' is a marker word — Hindi speakers won't recognize it." },
  { id: "adhala",  dev: "अधला",                  iast: "adhalā",   english: "bad / spoiled", hindi: "बुरा (burā)", category: "adjectives", pos: "adj", distinctive: true },
  { id: "barka",   dev: "बड़का",                  iast: "baṛkā",    english: "big",    hindi: "बड़ा (baṛā)",  category: "adjectives", pos: "adj", distinctive: true, note: "The -kā ending is characteristic of Maithili/Bhojpuri." },
  { id: "chhotka", dev: "छोटका",                  iast: "chhoṭkā",  english: "small",  hindi: "छोटा (chhoṭā)", category: "adjectives", pos: "adj", distinctive: true },
  { id: "garam",   dev: "गरम",                   iast: "garam",    english: "hot",    hindi: "गरम",         category: "adjectives", pos: "adj" },
  { id: "thandha", dev: "ठंढा",                  iast: "ṭhaṇḍhā",  english: "cold",   hindi: "ठंडा (ṭhaṇḍā)", category: "adjectives", pos: "adj" },
  { id: "mitha",   dev: "मीठ",                   iast: "mīṭh",     english: "sweet",  hindi: "मीठा (mīṭhā)", category: "adjectives", pos: "adj", distinctive: true },

  // ---------- Nature ----------
  { id: "suraj",   dev: "सूरज",                  iast: "sūraj",  english: "sun",    hindi: "सूरज",      category: "nature", pos: "noun" },
  { id: "chand",   dev: "चान",                   iast: "chān",   english: "moon",   hindi: "चाँद (cā̃d)", category: "nature", pos: "noun", distinctive: true, note: "Maithili 'chān' vs Hindi 'chā̃d'." },
  { id: "tara",    dev: "तारा",                  iast: "tārā",   english: "star",   hindi: "तारा",      category: "nature", pos: "noun" },
  { id: "pani",    dev: "पानि",                  iast: "pāni",   english: "water",  hindi: "पानी (pānī)", category: "nature", pos: "noun", distinctive: true, note: "Maithili 'pāni' (short i) vs Hindi 'pānī' (long ī)." },
  { id: "agi",     dev: "आगि",                   iast: "āgi",    english: "fire",   hindi: "आग (āg)",   category: "nature", pos: "noun", distinctive: true },
  { id: "hawa",    dev: "हवा",                   iast: "hawā",   english: "wind / air", hindi: "हवा",   category: "nature", pos: "noun" },
  { id: "gachh",   dev: "गाछ",                   iast: "gāch",   english: "tree",   hindi: "पेड़ (peṛ)", category: "nature", pos: "noun", distinctive: true, note: "Maithili 'gāch' (also Bengali) vs Hindi 'peṛ'." },
  { id: "phul",    dev: "फूल",                   iast: "phūl",   english: "flower", hindi: "फूल",      category: "nature", pos: "noun" },

  // ---------- Ritual / Festival ----------
  { id: "puja",    dev: "पूजा",                  iast: "pūjā",    english: "worship / ritual",        hindi: "पूजा",     category: "festival", pos: "noun" },
  { id: "vrat",    dev: "व्रत",                  iast: "vrat",    english: "fast / vow",              hindi: "व्रत",     category: "festival", pos: "noun" },
  { id: "prasad",  dev: "प्रसाद",                iast: "prasād",  english: "blessed food (offering)", hindi: "प्रसाद",  category: "festival", pos: "noun" },
  { id: "bhog",    dev: "भोग",                   iast: "bhog",    english: "food offered to the divine", hindi: "भोग", category: "festival", pos: "noun" },
  { id: "mandir",  dev: "मन्दिर",                iast: "mandir",  english: "temple",                  hindi: "मंदिर",   category: "festival", pos: "noun" },
  { id: "kohbar",  dev: "कोहबर",                 iast: "kohbar",  english: "wedding-chamber painting (Mithila)", hindi: "—", category: "festival", pos: "noun", distinctive: true, note: "Mithila's distinctive wedding-night art form — has no real Hindi equivalent." },
  { id: "aripan",  dev: "अरिपन",                 iast: "aripan",  english: "floor painting drawn for auspicious occasions", hindi: "—", category: "festival", pos: "noun", distinctive: true, note: "Mithila's geometric floor art, made by women on festival days." },
  { id: "sindur",  dev: "सिन्दूर",               iast: "sindūr",  english: "vermilion (worn by married women)", hindi: "सिंदूर", category: "festival", pos: "noun" },

  // ---------- Everyday ----------
  { id: "ghar",    dev: "घर",                    iast: "ghar",    english: "house / home",        hindi: "घर",            category: "everyday", pos: "noun" },
  { id: "gaon",    dev: "गाँव",                  iast: "gā̃w",     english: "village",             hindi: "गाँव",          category: "everyday", pos: "noun" },
  { id: "bajar",   dev: "बजार",                  iast: "bajār",   english: "market",              hindi: "बाज़ार (bāzār)", category: "everyday", pos: "noun" },
  { id: "kitab",   dev: "किताब",                 iast: "kitāb",   english: "book",                hindi: "किताब",         category: "everyday", pos: "noun" },
  { id: "paisa",   dev: "पैसा",                  iast: "paisā",   english: "money",               hindi: "पैसा",          category: "everyday", pos: "noun" },
  { id: "bat",     dev: "बाट",                   iast: "bāṭ",     english: "road / path",         hindi: "रास्ता (rāstā)", category: "everyday", pos: "noun", distinctive: true, note: "Maithili 'bāṭ' vs Hindi 'rāstā'." },
  { id: "dosti",   dev: "दोस्ती",                iast: "dostī",   english: "friendship",          hindi: "दोस्ती",         category: "everyday", pos: "noun" },
  { id: "naam",    dev: "नाम",                   iast: "nām",     english: "name",                hindi: "नाम",           category: "everyday", pos: "noun" },
];

// ---------- Helpers ----------

export function searchWords(query) {
  if (!query) return WORDS;
  const q = query.toLowerCase().trim();
  return WORDS.filter((w) => {
    return (
      w.iast.toLowerCase().includes(q) ||
      w.dev.toLowerCase().includes(q) ||
      (Array.isArray(w.english) ? w.english.some((e) => e.toLowerCase().includes(q)) : w.english.toLowerCase().includes(q)) ||
      (w.hindi && w.hindi.toLowerCase().includes(q)) ||
      (w.note && w.note.toLowerCase().includes(q))
    );
  });
}

export function getWordsByCategory(categoryId) {
  if (!categoryId || categoryId === "all") return WORDS;
  return WORDS.filter((w) => w.category === categoryId);
}

export function getCategoryLabel(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.label : id;
}

// ============================================================
//  NATIVE WORDS — concepts that exist in Mithila but not in
//  Hindi (or that mean something distinctly different there).
//  These need a paragraph, not a one-line translation.
// ============================================================

export const NATIVE_WORDS = [
  {
    id: "kohbar",
    dev: "कोहबर",
    iast: "kohbar",
    short: "the painted wedding chamber",
    explanation:
      "The kohbar is the room — and the wall painting in it — where a Maithil bride and groom spend their first nights together. The painting itself is iconography: bamboo for fertility, lotus for the bride, fish and parrots for love, the central kohbar symbol for union. No Hindi equivalent; it's specifically a Mithila wedding tradition.",
    seeAlso: ["aripan"],
  },
  {
    id: "aripan",
    dev: "अरिपन",
    iast: "aripan",
    short: "auspicious floor painting drawn by women",
    explanation:
      "Aripan is the geometric floor painting Mithila women draw — with rice paste, by hand, fingertip-style — for every auspicious occasion. Pūjā, weddings, festivals, the welcoming of a guest. Different motifs for different rituals. It is invocation, decoration, and blessing in one act.",
    seeAlso: ["kohbar"],
  },
  {
    id: "makhana",
    dev: "मखाना",
    iast: "makhānā",
    short: "fox nuts — Mithila's signature crop",
    explanation:
      "Makhānā are the puffed seeds of the prickly water-lily, grown in Mithila's ponds and eaten across South Asia. Hindi has the word, but Mithila has the thing — over 80% of the world's supply comes from here. Eaten plain, roasted with ghee, sweetened in kheer. Inseparable from Mithila's economy and identity.",
  },
  {
    id: "thekuwa",
    dev: "ठेकुआ",
    iast: "ṭhekuā",
    short: "the defining Chhath sweet",
    explanation:
      "Ṭhekuā is fried wheat-flour-and-jaggery dough, pressed into wooden moulds with patterns. It is the prasād of Chhath — every household makes it, offers it to the sun, and shares it for days. The smell of ṭhekuā being fried is the smell of Chhath approaching.",
  },
  {
    id: "naihar",
    dev: "नैहर",
    iast: "naihar",
    short: "a married woman's parents' home",
    explanation:
      "Naihar is the home a woman is born in — the home she leaves at marriage and returns to as a visitor for the rest of her life. The word carries a specific emotional weight: longing, belonging, the place where her parents and brothers are. Hindi has 'maaikā' but naihar is the word folk songs use, the word that appears in every Maithili wedding song.",
    seeAlso: ["sasural"],
  },
  {
    id: "sasural",
    dev: "ससुराल",
    iast: "sasurāl",
    short: "a married woman's husband's family home",
    explanation:
      "The counterpart to naihar — the home she enters at marriage. Used widely in Hindi too, but in Maithili songs and proverbs it sits in a specific tension with naihar: the new place vs. the old place, duty vs. belonging, where she lives vs. where she's from.",
    seeAlso: ["naihar"],
  },
  {
    id: "baramasa",
    dev: "बारहमासा",
    iast: "bāramāsā",
    short: "twelve-month song cycle",
    explanation:
      "Bāramāsā is a poetic and musical form — a song that walks through all twelve months of the year, one verse per month, usually tracing a woman's longing for her absent husband. Mithila's folk and Vidyāpati tradition has many bāramāsā compositions. The form exists in other Indian traditions too, but Maithili bāramāsā is its own canon.",
  },
  {
    id: "purain",
    dev: "पुरैन",
    iast: "purain",
    short: "the lotus leaf",
    explanation:
      "Purain is the broad lotus leaf — the leaf that floats on Mithila's ponds, that food is served on at weddings and festivals (in the older way, before steel plates), that appears in Madhubani paintings beside fish and women. Hindi has 'kamal-patta' but purain is the word that belongs to the pond and the painting.",
  },
];

// ============================================================
//  FAKRĀ — Maithili idioms, proverbs, sayings.
//  HEAVILY DRAFT. These especially need community verification.
// ============================================================

export const FAKRA = [
  {
    id: "roti-choti",
    dev: "जत्ते रोटी ओतबे चोटी",
    iast: "jatte roṭī otabe choṭī",
    literal: "As much bread, so much braid.",
    meaning: "You get out what you put in. The reward matches the effort.",
    context: "Used when warning against expecting more than one has earned, or when celebrating a fair return.",
  },
  {
    id: "kanh-math",
    dev: "कान्ह पर भार, माथ पर बोझ",
    iast: "kānh par bhār, māth par bojh",
    literal: "Load on the shoulder, burden on the head.",
    meaning: "When troubles pile on troubles — one problem on top of another.",
  },
  {
    id: "pani-jati",
    dev: "पानि पीबि के जाति पुछै छी",
    iast: "pāni pībi ke jāti puchhai chī",
    literal: "Asking caste after drinking the water.",
    meaning: "Raising objections after the fact, when it's too late to change anything. The act is already done.",
    context: "A rebuke to someone who agrees first and then asks the questions they should have asked before.",
  },
  {
    id: "beti-kheti",
    dev: "बेटी आ खेती दूनू दहेज",
    iast: "beṭī ā khetī dūnū dahej",
    literal: "Daughter and farming — both demand investment.",
    meaning: "Both a daughter's future and a field's harvest need patient, sustained tending. You cannot rush either.",
    context: "Traditional saying about the long horizons of family and agriculture; can read either as folk wisdom or, in modern reading, as a critique of the dowry framing.",
  },
  {
    id: "ghar-ghoda",
    dev: "अपन घर के घोड़ा सब घोड़ा",
    iast: "apan ghar ke ghoṛā sab ghoṛā",
    literal: "Every horse in your own house is a fine horse.",
    meaning: "We over-value what is ours and under-see its flaws. Familiarity breeds blindness.",
  },
  {
    id: "haathi-pair",
    dev: "हाथीक पैर मे सबहक पैर",
    iast: "hāthīk pair me sabhak pair",
    literal: "In the elephant's footprint, every footprint fits.",
    meaning: "A large household — or a generous leader — has room for everyone. Big-heartedness accommodates all.",
  },
  {
    id: "andha-darpan",
    dev: "अन्हराक हाथ मे दर्पन",
    iast: "anharāk hāth me darpan",
    literal: "A mirror in a blind man's hand.",
    meaning: "Something valuable given to someone who cannot use it. Wasted on the receiver.",
  },
  {
    id: "madhur-vachan",
    dev: "मधुर वचन औषधि समान",
    iast: "madhur vacan auṣadhi samān",
    literal: "Sweet words are like medicine.",
    meaning: "Kind speech heals as much as any remedy.",
    context: "Often said by elders teaching young people about how to speak.",
  },
];

// ---------- Helpers for native + fakrā ----------

export function searchNative(query) {
  if (!query) return NATIVE_WORDS;
  const q = query.toLowerCase().trim();
  return NATIVE_WORDS.filter((w) =>
    w.iast.toLowerCase().includes(q) ||
    w.dev.toLowerCase().includes(q) ||
    w.short.toLowerCase().includes(q) ||
    w.explanation.toLowerCase().includes(q)
  );
}

export function searchFakra(query) {
  if (!query) return FAKRA;
  const q = query.toLowerCase().trim();
  return FAKRA.filter((f) =>
    f.iast.toLowerCase().includes(q) ||
    f.dev.toLowerCase().includes(q) ||
    f.literal.toLowerCase().includes(q) ||
    f.meaning.toLowerCase().includes(q) ||
    (f.context && f.context.toLowerCase().includes(q))
  );
}
