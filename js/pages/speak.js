/* Устная речь: подготовка, запись монолога, дебаты с «экзаменатором», самооценка */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

function findItem(id) {
  if (/^s\d+/.test(id)) { const p = window.SPEAK_PROMPTS.find(x => x.id === id); return p && { id, kind: 'prompt', lvl: p.lvl, t: p.t, min: p.min }; }
  if (/^t\d+/.test(id)) { const tp = window.TOPICS.find(x => 't' + x.id === id); return tp && { id, kind: 'topic', lvl: 'B2', t: tp.q, min: 6, topic: tp }; }
  if (/^x\d+/.test(id)) { const x = window.B2_EXTRA.find(e => e.id === id); return x && { id, kind: 'extra', lvl: 'B2', t: x.t, min: 6 }; }
  return null;
}
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

/* Диктофон */
function Recorder(box, opts) {
  opts = opts || {};
  let mr = null, chunks = [], stream = null, timer = null, recog = null, transcript = '', url = null, secs = 0;
  box.innerHTML = '<div class="player" style="flex-wrap:wrap"><button class="btn red" data-r="rec">' + U.icon('mic') + 'Записать</button><button class="btn soft" data-r="stop" hidden>' + U.icon('stop') + 'Стоп</button>' +
    '<span class="timer" data-r="tm" style="font-size:1.5rem">00:00</span><span class="muted" data-r="st"></span></div><div data-r="out"></div>' +
    (SR ? '<label class="switch" style="margin-top:6px"><input type="checkbox" data-r="tr"><span>Распознавать речь (экспериментально, лучше в Chrome)</span></label>' : '');
  const q = s => box.querySelector('[data-r="' + s + '"]');
  const tm = window.Timer.create(q('tm'), 0, { up: true });
  const setSt = t => { q('st').textContent = t; };
  const api = { get seconds() { return secs; }, get transcript() { return transcript; }, get url() { return url; }, stop: () => stop() };
  async function start() {
    if (!navigator.mediaDevices || !window.MediaRecorder) { setSt('Запись недоступна в этом браузере. Говори вслух и поставь отметку ниже.'); return; }
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { setSt('Нет доступа к микрофону. Разреши его в настройках браузера.'); return; }
    chunks = []; transcript = '';
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(blob);
      const ext = /mp4/.test(blob.type) ? 'm4a' : /ogg/.test(blob.type) ? 'ogg' : 'webm';
      q('out').innerHTML = '<audio controls src="' + url + '" style="width:100%;margin-top:8px"></audio><a class="btn small ghost" style="margin-top:6px" href="' + url + '" download="parole.' + ext + '">Скачать запись</a>';
      if (opts.onStop) opts.onStop(api);
    };
    mr.start(1000);
    const tr = q('tr');
    if (SR && tr && tr.checked) {
      try { recog = new SR(); recog.lang = 'fr-FR'; recog.continuous = true; recog.interimResults = false; recog.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) transcript += ' ' + e.results[i][0].transcript; }; recog.onerror = () => {}; recog.start(); } catch (e) { recog = null; }
    }
    tm.reset(0); tm.start();
    q('rec').hidden = true; q('stop').hidden = false; setSt('идёт запись…');
    if (opts.onStart) opts.onStart();
  }
  function stop() {
    if (!mr || mr.state === 'inactive') return;
    secs = tm.elapsed; tm.stop();
    try { if (recog) recog.stop(); } catch (e) {}
    mr.stop();
    q('rec').hidden = false; q('stop').hidden = true; q('rec').textContent = 'Записать заново'; setSt('записано ' + U.fmtClock(secs));
  }
  box.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; if (b.dataset.r === 'rec') start(); if (b.dataset.r === 'stop') stop(); });
  return api;
}

App.pages.speak = function (view, args) {
  const id = args[0];
  if (!id) return list(view);
  const it = findItem(id);
  if (!it) { view.innerHTML = '<div class="sheet">Задание не найдено. <a href="#/speak">К списку</a></div>'; return; }
  return session(view, it);
};

