/* Samuelsignals OS — Spirit. The one he named first. */

(function () {
  const S = window.SS, K = window.SSCharts, OS = S.OS;
  const { h, statCard, callout, table, pageHead, note, legend, doc } = S;

  S.chrome('spirit');
  const SP = OS.spirit || {};
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const log = OS.habit_log || {};
  const dates = Object.keys(log).sort();
  const SPIRIT = ['Prayed', 'Bible study (morning)', 'No social media (detox)', 'No masturbating'];
  const count = n => dates.filter(d => log[d][n] === true).length;

  add(pageHead('Spirit', 'Time with God every single day, without a miss.',
    '<strong>This is the one he named first when asked about his life. It is not third on a list.</strong> ' +
    'Weekly minimum is 7/7 — this one has no acceptable miss rate.'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Prayed', `${count('Prayed')}/${dates.length}`, 'days on the record', 'green'),
    statCard('Bible study', `${count('Bible study (morning)')}/${dates.length}`, 'the 5:30am block', 'green'),
    statCard('The block', '45 min', '5:30am, prayer and Bible combined'),
    statCard('Next church', SP.church_next ? daysLabel(daysUntil(SP.church_next)) : '—',
      SP.church_status === 'ON' ? SP.church_note : 'OFF — ' + (SP.last_missed||{}).reason,
      SP.church_status === 'ON' ? 'green' : 'red')));

  add(h('div', { style: 'margin-top:14px' }, callout('info', '\u{1F517}',
    '<strong>Say this out loud whenever a late night is being negotiated:</strong>',
    '<strong>5:30am prayer requires an early bedtime. Spirit is downstream of sleep, and sleep is ' +
    'downstream of not finishing client work at 1am.</strong>',
    'A missed 5:30am block is almost never a spiritual failure. It is a scheduling failure from ' +
    'the previous afternoon. <strong>Diagnose it there.</strong>')));

  add(h('h2', {}, 'The habits that carry it'));
  const heatHost = h('div', { style: 'overflow-x:auto' });
  add(h('div', { class: 'card' },
    h('div', { class: 'card-h' }, h('h3', {}, 'Every day of the 7-day block'),
      h('span', { class: 'sub' }, '25–31 Aug')),
    heatHost,
    legend([[K.COLOURS.green, 'Hit'], [K.COLOURS.red, 'Broken'], ['#1e2632', 'Not tracked']]),
    note('<strong>Masturbation and too much social media</strong> are, in his own words, the two ' +
      'things that break time with God. Both broke on 27 Aug, day 3 of 7. ' +
      'Both were also removed from tracking on the morning of 24 Aug and re-created the same night ' +
      '— ~14 hours between delete and restore. <strong>If either is removed again inside a running ' +
      'block, the weekly review treats it as a pattern, not a decision.</strong>')));
  K.heatmap(heatHost, SPIRIT, dates, (n, d) => (log[d] && log[d][n] !== undefined) ? log[d][n] : null,
    { cell: 30, labelW: 160 });

  add(h('h2', {}, 'Sunday is not a free day'));
  add(h('div', { class: 'card pad-0' },
    table(['', ''], [
      ['Service', '9:00am'],
      ['Commute', h('strong', {}, 'up to 1h30 each way')],
      ['Leaves', '~7:30am'],
      ['Service ends', '12:30pm'],
      ['Home', '~3:00pm'],
      [h('strong', {}, 'Total'), h('strong', { class: 'v amber' }, '~7.5 hours')],
    ])));

  add(h('div', { style: 'margin-top:12px' }, callout('warn', '⛪',
    '<strong>Any plan that treats Sunday as a work buffer must be built around 3:00pm onward, not ' +
    'the whole day.</strong> The 25 Aug pattern — dumping the week’s debt into the weekend — does ' +
    'not have a weekend to dump into.',
    'Church media team: Sunday only, inside the service. No extra time cost beyond the ' +
    '7:30am–3:00pm block.')));

  add(h('div', { style: 'margin-top:12px' }, callout('bad', '\u{1F4B8}',
    '<strong>30 August: church is off, and it is not a scheduling choice.</strong> He needs ₦5,000 ' +
    'for transport, has ₦2,503, and is short ₦3,000. Liquid savings ₦0, emergency fund ₦0, ' +
    'Cowrywise ₦305,000 locked until Jan 2027. <strong>There is genuinely nothing to draw on.</strong>',
    'This is the first time on the record that the money shortfall has taken something out of this ' +
    'file. <strong>The ₦1M is not an abstraction about a house in December — it is already deciding ' +
    'whether he gets to church on Sunday.</strong>')));

  add(h('h2', {}, 'context/spirit.md'));
  add(doc('spirit'));
})();
