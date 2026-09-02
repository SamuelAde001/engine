/* Samuelsignals OS — Budget. The spreadsheet, mirrored. */

(function () {
  const S = window.SS, K = window.SSCharts, OS = S.OS;
  const { h, naira, pct, stat, statCard, callout, toggle, table, pageHead, note, legend } = S;

  S.chrome('budget');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const B = OS.budget;
  const MONTH = B.plan_start;                       // 2026-09 — the first planned month
  const items = B.items.filter(i => i.active);
  const forMonth = items.filter(i => !i.month || i.month === MONTH);

  /* actuals, from the money ledger — the only place actuals may come from */
  const actualByCat = {};
  OS.money_ledger.forEach(r => {
    if (!r.date.startsWith(MONTH)) return;
    // The ledger's out column is prose; category attribution lives in the note.
    // Until a month is actually spent there is nothing to attribute.
  });

  const cats = [...new Set(forMonth.map(i => i.category))];
  const planByCat = {};
  cats.forEach(c => {
    planByCat[c] = forMonth.filter(i => i.category === c).reduce((a, i) => a + (i.amount || 0), 0);
  });
  const totalPlan = Object.values(planByCat).reduce((a, b) => a + b, 0);
  const paydayA = forMonth.filter(i => i.payday === 'A').reduce((a, i) => a + i.amount, 0);
  const paydayB = forMonth.filter(i => i.payday === 'B').reduce((a, i) => a + i.amount, 0);

  add(pageHead('Budget', `The plan for ${MONTH}`,
    'Every line item, what it is made of, and which payday funds it. ' +
    '<strong>Nothing here is a mystery number</strong> — a category total is always the sum of ' +
    'named items underneath it.'));

  add(callout('info', 'ℹ',
    `<strong>August was never planned, deliberately.</strong> The baseline was set on 26 August ` +
    `<em>for</em> September, so <code>plan_start</code> is <strong>${B.plan_start}</strong> and ` +
    `nothing before it is judged against a plan. Comparing August to a plan it never had would ` +
    `invent an overspend that never happened.`,
    `<code>tracking_start</code> is <strong>${B.tracking_start}</strong> — the date the opening ` +
    `bank balance was taken. Everything earned or spent before it is already inside that balance, ` +
    `so it must never also appear as a row. That would double-count and break the bank figure.`));

  /* ------------------------------------------------------------- headline */

  add(h('div', { class: 'grid g4 tight', style: 'margin-top:14px' },
    statCard('Planned, September', naira(totalPlan, { short: true }),
      `${forMonth.length} active line items`),
    statCard('Payday A funds', naira(paydayA, { short: true }), 'the 1st – 14th', 'green'),
    statCard('Payday B funds', naira(paydayB, { short: true }), 'the 15th – month end', 'blue'),
    statCard('Obligations floor', naira(OS.income.obligations_floor, { short: true }),
      'recurring only, no one-offs', 'amber')));

  /* --------------------------------------------------- plan vs actual chart */

  add(h('h2', {}, `Plan vs actual — ${MONTH}`));

  const planHost = h('div');
  add(h('div', { class: 'card' },
    h('div', { class: 'card-h' }, h('h3', {}, 'Every category'),
      h('span', { class: 'sub' }, 'grey = planned, colour = actual')),
    planHost,
    legend([[K.COLOURS.teal, 'Actual'], ['#1e2632', 'Planned']]),
    notesFor('budget', 'n1')));

  K.hBars(planHost, cats
    .map(c => ({ label: c, value: actualByCat[c] || 0, compare: planByCat[c] }))
    .sort((a, b) => b.compare - a.compare), {
    rowH: 32, labelW: 148, valueW: 118, fmt: v => naira(v, { short: true }),
    max: Math.max(...Object.values(planByCat)),
    colour: K.COLOURS.teal,
  });

  /* -------------------------------------------------- the details, by cat */

  add(h('h2', {}, 'What each category is actually made of'));
  add(h('p', { class: 'lede', style: 'margin-bottom:14px' },
    'This is the Details tab. It is the only place a plan number is typed, and it is why ',
    h('strong', {}, '₦66,700 of subscriptions is not a budget line — it is Claude + Google + ' +
      'CapCut + YouTube + Spotify, each with its own amount and renewal date.')));

  cats.sort((a, b) => planByCat[b] - planByCat[a]).forEach(c => {
    const rows = forMonth.filter(i => i.category === c)
      .sort((a, b) => b.amount - a.amount);
    add(h('details', { class: 'tg', open: rows.length <= 2 ? '' : null },
      h('summary', {},
        c,
        h('span', { class: 'sub' },
          `${naira(planByCat[c])} · ${rows.length} item${rows.length > 1 ? 's' : ''}`)),
      h('div', { class: 'tg-body' },
        table(['Item', { label: 'Amount', num: true }, 'Tier', 'Payday', 'Due', 'Note'],
          rows.map(i => [
            h('strong', {}, i.item),
            naira(i.amount),
            h('span', { class: 'pill ' + (i.tier === 'Fixed' ? 'bad' : i.tier === 'Committed' ? 'warn' : 'neutral') }, i.tier),
            h('span', { class: 'pill ' + (i.payday === 'A' ? 'ok' : 'info') }, i.payday || '—'),
            i.due || (i.month ? h('span', { class: 'pill neutral' }, 'one-off') : '—'),
            h('span', { class: 't-sm t-dim' }, i.note || ''),
          ])))));
  });

  /* ----------------------------------------------------------- cancelled */

  const dead = B.items.filter(i => !i.active);
  if (dead.length) {
    add(h('h2', {}, 'Cancelled — kept, never deleted'));
    add(notesFor('budget', 'n2'));
    add(h('div', { class: 'card pad-0', style: 'margin-top:10px' },
      table(['Item', 'Category', { label: 'Was', num: true }, 'Note'],
        dead.map(i => [
          h('span', { class: 'strike' }, i.item), i.category, naira(i.amount),
          h('span', { class: 't-sm t-dim' }, i.note || ''),
        ]))));
  }

  /* --------------------------------------------- the month must balance */

  const BAL = B.balance || [];
  const y26 = BAL.filter(r => r.month < '2027-01');
  const y27 = BAL.filter(r => r.month >= '2027-01');
  const mLabel = m => new Date(m + '-01T00:00:00')
    .toLocaleString('en', { month: 'short', year: '2-digit' });

  add(h('h2', {}, 'The month must balance'));
  add(notesFor('budget', 'n3'));

  const balRow = (label, pick, opts = {}) => [
    opts.strong ? h('strong', {}, label) : label,
    ...y26.map(r => {
      const v = pick(r);
      const txt = (opts.neg ? '\u2212 ' : '') + naira(Math.abs(v));
      if (opts.total) {
        return h('strong', { class: 'v ' + (v === 0 ? 'green' : 'red') },
          v === 0 ? naira(0) : naira(v));
      }
      return v === 0 && opts.neg ? h('span', { class: 't-dim' }, '\u2014') : txt;
    }),
  ];

  add(h('div', { class: 'card pad-0', style: 'margin-top:10px' },
    table(['', ...y26.map(r => ({ label: mLabel(r.month), num: true }))], [
      balRow('Expected income', r => r.income, { strong: true }),
      balRow('Bills', r => r.bills, { neg: true }),
      balRow('One-offs', r => r.one_offs, { neg: true }),
      balRow('Into the pots', r => r.pots, { neg: true }),
      balRow('LEFT OVER', r => r.left, { strong: true, total: true }),
    ])));
  add(notesFor('budget', 'n4'));

  if (y27.length) {
    const short = y27.filter(r => r.left < 0);
    add(callout('bad', '!',
      '<strong>From January it stops balancing.</strong> Cowrywise ends in December, freeing ' +
      naira(100000) + '/month \u2014 but Goal 2 needs ' + naira(428571) + ' and the emergency ' +
      'fund ' + naira(50000) + '. At the August mix that is <strong>' + naira(-short[0].left) +
      ' short, every month from January to June</strong>.',
      'That gap is the course\u2019s job. It is also far smaller than the ₦152,000\u2013₦186,000 ' +
      'money.md carried \u2014 that figure was a Sep\u2013Dec surplus wrongly applied to a period ' +
      'in which Cowrywise has already stopped.'));
  }

  /* ------------------------------------------------------- savings plan */

  add(h('h2', {}, 'The savings plan'));
  add(h('p', { class: 'lede', style: 'margin-bottom:14px' },
    'Per month, not a flat average \u2014 and ',
    h('strong', {}, 'every pot needs an account it physically goes into'),
    '. A pot with no home cannot be funded on payday.'));

  const months26 = ['2026-09', '2026-10', '2026-11', '2026-12'];
  add(h('div', { class: 'card pad-0' },
    table(['Pot', 'Where it lives', 'Payday', { label: 'Target', num: true },
      ...months26.map(m => ({ label: mLabel(m), num: true }))],
      B.savings.map(v => [
        h('strong', {}, v.pot),
        v.account === 'NOT SET'
          ? h('span', { class: 'pill bad' }, 'NOT SET')
          : h('span', { class: 't-sm' }, v.account),
        h('span', { class: 'pill ' + (v.payday === 'A' ? 'ok' : 'info') }, v.payday),
        naira(v.target),
        ...months26.map(m => v.schedule[m]
          ? naira(v.schedule[m])
          : h('span', { class: 't-dim' }, '\u2014')),
      ]))));

  add(callout('warn', '\u26a0',
    '<strong>Two pots, one account.</strong> The Buffer lives in the savings account already ' +
    'called \u201cEmergency\u201d. From January the actual emergency fund starts \u2014 and if it ' +
    'goes to the same place, the balance stops meaning anything. Decide before then.',
    '<strong>Goal 1 has no account at all.</strong> It cannot share the Buffer\u2019s: the Buffer ' +
    'is designed to be spent and the ₦1M is not. On Payday B, ' + naira(146041) +
    ' needs somewhere to go that is not the account he buys fuel from.'));

  add(h('div', { class: 'card pad-0', style: 'margin-top:10px' },
    table(['Pot', 'What it is'],
      B.savings.map(v => [
        h('strong', {}, v.pot),
        h('span', { class: 't-sm t-dim' }, v.note),
      ]))));

  /* ------------------------------------------------------- lean ladder */

  add(h('h2', {}, 'The lean-month ladder'));
  add(notesFor('budget', 'n5'));
  add(h('div', { class: 'card', style: 'margin-top:10px' },
    h('div', { class: 'rows' },
      B.lean_ladder.filter(l => /^\d\./.test(l.trim())).map((l, i) =>
        h('div', { class: 'row' },
          h('div', { class: 'r mono', style: 'min-width:26px;font-size:17px;font-weight:700;color:var(--amber)' }, i + 1),
          h('div', { class: 'grow' }, h('div', { class: 't' }, l.replace(/^\d\.\s*/, ''))))),
      h('div', { class: 'row' },
        h('div', { class: 'r mono', style: 'min-width:26px;font-size:17px;font-weight:700;color:var(--red)' }, '!'),
        h('div', { class: 'grow' },
          h('div', { class: 't' }, 'Savings are never the valve (Rule 1). Cowrywise never pauses (Rule 7).'),
          h('div', { class: 's' }, 'If the buffer is empty, an urgency gets negotiated, not funded.'))))));

  /* ------------------------------------------------------------ how it works */

  add(h('h2', {}, 'How this stays honest'));
  add(toggle('The rule that makes a budget line unable to lie', 'carried over from the sheet',
    h('p', {}, h('strong', {}, 'Nothing is typed where it should be derived. '),
      'A category total is the SUM of its named line items. An actual is the SUM of logged rows. ' +
      'Neither can be typed over.'),
    h('p', {}, 'That design came straight out of the June–August failure: the old sheets booked ' +
      '₦900,250 to savings that never moved, because a budget line could simply say a number. ' +
      h('strong', {}, 'A budget line that says money was saved when no money moved is a lie in a ' +
        'spreadsheet.')),
    h('p', {}, h('strong', {}, 'The finding worth keeping: '),
      'his estimate and his truth differed by ₦5,940. Feeding\'s ₦150,000 did not become savings — ' +
      'it moved house, into transport, data, household, the gym and a misc line that did not exist ' +
      'before. Nothing got cheaper. Worth remembering the next time a category looks like it has ' +
      'slack in it.')));

  add(toggle('The two paydays', 'the spine of the budget',
    h('p', {}, 'One batch, two dates. Payday A is the 70% landing at the end of the previous month ' +
      'and funds the 1st–14th. Payday B is the 30% landing around the 14th and funds the 15th to ' +
      'month end. ', h('strong', {}, 'The 30% is always the previous month\'s remaining batch, never a new one.')),
    table(['', 'Payday A — 70%', 'Payday B — 30%'], [
      ['Expected in', naira(971416), naira(416325)],
      ['Committed', naira(paydayA), naira(paydayB)],
      [h('strong', {}, 'Free'),
        h('strong', { class: 'v green' }, naira(971416 - paydayA)),
        h('strong', { class: 'v green' }, naira(416325 - paydayB))],
    ]),
    h('p', {}, h('strong', {}, 'Girlfriend moved to A '), '— she needs it at the start of the month ' +
      'for household essentials. ', h('strong', {}, 'Community admin moved to B '),
      '— he is paid mid-month. September proved the split immediately: Payday A came out ₦15,084 ' +
      'over, so giving and feeding moved to B.')));
})();
