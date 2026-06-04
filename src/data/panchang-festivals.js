// Dated festivals from the printed Mithila Vishwavidyalaya Panchang's पर्व सूची for Lakshmana Samvat 908 / Bangla Sann 1434.
// Used for calendar overlay markers on /panchang. Distinct from src/data/festivals.js which holds rich content.
//
// Field meanings:
//   date            — ISO date (YYYY-MM-DD)
//   nameDevanagari  — name as printed in the Panchang
//   nameEnglish     — English transliteration / common name
//   note            — brief context (especially for Mithila-specific festivals)
//   mithilaSpecific — true if uniquely or distinctively a Mithila tradition
//   sita            — true if directly connected to Sita Mata (her two days get accent treatment)

export const PANCHANG_FESTIVALS = [
  // August 2026
  { date: "2026-08-03", nameDevanagari: "मीना पंचमी",          nameEnglish: "Meena Panchami",        note: "" },
  { date: "2026-08-15", nameDevanagari: "मधुश्रावणी व्रत",     nameEnglish: "Madhushravani Vrat",    note: "Mithila vrat for newly-married women — songs and rituals over multiple days", mithilaSpecific: true },
  { date: "2026-08-15", nameDevanagari: "स्वतंत्रता दिवस",    nameEnglish: "Independence Day",      note: "" },
  { date: "2026-08-17", nameDevanagari: "नाग पञ्चमी",         nameEnglish: "Naga Panchami",         note: "" },
  { date: "2026-08-28", nameDevanagari: "रक्षाबन्धन",         nameEnglish: "Raksha Bandhan",        note: "" },

  // September 2026
  { date: "2026-09-04", nameDevanagari: "कृष्णाष्टमी व्रत",    nameEnglish: "Krishna Janmashtami",   note: "" },
  { date: "2026-09-14", nameDevanagari: "हरितालिका व्रत",     nameEnglish: "Haritalika Teej",       note: "" },
  { date: "2026-09-14", nameDevanagari: "चौठचन्द्र व्रत",      nameEnglish: "Chauth Chandra Vrat",   note: "Mithila-distinctive vrat", mithilaSpecific: true },
  { date: "2026-09-17", nameDevanagari: "विश्वकर्मा पूजा",    nameEnglish: "Vishwakarma Puja",      note: "" },
  { date: "2026-09-23", nameDevanagari: "इन्द्रपूजारम्भ",      nameEnglish: "Indra Puja begins",     note: "" },
  { date: "2026-09-25", nameDevanagari: "अनन्त १४ व्रत",      nameEnglish: "Anant 14 Vrat",         note: "" },
  { date: "2026-09-26", nameDevanagari: "अगस्त्यार्घदान",     nameEnglish: "Agastyarghadan",        note: "" },
  { date: "2026-09-27", nameDevanagari: "पितृपक्षारम्भ",      nameEnglish: "Pitri Paksha begins",   note: "" },

  // October 2026
  { date: "2026-10-02", nameDevanagari: "गाँधी जयन्ती",       nameEnglish: "Gandhi Jayanti",        note: "" },
  { date: "2026-10-03", nameDevanagari: "जिमूतवाहन व्रत",     nameEnglish: "Jimutavahana Vrat (Jitiya)", note: "Major Maithili festival — mothers' fast for sons' wellbeing", mithilaSpecific: true },
  { date: "2026-10-10", nameDevanagari: "पितृपक्षान्त",        nameEnglish: "Pitri Paksha ends",     note: "" },
  { date: "2026-10-11", nameDevanagari: "कलशस्थापन",          nameEnglish: "Kalash Sthapan",        note: "Start of Navratri" },
  { date: "2026-10-16", nameDevanagari: "बेलनौती",            nameEnglish: "Bel Nauti",             note: "Mithila Durga Puja ritual — invocation of the goddess into the bel tree", mithilaSpecific: true },
  { date: "2026-10-18", nameDevanagari: "निशापूजा",           nameEnglish: "Nisha Puja",            note: "Durga Puja night worship" },
  { date: "2026-10-18", nameDevanagari: "महाष्टमी व्रत",      nameEnglish: "Mahashtami Vrat",       note: "" },
  { date: "2026-10-20", nameDevanagari: "महानवमी व्रत",       nameEnglish: "Mahanavami Vrat",       note: "" },
  { date: "2026-10-21", nameDevanagari: "विजयादशमी",          nameEnglish: "Vijayadashami",         note: "Dussehra" },
  { date: "2026-10-25", nameDevanagari: "कोजागरा",            nameEnglish: "Kojagara",              note: "Mithila Sharad Purnima — Lakshmi-Kojagari vigil", mithilaSpecific: true },

  // November 2026
  { date: "2026-11-06", nameDevanagari: "धनतेरस",             nameEnglish: "Dhanteras",             note: "" },
  { date: "2026-11-08", nameDevanagari: "काली पूजा",          nameEnglish: "Kali Puja",             note: "" },
  { date: "2026-11-08", nameDevanagari: "दियावाती",           nameEnglish: "Diyabati (Diwali)",     note: "Maithili name for Diwali", mithilaSpecific: true },
  { date: "2026-11-09", nameDevanagari: "सोमवती अमावस्या",   nameEnglish: "Somvati Amavasya",      note: "" },
  { date: "2026-11-11", nameDevanagari: "भ्रातृ द्वि० / चित्रगुप्त पूजा", nameEnglish: "Bhratri Dwitiya · Chitragupta Puja", note: "" },
  { date: "2026-11-15", nameDevanagari: "छठ व्रत",            nameEnglish: "Chhath Vrat",           note: "Major Maithili–Bihari festival to the Sun god" },
  { date: "2026-11-16", nameDevanagari: "सामा पूजारम्भ",      nameEnglish: "Sama Puja begins",      note: "Mithila sister–brother festival; Sama-Chakeva clay figurines", mithilaSpecific: true },
  { date: "2026-11-18", nameDevanagari: "अक्षय नवमी",         nameEnglish: "Akshay Navami",         note: "" },
  { date: "2026-11-20", nameDevanagari: "देवोत्थान एकादशी",   nameEnglish: "Devotthan Ekadashi",    note: "" },
  { date: "2026-11-22", nameDevanagari: "वा० रवित्रतारम्भ",   nameEnglish: "Ravivrat begins",       note: "" },
  { date: "2026-11-24", nameDevanagari: "सामा विसर्जन",       nameEnglish: "Sama Visarjan",         note: "Closing of Sama-Chakeva", mithilaSpecific: true },
  { date: "2026-11-24", nameDevanagari: "कार्तिक पूर्णिमा",   nameEnglish: "Kartik Purnima",        note: "" },
  { date: "2026-11-29", nameDevanagari: "बीड़ पंचमी",         nameEnglish: "Beed Panchami",         note: "" },

  // December 2026
  { date: "2026-12-14", nameDevanagari: "विवाह पंचमी",        nameEnglish: "Vivaha Panchami",       note: "Ram & Sita's wedding day — uniquely central to Mithila", sita: true, mithilaSpecific: true },
  { date: "2026-12-20", nameDevanagari: "गीता जयन्ती",        nameEnglish: "Gita Jayanti",          note: "" },

  // January 2027
  { date: "2027-01-05", nameDevanagari: "दशतारारम्भ",         nameEnglish: "Dashatara begins",      note: "" },
  { date: "2027-01-15", nameDevanagari: "मकर संक्रान्ति",     nameEnglish: "Makar Sankranti",       note: "" },
  { date: "2027-01-15", nameDevanagari: "दशतारान्त",          nameEnglish: "Dashatara ends",        note: "" },
  { date: "2027-01-26", nameDevanagari: "गणतंत्र दिवस",       nameEnglish: "Republic Day",          note: "" },

  // February 2027
  { date: "2027-02-04", nameDevanagari: "नरक निवारण १४ व्रत", nameEnglish: "Narak Nivaran Vrat",   note: "" },
  { date: "2027-02-06", nameDevanagari: "माघी मौनी अमा०",     nameEnglish: "Maghi Mauni Amavasya",  note: "" },
  { date: "2027-02-11", nameDevanagari: "सरस्वती पूजा",       nameEnglish: "Saraswati Puja",        note: "" },
  { date: "2027-02-13", nameDevanagari: "अचला सप्तमी",        nameEnglish: "Achala Saptami",        note: "" },

  // March 2027
  { date: "2027-03-06", nameDevanagari: "महाशिवरात्रि व्रत",  nameEnglish: "Maha Shivratri",        note: "" },
  { date: "2027-03-08", nameDevanagari: "सोमवती अमा०",        nameEnglish: "Somvati Amavasya",      note: "" },
  { date: "2027-03-21", nameDevanagari: "होलिकादहन",          nameEnglish: "Holika Dahan",          note: "" },
  { date: "2027-03-22", nameDevanagari: "होली",                nameEnglish: "Holi",                  note: "" },

  // April 2027
  { date: "2027-04-07", nameDevanagari: "वा० नवरात्रारम्भ",   nameEnglish: "Vasanti Navratra begins", note: "" },
  { date: "2027-04-12", nameDevanagari: "वा० छठि व्रत",       nameEnglish: "Vasanti Chhathi Vrat",  note: "" },
  { date: "2027-04-14", nameDevanagari: "सतुआईन",             nameEnglish: "Satuain",               note: "Maithili harvest / Mesha Sankranti festival — eating sattu", mithilaSpecific: true },
  { date: "2027-04-15", nameDevanagari: "रामनवमी",            nameEnglish: "Ram Navami",            note: "" },
  { date: "2027-04-15", nameDevanagari: "जुड़शीतल",            nameEnglish: "Jud Sheetal",           note: "Maithili New Year — cold-water blessings", mithilaSpecific: true },
  { date: "2027-04-16", nameDevanagari: "वा० विजयादशमी",      nameEnglish: "Vasanti Vijayadashami", note: "" },

  // May 2027
  { date: "2027-05-01", nameDevanagari: "वा० रवित्रतान्त",    nameEnglish: "Ravivrat ends",         note: "" },
  { date: "2027-05-01", nameDevanagari: "अक्षय तृतीया",       nameEnglish: "Akshay Tritiya",        note: "" },
  { date: "2027-05-14", nameDevanagari: "जानकी नवमी",         nameEnglish: "Janaki Navami",         note: "Sita Mata's birthday — daughter of Mithila", sita: true, mithilaSpecific: true },

  // June 2027
  { date: "2027-06-04", nameDevanagari: "वटसावित्री व्रत",    nameEnglish: "Vat Savitri Vrat",      note: "" },
  { date: "2027-06-13", nameDevanagari: "गंगा दशहरा",         nameEnglish: "Ganga Dussehra",        note: "" },

  // July 2027
  { date: "2027-07-05", nameDevanagari: "जगन्नाथ रथ यात्रा",  nameEnglish: "Jagannath Rath Yatra",  note: "" },
  { date: "2027-07-14", nameDevanagari: "हरिशयन ११ व्रत",     nameEnglish: "Harishayan Ekadashi",   note: "" },
  { date: "2027-07-18", nameDevanagari: "आषाढ़ी गुरु पूर्णिमा", nameEnglish: "Guru Purnima",          note: "" },
];

// Quick lookup: returns the list of festivals for a given ISO date (may be empty / multiple).
export function festivalsForDate(dateIso) {
  return PANCHANG_FESTIVALS.filter((f) => f.date === dateIso);
}