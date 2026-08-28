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
    note('September has not started, so every actual is ₦0 and the grey bars are the whole plan. ' +
      '<strong>Actuals only ever come from logged rows</strong> — a category cannot claim money ' +
      'moved when no row exists. That was the whole bug in the old sheets.')));

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
    add(callout('warn', '🗄',
      '<strong>A cancelled subscription that reappears in three months is a pattern, and a ' +
      'deleted row hides it.</strong> These are marked inactive and excluded from every total, ' +
      'but they stay on the record.'));
    add(h('div', { class: 'card pad-0', style: 'margin-top:10px' },
      table(['Item', 'Category', { label: 'Was', num: true }, 'Note'],
        dead.map(i => [
          h('span', { class: 'strike' }, i.item), i.category, naira(i.amount),
          h('span', { class: 't-sm t-dim' }, i.note || ''),
        ]))));
  }

  /* ------------------------------------------------------- savings plan */

  add(h('h2', {}, 'The savings plan'));
  add(h('div', { class: 'card pad-0' },
    table(['Pot', { label: 'Target', num: true }, 'By', 'Starts', 'What it is'],
      B.savings.map(([name, target, by, starts, why]) => [
        h('strong', {}, name),
        typeof target === 'number' ? naira(target) : target,
        by, starts,
        h('span', { class: 't-sm t-dim' }, why),
      ]))));

  /* ------------------------------------------------------- lean ladder */

  add(h('h2', {}, 'The lean-month ladder'));
  add(callout('warn', '📉',
    '<strong>Decided in advance so it is not negotiated at 11pm on a short month.</strong> ' +
    'When a month lands short, the cut order is already fixed.'));
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
