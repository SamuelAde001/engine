#!/usr/bin/env python3
"""
Samuelsignals OS — build the site's data layer.

WHY IT WORKS THIS WAY
---------------------
`context/*.md` stays the SOURCE OF TRUTH. This script derives the site from it.

That is the same rule as tools/scorecard/build.py, and it exists for the same
reason: generated output is never hand-written, so it can never drift from the
record. It also means the whole site inherits git's append-only guarantee for
free — you cannot silently soften a 40% day, because the day lives in a committed
markdown file and the site is just a view of it.

Nothing here writes to context/. If a number is wrong on the site, the fix is in
context/, never in site/data/.

    python tools/site/build.py            # build
    python tools/site/build.py --check    # parse and report, write nothing

Stdlib only. Runs here, in a cloud routine, and in CI unchanged.
"""

import json
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CTX = REPO / "context"
OUT = REPO / "site" / "data"

WARNINGS = []


def warn(msg):
    WARNINGS.append(msg)


# ---------------------------------------------------------------- primitives

def parse_duration(text):
    """'5.95h' '16.23h' '18m43s' '5h21m35s' '5h21m' '0h' -> float hours, or None.

    The ledger is written by a human at 9pm, so it carries every one of these
    shapes. Be tolerant here rather than losing a day's focus figure to a regex.
    """
    if not text:
        return None
    t = text.strip().lower().replace("~", "")
    if not t or t in {"—", "-", "none", "n/a"}:
        return None

    # 5h21m35s / 5h21m / 18m43s / 45s
    m = re.search(r"(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?", t)
    if m and any(m.groups()) and re.search(r"[hms]", t):
        h = int(m.group(1) or 0)
        mi = int(m.group(2) or 0)
        s = int(m.group(3) or 0)
        # A bare "5.95h" lands here with h=5 and loses the decimal, so only take
        # this branch when there is no decimal point attached to the hours.
        if not re.search(r"\d+\.\d+\s*h", t):
            total = h + mi / 60 + s / 3600
            if total > 0:
                return round(total, 4)

    m = re.search(r"(\d+(?:\.\d+)?)\s*h", t)
    if m:
        return round(float(m.group(1)), 4)

    m = re.search(r"^(\d+(?:\.\d+)?)$", t)
    if m:
        return round(float(m.group(1)), 4)
    return None


def parse_focus_cell(cell):
    """'5.95h / 14.7h = 40%' -> (5.95, 14.7). '0h logged' -> (0.0, None)."""
    if not cell:
        return None, None
    c = cell.strip()
    if c in {"", "—", "-"}:
        return None, None
    parts = c.split("/")
    logged = parse_duration(parts[0]) if parts else None
    committed = parse_duration(parts[1]) if len(parts) > 1 else None
    if logged is None and re.search(r"\b0h\b", c):
        logged = 0.0
    return logged, committed


def parse_habits_cell(cell):
    """'5/5' -> (5,5). '3/5 (social media + M broken...)' -> (3,5)."""
    if not cell:
        return None, None
    m = re.search(r"(\d+)\s*/\s*(\d+)", cell)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None


def parse_bed_cell(cell):
    """'1:42am (19h day)' -> ('01:42', 19.0). '—' -> (None, None).

    Returns 24h HH:MM plus any sleep-hours figure the row happened to carry.
    """
    if not cell:
        return None, None
    c = cell.strip()
    if c in {"", "—", "-"}:
        return None, None

    bed = None
    m = re.search(r"(\d{1,2}):(\d{2})\s*(am|pm)", c, re.I)
    if m:
        h, mi, ap = int(m.group(1)), int(m.group(2)), m.group(3).lower()
        if ap == "pm" and h != 12:
            h += 12
        if ap == "am" and h == 12:
            h = 0
        bed = f"{h:02d}:{mi:02d}"

    slept = None
    m = re.search(r"\(\s*~?\s*(\d+(?:\.\d+)?)\s*h", c)
    if m:
        slept = float(m.group(1))
    return bed, slept


def md_table_rows(text):
    """Yield lists of cell strings for every pipe row that isn't a separator."""
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        if re.match(r"^\|[\s\-:|]+\|$", line):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        yield cells


