# Money

## SMART goal

- **₦1,000,000 saved and still there on 31 Dec 2026** — the money that moves him
  into the new house.
- **₦3,000,000 more by 31 July 2027** — marriage. Confirmed 2026-08-26 as **ON TOP
  of the ₦1M, not inclusive. ₦4,000,000 total.**
- **Emergency fund ₦300,000** — funded from January 2027, **after** the ₦1M closes.
  His call: it does not compete with the December target.
- **Building project funded at ₦500,000 every month, no shortfall.**

The investment pot does NOT count toward any of these. See Rule 7.

## Current number (as of 2026-08-26)

| Pot | Amount | Notes |
|---|---|---|
| Bank (liquid) | **₦3,503** | everything he can actually spend today |
| Emergency fund | **₦0** | does not exist yet |
| Cowrywise investment | **₦305,000** | locked, ring-fenced, +₦100,000/month to year end |
| **Available for goals** | **₦3,503** | |

August income: **₦1,109,987** — of which ~₦200,000 was a savings withdrawal, not
income. **Real August income ≈ ₦910,000.**

Projected investment balance 31 Dec 2026: ₦305,000 + (Sep–Dec × ₦100,000) = **₦705,000**.
It does not pay out until January 2027, when he moves it into actual stocks.

## The one lever

**Monthly surplus that survives the month.** Not income — surplus that is still
there on the 30th. Income doubled and halved across three months and the savings
balance did not move, which proves income was never the lever.

## Weekly minimum

Every naira in and out logged daily. **Zero unlogged days.** Seven rows in
`context/money-ledger.md` every week.

## Cost of breaking it

`[OPEN — no enforced forfeit exists. Asked 2026-08-26. See stakes.md.]`

## How it is verified

Bank balance screenshot sent to Claude Code at the evening reckoning, **plus a
spoken account of what went out that day.** A screenshot with no spend list is
not verification — it shows the number, not the decisions.

**The workbook:** Google Sheets — **"My Claude Budget"**, moved there 2026-08-26 so
Claude Code can write it directly instead of Samuel typing updates by hand. Tabs:
Dashboard, Setup, Income, Expenses, Transfers, Budget, Details. Covers Aug 2026 –
Jul 2027, so it reaches both targets.

`context/money-ledger.md` stays the text source of truth. The sheet is the
budgeting layer; the ledger is the record. **If the two disagree, the ledger wins.**

Claude writes it through `tools/sheets/` — an Apps Script web app bound to the
sheet. Setup and security are in `tools/sheets/README.md`; the credentials live in
a gitignored `.env`. The line items behind every category live in
`tools/sheets/plan.json`, and `tools/sheets/build_budget.py` rebuilds the Budget
and Details tabs from it.

Design point, straight out of the June–August failure: **nothing is typed on the
Budget or Dashboard tabs.** Budget's plan column reads Details, its month columns
read Expenses, and its savings block reads Transfers — all via SUMIFS. A budget
line cannot claim money moved when no row exists. That was the whole bug in the
old sheets.

**The Details tab** answers "what is this category actually made of" — every
subscription, every line, with its amount, due day, tier and payday. It is the only
place a plan number is typed. Cancelled items go Active=No; they are never deleted,
because a subscription that reappears in three months is a pattern and a deleted
row hides it.

---

## Income mechanics

- Paid in **USD**, converted to NGN on **Cleva**. Observed average June–August
  ≈ **₦1,365/$**. Rate moves with the market.
- Client pays **monthly in two stages: 70% at month end, 30% mid the following
  month.** The mid-month invoice is always the remainder of the previous month's
  batch — never a new batch. Every "mid-month payment" is last month's money.
- **Route Rise Media LTD is an AGENCY, and it is his only payer.** Corrected by
  Samuel 2026-08-27. Route Rise works with two end clients; Samuel edits for both
  and sends **one invoice to Route Rise covering both**. There is no second client
  and there never was — the earlier "second client" line in this file was wrong.
- **Rates: $333.33/video** on the original end client — he has tried to raise it,
  they will not move, he is content with it. **$175/video** on the second end
  client, new August 2026, 2 videos agreed, may or may not recur. Both rates are
  set by Route Rise.
- **One payer, one invoice, one relationship.** If Route Rise goes, 100% of his
  income goes with it — including the "$175 client", which is not a separate
  relationship he could keep.
- **He does not want more clients.** His reason: one client's workload is already
  high. His call. Not to be re-litigated at every check-in — but read the
  concentration risk below before advising on anything income-shaped.

## Verified batch history

