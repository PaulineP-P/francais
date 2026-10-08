/* Письмо: редактор, счётчик слов, таймер, «красная ручка», модель */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

function findItem(id) {
  if (/^w\d+/.test(id)) { const p = window.WRITE_PROMPTS.find(x => x.id === id); return p && { id, kind: 'prompt', lvl: p.lvl, t: p.t, words: p.words, hint: p.hint, fmt: /lettre formelle|écrivez à un hôtel/i.test(p.t) ? 'letter' : (p.lvl === 'B1' ? 'essay' : 'free') }; }
  if (/^t\d+/.test(id)) { const tp = window.TOPICS.find(x => 't' + x.id === id); if (!tp) return null; const lab = tp.kindLabel || ''; return { id, kind: 'topic', lvl: 'B2', t: tp.q, words: 250, topic: tp, fmt: /LETTRE/.test(lab) ? 'letter' : 'essay', label: lab.replace(/^ПИСЬМО — |^УСТНО — /, '') }; }
  if (/^x\d+/.test(id)) { const x = window.B2_EXTRA.find(e => e.id === id); return x && { id, kind: 'extra', lvl: 'B2', t: x.t, words: 250, fmt: 'essay', label: 'ESSAI ARGUMENTÉ' }; }
  return null;
}

App.pages.write = function (view, args) {
  const id = args[0];
  if (!id) return list(view);
  const it = findItem(id);
  if (!it) { view.innerHTML = '<div class="sheet">Задание не найдено. <a href="#/write">К списку</a></div>'; return; }
  return editor(view, it);
};

function list(view) {
  const prompts = window.WRITE_PROMPTS, topics = window.TOPICS.filter(t => t.mode === 'ecrit'), extra = window.B2_EXTRA.filter(x => x.kind === 'ecrit');
  const row = (href, title, sub, id) => { const r = S().prog.write[id]; return '<a class="task' + (r && r.done ? ' done' : '') + '" href="' + href + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + esc(title) + '</div><div class="s">' + sub + (r ? ' · ' + (r.words || 0) + ' сл.' : '') + '</div></span></a>'; };
  let html = '<div class="crumbs"><a href="#/practice">Практика</a> / письмо</div><h1 class="page-title">Письмо</h1><p class="page-sub">На экзамене — 1 час, минимум 250 слов, структура и связки решают всё. «Красная ручка» проверяет объём, абзацы, связки, пример, нюанс и типичные ошибки русскоязычных. Это подсказка, не замена преподавателя.</p>';
  html += '<h2>Разогрев: A1–B1</h2><div class="grid c2">' + prompts.map(p => row('#/write/' + p.id, p.t, '<span class="lv ' + p.lvl + '">' + p.lvl + '</span> ≥ ' + p.words + ' сл.', p.id)).join('') + '</div>';
  html += '<h2 style="margin-top:24px">B2: эссе, письма, статьи (≥ 250 слов)</h2><div class="grid c2">' + topics.map(t => row('#/write/t' + t.id, t.q, (t.kindLabel || '').replace('ПИСЬМО — ', ''), 't' + t.id)).join('') + extra.map(x => row('#/write/' + x.id, x.t, 'ESSAI', x.id)).join('') + '</div>';
  view.innerHTML = html; App.setTitle('Письмо');
}

function argsBlock(tp) {
  const li = a => a.map(x => '<li>' + esc(x) + '</li>').join('');
  return '<div class="args"><div class="pro"><span class="tg">ЗА</span><ul>' + li(tp.pour) + '</ul></div><div class="con"><span class="tg">ПРОТИВ</span><ul>' + li(tp.contre) + '</ul></div><div><span class="tg">Реальные примеры</span><ul>' + li(tp.ex) + '</ul></div></div>';
}
function clicheBlock() {
  const ids = ['ph_ecrit_intro', 'ph_ecrit_arg', 'ph_ecrit_nuance', 'ph_ecrit_conc'];
  return ids.map(i => { const t = SRS.Cards.topic(i); if (!t) return ''; return '<h4 style="margin:10px 0 4px">' + esc(t.title.replace('Письмо: ', '')) + '</h4><ul style="margin:0;padding-left:1.1em">' + t.ids.slice(0, 7).map(c => '<li class="fr">' + esc(SRS.Cards.map[c].fr) + '</li>').join('') + '</ul>'; }).join('');
}

