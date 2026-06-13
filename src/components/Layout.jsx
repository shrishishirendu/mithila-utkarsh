import { useState, useEffect, Fragment } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Home, BookOpen, BookA, CalendarHeart, Heart, ShoppingBag, UserCircle,
  Menu, X, LogIn, LogOut, User, Sun, Languages, ArrowRightLeft, Users, ScrollText, Palette
} from "lucide-react";
import { BorderPattern } from "./Motifs.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";

// Menu labels are English; the Maithili name rides along as a small eyebrow.
// (The right-hand page hero carries all three scripts: Tirhuta · English · Devanagari.)
// eyebrow = roman Maithili (kept for the hover tooltip); eyebrowDev = Devanagari,
// rendered in Tirhuta (Mithilakshar) under each menu label.
const NAV_ITEMS = [
  { id: "home",          label: "Home",               path: "/",           icon: Home,           eyebrow: "Dalan",              eyebrowDev: "दलान" },
  { id: "mithilakshar",  label: "Learn Mithilakshar", path: "/learn",      icon: BookOpen,       eyebrow: "Sikhu Mithilakshar", eyebrowDev: "सिखू मिथिलाक्षर",
    // Language & script tools nest under Mithilakshar (always visible, not collapsed)
    children: [
      { id: "dictionary",    label: "Dictionary",      path: "/dictionary", icon: BookA,          eyebrow: "Shabdkosh",      eyebrowDev: "शब्दकोश" },
      { id: "translate",     label: "Translation",     path: "/translate",  icon: ArrowRightLeft, eyebrow: "Anuvaadak",      eyebrowDev: "अनुवादक" },
      { id: "transliterate", label: "Transliteration", path: "/tirhuta",    icon: Languages,      eyebrow: "Lipi Pravartak", eyebrowDev: "लिपि प्रवर्तक" },
    ],
  },
  { id: "festivals",     label: "Festivals",          path: "/festivals",  icon: CalendarHeart,  eyebrow: "Pabain",             eyebrowDev: "पाबैन" },
  { id: "panchang",      label: "Panchang",           path: "/panchang",   icon: Sun,            eyebrow: "Panchang",           eyebrowDev: "पञ्चाङ्ग" },
  { id: "ghatkaiti",     label: "Matrimony",          path: "/ghatkaiti",  icon: Heart,          eyebrow: "Ghatkaiti",          eyebrowDev: "घटकैती" },
  { id: "shop",          label: "Shopping",           path: "/shop",       icon: ShoppingBag,    eyebrow: "Bazar-Haat",         eyebrowDev: "बजार-हाट" },
  { id: "literature",    label: "Literature",         path: "/literature", icon: ScrollText,     eyebrow: "Sahitya",            eyebrowDev: "साहित्य" },
  { id: "arts",          label: "Arts & Culture",     path: "/arts",       icon: Palette,        eyebrow: "Kala evam Sanskriti", eyebrowDev: "कला एवं संस्कृति" },
];
// Membership lives off-menu now — surfaced via the global <MembershipPill /> on every page.

