/* Фразы: активное вспоминание готовых клише */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;
const ORDER = ['ph_daily1','ph_daily2','ph_news','ph_ecrit_intro','ph_ecrit_arg','ph_ecrit_nuance','ph_ecrit_conc','ph_lettre','ph_oral_mono','ph_oral_debat'];

App.pages.phrases = function (view, args) {
  const tid = args[0];
  if (!tid) {
    let html = '<div class="crumbs"><a href="#/practice">Практика</a> / фразы</div><h1 class="page-title">Фразы и клише</h1><p class="page-sub">Готовые «кирпичики» для письма и устной части. Задача — чтобы они выходили сами: «On peut alors se demander si…». Сначала читаешь вслух, потом вспоминаешь по-французски по русской подсказке.</p><div class="grid c2">';
    ORDER.forEach(id => {
      const t = SRS.Cards.topic(id); if (!t) return;
      const r = S().prog.phr[id];
      html += '<a class="task' + (r && r.done ? ' done' : '') + '" href="#/phrases/' + id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + esc(t.title) + '</div><div class="s">' + t.ids.length + ' фраз' + (r ? ' · лучший результат ' + Math.round((r.best || 0) * 100) + '%' : '') + '</div></span></a>';
    });
    view.innerHTML = html + '</div>'; App.setTitle('Фразы'); return;
  }
  const t = SRS.Cards.topic(tid);
  if (!t) { view.innerHTML = '<div class="sheet">Набор не найден.</div>'; return; }
  const ids = U.shuffle(t.ids);
  let queue = ids.slice(), round = 0, total = ids.length, remembered = 0, again = 0, phase = 'read', revealed = false, idx = 0;

  const draw = () => {
    if (phase === 'read') {
      const c = SRS.Cards.map[ids[idx]];
      view.innerHTML = '<div class="crumbs"><a href="#/phrases">Фразы</a> / ' + esc(t.title) + '</div><div class="session">' +
        '<div class="counts"><span>1. Читаем вслух · ' + (idx + 1) + ' / ' + ids.length + '</span></div>' +
        '<div class="sheet" style="text-align:center;padding:28px 16px"><div class="fr" style="font-size:1.55rem;font-weight:700;line-height:1.3">' + esc(c.fr) + '</div><div class="muted" style="margin-top:8px">' + esc(c.ru) + '</div>' +
        '<div class="row" style="justify-content:center;margin-top:14px"><button class="iconbtn" data-a="say" aria-label="Произнести">' + U.icon('speaker') + '</button><button class="iconbtn" data-a="slow" aria-label="Медленно">' + U.icon('clock') + '</button></div></div>' +
        '<p class="faint" style="text-align:center">Послушай, повтори вслух 2 раза.</p>' +
        '<div class="row" style="justify-content:center"><button class="btn" data-a="nextread">' + (idx + 1 < ids.length ? 'Дальше' : 'Перейти к проверке') + '</button></div></div>';
      U.speak(c.fr);
    } else if (phase === 'recall') {
      if (!queue.length) return done();
      const c = SRS.Cards.map[queue[0]];
      view.innerHTML = '<div class="crumbs"><a href="#/phrases">Фразы</a> / ' + esc(t.title) + '</div><div class="session">' +
        '<div class="counts"><span>2. Вспомни по-французски · осталось ' + queue.length + '</span></div>' +
        '<div class="sheet" style="text-align:center;padding:28px 16px"><div style="font-size:1.35rem;font-weight:600">' + esc(c.ru) + '</div>' +
        (revealed ? '<hr class="dash"><div class="fr" style="font-size:1.45rem;font-weight:700">' + esc(c.fr) + '</div><div class="row" style="justify-content:center;margin-top:12px"><button class="iconbtn" data-a="say" aria-label="Произнести">' + U.icon('speaker') + '</button></div>' : '<p class="faint" style="margin-top:12px">Скажи фразу вслух — потом проверь.</p>') + '</div>' +
        (revealed ? '<div class="row" style="justify-content:center"><button class="btn red" data-a="again">Ещё раз</button><button class="btn green" data-a="ok">Помню</button></div>' : '<div class="row" style="justify-content:center"><button class="btn" data-a="show">Показать ответ</button></div>') + '</div>';
    }
  };
  const done = () => {
    const pct = total ? Math.max(0, 1 - again / (total * 2)) : 1;
    const ev = Prog.done('phrases', tid, { pct, ok: true, info: { best: pct } });
    view.innerHTML = '<div class="session"><div class="sheet" style="text-align:center"><div class="hand" style="font-size:2.3rem;color:var(--red)">Bravo !</div><p>Повторов потребовалось: ' + again + '. Эти фразы теперь тоже в твоём общем повторении слов.</p><div class="row" style="justify-content:center"><a class="btn" href="#/phrases">К наборам</a><a class="btn ghost" href="#/today">На главную</a></div></div></div>';
    if (!S().prio.includes(tid) && !S().cards[t.ids[0]]) { S().prio.unshift(tid); Store.touch(); }
    App.celebrate(ev);
  };
  view.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    const cur = phase === 'read' ? SRS.Cards.map[ids[idx]] : SRS.Cards.map[queue[0]];
    if (a === 'say') U.speak(cur.fr);
    else if (a === 'slow') U.speak(cur.fr, { rate: 0.6 });
    else if (a === 'nextread') { idx++; if (idx >= ids.length) { phase = 'recall'; revealed = false; } draw(); }
    else if (a === 'show') { revealed = true; draw(); }
    else if (a === 'ok') { queue.shift(); remembered++; revealed = false; draw(); }
    else if (a === 'again') { const x = queue.shift(); queue.push(x); again++; revealed = false; draw(); }
  };
  draw(); App.setTitle('Фразы');
  return () => U.stopSpeak();
};
})();
