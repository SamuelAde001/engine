# Money ledger

Append-only. One row per day. Filled at the evening reckoning from Samuel's bank
balance screenshot and his spoken account of what went out.

A screenshot without a spend list is not verification. A day with no row is a gap,
and gaps get named at the weekly review.

Savings moved = money that left the current account and went into savings or the
emergency fund. The Cowrywise investment is tracked separately in the Note column —
it is ring-fenced and does not count toward the ₦1M (money.md Rule 7).

| Date | Balance (₦) | In | Out — what and how much | Savings moved | Note |
|------|-------------|-----|--------------------------|---------------|------|
| 2026-08-26 | 3,503 | — | UNREPORTED — no spend list given | 0 | OPENING BALANCE. Given by Samuel at the build, not at a reckoning. Not verified: balance only, no spend list. Cowrywise investment ₦305,000 (locked, separate). Emergency fund ₦0. First proper row is tonight. |
| 2026-08-26 (reckoning) | 2,000 | — | Recharge card ₦1,000 (his words: "I spent money on recharge card today in my bank account, 1k recharge") | 0 | Balance given verbally, no screenshot. ARITHMETIC GAP: opening was ₦3,503, minus ₦1,000 leaves ₦2,503, he reported ₦2,000 — ₦503 unaccounted. Recorded as he said it; do not reconcile from memory, ask at the next reckoning. TRANSPORT SHORTFALL: he needs ₦5,000 for Sunday transport back and forth, has ₦2,000, short ₦3,000. Liquid savings ₦0, emergency fund ₦0, Cowrywise ₦305,000 locked until Jan 2027 — there is nothing to draw on. Church on 30 Aug is off for lack of transport money, not scheduling. NOT MIRRORED to the budget sheet: bridge unreachable from the cloud session (no .env). Mirror at the next desktop session. |

| 2026-08-27 | 2,503 | — | NOTHING OUT — his words: "Nothing went out, still same Balance as yesterday" | 0 | No screenshot, balance given verbally as unchanged from 26 Aug. **₦503 GAP RESOLVED at this reckoning** — his words: "I meant 2,503 Didn't mention the remaining figures, that was a slip from me." So the true balance has been ₦2,503 since 26 Aug and the arithmetic was always clean: ₦3,503 − ₦1,000 = ₦2,503. No money is missing. A zero-spend day: nothing moved because there is nothing to move. Route Rise 70% (~$711.66 ≈ ₦971,416) now expected ~1–3 Sep, not 31 Aug (Lewis away till the 31st). Invoice sends Fri 28 Aug 7:00–7:45am regardless. Nothing to mirror to the sheet — no expense rows, no transfers. |

**2026-08-27 — the ₦503 was a reporting slip, not a missing ₦503.** The
2026-08-26 (reckoning) row above records the balance as ₦2,000 and flags ₦503
unaccounted. Samuel corrected it tonight: he said 2,000 as shorthand and the
actual figure was **₦2,503**. This ledger is append-only, so THE 26 AUG ROW
STANDS AS WRITTEN — the correction lives here and in memory.md. Anything reading
the 26 Aug row for a balance should use ₦2,503. Nothing was withdrawn, nothing is
unexplained, and the 2026-08-26 scorecard's "₦503 unexplained" line was wrong.

**2026-08-27 — mirror backfill.** The 2026-08-26 reckoning row above says NOT
MIRRORED: that cloud session had no `.env` and no network path to Apps Script.
The row (₦1,000, Data / airtime, recharge card) is now on the Expenses tab,
written 2026-08-27 from this ledger. Nothing in the ledger was changed to do it.
Cause and fix: `tools/sheets/README.md` → "Cloud and phone". From now on an
unreachable bridge parks the batch in `context/sheet-queue.jsonl` instead of
leaving a note for a human to remember.
| 2026-08-28 | UNREPORTED | — | NOTHING OUT — his words: "No money spent" | 0 | Balance NOT given at this reckoning — spend list given, balance skipped. Last known ₦2,503 (27 Aug, verbally, unchanged since 26 Aug); NOT carried forward as fact, ask at the next reckoning. A zero-spend day: nothing moved because there is nothing to move. Route Rise August 70% (~$711.66 ≈ ₦971,416) invoiced and SENT 9:10am today — the one money act of the day and it landed. Payment still expected ~1–3 Sep, Lewis away till the 31st. Nothing to mirror to the sheet: no expense rows, no transfers. |
