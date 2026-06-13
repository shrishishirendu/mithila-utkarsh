// Blog posts for Mithila Utkarsh.
// Authored here as data for now (simple + fast); can move to a Supabase-backed
// editor later. Content is a list of blocks so we never need dangerouslySetInnerHTML.
//
// Block types: { type: "p" | "h" | "quote", text }

export const BLOG_POSTS = [
  {
    slug: "welcome-to-the-dalaan",
    title: "Welcome to the Dalaan",
    titleDevanagari: "दलान में स्वागत अछि",
    date: "2026-06-14",
    author: "Mithila Utkarsh",
    tags: ["Announcements"],
    excerpt:
      "Why we built a digital home for the Maithil diaspora — and what you'll find when you step inside.",
    content: [
      { type: "p", text: "In a Maithil home, the dalaan is the front room — where guests are received, where elders sit, where stories are told. We named our home page after it on purpose. This is where we'd like to receive you." },
      { type: "p", text: "Mithila Utkarsh began with a simple ache: we grew up hearing Maithili and seeing a script our grandparents wrote in, and our children — born far from Mithila — deserve to know it too. A language, a script, a calendar, a way of marking the year: these are not museum pieces. They are living, and they travel with us." },
      { type: "h", text: "What you'll find inside" },
      { type: "p", text: "Learn Mithilakshar takes you through the Tirhuta script letter by letter. The Dictionary holds everyday words, Mithila-only ideas, and the fakrā that carry village wit. Translation and Transliteration help you cross between English, Maithili and the script. Festivals walks through the year — from Jur Sital to Vivaha Panchami. And the Panchang calculates the Maithil day for any city, any date." },
      { type: "p", text: "Some rooms are still being built — Literature, Arts, a shop. They'll open as we go. None of this is finished, and that's the point: it's meant to grow with the people it's for." },
      { type: "quote", text: "Carrying Mithila to the world." },
      { type: "p", text: "If your family's tradition differs from what you read here, or there's a song or a word we're missing — tell us. The dalaan is more interesting when it's full of voices." },
    ],
  },
  {
    slug: "why-we-lead-with-mithilakshar",
    title: "Why we lead with Mithilakshar",
    titleDevanagari: "हम मिथिलाक्षर केँ आगाँ किएक राखैत छी",
    date: "2026-06-14",
    author: "Mithila Utkarsh",
    tags: ["Script", "Culture"],
    excerpt:
      "The Tirhuta script isn't decoration — it's the wordmark itself, and a quiet act of remembering.",
    content: [
      { type: "p", text: "Across this site you'll notice the Tirhuta (Mithilakshar) script comes first — larger than the English, larger than the Devanagari. That isn't a style choice we made lightly." },
      { type: "p", text: "Mithilakshar is the script in which Maithili was written for centuries — the hand of Vidyapati, of countless manuscripts and marriage records. Over time, print and convenience pushed it to the margins, and most Maithils today can read Maithili in Devanagari but not in their own script. A script doesn't die in a day; it fades when it stops being seen." },
      { type: "h", text: "So we make it the first thing you see" },
      { type: "p", text: "Our wordmark is the Tirhuta itself. Every page leads with it. Every menu item carries its Maithili name in Mithilakshar. The idea is gentle: if you see the script often enough, in ordinary places, it stops being foreign. You begin to recognise a letter, then a word." },
      { type: "p", text: "We know this trades a little convenience — English is what most newcomers read first. We've kept it legible, just quieter. The bet is that familiarity is taught by presence, not by lectures." },
      { type: "p", text: "If you'd like to actually learn it, that's what the Learn Mithilakshar room is for. Start with the vowels. It's closer than it looks." },
    ],
  },
];

export function getSortedPosts() {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export function formatPostDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${d} ${months[m - 1]} ${y}`;
}
