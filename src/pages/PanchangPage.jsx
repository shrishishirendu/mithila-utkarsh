import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, MapPin, Clock, AlertTriangle, Loader2, CalendarDays } from "lucide-react";
import { BorderPattern } from "../components/Motifs.jsx";
import { SitaMotif } from "../components/SitaMotif.jsx";
import { YearHeaderStrip } from "../components/YearHeaderStrip.jsx";
import { NavadhikaraPanel } from "../components/NavadhikaraPanel.jsx";
import { FestivalCalendar } from "../components/FestivalCalendar.jsx";
import { metaForDate } from "../data/panchang-meta-908.js";
import { computeSamvats } from "../data/samvats.js";
import { festivalsForDate } from "../data/panchang-festivals.js";
import { devanagariToTirhuta } from "../data/tirhuta.js";

const CITIES = [
  { id: "sitamarhi", name: "Sitamarhi",  region: "Mithila",        lat: 26.59,  lon: 85.49,  tz: "Asia/Kolkata" },
  { id: "madhubani", name: "Madhubani",  region: "Mithila",        lat: 26.36,  lon: 86.07,  tz: "Asia/Kolkata" },
  { id: "darbhanga", name: "Darbhanga",  region: "Mithila",        lat: 26.15,  lon: 85.90,  tz: "Asia/Kolkata" },
  { id: "janakpur",  name: "Janakpur",   region: "Nepal",          lat: 26.73,  lon: 85.93,  tz: "Asia/Kathmandu" },
  { id: "delhi",     name: "Delhi",      region: "India",          lat: 28.61,  lon: 77.21,  tz: "Asia/Kolkata" },
  { id: "mumbai",    name: "Mumbai",     region: "India",          lat: 19.08,  lon: 72.88,  tz: "Asia/Kolkata" },
  { id: "sydney",    name: "Sydney",     region: "Australia",      lat: -33.87, lon: 151.21, tz: "Australia/Sydney" },
  { id: "melbourne", name: "Melbourne",  region: "Australia",      lat: -37.81, lon: 144.96, tz: "Australia/Melbourne" },
  { id: "toronto",   name: "Toronto",    region: "Canada",         lat: 43.65,  lon: -79.38, tz: "America/Toronto" },
  { id: "newyork",   name: "New York",   region: "United States",  lat: 40.71,  lon: -74.01, tz: "America/New_York" },
  { id: "london",    name: "London",     region: "United Kingdom", lat: 51.51,  lon: -0.13,  tz: "Europe/London" },
];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(iso) {
  if (!iso) return "—";
  const m = iso.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : iso;
}

