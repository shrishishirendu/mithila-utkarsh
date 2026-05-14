import { BorderPattern } from "./Motifs.jsx";

// ============================================================
//  AuthShell — shared shell for /signin and /signup pages.
//  Includes the brand seal at the top so auth pages feel
//  on-brand and welcoming, not generic.
// ============================================================

export function AuthShell({ eyebrow, title, tirhuta, footer, children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        {/* Brand seal */}
        <div className="text-center mb-8">
          <div className="font-tirhuta text-3xl" style={{ color: "var(--vermillion)" }}>
            𑒧𑒱𑒟𑒱𑒪𑒰 𑒅𑒞𑓂𑒏𑒩𑓂𑒭
          </div>
          <div className="font-display text-lg mt-1" style={{ color: "var(--vermillion-dark)" }}>
            Mithila Utkarsh
          </div>
          <div className="mt-3" style={{ color: "var(--vermillion)", opacity: 0.4 }}>
            <BorderPattern />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 sm:p-8"
             style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
          {eyebrow && (
            <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--leaf)" }}>
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl leading-tight mb-1">{title}</h1>
          {tirhuta && (
            <div className="font-tirhuta text-base mb-5" style={{ color: "var(--vermillion-dark)", opacity: 0.7 }}>
              {tirhuta}
            </div>
          )}

          <div className="mt-5">{children}</div>
        </div>

        {/* Footer link */}
        {footer && (
          <div className="text-center text-sm mt-6" style={{ opacity: 0.78 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
