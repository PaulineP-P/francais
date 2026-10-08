/* Чтение: сначала вопросы, потом текст */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

App.pages.read = function (view, args) {
  const id = args[0];
  if (!id) {
    let html = '<div class="crumbs"><a href="#/practice">Практика</a> / чтение</div><h1 class="page-title">Чтение</h1><p class="page-sub">Тексты в формате DELF B2: informatif и argumentatif, вопросы QCM. Привычка №1 — сначала вопросы, потом текст: так ты ищешь ответы, а не читаешь всё подряд.</p><div class="grid c2">';
    window.READINGS.forEach((r, i) => {
      const rec = S().prog.read[r.id];
      html += '<a class="task' + (rec && rec.done ? ' done' : '') + '" href="#/read/' + r.id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + (i + 1) + '. ' + esc(r.title) + '</div><div class="s"><span class="lv ' + r.lvl + '">' + r.lvl + '</span> ' + r.kind + (rec ? ' · лучший ' + Math.round((rec.best || 0) * 100) + '%' : '') + '</div></span></a>';
    });
    html += '</div><h2 style="margin-top:24px">«Вживую»: настоящие статьи</h2><div class="grid c2">';
    window.EXT_READ.forEach(x => { const r = S().prog.ext[x.id]; html += '<a class="task' + (r && r.done ? ' done' : '') + '" href="#/read/' + x.id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + esc(x.t) + '</div></span></a>'; });
    view.innerHTML = html + '</div>'; App.setTitle('Чтение'); return;
  }
  if (/^xr/.test(id)) {
    const it = window.EXT_READ.find(x => x.id === id);
    if (!it) { view.innerHTML = '<div class="sheet">Задание не найдено.</div>'; return; }
    window.ExtTask.render(view, it, 'read_x', '#/read', 'Чтение'); App.setTitle('Чтение'); return;
  }
  const idx = window.READINGS.findIndex(x => x.id === id);
  if (idx < 0) { view.innerHTML = '<div class="sheet">Текст не найден.</div>'; return; }
  const r = window.READINGS[idx], next = window.READINGS[idx + 1];
  const words = U.countWords(r.text), target = Math.round(words / 90 * 60) + 120; // ориентир: ~90 слов/мин с вопросами
  let timer = null;
  view.innerHTML = '<div class="crumbs"><a href="#/read">Чтение</a> / ' + (idx + 1) + '</div>' +
    '<div class="row between" style="align-items:flex-end"><h1 class="page-title">' + esc(r.title) + '</h1><span class="lv ' + r.lvl + '">' + r.lvl + ' · ' + r.kind + '</span></div>' +
    '<div class="sheet"><div class="row between"><span class="tip-hand">Шаг 1. Прочитай вопросы — угадай, о чём текст.</span><span class="row" style="gap:8px"><span class="pill">≈ ' + U.fmtClock(target) + ' на текст</span><span class="timer" id="tm" style="font-size:1.4rem">00:00</span></span></div><div id="qbox" style="margin-top:6px"></div></div>' +
    '<div class="sheet" id="tx"><div class="row"><button class="btn" data-a="show">Шаг 2. Показать текст и включить таймер</button></div></div><div id="after"></div>';
  timer = window.Timer.create(U.$('#tm', view), 0, { up: true });
  const qb = U.$('#qbox', view);
  window.QCM.render(qb, r.q, (res) => {
    timer.stop();
    const mins = Math.round(timer.elapsed / 60 * 10) / 10;
    const ev = Prog.done('read', r.id, { pct: res.pct, ok: true, info: { best: Math.max(res.pct, (S().prog.read[r.id] || {}).best || 0) } });
    App.celebrate(ev);
    U.$('#after', view).innerHTML = '<div class="sheet"><p class="muted">Время: ' + (timer.elapsed ? mins + ' мин' : '—') + '. Ориентир на экзамене — 25–30 минут на один текст.</p>' +
      '<div class="row">' + (next ? '<a class="btn" href="#/read/' + next.id + '">Следующий текст</a>' : '') + '<a class="btn ghost" href="#/today">На главную</a></div></div>' + window.AddWord.html();
    window.AddWord.bind(U.$('#after', view));
    showText();
  });
  const showText = () => {
    U.$('#tx', view).innerHTML = '<div class="rtext">' + r.text.split('\n').map(p => '<p>' + esc(p) + '</p>').join('') + '</div>' +
      '<div class="row" style="margin-top:6px"><button class="iconbtn" data-a="say" aria-label="Озвучить">' + U.icon('speaker') + '</button><span class="faint" style="font-size:.85rem">Можно прослушать, как звучит текст.</span></div>';
  };
  view.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'show') { showText(); timer.start(); }
    if (b.dataset.a === 'say') U.speak(r.text, { rate: 0.95 });
  };
  App.setTitle('Чтение');
  return () => { timer.stop(); U.stopSpeak(); };
};
})();
