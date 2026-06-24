"""
Vercel Serverless Function: /api/stripe-webhook

Receives Stripe events, verifies the signature, and on a completed Checkout
grants the purchased credits via the service-role-only grant_credits() function
(idempotent — a retried webhook never double-credits).

Point a Stripe webhook at https://<your-domain>/api/stripe-webhook for the event
`checkout.session.completed`, and put its signing secret in STRIPE_WEBHOOK_SECRET.

Env:
  STRIPE_SECRET_KEY            (required)
  STRIPE_WEBHOOK_SECRET        (required)  the webhook signing secret (whsec_...)
  SUPABASE_SERVICE_ROLE_KEY    (required)  to call grant_credits()
  VITE_SUPABASE_URL / SUPABASE_URL
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error

import stripe

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SERVICE_ROLE = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")


def service_headers():
    """Auth headers that work for BOTH Supabase key formats:
    - legacy service_role key (a JWT): PostgREST reads the role from the
      Authorization Bearer JWT.
    - new sb_secret_* key (not a JWT): mapped to service_role from `apikey`
      alone; sending it as a Bearer makes PostgREST fall back to anon.
    """
    h = {"apikey": SERVICE_ROLE, "Content-Type": "application/json"}
    if not (SERVICE_ROLE or "").startswith("sb_"):
        h["Authorization"] = f"Bearer {SERVICE_ROLE}"
    return h


def grant_credits(session):
    md = session.get("metadata") or {}
    uid = md.get("user_id")
    credits = int(md.get("credits") or 0)
    if not uid or credits <= 0:
        return
    payload = json.dumps({
        "session_id": session.get("id"),
        "target": uid,
        "n": credits,
        "amt": session.get("amount_total"),
        "cur": session.get("currency"),
    }).encode("utf-8")
    # Send the key ONLY in `apikey`. The new sb_secret_* keys are NOT JWTs, so
    # passing them as `Authorization: Bearer` makes PostgREST fall back to anon
    # (→ permission denied). apikey alone is mapped to service_role and works for
    # both the new secret keys and legacy service_role JWTs.
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/rpc/grant_credits",
        data=payload,
        headers=service_headers(),
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            resp.read()
    except urllib.error.HTTPError as he:
        detail = he.read().decode("utf-8", "replace")[:300]
        raise Exception(f"grant_credits {he.code}: {detail}")


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw = self.rfile.read(length)  # RAW body — needed for signature verification

        if not (WEBHOOK_SECRET and SERVICE_ROLE and SUPABASE_URL):
            self._send(503, {"error": "Webhook not configured."})
            return

        # Verify the signature (raises if invalid). We don't use the returned
        # object — we read the plain JSON below so attribute access is reliable
        # across SDK/API versions.
        try:
            stripe.Webhook.construct_event(
                raw, self.headers.get("Stripe-Signature"), WEBHOOK_SECRET
            )
        except Exception:
            self._send(400, {"error": "Invalid signature."})
            return

        try:
            event = json.loads(raw)  # plain dict — .get() always works
            if event.get("type") == "checkout.session.completed":
                session = (event.get("data") or {}).get("object") or {}
                if session.get("payment_status") == "paid":
                    grant_credits(session)
            self._send(200, {"received": True})
        except Exception as e:
            self._send(500, {"error": str(e)})

    def _send(self, code, obj):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if obj is not None:
            self.wfile.write(json.dumps(obj).encode("utf-8"))