DATE_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})")


# ------------------------------------------------------------------- parsers

def parse_ledger():
    """context/ledger.md -> one dict per DATE. Later rows win (the 26 Aug interim
    row is superseded by that evening's final row)."""
    path = CTX / "ledger.md"
    if not path.exists():
        warn("ledger.md missing")
        return []
    rows = {}
    order = []
    for cells in md_table_rows(path.read_text(encoding="utf-8")):
        if not cells or not DATE_RE.match(cells[0]):
            continue
        d = DATE_RE.match(cells[0]).group(1)
        interim = "interim" in cells[0].lower()
        g = lambda i: cells[i] if len(cells) > i else ""
        logged, committed_h = parse_focus_cell(g(3))
        hit, hset = parse_habits_cell(g(4))
        bed, slept = parse_bed_cell(g(5))
        verdict = (g(6) or "").strip().upper()
        if verdict.startswith("IN PROGRESS"):
            verdict = "OPEN"
        if not verdict:
            verdict = "OPEN"

        row = {
            "date": d,
            "committed": g(1),
            "shipped": g(2),
            "focus_logged": logged,
            "focus_committed": committed_h,
            "habits_hit": hit,
            "habits_set": hset,
            "bed": bed,
            "slept": slept,
            "verdict": verdict,
            "interim": interim,
        }
        if d in rows and interim:
            continue  # never let an interim overwrite a final row
        if d not in rows:
            order.append(d)
        rows[d] = row
    return [rows[d] for d in order]


def parse_money_ledger():
    path = CTX / "money-ledger.md"
    if not path.exists():
        warn("money-ledger.md missing")
        return []
    out = []
    for cells in md_table_rows(path.read_text(encoding="utf-8")):
        if not cells or not DATE_RE.match(cells[0]):
            continue
        g = lambda i: cells[i] if len(cells) > i else ""

        def money(s):
            s = (s or "").replace(",", "").replace("₦", "").strip()
            m = re.search(r"(-?\d+(?:\.\d+)?)", s)
            return float(m.group(1)) if m else None

        out.append({
            "date": DATE_RE.match(cells[0]).group(1),
            "label": cells[0],
            "balance": money(g(1)),
            "in": money(g(2)),
            "out_text": g(3),
            "savings_moved": money(g(4)) or 0,
            "note": g(5),
        })
    return out


def parse_habits():
    """The habit table in context/habits.md, plus any running fast/detox block."""
    path = CTX / "habits.md"
    if not path.exists():
        warn("habits.md missing")
        return {"habits": [], "blocks": []}
    text = path.read_text(encoding="utf-8")
    habits = []
    for cells in md_table_rows(text):
        if len(cells) < 4:
            continue
        name, cadence, check, hid = cells[0], cells[1], cells[2], cells[3]
        if name.lower() in {"habit", ""} or "---" in name:
            continue
        if not re.match(r"^[0-9a-f]{16,}$", hid.strip()):
            continue
        habits.append({
            "name": name,
            "cadence": cadence,
            "check": check,
            "ticktick_id": hid.strip(),
        })

    blocks = []
    for m in re.finditer(r"##\s+The\s+(.+?)\s+\((\d{1,2})[–-](\d{1,2})\s+(\w+)\s+(\d{4})\)", text):
        blocks.append({"name": m.group(1), "from_day": int(m.group(2)),
                       "to_day": int(m.group(3)), "month": m.group(4), "year": int(m.group(5))})
    return {"habits": habits, "blocks": blocks}


def parse_patterns():
    path = CTX / "patterns.md"
    if not path.exists():
        warn("patterns.md missing")
        return []
    text = path.read_text(encoding="utf-8")
    out = []
    chunks = re.split(r"\n##\s+", text)
    for chunk in chunks[1:]:
        head, _, body = chunk.partition("\n")
        m = re.match(r"(P\d+)\s*[—-]\s*(.+)", head.strip())
        if not m:
            continue
        pid, name = m.group(1), m.group(2).strip()
        status = "candidate" if "candidate" in name.lower() else "active"
        name = re.sub(r"\s*\(candidate.*?\)", "", name, flags=re.I).strip()
        body = body.strip()
        ev = ""
        me = re.search(r"Evidence:(.*)", body, re.S)
        if me:
            ev = " ".join(me.group(1).split())
            body = body[: me.start()].strip()
        out.append({
            "id": pid,
            "name": name,
            "status": status,
            "mechanism": " ".join(body.split()),
            "evidence": ev,
        })
    return out