| Batch | Videos | Notes |
|---|---|---|
| May | 5 | invoiced 06/14 |
| June | 4 | invoiced 06/29 (70%) + 07/14 (30%) |
| July | 2 | invoiced 07/29 (70%) + 08/14 (30%) |
| August | 4 | 2 × $333.33 + 2 × $175 = **$1,016.66 ≈ ₦1,387,741** — ONE Route Rise invoice covering both end clients |

August lands as: **70% ≈ ₦971,416 at month end**, **30% ≈ ₦416,325 mid-September.**

## Cash actually landing per calendar month

| Month | Income |
|---|---|
| June | ₦2,273,189 |
| July | ₦1,791,800 |
| August | ₦1,109,987 (~₦910,000 real — ₦200k was savings) |

**Income has halved in two months.** This is the single most important number in
the system.

## Monthly obligations — exact, from 2026-08-26

Samuel gave the real line items. They are on the Details tab and in
`tools/sheets/plan.json`. **Payday** is which half of the month pays it — see
"The two paydays" below.

| Item | Amount | Tier | Payday |
|---|---|---|---|
| Building project | ₦500,000 | Fixed | A |
| Parents | ₦100,000 | Committed | A |
| Girlfriend allowance | ₦100,000 | Committed | A |
| Subscriptions | ₦66,700 | mixed | split |
| Chores / household | ₦40,000 | Discretionary | B |
| Health — gym | ₦30,000 | Committed | A |
| Feeding | ₦30,000 | Committed | B |
| Creator visits (network) | ₦25,000 | Discretionary | B |
| Transport | ₦20,000 | Committed | B |
| Community admin salary | ₦15,000 | Fixed | B |
| Giving | ₦10,000 | Committed | B |
| Personal / misc | ₦10,000 | Discretionary | B |
| Data / airtime | ₦5,000 | Committed | B |
| **Obligations floor** | **₦951,700** | | |
| Investment contribution | ₦100,000 | Fixed | A |
| **Total committed outflow** | **₦1,051,700 / month** | | |

Subscriptions, exactly: Claude ₦33,500 (16th) · Google ₦15,000 (2nd) · CapCut
₦14,900 (4th) · YouTube Premium ₦1,700 (17th) · Spotify ₦1,600 (5th). Rubik's cube
₦6,860 **cut 2026-08-26**. YouTube and Spotify kept — his words: they help his work,
and they are his only entertainment.

**The estimate was ₦1,044,500. The truth is ₦1,038,560 once personal/misc is
counted — a difference of ₦5,940.** Nothing got cheaper. Feeding's ₦150,000 did not
become savings, it moved house: into transport, data, household, the gym, and a misc
line that did not exist before. That is worth remembering the next time a category
looks like it has slack in it.

