"""
Vercel Serverless Function: /api/create-checkout

Creates a Stripe Checkout Session for a credit pack and returns its URL; the app
redirects the buyer to Stripe's hosted page. The credit count + buyer id ride in
the session metadata, which the webhook (/api/stripe-webhook) reads to grant
credits after payment. No card data ever touches our code.

Pack prices live HERE (server = source of truth for the amount charged). The
client only sends a pack id; it can never set its own price.

Env:
  STRIPE_SECRET_KEY    (required)  Stripe secret key
  VITE_SUPABASE_URL / SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY / SUPABASE_ANON_KEY
                                   to verify the buyer's session
  SITE_URL             public base URL (default https://mithilautkarsh.com)
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request

import stripe

CURRENCY = "usd"
# Edit prices here (amount is in cents). Keep ids in sync with CREDIT_PACKS in
# src/pages/GhatkaitiPage.jsx (display only — this is what actually gets charged).
PACKS = {
    "p10": {"credits": 10, "amount": 500,  "name": "10 Ghatkaiti interests"},
    "p25": {"credits": 25, "amount": 1000, "name": "25 Ghatkaiti interests"},
    "p60": {"credits": 60, "amount": 2000, "name": "60 Ghatkaiti interests"},
}

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = (
    os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("VITE_SUPABASE_PUBLISHABLE_KEY")
)
SITE_URL = (os.environ.get("SITE_URL") or "https://mithilautkarsh.com").rstrip("/")


def caller_id(auth_header):
    if not (SUPABASE_URL and SUPABASE_ANON_KEY):
        return None
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return None
    token = auth_header.split(" ", 1)[1].strip()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            return json.loads(resp.read() or b"{}").get("id")
    except Exception:
        return None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            secret = os.environ.get("STRIPE_SECRET_KEY")
            if not secret:
                self._send(503, {"error": "Payments aren't configured yet."})
                return

            length = int(self.headers.get("Content-Length", 0) or 0)
            body = json.loads(self.rfile.read(length) or b"{}")
            pack_id = (body.get("packId") or "").strip()
            pack = PACKS.get(pack_id)
            if not pack:
                self._send(400, {"error": "Unknown pack."})
                return

            uid = caller_id(self.headers.get("Authorization"))
            if not uid:
                self._send(401, {"error": "Please sign in to buy credits."})
                return

            stripe.api_key = secret
            session = stripe.checkout.Session.create(
                mode="payment",
                line_items=[{
                    "quantity": 1,
                    "price_data": {
                        "currency": CURRENCY,
                        "unit_amount": pack["amount"],
                        "product_data": {"name": pack["name"]},
                    },
                }],
                metadata={"user_id": uid, "credits": str(pack["credits"]), "pack": pack_id},
                success_url=f"{SITE_URL}/ghatkaiti?purchase=success",
                cancel_url=f"{SITE_URL}/ghatkaiti?purchase=cancel",
            )
            self._send(200, {"url": session.url})

        except Exception as e:
            self._send(500, {"error": f"Could not start checkout: {e}"})

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