function formatLongDate(iso) {
  const [y, mo, d] = iso.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${parseInt(d, 10)} ${months[parseInt(mo, 10) - 1]} ${y}`;
}

export default function PanchangPage() {
  const [cityId, setCityId] = useState("sitamarhi");
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const city = CITIES.find((c) => c.id === cityId) || CITIES[0];
  const meta = metaForDate(date);              // officers/harvest — only for the covered year
  const samvats = computeSamvats(date);        // La Sam / Bangla / Vikram / CE — any year
  const todaysFestivals = festivalsForDate(date);

  // Picking a day in the calendar updates the selected date and brings the
  // full result card into view.
  function handleSelectDate(iso) {
    setDate(iso);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `/api/panchang?date=${date}&lat=${city.lat}&lon=${city.lon}&tz=${encodeURIComponent(city.tz)}`;
    // In dev, bypass the browser HTTP cache so engine changes always show.
    fetch(url, import.meta.env.DEV ? { cache: "no-store" } : undefined)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((j) => { if (!cancelled) setData(j); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [cityId, date, city.lat, city.lon, city.tz]);

  return (
    <div className="font-body min-h-screen" style={{ color: "var(--ink)" }}>
      <PanchangHero meta={meta} samvats={samvats} />

      {/* Controls — city + date. The month calendar below also drives the date. */}
      <section className="px-6 lg:px-10 py-4 max-w-5xl mx-auto">
        <div className="rounded-3xl p-5 sm:p-6 border"
             style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* City */}
            <label className="block">
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--indigo)" }}>
                <MapPin className="w-3 h-3" /> City
              </span>
              <select value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="mt-2 w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                      style={{ background: "var(--cream)", borderColor: "var(--cream-2)" }}>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.region}</option>
                ))}
              </select>
            </label>

            {/* Date — jump straight to any day, e.g. a birthday decades back */}
            <label className="block">
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--indigo)" }}>
                <CalendarDays className="w-3 h-3" /> Date
              </span>
              <input type="date" value={date} min="1900-01-01" max="2100-12-31"
                     onChange={(e) => e.target.value && handleSelectDate(e.target.value)}
                     className="mt-2 w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                     style={{ background: "var(--cream)", borderColor: "var(--cream-2)" }} />
            </label>
          </div>
          <span className="block text-[11px] mt-3" style={{ opacity: 0.55 }}>
            Pick any date — even decades back, for a birthday — or tap a day in the calendar below.
            The samvats and daily astronomy are calculated for any year.
          </span>
        </div>
      </section>

      {/* Month calendar — the primary date navigator */}
      <section className="px-6 lg:px-10 pt-2 pb-6 max-w-5xl mx-auto">
        <FestivalCalendar
          city={city}
          selectedDate={date}
          onSelectDate={handleSelectDate}
          todayIso={todayISO()}
        />
      </section>

      {/* Selected-day detail */}
      <section ref={resultRef} className="px-6 lg:px-10 pt-2 pb-8 max-w-5xl mx-auto scroll-mt-4">
        {loading && <LoadingCard />}
        {error && <ErrorCard error={error} />}
        {!loading && !error && data && (
          <ResultCard data={data} city={city} date={date} festivals={todaysFestivals} />
        )}
      </section>

      {/* Beta callout */}
      <section className="px-6 lg:px-10 pb-12 max-w-5xl mx-auto">
        <div className="rounded-3xl p-5 sm:p-6 flex items-start gap-3"
             style={{ background: "var(--cream-2)" }}>
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--vermillion-dark)" }} />
          <div>
            <div className="font-display text-base leading-tight" style={{ color: "var(--vermillion-dark)" }}>
              Beta — methodology pending Mithila scholar review
            </div>
            <p className="text-sm mt-1.5 leading-relaxed" style={{ opacity: 0.75 }}>
              Following the Maithili Makaranda tradition — Swiss Ephemeris with Lahiri ayanamsa,
              sunrise reference. Methodology pending pandit review. For important rituals,
              cross-check with your kulpurohit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PanchangHero({ meta, samvats }) {
  return (
    <section className="px-6 lg:px-10 pt-8 pb-8 max-w-5xl mx-auto relative">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left column: brand + title */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 inline-flex items-center gap-2">
            <SitaMotif size={14} />
            <span className="font-display italic text-sm" style={{ color: "var(--vermillion-dark)", letterSpacing: "0.04em" }}>
              मिथिला-दुहिता सीता
            </span>
          </div>
          {/* 3-script title — Mithilakshar primary, English, Devanagari */}
          <h1 className="font-tirhuta text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight"
              style={{ color: "var(--vermillion-dark)" }} title="Mithilakshar (Tirhuta)">
            {devanagariToTirhuta("पञ्चाङ्ग")}
          </h1>
          <div className="font-display text-2xl sm:text-3xl mt-2 leading-tight">
            Panchang <span className="italic" style={{ color: "var(--indigo)" }}>· calculated.</span>
          </div>
          <div className="mt-1.5 text-base sm:text-lg" style={{ color: "var(--ink)", opacity: 0.55 }}>
            पञ्चाङ्ग
          </div>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ opacity: 0.75 }}>
            Tithi, nakshatra, yoga, karana — the astronomical fabric of a Maithil day. Calculated with Swiss Ephemeris and Lahiri ayanamsa, for any city, any date.
          </p>
          <div className="mt-5">
            <span className="inline-block px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-semibold"
                  style={{ background: "var(--cream-2)", color: "var(--vermillion-dark)" }}>
              Beta · Pending scholar review
            </span>
          </div>

          <div className="mt-6">
            <NavadhikaraPanel meta={meta} />
          </div>
        </div>

        {/* Right column: year strip only */}
        <div className="w-full lg:w-[320px] shrink-0">
          <YearHeaderStrip samvats={samvats} />
        </div>
      </div>

      <div className="mt-8" style={{ color: "var(--indigo)", opacity: 0.5 }}>
        <BorderPattern />
      </div>
    </section>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-3xl p-12 flex flex-col items-center justify-center gap-3"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--indigo)" }} />
      <span className="text-sm" style={{ opacity: 0.6 }}>Computing Panchang…</span>
    </div>
  );
}

function ErrorCard({ error }) {
  return (
    <div className="rounded-3xl p-6"
         style={{ background: "var(--paper)", border: "2px solid var(--vermillion)" }}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--vermillion)" }} />
        <div>
          <div className="font-display text-base" style={{ color: "var(--vermillion-dark)" }}>
            Couldn't compute Panchang
          </div>
          <p className="text-sm mt-1" style={{ opacity: 0.75 }}>{error}</p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ data, city, date, festivals }) {
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: "var(--paper)", border: "1px solid var(--cream-2)" }}>
      <div className="px-6 py-5"
           style={{ background: "linear-gradient(135deg, var(--cream-2) 0%, var(--paper) 100%)" }}>
        <div className="font-display text-2xl sm:text-3xl leading-tight">
          {data.vara.english}
          <span className="text-base ml-2 italic" style={{ color: "var(--indigo)", opacity: 0.75 }}>
            {data.vara.sanskrit}
          </span>
        </div>
        {data.maas && data.maas.purnimanta && (
          <div className="font-display text-lg mt-1" style={{ color: "var(--vermillion-dark)" }}>
            {data.maas.purnimanta.devanagari}
            <span className="text-sm italic ml-1.5" style={{ opacity: 0.85 }}>{data.maas.purnimanta.roman}</span>
            <span className="text-xs ml-1.5" style={{ opacity: 0.7 }}>
              · {data.tithi.paksha === "shukla" ? "Shukla" : "Krishna"} paksha
            </span>
          </div>
        )}
        <div className="text-sm mt-0.5" style={{ opacity: 0.65 }}>
          {formatLongDate(date)} · {city.name}, {city.region}
        </div>
        {festivals && festivals.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {festivals.map((f, i) => (
              <FestivalChip key={i} festival={f} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4"
           style={{ borderTop: "1px solid var(--cream-2)", borderBottom: "1px solid var(--cream-2)" }}>
        <Cell label="Tithi"     labelDev="तिथि"    value={data.tithi.name}     sub={`${data.tithi.paksha} paksha`} endsAt={data.tithi.ends_at} />
        <Cell label="Nakshatra" labelDev="नक्षत्र"  value={data.nakshatra.name} endsAt={data.nakshatra.ends_at} />
        <Cell label="Yoga"      labelDev="योग"     value={data.yoga.name} />
        <Cell label="Karana"    labelDev="करण"     value={data.karana.name} />
      </div>

      <div className="px-6 py-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <TimeRow icon={Sun}  label="Sunrise" time={formatTime(data.sunrise)} color="var(--turmeric)" />
          <TimeRow icon={Moon} label="Sunset"  time={formatTime(data.sunset)}  color="var(--indigo)" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WindowRow label="Rahu kaal"       start={data.rahu_kaal.start}       end={data.rahu_kaal.end}       color="var(--vermillion-dark)" caution />
          <WindowRow label="Abhijit muhurta" start={data.abhijit_muhurta.start} end={data.abhijit_muhurta.end} color="var(--leaf)" />
        </div>
      </div>
    </div>
  );
}

function Cell({ label, labelDev, value, sub, endsAt }) {
  return (
    <div className="p-4" style={{ borderRight: "1px solid var(--cream-2)" }}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[10px] tracking-[0.18em] uppercase font-semibold"
              style={{ color: "var(--indigo)", opacity: 0.8 }}>
          {label}
        </span>
        {labelDev && (
          <span className="text-[11px]" style={{ opacity: 0.55 }}>
            {labelDev}
          </span>
        )}
      </div>
      <div className="font-display text-lg sm:text-xl mt-1.5 leading-tight">{value}</div>
      {sub   && <div className="text-[11px] mt-0.5 italic" style={{ opacity: 0.6 }}>{sub}</div>}
      {endsAt && <div className="text-[11px] mt-1.5" style={{ opacity: 0.55 }}>until {formatTime(endsAt)}</div>}
    </div>
  );
}

function TimeRow({ icon: Icon, label, time, color }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
         style={{ background: "var(--cream)" }}>
      <Icon className="w-4 h-4" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ opacity: 0.6 }}>
          {label}
        </div>
        <div className="font-display text-lg leading-tight">{time}</div>
      </div>
    </div>
  );
}

function WindowRow({ label, start, end, color, caution }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
         style={{ background: caution ? "var(--cream-2)" : "var(--cream)" }}>
      <Clock className="w-4 h-4" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
             style={{ color, opacity: 0.9 }}>
          {label}
        </div>
        <div className="font-display text-base leading-tight">
          {formatTime(start)} – {formatTime(end)}
        </div>
      </div>
    </div>
  );
}

function FestivalChip({ festival }) {
  const tone = festival.sita
    ? { background: "var(--vermillion-dark)", color: "var(--paper)" }
    : festival.mithilaSpecific
    ? { background: "var(--leaf)",            color: "var(--paper)" }
    : { background: "var(--cream-2)",         color: "var(--ink)"   };

  const inner = (
    <>
      {festival.sita && <SitaMotif size={12} color="var(--paper)" opacity={1} />}
      <span className="font-display">{festival.nameDevanagari}</span>
      <span style={{ opacity: 0.8 }}>· {festival.nameEnglish}</span>
      {festival.slug && <span aria-hidden="true" style={{ opacity: 0.7 }}>→</span>}
    </>
  );

  const cls = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium";

  // Rich-content festivals link to their detail page; dated-only ones are plain pills.
  if (festival.slug) {
    return (
      <Link to={`/festivals/${festival.slug}`} className={`${cls} transition-opacity hover:opacity-85`}
            style={{ background: tone.background, color: tone.color }}>
        {inner}
      </Link>
    );
  }
  return (
    <span className={cls} style={{ background: tone.background, color: tone.color }}>
      {inner}
    </span>
  );
}
