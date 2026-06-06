"""
Vercel Serverless Function: /api/panchang

Computes Panchang for a given date and location.

GET /api/panchang?date=2026-08-13&lat=26.59&lon=85.49&tz=Asia/Kolkata

Returns JSON with tithi, nakshatra, yoga, karana, sunrise, sunset,
Rahu kaal, abhijit muhurta, etc.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import calendar
from datetime import datetime
from urllib.parse import urlparse, parse_qs
import swisseph as swe
from datetime import timezone, timedelta
from zoneinfo import ZoneInfo


# ============================================================================
# LOOKUP TABLES
# ============================================================================

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
]

YOGAS = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Indra", "Vaidhriti"
]

MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"]

VARA_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
VARA_NAMES_SANSKRIT = ["Ravivara", "Somavara", "Mangalvara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"]

# Zodiac signs (rashis) by sidereal longitude / 30°. Used for the Moon's rashi.
RASHIS = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
]

# Maithili lunar months, indexed by the rashi the Sun ENTERS during the month
# (month containing Mesha Sankranti = Baisakh, etc.).
MAITHILI_MONTHS = [
    ("बैसाख",  "Baisakh"),   # Mesha
    ("जेठ",    "Jeth"),      # Vrishabha
    ("अषाढ़",   "Asadh"),     # Mithuna
    ("सावन",   "Saon"),      # Karka
    ("भादो",   "Bhado"),     # Simha
    ("आसिन",   "Aasin"),     # Kanya
    ("कातिक",  "Katik"),     # Tula
    ("अगहन",   "Aghan"),     # Vrishchika
    ("पूस",    "Pus"),       # Dhanu
    ("माघ",    "Magh"),      # Makara
    ("फागुन",  "Phagun"),    # Kumbha
    ("चैत",    "Chait"),     # Meena
]

RAHU_KAAL_PORTION = {
    0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3
}


# ============================================================================
# HELPERS
# ============================================================================

def jd_to_local_dt(jd_ut, tz):
    year, month, day, frac = swe.revjul(jd_ut)
    hour = int(frac)
    minute_f = (frac - hour) * 60
    minute = int(minute_f)
    second = int((minute_f - minute) * 60)
    dt_utc = datetime(year, month, day, hour, minute, second, tzinfo=timezone.utc)
    return dt_utc.astimezone(tz)


def local_dt_to_jd(dt_local):
    dt_utc = dt_local.astimezone(timezone.utc)
    return swe.julday(
        dt_utc.year, dt_utc.month, dt_utc.day,
        dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0
    )


def find_endpoint(start_jd, end_jd, target_value, value_fn):
    lo, hi = start_jd, end_jd
    for _ in range(50):
        mid = (lo + hi) / 2
        if value_fn(mid) < target_value:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def sun_longitude(jd_ut):
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    return swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SIDEREAL)[0][0] % 360


def moon_longitude(jd_ut):
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    return swe.calc_ut(jd_ut, swe.MOON, swe.FLG_SIDEREAL)[0][0] % 360


def moon_minus_sun(jd_ut):
    return (moon_longitude(jd_ut) - sun_longitude(jd_ut)) % 360


def moon_plus_sun(jd_ut):
    return (moon_longitude(jd_ut) + sun_longitude(jd_ut)) % 360


# ----------------------------------------------------------------------------
# Lunar month (maas) — amanta & purnimanta, with Adhik (leap) detection.
# A lunar month runs new-moon → new-moon. It is named after the solar month
# (sankranti) that falls within it; a lunar month with no sankranti is Adhik
# (leap) and takes the following month's name.
# ----------------------------------------------------------------------------

def _elong_signed(jd_ut):
    # Moon-Sun elongation mapped to (-180, 180]; 0 at new moon (amavasya end).
    e = (moon_longitude(jd_ut) - sun_longitude(jd_ut)) % 360
    return e - 360 if e > 180 else e


def _find_new_moon(approx_jd):
    # Refine a new-moon time near approx_jd by bisecting the signed elongation.
    lo, hi = approx_jd - 2.5, approx_jd + 2.5
    for _ in range(60):
        mid = (lo + hi) / 2
        if _elong_signed(mid) < 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def _amanta_for_window(prev_nm, next_nm):
    # (month_index, is_adhik) for the lunar month [prev_nm, next_nm].
    # The month is named after the rashi the Sun occupies at the *starting* new
    # moon; it's Adhik (leap) when the Sun doesn't change rashi within the window
    # (no sankranti), in which case the same name repeats as the following nija month.
    r_start = int(sun_longitude(prev_nm) / 30) % 12
    r_end = int(sun_longitude(next_nm - 0.05) / 30) % 12
    is_adhik = (r_start == r_end)
    return r_start, is_adhik


def maas_for_jd(jd_ut):
    elong = (moon_longitude(jd_ut) - sun_longitude(jd_ut)) % 360
    prev_nm = _find_new_moon(jd_ut - elong / 12.19)   # ~12.19°/day mean elongation rate
    next_nm = _find_new_moon(prev_nm + 29.53)

    a_idx, a_adhik = _amanta_for_window(prev_nm, next_nm)

    # Purnimanta: the bright half shares the amanta name; the dark half (after
    # Purnima) carries the next month's name.
    tithi_num = int(elong / 12) + 1
    if tithi_num <= 15:
        p_idx, p_adhik = a_idx, a_adhik
    else:
        nn2 = _find_new_moon(next_nm + 29.53)
        p_idx, p_adhik = _amanta_for_window(next_nm, nn2)

    def block(idx, adhik):
        dev, rom = MAITHILI_MONTHS[idx]
        return {
            "index": idx,
            "devanagari": ("अधिक " + dev) if adhik else dev,
            "roman": ("Adhik " + rom) if adhik else rom,
            "adhik": adhik,
        }

    return {"amanta": block(a_idx, a_adhik), "purnimanta": block(p_idx, p_adhik)}


# ============================================================================
# CORE PANCHANG COMPUTATION
# ============================================================================

def compute_panchang(date_local, lat, lon, tz_name):
    tz = ZoneInfo(tz_name)

    jd_midnight_local = local_dt_to_jd(
        date_local.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=tz)
    )

    geopos = (lon, lat, 0)

    rise_result = swe.rise_trans(
        jd_midnight_local, swe.SUN,
        swe.CALC_RISE | swe.BIT_DISC_CENTER, geopos
    )
    jd_sunrise = rise_result[1][0]
    sunrise_local = jd_to_local_dt(jd_sunrise, tz)

    set_result = swe.rise_trans(
        jd_midnight_local, swe.SUN,
        swe.CALC_SET | swe.BIT_DISC_CENTER, geopos
    )
    jd_sunset = set_result[1][0]
    sunset_local = jd_to_local_dt(jd_sunset, tz)

    jd = jd_sunrise

    # Tithi
    diff = moon_minus_sun(jd)
    tithi_num = int(diff / 12) + 1
    tithi_progress = (diff % 12) / 12

    target_diff = tithi_num * 12
    try:
        if target_diff >= 360:
            target_diff_eff = target_diff - 360
            jd_tithi_end = find_endpoint(
                jd, jd + 1.5, target_diff_eff,
                lambda j: moon_minus_sun(j) if moon_minus_sun(j) < diff else moon_minus_sun(j) - 360
            )
        else:
            jd_tithi_end = find_endpoint(jd, jd + 1.5, target_diff, moon_minus_sun)
        tithi_end_local = jd_to_local_dt(jd_tithi_end, tz)
    except Exception:
        tithi_end_local = None

    paksha = "shukla" if tithi_num <= 15 else "krishna"
    tithi_in_paksha = tithi_num if tithi_num <= 15 else tithi_num - 15

    # Nakshatra
    moon_lon = moon_longitude(jd)
    nakshatra_size = 360 / 27
    nakshatra_num = int(moon_lon / nakshatra_size) + 1
    nakshatra_progress = (moon_lon % nakshatra_size) / nakshatra_size

    target_moon_lon = nakshatra_num * nakshatra_size
    try:
        if target_moon_lon >= 360:
            target_moon_lon_eff = target_moon_lon - 360
            jd_nakshatra_end = find_endpoint(
                jd, jd + 1.5, target_moon_lon_eff,
                lambda j: moon_longitude(j) if moon_longitude(j) < moon_lon else moon_longitude(j) - 360
            )
        else:
            jd_nakshatra_end = find_endpoint(jd, jd + 1.5, target_moon_lon, moon_longitude)
        nakshatra_end_local = jd_to_local_dt(jd_nakshatra_end, tz)
    except Exception:
        nakshatra_end_local = None

    # Yoga
    sum_lon = moon_plus_sun(jd)
    yoga_size = 360 / 27
    yoga_num = int(sum_lon / yoga_size) + 1

    # Karana
    karana_index_overall = int(diff / 6)
    if karana_index_overall == 0:
        karana_name = "Kimstughna"
    elif karana_index_overall in (57, 58, 59):
        karana_name = ["Shakuni", "Chatushpada", "Naga"][karana_index_overall - 57]
    else:
        karana_name = MOVABLE_KARANAS[(karana_index_overall - 1) % 7]

    # Vara — the civil weekday of the local date (Sun=0..Sat=6). Derived from the
    # calendar date, not jd_sunrise: the UT fractional offset of an early sunrise
    # could push int((jd+1.5)%7) off by one day.
    weekday_num = (date_local.weekday() + 1) % 7
    vara_name = VARA_NAMES[weekday_num]

    # Rahu kaal
    daylight_duration = jd_sunset - jd_sunrise
    portion_duration = daylight_duration / 8
    rahu_portion = RAHU_KAAL_PORTION[weekday_num]
    rahu_start_jd = jd_sunrise + (rahu_portion - 1) * portion_duration
    rahu_end_jd = jd_sunrise + rahu_portion * portion_duration

    # Abhijit muhurta
    muhurta_duration = daylight_duration / 15
    abhijit_start_jd = jd_sunrise + 7 * muhurta_duration
    abhijit_end_jd = jd_sunrise + 8 * muhurta_duration

    return {
        "date": date_local.strftime("%Y-%m-%d"),
        "location": {"lat": lat, "lon": lon, "timezone": tz_name},
        "sunrise": sunrise_local.isoformat(),
        "sunset": sunset_local.isoformat(),
        "vara": {
            "english": vara_name,
            "sanskrit": VARA_NAMES_SANSKRIT[weekday_num],
            "number": weekday_num
        },
        "maas": maas_for_jd(jd),
        "tithi": {
            "number_overall": tithi_num,
            "number_in_paksha": tithi_in_paksha,
            "name": TITHI_NAMES[tithi_num - 1],
            "paksha": paksha,
            "progress_at_sunrise": round(tithi_progress, 4),
            "ends_at": tithi_end_local.isoformat() if tithi_end_local else None
        },
        "nakshatra": {
            "number": nakshatra_num,
            "name": NAKSHATRAS[nakshatra_num - 1],
            "progress_at_sunrise": round(nakshatra_progress, 4),
            "ends_at": nakshatra_end_local.isoformat() if nakshatra_end_local else None
        },
        "yoga": {
            "number": yoga_num,
            "name": YOGAS[yoga_num - 1]
        },
        "karana": {
            "index": karana_index_overall + 1,
            "name": karana_name
        },
        "rahu_kaal": {
            "start": jd_to_local_dt(rahu_start_jd, tz).isoformat(),
            "end": jd_to_local_dt(rahu_end_jd, tz).isoformat()
        },
        "abhijit_muhurta": {
            "start": jd_to_local_dt(abhijit_start_jd, tz).isoformat(),
            "end": jd_to_local_dt(abhijit_end_jd, tz).isoformat()
        },
        "raw_positions": {
            "sun_longitude_sidereal": round(sun_longitude(jd), 4),
            "moon_longitude_sidereal": round(moon_lon, 4),
            "ayanamsa": "Lahiri"
        },
        "methodology": {
            "engine": "Swiss Ephemeris (pyswisseph)",
            "ayanamsa": "Lahiri",
            "calculation_reference": "sunrise at given location",
            "version": "1.0-beta",
            "note": "Methodology pending Mithila scholar review. Cross-check with traditional Panchang recommended for important rituals."
        }
    }


# ============================================================================
# MONTH GRID COMPUTATION (for the /panchang calendar)
# ============================================================================
# Per day: sunrise, sunset, moonrise, moonset, plus tithi + nakshatra + vara
# reckoned at sunrise. Skips the expensive tithi/nakshatra end-time bisections
# (those come from the single-date endpoint on click) so a whole month is one call.

def compute_day_grid(date_local, lat, lon, tz_name):
    tz = ZoneInfo(tz_name)
    jd_midnight = local_dt_to_jd(
        date_local.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=tz)
    )
    geopos = (lon, lat, 0)

    # Find the next rise/set of a body after local midnight; returns (jd, iso) or (None, None).
    def event(body, flag):
        try:
            ret, tret = swe.rise_trans(
                jd_midnight, body, flag | swe.BIT_DISC_CENTER, geopos
            )
            if ret < 0 or not tret or not tret[0]:
                return None, None
            return tret[0], jd_to_local_dt(tret[0], tz).isoformat()
        except Exception:
            return None, None

    jd_sunrise, sunrise = event(swe.SUN, swe.CALC_RISE)
    _, sunset = event(swe.SUN, swe.CALC_SET)
    _, moonrise = event(swe.MOON, swe.CALC_RISE)
    _, moonset = event(swe.MOON, swe.CALC_SET)

    # Tithi / nakshatra / vara are reckoned at sunrise (fall back to midnight if no sunrise).
    jd_ref = jd_sunrise if jd_sunrise else jd_midnight

    diff = moon_minus_sun(jd_ref)
    tithi_num = int(diff / 12) + 1
    paksha = "shukla" if tithi_num <= 15 else "krishna"
    tithi_in_paksha = tithi_num if tithi_num <= 15 else tithi_num - 15

    moon_lon = moon_longitude(jd_ref)
    nakshatra_size = 360 / 27
    nakshatra_num = int(moon_lon / nakshatra_size) + 1
    rashi_num = int(moon_lon / 30)  # 0-11

    # Nakshatra end time — one bisection (tithi end stays on the single-date endpoint).
    target_moon_lon = nakshatra_num * nakshatra_size
    try:
        if target_moon_lon >= 360:
            target_eff = target_moon_lon - 360
            jd_nak_end = find_endpoint(
                jd_ref, jd_ref + 1.5, target_eff,
                lambda j: moon_longitude(j) if moon_longitude(j) < moon_lon else moon_longitude(j) - 360
            )
        else:
            jd_nak_end = find_endpoint(jd_ref, jd_ref + 1.5, target_moon_lon, moon_longitude)
        nakshatra_end_iso = jd_to_local_dt(jd_nak_end, tz).isoformat()
    except Exception:
        nakshatra_end_iso = None

    # Vara from the civil date (see compute_panchang note on the off-by-one).
    weekday_num = (date_local.weekday() + 1) % 7

    maas = maas_for_jd(jd_ref)

    return {
        "date": date_local.strftime("%Y-%m-%d"),
        "sunrise": sunrise,
        "sunset": sunset,
        "moonrise": moonrise,
        "moonset": moonset,
        "maas": maas,
        "tithi": {
            "number_overall": tithi_num,
            "number_in_paksha": tithi_in_paksha,
            "name": TITHI_NAMES[tithi_num - 1],
            "paksha": paksha,
        },
        "nakshatra": {
            "number": nakshatra_num,
            "name": NAKSHATRAS[nakshatra_num - 1],
            "ends_at": nakshatra_end_iso,
        },
        "rashi": {
            "number": rashi_num + 1,
            "name": RASHIS[rashi_num],
        },
        "vara": {
            "number": weekday_num,
            "english": VARA_NAMES[weekday_num],
        },
    }


def compute_month(year, month, lat, lon, tz_name):
    num_days = calendar.monthrange(year, month)[1]
    days = []
    for d in range(1, num_days + 1):
        date_local = datetime(year, month, d)
        try:
            days.append(compute_day_grid(date_local, lat, lon, tz_name))
        except Exception:
            # Don't fail the whole month for one bad day (e.g. polar no-sunrise edge cases)
            days.append({
                "date": date_local.strftime("%Y-%m-%d"),
                "sunrise": None, "sunset": None, "moonrise": None, "moonset": None,
                "tithi": None, "nakshatra": None, "vara": None,
            })
    return {
        "month": f"{year:04d}-{month:02d}",
        "location": {"lat": lat, "lon": lon, "timezone": tz_name},
        "days": days,
    }


# ============================================================================
# VERCEL HANDLER
# ============================================================================

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)

            # Parse and validate parameters
            date_str = params.get("date", [None])[0]
            month_str = params.get("month", [None])[0]
            lat_str = params.get("lat", [None])[0]
            lon_str = params.get("lon", [None])[0]
            tz_name = params.get("tz", ["UTC"])[0]

            try:
                ZoneInfo(tz_name)
            except Exception:
                self._send_error(400, f"Invalid timezone: {tz_name}")
                return

            # ---- Month mode: lightweight tithi grid for the calendar ----
            if month_str:
                if not all([lat_str, lon_str]):
                    self._send_error(400, "Missing required parameters: lat, lon")
                    return
                try:
                    year, month = (int(p) for p in month_str.split("-"))
                    if not (1 <= month <= 12):
                        raise ValueError
                except ValueError:
                    self._send_error(400, f"Invalid month format. Use YYYY-MM. Got: {month_str}")
                    return
                try:
                    lat = float(lat_str)
                    lon = float(lon_str)
                except ValueError:
                    self._send_error(400, "lat and lon must be numbers")
                    return
                result = compute_month(year, month, lat, lon, tz_name)
                self._send_json(result)
                return

            # ---- Single-date mode ----
            if not all([date_str, lat_str, lon_str]):
                self._send_error(400, "Missing required parameters: date, lat, lon")
                return

            try:
                date_local = datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError:
                self._send_error(400, f"Invalid date format. Use YYYY-MM-DD. Got: {date_str}")
                return

            try:
                lat = float(lat_str)
                lon = float(lon_str)
            except ValueError:
                self._send_error(400, "lat and lon must be numbers")
                return

            # Compute
            result = compute_panchang(date_local, lat, lon, tz_name)
            self._send_json(result)

        except Exception as e:
            self._send_error(500, f"Server error: {str(e)}")

    def _send_json(self, result):
        # The local dev server sets PANCHANG_NO_CACHE so engine changes show
        # immediately; production keeps the 1-hour cache (a date's panchang is fixed).
        cache = "no-store" if os.environ.get("PANCHANG_NO_CACHE") else "public, max-age=3600"
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", cache)
        self.end_headers()
        self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))

    def _send_error(self, code, message):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"error": message}).encode("utf-8"))
