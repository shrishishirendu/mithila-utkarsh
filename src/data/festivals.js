// ============================================================
// Festivals of Mithila — Pavain & Tyohar
// ============================================================
//
// HONESTY NOTE:
// - Content is drafted from general public knowledge of Maithili and Hindu
//   traditions. It is intended as a starting point for community refinement,
//   not as the final authoritative entry.
// - Dates marked "approximate" need verification against a current panchang.
//   They are the best available approximation for the indicated year.
// - Songs are referenced by title and brief description only — no full lyrics.
// - Maithili-specific rituals (especially for Madhushravani, Sama Chakeva,
//   Kojagara, Vivaha Panchami) should be reviewed by Maithili scholars and
//   community elders before launch.
//
// Categories:
//   "flagship-mithila"  — distinctive Mithila festivals, rich content
//   "mithila"           — celebrated specially in Mithila but pan-regional
//   "pan-hindu"         — broadly Hindu, with Mithila variations noted
// ============================================================

export const FESTIVALS = [
  // ----------------------------------------------------------
  // 1. Makar Sankranti / Tila Sankranti
  // ----------------------------------------------------------
  {
    slug: "makar-sankranti",
    name: "Makar Sankranti",
    altName: "Tila Sankranti",
    nameDevanagari: "मकर संक्रांति",
    category: "mithila",
    accent: "turmeric",
    duration: { days: 1, label: "1 day" },
    approxMonth: 1,
    tithi: "Makar Sankranti — when the Sun enters Capricorn",
    approxDate: { year: 2026, range: "14 January 2026", note: "Fixed solar date, approximately verified" },
    honours: "Sūrya (the Sun)",
    shortDesc: "The Sun's northward journey begins — a day of sesame, jaggery, and family.",
    significance:
      "Makar Sankranti marks the Sun's transit into Capricorn (Makara) and the beginning of Uttarayana — the auspicious six-month northward journey. In Mithila it is also called Tila Sankranti, the festival of sesame (til). It's one of the few Hindu festivals that follows the solar calendar, so the Gregorian date is nearly fixed at 14 January.",
    foods: [
      { name: "Til ke laddoo", desc: "Sweet sesame and jaggery balls" },
      { name: "Chivda-dahi", desc: "Beaten rice with yoghurt and jaggery" },
      { name: "Tilkut", desc: "Brittle made of sesame and sugar — a Mithila specialty" },
    ],
    rich: false,
  },

  // ----------------------------------------------------------
  // 2. Saraswati Puja / Vasant Panchami
  // ----------------------------------------------------------
  {
    slug: "saraswati-puja",
    name: "Saraswati Puja",
    altName: "Vasant Panchami",
    nameDevanagari: "सरस्वती पूजा",
    category: "mithila",
    accent: "turmeric",
    duration: { days: 1, label: "1 day" },
    approxMonth: 2,
    tithi: "Magha Shukla Panchami",
    approxDate: { year: 2026, range: "23 January 2026", note: "Approximate, verify with panchang" },
    honours: "Saraswatī — Goddess of learning and music",
    shortDesc: "The first day of spring, honouring the goddess of learning.",
    significance:
      "Vasant Panchami marks the arrival of spring. In Mithila and across eastern India, it is celebrated as Saraswati Puja — the day the goddess of learning, music, and arts is worshipped. Students keep their books at her feet for blessings. The traditional colour is yellow, the colour of mustard fields in bloom and of the goddess herself.",
    foods: [
      { name: "Boondi", desc: "Sweet yellow chickpea-flour drops" },
      { name: "Kesari halwa", desc: "Saffron-coloured semolina pudding" },
    ],
    rich: false,
  },

  // ----------------------------------------------------------
  // 3. Phagua / Holi
  // ----------------------------------------------------------
  {
    slug: "phagua",
    name: "Phagua",
    altName: "Holi",
    nameDevanagari: "फगुआ",
    category: "mithila",
    accent: "vermillion",
    duration: { days: 2, label: "2 days" },
    approxMonth: 3,
    tithi: "Phalguna Purnima → Chaitra Pratipada",
    approxDate: { year: 2026, range: "3 – 4 March 2026", note: "Approximate, verify with panchang" },
    honours: "The arrival of spring; the legend of Holika and Prahlad",
    shortDesc: "Mithila's Holi — distinctive for its folk songs (Jogira) and abeer.",
    significance:
      "Phagua is what Holi is called in Mithila, and it has its own flavour. The night before — Holika Dahan — bonfires are lit. The next day, families and neighbours play with abeer (dry colour) and gulal, sing Phagua geet and Jogira songs (a satirical Maithili folk genre unique to this season), and visit each other's homes for sweets and conversation. The colours, the songs, and the visiting matter at least as much as the play.",
    foods: [
      { name: "Pua", desc: "Sweet flour fritters, soft inside, crisp outside" },
      { name: "Dahi-bara", desc: "Lentil dumplings in spiced yoghurt" },
      { name: "Thandai", desc: "Cold milk infused with almond, fennel and saffron" },
    ],
    songs: [
      { name: "Jogira", note: "Maithili satirical folk songs sung in question-and-answer form during Phagua" },
      { name: "Phagua geet", note: "Traditional songs of the festival; many reference Krishna and Radha" },
    ],
    rich: true,
    regional:
      "While the colour-play of Holi is pan-Indian, Phagua's distinctive elements — Jogira songs, the specific food traditions, and the visiting culture — are particular to Mithila and Bhojpuri-speaking regions.",
  },

  // ----------------------------------------------------------
  // 4. Jur Sital — Maithili New Year (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "jur-sital",
    name: "Jur Sital",
    altName: "Maithili New Year",
    nameDevanagari: "जुड़ शीतल",
    category: "flagship-mithila",
    accent: "leaf",
    duration: { days: 1, label: "1 day" },
    approxMonth: 4,
    tithi: "Mesh Sankranti — when the Sun enters Aries",
    approxDate: { year: 2026, range: "14 April 2026", note: "Fixed solar date" },
    honours: "The new year; cooling, blessing, rest",
    shortDesc: "Maithili New Year — a festival of cool water, blessings from elders, and the older food of yesterday.",
    significance:
      "Jur Sital — literally 'cool water' in Maithili — is the Mithila new year. It falls on Mesh Sankranti, the solar new year, around 14 April. The festival's defining ritual is gentle: elders sprinkle cool water on the heads of younger family members as a blessing for the year ahead. Children also pour water on plants, on the threshold, on the family's idols.\n\nUniquely, the food eaten on Jur Sital is the previous day's cooked food — basi bhāt (yesterday's rice), bari (lentil dumplings), saag — eaten cool, not reheated. The symbolism: the year begins with what has been preserved, not what is freshly made. Calm, cool, settled. The body too is meant to rest — no hot stove, no rushing.",
    rituals: [
      { day: "Morning", text: "Elders bless the household by sprinkling cool water on the heads of younger members. Water is also offered to plants, doorways, and household deities." },
      { day: "Midday", text: "The family eats basi bhāt — yesterday's cooked rice — with leftover sāg, bari, and pickle. The kitchen stays cold." },
      { day: "Afternoon onwards", text: "Visits to elders' homes for blessings. In some Mithila households, the day is one of complete rest from work." },
    ],
    foods: [
      { name: "Basi bhāt", desc: "Previous day's rice, eaten cool — the symbolic centre of the meal" },
      { name: "Bari", desc: "Sun-dried lentil dumplings, cooked the day before" },
      { name: "Saag", desc: "Cooked leafy greens, again from yesterday" },
      { name: "Achar", desc: "Pickle — mango, lemon, mixed" },
    ],
    regional:
      "Jur Sital is distinctly Mithila. The same solar date is observed across South Asia as Vishu (Kerala), Pohela Boishakh (Bengal), Vaisakhi (Punjab), Bihu (Assam) — different festivals on a shared cosmic moment.",
    whyMatters:
      "Jur Sital is one of the few festivals that's *only* Mithila. If the diaspora forgets it, it disappears from the diaspora's calendar entirely. The simplicity of the ritual — cool water from grandparents' hands — is exactly what makes it easy to keep alive abroad.",
    rich: true,
  },

  // ----------------------------------------------------------
  // 5. Vat Savitri (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "vat-savitri",
    name: "Vat Savitri",
    nameDevanagari: "वट सावित्री",
    category: "flagship-mithila",
    accent: "vermillion",
    duration: { days: 1, label: "1 day" },
    approxMonth: 5,
    tithi: "Jyeshtha Amavasya",
    approxDate: { year: 2026, range: "Mid-May 2026", note: "Approximate, verify with panchang" },
    honours: "Sāvitrī and the vat (banyan) tree; husbands' long life",
    shortDesc: "Married women gather under the banyan to honour Sāvitrī — who out-argued the god of death.",
    significance:
      "Vat Savitri commemorates one of the most striking stories in Hindu tradition: that of Sāvitrī, who followed her husband Satyavān into death itself and argued with Yama — the god of death — until he agreed to return Satyavān's life under the banyan tree where he had died. The festival's name carries both — the vat (banyan) and the woman who reasoned with death and won.\n\nMarried women fast through the day, gather at a banyan tree — physically where possible, symbolically with a potted sapling or branch in diaspora homes — circumambulate the tree, tie a sacred thread around its trunk, and listen to the story of Sāvitrī and Satyavān read aloud. The fast is for the long life of husbands; the gathering is for each other.",
    rituals: [
      { day: "Morning", text: "Married women bathe and dress in full shringār — typically red or yellow saris, sindūr, mangalsūtra, bangles. The day-long fast begins; many keep it nirjala (without water)." },
      { day: "Midday — Vat Pūjā", text: "Women gather at a banyan tree, bringing a thālī with vermilion, turmeric, fruit, sweets, betel leaves, a hand fan (pankhā), and a long sacred thread. The tree is offered water, sindūr, and flowers, and circumambulated multiple times — traditionally 108, fewer in modern practice — with the thread wound around the trunk on each round." },
      { day: "The Kathā", text: "An elder reads or narrates the Sāvitrī–Satyavān kathā aloud while the gathered women listen together. This is often the most powerful moment of the day — the shared hearing of the story that gives the festival its meaning." },
      { day: "Breaking the fast", text: "Late afternoon or evening, the fast is broken with prasād and a shared meal among the gathered women. The bond of the day's company carries forward." },
    ],
    foods: [
      { name: "Gulgulā", desc: "Sweet wheat-flour fried balls — traditional Vat Savitri prasād" },
      { name: "Pakwān", desc: "Fried festive bread, often shared after the pūjā" },
      { name: "Seasonal fruit", desc: "Mango, banana, jackfruit — offered to the tree and shared" },
      { name: "Sattū", desc: "Roasted gram flour — a cooling food for the May/June heat" },
    ],
    songs: [
      { name: "Savitri geet", note: "Maithili folk songs about Sāvitrī, sung communally while the women gather at the tree" },
      { name: "Vat-vrikṣa geet", note: "Songs in praise of the banyan tree itself — the eternal witness" },
    ],
    regional:
      "Vat Savitri is observed across northern and eastern India, but the date varies. In Mithila and most of Bihar, it falls on Jyeshtha Amavasya (the new moon, May/June). In parts of western and central India it is observed on Jyeshtha Purnima (the full moon) two weeks later, where it is called Vat Purnimā. The story and the tree are the same; the moon differs.",
    whyMatters:
      "The surface of Vat Savitri is wifely devotion — a woman fasting for her husband's life. The substance underneath is Sāvitrī's voice: she did not plead with Yama, she reasoned with him, won boons through wit, and used those boons to bring Satyavān back through a loophole of her own design. Married women gathering year after year to tell that story together under a tree is one of the most quietly powerful women's traditions in Hindu practice.",
    rich: true,
  },

  // ----------------------------------------------------------
  // 6. Madhushravani (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "madhushravani",
    name: "Madhushravani",
    nameDevanagari: "मधुश्रावणी",
    category: "flagship-mithila",
    accent: "leaf",
    duration: { days: 14, label: "13–14 days" },
    approxMonth: 8,
    tithi: "Shravana Krishna Panchami to Shravana Shukla Tritiya",
    approxDate: { year: 2026, range: "Late July – mid August 2026", note: "Approximate, verify with panchang" },
    honours: "Goddess Gaurī and the Nāgs (serpent deities)",
    shortDesc: "Mithila's festival for newly married women, in the first monsoon of marriage.",
    significance:
      "Madhushravani is one of the most distinctively Mithila festivals — and one with no real equivalent elsewhere in India. It is the festival of newly-married women in the *first year* of their marriage. For roughly two weeks across the month of Shravan, the new bride observes a fast, listens to traditional stories, and is taken through a sequence of daily rituals that involve flowers, leaves, naga (serpent) worship, and Gauri puja. Many of the rituals happen at her natal home, with her mother and aunts. The festival closes with the bride's return to her marital home, often with a controversial final ritual called *tem* or *dāgh*.\n\nMadhushravani is a women's festival, taught from older women to younger ones, and many of its details vary household to household — which is exactly why it deserves a careful community-led documentation rather than a textbook one.",
    rituals: [
      { day: "Days 1–13", text: "Daily morning puja with collected leaves and flowers, Gauri worship, observance of fasting traditions. The bride listens to Madhushravani kathā — story-cycles passed down by older women." },
      { day: "Final day (tem)", text: "A traditional closing ritual that varies by household and region. This is a part of the festival that warrants careful community discussion — what to preserve, what to reframe, what to retire — rather than blanket description." },
    ],
    songs: [
      { name: "Madhushravani geet", note: "Songs sung by women through the fortnight, often about Gauri, marriage, and the bride's two homes" },
    ],
    regional:
      "Madhushravani is observed mainly in the Mithila region of Bihar and the Tarai region of Nepal. Its specific rituals vary from family to family — Maithil scholar Radhakrishna Choudhary and others have documented variations, and even within Mithila there's no single canonical sequence.",
    whyMatters:
      "Madhushravani is held together by oral tradition — mothers and aunts passing it to daughters and nieces. For Maithil families abroad whose daughters marry far from grandmothers, the festival is at real risk of being lost in a single generation. Documenting it well — with the *plural* truth of how different families do it — is one of the most valuable things this app can do.",
    rich: true,
    needsReview: true, // explicit flag for community review
  },

  // ----------------------------------------------------------
  // 7. Jitiya / Jivitputrika
  // ----------------------------------------------------------
  {
    slug: "jitiya",
    name: "Jitiya",
    altName: "Jivitputrika",
    nameDevanagari: "जितिया",
    category: "mithila",
    accent: "vermillion",
    duration: { days: 3, label: "3 days" },
    approxMonth: 9,
    tithi: "Ashwin Krishna Saptami to Navami",
    approxDate: { year: 2026, range: "Mid-September 2026", note: "Approximate, verify with panchang" },
    honours: "Jīmūtavāhana — for the long life of sons",
    shortDesc: "A waterless fast kept by mothers for the wellbeing of their children.",
    significance:
      "Jitiya is one of the most demanding fasts in the Hindu calendar: a complete nirjala vrat (no food, no water) observed by mothers for the long life and wellbeing of their children. The festival commemorates Jīmūtavāhana, a legendary Bodhisattva-king who offered himself to save another. The vrat lasts 24 hours and is broken on the third morning with a careful ritual meal.",
    foods: [
      { name: "Marua roti & jhor", desc: "Finger millet flatbread with broth, traditional Jitiya parana foods" },
      { name: "Noni saag", desc: "A specific leafy green eaten on the parana day" },
    ],
    rich: false,
  },

  // ----------------------------------------------------------
  // 8. Durga Puja / Navratri
  // ----------------------------------------------------------
  {
    slug: "durga-puja",
    name: "Durga Puja",
    altName: "Navratri",
    nameDevanagari: "दुर्गा पूजा",
    category: "mithila",
    accent: "vermillion",
    duration: { days: 10, label: "9 + 1 days" },
    approxMonth: 10,
    tithi: "Ashwin Shukla Pratipada to Dashami",
    approxDate: { year: 2026, range: "Mid-October 2026", note: "Approximate, verify with panchang" },
    honours: "Goddess Durgā in her nine forms; her victory over Mahishāsura",
    shortDesc: "Nine nights of the Goddess, ending in Vijayadashami.",
    significance:
      "Navratri — nine nights of the Goddess — is observed across Hindu India, but Mithila's celebration is closer in spirit to Bengal's Durga Puja: emphasis on the Goddess's victory, community pandals where possible, and the closing day of Vijayadashami when Durga is sent home and the family receives elders' blessings.",
    rich: false,
  },

  // ----------------------------------------------------------
  // 9. Kojagara (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "kojagara",
    name: "Kojagara",
    altName: "Sharad Purnima · Lakshmi Puja",
    nameDevanagari: "कोजागरा",
    category: "flagship-mithila",
    accent: "turmeric",
    duration: { days: 1, label: "1 night" },
    approxMonth: 10,
    tithi: "Ashwin Shukla Purnima",
    approxDate: { year: 2026, range: "Late October 2026", note: "Approximate, verify with panchang" },
    honours: "Goddess Lakshmī; the newly-married son-in-law (jamāi)",
    shortDesc: "The full moon when Lakshmi walks asking 'ko jāgarti?' — who is awake?",
    significance:
      "Kojagara is the Mithila name for Sharad Purnima — the harvest full moon of Ashwin month. The word 'Kojagara' comes from the Sanskrit 'ko jāgarti' — 'who is awake?' — the question Goddess Lakshmi is said to ask as she roams that night, blessing households she finds keeping vigil.\n\nIn Mithila, the festival has a beautiful and very specific twist: it's a celebration of the *newly-married son-in-law*. The first Kojagara after a daughter's wedding, her parents send a traditional gift basket to her in-laws' home — paan (betel leaf), makhana (fox nuts, grown in Mithila's ponds), batāshā (sugar puffs), kheer ingredients — for the son-in-law and his family. The new jamai is honoured, asked to play cards, fed kheer cooked under the full moon.",
    rituals: [
      { day: "Day", text: "Kheer is prepared with fresh harvest rice and milk." },
      { day: "Evening", text: "The family stays awake. The kheer is left under the full moon — said to absorb the moon's nectar." },
      { day: "Night", text: "Card games (especially among newly married couples and their families), conversation, sharing of the moon-cooled kheer." },
      { day: "For new jamais", text: "Bride's family sends a basket of paan, makhana, batāshā, and gifts to the in-laws' home." },
    ],
    foods: [
      { name: "Kheer", desc: "Slow-cooked rice pudding, the central food of the night" },
      { name: "Makhana", desc: "Fox nuts harvested from Mithila's ponds — emblematic of the region" },
      { name: "Paan", desc: "Betel leaf preparations" },
      { name: "Batāshā", desc: "Crisp sugar puffs" },
    ],
    regional:
      "Sharad Purnima is observed across India; the Kojagara name and the specific jamai-honouring tradition are Mithila's. Makhana — central to the festival — is essentially a Mithila product; the Mithila region of Bihar produces over 80% of the world's fox nuts.",
    whyMatters:
      "Kojagara binds two families across distance and seasons. For diaspora families with daughters married into homes overseas, the basket of paan and makhana arriving from India around Sharad Purnima is one of the year's most evocative continuities.",
    rich: true,
  },

  // ----------------------------------------------------------
  // 10. Diwali / Deepavali
  // ----------------------------------------------------------
  {
    slug: "diwali",
    name: "Diwali",
    altName: "Deepavali",
    nameDevanagari: "दीपावली",
    category: "pan-hindu",
    accent: "turmeric",
    duration: { days: 1, label: "1 day (5-day cycle)" },
    approxMonth: 11,
    tithi: "Kartik Krishna Amavasya",
    approxDate: { year: 2026, range: "8 November 2026", note: "Approximate, verify with panchang" },
    honours: "Goddess Lakshmī; Rāma's return to Ayodhya",
    shortDesc: "The festival of lights — diyas, Lakshmi puja, and home.",
    significance:
      "Diwali is broadly Hindu; in Mithila it sits inside a five-day cycle including Dhanteras, Kali Puja in some homes, and Bhai Dooj. The home is cleaned, lit with diyas, and Lakshmi is invited in. In Mithila, Kali Puja is often given particular attention on the same night.",
    rich: false,
  },

  // ----------------------------------------------------------
  // 11. Chhath (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "chhath",
    name: "Chhath",
    altName: "Chhath Parv",
    nameDevanagari: "छठ",
    category: "flagship-mithila",
    accent: "turmeric",
    duration: { days: 4, label: "4 days" },
    approxMonth: 11,
    tithi: "Kartik Shukla Chaturthi to Saptami",
    approxDate: { year: 2026, range: "13 – 16 November 2026", note: "Approximate, verify with panchang" },
    honours: "Sūrya (the Sun) and Chhathī Maiyā",
    shortDesc: "Four days at the riverbank — the most demanding and most beloved festival of Mithila.",
    significance:
      "Chhath is, for many Maithili and Bhojpuri families, the festival of the year. It is unusual among Hindu festivals: there is no priest, no idol, no temple ceremony. The devotee — usually a woman, though men also keep the fast — stands waist-deep in a river or pond at dusk and dawn and offers water (arghya) directly to the Sun. The fast is long and severe. The devotion is direct.\n\nChhathī Maiyā, the goddess honoured alongside Sūrya, is invoked to bless children and family. The songs, the long fast, the riverbank gatherings, the preparation of thekuva in clean kitchens — together they make Chhath the festival most strongly associated with Bihar, Mithila, and the eastern Tarai of Nepal.",
    rituals: [
      { day: "Day 1 — Nahāy Khāy", text: "The devotee bathes, then eats a single satvik meal (usually kaddu-bhāt — pumpkin and rice). The 36-hour fast begins after this." },
      { day: "Day 2 — Kharnā", text: "After a full day of fasting, a special evening meal of kheer with jaggery and roti is prepared and eaten alone in silence. After this, the nirjala fast begins — no food, no water." },
      { day: "Day 3 — Sandhyā Arghya", text: "At sunset, the devotee enters the water and offers arghya — water and prasad — to the setting Sun. Thekuva and seasonal fruits are arranged in bamboo baskets. The whole family gathers at the riverbank." },
      { day: "Day 4 — Ushā Arghya", text: "Before dawn, the family returns to the water. Arghya is offered to the rising Sun. Only then is the fast broken, with a small portion of the prasad." },
    ],
    foods: [
      { name: "Thekuva", desc: "The defining Chhath sweet — wheat flour, ghee, jaggery, fried in patterns. Made by hand in a ritually clean kitchen." },
      { name: "Kasār", desc: "Roasted rice flour and jaggery, pressed into shapes" },
      { name: "Kheer (Day 2)", desc: "Made on a clay stove with jaggery and ghee, for Kharnā" },
      { name: "Seasonal fruits", desc: "Sugarcane, banana, water chestnut, coconut, custard apple — offered in the bamboo baskets" },
    ],
    songs: [
      { name: "Kānch hī bāns ke bahangiyā", note: "Perhaps the most iconic Chhath song — about the bamboo pole carrying the festival's baskets" },
      { name: "Ugā hē Sūraj Dev", note: "Sung at dawn, calling on the Sun to rise" },
      { name: "Chhathī Maiyā", note: "Songs of praise to the goddess" },
    ],
    regional:
      "Chhath is celebrated wherever Maithili and Bhojpuri families live — Bihar, Jharkhand, eastern Uttar Pradesh, the Tarai of Nepal, and now in diasporas from Trinidad to Sydney. Each diaspora finds its own water — pools, lakes, beaches — and Chhath continues.",
    whyMatters:
      "Chhath is one of the only major Hindu festivals where the woman of the house is the priest. No intermediary. No icon. Just the Sun, the river, and her own discipline. For families in Australia far from the Ganga or Kosi, the act of finding a clean water-edge and keeping Chhath is itself a statement — that the festival doesn't need its homeland to remain itself.",
    rich: true,
  },

  // ----------------------------------------------------------
  // 12. Sama Chakeva (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "sama-chakeva",
    name: "Sama Chakeva",
    nameDevanagari: "सामा चकेवा",
    category: "flagship-mithila",
    accent: "leaf",
    duration: { days: 7, label: "7 days" },
    approxMonth: 11,
    tithi: "Kartik Shukla Saptami to Purnima",
    approxDate: { year: 2026, range: "Mid-November 2026", note: "Approximate, verify with panchang" },
    honours: "The bond between siblings; the legend of Sama and Sambh",
    shortDesc: "Mithila's sister-brother festival — sung with clay birds and lit at twilight.",
    significance:
      "Sama Chakeva is one of the most beautiful and distinctly Mithila festivals — a sister-brother festival like Raksha Bandhan but with its own tools, its own songs, and its own ending. The story behind it: Sama and Sambh, daughter and son of Krishna, were separated by court intrigues; she was cursed into the form of a bird and rescued by her brother. The festival reenacts the story.\n\nFor a week, sisters mould small clay figures — Sama and Chakeva (the bird pair), Chugla (the gossip), Vrindavan (the forest), and others — and gather in the evenings in courtyards. They sing Sama songs, light small lamps, parade the figures around, and dance. On the final evening of Kartik Purnima, the brothers see them off — symbolically returning Sama to her husband's home. The clay figures are then released into a river.",
    rituals: [
      { day: "Days 1–6", text: "Sisters meet in the evening with their clay figures of Sama, Chakeva, Chugla, and others. They sing Sama geet — a repertoire of dozens of Maithili folk songs unique to the festival. Lamps are lit. The figures are 'tended' as if alive." },
      { day: "Day 7 — Kartik Purnima", text: "The final evening. Brothers come to see off Sama. Songs of farewell are sung. The clay figures are taken in procession to a river or pond and released into the water." },
    ],
    foods: [
      { name: "Tilkut", desc: "Sesame brittle — shared during the gatherings" },
      { name: "Chiwra-gur", desc: "Beaten rice with jaggery — practical, plentiful, easily shared" },
    ],
    songs: [
      { name: "Sama khelai jaib", note: "A traditional opening song — 'I'll go play Sama'" },
      { name: "Chugla geet", note: "Songs about Chugla, the gossip figure — often comic" },
    ],
    regional:
      "Sama Chakeva is observed almost exclusively in Mithila and the Tarai of Nepal. The clay craft, the song repertoire, and the closing river ritual are all specific to this region — there is no real pan-Indian equivalent.",
    whyMatters:
      "Sama is performed by women, in the open air, in groups — children, mothers, grandmothers gathered in courtyards. It is one of the most visibly and audibly Mithila festivals there is. In the diaspora, where families are scattered and courtyards are gone, keeping Sama alive requires deliberate gathering. That makes it precious.",
    rich: true,
  },

  // ----------------------------------------------------------
  // 13. Vivaha Panchami (FLAGSHIP)
  // ----------------------------------------------------------
  {
    slug: "vivaha-panchami",
    name: "Vivaha Panchami",
    nameDevanagari: "विवाह पंचमी",
    category: "flagship-mithila",
    accent: "vermillion",
    duration: { days: 1, label: "1 day (multi-day celebrations in Janakpur)" },
    approxMonth: 12,
    tithi: "Margashirsha Shukla Panchami",
    approxDate: { year: 2026, range: "Late November / early December 2026", note: "Approximate, verify with panchang" },
    honours: "The marriage of Rāma and Sītā",
    shortDesc: "The day Sita married Ram — Mithila's own wedding anniversary.",
    significance:
      "Vivaha Panchami commemorates the marriage of Lord Rāma and Sītā — and Sītā is Mithila's daughter. King Janaka's kingdom was Mithila; Janakpur, the city named for him, sits today in Nepal's Tarai and remains the spiritual heart of the festival. Every Vivaha Panchami, Janakpur hosts a multi-day re-enactment of the wedding — processions, kirtans, the symbolic marriage performed at Janaki Mandir.\n\nFor Mithila families everywhere, Vivaha Panchami is a homecoming festival — a celebration that Mithila is, in the Ramayana itself, the place that gave the world its most cherished bride.",
    rituals: [
      { day: "Throughout the day", text: "Kirtans and recitations of the marriage section of the Ramayana. Many households perform a small symbolic marriage ceremony for figures of Ram and Sita." },
      { day: "In Janakpur", text: "A multi-day public re-enactment of the wedding, with processions arriving from Ayodhya. The ceremony itself is performed at Janaki Mandir." },
    ],
    songs: [
      { name: "Vivah ke geet", note: "Maithili wedding songs — the same repertoire sung at real Mithila weddings" },
    ],
    regional:
      "Janakpur — Nepal — is the spiritual centre, drawing pilgrims from Bihar, UP, and beyond. The festival is observed wherever Maithili families are, but Janakpur's celebration is the largest.",
    whyMatters:
      "Mithila's most quoted line of self-introduction is that Sita came from here. Vivaha Panchami is the day that line gets celebrated — the day the region's most cherished story is re-told as a wedding, not just an epic. For diaspora families, it's an annual reminder that Mithila's place in the cultural imagination of Hindu India is not as a province, but as the home of the bride.",
    rich: true,
  },
];

// Helper: get a festival by slug
export function getFestivalBySlug(slug) {
  return FESTIVALS.find((f) => f.slug === slug);
}

// Helper: figure out which festival is "next" given today's date.
// Returns the closest upcoming festival based on approxMonth.
export function getNextFestival(today = new Date()) {
  const month = today.getMonth() + 1; // 1-12
  // Sort by distance forward in the calendar
  const sorted = [...FESTIVALS]
    .map((f) => ({
      ...f,
      distance: (f.approxMonth - month + 12) % 12,
    }))
    .sort((a, b) => a.distance - b.distance);
  return sorted[0];
}

// Helper: surrounding festivals for prev/next navigation
export function getAdjacentFestivals(slug) {
  const idx = FESTIVALS.findIndex((f) => f.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? FESTIVALS[idx - 1] : FESTIVALS[FESTIVALS.length - 1];
  const next = idx < FESTIVALS.length - 1 ? FESTIVALS[idx + 1] : FESTIVALS[0];
  return { prev, next };
}
