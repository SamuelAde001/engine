/* Samuelsignals OS — Course. The only income line he controls. */

(function () {
  const S = window.SS, K = window.SSCharts, OS = S.OS;
  const { h, naira, pct, dateLabel, daysUntil, daysLabel, statCard, callout,
          toggle, table, pageHead, note, legend, bar, doc } = S;

  S.chrome('course');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const C = OS.course;
  const done = C.lessons.filter(l => l.status !== 'not started').length;
  const gate = C.lessons.find(l => l.gate);

  add(pageHead('Course', 'The only income line whose existence he controls.',
    'One payer, one fixed rate, volume decided by someone else. ' +
    '<strong>Every time course work is dropped for client work, diversification is traded for concentration.</strong>'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Recorded', `${done} / ${C.total_lessons}`, `${C.total_lessons - done} remaining`, 'violet'),
    statCard('To beta launch', daysLabel(daysUntil(C.launch)), `Fri 16 Oct · ${naira(C.beta_price)}`, 'amber'),
    statCard('To the gate', daysLabel(daysUntil(gate.due)), 'LIVE EDIT 01 · Sun 11 Oct', 'amber'),
    statCard('Must carry', naira(C.must_carry_monthly, { short: true }), 'per month, from January', 'red')));

  add(h('div', { style: 'margin-top:14px' }, callout('bad', '🎯',
    `<strong>From January the course has to carry roughly ${naira(C.must_carry_monthly)}/month — ` +
    `about ₦1.2M across seven months — or the July 2027 marriage number does not happen.</strong>`,
    'The ₦3M is on top of the ₦1M. Jan–Jul 2027 needs ₦428,571/month against a surplus of ' +
    '₦243,000–₦277,000. At the August mix that is not tight, it is arithmetically impossible. ' +
    'It closes only if 4-video months become normal — Route Rise\'s decision, not his — or the course earns.',
    '<strong>Every Sunday the 5:00pm block gets skipped is a payment missed on that ₦1.2M.</strong> ' +
    'The weekly review says so, with the number.')));

  /* ----------------------------------------------------------- the grid */

  add(h('h2', {}, 'All 37 lessons'));
  const gridHost = h('div', { class: 'chart-centre' });
  add(h('div', { class: 'card' },
    h('div', { class: 'card-h' }, h('h3', {}, 'Every lesson, by status'),
      h('span', { class: 'sub' }, 'amber outline = the gate')),
    gridHost,
    legend([[K.COLOURS.green, 'Recorded'], ['#1e2632', 'Not started'], [K.COLOURS.amber, 'Gates the launch']]),
    note('Lesson 13 — <strong>LIVE EDIT 01, Sun 11 Oct</strong> — is the gate. Module 1 completes ' +
      'that Sunday and the beta launches Friday 16 Oct with five days of buffer. ' +
      '<strong>If the 11 Oct live edit slips a week, the launch slips a week.</strong> ' +
      'Never launch a module whose last lesson is not recorded.')));
  K.lessonGrid(gridHost, C.lessons, { cols: 13 });

  /* --------------------------------------------------------- by module */

  add(h('h2', {}, 'By module'));
  add(h('div', { class: 'card pad-0' },
    table(['Module', { label: 'Lessons', num: true }, { label: 'Remaining', num: true }, 'Progress'],
      C.modules.map(m => {
        const total = m.to - m.from + 1;
        const rec = total - m.remaining;
        return [
          h('strong', {}, `${m.n} — ${m.name}`),
          `${m.from}–${m.to}`,
          m.remaining,
          h('div', { style: 'min-width:160px' },
            bar(rec, total, m.n === 1 ? 'violet' : ''),
            h('div', { class: 'tiny', style: 'margin-top:4px' }, `${rec} of ${total} recorded`)),
        ];
      }))));

  /* --------------------------------------------------------- schedule */

  add(h('h2', {}, 'Module 1 — the dated schedule'));
  const sched = C.lessons.filter(l => l.due);
  const bySunday = {};
  sched.forEach(l => (bySunday[l.due] = bySunday[l.due] || []).push(l));
  add(h('div', { class: 'card' }, h('div', { class: 'rows' },
    Object.entries(bySunday).map(([d, ls]) => {
      const dd = daysUntil(d);
      return h('div', { class: 'row' },
        h('div', { class: 'r mono', style: `min-width:62px;font-size:17px;font-weight:700;color:${ls.some(l => l.gate) ? 'var(--amber)' : 'var(--text)'}` }, dd),
        h('div', { class: 'grow' },
          h('div', { class: 't' }, ls.map(l => `${l.n}. ${l.name}`).join('  ·  '),
            ls.some(l => l.gate) ? h('span', { class: 'pill warn', style: 'margin-left:8px' }, 'the gate') : null),
          h('div', { class: 's' }, dateLabel(d) + ' · 5:00–7:30pm')));
    }))));

  /* ------------------------------------------------------ commercials */

  add(h('h2', {}, 'Beta commercials'));
  add(h('div', { class: 'grid g3' },
    statCard('Beta price', naira(C.beta_price), 'explicitly a beta price. Rises at full launch.'),
    statCard('Sold via', 'A link', 'manual payment, manual access'),
    statCard('The 20-person community', 'Free', 'they get Module 1 free')));

  add(h('div', { style: 'margin-top:14px' }, callout('warn', '🧾',
    '<strong>Read this honestly, because it is not a revenue plan.</strong> At ₦10,000, given free ' +
    'to the 20 warmest people, fulfilled by hand, the beta will not move money. Against the ' +
    '₦170,000/month the course must carry, ₦10,000 is <strong>17 sales a month</strong> — roughly ' +
    '1.7% of his entire 1,010-person following buying, every month.',
    '<strong>So the beta\'s job is testimonials, not money.</strong> That is a legitimate play and ' +
    'it is the only reading of these three choices that holds together. It only works if the ' +
    'testimonials are actually collected: ask every beta buyer and every community member for a ' +
    'written result. <strong>That is the deliverable of 16 October.</strong>',
    '<strong>Which makes the full course price the load-bearing unknown.</strong> At ₦10,000 the ' +
    'target needs 17 sales/month; at ₦60,000 it needs 3. The beta price anchors whatever comes ' +
    'next, so the full price has to be set BEFORE 16 October, not after.')));

  add(h('div', { style: 'margin-top:12px' }, callout('bad', '🚩',
    '<strong>Standing risk:</strong> manual payment and manual access is work with no external ' +
    'deadline. <strong>Pattern P1 says that is the first category he cuts when client edits land.</strong> ' +
    'If sales stall, check whether the bottleneck is demand or his own fulfilment before concluding ' +
    'nobody wants it.')));

  /* ------------------------------------------------------ the cadence */

  add(h('h2', {}, 'The open question'));
  add(callout('warn', '⏱',
    '<strong>Two lessons a week completes the course early January 2027. Three a week lands it ' +
    'inside 2026.</strong>',
    'This is no longer just a preference: the ₦3M is on top of the ₦1M, so course revenue has to ' +
    'start in January — <strong>which argues for 3/week.</strong> His choice, stated plainly, not ' +
    'decided for him.',
    'The October full-course date is dead. 35 lessons × 70 min ≈ <strong>41 hours of recording</strong> ' +
    'before editing, on top of client work, content and a new gym habit. That is the same arithmetic ' +
    'that produced the 19-hour day on 25 Aug.'));

  add(h('h2', {}, 'context/audience.md — the course sections'));
  add(doc('audience'));
})();
