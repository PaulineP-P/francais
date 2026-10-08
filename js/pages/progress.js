/* Прогресс: серия, календарь, готовность по навыкам, значки, итоги недели */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

function meter(label, val, total, mark, note) {
  const pct = total ? Math.min(100, Math.round(100 * val / total)) : 0;
  return '<div class="meter"><span>' + esc(label) + '</span><div class="mk"><div class="bar green"><i style="width:' + pct + '%"></i></div>' + (mark != null ? '<em style="left:' + Math.min(99, mark) + '%" title="по плану к сегодняшнему дню"></em>' : '') + '</div><b>' + pct + '%</b></div>' + (note ? '<div class="faint" style="font-size:.82rem;margin:-4px 0 6px 140px">' + esc(note) + '</div>' : '');
}
function bars(vals, labels, h) {
  const max = Math.max(1, ...vals), W = 560, H = h || 100, n = vals.length, bw = W / n;
  return '<svg viewBox="0 0 ' + W + ' ' + (H + 16) + '" class="spark" style="height:' + (H + 16) + 'px" preserveAspectRatio="none" role="img">' + vals.map((v, i) => { const hh = Math.round(v / max * H); return '<rect x="' + (i * bw + 3) + '" y="' + (H - hh) + '" width="' + (bw - 6) + '" height="' + hh + '" rx="3" fill="' + (i === 0 ? 'var(--red)' : 'var(--blue)') + '" opacity="' + (v ? 1 : 0.15) + '"/>' + (labels && n <= 16 ? '<text x="' + (i * bw + bw / 2) + '" y="' + (H + 13) + '" font-size="11" text-anchor="middle" fill="var(--ink-3)">' + labels[i] + '</text>' : ''); }).join('') + '</svg>';
}
function avgBest(kind) { const v = Object.values(S().prog[kind] || {}).filter(r => r.done && r.best != null); return v.length ? Math.round(100 * U.sum(v.map(r => r.best)) / v.length) : null; }

