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
the old sheets that booked savings that never moved. | BUILT: Money-2026.xlsx on the
Desktop. Six tabs, Aug 2026 - Jul 2027. Verified in Excel, zero formula errors,
wiring tested end to end. Nothing is typed on Budget or Dashboard — Budget reads
actuals from Expenses by SUMIFS, so a budget line cannot claim money moved when no
row exists. Not committed to the repo: binary, changes daily; money-ledger.md stays
the text source of truth and wins any disagreement.

2026-08-26 — DECISION (Batch A): sleep floor is 7 HOURS, bed 10:30pm against the
5:30am wake. Course block is SUNDAY 5:00-7:30pm, two lessons per session, with
Sunday dinner moved. | BUILT: TickTick habit "Sleep by 10:30pm" (6a8ef0058f0804d720eb9be9),
daily from 1 Sep, reminder 10:15pm. Recurring "COURSE — record 2 lessons (2.5h)"
Sundays 5:00-7:30pm from Sun 6 Sep. All 11 Module 1 lessons dated Sun 6/13/20/27 Sep
and 4 Oct (two each) with LIVE EDIT 01 alone on Sun 11 Oct. body.md, habits.md and
audience.md updated. HARD STOP EXCEPTION recorded: 7:30pm is an hour past the 6:30pm
stop, sanctioned Sunday-only and non-client-work; if a weekday block cites it, that
is the rule eroding and it gets called the FIRST time.

2026-08-26 — DECISION (Batch B): the ₦3M for July 2027 is ON TOP of the ₦1M —
₦4,000,000 total. Emergency fund ₦300,000, funded from January 2027 AFTER the ₦1M
closes. Creator visits budgeted at ₦25,000/month. The ₦100,000/month investment
NEVER pauses, even if December is behind. | BUILT: money.md and people.md rewritten
with the new arithmetic; workbook updated with the creator-visit line and a GOAL 2
dashboard block, re-verified zero errors. THE FINDING: the creator-visit line moved
the ₦1M from a close to a coin flip (₦973k-₦1,107k against ₦1,000,000 from a ₦3,503
start), and the ₦3M-on-top needs ₦428,571/month against a ₦243k-₦277k surplus, which
is impossible at the August mix. Conclusion written into money.md and mission.md:
FROM JANUARY THE COURSE MUST CARRY ~₦170,000/MONTH or the July 2027 number does not
happen. Every skipped Sunday course block is a payment missed on that ₦1.2M.

2026-08-26 — DECISION (Batch C): Module 1 beta priced ₦10,000, rising at full launch.
Sold by a link, manual payment and access. Free community gets it free. Launch
CONFIRMED Friday 16 October 2026. | BUILT: TickTick launch task dated 16 Oct
(all-day); audience.md commercials table written. OBJECTION STATED ONCE AND NOT
RE-ARGUED: at ₦10,000, free to the 20 warmest people, fulfilled by hand, this is a
testimonial engine and not revenue — 17 sales/month would be needed to hit ₦170k.
The strategy holds only if testimonials are actually collected, and only if the FULL
COURSE PRICE is set before 16 Oct, since the beta price anchors it. That price is
now the load-bearing open question.

2026-08-26 — DECISION (Batch D): church media team is Sunday only, inside the
service — no schedulable time cost. All THREE daily check-ins stay: 7am / 3pm / 9pm.
| BUILT: spirit.md updated; no change needed to the routines in REMOTE.md.

2026-08-26 — DECISION (Batch E, THE FORFEIT — first real third-party mechanism in
the system): Claude Code generates a visual scorecard at every evening reckoning,
scoring the day. Samuel screenshots it and sends it to his girlfriend. His words:
"she is the best person to keep me accountable." | BUILT: reckon step 7b generates
and publishes the scorecard as an Artifact to the same URL nightly — score, what
shipped, what did not, every habit by name, bed time against the 10:30pm floor, and
the money row, with no softening and UNVERIFIED on anything he did not confirm.
reckoning-week step 6b asks how many days he actually sent it. stakes.md carries the
mechanism and the remaining gap: the card is generated regardless, but the sending
is still his choice, and a week with none sent means it has gone back to
self-policed.

2026-08-26 — DECISION: mission.md and stakes.md drafts APPROVED and applied at
Samuel's word. | BUILT: mission.md gained the income reality, the full course plan
and the IG/TikTok numbers with 5,000 marked AMBITION against the SMART version
(18 unbroken Wednesdays). stakes.md gained the scorecard mechanism and the
savings-rule section. The 2026-08-23 unenforced note was left intact — history, not
rewritten.

2026-08-26 — DECISION: the budget moves to Google Sheets ("My Claude Budget") and
Claude Code writes it directly. Samuel's reason: he does not want to type updates by
hand. | BUILT: the Google Drive connector can read a sheet but cannot write a cell,
and the Sheets API needs a Cloud project, so the bridge is an Apps Script web app
bound to the sheet — one paste, one deploy, generic primitives so it never needs
re-pasting. tools/sheets/{Code.gs, sheets.py, README.md}. Credentials in a gitignored
.env; the committed Code.gs carries a __SHEETS_TOKEN__ placeholder so the secret
never enters git history. Samuel proposed falling back to Excel-in-browser via the
Chrome extension when the first deploy 403'd; REJECTED and explained — browser
automation cannot fire from a cloud routine or his phone, which is the whole of
REMOTE.md. The 403 was one dropdown ("Who has access") set wrong. He fixed it.

