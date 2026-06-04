// Year-header strip showing the four samvats / calendar systems for the current Mithila year.
// Lakshmana Samvat is most prominent — the printed Panchang typically omits it, so we reclaim it here.

export function YearHeaderStrip({ meta }) {
  if (!meta) return null;

  const items = [
    {
      label: "लक्ष्मण सम्वत्",
      labelEn: "Lakshmana Samvat",
      value: String(meta.samvats.lakshmana),
      prominent: true,
    },
    {
      label: "बङ्गाब्द",
      labelEn: "Bangla Sann",
      value: String(meta.samvats.bangla),
    },
    {
      label: "विक्रम सम्वत्",
      labelEn: "Vikram Samvat",
      value: `${meta.samvats.vikram.from}–${String(meta.samvats.vikram.to).slice(-2)}`,
    },
    {
      label: "ईस्वी सन्",
      labelEn: "Common Era",
      value: `${meta.samvats.gregorian.from}–${String(meta.samvats.gregorian.to).slice(-2)}`,
    },
  ];

  return (
    <div className="rounded-3xl p-4 sm:p-5"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-3"
           style={{ color: "var(--indigo)" }}>
        Mithila Year · मिथिला वर्ष
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it) => (
          <SamvatCell key={it.labelEn} {...it} />
        ))}
      </div>
    </div>
  );
}

function SamvatCell({ label, labelEn, value, prominent }) {
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        background: prominent ? "var(--cream-2)" : "var(--cream)",
        border: prominent ? "1px solid var(--indigo)" : "1px solid transparent",
      }}
    >
      <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
           style={{ color: prominent ? "var(--indigo)" : "var(--ink)", opacity: prominent ? 1 : 0.6 }}>
        {labelEn}
      </div>
      <div className={`font-display leading-tight mt-1 ${prominent ? "text-2xl sm:text-3xl" : "text-xl"}`}
           style={{ color: prominent ? "var(--indigo)" : "var(--ink)" }}>
        {value}
      </div>
      <div className="text-[11px] mt-0.5" style={{ opacity: 0.65 }}>
        {label}
      </div>
    </div>
  );
}