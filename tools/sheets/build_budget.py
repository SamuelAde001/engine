#!/usr/bin/env python3
"""
Builds the Details tab and rebuilds the Budget tab from tools/sheets/plan.json.

Re-runnable. Clears and rewrites both tabs, so plan.json is the source of truth
for structure. Day-to-day edits (a sub changes price, a category moves payday)
are made in plan.json and this is re-run — or made directly with `sheets.py ops`
for one-line changes.

    python tools/sheets/build_budget.py

Design rules it enforces, straight out of context/money.md:
  - Nothing is typed on Budget. Column B reads Details; month columns read
    Expenses; the savings block reads Transfers. A line cannot claim money moved
    when no row exists. That was the whole bug in the old sheets (Rule 6).
  - Details is the ONLY place a plan number is typed.
  - Cancelled items go Active=No, never deleted.
"""

import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

# ---------------------------------------------------------------- palette ----

INK      = "#1f2937"   # section bars
HEAD     = "#374151"   # table headers
PAPER    = "#f3f4f6"   # total rows
MUTED    = "#6b7280"   # subtitles
GREEN    = "#065f46"   # savings
BLUE     = "#1e40af"   # paydays
RED      = "#b91c1c"   # warnings
AMBER    = "#92400e"   # lean month
WHITE    = "#ffffff"

NGN = '"₦"#,##0;[Red]-"₦"#,##0'

MONTHS = ["2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
          "2027-01", "2027-02", "2027-03", "2027-04", "2027-05",
          "2027-06", "2027-07"]
MONTH_LABELS = ["Aug 26", "Sep 26", "Oct 26", "Nov 26", "Dec 26",
                "Jan 27", "Feb 27", "Mar 27", "Apr 27", "May 27",
                "Jun 27", "Jul 27"]

CATEGORIES = [
    "Building project", "Parents", "Girlfriend", "Community admin",
    "Subscriptions", "Feeding", "Transport", "Health",
    "Chores / household", "Creator visits", "Giving", "Data / airtime",
    "Personal / misc", "Other",
]

# Ranges of the log tabs, as they already exist in the workbook.
EXP  = ('Expenses!$E$5:$E$404', 'Expenses!$C$5:$C$404', 'Expenses!$B$5:$B$404')
INC  = ('Income!$I$5:$I$124', 'Income!$B$5:$B$124')
TRF  = ('Transfers!$E$5:$E$404', 'Transfers!$C$5:$C$404', 'Transfers!$D$5:$D$404')


