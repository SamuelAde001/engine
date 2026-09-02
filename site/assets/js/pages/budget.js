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

  // What the two paydays actually bring in. Read from OS.paydays, never typed:
  // the amounts are NET of the flat per-payment charge and use the measured rate,
  // so they move whenever the record does. Prefer this month's; fall back to the
  // next one on the calendar so the table is never blank.
  const payIn = (letter) => {
    const of = OS.paydays.filter(x => (x.label || '').startsWith('Payday ' + letter));
    const here = of.filter(x => (x.date || '').startsWith(MONTH));
    return (here[0] || of.find(x => x.date >= MONTH) || of[of.length - 1] || {}).amount || 0;
  };
  const inA = payIn('A'), inB = payIn('B');

  // Pots are committed money. Cowrywise moves on A; Goal 1 and the Buffer on B.
  // A "free" figure that ignores them is the kind of number that gets spent.
  const potsOn = (letter) => B.savings
    .filter(v => v.payday === letter)
    .reduce((a, v) => a + (v.schedule[MONTH] || 0), 0);
  const potsA = potsOn('A'), potsB = potsOn('B');

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

  const homeless = B.savings.filter(v => !v.account || /^NOT SET/i.test(v.account));
  const clashes = (() => {
    const byAcct = {};
    B.savings.forEach(v => {
      // Normalise to the INSTITUTION. "Cowrywise (locked)" and
      // "Cowrywise — created 2026-09-02" are the same place, and the whole
      // point of this callout is to say so.
      const raw = (v.account || '').trim();
      if (!raw || /^NOT SET/i.test(raw)) return;
      const a = raw.split(/\s+[—(]/)[0].replace(/[^A-Za-z0-9 ]/g, '').trim().toLowerCase();
      if (!a) return;
      (byAcct[a] = byAcct[a] || { label: raw.split(/\s+—/)[0].trim(), pots: [] }).pots.push(v.pot);
    });
    return Object.values(byAcct).filter(g => g.pots.length > 1);
  })();

  add(callout('warn', '\u26a0',
    ...clashes.map(g =>
      '<strong>' + g.pots.length + ' pots, one place \u2014 ' + g.label + '.</strong> ' +
      g.pots.join(' and ') + ' share it. Two pots that mean different things behind one ' +
      'balance, and a balance that means two things means neither.'),
    ...(homeless.length
      ? homeless.map(v => '<strong>' + v.pot + ' has no account.</strong> A pot with no home ' +
          'cannot be funded on payday.')
      : ['<strong>Every pot has a home.</strong> Nothing is waiting on an account to exist.'])));

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

  /* ------------------------------------------------------------ shopping */
  const SH = OS.shopping || {};
  if ((SH.buying || []).length) {
    const priced  = SH.buying.filter(i => i.amount && !i.held);
    const held    = SH.buying.filter(i => i.held);
    const noPrice = SH.buying.filter(i => !i.amount && !i.held);
    const byLine  = {};
    priced.forEach(i => { byLine[i.line] = (byLine[i.line] || 0) + i.amount; });

    add(h('h2', {}, 'Things to buy'));
    add(h('p', { class: 't-dim' }, SH.note || ''));

    add(h('div', { class: 'grid' },
      statCard('Buying this month', naira(priced.reduce((a, i) => a + i.amount, 0), { short: true }),
        priced.length + ' items, all inside a budget line', 'green'),
      statCard('Held back', held.length ? naira(held.reduce((a, i) => a + i.amount, 0), { short: true }) : '—',
        held.length ? held.map(i => i.item).join(', ') + ' — kept in the cushion' : 'nothing held', 'blue'),
      statCard('No price yet', String(noPrice.length + (SH.wishlist || []).filter(w => !w.amount).length),
        'unpriced items cannot be planned against a surplus', noPrice.length ? 'amber' : '')));

    add(h('div', { class: 'card pad-0', style: 'margin-top:10px' },
      table(['Item', { label: '₦', num: true }, 'Comes out of', 'Payday'],
        SH.buying.map(i => [
          h('span', {}, i.item,
            i.new ? h('span', { class: 'pill ok', style: 'margin-left:6px' }, 'new') : null,
            i.held ? h('span', { class: 'pill info', style: 'margin-left:6px' }, 'held') : null,
            i.note ? h('span', { class: 'sub' }, i.note) : null),
          i.amount ? naira(i.amount) : h('span', { class: 't-dim' }, '?'),
          i.line,
          h('span', { class: 'pill ' + (i.payday === 'A' ? 'ok' : 'info') }, i.payday || '—'),
        ]))));

    add(h('div', { class: 'card pad-0', style: 'margin-top:10px' },
      table(['Budget line', { label: 'This list takes', num: true }, { label: 'The line holds', num: true }],
        Object.keys(byLine).sort((a, b) => byLine[b] - byLine[a]).map(k => {
          const hold = planByCat[k] || 0;
          return [k, naira(byLine[k]),
            hold ? h('span', { class: 'v ' + (byLine[k] > hold ? 'red' : 'green') }, naira(hold))
                 : h('span', { class: 't-dim' }, '—')];
        }))));

    if (SH.buying_note) add(callout('ok', '✓', SH.buying_note));

    add(toggle('The wish list', 'only from spare cash, and only after every pot is funded',
      h('p', {}, SH.wishlist_note || ''),
      table(['Item', { label: '₦', num: true }, 'Note'],
        (SH.wishlist || []).map(w => [
          w.item,
          w.amount ? naira(w.amount) : h('span', { class: 't-dim' }, '?'),
          w.note || '',
        ]))));
  }

  add(toggle('The two paydays', 'the spine of the budget',
    h('p', {}, 'One batch, two dates. Payday A is the 70% landing at the end of the previous month ' +
      'and funds the 1st–14th. Payday B is the 30% landing around the 14th and funds the 15th to ' +
      'month end. ', h('strong', {}, 'The 30% is always the previous month\'s remaining batch, never a new one.')),
    table(['', 'Payday A — 70%', 'Payday B — 30%'], [
      ['Expected in', naira(inA), naira(inB)],
      ['Bills and one-offs', naira(paydayA), naira(paydayB)],
      ['Into the pots', naira(potsA), naira(potsB)],
      [h('strong', {}, 'Cushion'),
        h('strong', { class: 'v ' + (inA - paydayA - potsA < 0 ? 'red' : 'green') },
          naira(inA - paydayA - potsA)),
        h('strong', { class: 'v ' + (inB - paydayB - potsB < 0 ? 'red' : 'green') },
          naira(inB - paydayB - potsB))],
    ]),
    h('p', {}, h('strong', {}, 'The pots are committed money, so they are subtracted here. '),
      'Cowrywise moves on A; Goal 1 and the Buffer move on B. A cushion figure that ignores ' +
      'them is a number that gets spent twice.'),
    h('p', {}, h('strong', {}, 'Girlfriend moved to A '), '— she needs it at the start of the month ' +
      'for household essentials. ', h('strong', {}, 'Community admin moved to B '),
      '— he is paid mid-month.'),
    h('p', {}, h('strong', {}, 'And the front half got funded. '),
      'Feeding, transport, household and personal/misc used to sit entirely on Payday B, which left ' +
      'the 1st–14th with almost nothing to run on — and that already cost something real: he missed ' +
      'church on 30 August for want of ₦5,000. Each of those lines is now split, its front-half share ' +
      'on A and the remainder on B. ',
      h('strong', {}, 'Same monthly totals. The failure was the timing, not the size.')),
    OS.income.charge_note ? h('p', {}, h('strong', { class: 'v red' }, 'These figures are NET. '),
      OS.income.charge_note) : null));
})();
