"""
Vercel Serverless Function: /api/notify-match

Emails BOTH people when a Ghatkaiti match becomes mutual, so the offline side
finds out without having to log in and check. The frontend calls this right
after send_interest() returns "mutual", passing the other person's id.

Privacy: the email only says "you have a match — open your Matches"; it never
reveals identity or contact in the email body. Names/contact stay behind the
in-app reveal.

Security: the caller is verified via their Supabase session token; the match is
re-checked server-side with the service role (so a caller can't trigger emails
for a match that isn't real).

Env (all optional — the function degrades gracefully and returns ok:false if a
piece is missing, so deploying before they're set never errors):
  VITE_SUPABASE_URL / SUPABASE_URL              Supabase project URL
  VITE_SUPABASE_PUBLISHABLE_KEY / SUPABASE_ANON_KEY   anon key (to verify the caller)
  SUPABASE_SERVICE_ROLE_KEY   (required to send)  service role (look up emails, re-check match)
  RESEND_API_KEY              (required to send)  Resend API key
  MATCH_FROM_EMAIL            sender, e.g. "Mithila Utkarsh <namaste@mithilautkarsh.com>"
  SITE_URL                    public base URL (default https://mithilautkarsh.com)
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = (
    os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("VITE_SUPABASE_PUBLISHABLE_KEY")
)
SERVICE_ROLE = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
FROM_EMAIL = os.environ.get("MATCH_FROM_EMAIL", "Mithila Utkarsh <namaste@mithilautkarsh.com>")
SITE_URL = (os.environ.get("SITE_URL") or "https://mithilautkarsh.com").rstrip("/")


def _get_json(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=8) as resp:
        return resp.status, json.loads(resp.read() or b"null")


def caller_identity(auth_header):
    """Return (id, email) for the bearer token, or (None, None)."""
    if not (SUPABASE_URL and SUPABASE_ANON_KEY):
        return None, None
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return None, None
    token = auth_header.split(" ", 1)[1].strip()
    try:
        _, data = _get_json(
            f"{SUPABASE_URL}/auth/v1/user",
            {"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {token}"},
        )
        return data.get("id"), data.get("email")
    except Exception:
        return None, None


def is_mutual(a, b):
    """Re-check, with the service role, that a and b are mutually interested."""
    flt = f"or=(and(from_id.eq.{a},to_id.eq.{b}),and(from_id.eq.{b},to_id.eq.{a}))"
    _, rows = _get_json(
        f"{SUPABASE_URL}/rest/v1/matrimony_interests?select=from_id,to_id&{flt}",
        {"apikey": SERVICE_ROLE, "Authorization": f"Bearer {SERVICE_ROLE}"},
    )
    return isinstance(rows, list) and len(rows) >= 2


def email_for(user_id):
    _, data = _get_json(
        f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
        {"apikey": SERVICE_ROLE, "Authorization": f"Bearer {SERVICE_ROLE}"},
    )
    return (data or {}).get("email")


def send_email(to_addr):
    link = f"{SITE_URL}/ghatkaiti"
    html = (
        '<div style="font-family:Georgia,serif;color:#1b1a2e;max-width:520px;margin:auto">'
        '<h2 style="color:#c1272d">You have a new match 🪔</h2>'
        "<p>Namaste,</p>"
        "<p>Good news — someone you expressed interest in is interested in you too. "
        "Open your <strong>Matches</strong> on Mithila Utkarsh to see their name and contact.</p>"
        f'<p><a href="{link}" style="background:#c1272d;color:#fff;padding:10px 18px;'
        'border-radius:999px;text-decoration:none">Open Ghatkaiti</a></p>'
        '<p style="color:#777;font-size:13px">— Mithila Utkarsh · Carrying Mithila to the World</p>'
        "</div>"
    )
    payload = json.dumps({
        "from": FROM_EMAIL,
        "to": [to_addr],
        "subject": "You have a new Ghatkaiti match",
        "html": html,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=8) as resp:
        return resp.status in (200, 201)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0) or 0)
            body = json.loads(self.rfile.read(length) or b"{}")
            other_id = (body.get("otherId") or "").strip()

            # Not configured yet → succeed quietly so the match flow never breaks.
            if not (SERVICE_ROLE and RESEND_API_KEY and SUPABASE_URL):
                self._send(200, {"ok": False, "reason": "email-not-configured"})
                return

            caller_id, caller_email = caller_identity(self.headers.get("Authorization"))
            if not caller_id:
                self._send(401, {"ok": False, "reason": "unauthenticated"})
                return
            if not other_id or other_id == caller_id:
                self._send(400, {"ok": False, "reason": "bad-request"})
                return
            if not is_mutual(caller_id, other_id):
                self._send(200, {"ok": False, "reason": "not-mutual"})
                return

            sent = 0
            for addr in (caller_email, email_for(other_id)):
                if addr:
                    try:
                        if send_email(addr):
                            sent += 1
                    except Exception:
                        pass  # best-effort per recipient
            self._send(200, {"ok": True, "sent": sent})

        except Exception as e:
            self._send(500, {"ok": False, "error": str(e)})

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