def col(n):
    """1 -> A"""
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def load_plan():
    with open(os.path.join(HERE, "plan.json"), encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------- details ----

def build_details(plan):
    rec = plan["recurring"]
    one = plan["one_offs"]["2026-09"]

    ops = [
        {"action": "ensureSheet", "args": {"tab": "Details", "index": 6, "tabColor": "#065f46"}},
        {"action": "clear", "args": {"tab": "Details"}},
    ]

    rows = [
        ["DETAILS — what every budget category is actually made of"] + [""] * 7,
        ["The ONLY place a plan number is typed. The Budget tab reads this with SUMIFS, "
         "so a category total can always be broken down into the things that make it up."] + [""] * 7,
        ["Cancelling something = set Active to No. Never delete the row. "
         "A subscription that reappears in three months is a pattern, and a deleted row hides it."] + [""] * 7,
        [""] * 8,
        ["Category", "Item", "₦ / month", "Tier", "Payday", "Due day", "Active", "Note"],
    ]
    rows += [list(r) for r in rec]

    first, last = 6, 5 + len(rec)
    total_row = last + 1
    rows.append(["RECURRING TOTAL", "", "", "", "", "", "", "Active items only."])

    # one-offs
    oh = total_row + 2                      # ONE-OFFS title row
    rows.append([""] * 8)
    rows.append(["ONE-OFFS — dated, not recurring"] + [""] * 7)
    rows.append(["These do NOT feed the recurring plan. They are listed on Budget in the month "
                 "they hit, and they show up in actuals automatically because they get logged on Expenses."] + [""] * 7)
    rows.append(["Month", "Category", "Item", "₦", "Payday", "Note", "", ""])
    for o in one:
        # plan.json one-off rows are [cat, item, amt, tier, payday, due, active, note]
        rows.append(["2026-09", o[0], o[1], o[2], o[4], o[7], "", ""])
    one_first = oh + 3
    one_last = one_first + len(one) - 1
    rows.append(["", "", "SEPTEMBER ONE-OFF TOTAL", "", "", "", "", ""])
    one_total = one_last + 1

    ops.append({"action": "write", "args": {"tab": "Details", "cell": "A1", "values": rows}})

    ops += [
        {"action": "setFormulas", "args": {"tab": "Details", "cell": "C%d" % total_row, "formulas": [[
            '=SUMIFS($C$%d:$C$%d,$G$%d:$G$%d,"Yes")' % (first, last, first, last)]]}},
        {"action": "setFormulas", "args": {"tab": "Details", "cell": "D%d" % one_total, "formulas": [[
            '=SUM($D$%d:$D$%d)' % (one_first, one_last)]]}},

        # structure
        {"action": "freeze", "args": {"tab": "Details", "rows": 5}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 1, "width": 150}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 2, "width": 260}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 3, "width": 100}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 4, "width": 105}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 5, "width": 70}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 6, "width": 75}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 7, "width": 65}},
        {"action": "setColumnWidth", "args": {"tab": "Details", "column": 8, "width": 520}},

        # title
        {"action": "format", "args": {"tab": "Details", "range": "A1:H1", "merge": True,
                                      "background": INK, "fontColor": WHITE, "bold": True, "fontSize": 13}},
        {"action": "format", "args": {"tab": "Details", "range": "A2:H2", "merge": True,
                                      "fontColor": MUTED, "italic": True, "wrap": True}},
        {"action": "format", "args": {"tab": "Details", "range": "A3:H3", "merge": True,
                                      "fontColor": RED, "italic": True, "wrap": True}},
        {"action": "format", "args": {"tab": "Details", "range": "A5:H5",
                                      "background": HEAD, "fontColor": WHITE, "bold": True}},
        {"action": "format", "args": {"tab": "Details", "range": "C%d:C%d" % (first, total_row),
                                      "numberFormat": NGN}},
        {"action": "format", "args": {"tab": "Details", "range": "A%d:H%d" % (total_row, total_row),
                                      "background": PAPER, "bold": True}},
        {"action": "format", "args": {"tab": "Details", "range": "H%d:H%d" % (first, last),
                                      "fontColor": MUTED, "fontSize": 9, "wrap": True}},
        {"action": "format", "args": {"tab": "Details", "range": "D%d:G%d" % (first, last),
                                      "horizontalAlignment": "center"}},

        # one-offs block
        {"action": "format", "args": {"tab": "Details", "range": "A%d:H%d" % (oh, oh), "merge": True,
                                      "background": AMBER, "fontColor": WHITE, "bold": True}},
        {"action": "format", "args": {"tab": "Details", "range": "A%d:H%d" % (oh + 1, oh + 1),
                                      "merge": True, "fontColor": MUTED, "italic": True, "wrap": True}},
        {"action": "format", "args": {"tab": "Details", "range": "A%d:F%d" % (oh + 2, oh + 2),
                                      "background": HEAD, "fontColor": WHITE, "bold": True}},
        {"action": "format", "args": {"tab": "Details", "range": "D%d:D%d" % (one_first, one_total),
                                      "numberFormat": NGN}},
        {"action": "format", "args": {"tab": "Details", "range": "A%d:F%d" % (one_total, one_total),
                                      "background": PAPER, "bold": True}},
        {"action": "format", "args": {"tab": "Details", "range": "F%d:F%d" % (one_first, one_last),
                                      "fontColor": MUTED, "fontSize": 9, "wrap": True}},

        # inactive rows greyed
        {"action": "validation", "args": {"tab": "Details", "range": "G%d:G%d" % (first, last),
                                          "list": ["Yes", "No"]}},
        {"action": "validation", "args": {"tab": "Details", "range": "E%d:E%d" % (first, last),
                                          "list": ["A", "B"]}},
        {"action": "validation", "args": {"tab": "Details", "range": "D%d:D%d" % (first, last),
                                          "list": ["Fixed", "Committed", "Discretionary"]}},
    ]

    # grey out any inactive item
    for i, r in enumerate(rec):
        if r[6] != "Yes":
            rn = first + i
            ops.append({"action": "format", "args": {"tab": "Details", "range": "A%d:H%d" % (rn, rn),
                                                     "fontColor": "#9ca3af", "italic": True}})

    return ops, (first, last)


