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

| Routine | Fires (WAT) | Runs |
|---|---|---|
| Morning brief | 7:00am daily | `brief` |
| Midday checkpoint | 3:00pm daily | `midday` |
| Evening reckoning | 9:00pm daily | `reckon` |
| Weekly review | 8:00pm Sunday | `reckoning-week` |

Manage them at https://claude.ai/code/routines

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