App.pages.progress = function (view) {
  const dk = U.today(), st = S().settings, sk = Streak.compute();
  const days = Plan.daysToExam(dk), stats = SRS.stats();
  const spanTotal = Math.max(1, U.diffDays(st.startDate, U.addDays(st.examDate, -14)));
  const f = U.clamp(U.diffDays(st.startDate, dk) / spanTotal, 0, 1) * 100;
  const gram = Prog.countDone('grammar'), wr = Prog.countDone('write'), sp = Prog.countDone('speak');
  const writeTotal = Plan.writeCandidates('P1').length, speakTotal = Plan.speakCandidates('P1').length;

  /* календарь: 17 недель, заканчивая текущей */
  const weeksBack = 16, startW = U.addDays(U.weekStart(dk), -7 * weeksBack);
  let heat = '';
  for (let w = 0; w <= weeksBack; w++) for (let d = 0; d < 7; d++) {
    const k = U.addDays(startW, w * 7 + d), sc = Score.day(k);
    let cls = '', t = U.ruShort(k);
    if (k > dk) cls = ' fut'; else if (Score.active(k)) { cls = sc.note >= 18 ? ' l4' : sc.note >= 13 ? ' l3' : sc.note >= 8 ? ' l2' : ' l1'; t += ': ' + sc.note + '/20'; } else if (sk.frozen.includes(k)) { cls = ' joker'; t += ': джокер'; }
    if (k === dk) cls += ' today';
    heat += '<i class="' + cls.trim() + '" title="' + t + '"></i>';
  }
  /* оценки за 30 дней */
  const notes = []; for (let i = 29; i >= 0; i--) notes.push(Score.day(U.addDays(dk, -i)).note);
  const mins7 = [], lab7 = []; for (let i = 6; i >= 0; i--) { const k = U.addDays(dk, -i), d = S().days[k]; mins7.push(d ? Math.round((d.ms || 0) / 60000) : 0); lab7.push(U.DAYS_RU_SHORT[U.dow(k)]); }
  const fc = SRS.forecast(14), fcl = fc.map((_, i) => i === 0 ? 'сег' : '+' + i);
  const ret = SRS.retention(30);
  const lis = avgBest('listen'), rea = avgBest('read'), dic = avgBest('dict');

  let html = '<h1 class="page-title">Успех</h1><p class="page-sub">Смотри на тенденцию, а не на отдельный день. Медленный рост — всё равно рост.</p>';
  html += '<div class="grid c3"><section class="sheet"><div class="stat"><b>' + sk.cur + '</b><small>дней подряд</small></div><div class="muted" style="margin-top:6px">лучшая серия: ' + sk.best + ' · джокеров ❄: ' + sk.jokers + '</div></section>' +
    '<section class="sheet"><div class="stat"><b>' + sk.total + '</b><small>активных дней всего</small></div><div class="muted" style="margin-top:6px">за 7 дней: ' + U.sum(Array.from({ length: 7 }, (_, i) => Score.active(U.addDays(dk, -i)) ? 1 : 0)) + ' из 7</div></section>' +
    '<section class="sheet"><div class="stat"><b>' + stats.known + '</b><small>слов в памяти</small></div><div class="muted" style="margin-top:6px">надолго: ' + stats.mature + (stats.custom ? ' · своих: ' + stats.custom : '') + '</div></section></div>';
  html += '<section class="sheet"><h2>Календарь</h2><div class="heat">' + heat + '</div><p class="faint" style="font-size:.85rem;margin:6px 0 0">Каждая клетка — день, цвет — оценка. Синяя — сработал джокер. Воскресенья можно пропускать.</p></section>';

  html += '<section class="sheet"><h2>Готовность по навыкам</h2><p class="muted">Чёрная черта — где ты должна быть по плану к сегодняшнему дню (всё готово за 2 недели до экзамена).</p>' +
    meter('Слова', stats.seenBuiltin, stats.totalBuiltin, f, stats.known + ' в активной памяти') +
    meter('Грамматика', gram, window.GRAMMAR.length, f) +
    meter('Диктанты', Prog.countDone('dict'), window.DICTATIONS.length, f, dic != null ? 'средний результат ' + dic + '%' : '') +
    meter('Аудирование', Prog.countDone('listen'), window.LISTENINGS.length, f, lis != null ? 'средний результат ' + lis + '%' : '') +
    meter('Чтение', Prog.countDone('read'), window.READINGS.length, f, rea != null ? 'средний результат ' + rea + '%' : '') +
    meter('Письмо', wr, writeTotal, f) + meter('Речь', sp, speakTotal, f) + '</section>';

  html += '<div class="grid c2"><section class="sheet"><h3>Оценки за 30 дней</h3>' + window.spark(notes, 20, null, 14) + '<p class="faint" style="font-size:.85rem;margin:4px 0 0">Пунктир — «хороший день» (14/20).</p></section>' +
    '<section class="sheet"><h3>Минуты за неделю</h3>' + bars(mins7, lab7, 90) + '<p class="faint" style="font-size:.85rem;margin:4px 0 0">Считаются только активные минуты на сайте.</p></section></div>';

  html += '<div class="grid c2"><section class="sheet"><h3>Слова: прогноз повторений</h3>' + bars(fc, fcl, 90) + '<p class="muted" style="margin:6px 0 0">Удержание за 30 дней: <b>' + (ret != null ? Math.round(ret * 100) + '%' : '—') + '</b> (цель 80–90%).</p></section>' +
    '<section class="sheet"><h3>Состав памяти</h3>' + [['Учатся', stats.learn, 'var(--red)'], ['В памяти', stats.young, 'var(--hl)'], ['Надолго (≥ 21 дня)', stats.mature, 'var(--green)'], ['Не открыто', stats.unseen, 'var(--line)']].map(x => '<div class="row" style="gap:8px;margin:6px 0"><span class="dot" style="background:' + x[2] + '"></span><span style="flex:1">' + x[0] + '</span><b>' + x[1] + '</b></div>').join('') + '</section></div>';

  /* дорожная карта */
  const ex = st.examDate, p4 = U.addDays(ex, -9), p3 = U.addDays(ex, -44);
  const phases = [['Фундамент', st.startDate, '2026-11-30', 'A1 → B1: слова, основа грамматики, диктанты'], ['B2: глубина', '2026-12-01', U.addDays(p3, -1), 'Темы экологии и общества, письмо и речь'], ['Формат экзамена', p3, U.addDays(p4, -1), 'Сроки как на экзамене, суббота — пробный'], ['Финиш', p4, ex, 'Разгрузка, 3 пробных, чек-лист']];
  html += '<section class="sheet"><h2>Дорожная карта до экзамена</h2>' + phases.map(p => { const now = dk >= p[1] && dk <= p[2]; return '<div class="row" style="gap:12px;margin:8px 0;padding:8px 10px;border-radius:10px;' + (now ? 'background:var(--hl-soft);border:1.5px solid var(--hl)' : 'border:1.5px solid var(--line-2)') + '"><b style="min-width:128px">' + p[0] + '</b><span class="muted" style="flex:1 1 200px">' + p[3] + '</span><span class="faint">' + U.ruShort(p[1]) + ' – ' + U.ruShort(p[2]) + '</span></div>'; }).join('') +
    '<p class="muted">Экзамен: <b>' + U.ruLong(ex) + '</b> (' + (days >= 0 ? 'через ' + days + ' ' + U.plural(days, 'день', 'дня', 'дней') : 'прошёл') + '). Если дата изменится — поправь её в «Ещё → Настройки», план пересчитается.</p></section>';

  html += '<section class="sheet"><div class="row between"><h2 style="margin:0">Значки</h2><span class="muted">' + Object.keys(S().badges).length + ' из ' + Score.BADGES.length + '</span></div><div class="badges" style="margin-top:10px">' +
    Score.BADGES.map(b => '<div class="bd ' + (S().badges[b.id] ? 'on' : '') + '"><b>' + esc(b.name) + '</b><small>' + esc(b.desc) + '</small></div>').join('') + '</div></section>';
  html += '<p class="row"><a class="btn soft" href="#/week">Итоги недели</a><a class="btn soft" href="#/exam">Пробные экзамены</a></p>';
  view.innerHTML = html; App.setTitle('Успех');
};

