// Month panchang calendar for /panchang. Each day shows tithi, paksha, nakshatra,
// sunrise/sunset, moonrise/moonset (from the engine's ?month= grid) plus festival
// markers (from panchang-festivals.js). Desktop renders a 7-column grid; mobile
// falls back to a scrollable day-list. Clicking a day lifts the selection to the
// page, which fetches the full single-day detail and scrolls to it.

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle, Sun, Moon, Star } from "lucide-react";
import { SitaMotif } from "./SitaMotif.jsx";
import { festivalsForDate } from "../data/panchang-festivals.js";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isoFor(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function fmtTime(iso) {
  if (!iso) return "—";
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "—";
}

function pakshaLabel(p) {
  return p === "shukla" ? "Shukla" : p === "krishna" ? "Krishna" : "";
}

// Color treatment per festival type: Sita days vermillion, Mithila-specific leaf, others cream.
function festTone(f) {
  if (f.sita) return { bg: "var(--vermillion-dark)", fg: "var(--paper)" };
  if (f.mithilaSpecific) return { bg: "var(--leaf)", fg: "var(--paper)" };
  return { bg: "var(--cream-2)", fg: "var(--ink)" };
}

export function FestivalCalendar({ city, selectedDate, onSelectDate, todayIso }) {
  const [view, setView] = useState(() => ({
    year: parseInt(selectedDate.slice(0, 4), 10),
    month: parseInt(selectedDate.slice(5, 7), 10),
  }));
  const [byDate, setByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Follow the selected date into its month.
  useEffect(() => {
    setView({
      year: parseInt(selectedDate.slice(0, 4), 10),
      month: parseInt(selectedDate.slice(5, 7), 10),
    });
  }, [selectedDate]);

  // Fetch the whole month's grid in one call.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const mm = `${view.year}-${String(view.month).padStart(2, "0")}`;
    const url = `/api/panchang?month=${mm}&lat=${city.lat}&lon=${city.lon}&tz=${encodeURIComponent(city.tz)}`;
    // In dev, bypass the browser HTTP cache so engine changes always show.
    fetch(url, import.meta.env.DEV ? { cache: "no-store" } : undefined)
      .then(async (r) => {
        if (!r.ok) {
          const b = await r.json().catch(() => ({}));
          throw new Error(b.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((j) => {
        if (cancelled) return;
        const map = {};
        (j.days || []).forEach((d) => { map[d.date] = d; });
        setByDate(map);
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [view.year, view.month, city.lat, city.lon, city.tz]);

  function shift(delta) {
    setView((v) => {
      let m = v.month + delta;
      let y = v.year;
      if (m < 1) { m = 12; y -= 1; }
      if (m > 12) { m = 1; y += 1; }
      return { year: y, month: m };
    });
  }

  const firstWeekday = new Date(view.year, view.month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(view.year, view.month, 0).getDate();
  const leading = Array.from({ length: firstWeekday }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function dayProps(d) {
    const dayIso = isoFor(view.year, view.month, d);
    return {
      day: d,
      dayIso,
      info: byDate[dayIso],
      fests: festivalsForDate(dayIso),
      isSelected: dayIso === selectedDate,
      isToday: dayIso === todayIso,
      onClick: () => onSelectDate(dayIso),
    };
  }

  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      {/* Header: month + nav */}
      <div className="px-5 py-4 flex items-center justify-between"
           style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
               style={{ color: "var(--indigo)" }}>
            Panchang calendar · पञ्चाङ्ग
          </div>
          <div className="font-display text-2xl leading-tight mt-0.5 flex items-center gap-2">
            {MONTH_NAMES[view.month - 1]} {view.year}
            {loading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--indigo)" }} />}
          </div>
          <div className="text-[11px]" style={{ opacity: 0.6 }}>{city.name}, {city.region}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <NavButton onClick={() => shift(-1)} label="Previous month"><ChevronLeft className="w-4 h-4" /></NavButton>
          <NavButton onClick={() => shift(1)} label="Next month"><ChevronRight className="w-4 h-4" /></NavButton>
        </div>
      </div>

      {error ? (
        <div className="px-5 py-8 flex items-center gap-3 text-sm" style={{ opacity: 0.75 }}>
          <AlertTriangle className="w-4 h-4" style={{ color: "var(--vermillion)" }} />
          Couldn't load this month — {error}
        </div>
      ) : (
        <>
          {/* Desktop: 7-column grid */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-7" style={{ borderTop: "1px solid var(--cream-2)" }}>
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-2 text-center text-[10px] tracking-[0.14em] uppercase font-semibold"
                     style={{ color: "var(--indigo)", opacity: 0.7 }}>
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px" style={{ background: "var(--cream-2)" }}>
              {leading.map((_, i) => (
                <div key={`lead-${i}`} style={{ background: "var(--cream)" }} />
              ))}
              {days.map((d) => <DayCellRich key={d} {...dayProps(d)} />)}
            </div>
          </div>

          {/* Mobile: scrollable day-list */}
          <div className="sm:hidden flex flex-col gap-px"
               style={{ background: "var(--cream-2)", borderTop: "1px solid var(--cream-2)" }}>
            {days.map((d) => (
              <DayRow key={d} {...dayProps(d)}
                      weekdayShort={WEEKDAYS[new Date(view.year, view.month - 1, d).getDay()]} />
            ))}
          </div>
        </>
      )}

      {/* Legend + coverage note */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px]"
           style={{ background: "var(--cream)", borderTop: "1px solid var(--cream-2)" }}>
        <LegendDot color="var(--vermillion-dark)" label="Sita day" />
        <LegendDot color="var(--leaf)" label="Mithila festival" />
        <LegendDot color="var(--cream-2)" label="Other festival" ring />
        <span style={{ opacity: 0.5 }}>
          Sun · moon-rashi · nakshatra · tithi for any month · festival list covers La. Sam. 908 (Aug 2026 – Jul 2027)
        </span>
      </div>
    </div>
  );
}

// Sun (rise·set), Moon rashi, and Nakshatra (with change-time) — the Drik-style block.
function PanchangLines({ info, tiny }) {
  const sz = tiny ? "w-2.5 h-2.5" : "w-3 h-3";
  const Wrap = tiny ? "div" : "span";
  return (
    <>
      <Wrap className="flex items-center gap-1">
        <Sun className={`${sz} shrink-0`} style={{ color: "var(--turmeric)" }} />
        {fmtTime(info?.sunrise)} · {fmtTime(info?.sunset)}
      </Wrap>
      {info?.rashi && (
        <Wrap className="flex items-center gap-1">
          <Moon className={`${sz} shrink-0`} style={{ color: "var(--indigo)" }} />
          {info.rashi.name}
        </Wrap>
      )}
      {info?.nakshatra && (
        <Wrap className="flex items-center gap-1 min-w-0">
          <Star className={`${sz} shrink-0`} style={{ color: "var(--leaf)" }} />
          <span className="truncate">
            {info.nakshatra.name}{info.nakshatra.ends_at ? ` · ${fmtTime(info.nakshatra.ends_at)}` : ""}
          </span>
        </Wrap>
      )}
    </>
  );
}

function DayCellRich({ day, info, fests, isSelected, isToday, onClick }) {
  const t = info?.tithi;
  const special = t && (t.name === "Purnima" || t.name === "Amavasya");
  return (
    <button
      onClick={onClick}
      className="text-left p-2 min-h-[134px] flex flex-col gap-1 transition-colors"
      style={{
        background: isSelected ? "var(--cream-2)" : "var(--paper)",
        boxShadow: isSelected ? "inset 0 0 0 2px var(--indigo)" : "none",
      }}
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold"
              style={isToday
                ? { background: "var(--vermillion)", color: "var(--paper)" }
                : { color: isSelected ? "var(--indigo)" : "var(--ink)" }}>
          {day}
        </span>
        <div className="flex items-center gap-1">
          {fests.some((f) => f.sita) && <SitaMotif size={11} />}
          {t && <span className="text-[9px]" style={{ opacity: 0.45 }}>{t.number_in_paksha}</span>}
        </div>
      </div>

      {t ? (
        <div className="text-[11px] font-semibold leading-tight"
             style={{ color: special ? "var(--indigo)" : "var(--ink)" }}>
          {t.name === "Purnima" && "● "}{t.name === "Amavasya" && "○ "}{t.name}
          <span className="font-normal" style={{ opacity: 0.6 }}> · {pakshaLabel(t.paksha)}</span>
        </div>
      ) : (
        <div className="text-[9px]" style={{ opacity: 0.4 }}>—</div>
      )}

      <div className="text-[9px] space-y-0.5" style={{ opacity: 0.72 }}>
        <PanchangLines info={info} tiny />
      </div>

      {fests.length > 0 && (
        <div className="flex flex-col gap-0.5 mt-auto">
          {fests.slice(0, 2).map((f, i) => {
            const tone = festTone(f);
            return (
              <span key={i}
                    className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] leading-tight font-medium"
                    style={{ background: tone.bg, color: tone.fg }}>
                {f.sita && <SitaMotif size={8} color="var(--paper)" opacity={1} />}
                <span className="truncate">{f.nameEnglish}</span>
              </span>
            );
          })}
          {fests.length > 2 && (
            <span className="text-[9px]" style={{ opacity: 0.6 }}>+{fests.length - 2} more</span>
          )}
        </div>
      )}
    </button>
  );
}

function DayRow({ day, info, fests, weekdayShort, isSelected, isToday, onClick }) {
  const t = info?.tithi;
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex gap-3 p-3 transition-colors"
      style={{
        background: isSelected ? "var(--cream-2)" : "var(--paper)",
        boxShadow: isSelected ? "inset 0 0 0 2px var(--indigo)" : "none",
      }}
    >
      <div className="flex flex-col items-center w-10 shrink-0">
        <span className="text-[10px] uppercase tracking-wide" style={{ opacity: 0.55 }}>{weekdayShort}</span>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mt-0.5"
              style={isToday
                ? { background: "var(--vermillion)", color: "var(--paper)" }
                : { color: isSelected ? "var(--indigo)" : "var(--ink)" }}>
          {day}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {t ? (
          <div className="text-sm font-semibold leading-tight">
            {t.name}
            <span className="text-[11px] font-normal" style={{ opacity: 0.6 }}> · {pakshaLabel(t.paksha)}</span>
          </div>
        ) : (
          <div className="text-sm" style={{ opacity: 0.4 }}>—</div>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] mt-1" style={{ opacity: 0.72 }}>
          <PanchangLines info={info} />
        </div>

        {fests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {fests.map((f, i) => {
              const tone = festTone(f);
              return (
                <span key={i}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{ background: tone.bg, color: tone.fg }}>
                  {f.sita && <SitaMotif size={9} color="var(--paper)" opacity={1} />}
                  {f.nameEnglish}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </button>
  );
}

function NavButton({ onClick, label, children }) {
  return (
    <button onClick={onClick} aria-label={label}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--paper)", border: "1px solid var(--cream-2)", color: "var(--indigo)" }}>
      {children}
    </button>
  );
}

function LegendDot({ color, label, ring }) {
  return (
    <span className="inline-flex items-center gap-1.5" style={{ opacity: 0.8 }}>
      <span className="w-2.5 h-2.5 rounded-full"
            style={{ background: color, border: ring ? "1px solid var(--ink)" : "none" }} />
      {label}
    </span>
  );
}
