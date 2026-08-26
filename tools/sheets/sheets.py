#!/usr/bin/env python3
"""
engine -> Google Sheets client.

Talks to the Apps Script web app bound to "My Claude Budget" (see Code.gs).
Stdlib only, no pip install, so it runs here and in a cloud routine unchanged.

Config comes from .env at the repo root:

    SHEETS_WEBAPP_URL=https://script.google.com/macros/s/AKfy.../exec
    SHEETS_TOKEN=...
    SHEETS_ID=1BrM8jAJC8Wuqm6WWZnu9jocdeNfxr4rYngapAXTXWMI

Usage
-----
    python tools/sheets/sheets.py ping
    python tools/sheets/sheets.py read Budget            [A1:P40]
    python tools/sheets/sheets.py formulas Budget C5:C20
    python tools/sheets/sheets.py append Expenses '[["2026-08-26","Feeding","Market",8500,"Bank card",""]]'
    python tools/sheets/sheets.py ops payload.json       # full batch, the one that does real work
    echo '{"ops":[...]}' | python tools/sheets/sheets.py ops -

`ops` is the general form. Everything else is a shortcut onto it.
"""

import json
import os
import sys
import urllib.error
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def load_env():
    cfg = {}
    path = os.path.join(REPO, ".env")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                cfg[k.strip()] = v.strip().strip('"').strip("'")
    for k in ("SHEETS_WEBAPP_URL", "SHEETS_TOKEN", "SHEETS_ID"):
        if os.environ.get(k):
            cfg[k] = os.environ[k]
    return cfg


def post(ops):
    cfg = load_env()
    url = cfg.get("SHEETS_WEBAPP_URL")
    token = cfg.get("SHEETS_TOKEN")
    if not url or not token:
        die(
            "SHEETS_WEBAPP_URL / SHEETS_TOKEN missing.\n"
            "The Apps Script web app is not deployed yet, or .env is missing.\n"
            "See tools/sheets/README.md."
        )

    body = json.dumps({"token": token, "ops": ops}).encode("utf-8")
    req = urllib.request.Request(
        url, data=body, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        die("HTTP %s from the web app:\n%s" % (e.code, e.read().decode("utf-8", "replace")[:2000]))
    except urllib.error.URLError as e:
        die("could not reach the web app: %s" % e.reason)

    try:
        out = json.loads(raw)
    except ValueError:
        die(
            "the web app did not return JSON. First 800 chars:\n"
            + raw[:800]
            + "\n\nUsually this means the deployment is not set to "
            '"Execute as: Me" + "Who has access: Anyone".'
        )

    if not out.get("ok"):
        die("web app error: %s" % out.get("error"))
    return out["results"]


def die(msg):
    sys.stderr.write("sheets.py: " + msg + "\n")
    sys.exit(1)


def show(results):
    print(json.dumps(results, indent=2, ensure_ascii=False))


def grid(values):
    """Print a read result as a readable grid."""
    if not values:
        print("(empty)")
        return
    for i, row in enumerate(values, start=1):
        cells = [str(c) for c in row]
        while cells and cells[-1] == "":
            cells.pop()
        if cells:
            print("%4d | %s" % (i, " | ".join(cells)))


def main(argv):
    # Windows consoles default to cp1252, which cannot encode the naira sign.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    if not argv:
        print(__doc__)
        return 0
    cmd, rest = argv[0], argv[1:]

    if cmd == "ping":
        show(post([{"action": "ping", "args": {}}]))

    elif cmd == "read":
        args = {"tab": rest[0]}
        if len(rest) > 1:
            args["range"] = rest[1]
        grid(post([{"action": "read", "args": args}])[0]["values"])

    elif cmd == "formulas":
        args = {"tab": rest[0]}
        if len(rest) > 1:
            args["range"] = rest[1]
        grid(post([{"action": "readFormulas", "args": args}])[0]["formulas"])

    elif cmd == "append":
        show(post([{"action": "append", "args": {"tab": rest[0], "values": json.loads(rest[1])}}]))

    elif cmd == "write":
        show(post([{"action": "write", "args": {"tab": rest[0], "cell": rest[1], "values": json.loads(rest[2])}}]))

    elif cmd == "script":
        # Print Code.gs with the real token substituted in, for pasting into the
        # Apps Script editor. The committed Code.gs keeps a placeholder so the
        # token never enters git history.
        cfg = load_env()
        if not cfg.get("SHEETS_TOKEN"):
            die("SHEETS_TOKEN missing from .env")
        src = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Code.gs")
        with open(src, encoding="utf-8") as fh:
            body = fh.read()
        if "__SHEETS_TOKEN__" not in body:
            die("Code.gs has no __SHEETS_TOKEN__ placeholder — refusing to print it")
        sys.stdout.write(body.replace("__SHEETS_TOKEN__", cfg["SHEETS_TOKEN"]))

    elif cmd == "ops":
        src = sys.stdin.read() if rest[0] == "-" else open(rest[0], encoding="utf-8").read()
        payload = json.loads(src)
        show(post(payload["ops"] if isinstance(payload, dict) else payload))

    else:
        die("unknown command: %s" % cmd)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
