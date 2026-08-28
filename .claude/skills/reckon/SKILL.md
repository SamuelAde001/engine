---
name: reckon
description: Evening reckoning — audits today against what I committed to.
---

0. READ ONLY THESE. A whole-context read here costs ~32k tokens for a five-minute
   check-in; these cost about 2k and contain every rule this skill enforces.
   - `tail -n 4 context/ledger.md` — today's row and the days behind it
   - `context/habits.md` (small, whole) — the habit names for step 2c
   - `bash tools/section.sh context/body.md "Sleep"` — the floor for step 2e
   - `bash tools/section.sh context/money.md "Rules"` — Rule 2 for step 2d
   - `tail -n 5 context/money-ledger.md` — the opening balance to check against
   Read `context/stakes.md` ONLY if the verdict lands on MISSED (step 5), and
   `context/ledger-notes/` only if he asks about a past day. Never read mission.md,
   decisions.md, memory.md whole, or the other four domain files at a reckoning.

1. Read today's ledger row for what I committed to this morning. If there's no row
   for today, say so plainly and ask what I did instead of committing.
2. Pull what actually closed in TickTick today, plus habit check-ins and focus time.
   If the TickTick tools are not available in this session, say so in one line, skip
   steps 2b and 2c's ticking, and take his report verbatim into the ledger marked
   UNVERIFIED. Do not pretend you checked.
2b. Read the open tasks that were due today and ask me, item by item, which ones I
   actually completed. Tick the ones I confirm — use complete_task. Do not tick
   anything I did not confirm. Do not tick anything not due today.
2c. Ask me the habit checks for today by name (see context/habits.md). Record what I say.
2d. MONEY. Ask for today's bank balance screenshot and for what went out today,
    item by item. Take the amounts in his own words. Write one row into
    context/money-ledger.md. If he sends a screenshot with no spend list, say so
    and ask for the list — a balance alone is not verification. If he skips it,
    write the row with balance UNREPORTED. Do not fill it in from memory.
    Then mirror it into the budget sheet: one row per item that left the account,
    appended to the EXPENSES tab via `python tools/sheets/sheets.py`, categorised
    against the Setup category list. Money that moved to or from a pot goes on
    TRANSFERS instead, not Expenses — and a "From pot" row with no reason in his
    own words is money.md Rule 2 broken; get the reason.
    The ledger is written first and is the source of truth. The sheet is the mirror.

    Send the batch with `--queue "reckoning <date>"`. That way it works the same
    from the desktop, a cloud routine or the phone: if the bridge is reachable it
    writes; if it is not, the batch is parked in `context/sheet-queue.jsonl` and
    committed, and the next session anywhere that can reach the bridge sends it.
    Before mirroring, run `python tools/sheets/sheets.py flush` so anything an
    earlier offline session parked goes in tonight. If the bridge is down, say so
    in ONE line plus what `doctor` says, and move on. Never skip the ledger
    because the sheet failed, and never call the mirror done when it was queued.
2e. SLEEP — FORWARD ONLY. Do NOT ask what time he went to bed last night. At 9pm
    that question is unanswerable: the night in question has either already been
    recorded at the morning brief, or has not happened yet. Samuel's correction,
    2026-08-27: "the best time to ask about night is in the morning, not before
    bed." The BRIEF now asks what time he actually got to bed (brief step 6b) and
    that answer fills the previous day's ledger row.
    What the reckoning asks instead, in one line: **"What time are you in bed
    tonight?"** Take the number, hold him to the 10:30pm floor in context/body.md,
    and if his answer is later than the floor say the hours it leaves him against
    a 5:30am wake — one sentence, then move on. Do not lecture.
    Write his intended time into the ledger row's bed cell as a target; the brief
    replaces it with what actually happened.
3. Compare. State the gap in one line. No preamble.
4. Score: SHIPPED (did the committed thing) / PARTIAL / MISSED.
5. If MISSED: quote the relevant line from context/stakes.md verbatim, then ask
   what specifically got in the way. Do not accept "I was busy" — ask what
   I was busy WITH.
