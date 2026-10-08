/* Грамматика: список уроков, урок, упражнения, закрепление */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

/* Общий движок упражнений с пропусками */
const ExUI = window.ExUI = {};
ExUI.render = (box, items, opts) => {
  opts = opts || {};
  let html = '';
  items.forEach((it, i) => {
    html += '<div class="exq" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span class="q">' + esc(it.q).replace(/_{3,}/g, '<b style="letter-spacing:2px">_____</b>') + (it.from ? ' <span class="lv" style="margin-left:6px">' + it.from + '</span>' : '') + '</span>' +
      '<input type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="Ответ ' + (i + 1) + '"><div class="corr" hidden></div></div>';
  });
  html += '<div class="row" style="margin-top:14px"><button class="btn" data-a="check">Проверить</button><span class="muted" id="exmsg"></span></div><div id="exres"></div>';
  box.innerHTML = html;
  const inputs = U.$$('input', box);
  inputs.forEach((inp, i) => inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); if (inputs[i + 1]) inputs[i + 1].focus(); else U.$('[data-a="check"]', box).click(); } }));
  let checked = false;
  box.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'check') {
      if (checked) return;
      if (inputs.every(x => !x.value.trim())) { U.toast('Заполни хотя бы несколько ответов'); return; }
      checked = true;
      let right = 0; const wrong = [];
      items.forEach((it, i) => {
        const row = U.$$('.exq', box)[i], inp = inputs[i], corr = U.$('.corr', row);
        const r = U.checkMulti(inp.value, it.a, it.alt);
        inp.disabled = true;
        if (r === 'ok' || r === 'accent') { right++; row.classList.add('ok'); if (r === 'accent') { corr.hidden = false; corr.textContent = 'Верно, но проверь диакритику: ' + it.a; } }
        else { row.classList.add('bad'); corr.hidden = false; corr.innerHTML = 'Правильно: <b>' + esc(it.a) + '</b>'; wrong.push(i); }
      });
      const pct = right / items.length;
      const note = pct >= 0.9 ? 'Excellent !' : pct >= 0.75 ? 'Très bien !' : pct >= 0.6 ? 'Bien, повтори ошибки.' : 'Ещё раз — перечитай теорию.';
      U.$('#exres', box).innerHTML = '<div class="sheet" style="margin-top:14px;text-align:center"><div class="hand" style="font-size:2.4rem;color:var(--red)">' + right + ' / ' + items.length + '</div><div class="hand" style="font-size:1.6rem">' + note + '</div></div>';
      if (opts.onDone) opts.onDone({ pct, right, total: items.length, wrong });
    }
  };
  setTimeout(() => { if (inputs[0] && !opts.noFocus) inputs[0].focus(); }, 80);
};

function lessonStatus(g) {
  const r = S().prog.grammar[g.id];
  if (!r) return { cls: '', label: 'не начат' };
  if (r.done) return { cls: 'green', label: 'пройден · ' + Math.round((r.best || 0) * 100) + '%' };
  return { cls: 'hl', label: 'в процессе · ' + Math.round((r.best || 0) * 100) + '%' };
}

App.pages.grammar = function (view, args) {
  const id = args[0];
  if (!id) return list(view);
  const idx = window.GRAMMAR.findIndex(g => g.id === id);
  if (idx < 0) { view.innerHTML = '<div class="sheet"><p>Урок не найден.</p><a class="btn" href="#/grammar">К списку</a></div>'; return; }
  return lesson(view, idx);
};

function list(view) {
  const done = Prog.countDone('grammar');
  let html = '<h1 class="page-title">Грамматика</h1><p class="page-sub">28 коротких уроков от нуля до B2: сначала теория на полстраницы, потом 8 упражнений. Пройден урок, если верно от 60%. Клик по французскому примеру — озвучка.</p>';
  html += '<div class="sheet"><div class="row between"><b>Пройдено ' + done + ' из ' + window.GRAMMAR.length + '</b><span class="muted">≈ ' + U.fmtMin(U.sum(window.GRAMMAR.filter(g => !(S().prog.grammar[g.id] || {}).done).map(g => g.min || 20))) + ' осталось</span></div><div class="bar green" style="margin-top:8px"><i style="width:' + Math.round(100 * done / window.GRAMMAR.length) + '%"></i></div></div>';
  ['A1', 'A2', 'B1', 'B2'].forEach(lv => {
    const gs = window.GRAMMAR.filter(g => g.lvl === lv);
    html += '<h2 style="margin:20px 0 8px"><span class="lv ' + lv + '" style="font-size:.9rem">' + lv + '</span></h2><div class="grid c2" style="gap:10px">';
    gs.forEach(g => {
      const s = lessonStatus(g), n = window.GRAMMAR.indexOf(g) + 1;
      html += '<a class="task' + (s.cls === 'green' ? ' done' : '') + '" href="#/grammar/' + g.id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + n + '. ' + esc(g.title) + '</div><div class="s">' + s.label + ' · ' + (g.min || 20) + ' мин</div></span></a>';
    });
    html += '</div>';
  });
  html += '<p style="margin-top:20px"><a class="btn soft" href="#/drill">Закрепление: смешанные упражнения</a></p>';
  view.innerHTML = html; App.setTitle('Грамматика');
}

