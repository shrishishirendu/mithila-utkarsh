import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Home, BookOpen, BookA, CalendarHeart, Sparkles, ShoppingBag, UserCircle,
  Menu, X, Trophy, LogIn, LogOut, User, Sun, Languages
} from "lucide-react";
import { BorderPattern } from "./Motifs.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

const NAV_ITEMS = [
  { id: "home",         label: "Home",          path: "/",            icon: Home,          eyebrow: "Welcome" },
  { id: "mithilakshar", label: "Mithilakshar",  path: "/learn",       icon: BookOpen,      eyebrow: "Learn the script" },
  { id: "transliterate", label: "Transliterate", path: "/tirhuta",    icon: Languages,     eyebrow: "Devanagari → Tirhuta" },
  { id: "dictionary",   label: "Dictionary",    path: "/dictionary",  icon: BookA,         eyebrow: "Word by word" },
  { id: "festivals",    label: "Pavain & Tyohar", path: "/festivals", icon: CalendarHeart, eyebrow: "Festivals" },
  { id: "panchang",     label: "Panchang",      path: "/panchang",    icon: Sun,           eyebrow: "Daily calendar" },
  { id: "ghatkaiti",    label: "Ghatkaiti",     path: "/ghatkaiti",   icon: Sparkles,      eyebrow: "Auspicious moments" },
  { id: "merchandise",  label: "Merchandise",   path: "/shop",        icon: ShoppingBag,   eyebrow: "Wear the heritage" },
  { id: "membership",   label: "Membership",    path: "/membership",  icon: UserCircle,    eyebrow: "Become a member" },
];

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
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-start gap-3 px-3 py-2.5 my-0.5 rounded-xl transition-all ${
                  isActive ? "" : "hover:bg-white/30"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "var(--paper)", boxShadow: "inset 0 0 0 1px var(--cream-2)" }
                  : { color: "var(--ink)" }
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="w-9 h-9 rounded-lg grid place-items-center shrink-0 mt-0.5"
                    style={{
                      background: isActive ? "var(--vermillion)" : "var(--cream-2)",
                      color: isActive ? "var(--paper)" : "var(--ink)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="leading-tight pt-0.5">
                    <div
                      className="font-display text-base leading-tight"
                      style={{ color: isActive ? "var(--vermillion-dark)" : "var(--ink)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-[10px] tracking-wider uppercase mt-0.5"
                      style={{ opacity: 0.6 }}
                    >
                      {item.eyebrow}
                    </div>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Progress footer */}
      <div className="px-5 py-4 m-3 rounded-2xl"
           style={{ background: "var(--cream-2)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-3.5 h-3.5" style={{ color: "var(--turmeric)" }} />
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: "var(--vermillion-dark)" }}>
            Your progress
          </span>
        </div>
        <div className="font-display text-2xl leading-none">
          {learnedCount}<span className="opacity-40 text-base">/{totalCount}</span>
        </div>
        <div className="text-[11px] mt-0.5" style={{ opacity: 0.6 }}>
          {pct}% of Mithilakshar
        </div>
        <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "var(--paper)" }}>
          <div className="h-full transition-all duration-500"
               style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--turmeric), var(--vermillion))" }}/>
        </div>
      </div>

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

  const currentPage = NAV_ITEMS.find((n) =>
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
    </div>
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
