import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Search, MapPin, Home, Briefcase, Loader2, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { PageHero } from "../components/PageBuildingBlocks.jsx";
import { BorderPattern } from "../components/Motifs.jsx";
import { devanagariToTirhuta } from "../data/tirhuta.js";

function initials(name) {
  return (name || "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MembersPage() {
  const { user, loading: authLoading } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, city, native_place, profession, bio")
        .eq("listed", true)
        .order("display_name", { ascending: true });
      if (cancelled) return;
      if (error) setError(error.message);
      else setMembers((data || []).filter((m) => m.display_name)); // listed but unnamed -> skip
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.display_name, m.city, m.native_place, m.profession, m.bio]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q))
    );
  }, [members, query]);

  return (
    <div className="pb-12">
      <PageHero
        eyebrow="Community · Phase 1B"
        title="Member Directory"
        tirhuta={devanagariToTirhuta("सदस्य")}
        devanagari="मिथिला परिवार"
        description="Find other Maithils — at home and across the diaspora. Only members who choose to be listed appear here, and only signed-in members can browse."
      />

      <section className="px-6 lg:px-10 max-w-5xl mx-auto">
        {authLoading ? (
          <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
        ) : !user ? (
          <SignedOutTeaser />
        ) : (
          <>
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "var(--vermillion)", opacity: 0.55 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, city, native place, profession…"
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm"
                style={{ background: "var(--cream)", border: "1px solid var(--cream-2)", color: "var(--ink)", outline: "none" }}
              />
            </div>

            {loading ? (
              <Center><Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--vermillion)" }} /></Center>
            ) : error ? (
              <div className="mt-6 rounded-2xl px-4 py-3 text-sm"
                   style={{ background: "rgba(180, 58, 46, 0.08)", color: "var(--vermillion-dark)" }}>
                Couldn't load members — {error}
              </div>
            ) : members.length === 0 ? (
              <EmptyDirectory />
            ) : (
              <>
                <div className="mt-4 text-[11px] tracking-[0.14em] uppercase" style={{ opacity: 0.55 }}>
                  {filtered.length} {filtered.length === 1 ? "member" : "members"}
                  {query && ` matching “${query}”`}
                </div>
                {filtered.length === 0 ? (
                  <div className="mt-6 text-sm" style={{ opacity: 0.6 }}>No members match that search.</div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((m) => <MemberCard key={m.id} m={m} />)}
                  </div>
                )}
              </>
            )}

            {/* Listing nudge */}
            <div className="mt-8 rounded-2xl p-4 flex items-start gap-3"
                 style={{ background: "var(--cream-2)" }}>
              <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--indigo)" }} />
              <div className="text-sm" style={{ opacity: 0.8 }}>
                Don't see yourself here? You appear only after switching on{" "}
                <Link to="/profile" className="font-semibold underline" style={{ color: "var(--vermillion-dark)" }}>
                  “List me in the Member Directory”
                </Link>{" "}on your profile.
              </div>
            </div>
          </>
        )}

        <div className="mt-10" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
          <BorderPattern />
        </div>
      </section>
    </div>
  );
}

function MemberCard({ m }) {
  return (
    <div className="rounded-3xl p-5 flex gap-4"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full shrink-0 grid place-items-center font-display text-lg"
           style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
        {initials(m.display_name) || "·"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg leading-tight">{m.display_name}</div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ opacity: 0.75 }}>
          {m.city && (
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: "var(--indigo)" }} />{m.city}</span>
          )}
          {m.native_place && (
            <span className="inline-flex items-center gap-1"><Home className="w-3 h-3" style={{ color: "var(--leaf)" }} />{m.native_place}</span>
          )}
          {m.profession && (
            <span className="inline-flex items-center gap-1"><Briefcase className="w-3 h-3" style={{ color: "var(--turmeric)" }} />{m.profession}</span>
          )}
        </div>
        {m.bio && <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.8 }}>{m.bio}</p>}
      </div>
    </div>
  );
}

function SignedOutTeaser() {
  return (
    <div className="rounded-3xl p-8 text-center max-w-lg mx-auto"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="w-12 h-12 rounded-full grid place-items-center mx-auto"
           style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
        <Users className="w-5 h-5" />
      </div>
      <div className="font-display text-xl mt-4">The Member Directory is for members</div>
      <p className="text-sm mt-2" style={{ opacity: 0.7 }}>
        Sign in to see who else is around — and add yourself to the community.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <Link to="/signin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: "var(--ink)", color: "var(--paper)" }}>
          <LogIn className="w-4 h-4" /> Sign in
        </Link>
        <Link to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border"
              style={{ borderColor: "var(--cream-2)", background: "var(--paper)", color: "var(--ink)" }}>
          <UserPlus className="w-4 h-4" /> Sign up
        </Link>
      </div>
    </div>
  );
}

function EmptyDirectory() {
  return (
    <div className="mt-6 rounded-3xl p-8 text-center"
         style={{ background: "var(--paper)", border: "1px dashed var(--cream-2)" }}>
      <div className="font-display text-lg" style={{ color: "var(--vermillion-dark)" }}>No members listed yet</div>
      <p className="text-sm mt-1.5" style={{ opacity: 0.7 }}>
        Be the first — switch on{" "}
        <Link to="/profile" className="font-semibold underline" style={{ color: "var(--vermillion-dark)" }}>
          “List me in the Member Directory”
        </Link>{" "}on your profile.
      </p>
    </div>
  );
}

function Center({ children }) {
  return <div className="py-16 flex items-center justify-center">{children}</div>;
}
