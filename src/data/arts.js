// ============================================================
// Kalā evaṁ Sanskriti — the living arts & culture of Mithila
// ============================================================
// Data-driven, same spirit as literature.js / festivals.js: the content lives
// here, the pages just render it. Three layers sit on top of this file:
//   1. Educational spine  — the ART_FORMS below (what /arts and /arts/:slug show)
//   2. Shop funnel         — each form carries a `shopBlurb` linking to /shop
//   3. Community gallery    — Supabase `arts_submissions` (not in this file)
//
// HOW TO ADD AN ART FORM
// ----------------------
// 1. Pick (or add) a DOMAIN id below.
// 2. Add an entry to ART_FORMS. Text is authored here; the Mithilakshar (Tirhuta)
//    rendering of the Devanagari is generated automatically by the pages — you
//    never type Tirhuta by hand.
// 3. Images are OPTIONAL. A form with no image renders an on-brand Madhubani
//    motif (see `motif`) instead — honest, and never a broken/placeholder photo.
//
// HOW TO ADD A REAL IMAGE (important — rights first)
// --------------------------------------------------
// Only add images you have the right to use: your own photos, a commissioned
// artist's work (with permission), or a clearly-licensed image (public domain /
// Creative Commons) WITH attribution. Fill every field on the image object:
//   { src, alt, credit, license, sourceUrl }
// Drop local files in /public and reference them as "/myphoto.jpg". Do NOT hot-
// link or scrape images from the open web.
//
// NOTE ON THE SCAFFOLD: the descriptions below are real, broadly-documented
// cultural facts meant to be verified, corrected and expanded by an editor. The
// artist names are well-known figures; keep the list honest — add only names you
// can stand behind. Nothing here invents a work or an image.
// ============================================================

// ------------------------------------------------------------
// Domains — the broad families the art forms group under.
// ------------------------------------------------------------
export const DOMAINS = [
  {
    id: "painting",
    title: "Painting & Wall Art",
    devanagari: "चित्रकला",
    blurb:
      "The line-and-colour tradition of Mithila — from the painted courtyard and the wedding wall to handmade paper carried into the world's galleries.",
  },
  {
    id: "craft",
    title: "Craft & Handwork",
    devanagari: "हस्तशिल्प",
    blurb:
      "What the hands of Mithila shape from grass, thread and cloth — coiled baskets, storytelling quilts and the objects of everyday ritual.",
  },
  {
    id: "performing",
    title: "Music, Dance & Folk",
    devanagari: "संगीत, नृत्य ओ लोक-कला",
    blurb:
      "The arts that live in voice and movement — Vidyāpati's songs still sung today, the dances of the seasons, and the festival-arts of the courtyard.",
  },
];

