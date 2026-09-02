/* Samuelsignals OS — Body. Sleep is the wall under everything else. */

(function () {
  const S = window.SS, K = window.SSCharts, OS = S.OS;
  const { h, hours, time12, num, statCard, callout, toggle, table,
          pageHead, note, legend, doc } = S;

  S.chrome('body');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const led = OS.ledger;
  const B = OS.body;
  const sum = OS.summary;
  const nights = led.filter(r => r.bed);
  const slept = led.filter(r => r.slept != null);
  const avgSleep = slept.length ? slept.reduce((a, r) => a + r.slept, 0) / slept.length : null;

  add(pageHead('Body', 'Sleep is the wall. Nothing else survives a 4-hour night.',
    'Gym, the 5:30am prayer block and the 6:30pm hard stop all sit on top of the bedtime. ' +
    '<strong>When the floor breaks, ask what happened that afternoon — not why he stayed up.</strong>'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Floor hit', `${sum.nights_floor_hit}/${sum.nights_recorded}`,
      'nights at or before 10:30pm', 'red'),
    statCard('Average sleep', avgSleep ? hours(avgSleep) : '—',
      `floor is ${B.sleep_floor_hours}h`, 'red'),
    statCard('Longest day', hours(Math.max(...led.map(r => r.focus_logged || 0))),
      '25 Aug — 19h06m span, no nap', 'red'),
    statCard('Morning movement', '0/6', 'gym Mon/Wed/Fri · run Tue/Thu/Sat', 'amber')));

  add(h('div', { style: 'margin-top:14px' }, callout('bad', '🧱',
    '<strong>He has not hit the 10:30pm floor once on the record.</strong> ' +
    'Bed times: 1:00am · 11:00pm · 12:30am · 1:42am · 1:30am · 1:30am. Against a 5:30am wake ' +
    'that is 4.5h, 6.5h, 5h, ~4h, 4h, ~5.5h.',
    '10:30pm is not a tightening of what he does — it is 2.5 hours earlier than his worst night ' +
    'and 30 minutes earlier than his best. <strong>Treat every miss as data about the afternoon ' +
    'that caused it, not as a discipline failure.</strong>')));

  /* --------------------------------------------------------------- charts */

  add(h('h2', {}, 'The bedtime, plotted'));
  const bedHost = h('div');
  add(h('div', { class: 'card' },
    h('div', { class: 'card-h' }, h('h3', {}, 'What time he actually went to bed'),
      h('span', { class: 'sub' }, 'green band = the 7-hour zone')),
    bedHost,
    note('Every dot below the green line is a night under seven hours. The dashed track between ' +
      'them is the shape of the problem: <strong>three consecutive nights ending after 1:30am.</strong>')));
  K.bedChart(bedHost, led, { height: 300 });

  const sleepHost = h('div');
  const focusHost = h('div');
  add(h('div', { class: 'grid g2', style: 'margin-top:14px' },
    h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h3', {}, 'Hours slept vs the floor'), h('span', { class: 'sub' }, 'hours')),
      sleepHost,
      note('The floor is <strong>7 hours</strong> — his number, given 26 Aug. Every bar is short of it.')),
    h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h3', {}, 'Focus logged vs committed'), h('span', { class: 'sub' }, 'hours')),
      focusHost,
      note('<strong>Rule 5: any day whose logged focus exceeds 12h is not a good day, it is an ' +
        'invoice.</strong> 25 Aug logged 16.23h against a 9h commitment and shipped — and the ' +
        'debt came due on the 27th, when the intro died in the 5:00–6:30pm slot.'))));

  K.barChart(sleepHost, slept.map(r => ({ date: r.date, slept: r.slept })), {
    height: 220, yStep: 2, yMax: 9,
    series: [{ key: 'slept', name: 'Slept', colour: d => d.slept >= 7 ? K.COLOURS.green : K.COLOURS.red }],
    thresholds: [{ value: B.sleep_floor_hours, colour: K.COLOURS.green, label: '7h floor' }],
  });

  K.barChart(focusHost, led.filter(r => r.focus_logged != null), {
    height: 220, yStep: 4,
    series: [
      { key: 'focus_committed', name: 'Committed', colour: '#1e2632' },
      { key: 'focus_logged', name: 'Logged', colour: d => d.focus_logged > 12 ? K.COLOURS.red : K.COLOURS.teal },
    ],
    thresholds: [{ value: 12, colour: K.COLOURS.red, label: '12h — an invoice' }],
  });

  /* -------------------------------------------------------------- anchors */

  add(h('h2', {}, 'The anchors'));
  add(callout('info', '⚓',
    '<strong>Never schedule work over these, and never create a task for eating, napping, ' +
    'showering or sleeping.</strong> Those are not tasks. ' +
    'While a fast is running the meal and nap anchors move — check before planning any day.'));

  add(h('div', { class: 'grid g2', style: 'margin-top:12px' },
    h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h3', {}, 'Default'), h('span', { class: 'sub' }, 'from 1 Sep')),
      h('div', { class: 'rows' }, B.anchors_default.map(a => h('div', { class: 'row' },
        h('div', { class: 'r mono', style: 'min-width:62px;font-weight:700' }, time12(a.time)),
        h('div', { class: 'grow' }, h('div', { class: 't' }, a.label)))))),
    h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h3', {}, 'Morning movement'),
        h('span', { class: 'sub' }, (B.movement_cost_hours_per_week || 0) + 'h/week')),
      h('div', { class: 'rows' }, (B.movement || []).map(m => h('div', { class: 'row' },
        h('div', { class: 'r mono', style: 'min-width:96px;font-weight:700;color:var(--amber)' }, m.time),
        h('div', { class: 'grow' },
          h('div', { class: 't' }, m.what),
          h('div', { class: 'sub' }, m.days + (m.then !== '—' ? ' · ' + m.then : '')))))))));

  /* --------------------------------------------------------- PA sessions */

  add(h('h2', {}, 'What the engine itself costs'));
  add(h('div', { class: 'card' },
    h('div', { class: 'rows' }, B.pa_sessions.map(p => h('div', { class: 'row' },
      h('div', { class: 'r mono', style: 'min-width:62px;font-weight:700' }, time12(p.time)),
      h('div', { class: 'grow' }, h('div', { class: 't' }, p.label)),
      h('div', { class: 'r mono t-dim' }, p.minutes + ' min')))),
    note(`<strong>${B.pa_weekly_hours} hours a week — more than a full working day spent running ` +
      `the engine.</strong> That is not an argument for cutting the check-ins; they are what caught ` +
      `the 18-minute timer misread and the sleep chain. It IS an argument for holding each to its ` +
      `stated length. The reckoning skill says "under five minutes" and reality is thirty.`)));

  /* -------------------------------------------------------------- the file */

  add(h('h2', {}, 'context/body.md'));
  add(doc('body'));
})();
