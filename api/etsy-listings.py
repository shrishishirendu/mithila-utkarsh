"""
Vercel Serverless Function: /api/etsy-listings

Reads the shop's ACTIVE Etsy listings (public data — API key only, no OAuth) and
returns a slimmed list the /shop page renders in our own brand. The browser never
sees the API key, and we set a cache header so we don't hammer Etsy's rate limit.

Checkout stays on Etsy: each product card links to its Etsy listing URL.

Env (all optional — returns ok:false and an empty list until set, so the /shop
page just shows its "coming soon" fallback):
  ETSY_API_KEY    your Etsy app keystring (Etsy → Developers → your app)
  ETSY_SHOP_ID    numeric shop id  (preferred)
  ETSY_SHOP_NAME  shop name        (used to resolve the id if ETSY_SHOP_ID unset)
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse
import urllib.error

API_KEY = os.environ.get("ETSY_API_KEY")
SHOP_ID = os.environ.get("ETSY_SHOP_ID")
SHOP_NAME = os.environ.get("ETSY_SHOP_NAME")
BASE = "https://openapi.etsy.com/v3/application"


def etsy_get(path, params=None):
    url = f"{BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        "x-api-key": API_KEY,
        "Accept": "application/json",
        # Etsy's edge blocks default/empty User-Agents with a 403.
        "User-Agent": "MithilaUtkarsh/1.0 (+https://mithilautkarsh.com)",
    })
    try:
        with urllib.request.urlopen(req, timeout=9) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as he:
        body = he.read().decode("utf-8", "replace")[:300]
        raise Exception(f"etsy {he.code} on {path}: {body}")


def resolve_shop_id():
    if SHOP_ID:
        return SHOP_ID
    if not SHOP_NAME:
        return None
    data = etsy_get("/shops", {"shop_name": SHOP_NAME})
    results = data.get("results") or []
    return str(results[0]["shop_id"]) if results else None


def listing_image(listing_id):
    try:
        data = etsy_get(f"/listings/{listing_id}/images", {"limit": 1})
        imgs = data.get("results") or []
        if imgs:
            return imgs[0].get("url_570xN") or imgs[0].get("url_fullxfull")
    except Exception:
        pass
    return None


def fetch_products():
    sid = resolve_shop_id()
    if not sid:
        return []
    data = etsy_get(f"/shops/{sid}/listings/active", {"limit": 36, "includes": "Images"})
    out = []
    for L in (data.get("results") or []):
        price = L.get("price") or {}
        amount, divisor = price.get("amount"), (price.get("divisor") or 100)
        pretty = f"{amount / divisor:.2f}" if amount is not None else None
        imgs = L.get("images") or []
        image = None
        if imgs:
            image = imgs[0].get("url_570xN") or imgs[0].get("url_fullxfull")
        if not image:  # active-listings endpoint often omits images — fetch directly
            image = listing_image(L.get("listing_id"))
        out.append({
            "id": L.get("listing_id"),
            "title": L.get("title"),
            "url": L.get("url"),
            "price": pretty,
            "currency": price.get("currency_code"),
            "image": image,
        })
    return out


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        shop_url = f"https://www.etsy.com/shop/{SHOP_NAME}" if SHOP_NAME else None
        if not API_KEY:
            self._send(200, {"ok": False, "products": [], "shop_url": shop_url})
            return
        try:
            products = fetch_products()
            self._send(200, {"ok": True, "products": products, "shop_url": shop_url})
        except Exception as e:
            # Never break the page — fall back to the "coming soon" state.
            self._send(200, {"ok": False, "products": [], "shop_url": shop_url, "error": str(e)})

    def _send(self, code, obj):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        # Cache at the CDN for 10 min; serve stale while refreshing.
        self.send_header("Cache-Control", "s-maxage=600, stale-while-revalidate=86400")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode("utf-8"))