Changed 2026-08-26 at his instruction: giving ₦20,000→₦10,000 ("only when someone
asks" — `spirit.md` records no tithe commitment, so nothing pulls against it);
feeding ₦50,000→₦30,000 (his sister feeds him); transport ₦30,000→₦20,000;
personal/misc ₦50,000→₦10,000. Gym ₦30,000 **added**, starting September — he is
resuming it. **The gym is not a line to raid.** It is the one item on this list
that pays him back.

Creator visits added 2026-08-26 at ₦25,000/month, his number. It is a real line now,
not a good intention — and it cost the December target ₦100,000 across four months.
That trade is stated below, not hidden.

## The two paydays

One batch, two dates. This is now the spine of the budget.

| | Payday A — 70% | Payday B — 30% |
|---|---|---|
| Lands | end of the **previous** month | around the **14th** |
| Funds | the 1st – 14th | the 15th – month end |
| Expected in | ~₦971,416 | ~₦416,325 |
| Committed | ₦861,500 | ₦190,200 |
| **Free** | **₦109,916** | **₦226,125** |

The 30% is always the previous month's remaining batch, never a new one.

**They do not pay at weekends.** If a payday falls on a Saturday or Sunday the money
lands the following Monday night. Two slips are already on the calendar:

- **Oct 70%: Sat 31 Oct → Mon 2 Nov.** The tightest point of the year. November's
  front half is funded on the 2nd, and Google bills on the 2nd, CapCut the 4th.
- **Nov 30%: Sat 14 Nov → Mon 16 Nov.**

Both are on the Budget tab's payday calendar.

Removed and no longer owed:

- **Editor (₦50k) and workers (₦100k) — cut.** His words: *"it was financially
  unwise at that moment and it takes time to manage them too... no one can edit my
  style of videos yet, I need to make my content my style before hiring any."*
  Only the ₦15k community admin stands.
- **HighSignals devs — ₦0.** Paid ₦150k in July; they have since agreed to work
  free because August was low. They are friends. Nothing owed. He intends to sort
  them out when Scripnals launches.
- **Commercial loans — all cleared.** Okash, FairMoney, bank loan. Gone. Do not
  carry forward.

**But one debt is live, added 2026-08-26: he owes his sister ₦90,000.** ₦40,000 goes
in September on Payday B. **₦50,000 remains, with no date on it** — his words: "can
hold for anytime I am free with more funds, no deadline." She is not pressing, so it
is not scheduled. It is written down here anyway, because an undated debt is the
kind of thing that ambushes a month, and because "when I have more funds" is the
same sentence that moves due dates. Bring it up the first month that closes with the
buffer full.

## The savings hole

June–August the sheets booked **₦750,000 to Savings** and **₦150,250 to Emergency
funds** — **₦900,250 total.**

What actually survives:

| | |
|---|---|
| Booked to savings/emergency | ₦900,250 |
| Survives, as the Cowrywise investment | ₦305,000 |
| **Gone** | **₦595,250** |

His words on the ₦595,250: *"unplanned event came in and I used all the money
saved."* The August building payment dropped from ₦500,000 to ₦200,000 as a direct
consequence — a **₦300,000 shortfall** on the one obligation that is the entire
point of the ₦1M target.

A third of it became a real asset. Two thirds evaporated because no rule existed
saying what savings are for. That is the fix — not a tighter budget.

## Does the ₦1M close?

Starting balance ₦3,503. Four months: September, October, November, December.

**Recalculated 2026-08-26 on his real line items, and it is materially better.**

| Scenario | Gross / month | After ₦951,700 + ₦100k investment |
|---|---|---|
| August mix (2×$333 + 2×$175) | ₦1,387,741 | **₦336,041** |
| 4 × $333.33 | ₦1,819,982 | ₦768,282 |
| 2 videos / month | ₦909,991 | **−₦141,709 — underwater** |

At the August mix, with September's ₦140,000 of one-offs (son's school ₦50,000,
Kaduna ₦50,000, sister ₦40,000):

```
Sep      196,041   one-offs eat 140,000
Oct      336,041
Nov      336,041
Dec      336,041
─────────────────
       1,204,164  + 3,503 opening  =  1,207,667
```

**₦1,207,667 against a ₦1,000,000 target.** Take ₦50,000/month for the buffer
(₦200,000) and **Goal 1 closes at ₦1,007,667** with a funded cushion standing
behind it.

That margin is only ₦7,667, and that is the right trade. ₦207,000 of margin with no
buffer means the first urgency in October gets paid out of savings — which is
exactly how ₦595,250 disappeared. Margin has never stopped a raid. A buffer does.

Before his 26 Aug cuts this cleared December by **₦227 across four months.** The
cuts — giving, feeding, transport, personal/misc, the Rubik's sub — are what turned
a coin flip into a plan with a cushion. Worth saying once: that was his own doing,
and it is the first time the arithmetic has moved because he changed behaviour
rather than because income moved.

**2 videos/month is what July was.** It is already visible in the building payments.
At that mix he is ₦141,709 underwater every month, and steps 1–3 of the lean ladder
only free ₦55,000 of it. The buffer is the only legal answer — Rule 1 forbids
savings, Rule 7 forbids pausing Cowrywise. That is not a hypothetical: it is why
Rule 8 exists.

### Goal 2 — and this is the real problem

Samuel confirmed 2026-08-26: **the ₦3M is ON TOP of the ₦1M. ₦4,000,000 total.**

Jan–July 2027 is seven months. ₦3,000,000 over seven months is **₦428,571/month.**

| At this mix | Surplus/month | Against ₦428,571 |
|---|---|---|
| August mix | ₦243,000–₦277,000 | **SHORT by ₦152,000–₦186,000, every month** |
| 4 × $333.33 | ₦675,000–₦709,000 | clears it |

**At the August mix the ₦3M is arithmetically impossible.** Not tight — impossible.
It closes only if 4-video months become the norm, or the course earns.

And per the concentration risk below, **4-video months are not his decision.** Route
Rise sets the volume. Which leaves exactly one lever he owns:

> **From January the course has to carry roughly ₦170,000/month — about ₦1.2M across
> the seven months — or the July 2027 marriage number does not happen.**

That is the whole argument for the course, in one line, with a number attached. Every
Sunday the 5:00pm course block gets skipped is a payment missed on that ₦1.2M. The
weekly review says so.

