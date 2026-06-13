// Navadhikāra panel — the year's officers (King, Minister, etc.) and harvest-prediction quantities.
// Mithila tradition: 7 named officers + Samvatsara name + cloud type + वर्षा/धान्य.
// Values are hard-coded per year (see src/data/panchang-meta-908.js); future years need pandit-validated formulas.

import { Crown, ShieldCheck, Sprout, Cloud, Droplets, Wheat, Users } from "lucide-react";

const ROLE_ICONS = {
  "राजा":     Crown,
  "मंत्री":    ShieldCheck,
  "पालक":     Sprout,
  "मेघाधिप":  Cloud,
  "तोयाधिप":  Droplets,
  "शस्याधिप": Wheat,
  "लोकाधिप":  Users,
};

export function NavadhikaraPanel({ meta }) {
  // Officers/harvest figures are published per year in the printed Panchang —
  // we only hold them for the covered year. Other years degrade to a note.
  if (!meta) {
    return (
      <div className="rounded-3xl p-4 sm:p-5"
           style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
        <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
             style={{ color: "var(--indigo)" }}>
          Navadhikāra · नवाधिकार
        </div>
        <p className="text-[12px] mt-1.5 leading-relaxed" style={{ opacity: 0.7 }}>
          The year's officers (King, Minister, rainfall, grain) are published per year
          in the printed Panchang. We currently hold them for{" "}
          <span className="font-semibold" style={{ color: "var(--vermillion-dark)" }}>La. Sam. 908 (2026–27)</span> only —
          other years are pending pandit-validated data. The samvats and the daily
          astronomy above are calculated and accurate for any date.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3"
           style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
        <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
             style={{ color: "var(--indigo)" }}>
          Navadhikāra · नवाधिकार
        </div>
        <div className="font-display text-base leading-tight mt-1">
          The year's officers
        </div>
        <div className="text-[11px] mt-1" style={{ opacity: 0.7 }}>
          Year <span className="font-display italic" style={{ color: "var(--vermillion-dark)" }}>{meta.yearName.devanagari}</span> ({meta.yearName.roman}) · Cloud <span className="font-display italic">{meta.cloudName.devanagari}</span> ({meta.cloudName.roman})
        </div>
      </div>

      {/* Officers list — responsive: 2 on mobile, all 7 on one line at tablet+ */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-px"
           style={{ background: "var(--cream-2)", borderTop: "1px solid var(--cream-2)" }}>
        {meta.officers.map((o, i) => {
          const Icon = ROLE_ICONS[o.role];
          return (
            <div key={i} className="px-2 py-2.5" style={{ background: "var(--paper)" }}>
              <div className="flex items-center gap-1">
                {Icon && <Icon className="w-3 h-3 shrink-0" style={{ color: "var(--indigo)" }} />}
                <div className="text-[9px] tracking-[0.08em] uppercase font-semibold leading-tight"
                     style={{ color: "var(--indigo)", opacity: 0.85 }}>
                  {o.roleEn}
                </div>
              </div>
              <div className="font-display text-sm mt-1 leading-tight">
                {o.planet}
                <span className="block text-[10px] mt-0.5" style={{ opacity: 0.55 }}>
                  {o.planetEn}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: rainfall & grain */}
      <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1"
           style={{ background: "var(--cream)", borderTop: "1px solid var(--cream-2)" }}>
        <Stat labelDev="वर्षा" labelEn="Rainfall" value={meta.rainfall} />
        <Stat labelDev="धान्य" labelEn="Grain"    value={meta.grain} />
      </div>
      <div className="px-4 sm:px-5 pb-3 text-[10px]" style={{ opacity: 0.5, background: "var(--cream)" }}>
        Values for La. Sam. {meta.samvats.lakshmana}. Future years pending pandit-validated formulas.
      </div>
    </div>
  );
}

function Stat({ labelDev, labelEn, value }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] tracking-[0.18em] uppercase font-semibold"
            style={{ color: "var(--vermillion-dark)" }}>
        {labelEn}
      </span>
      <span className="font-display text-xl leading-none">{value}</span>
      <span className="text-xs" style={{ opacity: 0.6 }}>{labelDev}</span>
    </div>
  );
}