# Mithila Utkarsh

**Carrying Mithila to the World.**

A digital home for the Maithil diaspora — learn the Tirhuta script of our ancestors, walk through the festivals of a Mithil year, and stay connected to who we are, wherever in the world we are.

Built with **Vite + React + Tailwind + React Router**.

---

## What's inside

Five modules, accessible via a **left sidebar** on desktop or a **drawer** on mobile:

| Module                | Status                            | URL              |
| --------------------- | --------------------------------- | ---------------- |
| **Home**              | Live                              | `/`              |
| **Mithilakshar**      | Live (script learning, full)      | `/learn`         |
| **Pavain & Tyohar**   | Live (13 festivals, drafts)       | `/festivals`     |
| **Ghatkaiti**         | Placeholder + roadmap             | `/ghatkaiti`     |
| **Merchandise**       | Placeholder + roadmap             | `/shop`          |
| **Membership**        | Tiers + roadmap, no auth yet      | `/membership`    |

Two modules are functionally live (Mithilakshar and Festivals). The other three are designed placeholder pages with feature descriptions and roadmaps, so the full product vision is visible from day one.

---

## Prerequisites

- **Node.js 18 or later** — [download](https://nodejs.org)
- **npm** (bundled with Node.js)

```bash
node --version    # should print v18 or higher
```

---

## Quick start

```bash
npm install
npm run dev
```

Vite opens `http://localhost:5173` automatically. Edits to any file in `src/` hot-reload.

---

## Project structure

```
mithilakshar-app/
├── index.html              HTML shell, font links, favicon
├── package.json            Dependencies & scripts
├── vite.config.js          Vite config
├── tailwind.config.js      Tailwind config
├── postcss.config.js       PostCSS plugins
├── .gitignore
├── README.md               this file
├── public/
│   ├── logo.svg                  The Mithila Utkarsh mark (vector)
│   ├── favicon.png               Browser tab icon
│   └── apple-touch-icon.png      iOS home-screen icon
└── src/
    ├── main.jsx                  React entry point
    ├── App.jsx                   Router config (all routes)
    ├── index.css                 Global styles, CSS variables, Tailwind
    ├── MithilaksharLearn.jsx     Mithilakshar module (~1000 lines)
    ├── components/
    │   ├── Layout.jsx                Desktop sidebar + mobile drawer + content area
    │   ├── Logo.jsx                  The brand mark (inline SVG)
    │   ├── Motifs.jsx                Shared Madhubani-inspired SVG decorations
    │   └── PageBuildingBlocks.jsx    Reusable PageHero, CapabilityGrid, RoadmapBar, NotifyMe
    ├── data/
    │   └── festivals.js              13 festivals with content
    └── pages/
        ├── HomePage.jsx              Landing — brand hero + module grid
        ├── MithilaksharPage.jsx      Wraps MithilaksharLearn
        ├── FestivalsPage.jsx         Pavain/Tyohar — calendar + filters
        ├── FestivalDetailPage.jsx    Per-festival rich detail
        ├── GhatkaitiPage.jsx         Placeholder
        ├── MerchandisePage.jsx       Placeholder
        └── MembershipPage.jsx        Tiers + feature matrix
```

---

## Scripts

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload               |
| `npm run build`   | Build for production → outputs to `dist/`          |
| `npm run preview` | Preview the production build locally               |

---

## Brand

| Form            | Rendering                              | Use                              |
| --------------- | -------------------------------------- | -------------------------------- |
| **Primary**     | **Mithila Utkarsh**                    | Everywhere; default name         |
| **Secondary**   | **𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭** *(Tirhuta)*       | Hero, sidebar, signature element |
| **Tertiary**    | **मिथिला उत्कर्ष** *(Devanagari)*        | Hero, supporting brand           |
| **Tagline**     | *Carrying Mithila to the World*        | Hero, footer, meta description   |

Brand palette (`src/index.css` CSS variables):

| Token         | Hex       | Used for                              |
| ------------- | --------- | ------------------------------------- |
| `--cream`     | `#F6EBD0` | App background                        |
| `--paper`     | `#FBF4E0` | Cards, sidebar surface                |
| `--vermillion`| `#B43A2E` | Primary accent, logo outlines, links  |
| `--turmeric`  | `#D69926` | Sun, progress, secondary accent       |
| `--indigo`    | `#2A3A6B` | Water motifs                          |
| `--leaf`      | `#486B3C` | Eyebrows, success states              |
| `--ink`       | `#1B1A2E` | Primary text, dark surfaces           |

Type stack:

- **Fraunces** — display headings, italic accents
- **DM Sans** — body
- **Noto Sans Tirhuta** — Tirhuta script throughout

---

## Architecture notes

**Routing.** `react-router-dom` v7 with `createBrowserRouter`. The `Layout` component wraps every page (sidebar + drawer). Each page is responsible for its own content.

**Mithilakshar module.** Self-contained. State, persistence (`localStorage`), three internal modes (Browse / Practice / Write). When progress changes, dispatches a `mcsa-progress-update` window event so the sidebar progress counter refreshes.

**Festivals module.** Data lives in `src/data/festivals.js`. Two pages: list (`/festivals`) and detail (`/festivals/:slug`). The list auto-highlights the next upcoming festival based on `approxMonth`.

**Placeholder pages.** Built from a shared toolkit in `PageBuildingBlocks.jsx`. New placeholder modules can be added by composing these blocks.

**Mobile-first navigation.** Below `lg` (1024px), the sidebar collapses into a hamburger-triggered drawer. Above `lg`, the sidebar is always visible.

---

## What's working

- ✅ Full Mithilakshar module: Svara, Vyañjana, Aṅka, Mātrā (with full class comparison), Sanyukta
- ✅ Browse / Practice / Write modes with persistent progress
- ✅ 13 festivals — 7 with rich content, 6 with summary content
- ✅ Per-festival detail pages with rituals, foods, songs, regional notes
- ✅ Routing across all five modules
- ✅ Responsive layout (sidebar / drawer)
- ✅ Three-script brand identity (Roman + Tirhuta + Devanagari)

## What's stubbed (placeholders for future phases)

- ❌ Auth / accounts — coming with Supabase integration (Phase 1)
- ❌ Real email signup forms — placeholder alerts for now
- ❌ Audio recordings for Mithilakshar and festival songs
- ❌ Stroke order tutor for Mithilakshar Write mode
- ❌ Real panchang API for exact festival dates
- ❌ Ghatkaiti calculations — mock-up of result shape only
- ❌ Merchandise store — Shopify integration not wired
- ❌ Payments — RevenueCat + Stripe in Phase 4

---

## Troubleshooting

**Tirhuta characters show as boxes.**
Noto Sans Tirhuta loads from Google Fonts. Check your internet or corporate proxy. For offline use, self-host the font.

**Port 5173 is taken.**
```bash
npm run dev -- --port 3000
```

**Reset your local progress.**
DevTools → Application → Local Storage → remove `mcsa-learned` and `mcsa-practised`.

**404 errors on direct route loads in production.**
Static hosts need to be configured to serve `index.html` for all paths. Vercel and Netlify handle this automatically. For Nginx/Apache, configure a fallback to `/index.html`.

---

## Deploying

```bash
npm run build
```

Then upload `dist/` to any static host.

With Vercel (currently deployed at `maithils-abroad.vercel.app`):
```bash
vercel --prod
```

The Vercel project name doesn't need to change — only the brand inside the app does.

---

## Roadmap

| Phase | Months | Highlights                                              |
| ----- | ------ | ------------------------------------------------------- |
| 0     | M1–M2  | Foundations (this prototype is the M1 output)           |
| 1     | M3–M5  | Auth, profile, Supabase backend, festival audio start  |
| 2     | M6     | Closed beta to early supporters                        |
| 3     | M7–M8  | Public free launch; dictionary v1                      |
| 4     | M9–M10 | Merchandise live; recipes, songs, art modules          |
| 5     | M11+   | Subscription on; Ghatkaiti beta; family plan           |

---

*Mithila Utkarsh — carrying Mithila to the world.*
