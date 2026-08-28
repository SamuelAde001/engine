/* Samuelsignals OS — Systems. How the engine runs, and how this site is built. */

(function () {
  const S = window.SS, OS = S.OS;
  const { h, time12, statCard, callout, toggle, table, pageHead, doc } = S;

  S.chrome('systems');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const B = OS.body;
  const gen = OS.generated ? new Date(OS.generated) : null;

  add(pageHead('Systems', 'How the engine runs, and how this site gets built.',
    'Four cloud routines, nine skills, one markdown record, and a static site generated from it. ' +
    '<strong>Nothing here is a database — that is deliberate.</strong>'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Cloud routines', '4', 'brief · midday · reckoning · weekly'),
    statCard('Skills', '9', 'each declares exactly what it reads'),
    statCard('Engine cost', `${B.pa_weekly_hours}h`, 'per week, of his actual time', 'amber'),
    statCard('Days on record', String(OS.summary.days_recorded), gen ? `built ${gen.toLocaleDateString('en-GB')}` : '')));

  /* -------------------------------------------------------- the routines */

  add(h('h2', {}, 'The four routines'));
  add(h('div', { class: 'card pad-0' },
    table(['Routine', 'Fires (WAT)', 'Runs', 'Model'], [
      ['Morning brief', '7:03am daily', h('code', {}, 'brief'), 'opus-4.8'],
      ['Midday checkpoint', '2:57pm daily', h('code', {}, 'midday'), 'sonnet-5'],
      ['Evening reckoning', '9:03pm daily', h('code', {}, 'reckon'), 'opus-5'],
      ['Weekly review', '7:57pm Sunday', h('code', {}, 'reckoning-week'), 'opus-5'],
    ])));
  add(h('p', { class: 'tiny', style: 'margin-top:9px' },
    'Odd minutes are deliberate — they keep the runs off the crowded o’clock marks. ' +
    'The morning brief runs opus-4.8 because early-morning demand for opus-5 was getting it ' +
    'auto-downgraded anyway.'));

  /* ------------------------------------------------------ architecture */

  add(h('h2', {}, 'How this site is built'));
  add(callout('info', '\u{1F527}',
    '<strong>context/*.md is the source of truth. This site is derived from it.</strong> ' +
    'Same rule as the nightly scorecard: generated output is never hand-written, so it cannot ' +
    'drift from the record.',
    'That also means the whole site inherits git’s append-only guarantee for free. ' +
    '<strong>You cannot silently soften a 40% day, because the day lives in a committed markdown ' +
    'file and the site is only a view of it.</strong>',
    'No database, no server, no npm, no CDN. A Python script reads the markdown and writes one ' +
    'JSON file; the charts are hand-rolled SVG.'));

  add(h('div', { class: 'card', style: 'margin-top:12px' },
    h('pre', { style: 'margin:0;background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:14px 16px;overflow-x:auto' },
      h('code', { style: 'font-family:var(--mono);font-size:12.5px;line-height:1.7;color:var(--text-2)' },
`context/*.md            the record — written by the check-ins
context/site.json       the numbers that only live in prose
tools/sheets/plan.json  every budget line item
        │
        ▼
tools/site/build.py     parses the tables, computes the scores
        │
        ▼
site/data/os.json       the whole state, one file
site/data/os.js         the same, as a script (so file:// works)
        │
        ▼
site/                   static HTML + hand-rolled SVG charts`))));

  add(h('div', { class: 'card', style: 'margin-top:12px' },
    h('div', { class: 'card-h' }, h('h3', {}, 'Rebuild it')),
    h('pre', { style: 'margin:0;background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:14px 16px' },
      h('code', { style: 'font-family:var(--mono);font-size:12.5px;color:var(--teal)' },
        'python tools/site/build.py')),
    h('p', { class: 'chart-note' },
      'Run it after any check-in that writes to ', h('code', {}, 'context/'),
      '. The reckoning does it automatically.')));

  /* ------------------------------------------------------ cost discipline */

  add(h('h2', {}, 'Cost discipline'));
  add(callout('warn', '\u{1F4B8}',
    '<strong>Everything loaded is re-sent on every turn, so waste compounds.</strong> ' +
    'None of this trades quality — it removes duplication.'));
  const COST = [
    ['One check-in, one session.', '/clear between the brief, the midday and the reckoning. Running all three in one session drags the whole day’s transcript along on every turn.'],
    ['Model routing.', 'brief, midday and capture on Sonnet. reckon, paid, budget, month, plan-week, reckoning-week and every design conversation on Opus.'],
    ['Never read PA.md.', 'It is a generated duplicate of every file in the repo — 41k tokens of pure repetition. Generate it, commit it, never open it.'],
    ['Never hand-write generated output.', 'The scorecard is built from a ~30-line JSON. This site is built from the markdown. Output tokens cost several times input; a 450-line file typed out nightly was the most expensive act of the day.'],
    ['Narrow the tool calls.', 'Ask TickTick for the project or date you need, not for everything. A broad list comes back as a wall of JSON that then rides along in context for the rest of the session.'],
  ];
  add(h('div', { class: 'card', style: 'margin-top:10px' }, h('div', { class: 'rows' },
    COST.map(([t, s]) => h('div', { class: 'row' },
      h('div', { class: 'grow' }, h('div', { class: 't' }, t), h('div', { class: 's' }, s)))))));

  /* -------------------------------------------------------- the sessions */

  add(h('h2', {}, 'What the engine costs him'));
  add(h('div', { class: 'card' },
    h('div', { class: 'rows' }, B.pa_sessions.map(p => h('div', { class: 'row' },
      h('div', { class: 'r mono', style: 'min-width:62px;font-weight:700' }, time12(p.time)),
      h('div', { class: 'grow' }, h('div', { class: 't' }, p.label)),
      h('div', { class: 'r mono t-dim' }, p.minutes + ' min')))),
    h('p', { class: 'chart-note' },
      `That is 1h30m every weekday, ${B.pa_weekly_hours}h a week, plus the Sunday review — ` +
      `more than a full working day spent running the engine. Not an argument for cutting the ` +
      `check-ins; they are what caught the 18-minute timer misread and the sleep chain. ` +
      `It IS an argument for holding each to its stated length.`)));

  /* ---------------------------------------------------------- the rules */

  add(h('h2', {}, 'The hard rules'));
  add(h('div', { class: 'card' }, h('ul', { style: 'margin:0 0 0 18px;color:var(--text-2);font-size:14.5px' },
    ['Tick only what he confirms out loud, only at the evening reckoning.',
     'Never move a due date without asking. Rescheduling is the addiction.',
     'When he says "I’ll do it tomorrow," ask what changes tomorrow.',
     'Never congratulate him for planning. Only for shipping.',
     'Tasks are created, scheduled and closed in TickTick only.',
     'mission.md and stakes.md are his. Never edited without his word.',
     'The ledger, money ledger, memory and decisions are append-only. Never rewrite history.',
     'Hard stop 6:30pm. No evening work blocks. The Sunday 5:00–7:30pm course block is the only sanctioned exception.',
     'Never schedule work over 5:30am prayer, the 12:00pm meal, the 1:00pm nap or 6:00pm dinner.',
     'Savings are untouchable except medical emergency, building shortfall or family emergency.',
    ].map(t => h('li', { style: 'margin-bottom:6px' }, t)))));

  /* ------------------------------------------------------------ patterns */

  add(h('h2', {}, 'context/patterns.md'));
  add(doc('patterns'));
})();