# ----------------------------------------------------------------- budget ----

def build_budget(plan, details_range):
    d_first, d_last = details_range
    ops = [{"action": "freeze", "args": {"tab": "Budget", "rows": 0, "columns": 0}},
           {"action": "clear", "args": {"tab": "Budget"}}]

    LASTCOL = "R"
    rows = []

    def blank():
        rows.append([""] * 18)

    # --- header -------------------------------------------------------------
    rows.append(["BUDGET — the plan, and what it costs to keep it"] + [""] * 17)
    rows.append(["Nothing on this sheet is typed by hand. Plan reads Details. The month columns read "
                 "Expenses. The savings block reads Transfers. A line here cannot claim money moved "
                 "when no row exists — money.md Rule 6."] + [""] * 17)
    blank()

    # --- monthly plan -------------------------------------------------------
    PLAN_TITLE = 4
    rows.append(["THE MONTHLY PLAN — recurring baseline"] + [""] * 17)
    rows.append(["Category", "Plan / month", "Tier", "Payday"] + MONTH_LABELS
                + ["Total actual", "vs plan (12m)"])
    PLAN_HEAD = 5
    PLAN_FIRST = 6
    for c in CATEGORIES:
        rows.append([c] + [""] * 17)
    PLAN_LAST = PLAN_FIRST + len(CATEGORIES) - 1
    rows.append(["TOTAL SPENT"] + [""] * 17)
    rows.append(["INCOME THAT MONTH"] + [""] * 17)
    rows.append(["SURPLUS  (in − out)"] + [""] * 17)
    TOTAL, INCOME, SURPLUS = PLAN_LAST + 1, PLAN_LAST + 2, PLAN_LAST + 3
    blank()

    # --- one-offs -----------------------------------------------------------
    ONE_TITLE = SURPLUS + 2
    rows.append(["ONE-OFFS — dated, not recurring. Listed here so a month knows what is coming."] + [""] * 17)
    rows.append(["Month", "Category", "Item", "₦", "Payday", "Note"] + [""] * 12)
    ONE_FIRST = ONE_TITLE + 2
    for o in plan["one_offs"]["2026-09"]:
        rows.append(["2026-09", o[0], o[1], o[2], o[4], o[7]] + [""] * 12)
    ONE_LAST = ONE_FIRST + len(plan["one_offs"]["2026-09"]) - 1
    rows.append(["", "", "SEPTEMBER ONE-OFF TOTAL", "", "", ""] + [""] * 12)
    ONE_TOTAL = ONE_LAST + 1
    blank()

    # --- savings ------------------------------------------------------------
    SAV_TITLE = ONE_TOTAL + 2
    rows.append(["SAVINGS PLAN — the pots, and whether the money actually moved"] + [""] * 17)
    rows.append(["“Moved to date” is not a plan. It reads the Transfers tab: To pot minus From pot. "
                 "If it says zero, no money moved, whatever the intention was."] + [""] * 17)
    rows.append(["Pot", "Per month", "Payday", "Target", "Moved to date", "Still to find",
                 "Starts", "Deadline", "Note"] + [""] * 9)
    SAV_HEAD = SAV_TITLE + 2
    SAV_FIRST = SAV_HEAD + 1
    # (pot, per month, payday, target, starts, deadline, note)
    # The first RUNNING_NOW of these are live; the rest do not start until January
    # and must never be summed into a "this month" figure.
    savings_rows = [
        ("Goal 1 — house", 249124, "B", 1000000, "Sep 2026", "2026-12-31",
         "THE December number. ₦249,124/month from a ₦3,503 start. Moves on Payday B — "
         "Samuel's call 2026-08-26, because Payday A is always full. See the Rule 3 note on Setup."),
        ("Cowrywise investment", 100000, "A", 705000, "running", "2026-12-31",
         "RING-FENCED, Rule 7. Never pauses, never counts toward the ₦1M or the ₦3M. "
         "₦305,000 already in. Moves into stocks Jan 2027."),
        ("Buffer", 50000, "B", 200000, "Sep 2026", "rolling",
         "NEW. The cushion urgencies come out of, so savings stop being the valve. This is the direct "
         "fix for the ₦595,250 that evaporated June–August. Also fed by month-end underspend "
         "and by any 4-video month's excess."),
        ("Goal 2 — marriage", 428571, "B", 3000000, "Jan 2027", "2027-07-31",
         "Starts Jan 2027, after Goal 1 closes. ON TOP of the ₦1M — ₦4,000,000 total."),
        ("Emergency fund", 50000, "B", 300000, "Jan 2027", "2027-06-30",
         "Starts Jan 2027. Does not compete with December."),
    ]
    RUNNING_NOW = 3
    for s in savings_rows:
        rows.append([s[0], s[1], s[2], s[3], "", "", s[4], s[5], s[6]] + [""] * 9)
    SAV_LAST = SAV_FIRST + len(savings_rows) - 1
    SAV_NOW_LAST = SAV_FIRST + RUNNING_NOW - 1
    rows.append(["MOVING NOW  (Sep – Dec 2026)", "", "", "", "", "", "", "",
                 "Goal 1 + Cowrywise + Buffer. This is what has to leave the account every month "
                 "between now and December."] + [""] * 9)
    rows.append(["FROM JAN 2027", "", "", "", "", "", "", "",
                 "Goal 2 + the emergency fund, once Goal 1 closes. Against a ₦336,041 surplus at the "
                 "August mix this is SHORT every month — which is the entire argument for the course "
                 "carrying ~₦170,000/month from January."] + [""] * 9)
    SAV_TOTAL = SAV_LAST + 1
    SAV_LATER = SAV_LAST + 2
    blank()

    # --- paydays ------------------------------------------------------------
    PAY_TITLE = SAV_LATER + 2
    rows.append(["THE TWO PAYDAYS — one batch, split across two dates"] + [""] * 17)
    rows.append(["", "Payday A — 70%", "Payday B — 30%", "", "", "", ""] + [""] * 11)
    rows.append(["When it lands", "End of the PREVIOUS month",
                 "Around the 14th", "", "", "", ""] + [""] * 11)
    rows.append(["What it funds", "The 1st – 14th", "The 15th – month end", "", "", "", ""] + [""] * 11)
    rows.append(["Expected in", "", "", "", "", "", ""] + [""] * 11)
    rows.append(["Committed (from Details)", "", "", "", "", "", ""] + [""] * 11)
    rows.append(["Free after commitments", "", "", "", "", "", ""] + [""] * 11)
    PAY_HEAD = PAY_TITLE + 1
    PAY_LANDS, PAY_FUNDS, PAY_IN, PAY_OUT, PAY_FREE = (PAY_HEAD + 1, PAY_HEAD + 2,
                                                       PAY_HEAD + 3, PAY_HEAD + 4, PAY_HEAD + 5)
    rows.append(["The 30% is ALWAYS the previous month's remaining batch, never a new one. "
                 "Every “mid-month payment” is last month's money."] + [""] * 17)
    PAY_NOTE = PAY_FREE + 1
    blank()

    # --- lean ladder --------------------------------------------------------
    LEAN_TITLE = PAY_NOTE + 2
    rows.append(["LEAN MONTH LADDER — decided now, so it is not negotiated at 11pm on a short month"] + [""] * 17)
    ladder = [
        "Income lands short. Cut in THIS order. Do not improvise.",
        "1.  Personal / misc  —  ₦10,000",
        "2.  Creator visits  —  ₦25,000",
        "3.  Household down to ₦20,000  —  ₦20,000",
        "4.  The BUFFER absorbs the rest. That is what it is for.",
        "5.  ONLY THEN a conversation. Savings are never the valve (Rule 1). "
        "Cowrywise never pauses (Rule 7). The gym is not a budget line to raid.",
        "A 2-video month is ₦909,991. Steps 1–3 free only ₦55,000 of a ₦228,569 gap. "
        "Without a buffer there is no legal way to balance that month — which is exactly why the buffer exists.",
    ]
    for l in ladder:
        rows.append([l] + [""] * 17)
    LEAN_LAST = LEAN_TITLE + len(ladder)
    blank()

    # --- payday calendar ----------------------------------------------------
    CAL_TITLE = LEAN_LAST + 2
    rows.append(["PAYDAY CALENDAR — they do not pay at weekends"] + [""] * 17)
    rows.append(["Nominal", "Falls on", "Actually lands", "Slip", "Why it matters"] + [""] * 13)
    CAL_HEAD = CAL_TITLE + 1
    cal = [
        ("Aug 70%", "Mon 31 Aug 2026", "Mon 31 Aug", "—", "Funds the first half of September."),
        ("Sep 30%", "Mon 14 Sep 2026", "Mon 14 Sep", "—", "Funds the second half of September."),
        ("Sep 70%", "Wed 30 Sep 2026", "Wed 30 Sep", "—", ""),
        ("Oct 30%", "Wed 14 Oct 2026", "Wed 14 Oct", "—", ""),
        ("Oct 70%", "Sat 31 Oct 2026", "Mon 2 Nov", "+2 days",
         "TIGHTEST POINT OF THE YEAR. November's front half is funded on the 2nd, and Google bills the "
         "2nd, CapCut the 4th. This is a buffer month."),
        ("Nov 30%", "Sat 14 Nov 2026", "Mon 16 Nov", "+2 days", "Second slip in a row."),
        ("Nov 70%", "Mon 30 Nov 2026", "Mon 30 Nov", "—", ""),
        ("Dec 30%", "Mon 14 Dec 2026", "Mon 14 Dec", "—", ""),
        ("Dec 70%", "Thu 31 Dec 2026", "Thu 31 Dec", "—", "Goal 1 deadline is this day."),
    ]
    for c in cal:
        rows.append(list(c) + [""] * 13)
    CAL_LAST = CAL_HEAD + len(cal)

    ops.append({"action": "write", "args": {"tab": "Budget", "cell": "A1", "values": rows}})

    # ---------------------------------------------------------- formulas ----
    f = []

    # plan column B  <- Details
    for r in range(PLAN_FIRST, PLAN_LAST + 1):
        f.append(("B%d" % r, '=SUMIFS(Details!$C$%d:$C$%d,Details!$A$%d:$A$%d,$A%d,'
                             'Details!$G$%d:$G$%d,"Yes")'
                  % (d_first, d_last, d_first, d_last, r, d_first, d_last)))
        # tier / payday, read off Details too (blank when the category spans both)
        f.append(("C%d" % r, '=IFERROR(IF(COUNTIF(Details!$A$%d:$A$%d,$A%d)=0,"",'
                             'IF(COUNTIFS(Details!$A$%d:$A$%d,$A%d,Details!$D$%d:$D$%d,'
                             'INDEX(Details!$D$%d:$D$%d,MATCH($A%d,Details!$A$%d:$A$%d,0)))'
                             '=COUNTIF(Details!$A$%d:$A$%d,$A%d),'
                             'INDEX(Details!$D$%d:$D$%d,MATCH($A%d,Details!$A$%d:$A$%d,0)),"mixed")),"")'
                  % (d_first, d_last, r,
                     d_first, d_last, r, d_first, d_last,
                     d_first, d_last, r, d_first, d_last,
                     d_first, d_last, r,
                     d_first, d_last, r, d_first, d_last)))
        f.append(("D%d" % r, '=IFERROR(IF(COUNTIF(Details!$A$%d:$A$%d,$A%d)=0,"",'
                             'IF(COUNTIFS(Details!$A$%d:$A$%d,$A%d,Details!$E$%d:$E$%d,"A")'
                             '=COUNTIF(Details!$A$%d:$A$%d,$A%d),"A",'
                             'IF(COUNTIFS(Details!$A$%d:$A$%d,$A%d,Details!$E$%d:$E$%d,"B")'
                             '=COUNTIF(Details!$A$%d:$A$%d,$A%d),"B","split"))),"")'
                  % (d_first, d_last, r,
                     d_first, d_last, r, d_first, d_last,
                     d_first, d_last, r,
                     d_first, d_last, r, d_first, d_last,
                     d_first, d_last, r)))
        # month actuals  <- Expenses
        for i, m in enumerate(MONTHS):
            f.append(("%s%d" % (col(5 + i), r),
                      '=SUMIFS(%s,%s,$A%d,%s,"%s")' % (EXP[0], EXP[1], r, EXP[2], m)))
        f.append(("Q%d" % r, "=SUM($E%d:$P%d)" % (r, r)))
        f.append(("R%d" % r, "=$Q%d-($B%d*12)" % (r, r)))

    # totals
    f.append(("B%d" % TOTAL, "=SUM(B%d:B%d)" % (PLAN_FIRST, PLAN_LAST)))
    for i in range(12):
        c = col(5 + i)
        f.append(("%s%d" % (c, TOTAL), "=SUM(%s%d:%s%d)" % (c, PLAN_FIRST, c, PLAN_LAST)))
        f.append(("%s%d" % (c, INCOME),
                  '=SUMIFS(%s,%s,"%s")' % (INC[0], INC[1], MONTHS[i])))
        f.append(("%s%d" % (c, SURPLUS), "=%s%d-%s%d" % (c, INCOME, c, TOTAL)))
    f.append(("Q%d" % TOTAL, "=SUM($E%d:$P%d)" % (TOTAL, TOTAL)))
    f.append(("R%d" % TOTAL, "=$Q%d-($B%d*12)" % (TOTAL, TOTAL)))
    f.append(("Q%d" % INCOME, "=SUM($E%d:$P%d)" % (INCOME, INCOME)))
    f.append(("Q%d" % SURPLUS, "=SUM($E%d:$P%d)" % (SURPLUS, SURPLUS)))

    # one-offs total
    f.append(("D%d" % ONE_TOTAL, "=SUM(D%d:D%d)" % (ONE_FIRST, ONE_LAST)))

    # savings: moved to date / still to find
    for r in range(SAV_FIRST, SAV_LAST + 1):
        f.append(("E%d" % r,
                  '=SUMIFS(%s,%s,$A%d,%s,"To pot")-SUMIFS(%s,%s,$A%d,%s,"From pot")'
                  % (TRF[0], TRF[1], r, TRF[2], TRF[0], TRF[1], r, TRF[2])))
        f.append(("F%d" % r, "=MAX(0,$D%d-$E%d)" % (r, r)))
    f.append(("B%d" % SAV_TOTAL, "=SUM(B%d:B%d)" % (SAV_FIRST, SAV_NOW_LAST)))
    f.append(("E%d" % SAV_TOTAL, "=SUM(E%d:E%d)" % (SAV_FIRST, SAV_NOW_LAST)))
    f.append(("F%d" % SAV_TOTAL, "=SUM(F%d:F%d)" % (SAV_FIRST, SAV_NOW_LAST)))
    f.append(("B%d" % SAV_LATER, "=SUM(B%d:B%d)" % (SAV_NOW_LAST + 1, SAV_LAST)))
    f.append(("F%d" % SAV_LATER, "=SUM(F%d:F%d)" % (SAV_NOW_LAST + 1, SAV_LAST)))

    # paydays
    gross = "(2*Setup!$B$18+2*Setup!$B$19)*Setup!$B$17"
    f.append(("B%d" % PAY_IN, "=%s*0.7" % gross))
    f.append(("C%d" % PAY_IN, "=%s*0.3" % gross))
    f.append(("B%d" % PAY_OUT,
              '=SUMIFS(Details!$C$%d:$C$%d,Details!$E$%d:$E$%d,"A",Details!$G$%d:$G$%d,"Yes")+Setup!$B$20'
              % (d_first, d_last, d_first, d_last, d_first, d_last)))
    f.append(("C%d" % PAY_OUT,
              '=SUMIFS(Details!$C$%d:$C$%d,Details!$E$%d:$E$%d,"B",Details!$G$%d:$G$%d,"Yes")'
              % (d_first, d_last, d_first, d_last, d_first, d_last)))
    f.append(("B%d" % PAY_FREE, "=B%d-B%d" % (PAY_IN, PAY_OUT)))
    f.append(("C%d" % PAY_FREE, "=C%d-C%d" % (PAY_IN, PAY_OUT)))

    for cell, formula in f:
        ops.append({"action": "setFormulas", "args": {"tab": "Budget", "cell": cell,
                                                      "formulas": [[formula]]}})

    # ----------------------------------------------------------- format ----
    def fmt(rng, **kw):
        a = {"tab": "Budget", "range": rng}
        a.update(kw)
        ops.append({"action": "format", "args": a})

    for c, w in [(1, 190), (2, 115), (3, 105), (4, 70), (17, 115), (18, 120)]:
        ops.append({"action": "setColumnWidth", "args": {"tab": "Budget", "column": c, "width": w}})
    for i in range(12):
        ops.append({"action": "setColumnWidth", "args": {"tab": "Budget", "column": 5 + i, "width": 88}})

    fmt("A1:%s1" % LASTCOL, merge=True, background=INK, fontColor=WHITE, bold=True, fontSize=13)
    fmt("A2:%s2" % LASTCOL, merge=True, fontColor=MUTED, italic=True, wrap=True)
    fmt("A%d:%s%d" % (PLAN_TITLE, LASTCOL, PLAN_TITLE), merge=True, background=INK,
        fontColor=WHITE, bold=True)
    fmt("A%d:%s%d" % (PLAN_HEAD, LASTCOL, PLAN_HEAD), background=HEAD, fontColor=WHITE, bold=True,
        horizontalAlignment="center", wrap=True)
    fmt("A%d:A%d" % (PLAN_FIRST, PLAN_LAST), horizontalAlignment="left")
    fmt("B%d:B%d" % (PLAN_FIRST, TOTAL), numberFormat=NGN)
    fmt("E%d:%s%d" % (PLAN_FIRST, LASTCOL, SURPLUS), numberFormat=NGN)
    fmt("C%d:D%d" % (PLAN_FIRST, PLAN_LAST), horizontalAlignment="center")
    fmt("A%d:%s%d" % (TOTAL, LASTCOL, SURPLUS), background=PAPER, bold=True)
    fmt("A%d:%s%d" % (SURPLUS, LASTCOL, SURPLUS), fontColor=GREEN)

    fmt("A%d:%s%d" % (ONE_TITLE, LASTCOL, ONE_TITLE), merge=True, background=AMBER,
        fontColor=WHITE, bold=True)
    fmt("A%d:F%d" % (ONE_TITLE + 1, ONE_TITLE + 1), background=HEAD, fontColor=WHITE, bold=True)
    fmt("D%d:D%d" % (ONE_FIRST, ONE_TOTAL), numberFormat=NGN)
    fmt("A%d:F%d" % (ONE_TOTAL, ONE_TOTAL), background=PAPER, bold=True)
    fmt("F%d:F%d" % (ONE_FIRST, ONE_LAST), fontColor=MUTED, fontSize=9, wrap=True)

    fmt("A%d:%s%d" % (SAV_TITLE, LASTCOL, SAV_TITLE), merge=True, background=GREEN,
        fontColor=WHITE, bold=True)
    fmt("A%d:%s%d" % (SAV_TITLE + 1, LASTCOL, SAV_TITLE + 1), merge=True, fontColor=MUTED,
        italic=True, wrap=True)
    fmt("A%d:I%d" % (SAV_HEAD, SAV_HEAD), background=HEAD, fontColor=WHITE, bold=True, wrap=True)
    fmt("B%d:B%d" % (SAV_FIRST, SAV_LATER), numberFormat=NGN)
    fmt("D%d:F%d" % (SAV_FIRST, SAV_LATER), numberFormat=NGN)
    fmt("C%d:C%d" % (SAV_FIRST, SAV_LAST), horizontalAlignment="center")
    fmt("A%d:I%d" % (SAV_TOTAL, SAV_LATER), background=PAPER, bold=True)
    fmt("I%d:I%d" % (SAV_TOTAL, SAV_LATER), fontColor=MUTED, fontSize=9, italic=True, wrap=True, bold=False)
    fmt("A%d:B%d" % (SAV_LATER, SAV_LATER), fontColor=RED)
    fmt("I%d:I%d" % (SAV_FIRST, SAV_LAST), fontColor=MUTED, fontSize=9, wrap=True)
    fmt("G%d:H%d" % (SAV_FIRST, SAV_LAST), horizontalAlignment="center")
    ops.append({"action": "setColumnWidth", "args": {"tab": "Budget", "column": 7, "width": 88}})
    ops.append({"action": "setColumnWidth", "args": {"tab": "Budget", "column": 8, "width": 88}})

    fmt("A%d:%s%d" % (PAY_TITLE, LASTCOL, PAY_TITLE), merge=True, background=BLUE,
        fontColor=WHITE, bold=True)
    fmt("A%d:C%d" % (PAY_HEAD, PAY_HEAD), background=HEAD, fontColor=WHITE, bold=True)
    fmt("A%d:A%d" % (PAY_LANDS, PAY_FREE), bold=True)
    fmt("B%d:C%d" % (PAY_IN, PAY_FREE), numberFormat=NGN)
    fmt("A%d:C%d" % (PAY_FREE, PAY_FREE), background=PAPER, bold=True, fontColor=GREEN)
    fmt("A%d:%s%d" % (PAY_NOTE, LASTCOL, PAY_NOTE), merge=True, fontColor=MUTED,
        italic=True, wrap=True)

    fmt("A%d:%s%d" % (LEAN_TITLE, LASTCOL, LEAN_TITLE), merge=True, background=AMBER,
        fontColor=WHITE, bold=True)
    for i in range(1, len(ladder) + 1):
        r = LEAN_TITLE + i
        fmt("A%d:%s%d" % (r, LASTCOL, r), merge=True, wrap=True)
    fmt("A%d:%s%d" % (LEAN_LAST, LASTCOL, LEAN_LAST), fontColor=RED, italic=True)

    fmt("A%d:%s%d" % (CAL_TITLE, LASTCOL, CAL_TITLE), merge=True, background=BLUE,
        fontColor=WHITE, bold=True)
    fmt("A%d:E%d" % (CAL_HEAD, CAL_HEAD), background=HEAD, fontColor=WHITE, bold=True)
    fmt("E%d:E%d" % (CAL_HEAD + 1, CAL_LAST), fontColor=MUTED, fontSize=9, wrap=True)
    # the two slip rows in red
    fmt("A%d:E%d" % (CAL_HEAD + 5, CAL_HEAD + 6), fontColor=RED, bold=True)

    ops.append({"action": "freeze", "args": {"tab": "Budget", "rows": 5}})
    return ops