function lesson(view, idx) {
  const g = window.GRAMMAR[idx];
  const prev = window.GRAMMAR[idx - 1], next = window.GRAMMAR[idx + 1];
  const rec = S().prog.grammar[g.id];
  view.innerHTML = '<div class="crumbs"><a href="#/grammar">Грамматика</a> / урок ' + (idx + 1) + '</div>' +
    '<div class="row between" style="align-items:flex-end"><h1 class="page-title">' + esc(g.title) + '</h1><span class="lv ' + g.lvl + '">' + g.lvl + '</span></div>' +
    '<div class="sheet theory" id="th"><h2>Теория</h2>' + g.theory + '</div>' +
    '<div class="sheet"><h2>Упражнения</h2><p class="muted">Впиши пропущенное. Если пропусков два, раздели ответы « / ». Enter — следующее поле.</p><div id="exbox"></div></div>' +
    '<div class="row between"><span>' + (prev ? '<a class="btn small ghost" href="#/grammar/' + prev.id + '">Предыдущий урок</a>' : '') + '</span><span>' + (next ? '<a class="btn small soft" href="#/grammar/' + next.id + '">Следующий урок</a>' : '') + '</span></div>';
  U.$('#th', view).onclick = (e) => { const t = e.target.closest('.ex, .fr'); if (t) U.speak(t.textContent); };
  ExUI.render(U.$('#exbox', view), g.ex, {
    noFocus: true,
    onDone: (r) => {
      const ev = Prog.done('grammar', g.id, { pct: r.pct, ok: r.pct >= 0.6 });
      App.celebrate(ev);
      if (r.pct >= 0.6) U.toast('Урок пройден');
      if (next && r.pct >= 0.6) U.$('#exres', view).insertAdjacentHTML('beforeend', '<p style="text-align:center"><a class="btn" href="#/grammar/' + next.id + '">Следующий урок</a></p>');
      U.$('#exres', view).insertAdjacentHTML('beforeend', '<p style="text-align:center"><button class="btn small ghost" onclick="App.render()">Пройти ещё раз</button></p>');
    }
  });
  App.setTitle(g.title);
}

/* Смешанное закрепление */
App.pages.drill = function (view) {
  const doneIds = window.GRAMMAR.filter(g => (S().prog.grammar[g.id] || {}).done).map(g => g.id);
  const pool = (doneIds.length ? window.GRAMMAR.filter(g => doneIds.includes(g.id)) : window.GRAMMAR.slice(0, 3));
  const seed = U.today() + ':' + doneIds.length + ':' + (S().prog.grammar._drill || 0);
  const items = [];
  U.shuffle(pool.flatMap(g => g.ex.map(e => Object.assign({ from: g.lvl + '·' + (window.GRAMMAR.indexOf(g) + 1) }, e))), seed).slice(0, 10).forEach(x => items.push(x));
  view.innerHTML = '<div class="crumbs"><a href="#/practice">Практика</a> / закрепление</div><h1 class="page-title">Закрепление</h1><p class="page-sub">10 случайных упражнений из пройденных уроков' + (doneIds.length ? '' : ' (пока уроков нет — берём первые три)') + '. Метка справа — из какого урока.</p><div class="sheet"><div id="exbox"></div></div>';
  ExUI.render(U.$('#exbox', view), items, {
    onDone: (r) => {
      App.celebrate(Prog.done('drill', 'mix', { pct: r.pct, ok: true }));
      S().prog.grammar._drill = (S().prog.grammar._drill || 0) + 1;
      U.$('#exres', view).insertAdjacentHTML('beforeend', '<p style="text-align:center"><a class="btn" href="#/drill?r=' + Date.now() + '">Ещё 10</a> <a class="btn ghost" href="#/today">На главную</a></p>');
    }
  });
  App.setTitle('Закрепление');
};
})();
