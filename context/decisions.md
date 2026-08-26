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
