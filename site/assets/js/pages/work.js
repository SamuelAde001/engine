/* Samuelsignals OS — Work & Clients. */

(function () {
  const S = window.SS, K = window.SSCharts, OS = S.OS;
  const { h, naira, hours, dateLabel, daysUntil, daysLabel, statCard, callout,
          toggle, table, pageHead, note, legend, verdictPill } = S;

  S.chrome('work');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const I = OS.income;
  const led = OS.ledger;
  const deadline = OS.countdowns.find(c => /Client #2 deadline/.test(c.label));

  add(pageHead('Work & Clients', 'Hit every stated deadline. No deadline moves.',
    'That is the whole of the client goal, in his words: <em>"I just want to meet all my deadlines."</em>'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Client #2 due', deadline ? daysLabel(daysUntil(deadline.date)) : '—',
      'Sun 30 Aug, 8:45pm', 'red'),
    statCard('Internal target', '4:00pm', '4h45m of margin — not to be spent in advance', 'green'),
    statCard('Payers', '1', '100% of income, one invoice', 'red'),
    statCard('Focus this week', hours(OS.summary.total_focus), `${OS.summary.days_closed} days closed`)));

  add(h('div', { style: 'margin-top:14px' }, callout('bad', '⚠',
    '<strong>ONE PAYER. Not one client — one payer.</strong> Route Rise Media LTD is an agency. ' +
    'It works with two end clients; he edits for both and sends one invoice covering both. ' +
    'Both rates are Route Rise’s. The volume is Route Rise’s decision.',
    '<strong>There is no second client and there never was.</strong> Corrected 27 Aug — the file ' +
    'used to carry a "second client" line that read like the beginnings of diversification. It was not.',
    '<strong>"Hit 4 videos a month" is not a SMART goal</strong> — the A fails. Achievement is ' +
    'another company’s decision, not his. Which leaves exactly one lever he owns: the course.')));

  /* ------------------------------------------------------- client #2 */

  add(h('h2', {}, 'Client #2 — 40 min raw → ~25 min finished'));
  const DAYS = [
    ['Wed 26', 'Day 1 — ingest, research, organise, scope', 'done'],
    ['Thu 27', 'Day 2 — CUT + INTRO', 'partial'],
    ['Fri 28', 'Day 3 — BODY part 1, plus the INTRO carry', 'open'],
    ['Sat 29', 'Day 4 — BODY part 2 + OUTRO → PICTURE LOCK 6:30pm', 'open'],
    ['Sun 30', 'Day 5 — sound design, render, review. BUFFER DAY.', 'open'],
  ];
  add(h('div', { class: 'card' }, h('div', { class: 'rows' },
    DAYS.map(([d, what, state]) => h('div', { class: 'row' },
      h('div', { class: 'r mono', style: 'min-width:60px;font-weight:700' }, d),
      h('div', { class: 'grow' }, h('div', { class: 't' }, what)),
      h('div', { class: 'r' }, h('span', {
        class: 'pill ' + (state === 'done' ? 'ok' : state === 'partial' ? 'warn' : 'neutral'),
      }, state === 'done' ? 'shipped' : state === 'partial' ? 'cut only' : 'open')))))));

  add(h('div', { style: 'margin-top:12px' }, callout('bad', '\u{1F512}',
    '<strong>Picture lock is Saturday 6:30pm.</strong> Sunday being a working day does NOT promote ' +
    'it to a third cutting day. <strong>It is the buffer.</strong>',
    'If he is still cutting on Sunday, the buffer is eaten and he is back in Tuesday’s hole with an ' +
    '8:45pm deadline the same night.')));

  /* --------------------------------------------------------- the record */

  add(h('h2', {}, 'The delivery record'));
  add(h('div', { class: 'card pad-0' },
    table(['Date', 'Committed', 'Verdict', { label: 'Focus', num: true }, 'What happened'],
      led.slice().reverse().map(r => [
        h('span', { class: 'mono tight' }, r.date),
        h('span', { class: 't-sm' }, (r.committed || '').slice(0, 90) + ((r.committed || '').length > 90 ? '…' : '')),
        verdictPill(r.verdict),
        r.focus_pct != null ? r.focus_pct + '%' : '—',
        h('span', { class: 't-sm t-dim' }, r.shipped || 'open'),
      ]))));

  /* ------------------------------------------------------ income shape */

  add(h('h2', {}, 'Where the money comes from'));
  const batchHost = h('div');
  add(h('div', { class: 'card' },
    h('div', { class: 'card-h' }, h('h3', {}, 'Videos invoiced per batch'),
      h('span', { class: 'sub' }, 'volume is not his decision')),
    batchHost,
    note('May 5 → June 4 → July 2 → August 4. <strong>July was a 2-video month, and at that mix he ' +
      'is ₦141,709 underwater.</strong> The volume is set by Route Rise, which is exactly why ' +
      '"hit 4 videos a month" cannot be a goal he owns.')));

  K.barChart(batchHost, I.batches.map(b => ({ label: b.month.slice(5) + '/' + b.month.slice(2, 4), videos: b.videos })), {
    height: 210, yStep: 1, yMax: 6,
    series: [{ key: 'videos', name: 'Videos', colour: d => d.videos <= 2 ? K.COLOURS.red : K.COLOURS.blue }],
    thresholds: [{ value: 4, colour: K.COLOURS.green, label: '4 — the mix that closes December' }],
  });

  /* ---------------------------------------------------------- the rules */

  add(h('h2', {}, 'The rules that came out of the misses'));
  const RULES = [
    ['The internal send target is set BEFORE the deadline, never at it.',
     'A target set at the deadline is not a target. Added after the 6:20pm miss on 25 Aug, which shipped at 1:42am.'],
    ['Hard stop 6:30pm. No evening work blocks.',
     'Work that misses the stop rolls to the buffer, never into the night.'],
    ['One live-client exception is not a standing evening block.',
     'The 26 Aug 9–11pm revision block was a real external deadline and is allowed once. If a second night block appears, say it at that day’s checkpoint — not at the weekly review.'],
    ['Timer on every pomo.',
     'Untimed work does not exist to the 3pm checkpoint. 26 Aug logged 18 minutes for a full day of work and produced a wrong diagnosis that got written into the record as fact.'],
    ['All editing work is built as separate timed subtasks, one per pomo.',
     '50 minutes work, 5 minute break, each its own calendar block — because he works off the calendar and a schedule buried in task notes renders as one long bar.'],
  ];
  add(h('div', { class: 'card' }, h('div', { class: 'rows' },
    RULES.map(([t, s]) => h('div', { class: 'row' },
      h('div', { class: 'grow' }, h('div', { class: 't' }, t), h('div', { class: 's' }, s)))))));

  /* --------------------------------------------------------- the detail */

  add(h('h2', {}, 'The detail'));
  add(toggle('The concentration risk, in full', 'one payer, one invoice',
    h('p', {}, h('strong', { class: 'v red' }, '100% of income arrives through one invoice to one company. '),
      'If Route Rise goes, all of it goes — including the "$175 client", which is not a separate ' +
      'relationship he could keep.'),
    h('p', {}, 'Rates: $333.33/video on the original end client — he has tried to raise it, they ' +
      'will not move, and he is content with it. $175/video on the second end client, new August ' +
      '2026, two videos agreed, may or may not recur. ',
      h('strong', {}, 'The rate mix cost ~₦432,000 on the August batch alone.')),
    h('p', {}, h('strong', {}, 'He does not want more clients. '), 'His reason: one client’s ' +
      'workload is already high. His call, and not to be re-litigated at every check-in — but it ' +
      'means the course is the only income line whose existence he controls.'),
    h('p', {}, h('strong', {}, 'They do not pay at weekends. '), 'Oct 70% slips Sat 31 Oct → Mon 2 Nov ' +
      '(the tightest point of the year), and Nov 30% slips Sat 14 Nov → Mon 16 Nov.')));
})();