// ============================================================
// A single nav row — used for top-level items and nested children.
// `compact` shrinks the icon/text for child rows.
// ============================================================
function NavItemRow({ item, onNavigate, compact }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-start gap-3 px-3 ${compact ? "py-2" : "py-2.5"} my-0.5 rounded-xl transition-all ${
          isActive ? "" : "hover:bg-white/30"
        }`
      }
      style={({ isActive }) =>
        isActive
          ? { background: "var(--paper)", boxShadow: "inset 0 0 0 1px var(--cream-2), 0 1px 3px rgba(27, 26, 46, 0.07)" }
          : { color: "var(--ink)" }
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`${compact ? "w-7 h-7" : "w-9 h-9"} rounded-lg grid place-items-center shrink-0 mt-0.5`}
            style={{
              background: isActive ? "var(--vermillion)" : "var(--cream-2)",
              color: isActive ? "var(--paper)" : "var(--ink)",
            }}
          >
            <Icon className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          </span>
          <div className="leading-tight pt-0.5">
            <div
              className={`font-display ${compact ? "text-sm" : "text-base"} leading-tight`}
              style={{ color: isActive ? "var(--vermillion-dark)" : "var(--ink)" }}
            >
              {item.label}
            </div>
            <div className="font-tirhuta text-[13px] font-medium leading-tight mt-0.5"
                 style={{ color: "var(--ink)", opacity: 0.85 }}
                 title={item.eyebrow}>
              {item.eyebrowDev ? devanagariToTirhuta(item.eyebrowDev) : item.eyebrow}
            </div>
          </div>
        </>
      )}
    </NavLink>
  );
}

// ============================================================
// Sidebar Content (used by both desktop sidebar and mobile drawer)
// ============================================================
function SidebarContent({ onNavigate, learnedCount, totalCount }) {
  const pct = totalCount === 0 ? 0 : Math.round((learnedCount / totalCount) * 100);
  return (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4">
        <div className="leading-tight">
          <div className="font-tirhuta text-3xl leading-tight"
               style={{ color: "var(--vermillion)" }}
               title="Mithila Utkarsh in Tirhuta">
            𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭
          </div>
          <div className="font-display text-base mt-2 leading-tight"
               style={{ color: "var(--vermillion-dark)" }}>
            Mithila Utkarsh
          </div>
          <div className="text-xs mt-0.5"
               style={{ color: "var(--ink)", opacity: 0.55 }}>
            मिथिला उत्कर्ष
          </div>
        </div>
        <div className="mt-4" style={{ color: "var(--vermillion)" }}>
          <BorderPattern />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Fragment key={item.id}>
            <NavItemRow item={item} onNavigate={onNavigate} />

            {/* Nested group under a parent — the learning-progress card (Learn only)
                plus the child links, indented behind a guide line so they read as
                one cluster grouped beneath the parent. */}
            {item.children && (
              <div className="ml-5 pl-3 mt-0.5 mb-1.5" style={{ borderLeft: "1.5px solid var(--cream-2)" }}>
                {item.id === "mithilakshar" && (
                  <div className="rounded-xl px-3 py-2 mb-1" style={{ background: "var(--cream-2)" }}>
                    <div className="flex items-center justify-between text-[10px] font-medium"
                         style={{ color: "var(--ink)", opacity: 0.75 }}>
                      <span>{learnedCount} / {totalCount} learned</span>
                      <span style={{ color: "var(--vermillion-dark)" }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: "var(--paper)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                           style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--turmeric), var(--vermillion))" }} />
                    </div>
                  </div>
                )}
                {item.children.map((child) => (
                  <NavItemRow key={child.id} item={child} onNavigate={onNavigate} compact />
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </nav>

      <AuthWidget />

      <div className="px-6 pb-5 pt-1 text-[10px]" style={{ opacity: 0.55 }}>
        © Mithila Utkarsh · <span className="font-display italic">Carrying Mithila to the World</span>
      </div>
    </div>
  );
}

// ============================================================
// Layout — desktop sidebar + mobile drawer + main area
// ============================================================
export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Track learned count from localStorage (Mithilakshar progress)
  // The total is fixed: 11 vowels + 33 consonants + 10 numbers + 13 matras + 15 conjuncts = 82
  const TOTAL_CHARS = 82;
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const v = localStorage.getItem("mcsa-learned");
        if (v) setLearnedCount(JSON.parse(v).length);
        else setLearnedCount(0);
      } catch (_) {}
    };
    update();
    // Watch storage events (cross-tab) and a custom event for same-tab updates
    window.addEventListener("storage", update);
    window.addEventListener("mcsa-progress-update", update);
    // Poll occasionally to catch updates from within the same tab
    const interval = setInterval(update, 1500);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("mcsa-progress-update", update);
      clearInterval(interval);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const flatNav = NAV_ITEMS.flatMap((n) => (n.children ? [...n.children, n] : [n]));
  const currentPage = flatNav.find((n) =>
    n.path === "/" ? location.pathname === "/" : location.pathname.startsWith(n.path)
  );

  return (
    <div className="min-h-screen w-full font-body lg:flex"
         style={{ background: "var(--cream)", color: "var(--ink)" }}>

      {/* --- Desktop sidebar --- */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 sticky top-0 h-screen"
             style={{ background: "var(--cream)", borderRight: "1px solid var(--cream-2)" }}>
        <SidebarContent learnedCount={learnedCount} totalCount={TOTAL_CHARS} />
      </aside>

      {/* --- Mobile top bar --- */}
      <header className="lg:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
              style={{ background: "var(--cream)", borderBottom: "1px solid var(--cream-2)" }}>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="w-10 h-10 rounded-xl grid place-items-center"
          style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-center leading-tight flex-1 min-w-0">
          <div className="font-tirhuta text-lg leading-none truncate"
               style={{ color: "var(--vermillion)" }}>
            𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭
          </div>
          <div className="text-[10px] tracking-[0.18em] uppercase mt-1"
               style={{ color: "var(--vermillion-dark)", opacity: 0.8 }}>
            Mithila Utkarsh
          </div>
          {currentPage && (
            <div className="text-[10px] mt-0.5"
                 style={{ opacity: 0.55 }}>
              {currentPage.label}
            </div>
          )}
        </div>
        <div className="w-10" aria-hidden="true" />
      </header>

      {/* --- Mobile drawer --- */}
      {drawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: "rgba(27,26,46,0.55)" }}
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[300px] max-w-[85vw] flex flex-col"
            style={{ background: "var(--cream)", borderRight: "1px solid var(--cream-2)" }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg grid place-items-center z-10"
              style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent
              learnedCount={learnedCount}
              totalCount={TOTAL_CHARS}
              onNavigate={() => setDrawerOpen(false)}
            />
          </aside>
        </>
      )}

      {/* --- Main content --- */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      {/* --- Global membership CTA (every page, signed-out only) --- */}
      <MembershipPill />
    </div>
  );
}

// ============================================================
//  MembershipPill — fixed bottom-right CTA shown on every page.
//  Only for signed-out visitors; hidden where it would be redundant.
// ============================================================
function MembershipPill() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading || user) return null;
  const hideOn = ["/membership", "/signup", "/signin"];
  if (hideOn.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <Link
      to="/membership"
      aria-label="Become a member"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full transition-transform hover:-translate-y-0.5"
      style={{
        background: "var(--vermillion)",
        color: "var(--paper)",
        boxShadow: "0 8px 24px rgba(193,39,45,0.35)",
      }}
    >
      <span className="w-7 h-7 rounded-full grid place-items-center shrink-0"
            style={{ background: "rgba(255,255,255,0.18)" }}>
        <Heart className="w-4 h-4" fill="currentColor" />
      </span>
      <span className="leading-tight text-left">
        <span className="block font-display text-sm font-semibold">Become a Member</span>
        <span className="block text-[10px] tracking-wider uppercase" style={{ opacity: 0.85 }}>
          सदस्य बनू
        </span>
      </span>
    </Link>
  );
}

// ============================================================
//  AuthWidget — sits in the sidebar between progress and footer
//  Shows Sign in/up if logged out; user identity + Sign out if in
// ============================================================

function AuthWidget() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="px-6 py-3 text-[11px]" style={{ opacity: 0.4 }}>
        Checking session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-3 mb-2 flex gap-2">
        <Link to="/signin"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <LogIn className="w-3.5 h-3.5" /> Sign in
        </Link>
        <Link to="/signup"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border"
              style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="px-3 mb-2">
      <Link to="/profile"
            className="block px-3 py-2.5 rounded-xl"
            style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--vermillion-dark)" }} />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] tracking-[0.18em] uppercase" style={{ opacity: 0.55 }}>
              Signed in
            </div>
            <div className="text-xs truncate" style={{ color: "var(--vermillion-dark)" }} title={user.email}>
              {user.email}
            </div>
          </div>
        </div>
      </Link>
      <button onClick={() => signOut()}
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px]"
              style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>
        <LogOut className="w-3 h-3" /> Sign out
      </button>
    </div>
  );
}
