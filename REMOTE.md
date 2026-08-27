# Running the PA from the phone

The engine lives in a private GitHub repo. That is what makes it portable —
every check-in, every ledger row and every memory line is in the repo, so a
session on the phone and a session on the desktop are looking at the same state.

## Rule for every remote session

**Anything written to `context/` must be committed and pushed before the session
ends, or it never happened.**

```bash
git add -A && git commit -m "<check-in>: <date>" && git push
```

Desktop sessions: `git pull` before any check-in. If you skip the pull you will
overwrite what the phone wrote.

## The channels

**1. Scheduled routines — the PA reaches out**

Three cloud routines fire on their own. They do not need the laptop on.
Each one opens a session at claude.ai/code and stops with a question waiting.
Samuel opens it on his phone and answers there.

| Routine | Fires (WAT) | Runs | Model | Routine id |
|---|---|---|---|---|
| Morning brief | 7:03am daily | `brief` | opus-4.8 | `trig_017jmYaxhXS8fzSvPqcbKo28` |
| Midday checkpoint | 2:57pm daily | `midday` | sonnet-5 | `trig_016aJvRJSfsffXpzJrQzBv1M` |
| Evening reckoning | 9:03pm daily | `reckon` | opus-5 | `trig_014S2QR2QWBjj1WYLVQhgC1z` |
| Weekly review | 7:57pm Sunday | `reckoning-week` | opus-5 | `trig_01S1iyrdZctdL7WNhGPBNokF` |

Odd minutes are deliberate — they keep the runs off the crowded o'clock marks.
The morning brief runs opus-4.8, not opus-5: early-morning demand for opus-5 is
high and the 7am run was getting auto-downgraded anyway (2026-08-24).

Manage them at https://claude.ai/code/routines

There is also a disabled `Connector probe (diagnostic)` routine. Leave it. It's the
fastest way to check whether TickTick, Gmail and repo push still work from the cloud
when something breaks.

## Repo

`https://github.com/SamuelAde001/engine` (private). Cloud runs clone it to
`/home/user/engine`. Push from the cloud is verified working (2026-08-23).

**2. Claude Code on the phone — Samuel reaches in**

claude.ai/code in the phone browser, open this repo, then:

- `/brief` — morning brief
- `/midday` — 3pm checkpoint
- `/reckon` — evening reckoning
- `/plan-week` — lay out the week
- `/capture` — add, change or drop tasks

CLAUDE.md and everything in `context/` load automatically, so the rules hold
on the phone exactly as they do on the desktop.

## What does not change on the phone

- Tasks get ticked **only** at the evening reckoning, and only what Samuel
  confirms out loud.
- Due dates never move without asking.
- `context/mission.md` and `context/stakes.md` are never edited without asking.
- `context/memory.md` and `context/ledger.md` are append-only.
- The read lists in each skill apply on the phone too. A cloud routine that reads
  all of `context/` burns the same tokens as one at the desk, and it runs four
  times a day unattended — so it burns them whether Samuel is there or not.
- One routine, one session. The brief, midday and reckoning routines must not
  share a session; each fires clean.

## Finding TickTick in a cloud session

In cloud runs the connector tools are **deferred** — they don't appear in the tool
list until you load them. They are named `mcp__TickTick__*`, not the local UUID
names. Load them first:

`ToolSearch` with query `ticktick projects tasks`

Same for `mcp__Gmail__*`, `mcp__Google_Calendar__*`, `mcp__Google_Drive__*`.
Verified working from a cloud run on 2026-08-23.

## If TickTick is missing from a session

Say so in one line and run off `context/` alone. Mark anything taken on Samuel's
word as UNVERIFIED in the ledger. Never pretend the tasks were checked.

## The budget sheet from the cloud

The sheet is written through an Apps Script bridge whose URL and token live in
`.env` — and `.env` is gitignored, so a cloud clone does not have it. Cloud
environments also block Google Apps Script by default: it is not on the
**Trusted** allowlist, and the `/exec` URL redirects to
`script.googleusercontent.com`, so both hosts have to be allowed.

Both are fixed once, in the browser, on the environment the routines run in.
There is no settings page for it: claude.ai/code/routines → routine → pencil →
the cloud icon under **Instructions** → gear on the environment. Set network
access to **Custom** (with the default list still included) plus:

```
script.google.com
*.googleusercontent.com
```

and the three variables `SHEETS_WEBAPP_URL`, `SHEETS_TOKEN`, `SHEETS_ID`.
Full walkthrough in `tools/sheets/README.md`.

In any session, on any device, the first question is answered by:

```bash
python tools/sheets/sheets.py doctor
```

### If the bridge is down, the money is still not lost

Money batches are sent with `--queue "<label>"`. Undeliverable ones are parked
in `context/sheet-queue.jsonl` and committed with the rest of `context/`. The
next session anywhere that can reach the bridge runs
`python tools/sheets/sheets.py flush` and the sheet catches up.

So the rule on the phone is the same as at the desk: **write the ledger first,
queue the mirror, commit, push.** A cloud session never skips the ledger because
the sheet failed, and never leaves the mirror silently behind.
