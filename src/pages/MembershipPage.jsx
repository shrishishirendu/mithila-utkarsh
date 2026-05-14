import {
  UserCircle, Check, X, Crown, Users, Star
} from "lucide-react";
import {
  PageHero, RoadmapBar, NotifyMe
} from "../components/PageBuildingBlocks.jsx";

const FEATURE_MATRIX = [
  { feature: "All Mithilakshar basics (vowels, consonants, numbers)", free: true, paid: true },
  { feature: "Mātrās and conjuncts",                                 free: true, paid: true },
  { feature: "Writing practice (canvas)",                            free: true, paid: true },
  { feature: "All festival information (Pavain/Tyohar)",             free: true, paid: true },
  { feature: "Community feed & event RSVPs",                         free: true, paid: true },
  { feature: "Dictionary search",                                    free: true, paid: true },
  { feature: "Advanced Mithilakshar lessons & certificates",         free: false, paid: true },
  { feature: "Festival audio prayers & downloadable kits",           free: false, paid: true },
  { feature: "Ghatkaiti (full auspicious-moment finder)",            free: false, paid: true },
  { feature: "Folk songs & audio library",                           free: false, paid: true },
  { feature: "Offline dictionary access",                            free: false, paid: true },
  { feature: "Ad-free everywhere",                                   free: false, paid: true },
  { feature: "Member badge in community",                            free: false, paid: true },
  { feature: "Early access to new modules",                          free: false, paid: true },
];

const ROADMAP = [
  { id: "p0", when: "M3",        title: "Auth + free tier",   what: "Supabase auth shipping" },
  { id: "p1", when: "M5",        title: "Profile + progress", what: "Per-user state to backend" },
  { id: "p2", when: "M10",       title: "Founder pre-launch", what: "$250 lifetime tier opens" },
  { id: "p3", when: "M11 live",  title: "Subscription on",     what: "$5/mo · $50/yr · family" },
];

export default function MembershipPage() {
  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PageHero
        eyebrow="Membership"
        title="Free now."
        titleAccent="Premium when ready."
        description="The app is free to use today and will stay that way for the cultural basics. When premium launches, $5 AUD a month or $50 a year unlocks the deep stuff — advanced Mithilakshar, Ghatkaiti, audio libraries, and more. Premium subscriptions directly fund the platform."
        phase="Free preview · Paid tier Phase 4"
        accentColor="var(--leaf)"
      />

      {/* Pricing tiers */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-sm uppercase tracking-[0.2em]"
                style={{ color: "var(--vermillion-dark)" }}>
            Tiers
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }} />
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Free */}
          <div className="rounded-3xl p-6 border" style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
            <div className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ opacity: 0.6 }}>
              Today & forever
            </div>
            <div className="font-display text-2xl">Free</div>
            <div className="font-display text-5xl mt-2 leading-none">A$0</div>
            <div className="text-xs mt-1" style={{ opacity: 0.6 }}>per month</div>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "All Mithilakshar basics",
                "Festival information",
                "Community access",
                "Dictionary lookup",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--leaf)" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert("Sign-up is coming in Phase 1 — for now, your progress saves locally to your browser.")}
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "var(--cream-2)" }}>
              Sign up free
            </button>
          </div>

          {/* Premium */}
          <div className="rounded-3xl p-6 relative"
               style={{ background: "var(--ink)", color: "var(--paper)", boxShadow: "0 8px 28px rgba(27,26,46,0.18)" }}>
            <span className="absolute -top-2 right-5 px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold"
                  style={{ background: "var(--turmeric)", color: "var(--ink)" }}>
              Most value
            </span>
            <div className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-2"
                 style={{ color: "var(--turmeric)" }}>
              Phase 4 onwards
            </div>
            <div className="font-display text-2xl">Premium</div>
            <div className="font-display text-5xl mt-2 leading-none">A$5<span className="text-2xl opacity-60">/mo</span></div>
            <div className="text-xs mt-1" style={{ opacity: 0.7 }}>or A$50/year — 2 months free</div>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Everything in Free",
                "Advanced Mithilakshar + certificates",
                "Ghatkaiti (auspicious moments)",
                "Festival audio & downloadable kits",
                "Ad-free, offline-capable",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--turmeric)" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert("Premium isn't live yet — we'll email you when it launches.")}
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold"
              style={{ background: "var(--turmeric)", color: "var(--ink)" }}>
              Notify me at launch
            </button>
          </div>

          {/* Family */}
          <div className="rounded-3xl p-6 border" style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
            <div className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ opacity: 0.6 }}>
              For households
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: "var(--vermillion)" }} />
              <div className="font-display text-2xl">Family</div>
            </div>
            <div className="font-display text-5xl mt-2 leading-none">A$8<span className="text-2xl opacity-60">/mo</span></div>
            <div className="text-xs mt-1" style={{ opacity: 0.6 }}>or A$80/year · up to 4 members</div>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Everything in Premium",
                "4 accounts under one plan",
                "Designed for parents + kids",
                "Shared progress visibility",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--leaf)" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert("Family plans ship alongside Premium — tell us and we'll let you know.")}
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "var(--cream-2)" }}>
              Tell me when it's live
            </button>
          </div>
        </div>
      </section>

      {/* Founder tier */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
             style={{ background: "linear-gradient(135deg, var(--turmeric), var(--vermillion))", color: "var(--paper)" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
                 style={{ background: "rgba(255,255,255,0.18)" }}>
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] tracking-[0.2em] uppercase font-semibold opacity-90">
                Limited offer · at premium launch
              </div>
              <div className="font-display text-3xl leading-tight mt-1">
                Founder tier — A$250 lifetime
              </div>
              <p className="text-sm mt-2 opacity-90 max-w-xl">
                The first 100 supporters get lifetime Premium access for a one-time A$250 payment.
                Helps us fund the build, helps you skip the subscription forever, and earns you a permanent
                founder badge in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature matrix */}
      <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-sm uppercase tracking-[0.2em]"
                style={{ color: "var(--vermillion-dark)" }}>
            What's in each tier
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }} />
        </div>
        <div className="rounded-3xl overflow-hidden border"
             style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
          <div className="px-5 py-3 grid grid-cols-[1fr_80px_80px] gap-4 items-center text-[10px] tracking-[0.18em] uppercase font-semibold"
               style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
            <div>Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center">Premium</div>
          </div>
          {FEATURE_MATRIX.map((row, i) => (
            <div key={i}
                 className="px-5 py-3 grid grid-cols-[1fr_80px_80px] gap-4 items-center text-sm"
                 style={{ borderTop: i === 0 ? "none" : "1px solid var(--cream-2)" }}>
              <div>{row.feature}</div>
              <div className="text-center">
                {row.free
                  ? <Check className="w-4 h-4 inline" style={{ color: "var(--leaf)" }} />
                  : <X className="w-4 h-4 inline" style={{ opacity: 0.3 }} />}
              </div>
              <div className="text-center">
                {row.paid
                  ? <Check className="w-4 h-4 inline" style={{ color: "var(--leaf)" }} />
                  : <X className="w-4 h-4 inline" style={{ opacity: 0.3 }} />}
              </div>
            </div>
          ))}
        </div>
      </section>

      <RoadmapBar
        phases={ROADMAP}
        currentPhase="p0"
        accentColor="var(--leaf)"
      />

      <NotifyMe ctaLabel="Tell me when Premium opens" accentColor="var(--leaf)" />

      <div className="h-12" />
    </div>
  );
}
