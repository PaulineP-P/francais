/* Аудирование: встроенные QCM (озвучка браузером) и задания «вживую» */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

App.pages.listen = function (view, args) {
  const id = args[0];
  if (!id) return list(view);
  if (/^xl/.test(id)) {
    const it = window.EXT_LISTEN.find(x => x.id === id);
    if (!it) { view.innerHTML = '<div class="sheet">Задание не найдено.</div>'; return; }
    window.ExtTask.render(view, it, 'listen_x', '#/listen', 'Аудирование'); App.setTitle('Аудирование'); return;
  }
  const idx = window.LISTENINGS.findIndex(x => x.id === id);
  if (idx < 0) { view.innerHTML = '<div class="sheet">Задание не найдено.</div>'; return; }
  return session(view, idx);
};

function list(view) {
  let html = '<div class="crumbs"><a href="#/practice">Практика</a> / аудирование</div><h1 class="page-title">Аудирование</h1>' +
    '<p class="page-sub">Тексты озвучивает голос твоего браузера — это удобная тренировка, но не замена настоящей речи: для реального уха ищи ресурсы в блоке «вживую» ниже.</p>' +
    '<h2>Тексты с вопросами (формат DELF)</h2><div class="grid c2">';
  window.LISTENINGS.forEach((l, i) => {
    const r = S().prog.listen[l.id];
    html += '<a class="task' + (r && r.done ? ' done' : '') + '" href="#/listen/' + l.id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + (i + 1) + '. ' + esc(l.title) + '</div><div class="s"><span class="lv ' + l.lvl + '">' + l.lvl + '</span> ' + esc(l.kind) + (r ? ' · лучший ' + Math.round((r.best || 0) * 100) + '%' : '') + '</div></span></a>';
  });
  html += '</div><h2 style="margin-top:24px">«Вживую»: настоящая речь</h2><div class="grid c2">';
  window.EXT_LISTEN.forEach(x => {
    const r = S().prog.ext[x.id];
    html += '<a class="task' + (r && r.done ? ' done' : '') + '" href="#/listen/' + x.id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + esc(x.t) + '</div></span></a>';
  });
  view.innerHTML = html + '</div>'; App.setTitle('Аудирование');
}

function session(view, idx) {
  const l = window.LISTENINGS[idx], next = window.LISTENINGS[idx + 1];
  const exam = Plan.phase(U.today()).id === 'P3' || Plan.phase(U.today()).id === 'P4';
  const maxPlays = l.q.length >= 4 ? 2 : 1;
  let plays = 0, limited = exam;
  const draw = () => {
    view.innerHTML = '<div class="crumbs"><a href="#/listen">Аудирование</a> / ' + (idx + 1) + '</div>' +
      '<div class="row between" style="align-items:flex-end"><h1 class="page-title">' + esc(l.title) + '</h1><span class="lv ' + l.lvl + '">' + l.lvl + ' · ' + esc(l.kind) + '</span></div>' +
      '<div class="sheet"><div class="tip-hand" style="margin-bottom:8px">Как на экзамене: сначала прочитай вопросы (1 минута), потом слушай.</div>' +
      '<div class="player"><button class="btn" data-a="play" id="pl">' + U.icon('play') + 'Слушать</button><button class="btn soft" data-a="stop">' + U.icon('stop') + 'Стоп</button><span class="muted" id="pc"></span></div>' +
      '<label class="switch" style="margin-bottom:8px"><input type="checkbox" id="lim"' + (limited ? ' checked' : '') + '><span>Режим экзамена: не больше ' + maxPlays + ' ' + U.plural(maxPlays, 'прослушивания', 'прослушиваний', 'прослушиваний') + '</span></label>' +
      '<div id="qbox"></div></div><div id="after"></div>' +
      (U.hasTTS() && U.frVoices().length === 0 ? '<p class="faint">Не нашла французский голос в этом браузере — звук может быть на другом языке. Включи французский голос в настройках системы или открой сайт в Chrome/Safari.</p>' : '');
    U.$('#lim', view).onchange = (e) => { limited = e.target.checked; upd(); };
    upd();
    window.QCM.render(U.$('#qbox', view), l.q, (r) => {
      const ev = Prog.done('listen', l.id, { pct: r.pct, ok: true, info: { best: Math.max(r.pct, (S().prog.listen[l.id] || {}).best || 0) } });
      App.celebrate(ev);
      U.$('#after', view).innerHTML = '<div class="sheet"><details class="fold"><summary>Показать текст</summary><div class="rtext" style="margin-top:10px">' + l.text.split('\n').map(s => '<p>' + esc(s) + '</p>').join('') + '</div></details>' +
        '<div class="row" style="margin-top:10px"><button class="btn soft" data-a="full">' + U.icon('speaker') + 'Послушать ещё раз с текстом</button>' + (next ? '<a class="btn" href="#/listen/' + next.id + '">Следующее</a>' : '') + '<a class="btn ghost" href="#/today">На главную</a></div></div>' + window.AddWord.html();
      window.AddWord.bind(U.$('#after', view));
      limited = false; upd();
    });
  };
  const upd = () => {
    const pc = U.$('#pc', view), pl = U.$('#pl', view); if (!pc) return;
    pc.textContent = 'прослушиваний: ' + plays + (limited ? ' из ' + maxPlays : '');
    pl.disabled = limited && plays >= maxPlays;
  };
  view.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b || b.dataset.a === 'submit') return;
    const a = b.dataset.a;
    if (a === 'play') { if (limited && plays >= maxPlays) return; plays++; upd(); U.speakScript(l.text, { rate: 0.9 }); }
    if (a === 'stop') { if (U._scriptStop) U._scriptStop(); U.stopSpeak(); }
    if (a === 'full') U.speakScript(l.text, { rate: 0.85 });
  };
  draw(); App.setTitle('Аудирование');
  return () => { if (U._scriptStop) U._scriptStop(); U.stopSpeak(); };
}
})();