2026-08-26 — DECISION: the Budget tab gets a Details tab behind it. Samuel's ask:
"I need to know what actually makes up each budget category." | BUILT: Details is
the only place a plan number is typed; Budget's plan column reads it with SUMIFS,
so a category total can always be broken down. Cancelled items go Active=No and are
never deleted — a subscription that reappears is a pattern, and a deleted row hides
it. Savings block added to Budget per his ask (building/Goal 1, Cowrywise, marriage,
emergency fund, buffer), reading Transfers, so a savings line cannot claim money
that never moved.

2026-08-26 — DECISION (his real numbers, first time the budget has been exact):
subscriptions are ₦73,560 not the ₦51k–84.5k guess — Claude 33,500 / Google 15,000 /
CapCut 14,900 / Rubik's 6,860 / YouTube 1,700 / Spotify 1,600. Then cut, same
session: Rubik's OUT, giving 20k→10k, feeding 50k→30k, transport 30k→20k,
personal/misc 50k→10k. Gym ₦30,000 ADDED from September. Obligations floor is now
**₦951,700**. | BUILT: plan.json, Details tab, money.md obligations table rewritten.
The finding worth keeping: his estimate and his truth differed by ₦5,940 — feeding's
₦150,000 did not become savings, it moved into transport, data, household, gym and
a misc line. Nothing got cheaper.

2026-08-26 — DECISION: the two paydays become the spine of the budget. Every line
item carries Payday A (70%, lands end of previous month, funds 1st–14th) or Payday B
(30%, lands ~14th, funds 15th–end), so expenses can be pushed to the back half when
the front is loaded — his own instinct, now on paper. Girlfriend MOVED to A (she
needs it for household essentials); community admin MOVED to B (he is paid
mid-month). | BUILT: Budget payday block, Details payday column. September proved it
immediately — Payday A came out ₦15,084 over, so giving and feeding moved to B.

2026-08-26 — DECISION: Rule 3 AMENDED and Rule 8 ADDED. Rule 3 was "savings move
first on the day the 70% lands"; Goal 1 now moves on Payday B at Samuel's request
(Payday A is always full), with an exception that any Payday A surplus over ₦50,000
moves the same day rather than sitting loose for a fortnight. Rule 8 creates the
BUFFER: ₦50,000/month to ₦200,000, fed also by underspend and by any 4-video month's
excess, and it — not savings — is where urgencies come from. The lean-month cut
order is decided in advance: personal/misc → creator visits → household to ₦20,000 →
buffer → only then a conversation. | BUILT: money.md rules, Setup tab, Budget lean
ladder. The argument that carried it: at a 2-video month he is ₦141,709 underwater
and the discretionary cuts only free ₦55,000 — with Rule 1 forbidding savings and
Rule 7 forbidding a Cowrywise pause, the buffer is the only legal way to balance
that month.

2026-08-26 — DECISION: Samuel's cuts moved the December verdict from ₦227 of margin
across four months to ₦1,207,667 against the ₦1M — closing at ₦1,007,667 after
₦200,000 goes to the buffer. | BUILT: money.md "Does the ₦1M close?" rewritten.
Worth recording once: this is the first time the arithmetic moved because he changed
behaviour rather than because income moved.

2026-08-26 — FACTS ADDED, not previously in the engine: (a) he has a SON with his
girlfriend, whose money rides inside her allowance — which is why the allowance
varies; September carries +₦50,000 for school. OPEN: termly or one-off? (b) he owes
his SISTER ₦90,000; ₦40,000 goes in September, ₦50,000 is undated ("anytime I am
free with more funds"). money.md's "loans all cleared" was wrong and is corrected.
(c) Route Rise does not pay at weekends — a payday on a Saturday lands Monday night.
Oct 70% slips Sat 31 Oct → Mon 2 Nov and Nov 30% slips Sat 14 Nov → Mon 16 Nov,
making early November the tightest point of the year. | BUILT: people.md, money.md,
Budget payday calendar.

| 2026-08-27 | Samuel (Claude Code) | The budget sheet must be writable from the cloud and the phone, not just this desktop. Two blockers found: `.env` is gitignored so cloud clones have no credentials, and Apps Script is not on the cloud "Trusted" network allowlist (`/exec` also 302s to `script.googleusercontent.com`). Fix is one-time cloud-environment config — Custom network access plus the three `SHEETS_*` variables. Backed by a queue: `--queue` parks undeliverable batches in `context/sheet-queue.jsonl`, `flush` replays them from wherever the bridge is reachable, `doctor` names the broken link. The 2026-08-26 unmirrored row was backfilled. | BUILT |
