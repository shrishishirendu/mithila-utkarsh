"""
Vercel Serverless Function: /api/translate

English -> Maithili (Devanagari + IAST) via the Claude API. The frontend calls
this ONLY when the local dictionary/phrasebook lookup misses. Tirhuta is derived
client-side by our own transliterator, so this returns Devanagari + IAST only.

The Anthropic API key lives in the ANTHROPIC_API_KEY env var and is read here on
the server — it is NEVER sent to the browser. Results are explicitly labeled AI /
unverified by the caller.

Env:
  ANTHROPIC_API_KEY   (required)  — the Claude API key
  TRANSLATE_MODEL     (optional)  — defaults to claude-opus-4-8
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request

import anthropic

MODEL = os.environ.get("TRANSLATE_MODEL", "claude-opus-4-8")
MAX_INPUT_CHARS = 200  # cheap guard against abuse / runaway cost per call

# Optional server-side auth. When SUPABASE_URL + SUPABASE_ANON_KEY are set, the
# endpoint requires a valid Supabase session token (a real gate, not just the UI
# button). When unset, it falls back to the UI sign-in gate — so pushing this does
# not break anything before the env vars are configured.
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")


def verify_user(auth_header):
    """True = valid session · False = invalid/missing · None = auth not configured."""
    if not (SUPABASE_URL and SUPABASE_ANON_KEY):
        return None
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return False
    token = auth_header.split(" ", 1)[1].strip()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == 200
    except Exception:
        return False

# --- Verified Maithili grounding (stable -> cached as a prompt prefix) ----------
# Distinctively-Maithili vocabulary + phrases that anchor the model and keep it
# from drifting into Hindi. Mirrors src/data/dictionary.js + phrasebook.js.
MAITHILI_REFERENCE = """\
VERIFIED MAITHILI REFERENCE (ground truth — match these forms and style):

Pronouns / grammar:
- I = हम (ham); my = हमर (hamar); we = हम सभ (ham sabh)
- you (honorific) = अहाँ (ahā̃); your (honorific) = अहाँक (ahā̃k); you (familiar) = तोँ (tõ)
- he/she (honorific) = ओ (o); this = ई (ī); that = ओ (o)
- is = अछि (achi); am/are (honorific) = छी (chī); was = छल (chhal)
- where = कतय (katay); what = की (kī); how = केहन (kehan); from = सँ (sã); some = किछु (kichu)
- good = नीक (nīk) / भाल (bhāl); not = नहि (nahi); yes = हँ (hã)

Kinship (distinctively Maithili):
- mother = मै (mai); father = बाबू (bābū)
- paternal uncle (younger) = काका (kākā)  [NOT Hindi चाचा]; his wife = काकी (kākī)
- maternal uncle = मामा (māmā); elder sister = दीदी (dīdī); elder brother = भैया (bhaiyā)
- son = बेटा (beṭā); daughter = बेटी (beṭī); wife (informal) = घरवाली (gharwālī)

Numbers: एक (ek), दू (dū), तीन (tīn), चारि (cāri), पाँच (pā̃c), छह (chah)

Verified phrases:
- Hello / greetings (to elders) = प्रणाम (praṇām)
- Hail Mithila = जय मिथिला (jay mithilā)
- Thank you = धन्यवाद (dhanyavād)
- Please forgive / excuse me = माफ करू (māf karū)
- How are you? = की हाल? (kī hāl?)  — reply भाल (bhāl) = good
- I am from Mithila = हम मिथिला सँ छी (ham mithilā sã chī)
- I am hungry = हमरा भूख लागल अछि (hamrā bhūkh lāgal achi)
- Please come = आउ (āu); Please sit = बैसू (baisū); Let's go = चलू (calū)

