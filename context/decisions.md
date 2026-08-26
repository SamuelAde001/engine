# Decisions log (append-only)

What came out of brainstorming in the Claude PA project and what got built from it.
Newest at the bottom. Never rewrite a row — correct it with a new one.

Format:
`YYYY-MM-DD — DECISION: <what was decided> | BUILT: <what Claude Code did, or PENDING>`

---

2026-08-24 — DECISION: split the engine in two — Claude Code operates, the Claude
project on claude.ai brainstorms; both read the same repo. | BUILT: tools/bundle.sh
generates PA.md, PROJECT.md holds the project instructions, this log carries
decisions back.

2026-08-26 — DECISION: engine expands from task/deadline tracking to full
life coverage across five domain files (spiritual, money, audience, body,
people), each carrying a SMART goal, current number, single lever, weekly
minimum, cost of breaking it, and an explicit verification method. Daily
check-in stays under five minutes; domains sweep weekly on rotation rather
than being interrogated daily. Design happens this week, build happens
Sunday 30 Aug — never on top of the live client deadline.
| BUILT: PENDING — full spec being written in the Claude project.

2026-08-26 — DECISION: five-domain expansion BUILT. context/spirit.md, money.md,
audience.md, body.md, people.md created, each with SMART goal, current number,
lever, weekly minimum, cost and verification method. money-ledger.md added for
daily every-naira logging. Domains sweep one per week at the weekly review; the
daily reckoning stays under five minutes. | BUILT: all five domain files plus
money-ledger.md written. CLAUDE.md Files list and Hard rules updated. reckon
gained steps 2d (money) and 2e (sleep) and a five-minute ceiling; reckoning-week
gained steps 8-11 (domain sweep, money week, content block test, concentration);
plan-week rewritten for the one-video target, the course cadence question and the
full anchor list. New skill .claude/skills/month/SKILL.md for the month-end close.
Built 6 days early — 26 Aug, not the planned Sunday 30 Aug.

2026-08-26 — DECISION: content block moves from morning to AFTERNOON (2:00-4:00pm)
at Samuel's instruction, reversing the same-day morning-block design rule. The
objection was stated and overruled. Test condition: if the afternoon block is
eaten by client work twice in one week, it goes back to mornings. The weekly
review states the count every week. | BUILT: all five recurring content-machine
tasks in 📽Content Creation moved to 2:00pm — Thu ideation 2-3pm, Fri script
2-4pm, Sat film 2-5pm, Mon edit 2-5pm, Tue finish/bank 2-4pm. Dates untouched,
time-of-day only. Wed PUBLISH left at 6:45-7:00pm. Saturday and Monday are 3h
against a 2h window and take the first hour of client block 2 — written into
audience.md and body.md, not hidden. The three one-off CONTENT #1 tasks (31 Aug,
1 Sep, 2 Sep) carry real dates and were NOT moved — asked instead.

2026-08-26 — DECISION: Called to Edit ships GRADUALLY by module, not as one launch.
37 lessons, 2 recorded, 35 remaining at ~70 min each. Cadence 2 lessons/week
(~2.5h). Module 1 (11 remaining lessons through LIVE EDIT 01) beta-launches
mid-October; full course completes early January 2027 at that cadence. The
original full-course-by-October plan was rejected as arithmetically identical to
the 25 Aug death march. | BUILT: 11 Module 1 lesson tasks plus a "Module 1 beta
launch" task created in Course recording, all UNDATED — dates blocked until
Samuel names the course block day. Module table and the 41-hour arithmetic
written into context/audience.md. 16 Oct launch date proposed, not confirmed.

2026-08-26 — DECISION: gym 3×/week, 7:00-8:20am (gate opens 7am), floor of 2,
from 1 Sep. Costs ~1.5h of client morning per gym day, ~4.5h/week, accepted
knowingly. | BUILT: TickTick habit "Gym" created (id 6a8eec9b8f0800ee1524083a),
weekly Mon/Wed/Fri, targetStartDate 20260901. Recurring task "💪 Gym — 7:00-8:20am"
created in 💓health, Mon/Wed/Fri, first occurrence Wed 2 Sep. The Sleep habit was
NOT created — Samuel has not given his sleep floor. Not invented.

2026-08-26 — DECISION: money accountability is now daily. Bank balance screenshot
plus a spoken spend list at every reckoning, written to context/money-ledger.md.
Savings are untouchable outside three named emergencies; any withdrawal is logged
same-day with his reason. Trigger: ₦900,250 was booked to Savings/Emergency across
June-August and none of it survives; the August building payment dropped from
₦500k to ₦200k as a result. | BUILT: money.md and money-ledger.md written, reckon
step 2d added, month skill created. CORRECTION TO THIS DECISION, from Samuel the
same day: ₦305,000 of the ₦900,250 DOES survive — it is the Cowrywise investment,
funded at ₦100,000/month. ₦595,250 is what is actually gone. The build used his
numbers, not the spec numbers.

2026-08-26 — DECISION (Samuel, correcting the build spec): the Cowrywise investment
is ring-fenced. Balance is ₦305,000, not ₦400,000. He keeps funding it at
₦100,000/month until the year ends (~₦705,000 by 31 Dec). It does not pay out
until January 2027, when it moves into actual stocks. New savings and the
emergency fund are built OUTSIDE it, and it is never spent on the ₦1M or the ₦3M.
Liquid bank balance at the build: ₦3,503. | BUILT: money.md Rule 7, CLAUDE.md hard
rule, month skill step 5, money-ledger.md note column. The goal arithmetic was
recomputed with the ₦100k/month contribution treated as committed outflow: ₦1M by
31 Dec now closes with ₦70k-₦210k of margin across four months, not comfortably.
Said once and not re-argued.

2026-08-26 — DECISION: Claude Code becomes the primary interface. Samuel is moving
day-to-day conversation, brainstorming and planning into Claude Code rather than
alternating between two Claudes. The Claude project on claude.ai remains as an
occasional deeper-thinking layer reading the same bundle. | BUILT: CLAUDE.md and
PROJECT.md updated.

2026-08-26 — DECISION: Samuel lives in ABUJA, not Lagos. Engine had it wrong from
the build. | BUILT: CLAUDE.md and PROJECT.md corrected, memory.md appended.
Timezone unchanged (WAT, UTC+1) so no schedule changed.

2026-08-26 — DECISION: Samuel asked for a real budgeting and logging spreadsheet —
income, budget lines logged when they actually pay, and daily expenses — to replace
the old sheets that booked savings that never moved. | BUILT: see the report; the
workbook is the companion to context/money-ledger.md, which stays the source of
truth for what actually happened.