function list(view) {
  const prompts = window.SPEAK_PROMPTS, oral = window.TOPICS.filter(t => t.mode === 'oral'), extra = window.B2_EXTRA.filter(x => x.kind === 'oral'), eco = window.TOPICS.filter(t => t.mode === 'ecrit');
  const row = (href, title, sub, id) => { const r = S().prog.speak[id]; return '<a class="task' + (r && r.done ? ' done' : '') + '" href="' + href + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">' + esc(title) + '</div><div class="s">' + sub + '</div></span></a>'; };
  let html = '<div class="crumbs"><a href="#/practice">Практика</a> / речь</div><h1 class="page-title">Устная речь</h1><p class="page-sub">Говорить вслух — единственный способ научить рот. Записывай себя: через неделю послушай и сам услышишь прогресс. Запись остаётся только на твоём устройстве (в браузере) и не отправляется никуда.</p>';
  html += '<h2>Разогрев: A1–B1</h2><div class="grid c2">' + prompts.map(p => row('#/speak/' + p.id, p.t, '<span class="lv ' + p.lvl + '">' + p.lvl + '</span> ' + p.min + ' мин', p.id)).join('') + '</div>';
  html += '<h2 style="margin-top:24px">B2: монолог + дебаты</h2><div class="grid c2">' + oral.map(t => row('#/speak/t' + t.id, t.q, 'тема экзамена · монолог 5–7 мин', 't' + t.id)).join('') + extra.map(x => row('#/speak/' + x.id, x.t, 'монолог 5–7 мин', x.id)).join('') + '</div>';
  html += '<details class="fold" style="margin-top:16px"><summary>Ещё: темы из письменной части как устные</summary><div class="grid c2" style="margin-top:8px">' + eco.map(t => row('#/speak/t' + t.id, t.q, 'аргументы уже готовы', 't' + t.id)).join('') + '</div></details>';
  view.innerHTML = html; App.setTitle('Речь');
}

function objections(tp, seed) {
  if (!tp) return ['Pourquoi pensez-vous cela ? Pouvez-vous donner un exemple concret ?', 'N\'est-ce pas un peu exagéré ? Certains pensent exactement le contraire.', 'Et si on regardait la question du point de vue des personnes les plus modestes ?'];
  const pool = U.shuffle(tp.pour.concat(tp.contre), seed).slice(0, 3);
  const lead = ['Mais n\'est-il pas vrai que', 'Certains répondraient que', 'Que répondez-vous à ceux qui disent que'];
  return pool.map((a, i) => lead[i % 3] + ' ' + a.charAt(0).toLowerCase() + a.slice(1).replace(/\.$/, '') + ' ?');
}

function session(view, it) {
  const rec = S().prog.speak[it.id] || {};
  const advanced = it.lvl === 'B2';
  const tp = it.topic;
  const exam = Plan.phase(U.today()).id === 'P3' || Plan.phase(U.today()).id === 'P4';
  const prepSecs = exam ? 1800 : (advanced ? 600 : 90);
  const model = tp && tp.mode === 'oral' ? tp.text : '';
  const checks = advanced
    ? ['Позиция заявлена во введении (En ce qui me concerne…)', '2 аргумента с примером каждый', 'Был нюанс / уступка (Certes… mais…)', 'Заключение с чётким ответом на вопрос', 'Говорила не читая, без долгих пауз', 'Говорила достаточно громко и чётко']
    : ['Ответила на вопрос полностью', 'Использовала минимум 3 связки (d\'abord, ensuite, parce que…)', 'Говорила без долгих пауз', 'Исправляла себя, когда замечала ошибку', 'Произносила чётко и достаточно громко'];
  const objs = advanced ? objections(tp, it.id + U.today()) : [];
  view.innerHTML = '<div class="crumbs"><a href="#/speak">Речь</a> / ' + esc(it.id) + '</div>' +
    '<div class="row between" style="align-items:flex-end"><h1 class="page-title" style="max-width:34ch">' + esc(it.t) + '</h1><span class="lv ' + it.lvl + '">' + it.lvl + ' · ~' + it.min + ' мин</span></div>' +
    '<div class="sheet"><h2>1. Подготовка</h2><div class="row between"><span class="muted">' + (advanced ? 'Выбери позицию, 2 аргумента, 1 нюанс. Введение и заключение пропиши полностью, середину — ключевыми словами.' : 'Набросай 3–4 ключевых слова. Не пиши текст целиком.') + '</span><span class="row" style="gap:8px"><span class="timer" id="ptm" style="font-size:1.5rem">' + U.fmtClock(prepSecs) + '</span><button class="btn small soft" id="pgo">Таймер</button></span></div>' +
    '<textarea id="notes" rows="' + (advanced ? 6 : 3) + '" placeholder="Ключевые слова, аргументы, примеры…" style="margin-top:10px">' + esc(rec.notes || '') + '</textarea>' +
    (model ? '<details class="fold" style="margin-top:10px"><summary>Модель: введение и заключение (для заучивания)</summary><div class="model" style="margin-top:8px">' + model.split('\n').map(p => '<p>' + esc(p) + '</p>').join('') + '</div></details>' : '') +
    (tp ? '<details class="fold" style="margin-top:8px"><summary>Подсмотреть аргументы и примеры</summary><div class="args" style="margin-top:8px"><div class="pro"><span class="tg">ЗА</span><ul>' + tp.pour.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="con"><span class="tg">ПРОТИВ</span><ul>' + tp.contre.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div><span class="tg">Реальные примеры</span><ul>' + tp.ex.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div></details>' : '') +
    (advanced ? '<details class="fold" style="margin-top:8px"><summary>Фразы для монолога и дебатов</summary>' + ['ph_oral_mono', 'ph_oral_debat'].map(i => { const t = SRS.Cards.topic(i); return t ? '<h4 style="margin:10px 0 4px">' + esc(t.title) + '</h4><ul style="margin:0;padding-left:1.1em">' + t.ids.map(c => '<li class="fr">' + esc(SRS.Cards.map[c].fr) + '</li>').join('') + '</ul>' : ''; }).join('') + '</details>' : '') + '</div>' +
    '<div class="sheet"><h2>2. ' + (advanced ? 'Монолог (5–7 минут)' : 'Говори (' + it.min + ' мин)') + '</h2><div id="rec1"></div></div>' +
    (advanced ? '<div class="sheet"><h2>3. Дебаты: «экзаменатор» возражает</h2><p class="muted">Ответь на каждое возражение вслух минуты за 1–2. Начни с «Je comprends votre argument, mais…» или «Certes, mais…». Частичное согласие — признак B2+.</p>' +
      objs.map((o, i) => '<div class="sheet" style="background:var(--sheet-2);box-shadow:none"><div class="row between"><div class="fr" style="font-style:italic;flex:1 1 240px">« ' + esc(o) + ' »</div><button class="iconbtn" data-say="' + i + '" aria-label="Озвучить">' + U.icon('speaker') + '</button></div><div id="rec-o' + i + '" style="margin-top:8px"></div></div>').join('') + '</div>' : '') +
    '<div class="sheet"><h2>' + (advanced ? '4' : '3') + '. Самооценка</h2>' + checks.map((c, i) => '<label class="opt"><input type="checkbox" data-c="' + i + '"><span>' + esc(c) + '</span></label>').join('') +
    '<label class="switch" style="margin:8px 0"><input type="checkbox" id="norec"><span>Я проговорила вслух, но без записи</span></label>' +
    '<div class="row"><button class="btn green" data-a="done">Готово</button><span class="muted" id="dmsg"></span></div></div><div id="trres"></div>';
  const ptm = window.Timer.create(U.$('#ptm', view), prepSecs, { onEnd: () => U.toast('Подготовка закончена — переходи к монологу.') });
  U.$('#pgo', view).onclick = () => { if (ptm.running) { ptm.stop(); U.$('#pgo', view).textContent = 'Таймер'; } else { ptm.start(); U.$('#pgo', view).textContent = 'Пауза'; } };
  const main = Recorder(U.$('#rec1', view), { onStop: (r) => {
    if (r.transcript && r.transcript.trim()) {
      const n = U.countWords(r.transcript), mins = Math.max(0.2, r.seconds / 60);
      const pr = Pen.review(r.transcript, { kind: 'essay', level: 'B2', speech: true });
      U.$('#trres', view).innerHTML = '<div class="sheet pen"><h3>Что распознано (' + n + ' слов, ≈ ' + Math.round(n / mins) + ' слов/мин)</h3><p class="fr" style="line-height:1.7">' + esc(r.transcript.trim()) + '</p><ul>' + pr.bad.map(x => '<li class="n">' + esc(x) + '</li>').join('') + pr.ok.map(x => '<li class="y">' + esc(x) + '</li>').join('') + '</ul><p class="faint" style="font-size:.85rem">Распознавание речи неточное — смотри на структуру, не на каждое слово. Хороший темп — 100–140 слов в минуту.</p></div>';
    }
  } });
  const subs = objs.map((o, i) => Recorder(U.$('#rec-o' + i, view), {}));
  U.$('#notes', view).addEventListener('input', (e) => { const r = S().prog.speak[it.id] || (S().prog.speak[it.id] = { tries: 0 }); r.notes = e.target.value; Store.save(); });
  view.onclick = (e) => {
    const sy = e.target.closest('[data-say]'); if (sy) { U.speak(objs[+sy.dataset.say].replace(/[«»]/g, '')); return; }
    const b = e.target.closest('[data-a="done"]'); if (!b) return;
    const ticked = U.$$('input[data-c]', view).filter(x => x.checked).length;
    const spoke = main.seconds >= it.min * 60 * 0.4 || U.$('#norec', view).checked || main.seconds >= 40;
    if (!spoke) { U.$('#dmsg', view).textContent = 'Запиши монолог (минимум ' + Math.round(it.min * 0.4 * 60) + ' секунд) или отметь «проговорила без записи».'; return; }
    const pct = 0.55 + 0.45 * ticked / checks.length;
    const ev = Prog.done('speak', it.id, { pct, ok: true, info: { secs: main.seconds, notes: U.$('#notes', view).value } });
    App.celebrate(ev);
    view.innerHTML = '<div class="sheet" style="text-align:center"><div class="hand" style="font-size:2.3rem;color:var(--red)">Très bien !</div><p class="muted">' + (ticked < checks.length ? 'Не по всем пунктам получилось — это нормально. Через несколько дней возьми эту тему ещё раз.' : 'Все пункты выполнены.') + '</p><div class="row" style="justify-content:center"><a class="btn" href="#/today">На главную</a><a class="btn ghost" href="#/speak">Другие темы</a></div></div>';
  };
  App.setTitle('Речь');
  return () => { ptm.stop(); main.stop(); subs.forEach(s => s.stop()); U.stopSpeak(); };
}
})();