def build_setup():
    """Refresh the category and pot lists so the dropdowns match reality."""
    cats = [[c] for c in CATEGORIES]
    pots = [["Goal 1 — house"], ["Cowrywise investment"], ["Buffer"],
            ["Goal 2 — marriage"], ["Emergency fund"]]
    return [
        {"action": "clear", "args": {"tab": "Setup", "range": "I2:I20", "contentsOnly": True}},
        {"action": "clear", "args": {"tab": "Setup", "range": "K2:K20", "contentsOnly": True}},
        {"action": "write", "args": {"tab": "Setup", "cell": "I2", "values": cats}},
        {"action": "write", "args": {"tab": "Setup", "cell": "K2", "values": pots}},
        # Rule 3, amended for the two-payday reality
        {"action": "write", "args": {"tab": "Setup", "cell": "A25", "values": [[
            "3. Savings move ON A PAYDAY, the day the money lands — never at month end. "
            "Cowrywise on Payday A. Goal 1 and the Buffer on Payday B (Samuel's call 2026-08-26: "
            "Payday A is always full). EXCEPTION: if Payday A leaves more than ₦50,000 free "
            "after its commitments, that excess moves the same day. Six figures sitting loose for "
            "14 days is how ₦595,250 disappeared."]]}},
        {"action": "format", "args": {"tab": "Setup", "range": "A25", "wrap": True}},
        # dropdowns on the log tabs
        {"action": "validation", "args": {"tab": "Expenses", "range": "C5:C404",
                                          "list": CATEGORIES}},
        {"action": "validation", "args": {"tab": "Transfers", "range": "C5:C404",
                                          "list": [p[0] for p in pots]}},
    ]


def main():
    plan = load_plan()
    ops = []
    d_ops, d_range = build_details(plan)
    ops += d_ops
    ops += build_budget(plan, d_range)
    ops += build_setup()

    payload = os.path.join(HERE, "_build_ops.json")
    with open(payload, "w", encoding="utf-8") as fh:
        json.dump({"ops": ops}, fh, ensure_ascii=False)

    print("%d operations queued" % len(ops))
    r = subprocess.run([sys.executable, os.path.join(HERE, "sheets.py"), "ops", payload],
                       cwd=REPO)
    os.remove(payload)
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