// ------------------------------------------------------------
// Art forms. Shape:
//   id         unique key (used as arts_submissions.art_form too)
//   slug       URL-safe (becomes /arts/<slug>)
//   name       English / roman name
//   devanagari Devanagari name (Tirhuta auto-derived by the page)
//   domain     a DOMAINS id
//   motif      "sun" | "lotus" | "fish" | "peacock" — the fallback visual
//   tagline    one line shown under the title
//   blurb      short summary for the index card
//   history    array of paragraphs — how it came to be
//   technique  array of paragraphs — how it is made
//   motifs     array of short strings — the recurring symbols/elements
//   artists    array of { name, note } — notable practitioners (optional)
//   shopBlurb  the /shop funnel line for this form (Layer 2)
//   images     array of { src, alt, credit, license, sourceUrl } (optional)
// ------------------------------------------------------------
export const ART_FORMS = [
  // ---------------- Painting & Wall Art ----------------
  {
    id: "madhubani",
    slug: "madhubani-painting",
    name: "Madhubani (Mithila) Painting",
    devanagari: "मधुबनी चित्रकला",
    domain: "painting",
    motif: "peacock",
    tagline: "Mithila's best-known art — bold outline, natural colour, and a world of symbols.",
    blurb:
      "Painted for generations by the women of Mithila — first on courtyard walls and floors, now on handmade paper carried around the world. Every gap is filled; nothing is left empty.",
    history: [
      "Madhubani — also called Mithila painting — began as domestic art: women painted the mud walls and floors of the home (bhitti-chitra) and drew ritual floor diagrams (aripan) for festivals, weddings and the seasons. By tradition it is traced all the way to the Rāmāyaṇa, when King Janak is said to have had the town adorned for Sītā's wedding to Rāma.",
      "The wider world noticed the wall paintings after the 1934 Bihar earthquake, when the cracked-open houses revealed them to outside observers. In the 1960s a drought pushed the art from wall to paper as a livelihood — artists began painting on handmade sheets that could be sold, and Mithila painting became a name known far beyond the region.",
      "It carries a Geographical Indication (GI) tag as Mithila Painting, and today lives in three homes at once: the courtyard wall, the gallery, and the diaspora household keeping the tradition alive abroad.",
    ],
    technique: [
      "Traditionally painted with twigs, matchsticks, nib-pens and the fingers, using colours made from what the household had: soot and kajal for black, turmeric for yellow, vermillion and kusum flower for red, indigo for blue, bel leaves for green.",
      "Two classic hands sit at its core — kachni, fine monochrome line-work that fills the form with delicate hatching, and bharni, bold outlines flooded with colour. Alongside them are the Godna, Tantrik and Gobar schools. A defining rule: no empty space — every gap is filled with flowers, birds and geometric pattern.",
    ],
    motifs: ["Fish", "Peacock", "Elephant", "Tortoise", "Lotus", "Bamboo", "Sun & moon", "Snakes (Nāg)", "Kohbar", "Rādhā-Kṛṣṇa & Rāma-Sītā"],
    artists: [
      { name: "Jagdamba Devi", note: "Among the first from Mithila honoured with the Padma Shri (1975)." },
      { name: "Sita Devi", note: "Padma Shri; brought the bharni (filled-colour) style to national attention." },
      { name: "Ganga Devi", note: "Padma Shri; master of the kachni line, known for her narrative 'cycle' works." },
      { name: "Mahasundari Devi", note: "Padma Shri; a lifelong force in organising and teaching the art." },
      { name: "Baua Devi", note: "Padma Shri; carried the Jitwarpur lineage to global exhibitions." },
      { name: "Dulari Devi", note: "Padma Shri; rose from household help to celebrated artist and teacher." },
      { name: "Bharti Dayal", note: "A leading contemporary voice taking Mithila painting in new directions." },
    ],
    shopBlurb: "Bring home an original Madhubani painting or a signed print — commissioned from Mithila artists, with attribution.",
    images: [],
  },
  {
    id: "kohbar",
    slug: "kohbar",
    name: "Kohbar — the wedding wall",
    devanagari: "कोहबर",
    domain: "painting",
    motif: "lotus",
    tagline: "The painted wall of the nuptial chamber — a prayer for union and fertility.",
    blurb:
      "The ritual painting made on the wall of the wedding chamber (kohbar-ghar) — a lotus pond, a bamboo grove and a ring of symbols wishing the couple union, progeny and prosperity.",
    history: [
      "Kohbar is painted by the women of the household for a wedding, on the wall of the kohbar-ghar where the bride and groom first sit together. It is not decoration alone — it is a blessing worked in symbol.",
      "At its centre is the purain, the lotus-root pond, standing for the feminine and for fertility; beside it rises the bamboo, standing for the lineage and the masculine. Around them the painter rings the sun, the moon, fish, tortoise and parrots — each a wish for the couple's life together. What began as a wall-rite is now also painted as a Madhubani composition in its own right.",
    ],
    technique: [
      "A symbolic geometry rather than a scene: the ringed lotus pond (purain), the bamboo grove, and encircling motifs — sun, moon, fish, tortoise, parrots and the Nāg-Nāgin — arranged to enclose and bless the couple.",
    ],
    motifs: ["Purain (lotus-root pond)", "Bamboo grove", "Sun & moon", "Fish", "Tortoise", "Parrots", "Nāg-Nāgin"],
    artists: [],
    shopBlurb: "Commission a Kohbar painting for a wedding or a home — the traditional blessing, made to last.",
    images: [
      {
        src: "/kohbar.jpg",
        alt: "A Kohbar wedding-chamber painting in the Mithila style, with the ringed lotus pond and Shree Yantra",
        credit: "Arti Kumari",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:KOHBAR_BY_ARTI_KUMARI.jpg",
        title: "Kohbar with Shree Yantra",
      },
    ],
  },
  {
    id: "godna",
    slug: "godna",
    name: "Godna — tattoo art",
    devanagari: "गोदना",
    domain: "painting",
    motif: "sun",
    tagline: "Skin-markings turned into a school of painting.",
    blurb:
      "The tattooing tradition of Mithila — geometric and figurative marks once worn on the body — reborn on paper as a distinctive, mostly monochrome school of Madhubani.",
    history: [
      "Godnā means tattoo. For generations these marks were worn on the body as adornment, protection and identity — rows of small figures, plants and encircling patterns.",
      "In the studio era the same visual language moved onto paper, becoming the Godna school of Mithila painting — closely associated with artists of the Dusādh community and often carrying the lore of Rājā Salhes. It reads at a glance: fine, repeated line-work rather than flooded colour.",
    ],
    technique: [
      "Concentric rings and dense rows of small repeated forms — figures, trees, animals and deities — built up in fine line-work, traditionally in a single earthy tone.",
    ],
    motifs: ["Concentric circles", "Rows of small figures", "Trees & creepers", "Rājā Salhes legends"],
    artists: [],
    shopBlurb: "Look for Godna-style prints in the shop — the tattoo tradition on paper.",
    images: [],
  },

  // ---------------- Craft & Handwork ----------------
  {
    id: "sikki",
    slug: "sikki-grass-craft",
    name: "Sikki Grass Craft",
    devanagari: "सिक्की",
    domain: "craft",
    motif: "sun",
    tagline: "Golden marsh grass coiled into baskets, boxes and dolls.",
    blurb:
      "Objects coiled and stitched from golden sikki grass — dolls, boxes, the ritual mauni basket and bright ornaments — a craft passed hand to hand among Mithila's women.",
    history: [
      "Sikki is a golden grass that grows in Mithila's wetlands. Dried, and often dyed in bright colours, it is worked into the objects of everyday and ceremonial life — the mauni (a lidded ritual basket), the pauti (box), toys, dolls and ornaments that once travelled with a bride in her dowry.",
      "It remains a living cottage craft, and a source of income for women's collectives across the region.",
    ],
    technique: [
      "Bundles of grass are coiled and bound with split sikki using a pointed awl (takua), round upon round, to build up the walls of a basket or the body of a doll. Dyed strands are worked in for pattern and colour.",
    ],
    motifs: ["Mauni & dauri baskets", "Pauti boxes", "Dolls & birds", "Bright geometric bands"],
    artists: [],
    shopBlurb: "Find sikki baskets, boxes and dolls in the shop — made by Mithila's grass-craft artisans.",
    images: [],
  },
  {
    id: "sujani",
    slug: "sujani-embroidery",
    name: "Sujani Embroidery",
    devanagari: "सुजनी",
    domain: "craft",
    motif: "fish",
    tagline: "Quilts that tell stories in running stitch.",
    blurb:
      "A quilting-and-embroidery tradition in which worn cloth is layered and stitched into narrative textiles — once made to swaddle a newborn, now a storytelling art in its own right.",
    history: [
      "The name is often read as su-jani, an auspicious birth: old saris and dhotis were layered and quilted into soft wraps for a newborn. Little was wasted, and much was wished for.",
      "Revived around Bhusra village in the Muzaffarpur region, Sujani grew into a women's art of narrative and message — village life, festivals and social themes stitched across the cloth. It carries a Geographical Indication tag as the Sujini embroidery work of Bihar.",
    ],
    technique: [
      "Layers of cloth are held together with running stitch; motifs are first outlined — often in chain or running stitch — and then filled with coloured thread, so a whole scene builds across the quilt.",
    ],
    motifs: ["Sun at the centre", "Human figures", "Village & festival scenes", "Social messages"],
    artists: [],
    shopBlurb: "Discover Sujani quilts and textiles in the shop — narrative embroidery from Mithila's women.",
    images: [],
  },

  // ---------------- Music, Dance & Folk ----------------
  {
    id: "sangeet",
    slug: "maithili-folk-music",
    name: "Maithili Folk Music",
    devanagari: "मैथिली लोकगीत",
    domain: "performing",
    motif: "peacock",
    tagline: "From Vidyāpati's padas to the songs of the wedding courtyard.",
    blurb:
      "The songs of Mithila — Vidyāpati's padāvalī still sung today, alongside the songs of birth, marriage, harvest and the turning seasons, raised mostly by women in the courtyard.",
    history: [
      "Song is woven through Mithila life. Vidyāpati's padas, six centuries old, are still sung; and around them is a whole calendar of folk song — sohar for a birth, samdāun as the bride is sent to her new home, lagni and other wedding songs, jhūmar, barahmāsa for the twelve months, and the songs of Chhath.",
      "This is largely a women's tradition, carried in the courtyard and at every rite of passage, and it has crossed into the wider world through singers who made the Maithili voice famous — most of all Sharda Sinha, long the voice of Mithila's festival and Chhath songs.",
    ],
    technique: [
      "An oral, communal art: melodies and words passed on by ear and occasion, sung in call-and-response, tied to a particular moment in a life or a year rather than to a stage.",
    ],
    motifs: ["Sohar (birth)", "Samdāun (farewell of the bride)", "Lagni (wedding)", "Jhūmar", "Barahmāsa", "Chhath songs"],
    artists: [
      { name: "Vidyāpati", note: "The fountainhead — padas sung across Mithila for six centuries. See also Literature." },
      { name: "Sharda Sinha", note: "The enduring voice of Maithili folk and Chhath song; Padma honours." },
    ],
    shopBlurb: "Look for Maithili music and Vidyāpati song collections in the shop.",
    images: [],
  },
  {
    id: "nritya",
    slug: "folk-dance",
    name: "Folk Dance",
    devanagari: "लोक-नृत्य",
    domain: "performing",
    motif: "lotus",
    tagline: "Jhijhiyā, Jat-Jatin and Domkach — the dances of Mithila's seasons and weddings.",
    blurb:
      "Community dances tied to festival and marriage — a lit, perforated pot balanced on the head at Dashain; the paired story-dance of the monsoon; and the women's dance of the wedding night.",
    history: [
      "Jhijhiyā is danced during Dashain (Navrātri): women move with a perforated earthen pot, holes cut all around and a lamp burning inside, balanced on the head — a dance meant to guard against ill-wishing and dark magic.",
      "Jat-Jatin is a monsoon dance for a pair — a husband and wife — telling their story of love, quarrel and separation, and calling for rain. Domkach is a women's dance performed in the house at a wedding, especially while the men are away with the marriage party (baraat).",
    ],
    technique: [
      "Folk forms danced in groups to sung accompaniment and simple percussion, learned by joining in rather than by training — the dance belongs to the occasion.",
    ],
    motifs: ["Jhijhiyā (the lit pot)", "Jat-Jatin (the monsoon pair)", "Domkach (the wedding night)"],
    artists: [],
    shopBlurb: "Festival kits and music in the shop help carry these celebrations to the diaspora.",
    images: [],
  },
  {
    id: "sama-chakeva",
    slug: "sama-chakeva",
    name: "Sāmā-Chakevā",
    devanagari: "सामा-चकेवा",
    domain: "performing",
    motif: "peacock",
    tagline: "A sister's festival of clay birds and folk song.",
    blurb:
      "A folk festival-art of Kārtik in which girls model and paint clay figures of Sāmā, Chakevā and their companions, sing of a sister's love for her brother, and float or break the idols at the close.",
    history: [
      "Held in the month of Kārtik, just after Chhath, Sāmā-Chakevā celebrates the bond of sister and brother through the legend of Sāmā and her brother Sāmb. Over several evenings girls make small clay figures — Sāmā and Chakevā, the mischief-maker Chugla, and others — paint them, and sing together.",
      "On the final night the songs ask a brother's long life and the idols are given to the field or the water — a festival that is at once craft, painting and song.",
    ],
    technique: [
      "Clay modelling, folk painting and communal singing brought together over the nights of the festival — the art is inseparable from the ritual.",
    ],
    motifs: ["Sāmā & Chakevā (the birds)", "Chugla (the tale-bearer)", "Vrindāvan", "Nightly folk song"],
    artists: [],
    shopBlurb: "Sāmā-Chakevā festival kits in the shop bring the ritual to families far from home.",
    images: [],
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
export function getArtForm(slug) {
  return ART_FORMS.find((a) => a.slug === slug);
}

export function getArtFormById(id) {
  return ART_FORMS.find((a) => a.id === id);
}

export function getFormsByDomain(domainId) {
  return ART_FORMS.filter((a) => a.domain === domainId);
}

export function getDomain(id) {
  return DOMAINS.find((d) => d.id === id);
}

// For the contribute form's "which art form?" select.
export const ART_FORM_OPTIONS = ART_FORMS.map((a) => [a.id, a.name]);

// Short label lookup (used by the gallery + admin cards).
export const ART_FORM_LABELS = Object.fromEntries(ART_FORMS.map((a) => [a.id, a.name]));