6. If SHIPPED: one line of acknowledgement. One. Then move on.
7. Complete today's row in `context/ledger.md`. It is a SCOREBOARD row — keep every
   cell short enough to scan: what was committed, what shipped, focus, habits n/5,
   bed time, verdict. If the day needs explaining, the explanation goes in
   `context/ledger-notes/<YYYY-MM>.md` under a `## <date>` heading, NOT into the row.
   A ledger row that grows into a paragraph is a row nobody rereads.
7b. SCORECARD. Build the day's visual scorecard and publish it as an Artifact.
    Samuel screenshots it and sends it to his girlfriend — that is the accountability
    mechanism in context/stakes.md, and it is the only one with a third party in it.

    - YOU WRITE THE DATA, NOT THE HTML. Write `context/scorecard-day.json` — about
      thirty lines — then run:

      ```bash
      python tools/scorecard/build.py
      ```

      That renders `scorecard.html` from the frozen template in `tools/scorecard/`.
      NEVER hand-write or edit scorecard.html. It is 450 lines; typing it out costs
      more than the rest of the reckoning combined, and it is generated output.
      If the card needs a new kind of row or a style change, change the template
      or `build.py` — that is a one-time cost, not a nightly one.

      The day file's shape (see the committed example for a full one):
      `date`, `sub`, `score`, `score_of`, `verdict`, `verdict_class` (won/lost/open),
      `ratios[]`, `committed[]`, `habits[]`, `red_title`, `red[]`, `cells[]`, `quote`.
      Every row takes `state`: `pass` | `part` | `miss` | `null`.

    - THE URL IS FIXED. Always update the existing artifact, never publish a new one:

      https://claude.ai/code/artifact/6401a62e-c1d8-4ec2-8787-7d0a4794883d

      Call Artifact on `scorecard.html` with that URL passed as `url`. Publishing
      WITHOUT `url` from a fresh session creates a SECOND artifact and breaks his
      bookmark — and a bookmark he has to re-find is a bookmark he stops opening.
      The <title> "Reckoning Scorecard" and the favicon live in the template and
      stay stable on their own.
    - It carries, every day: the date, the day's score and verdict, what shipped,
      what did not, each habit hit or missed by name, bed time against the 10:30pm
      floor, and the money row (balance + what went out).
    - NO SOFTENING. If the day was a 0, the card says 0. If a habit broke, it is
      red. The card is worthless as accountability if it flatters him — the whole
      point is that someone else reads it.
    - Only put on the card what he confirmed in steps 2b-2e. Anything unconfirmed
      is marked UNVERIFIED, not omitted and not assumed.
    - Give him the URL and say plainly: screenshot it and send it.

    If a week passes with no scorecards sent, the mechanism has quietly gone back to
    being self-policed. The weekly review says so.
8. If anything is worth remembering long-term, append it to context/memory.md
   with today's date. APPEND ONLY — never read the whole file to do it. Use
   `tail -n 15 context/memory.md` if you need recent context, or grep for a keyword.
   The file only grows; reading it whole gets more expensive every single day.
8b. REBUILD THE SITE. One command, after the ledger row is written:

    ```bash
    python tools/site/build.py
    ```

    That regenerates `site/data/os.json` and `os.js` from `context/`. Samuelsignals
    OS is a VIEW of the record — it is never hand-edited, the same way
    scorecard.html is never hand-edited. If a number on the site looks wrong, the
    fix is in `context/`, and then this command.

    It prints the day count and the last score. **Read that line back to yourself:
    if the score it prints does not match the verdict you just wrote, the ledger
    row is malformed and the parse silently dropped something.**

9. Commit and push (see REMOTE.md) — the ledger, the money ledger, AND
   `site/data/`. If you skip this, the reckoning is lost and the site is a day stale.

Never reschedule anything. Never move a due date. The only thing you may change in
TickTick is ticking a task I explicitly confirmed in step 2b.

Under five minutes. This is a check-in, not an interrogation. Steps 2b-2e are
short questions with short answers. If the day needs a longer conversation, say
so and let him choose to have it — do not extend the reckoning unilaterally.
