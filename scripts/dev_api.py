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
from http.server import HTTPServer

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "api"))
from panchang import handler  # noqa: E402

PORT = 8888

if __name__ == "__main__":
    print(f"Panchang dev API on http://localhost:{PORT}  (Ctrl+C to stop)")
    HTTPServer(("localhost", PORT), handler).serve_forever()
