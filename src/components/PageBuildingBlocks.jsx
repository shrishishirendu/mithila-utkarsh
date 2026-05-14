import { ArrowRight, BellRing } from "lucide-react";
import { BorderPattern } from "./Motifs.jsx";

// ============================================================
// PageHero — top hero for every page
// ============================================================
export function PageHero({ eyebrow, title, titleAccent, tirhuta, devanagari, description, phase, accentColor = "var(--vermillion)", children }) {
  return (
    <section className="px-6 lg:px-10 pt-8 pb-8 max-w-5xl mx-auto relative">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <div className="text-xs tracking-[0.2em] uppercase mb-2"
                 style={{ color: "var(--leaf)" }}>
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight">
            {title}
            {titleAccent && (
              <>
                <br />
                <span className="italic" style={{ color: accentColor }}>{titleAccent}</span>
              </>
            )}
          </h1>
          {tirhuta && (
            <div className="mt-3 font-tirhuta text-2xl sm:text-3xl"
                 style={{ color: "var(--vermillion-dark)" }}
                 title="Tirhuta">
              {tirhuta}
            </div>
          )}
          {devanagari && (
            <div className="mt-1 text-lg"
                 style={{ color: "var(--ink)", opacity: 0.6 }}>
              {devanagari}
            </div>
          )}
          {description && (
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>
              {description}
            </p>
          )}
        </div>
        {phase && (
          <span className="shrink-0 inline-block px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-semibold"
                style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
            {phase}
          </span>
        )}
      </div>
      {children}
      <div className="mt-8" style={{ color: accentColor, opacity: 0.5 }}>
        <BorderPattern />
      </div>
    </section>
  );
}

// ============================================================
// CapabilityGrid — feature/capability cards
// ============================================================
export function CapabilityGrid({ title, capabilities, accentColor = "var(--vermillion)" }) {
  return (
    <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      {title && (
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-sm uppercase tracking-[0.2em]"
                style={{ color: "var(--vermillion-dark)" }}>
            {title}
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }} />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div key={i}
                 className="rounded-2xl p-5 border"
                 style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
              <div className="w-9 h-9 rounded-lg grid place-items-center mb-3"
                   style={{ background: "var(--cream)", color: accentColor }}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="font-display text-lg leading-tight mb-1.5">
                {cap.title}
              </div>
              <p className="text-sm leading-relaxed" style={{ opacity: 0.75 }}>
                {cap.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// RoadmapBar — visual timeline of when this module ships
// ============================================================
export function RoadmapBar({ phases, currentPhase, accentColor = "var(--vermillion)" }) {
  return (
    <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-display text-sm uppercase tracking-[0.2em]"
              style={{ color: "var(--vermillion-dark)" }}>
          Roadmap
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }} />
      </div>
      <div className="rounded-3xl p-5 sm:p-7"
           style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-3 left-3 right-3 h-px" style={{ background: "var(--cream-2)" }} />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {phases.map((p, i) => {
              const isCurrent = p.id === currentPhase;
              const isPast = phases.findIndex(x => x.id === currentPhase) > i;
              return (
                <div key={p.id} className="relative">
                  <div className="flex sm:block items-center gap-3">
                    <span className={`w-6 h-6 rounded-full grid place-items-center text-[10px] font-semibold shrink-0 relative z-10 ${isCurrent ? "ring-2 ring-offset-2" : ""}`}
                          style={{
                            background: isCurrent ? accentColor : (isPast ? "var(--leaf)" : "var(--cream-2)"),
                            color: isCurrent || isPast ? "var(--paper)" : "var(--ink)",
                            ...(isCurrent ? { "--tw-ring-color": accentColor, "--tw-ring-offset-color": "var(--paper)" } : {}),
                          }}>
                      {i + 1}
                    </span>
                    <div className="sm:mt-3 leading-tight">
                      <div className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ opacity: 0.6 }}>
                        {p.when}
                      </div>
                      <div className="font-display text-base mt-0.5" style={{ color: isCurrent ? accentColor : "var(--ink)" }}>
                        {p.title}
                      </div>
                      <div className="text-xs mt-1" style={{ opacity: 0.7 }}>
                        {p.what}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// NotifyMe — email signup placeholder
// ============================================================
export function NotifyMe({ ctaLabel = "Notify me when this launches", accentColor = "var(--vermillion)" }) {
  return (
    <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <div className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
           style={{ background: "var(--cream-2)", border: "1px solid var(--cream-2)" }}>
        <div className="w-12 h-12 rounded-full grid place-items-center shrink-0"
             style={{ background: "var(--paper)", color: accentColor }}>
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-display text-xl leading-tight">
            Want to know when this is ready?
          </div>
          <div className="text-sm mt-1" style={{ opacity: 0.75 }}>
            We'll email you the moment it goes live. No spam, just the launch.
          </div>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <input type="email"
                 placeholder="you@example.com"
                 className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-offset-1"
                 style={{ background: "var(--paper)", borderColor: "var(--cream)", "--tw-ring-color": accentColor }} />
          <button
            onClick={() => alert("This is a placeholder — email signup will be wired up when membership/auth ships.")}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
            style={{ background: "var(--ink)", color: "var(--paper)" }}>
            {ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PreviewCard — wrapper for a sample/teaser content area
// ============================================================
export function PreviewCard({ eyebrow, title, children, accentColor = "var(--vermillion)" }) {
  return (
    <section className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
      <div className="mb-5 flex items-center gap-3">
        <span className="font-display text-sm uppercase tracking-[0.2em]"
              style={{ color: "var(--vermillion-dark)" }}>
          {eyebrow ?? "Preview"}
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--cream-2)" }} />
      </div>
      <div className="rounded-3xl p-6 sm:p-8"
           style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
        {title && (
          <div className="font-display text-2xl mb-4" style={{ color: accentColor }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
