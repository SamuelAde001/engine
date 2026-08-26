---
name: reckon
description: Evening reckoning — audits today against what I committed to.
---

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
2e. SLEEP. Ask what time he actually went to bed last night. Record it. If it is
    below the floor in context/body.md, say the number of hours and move on —
    do not lecture.
3. Compare. State the gap in one line. No preamble.
4. Score: SHIPPED (did the committed thing) / PARTIAL / MISSED.
5. If MISSED: quote the relevant line from context/stakes.md verbatim, then ask
   what specifically got in the way. Do not accept "I was busy" — ask what
   I was busy WITH.
6. If SHIPPED: one line of acknowledgement. One. Then move on.
7. Complete today's row in context/ledger.md.
7b. SCORECARD. Build the day's visual scorecard and publish it as an Artifact.
    Samuel screenshots it and sends it to his girlfriend — that is the accountability
    mechanism in context/stakes.md, and it is the only one with a third party in it.

    - THE URL IS FIXED. Always update the existing artifact, never publish a new one:

      https://claude.ai/code/artifact/6401a62e-c1d8-4ec2-8787-7d0a4794883d

      Write scorecard.html, then call Artifact with that URL passed as `url`.
      Publishing WITHOUT `url` from a fresh session creates a SECOND artifact and
      breaks his bookmark — and a bookmark he has to re-find is a bookmark he stops
      opening. Keep the <title> "Reckoning Scorecard" and the favicon stable.
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
   with today's date.
9. Commit and push (see REMOTE.md). If you skip this, the reckoning is lost.

Never reschedule anything. Never move a due date. The only thing you may change in
TickTick is ticking a task I explicitly confirmed in step 2b.

Under five minutes. This is a check-in, not an interrogation. Steps 2b-2e are
short questions with short answers. If the day needs a longer conversation, say
so and let him choose to have it — do not extend the reckoning unilaterally.
