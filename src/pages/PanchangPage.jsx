import { useState, useEffect } from "react";
import { Sun, Moon, MapPin, Calendar, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { PageHero } from "../components/PageBuildingBlocks.jsx";

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

  const city = CITIES.find((c) => c.id === cityId) || CITIES[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `/api/panchang?date=${date}&lat=${city.lat}&lon=${city.lon}&tz=${encodeURIComponent(city.tz)}`;
    fetch(url)
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
      <PageHero
        eyebrow="Panchang · Daily calendar"
        title="The Maithil day,"
        titleAccent="calculated."
        devanagari="पञ्चाङ्ग"
        description="Tithi, nakshatra, yoga, karana — the astronomical fabric of a Maithil day. Calculated with Swiss Ephemeris and Lahiri ayanamsa, for any city, any date."
        phase="Beta · Pending scholar review"
        accentColor="var(--indigo)"
      />

      {/* Form */}
      <section className="px-6 lg:px-10 py-4 max-w-5xl mx-auto">
        <div className="rounded-3xl p-5 sm:p-6 border"
             style={{ background: "var(--paper)", borderColor: "var(--cream-2)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block">
              <span className="text-[10px] tracking-[0.18em] uppercase font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--indigo)" }}>
                <Calendar className="w-3 h-3" /> Date
              </span>
              <input type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="mt-2 w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                     style={{ background: "var(--cream)", borderColor: "var(--cream-2)" }} />
            </label>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="px-6 lg:px-10 pt-4 pb-8 max-w-5xl mx-auto">
        {loading && <LoadingCard />}
        {error && <ErrorCard error={error} />}
        {!loading && !error && data && <ResultCard data={data} city={city} date={date} />}
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
              These calculations use Swiss Ephemeris with Lahiri ayanamsa — the same astronomical
              foundation as most published Panchang. Mithila-specific conventions and edge cases
              are still being validated. For important rituals, cross-check with your kulpurohit
              or the Mithila Vishwavidyalaya Panchang.
            </p>
          </div>
        </div>
      </section>
    </div>
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

function ResultCard({ data, city, date }) {
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
        <div className="text-sm mt-0.5" style={{ opacity: 0.65 }}>
          {formatLongDate(date)} · {city.name}, {city.region}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4"
           style={{ borderTop: "1px solid var(--cream-2)", borderBottom: "1px solid var(--cream-2)" }}>
        <Cell label="Tithi" value={data.tithi.name} sub={`${data.tithi.paksha} paksha`} endsAt={data.tithi.ends_at} />
        <Cell label="Nakshatra" value={data.nakshatra.name} endsAt={data.nakshatra.ends_at} />
        <Cell label="Yoga" value={data.yoga.name} />
        <Cell label="Karana" value={data.karana.name} />
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

function Cell({ label, value, sub, endsAt }) {
  return (
    <div className="p-4" style={{ borderRight: "1px solid var(--cream-2)" }}>
      <div className="text-[10px] tracking-[0.18em] uppercase font-semibold"
           style={{ color: "var(--indigo)", opacity: 0.8 }}>
        {label}
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