The rate mix costs real money: 2 videos at $175 instead of $333.33 is **$316.66
lost on this batch alone (~₦432,000)**. Same payer, two rates — so that discount
is Route Rise's pricing on one of its end clients, not a separate client he could
walk away from.

## The concentration risk

One PAYER. Not one client — one payer. Route Rise is an agency; the two end
clients behind it are Route Rise's relationships, not his. Volume decided entirely
by Route Rise. Both rates set by Route Rise. One invoice a month.

**Corrected 2026-08-27.** This file used to carry a "second client" line that read
like the beginnings of diversification. It was not. The concentration is total:
100% of income arrives through one invoice to one company, and the "$175 client"
does not survive Route Rise leaving.

**"Hit 4 videos a month" is not a SMART goal** — the A fails. Achievement is
another company's decision, not his.

He has ruled out taking more clients. That is his call. But it means the course is
no longer the "#2 thing" — **it is the only income line whose existence he
controls.** Every time course work gets dropped for client work, that is the
diversification being traded away for the concentration.

The weekly review says so, out loud, every week.

## Rules

```
1. Savings are untouchable. The only permitted withdrawals are: medical emergency,
   building-project shortfall that would stop work, and family emergency. Nothing
   else. A girlfriend's visit is not an emergency.
2. Any withdrawal from savings gets logged the same day in context/money-ledger.md
   with the amount and the reason, in Samuel's own words. No silent withdrawals.
3. Savings move ON A PAYDAY, the day the money lands — never at month end. Money
   saved at the end of the month is money that was never saved.
   Cowrywise moves on Payday A. Goal 1 and the Buffer move on Payday B — Samuel's
   call 2026-08-26, because Payday A is nearly always full.
   EXCEPTION: if Payday A leaves more than ₦50,000 free after its commitments,
   that excess moves the same day. Six figures sitting loose for fourteen days is
   how ₦595,250 disappeared.
4. Building project is paid in full (₦500,000) before any discretionary line.
   August was ₦200,000. That is a shortfall of ₦300,000 and it is on the record.
5. No new work below $333/video — whether it is a new Route Rise end client or a
   new payer — without logging the reason in money-ledger.md. The August batch
   lost ~₦432,000 to the $175 rate.
6. A budget line that says money was saved when no money was saved is a lie in a
   spreadsheet. The daily ledger is the truth; the spreadsheet is a plan.
7. The investment is ring-fenced. ₦100,000/month goes to Cowrywise until the year
   ends. It is not touched for the ₦1M, the ₦3M, the building, or anything else.
   New savings and the emergency fund are built OUTSIDE it. It does not pay out
   until January 2027, when it moves into actual stocks. Samuel's rule, 2026-08-26.
8. THE BUFFER is where urgencies come from — not savings. ₦50,000/month to a
   ₦200,000 target, plus any month-end underspend, plus the whole excess of any
   4-video month. When a month lands short, the cut order is already decided:
   personal/misc → creator visits → household down to ₦20,000 → the buffer covers
   the rest → and ONLY THEN a conversation. If the buffer is empty, an urgency
   gets negotiated, not funded. It never gets funded from Goal 1.
```

**Said once about Rule 7, and not to be re-argued:** he is putting ₦100,000/month
into a locked pot he refuses to count toward his goals, while holding ₦3,503 liquid
and a ₦1M target with ₦70k of margin. That is a deliberate trade — long-term wealth
bought with short-term fragility. It is his call. It is written down so that if
December comes up short, the reason is on the record and not a mystery.

## Open questions

**Answered 2026-08-26:**

- ~~₦3M on top or inclusive?~~ **ON TOP. ₦4,000,000 total by 31 July 2027.**
- ~~Emergency fund?~~ **₦300,000, funded from January 2027, after the ₦1M closes.**
- ~~Creator visits budget?~~ **₦25,000/month.** Now a line in the obligations table.
- ~~Does the investment pause if the ₦1M is behind in November?~~ **No. It never
  pauses.** Ring-fenced in both directions, no escape hatch. Stated once: this means
  if December is short, the house move slips rather than the contribution. His trade,
  made with the numbers in front of him.

**Still open:**

- Wedding July 2027: total budget, and who pays which part? `[OPEN — asked 2026-08-26]`
- What is the enforced consequence for breaking the savings rule? `[OPEN — unenforced]`
- What does the course have to be priced at to carry ₦170,000/month from January?
  Depends on the beta price, which is still open in `context/audience.md`. `[OPEN]`