/* Итоги недели */
App.pages.week = function (view, args, q) {
  const dk = U.today();
  const ws = q.w || (U.dow(dk) === 6 ? U.weekStart(dk) : U.weekStart(dk));
  const w = Score.week(ws), prev = Score.week(U.addDays(ws, -7));
  const ev = Prog.viewedBulletin(); App.celebrate(ev);
  const ph = Plan.phase(U.addDays(ws, 7));
  const good = [], todo = [];
  if (w.active >= 5) good.push('Занималась ' + w.active + ' дней из 7 — это сильная неделя.'); else if (w.active >= 3) good.push('Ты была на связи ' + w.active + ' дня — этого достаточно, чтобы идти вперёд.');
  if (w.news >= 20) good.push('Новых слов за неделю: ' + w.news + '.');
  if (w.retention != null && w.retention >= 0.85) good.push('Слова держатся отлично: удержание ' + Math.round(w.retention * 100) + '%.');
  if (prev.avg && w.avg > prev.avg) good.push('Средняя оценка выросла: ' + prev.avg + ' → ' + w.avg + '.');
  if (w.active <= 2) todo.push('Мало активных дней. Включай режим «минимум»: 10 минут каждый день лучше, чем час раз в неделю.');
  if (w.retention != null && w.retention < 0.7) todo.push('Слова забываются (удержание ' + Math.round(w.retention * 100) + '%). Уменьши число новых слов в настройках и чаще повторяй вслух.');
  if (!(w.kinds.write || w.kinds.speak)) todo.push('На этой неделе не было ни письма, ни речи. Это самые важные навыки экзамена.');
  if (!good.length) good.push('Каждая неделя — это шаг. Главное, что ты открыла сайт.');
  const total = U.sum(w.days.map(d => d.act ? 1 : 0));
  view.innerHTML = '<div class="crumbs"><a href="#/progress">Успех</a> / итоги недели</div><h1 class="page-title">Bulletin de la semaine</h1><p class="page-sub">' + U.ruShort(ws) + ' – ' + U.ruShort(U.addDays(ws, 6)) + '</p>' +
    '<div class="sheet ruled"><div class="week">' + w.days.map((d, i) => '<div class="d ' + (d.act ? 'ok' : d.joker ? 'joker' : '') + (d.rest ? ' rest' : '') + (d.today ? ' today' : '') + '">' + U.DAYS_RU_SHORT[i] + '<i>' + (d.act ? d.note : d.joker ? '❄' : '·') + '</i></div>').join('') + '</div></div>' +
    '<div class="grid c3"><div class="sheet stat"><b>' + w.active + '/7</b><small>активных дней</small></div><div class="sheet stat"><b>' + (w.avg || '—') + '</b><small>средняя оценка из 20</small></div><div class="sheet stat"><b>' + w.minutes + '</b><small>минут на сайте</small></div>' +
    '<div class="sheet stat"><b>' + w.news + '</b><small>новых слов</small></div><div class="sheet stat"><b>' + w.rev + '</b><small>повторений</small></div><div class="sheet stat"><b>' + (w.retention != null ? Math.round(w.retention * 100) + '%' : '—') + '</b><small>удержание слов</small></div></div>' +
    '<div class="sheet"><h3>Что получилось</h3><ul>' + good.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' + (todo.length ? '<h3>На что обратить внимание</h3><ul>' + todo.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + '</div>' +
    '<div class="sheet"><h3>Следующая неделя</h3><p class="muted">Фаза: <b>' + esc(ph.name) + '</b>. Заходи каждый день: слова + одно-два задания. В воскресенье можно отдыхать.</p></div>' +
    '<p class="row"><a class="btn small ghost" href="#/week?w=' + U.addDays(ws, -7) + '">Предыдущая неделя</a>' + (U.addDays(ws, 7) <= dk ? '<a class="btn small ghost" href="#/week?w=' + U.addDays(ws, 7) + '">Следующая</a>' : '') + '</p>';
  App.setTitle('Итоги недели');
};
})();
