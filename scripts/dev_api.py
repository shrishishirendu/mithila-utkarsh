"""
Local dev server for the Panchang API (Windows workaround).

`vercel dev` builder detection fails on this machine, so for local testing we
wrap the serverless `handler` class in a plain HTTPServer on port 8888 — which
is exactly where vite.config.js proxies /api requests.

Run from the repo root:

    .venv/Scripts/python.exe scripts/dev_api.py

Then `npm run dev` and the /panchang page's /api calls resolve locally.
"""

import sys
import os
from http.server import ThreadingHTTPServer

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "api"))

# Tell the handler to send no-store so engine edits show without a browser hard-refresh.
os.environ["PANCHANG_NO_CACHE"] = "1"
from panchang import handler as PanchangHandler    # noqa: E402  (GET /api/panchang)
from translate import handler as TranslateHandler  # noqa: E402  (POST /api/translate)

PORT = 8888


# Vercel serves each api/*.py as its own function; locally we fold both into one
# server. Multiple inheritance dispatches by HTTP verb: do_GET comes from the
# panchang handler, do_POST/do_OPTIONS from the translate handler.
class DevHandler(PanchangHandler, TranslateHandler):
    pass


if __name__ == "__main__":
    # ThreadingHTTPServer (not plain HTTPServer): the /panchang page fires the
    # ?date= and ?month= requests concurrently, and a single-threaded server
    # drops the second connection ("socket closed unexpectedly").
    server = ThreadingHTTPServer(("localhost", PORT), DevHandler)
    server.daemon_threads = True
    print(f"Dev API on http://localhost:{PORT}  —  GET /api/panchang, POST /api/translate")
    print("(Ctrl+C to stop)")
    server.serve_forever()