EXAMPLES (English -> JSON):
- "Where are you from?" -> {"devanagari":"अहाँ कतय सँ छी?","iast":"ahā̃ katay sã chī?","confidence":"high","note":""}
- "What is your name?" -> {"devanagari":"अहाँक नाम की अछि?","iast":"ahā̃k nām kī achi?","confidence":"high","note":""}
- "I love you" -> {"devanagari":"हम अहाँ सँ प्रेम करैत छी","iast":"ham ahā̃ sã prem karait chī","confidence":"medium","note":"'-ait chī' is the Maithili honorific present"}
"""

INSTRUCTIONS = """\
You are an expert translator and lexicographer of MAITHILI (मैथिली) — the language \
of the Mithila region (north Bihar in India and the eastern Tarai of Nepal). Maithili \
is its OWN language, written in Devanagari (and historically in Tirhuta/Mithilakshar). \
It is NOT Hindi and NOT Bhojpuri, although it shares much vocabulary.

Translate the user's English into natural, idiomatic MAITHILI. Return the Maithili in \
Devanagari plus an IAST romanization.

HARD RULES:
- Output MAITHILI, never Hindi. Wherever Maithili and Hindi differ, you MUST use the \
Maithili form. Do not output Hindi forms like मैं / मेरा / आप / है / हूँ / क्या / कहाँ / \
चाचा when the Maithili equivalent differs.
- Use Maithili pronouns and verb morphology (हम, हमर, अहाँ, अछि, छी; verbs agree with \
both subject and the honorificity of the addressee).
- Keep to the single best, most natural translation. Put pronunciation in IAST.
- Honesty over confidence: if you are NOT sure the output is correct Maithili (rather \
than Hindi or a guess), set confidence to "low" and explain the doubt in "note". \
Maithili is a low-resource language — it is far better to admit uncertainty than to \
emit confident Hindi.

Use the verified reference below as ground truth; match its forms and register.
"""

SYSTEM = [
    {
        "type": "text",
        "text": INSTRUCTIONS + "\n\n" + MAITHILI_REFERENCE,
        "cache_control": {"type": "ephemeral"},
    }
]

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "devanagari": {"type": "string", "description": "Maithili translation in Devanagari"},
        "iast": {"type": "string", "description": "IAST romanization / pronunciation"},
        "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
        "note": {"type": "string", "description": "Brief caveat or empty string"},
    },
    "required": ["devanagari", "iast", "confidence", "note"],
    "additionalProperties": False,
}


def translate(text):
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env
    resp = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=SYSTEM,
        messages=[{"role": "user", "content": f'Translate into Maithili: "{text}"'}],
        output_config={"format": {"type": "json_schema", "schema": OUTPUT_SCHEMA}},
    )
    # output_config.format guarantees the first text block is valid JSON for the schema.
    raw = next((b.text for b in resp.content if b.type == "text"), "{}")
    return json.loads(raw)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0) or 0)
            body = json.loads(self.rfile.read(length) or b"{}")
            text = (body.get("text") or "").strip()

            if not text:
                self._send(400, {"error": "Missing 'text'."})
                return
            if len(text) > MAX_INPUT_CHARS:
                self._send(400, {"error": f"Text too long (max {MAX_INPUT_CHARS} characters)."})
                return
            if verify_user(self.headers.get("Authorization")) is False:
                self._send(401, {"error": "Please sign in to use AI translation."})
                return
            if not os.environ.get("ANTHROPIC_API_KEY"):
                self._send(503, {"error": "AI translation isn't configured yet (no API key)."})
                return

            result = translate(text)
            result["source"] = text
            result["ai"] = True
            self._send(200, result)

        except anthropic.AuthenticationError:
            self._send(503, {"error": "Translation service is not configured (missing API key)."})
        except anthropic.RateLimitError:
            self._send(429, {"error": "Translation service is busy. Please try again in a moment."})
        except Exception as e:
            self._send(500, {"error": f"Translation failed: {e}"})

    def do_OPTIONS(self):
        self._send(204, None)

    def _send(self, code, obj):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if obj is not None:
            self.wfile.write(json.dumps(obj).encode("utf-8"))
