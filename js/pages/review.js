/* Повторение слов (SRS) */
(function(){
'use strict';
const esc = U.esc;
const S = () => Store.state;

App.pages.review = function (view, args, q) {
  const dk = U.today();
  const practice = q.mode === 'hard' || !!q.topic;
  const st = S().settings;
  const sess = { count: 0, ok: 0, bad: 0, newSeen: 0, cur: null, revealed: false, undo: null, start: Date.now(), t0: Date.now(), practiceIds: null, pi: 0, tfb: null };
  let alive = true;
  const beforeScore = Score.day(dk);
  Prog.srsVisited();
  SRS.ensureTarget(dk);

  if (practice) {
    let ids = [];
    if (q.mode === 'hard') ids = SRS.hardCards();
    else if (q.topic) { const t = SRS.Cards.topic(q.topic); ids = t ? t.ids.filter(id => S().cards[id] && S().cards[id].st !== 'susp') : (q.topic === 'custom' ? Object.keys(S().cards).filter(i => S().cards[i].custom) : []); }
    sess.practiceIds = U.shuffle(ids);
  }

  const pickNext = () => {
    if (practice) return sess.pi < sess.practiceIds.length ? sess.practiceIds[sess.pi] : null;
    const Q = SRS.queue(dk), now = U.now();
    const dueNow = Q.learn.filter(id => S().cards[id].dueAt <= now);
    if (dueNow.length) return dueNow[0];
    const newTurn = Q.news.length && (Q.review.length === 0 || sess.count % 4 === 3);
    if (Q.review.length && !newTurn) return Q.review[0];
    if (Q.news.length) return Q.news[0];
    const ahead = Q.learn.filter(id => S().cards[id].dueAt <= now + 25 * 60000);
    if (ahead.length) return ahead[0];
    return null;
  };
  const counts = () => {
    if (practice) return { n: 0, l: 0, r: Math.max(0, sess.practiceIds.length - sess.pi), cur: 'r' };
    const Q = SRS.queue(dk);
    const l = Q.learn.filter(id => S().cards[id].dueAt <= U.now() + 25 * 60000).length;
    return { n: Q.news.length, l, r: Q.review.length, cur: null };
  };
  const header = () => {
    const c = counts(), cur = sess.cur ? SRS.get(sess.cur) : null;
    const k = cur ? (cur.st === 'new' ? 'n' : cur.st === 'learn' ? 'l' : 'r') : '';
    return '<div class="counts" aria-label="Осталось"><span class="n ' + (k === 'n' ? 'cur' : '') + '"><b>' + c.n + '</b> новых</span><span class="l ' + (k === 'l' ? 'cur' : '') + '"><b>' + c.l + '</b> учатся</span><span class="r ' + (k === 'r' ? 'cur' : '') + '"><b>' + c.r + '</b> повтор</span></div>';
  };
  const modeFor = (c) => {
    const m = st.reviewMode;
    if (c.level === 'PH') return { dir: 'fr-ru', typed: false };
    const typable = SRS.typable(c);
    if (m === 'flip') return { dir: 'fr-ru', typed: false };
    if (m === 'type' && typable) return { dir: 'ru-fr', typed: true };
    if (typable && (c.st === 'rev' && c.ivl >= 4 || (c.reps || 0) >= 2)) return { dir: 'ru-fr', typed: true };
    if (c.st === 'rev' && (c.reps || 0) % 2 === 1) return { dir: 'ru-fr', typed: false };
    return { dir: 'fr-ru', typed: false };
  };

  const finish = () => {
    alive = false;
    const empty = sess.count === 0;
    const stats = SRS.stats();
    const fc = SRS.forecast(3);
    const quota = SRS.newQuota(dk);
    const ev = practice ? [] : Score.afterAction(beforeScore, Score.day(dk));
    const mins = Math.max(1, Math.round((Date.now() - sess.start) / 60000));
    view.innerHTML = '<div class="session"><div class="sheet" style="text-align:center">' +
      (empty ? '<div class="hand" style="font-size:2.2rem;color:var(--red)">Rien à réviser</div><p class="muted">Сейчас повторять нечего — приходи позже или добавь свои слова.</p>' :
        '<div class="hand" style="font-size:2.4rem;color:var(--red)">' + (practice ? 'Тренировка окончена' : 'Série terminée !') + '</div>' +
        '<div class="grid c3" style="margin:14px 0"><div class="stat"><b>' + sess.count + '</b><small>ответов</small></div><div class="stat"><b>' + sess.newSeen + '</b><small>новых слов</small></div><div class="stat"><b>' + (sess.count ? Math.round(100 * sess.ok / sess.count) : 0) + '%</b><small>верно</small></div></div>' +
        '<p class="muted">Ушло ≈ ' + mins + ' мин. Всего в памяти: <b>' + stats.known + '</b> слов.</p>') +
      (practice ? '' : '<p class="muted">Завтра к повторению: <b>' + fc[1] + '</b> · послезавтра: <b>' + fc[2] + '</b></p>') +
      '<div class="row" style="justify-content:center;margin-top:10px">' +
      (practice || quota > 0 ? '' : '<button class="btn soft" data-a="more">Ещё 5 новых слов</button>') +
      '<a class="btn" href="#/today">На главную</a></div></div></div>';
    App.celebrate(ev);
    view.onclick = e => { const b = e.target.closest('[data-a="more"]'); if (b) { const d = Store.day(dk); d.extraNew = (d.extraNew || 0) + 5; Store.touch(); App.pages.review(view, args, q); } };
  };

  const speakCur = (rate) => { const c = SRS.get(sess.cur); if (c && st.sound !== false) U.speak(c.fr.replace(/\(.*?\)/g, ''), { rate }); };

  const render = () => {
    if (!alive) return;
    const id = pickNext();
    sess.cur = id; sess.revealed = false; sess.tfb = null; sess.intro = false;
    if (!id) return finish();
    const c = SRS.get(id);
    const fb = { id, c };
    if (c.st === 'new' && !practice) return renderIntro(c);
    const md = modeFor(c);
    sess.md = md;
    const front = md.dir === 'fr-ru';
    const tagHTML = c.level === 'C' ? '<span class="tag lv C">мои слова</span>' : '<span class="tag lv ' + c.level + '">' + c.level + '</span>';
    const cardInner =
      '<div class="face front">' + tagHTML + '<span class="lab">' + (front ? 'по-французски' : 'по-русски') + '</span>' +
      (front ? '<div class="w">' + esc(c.fr) + '</div>' : '<div class="w ru">' + esc(c.ru) + '</div>') +
      (front ? '<div class="row" style="margin-top:12px"><button class="iconbtn" data-a="say" aria-label="Произнести">' + U.icon('speaker') + '</button></div>' : '') +
      '</div>' +
      '<div class="face back"><span class="lab">ответ</span>' +
      (front ? '<div class="w ru">' + esc(c.ru) + '</div>' : '<div class="w">' + esc(c.fr) + '</div>') +
      (c.ex ? '<div class="muted fr" style="margin-top:10px;font-style:italic">' + esc(c.ex) + '</div>' : '') +
      '<div class="row" style="margin-top:12px"><button class="iconbtn" data-a="say" aria-label="Произнести">' + U.icon('speaker') + '</button>' + (c.level === 'PH' ? '<button class="iconbtn" data-a="slow" aria-label="Медленно">' + U.icon('clock') + '</button>' : '') + '</div></div>';
    view.innerHTML = '<div class="session">' + header() +
      '<div class="flip" id="flip"><div class="card">' + cardInner + '</div></div>' +
      '<div id="ctl"></div>' +
      '<div class="row between" style="margin-top:10px;font-size:.85rem">' +
      '<span>' + (sess.undo ? '<button class="btn small ghost" data-a="undo">' + U.icon('repeat') + 'Отменить прошлый ответ</button>' : '') + '</span>' +
      '<a class="faint" href="#/today">Закончить на сегодня</a></div></div>';
    const ctl = U.$('#ctl', view);
    if (md.typed) {
      ctl.innerHTML = '<form class="typed" id="tf" autocomplete="off"><input type="text" id="ti" placeholder="Напиши по-французски" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="Ответ"><button class="btn" type="submit">Проверить</button></form><div class="row" style="justify-content:center"><button class="btn small ghost" data-a="reveal">Не помню — показать</button></div>';
      setTimeout(() => { const i = U.$('#ti', view); if (i) i.focus(); }, 60);
      U.$('#tf', view).onsubmit = (e) => { e.preventDefault(); const v = U.$('#ti', view).value; if (!v.trim()) return; check(v); };
    } else {
      ctl.innerHTML = '<button class="btn" style="width:100%" data-a="reveal">Показать ответ <span class="kbd">пробел</span></button>';
    }
    if (front && st.sound !== false && !practice) setTimeout(() => speakCur(), 250);
  };

  const renderIntro = (c) => {
    view.innerHTML = '<div class="session">' + header() +
      '<div class="sheet newcard" style="text-align:center;padding:26px 18px"><span class="lv ' + c.level + '" style="margin-bottom:10px">' + (c.level === 'C' ? 'мои слова' : 'новое слово · ' + c.level) + '</span>' +
      '<div class="w" style="margin:12px 0 4px">' + esc(c.fr) + '</div><div style="font-size:1.35rem;font-weight:600">' + esc(c.ru) + '</div>' +
      (c.ex ? '<div class="muted fr" style="margin-top:10px;font-style:italic">' + esc(c.ex) + '</div>' : '') +
      '<div class="row" style="justify-content:center;margin-top:14px"><button class="iconbtn" data-a="say" aria-label="Произнести">' + U.icon('speaker') + '</button><button class="iconbtn" data-a="slow" aria-label="Медленно">' + U.icon('clock') + '</button></div></div>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-a="learn">Запомнить <span class="kbd">пробел</span></button><button class="btn ghost" data-a="know">Уже знаю</button></div>' +
      '<p class="faint" style="text-align:center;font-size:.86rem;margin-top:10px">Скажи слово вслух 2 раза, потом нажми «Запомнить» — сразу проверю по памяти.</p>' +
      '<div class="row between" style="margin-top:10px;font-size:.85rem"><span></span><a class="faint" href="#/today">Закончить на сегодня</a></div></div>';
    if (st.sound !== false) setTimeout(() => speakCur(), 250);
  };

  const reveal = () => {
    sess.revealed = true;
    U.$('#flip', view).classList.add('show');
    showRate(sess.tfb);
    if (sess.md && sess.md.dir === 'ru-fr' && st.sound !== false) speakCur();
  };
  const showRate = (rec) => {
    const ctl = U.$('#ctl', view), id = sess.cur;
    const lab = r => practice ? '' : '<small>' + SRS.label(id, r) + '</small>';
    ctl.innerHTML = (sess.tfb ? sess.tfb.html : '') +
      '<div class="rate"><button class="again ' + (rec === 1 ? 'rec' : '') + '" data-r="1">Снова' + lab(1) + '</button><button class="hard ' + (rec === 2 ? 'rec' : '') + '" data-r="2">Трудно' + lab(2) + '</button><button class="good ' + (rec === 3 ? 'rec' : '') + '" data-r="3">Хорошо' + lab(3) + '</button><button class="easy ' + (rec === 4 ? 'rec' : '') + '" data-r="4">Легко' + lab(4) + '</button></div>' +
      '<p class="faint" style="text-align:center;font-size:.8rem;margin:8px 0 0">клавиши 1–4</p>';
  };
  const check = (val) => {
    const c = SRS.get(sess.cur);
    const res = U.check(val, c.fr);
    let rec, html;
    if (res === 'ok') { rec = 3; html = '<div class="fb ok">Верно !</div>'; }
    else if (res === 'accent') { rec = 2; html = '<div class="fb near">Почти — проверь диакритику: <b class="fr">' + esc(c.fr) + '</b></div>'; }
    else if (res === 'near') { rec = 2; html = '<div class="fb near">Почти — не хватает артикля: <b class="fr">' + esc(c.fr) + '</b></div>'; }
    else { rec = 1; html = '<div class="fb bad">Правильно: <b class="fr">' + esc(c.fr) + '</b></div>'; }
    sess.tfb = { html, rec };
    reveal();
  };

  const rate = (r) => {
    const id = sess.cur; if (!id) return;
    const c0 = SRS.get(id);
    const snap = { id, card: S().cards[id] ? JSON.parse(JSON.stringify(S().cards[id])) : null, day: JSON.parse(JSON.stringify(Store.day(dk).srs)), count: sess.count, ok: sess.ok, bad: sess.bad, newSeen: sess.newSeen };
    if (!practice) {
      SRS.answer(id, r, { ms: Date.now() - sess.t0 });
      sess.undo = snap;
    } else { sess.pi++; }
    sess.count++; if (r >= 3 || (r === 2)) sess.ok++; else sess.bad++;
    if (c0.st === 'new' || sess.intro) sess.newSeen++;
    sess.intro = false;
    sess.t0 = Date.now();
    App.refreshChrome();
    render();
  };
  const undo = () => {
    const u = sess.undo; if (!u) return;
    if (u.card) S().cards[u.id] = u.card; else delete S().cards[u.id];
    Store.day(dk).srs = u.day;
    sess.count = u.count; sess.ok = u.ok; sess.bad = u.bad; sess.newSeen = u.newSeen; sess.undo = null;
    Store.touch(); render();
  };

  view.onclick = (e) => {
    const b = e.target.closest('[data-a],[data-r]'); if (!b) return;
    if (b.dataset.r) return rate(+b.dataset.r);
    const a = b.dataset.a;
    if (a === 'reveal') reveal();
    else if (a === 'say') speakCur();
    else if (a === 'slow') speakCur(0.6);
    else if (a === 'undo') undo();
    else if (a === 'learn') {
      /* слово показано — сразу проверка по памяти (активное вспоминание) */
      const c = SRS.get(sess.cur); if (!c) return;
      S().cards[c.id] = S().cards[c.id] || {};
      sess.forceTest = c.id; introToTest(c);
    }
    else if (a === 'know') { SRS.knowIt(sess.cur); sess.count++; sess.newSeen += 0; App.refreshChrome(); render(); }
  };
  const introToTest = (c) => {
    // превращаем в «обучаемую» карточку: первая проверка прямо сейчас
    SRS.set(c.id, { st: 'learn', step: 0, dueAt: U.now(), ease: 2.5, ivl: 0, reps: 0, lapses: 0, isNew: true });
    const day = Store.day(dk); day.srs.n++; // новое слово считается введённым
    c.st = 'learn';
    renderTest(c);
  };
  const renderTest = (c) => {
    // тест сразу после знакомства: пишем по-французски, если можно, иначе переворачиваем
    sess.revealed = false; sess.tfb = null;
    const typable = SRS.typable(c);
    const md = { dir: 'ru-fr', typed: typable };
    sess.md = md; sess.intro = true;
    const cardInner =
      '<div class="face front"><span class="tag lv ' + c.level + '">' + (c.level === 'C' ? 'моё' : c.level) + '</span><span class="lab">вспомни по-французски</span><div class="w ru">' + esc(c.ru) + '</div></div>' +
      '<div class="face back"><span class="lab">ответ</span><div class="w">' + esc(c.fr) + '</div>' + (c.ex ? '<div class="muted fr" style="margin-top:10px;font-style:italic">' + esc(c.ex) + '</div>' : '') + '<div class="row" style="margin-top:12px"><button class="iconbtn" data-a="say" aria-label="Произнести">' + U.icon('speaker') + '</button></div></div>';
    view.innerHTML = '<div class="session">' + header() + '<div class="flip" id="flip"><div class="card">' + cardInner + '</div></div><div id="ctl"></div></div>';
    const ctl = U.$('#ctl', view);
    if (typable) {
      ctl.innerHTML = '<form class="typed" id="tf" autocomplete="off"><input type="text" id="ti" placeholder="Напиши по-французски" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="Ответ"><button class="btn" type="submit">Проверить</button></form><div class="row" style="justify-content:center"><button class="btn small ghost" data-a="reveal">Не помню — показать</button></div>';
      setTimeout(() => { const i = U.$('#ti', view); if (i) i.focus(); }, 60);
      U.$('#tf', view).onsubmit = (e) => { e.preventDefault(); const v = U.$('#ti', view).value; if (v.trim()) check(v); };
    } else ctl.innerHTML = '<button class="btn" style="width:100%" data-a="reveal">Показать ответ</button>';
  };

  const onKey = (e) => {
    if (!alive || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') {
      if (e.key === 'Enter' && sess.revealed) { e.preventDefault(); rate((sess.tfb && sess.tfb.rec) || 3); }
      return;
    }
    if (!sess.cur) return;
    const c = SRS.get(sess.cur);
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!sess.revealed) {
        if (c.st === 'new' && !practice && !sess.intro) { U.$('[data-a="learn"]', view) && U.$('[data-a="learn"]', view).click(); }
        else if (!(sess.md && sess.md.typed)) reveal();
      }
      else rate((sess.tfb && sess.tfb.rec) || 3);
    }
    if (sess.revealed && ['1', '2', '3', '4'].includes(e.key)) rate(+e.key);
  };
  document.addEventListener('keydown', onKey);

  App.setTitle('Слова');
  render();
  return () => { alive = false; document.removeEventListener('keydown', onKey); };
};
})();
