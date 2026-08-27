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

**2026-08-27 — mirror backfill.** The 2026-08-26 reckoning row above says NOT
MIRRORED: that cloud session had no `.env` and no network path to Apps Script.
The row (₦1,000, Data / airtime, recharge card) is now on the Expenses tab,
written 2026-08-27 from this ledger. Nothing in the ledger was changed to do it.
Cause and fix: `tools/sheets/README.md` → "Cloud and phone". From now on an
unreachable bridge parks the batch in `context/sheet-queue.jsonl` instead of
leaving a note for a human to remember.
