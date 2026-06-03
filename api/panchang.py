"""
Vercel Serverless Function: /api/panchang

Computes Panchang for a given date and location.

GET /api/panchang?date=2026-08-13&lat=26.59&lon=85.49&tz=Asia/Kolkata

Returns JSON with tithi, nakshatra, yoga, karana, sunrise, sunset,
Rahu kaal, abhijit muhurta, etc.
"""

from http.server import BaseHTTPRequestHandler
import json
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

    # Vara
    weekday_num = int((jd_sunrise + 1.5) % 7)
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
# VERCEL HANDLER
# ============================================================================

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)

            # Parse and validate parameters
            date_str = params.get("date", [None])[0]
            lat_str = params.get("lat", [None])[0]
            lon_str = params.get("lon", [None])[0]
            tz_name = params.get("tz", ["UTC"])[0]

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

            try:
                ZoneInfo(tz_name)
            except Exception:
                self._send_error(400, f"Invalid timezone: {tz_name}")
                return

            # Compute
            result = compute_panchang(date_local, lat, lon, tz_name)

            # Respond
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "public, max-age=3600")
            self.end_headers()
            self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))

        except Exception as e:
            self._send_error(500, f"Server error: {str(e)}")

    def _send_error(self, code, message):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"error": message}).encode("utf-8"))
