/* Samuelsignals OS — People. */

(function () {
  const S = window.SS, OS = S.OS;
  const { h, naira, statCard, callout, table, pageHead, doc } = S;

  S.chrome('people');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  add(pageHead('People', 'The monthly visit fails in the week before it, not on the day.',
    'One new content creator visited in Abuja every month — someone he invites and meets in ' +
    'person, <strong>named in advance, met on a named date.</strong>'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Creators visited', '0', 'outreach rate effectively zero', 'red'),
    statCard('Girlfriend, September', naira(150000), '₦100k allowance + ₦50k school', 'pink'),
    statCard('Owed to his sister', naira(50000), 'after September · NO DATE', 'amber'),
    statCard('Community admin', naira(15000), 'per month · not a cost-cutting target')));

  add(h('div', { style: 'margin-top:14px' }, callout('info', '\u{1F4C7}',
    '<strong>How it is verified: a named person and a named date in the ledger.</strong> ' +
    'Not "I reached out to a few people." A name.',
    'Weekly minimum: <strong>one intentional outreach message a week</strong>, so the monthly visit ' +
    'has someone to visit. He cannot visit someone he has not messaged.')));

  add(h('h2', {}, 'Girlfriend'));
  add(callout('warn', '⚠',
    '<strong>Her visits are a real cost line.</strong> The August ₦200,000 savings withdrawal was ' +
    'for accommodating her visit — that single decision is why the building payment dropped from ' +
    '₦500,000 to ₦200,000.',
    '<strong>Per Rule 1: a girlfriend’s visit is not an emergency.</strong> Visits get budgeted in ' +
    'advance as a line, not funded from savings after the fact.',
    '<strong>OPEN — school fees are termly, not annual.</strong> Is the ₦50,000 a one-off or the ' +
    'first of three? If it repeats it is a LINE, not a surprise. Ask before October.'));

  add(h('h2', {}, 'The network line, and what it cost'));
  add(callout('warn', '\u{1F4B8}',
    'Creator visits are budgeted at <strong>₦25,000/month</strong>, his number, confirmed 26 Aug. ' +
    'It is a real line now, not a good intention.',
    '<strong>What it cost to make it real: ₦100,000 across Sep–Dec, which moved the ₦1M December ' +
    'target from "just closes" to a coin flip.</strong> That is the price of this goal existing. ' +
    'Do not let it be spent on anything else and then claimed as met.'));

  add(h('h2', {}, 'The live debt'));
  add(callout('bad', '\u{1F4CC}',
    '<strong>He owes his sister ₦90,000.</strong> ₦40,000 goes in September on Payday B. ' +
    '<strong>₦50,000 remains, with no date on it</strong> — his words: <em>"can hold for anytime ' +
    'I am free with more funds, no deadline."</em>',
    'She is not pressing, so it is not scheduled. It is written down anyway, because an undated ' +
    'debt is the kind of thing that ambushes a month, and <strong>"when I have more funds" is the ' +
    'same sentence that moves due dates.</strong> Bring it up the first month that closes with the ' +
    'buffer full.'));

  add(h('h2', {}, 'Money that goes to people'));
  const cats = ['Girlfriend', 'Parents', 'Community admin', 'Creator visits', 'Giving', 'Other'];
  const rows = OS.budget.items.filter(i => i.active && cats.includes(i.category));
  add(h('div', { class: 'card pad-0' },
    table(['Item', 'Category', { label: 'Amount', num: true }, 'Payday', 'Note'],
      rows.sort((a, b) => b.amount - a.amount).map(i => [
        h('strong', {}, i.item), i.category, naira(i.amount),
        h('span', { class: 'pill ' + (i.payday === 'A' ? 'ok' : 'info') }, i.payday || '—'),
        h('span', { class: 't-sm t-dim' }, (i.note || '').slice(0, 160)),
      ]))));

  add(h('h2', {}, 'context/people.md'));
  add(doc('people'));
})();
