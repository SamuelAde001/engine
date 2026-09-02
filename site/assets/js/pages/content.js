/* Samuelsignals OS — Content & Audience. */

(function () {
  const S = window.SS, K = window.SSCharts, OS = S.OS;
  const { h, pct, num, dateLabel, daysUntil, daysLabel, statCard, callout,
          toggle, table, pageHead, note, legend, bar, doc } = S;

  S.chrome('content');
  if (!S.guard()) return;
  const M = document.getElementById('main');
  const add = (...n) => n.flat().forEach(x => x && M.appendChild(x));

  const C = OS.content;
  const goal = OS.goals.find(g => g.id === 'wednesdays');

  add(pageHead('Content & Audience', 'Depth over volume. The cadence is the point.',
    'His own reading of his own posted content: <em>"it is when I focus and put in time in one ' +
    'video does it get views and reach... if I focus on quality, I get feedbacks and follows."</em>'));

  add(h('div', { class: 'grid g4 tight' },
    statCard('Wednesdays shipped', `${goal.current} / ${goal.target}`, 'consecutive, no miss', 'red'),
    statCard('Instagram', num(C.instagram), 'followers', 'pink'),
    statCard('TikTok', num(C.tiktok), 'followers', 'pink'),
    statCard('Weeks banked', '0 / 18', 'cadence has not run once', 'amber')));

  add(h('div', { style: 'margin-top:14px' }, callout('warn', '\u{1F3AF}',
    '<strong>5,000 is an AMBITION, not a SMART goal.</strong> 460 → 5,000 on Instagram in four ' +
    'months is roughly 11x. At one post a week that fails the R in SMART. His goal stays in his ' +
    'file — but the version underneath it is the one that gets scored:',
    '<strong>18 consecutive Wednesdays without a miss, between now and 31 December.</strong>',
    'Followers are the outcome. <strong>The cadence is the input. Score the input.</strong>')));

  add(h('h2', {}, 'The 18 Wednesdays'));
  const streakHost = h('div');
  add(h('div', { class: 'card' },
    h('div', { class: 'card-h' }, h('h3', {}, 'Every Wednesday to 31 December'),
      h('span', { class: 'sub' }, `${goal.current} of ${goal.target}`)),
    streakHost,
    legend([[K.COLOURS.green, 'Shipped'], [K.COLOURS.red, 'Missed'], ['#1e2632', 'Still to come']]),
    note('<strong>Missing the TIME counts as missing the week.</strong> A video that goes up ' +
      'Thursday is a missed week. The video is banked on Tuesday — publish day contains zero ' +
      'production, and that rule exists because of 25 Aug, when a deliverable due 6:20pm went out ' +
      'at 1:42am.')));

  const cells = [];
  const d = new Date(C.cadence_start + 'T00:00:00');
  for (let i = 0; i < 18; i++) {
    const iso = d.toISOString().slice(0, 10);
    const past = daysUntil(iso) < 0;
    cells.push({
      state: past ? 'miss' : 'future',
      tick: i % 3 === 0 ? String(d.getDate()) : '',
      label: `Week ${i + 1} — ${iso}`,
    });
    d.setDate(d.getDate() + 7);
  }
  K.streak(streakHost, cells, { cell: 26 });

  add(callout('bad', '\u{1F6A9}',
    '<strong>Week 1 was missed. P1 is confirmed, not a candidate.</strong> Nothing was ideated, ' +
    'scripted, filmed, edited or banked for Wed 2 Sep, and no Content #1 tasks were ever created.',
    '<strong>That is three consecutive weeks at zero</strong> — 24 Aug (all three tasks deleted), ' +
    'the week of 25–31 Aug, and this one. The afternoon-block override failed its own test every ' +
    'week since it was written: eaten twice in a week meant it went back to mornings.',
    '<strong>Content is being redesigned in a separate conversation (2 Sep).</strong> Nothing here ' +
    'pre-empts that. The one constraint the new design must meet: it has to survive a week like ' +
    '11–13 Sep, because the old one could not survive an ordinary Tuesday.'));

  add(h('h2', {}, 'The weekly pipeline'));
  add(h('div', { class: 'card pad-0' },
    table(['Day', 'Phase', { label: 'Hours', num: true }, 'Block'],
      C.pipeline.map(p => [
        h('strong', { class: p.day === 'Wednesday' ? 'v pink' : '' }, p.day),
        p.phase, p.hours || '—', p.block,
      ]))));

  add(h('div', { style: 'margin-top:12px' }, callout('warn', '\u{1F9EA}',
    '<strong>THE LIVE TEST.</strong> Blocks moved from morning to afternoon on 26 Aug at his ' +
    'instruction — his reason: client edits own his mornings almost every day.',
    'The objection was stated and overruled: <strong>the afternoon is exactly where the tiebreak ' +
    'gets lost, which was the whole reason for the morning slot.</strong>',
    '<strong>If the afternoon content block is eaten by client work twice in one week, the override ' +
    'was wrong and it goes back to mornings without further debate.</strong> That was the deal. ' +
    'The weekly review states the count every week.')));

  add(h('h2', {}, 'Community and mentorship'));
  add(h('div', { class: 'grid g3' },
    statCard('HighSignals community', num(C.community_members), 'members, currently free'),
    statCard('Mentees', num(C.mentees), 'unpaid, ad hoc, ~1h/week'),
    statCard('Community admin', '₦15,000', 'per month — not a cost-cutting target')));

  add(h('div', { style: 'margin-top:12px' }, callout('info', '\u{1F4CC}',
    '<strong>Wednesday is heavy.</strong> The video publishes at 7:00pm and the community teaching ' +
    'runs 8:30pm the same night. Flagged, not moved — it is his slot.',
    'The ₦15,000 admin is <strong>the cheapest line in the whole budget and the reason the ' +
    'community did not die during the 25 Aug death march.</strong> Do not cut it to save money.')));

  add(h('h2', {}, 'context/audience.md'));
  add(doc('audience'));
})();
