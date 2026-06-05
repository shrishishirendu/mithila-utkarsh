// Month calendar for /panchang. Each day cell shows the tithi (from the engine's
// lightweight month endpoint) plus festival markers (from panchang-festivals.js).
// Clicking a day lifts the selection up to the page, which recomputes the full
// result card and scrolls to it.

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
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

  // Follow the selected date into its month (e.g. when typed into the date input).
  useEffect(() => {
    setView({
      year: parseInt(selectedDate.slice(0, 4), 10),
      month: parseInt(selectedDate.slice(5, 7), 10),
    });
  }, [selectedDate]);

  // Fetch the whole month's tithis in one call.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const mm = `${view.year}-${String(view.month).padStart(2, "0")}`;
    const url = `/api/panchang?month=${mm}&lat=${city.lat}&lon=${city.lon}&tz=${encodeURIComponent(city.tz)}`;
    fetch(url)
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

  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      {/* Header: month + nav */}
      <div className="px-5 py-4 flex items-center justify-between"
           style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
               style={{ color: "var(--indigo)" }}>
            Festival calendar · पर्व पात्रिका
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

      {/* Weekday row */}
      <div className="grid grid-cols-7" style={{ borderTop: "1px solid var(--cream-2)" }}>
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-center text-[10px] tracking-[0.14em] uppercase font-semibold"
               style={{ color: "var(--indigo)", opacity: 0.7 }}>
            {w}
          </div>
        ))}
      </div>

      {error ? (
        <div className="px-5 py-8 flex items-center gap-3 text-sm" style={{ opacity: 0.75 }}>
          <AlertTriangle className="w-4 h-4" style={{ color: "var(--vermillion)" }} />
          Couldn't load this month — {error}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-px" style={{ background: "var(--cream-2)" }}>
          {leading.map((_, i) => (
            <div key={`lead-${i}`} style={{ background: "var(--cream)" }} />
          ))}
          {days.map((d) => {
            const dayIso = isoFor(view.year, view.month, d);
            return (
              <DayCell
                key={dayIso}
                day={d}
                dayIso={dayIso}
                info={byDate[dayIso]}
                fests={festivalsForDate(dayIso)}
                isSelected={dayIso === selectedDate}
                isToday={dayIso === todayIso}
                onClick={() => onSelectDate(dayIso)}
              />
            );
          })}
        </div>
      )}

      {/* Legend + coverage note */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px]"
           style={{ background: "var(--cream)", borderTop: "1px solid var(--cream-2)" }}>
        <LegendDot color="var(--vermillion-dark)" label="Sita day" />
        <LegendDot color="var(--leaf)" label="Mithila festival" />
        <LegendDot color="var(--cream-2)" label="Other festival" ring />
        <span style={{ opacity: 0.5 }}>
          Tithi for any month · festival list covers La. Sam. 908 (Aug 2026 – Jul 2027)
        </span>
      </div>
    </div>
  );
}

function DayCell({ day, dayIso, info, fests, isSelected, isToday, onClick }) {
  const tithiName = info?.tithi?.name;
  const isPurnima = tithiName === "Purnima";
  const isAmavasya = tithiName === "Amavasya";
  const special = isPurnima || isAmavasya;

  return (
    <button
      onClick={onClick}
      className="text-left p-1.5 min-h-[62px] sm:min-h-[82px] flex flex-col transition-colors"
      style={{
        background: isSelected ? "var(--cream-2)" : "var(--paper)",
        boxShadow: isSelected ? "inset 0 0 0 2px var(--indigo)" : "none",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold"
          style={isToday
            ? { background: "var(--vermillion)", color: "var(--paper)" }
            : { color: isSelected ? "var(--indigo)" : "var(--ink)" }}
        >
          {day}
        </span>
        {fests.some((f) => f.sita) && <SitaMotif size={11} />}
      </div>

      {tithiName && (
        <span className="text-[9px] mt-0.5 leading-tight"
              style={{
                opacity: special ? 1 : 0.5,
                color: special ? "var(--indigo)" : "inherit",
                fontWeight: special ? 600 : 400,
              }}>
          {isPurnima && "● "}{isAmavasya && "○ "}{tithiName}
        </span>
      )}

      {fests.length > 0 && (
        <>
          {/* Mobile: colored dots */}
          <div className="flex sm:hidden gap-0.5 mt-1 flex-wrap">
            {fests.slice(0, 4).map((f, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: festTone(f).bg, border: f.mithilaSpecific || f.sita ? "none" : "1px solid var(--ink)" }} />
            ))}
          </div>
          {/* Tablet+: name pills */}
          <div className="hidden sm:flex flex-col gap-0.5 mt-1 w-full">
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
        </>
      )}
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