def parse_ledger_notes():
    """ledger-notes/*.md -> {date: narrative}."""
    notes = {}
    d = CTX / "ledger-notes"
    if not d.exists():
        return notes
    for f in sorted(d.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        for chunk in re.split(r"\n##\s+", text)[1:]:
            head, _, body = chunk.partition("\n")
            m = DATE_RE.match(head.strip())
            if not m:
                continue
            key = m.group(1)
            body = body.strip().rstrip("-").strip()
            # A FINAL row supersedes the interim one written earlier that day.
            if key in notes and "FINAL" not in head:
                continue
            notes[key] = body
    return notes


BUDGET_MONTHS = ["2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
                 "2027-01", "2027-02", "2027-03", "2027-04", "2027-05",
                 "2027-06", "2027-07"]


def parse_budget_plan(income=None):
    path = REPO / "tools" / "sheets" / "plan.json"
    if not path.exists():
        warn("tools/sheets/plan.json missing")
        return {}
    plan = json.loads(path.read_text(encoding="utf-8"))
    items = []
    for r in plan.get("recurring", []):
        cat, item, amt, tier, payday, due, active, note = (r + [""] * 8)[:8]
        items.append({"category": cat, "item": item, "amount": amt, "tier": tier,
                      "payday": payday, "due": due,
                      "active": str(active).lower().startswith("y"),
                      "month": None, "note": note})
    for month, rows in (plan.get("one_offs") or {}).items():
        for r in rows:
            cat, item, amt, tier, payday, due, active, note = (r + [""] * 8)[:8]
            items.append({"category": cat, "item": item, "amount": amt, "tier": tier,
                          "payday": payday, "due": due,
                          "active": str(active).lower().startswith("y"),
                          "month": month, "note": note})
    savings = plan.get("savings", [])

    # THE MONTH MUST BALANCE. Derived here, never typed: income minus bills
    # minus that month's one-offs minus every pot. A month that does not end at
    # zero is not planned, it is estimated — and the leftover is money with no
    # name on it, which is exactly what evaporated June-August.
    bills = sum(i["amount"] for i in items if i["active"] and not i["month"])
    one_by_month = {}
    for i in items:
        if i["active"] and i["month"]:
            one_by_month[i["month"]] = one_by_month.get(i["month"], 0) + i["amount"]
    gross = 0
    if income:
        gross = round((2 * income["rate_primary_usd"] + 2 * income["rate_secondary_usd"])
                      * income["usd_ngn"])
    plan_start = plan.get("plan_start") or BUDGET_MONTHS[0]
    balance = []
    for m in BUDGET_MONTHS:
        if m < plan_start:
            continue
        pots = sum(v["schedule"].get(m, 0) for v in savings)
        one = one_by_month.get(m, 0)
        balance.append({
            "month": m,
            "income": gross,
            "bills": bills,
            "one_offs": one,
            "pots": pots,
            "pot_split": {v["pot"]: v["schedule"][m] for v in savings if m in v["schedule"]},
            "left": gross - bills - one - pots,
        })
    return {
        "plan_start": plan.get("plan_start"),
        "tracking_start": plan.get("tracking_start"),
        "items": items,
        "savings": savings,
        "balance": balance,
        "bills_total": bills,
        "lean_ladder": plan.get("lean_month_ladder", []),
    }


# --------------------------------------------------------------------- score

def behaviour_score(row, cfg):
    """The formula Samuel approved 2026-08-28. Returns (score, components).

    Missing data RESCALES rather than scoring zero — a day with no sleep figure
    is not a day he slept badly, it is a day nobody asked.
    """
    w = cfg["weights"]
    comp = {}
    avail = 0
    earned = 0.0

    v = (row.get("verdict") or "").upper()
    if v in cfg["verdict_points"]:
        pts = cfg["verdict_points"][v]
        comp["verdict"] = {"points": pts, "of": w["verdict"]}
        avail += w["verdict"]
        earned += pts

    fl, fc = row.get("focus_logged"), row.get("focus_committed")
    if fl is not None and fc:
        raw = min(fl / fc, 1.0) * w["focus"]
        # >12h is not a good day, it is an invoice. body.md Rule 5.
        pts = min(raw, cfg["focus_over_12h_cap"]) if fl > 12 else raw
        comp["focus"] = {"points": round(pts, 1), "of": w["focus"],
                         "ratio": round(fl / fc, 3), "capped": fl > 12}
        avail += w["focus"]
        earned += pts

    hh, hs = row.get("habits_hit"), row.get("habits_set")
    if hh is not None and hs:
        pts = hh / hs * w["habits"]
        comp["habits"] = {"points": round(pts, 1), "of": w["habits"]}
        avail += w["habits"]
        earned += pts

    bed = row.get("bed")
    if bed:
        h, mi = (int(x) for x in bed.split(":"))
        mins = h * 60 + mi
        if mins < 720:      # after midnight -> push past the previous evening
            mins += 1440
        pts = 20 if mins <= 22 * 60 + 30 else (10 if mins <= 23 * 60 + 30 else 0)
        comp["sleep"] = {"points": pts, "of": w["sleep"], "bed": bed}
        avail += w["sleep"]
        earned += pts

    if avail == 0:
        return None, comp

    base = earned / avail * 100
    pen = 0
    d = datetime.strptime(row["date"], "%Y-%m-%d").date()
    if d.weekday() == 2 and not row.get("content_shipped"):
        pen += cfg["penalties"]["no_wednesday_video"]
        comp["penalty_wednesday"] = -cfg["penalties"]["no_wednesday_video"]
    if row.get("money_due") and not row.get("money_moved"):
        pen += cfg["penalties"]["planned_money_did_not_move"]
        comp["penalty_money"] = -cfg["penalties"]["planned_money_did_not_move"]

    return max(round(base) - pen, 0), comp


# --------------------------------------------------------------------- build

def iso_week_start(d):
    return (d - timedelta(days=d.weekday())).isoformat()


def main():
    check_only = "--check" in sys.argv

    site = json.loads((CTX / "site.json").read_text(encoding="utf-8"))
    ledger = parse_ledger()
    notes = parse_ledger_notes()
    money = parse_money_ledger()
    habits = parse_habits()
    patterns = parse_patterns()
    budget = parse_budget_plan(site["income"])

    # score + attach narrative
    for row in ledger:
        # Wednesday cadence has not started, so no Wednesday before it can be
        # penalised for a video that was never due.
        cadence = site["content"]["cadence_start"]
        row["content_due"] = row["date"] >= cadence
        row["content_shipped"] = False
        if not row["content_due"]:
            row["content_shipped"] = True  # suppresses the penalty, honestly
        row["money_due"] = False
        row["money_moved"] = False
        score, comp = behaviour_score(row, site["score"])
        row["score"] = score
        row["score_components"] = comp
        row["notes"] = notes.get(row["date"], "")
        row["week"] = iso_week_start(datetime.strptime(row["date"], "%Y-%m-%d").date())
        if row["focus_logged"] is not None and row["focus_committed"]:
            row["focus_pct"] = round(row["focus_logged"] / row["focus_committed"] * 100)
        else:
            row["focus_pct"] = None

    # weeks
    weeks = {}
    for row in ledger:
        wk = weeks.setdefault(row["week"], {
            "week": row["week"], "shipped": 0, "partial": 0, "missed": 0,
            "open": 0, "focus": 0.0, "scores": [], "days": 0,
        })
        wk["days"] += 1
        v = row["verdict"]
        wk["shipped" if v == "SHIPPED" else
           "partial" if v == "PARTIAL" else
           "missed" if v == "MISSED" else "open"] += 1
        if row["focus_logged"]:
            wk["focus"] += row["focus_logged"]
        if row["score"] is not None:
            wk["scores"].append(row["score"])
    for wk in weeks.values():
        wk["focus"] = round(wk["focus"], 2)
        wk["avg_score"] = round(sum(wk["scores"]) / len(wk["scores"])) if wk["scores"] else None
        del wk["scores"]

    closed = [r for r in ledger if r["verdict"] in {"SHIPPED", "PARTIAL", "MISSED"}]
    today = ledger[-1] if ledger else None

    bundle = {
        "generated": datetime.now().isoformat(timespec="seconds"),
        "profile": site["profile"],
        "score_config": site["score"],
        "sections": site["sections"],
        "ledger": ledger,
        "weeks": sorted(weeks.values(), key=lambda w: w["week"]),
        "money_ledger": money,
        "pots": site["pots"],
        "goals": site["goals"],
        "income": site["income"],
        "paydays": site["paydays"],
        "countdowns": site["countdowns"],
        "content": site["content"],
        "course": site["course"],
        "body": site["body"],
        "habits": habits,
        "habit_log": site.get("habit_log", {}),
        "patterns": patterns,
        # Raw markdown, shipped as-is and rendered client-side. This is what makes
        # "context/ is the source of truth" literally true rather than aspirational:
        # the prose on the site IS the file, not a retyped copy of it that drifts.
        "docs": {name: (CTX / f"{name}.md").read_text(encoding="utf-8")
                 for name in ("mission", "stakes", "spirit", "body", "people",
                              "audience", "money", "habits", "patterns", "ticktick")
                 if (CTX / f"{name}.md").exists()},
        "budget": budget,
        "summary": {
            "days_recorded": len(ledger),
            "days_closed": len(closed),
            "shipped": sum(1 for r in closed if r["verdict"] == "SHIPPED"),
            "partial": sum(1 for r in closed if r["verdict"] == "PARTIAL"),
            "missed": sum(1 for r in closed if r["verdict"] == "MISSED"),
            "total_focus": round(sum(r["focus_logged"] or 0 for r in ledger), 2),
            "last_score": next((r["score"] for r in reversed(closed)), None),
            "avg_score": (round(sum(r["score"] for r in closed if r["score"] is not None)
                                / max(1, len([r for r in closed if r["score"] is not None])))
                          if closed else None),
            "today": today["date"] if today else None,
            "nights_floor_hit": sum(
                1 for r in ledger if r["bed"] and
                (lambda m: m <= 22 * 60 + 30)(
                    (int(r["bed"][:2]) * 60 + int(r["bed"][3:])) + (1440 if int(r["bed"][:2]) * 60 + int(r["bed"][3:]) < 720 else 0))
            ),
            "nights_recorded": sum(1 for r in ledger if r["bed"]),
        },
        "warnings": WARNINGS,
    }

    if check_only:
        print(json.dumps({k: bundle[k] for k in ("summary", "warnings")}, indent=2))
        for r in ledger:
            print(f"  {r['date']}  {r['verdict']:<8} score={r['score']}  "
                  f"focus={r['focus_logged']}/{r['focus_committed']}  "
                  f"habits={r['habits_hit']}/{r['habits_set']}  bed={r['bed']}")
        return

    OUT.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(bundle, indent=2, ensure_ascii=False)
    (OUT / "os.json").write_text(payload + "\n", encoding="utf-8")

    # Also emit the same data as a plain script. fetch() on a local file is
    # blocked by CORS, so without this the site only works behind a server —
    # and the first thing Samuel will do is double-click index.html.
    (OUT / "os.js").write_text(
        "/* GENERATED by tools/site/build.py — do not edit. */\n"
        "window.OS = " + payload + ";\n", encoding="utf-8")

    size = (OUT / "os.json").stat().st_size
    print(f"wrote    : site/data/os.json + os.js  ({size/1024:.1f} KB)")
    print(f"days     : {bundle['summary']['days_recorded']} recorded, "
          f"{bundle['summary']['days_closed']} closed")
    print(f"scores   : last {bundle['summary']['last_score']}, "
          f"avg {bundle['summary']['avg_score']}")
    if WARNINGS:
        print("warnings :")
        for w in WARNINGS:
            print(f"  - {w}")


if __name__ == "__main__":
    main()