function editor(view, it) {
  const rec = S().prog.write[it.id] || {};
  const advanced = it.lvl === 'B2';
  const secs = advanced ? 3600 : (it.words >= 100 ? 1500 : 1200);
  let touched = false, saveT = null;
  view.innerHTML = '<div class="crumbs"><a href="#/write">Письмо</a> / ' + esc(it.id) + '</div>' +
    '<div class="row between" style="align-items:flex-end"><h1 class="page-title" style="max-width:34ch">' + esc(it.t) + '</h1><span class="lv ' + it.lvl + '">' + it.lvl + (it.label ? ' · ' + esc(it.label) : '') + '</span></div>' +
    '<div class="sheet"><div class="row between" style="margin-bottom:8px"><div><span class="counter" id="wc">0 слов</span> <span class="muted">из ' + it.words + (advanced ? ' (идеально 250–300)' : '') + '</span></div><div class="row" style="gap:10px"><span class="timer" id="tm" style="font-size:1.6rem">' + U.fmtClock(secs) + '</span><button class="btn small soft" id="tmb">Старт</button></div></div>' +
    (it.hint ? '<p class="tip-hand" style="margin:0 0 8px">Подсказка: ' + esc(it.hint) + '</p>' : '') +
    (advanced ? '<p class="tip-hand" style="margin:0 0 8px">План: введение (accroche + проблематика + позиция) → 2 аргумента с примерами → нюанс → заключение.</p>' : '') +
    '<textarea id="ta" rows="' + (advanced ? 16 : 9) + '" placeholder="Пиши здесь…" autocapitalize="sentences" spellcheck="false" style="font-family:var(--f-fr);font-size:1.08rem">' + esc(rec.draft || rec.text || '') + '</textarea>' +
    '<div class="row" style="margin-top:10px"><button class="btn" data-a="pen">Проверить красной ручкой</button><button class="btn green" data-a="done">Готово — сдаю</button><span class="muted" id="sv"></span></div><div id="penres"></div></div>' +
    (it.topic ? '<details class="sheet fold"><summary>Подсмотреть аргументы и примеры (сначала попробуй без них)</summary><div style="margin-top:8px">' + argsBlock(it.topic) + '</div></details>' : '') +
    (advanced ? '<details class="sheet fold"><summary>Шпаргалка клише</summary>' + clicheBlock() + '</details>' : '') +
    '<div id="model"></div>';
  const ta = U.$('#ta', view), wc = U.$('#wc', view);
  const timer = window.Timer.create(U.$('#tm', view), secs, { onEnd: () => U.toast('Время вышло. На экзамене ты бы сдавала работу.') });
  const upd = () => {
    const n = U.countWords(ta.value);
    wc.textContent = n + ' ' + U.plural(n, 'слово', 'слова', 'слов');
    wc.className = 'counter ' + (n >= it.words ? 'ok' : n < it.words * 0.5 ? 'low' : '');
  };
  const draft = () => { const r = S().prog.write[it.id] || (S().prog.write[it.id] = { tries: 0 }); r.draft = ta.value; r.words = U.countWords(ta.value); Store.touch(); U.$('#sv', view).textContent = 'черновик сохранён'; };
  ta.addEventListener('input', () => { upd(); if (!timer.running && !touched && ta.value.length > 3) { touched = true; timer.start(); U.$('#tmb', view).textContent = 'Пауза'; } clearTimeout(saveT); saveT = setTimeout(draft, 900); });
  U.$('#tmb', view).onclick = () => { if (timer.running) { timer.stop(); U.$('#tmb', view).textContent = 'Старт'; } else { timer.start(); U.$('#tmb', view).textContent = 'Пауза'; } };
  upd();
  const showPen = () => {
    const r = Pen.review(ta.value, { words: it.words, kind: it.fmt, level: it.lvl });
    U.$('#penres', view).innerHTML = '<div class="pen"><h3>Красная ручка</h3><ul>' + r.bad.map(x => '<li class="n">' + esc(x) + '</li>').join('') + r.ok.map(x => '<li class="y">' + esc(x) + '</li>').join('') + '</ul><p class="faint" style="font-size:.85rem">Автоматические подсказки по формальным признакам. Грамматику и смысл проверь сама или покажи преподавателю.</p></div>';
    return r;
  };
  view.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'pen') { if (U.countWords(ta.value) < 3) { U.toast('Сначала напиши текст'); return; } showPen(); }
    if (b.dataset.a === 'done') {
      const n = U.countWords(ta.value);
      if (n < it.words * 0.9) { U.toast('Нужно ещё ' + (Math.ceil(it.words * 0.9) - n) + ' слов (минимум 90% от объёма).'); return; }
      const r = showPen(); timer.stop();
      const ratio = r.ok.length / Math.max(1, r.ok.length + r.bad.length);
      const wr = S().prog.write[it.id] || (S().prog.write[it.id] = { tries: 0 });
      wr.text = ta.value; wr.draft = ''; wr.words = n; wr.best = Math.max(wr.best || 0, ratio);
      const ev = Prog.done('write', it.id, { pct: 0.5 + 0.5 * ratio, ok: true, info: { text: ta.value, words: n, draft: '' } });
      App.celebrate(ev);
      const model = it.topic && it.topic.text ? '<details class="sheet fold" open><summary>Модель для сравнения (не заучивай дословно)</summary><div class="model" style="margin-top:8px">' + it.topic.text.split('\n').map(p => '<p>' + esc(p) + '</p>').join('') + '</div><p class="muted" style="font-size:.9rem">Сравни структуру: введение → ' + (it.fmt === 'letter' ? 'просьба → формула окончания' : 'аргумент 1 → нюанс → заключение') + '. Свои слова — лучше заученных.</p></details>' : '';
      U.$('#model', view).innerHTML = model + '<div class="row"><a class="btn" href="#/today">На главную</a><a class="btn ghost" href="#/write">Другие задания</a></div>';
    }
  };
  App.setTitle('Письмо');
  return () => { clearTimeout(saveT); timer.stop(); if (ta.value.trim() && ta.value !== (rec.text || '')) { const r = S().prog.write[it.id] || (S().prog.write[it.id] = { tries: 0 }); if (!r.done || ta.value !== r.text) r.draft = ta.value; Store.touch(); } };
}
})();
