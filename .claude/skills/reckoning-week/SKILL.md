---
name: reckoning-week
description: Weekly review — finds the pattern in the week's ledger and updates patterns.md.
---

0. READ LIST. This is the one heavy check-in and that is fine — but still targeted:
   - `tail -n 9 context/ledger.md` and `context/patterns.md` (whole)
   - `context/ledger-notes/<this month>.md` — the narrative behind the week's rows
   - `context/stakes.md` (step 6), `context/money-ledger.md` (step 9)
   - `bash tools/section.sh context/money.md "Monthly obligations" "Rules"` (step 9)
   - THIS WEEK'S domain file only (step 8). One. The other four wait their turn.
   Do not read memory.md or decisions.md whole — `tail -n 20` if you need recency.

1. Read the last 7 ledger rows and all of context/patterns.md.
2. Count: shipped / partial / missed.
3. Find the pattern. Not "you were inconsistent" — the actual mechanism.
   Which day of the week fails? Which category of task gets rescheduled?
   What time of day do commitments die? Cite specific ledger dates as evidence.
4. If this pattern already exists in patterns.md, say how many weeks running
   it's been true. That number is the message.
5. If it's new, append it to patterns.md with the evidence.
6. Check the forfeit conditions in context/stakes.md. State plainly whether one
   triggered. Do not soften this.
6b. THE CARD IS GONE — say what replaced it, and what did not.
    The nightly scorecard was dropped 2026-09-02 at Samuel's instruction. Do not ask
    how many he sent; there are none. Ask instead: DID ANYONE ELSE SEE THIS WEEK?
    stakes.md's mechanism needs a third party and the dashboard is not one — it is a
    site only he opens. If the answer is nobody, for two weeks running, put it to him
    as a finding: the accountability went back to self-policed on 2 September and
    nothing was put in its place.
7. Ask what changes next week. Take the answer. Append to memory.md.
8. DOMAIN SWEEP. One domain per week, on rotation: spirit, money, audience, body,
   people. Read that week's domain file. State the current number, whether the
   weekly minimum was met, and one thing to change. One domain only — the other
   four wait their turn. Record which domain was swept so the rotation advances.
9. MONEY WEEK. Sum context/money-ledger.md for the week. Compare against the
   obligations table in context/money.md. State: total in, total out, savings
   moved, and whether the month is tracking to the ₦1M-by-31-Dec target. If
   savings were withdrawn, quote his stated reason back to him.
10. CONTENT BLOCK TEST. Count how many times the afternoon content block was eaten
    by client work this week. Two or more means the afternoon override (26 Aug) is
    failing and the block goes back to mornings. State the count either way.
11. CONCENTRATION. One line, every week: whether course work was dropped for client
    work. Per context/money.md the course is the only income line Samuel controls —
    every drop trades diversification for concentration. Say it, do not soften it.
12. Commit and push (see REMOTE.md). If you skip this, the review is lost.

One paragraph of analysis maximum. The evidence does the work, not your prose.
