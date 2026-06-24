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

import stripe

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SERVICE_ROLE = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")


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
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/rpc/grant_credits",
        data=payload,
        headers={
            "apikey": SERVICE_ROLE,
            "Authorization": f"Bearer {SERVICE_ROLE}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=8) as resp:
        resp.read()


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw = self.rfile.read(length)  # RAW body — needed for signature verification

        if not (WEBHOOK_SECRET and SERVICE_ROLE and SUPABASE_URL):
            self._send(503, {"error": "Webhook not configured."})
            return

        try:
            event = stripe.Webhook.construct_event(
                raw, self.headers.get("Stripe-Signature"), WEBHOOK_SECRET
            )
        except Exception:
            self._send(400, {"error": "Invalid signature."})
            return

        try:
            if event["type"] == "checkout.session.completed":
                session = event["data"]["object"]
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
