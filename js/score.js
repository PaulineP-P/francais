/* Прогресс, оценка дня /20, серия, значки, итоги недели */
(function(){
'use strict';
const S = () => Store.state;
const Prog = window.Prog = {}, Score = window.Score = {}, Streak = window.Streak = {};

const KIND = { grammar: 'grammar', dictation: 'dict', listen: 'listen', listen_x: 'ext', read: 'read', read_x: 'ext', write: 'write', speak: 'speak', phrases: 'phr' };
Prog.KIND = KIND;
Prog.rec = (kind, id) => (S().prog[kind] || (S().prog[kind] = {}))[id] || null;
Prog.isDone = (type, id) => { const k = KIND[type]; const r = k && S().prog[k] && S().prog[k][id]; return !!(r && r.done); };
Prog.countDone = (kind) => Object.values(S().prog[kind] || {}).filter(r => r.done).length;

/* Завершение задания. res: {ok:true, pct:0..1, info:{}} */
Prog.done = (type, id, res) => {
  res = res || {}; const ok = res.ok !== false;
  const dk = U.today(), day = Store.day(dk), kind = KIND[type];
  const events = [];
  if (kind) {
    const bucket = S().prog[kind] || (S().prog[kind] = {});
    const r = bucket[id] || (bucket[id] = { tries: 0 });
    r.tries++; r.last = dk;
    if (res.pct != null) r.best = Math.max(r.best || 0, res.pct);
    if (res.info) Object.assign(r, res.info);
    if (ok) r.done = true;
  }
  if (!ok) { Store.touch(); return events; }
  const plan = Plan.forDay(dk, true);
  const t = plan.tasks.find(x => x.key !== 'srs' && x.key !== 'bonus' && x.type === type && !day.tasks[x.key]);
  const before = Score.day(dk);
  if (t) {
    const pts = res.pct != null ? Math.round(3 + 2 * U.clamp(res.pct, 0, 1)) : 5;
    day.tasks[t.key] = { type, id, pts, at: U.now() };
  } else {
    day.extra = (day.extra || 0) + 1;
  }
  const after = Score.day(dk);
  Store.touch();
  events.push.apply(events, Score.afterAction(before, after));
  return events;
};
Prog.bonus = (what) => {
  const dk = U.today(), day = Store.day(dk), before = Score.day(dk);
  if (day.bonus[what]) return [];
  day.bonus[what] = true; Plan.forDay(dk, true);
  Store.touch();
  return Score.afterAction(before, Score.day(dk));
};
/* Страница итогов недели — считается выполненной при просмотре */
Prog.viewedBulletin = () => {
  const dk = U.today(), day = Store.day(dk);
  const plan = Plan.forDay(dk, true);
  const t = plan.tasks.find(x => x.type === 'bulletin' && !day.tasks[x.key]);
  if (!t) return [];
  const before = Score.day(dk);
  day.tasks[t.key] = { type: 'bulletin', id: 'bulletin', pts: 5, at: U.now() };
  Store.touch();
  return Score.afterAction(before, Score.day(dk));
};
Prog.srsVisited = () => { const d = Store.day(U.today()); if (!d.srs.visited) { d.srs.visited = true; Store.touch(); } };

/* ---- оценка дня ---- */
Score.srsPts = (d) => {
  if (!d || !d.srs) return 0;
  const s = d.srs, done = (s.r || 0) + (s.k || 0);
  if (s.target === 0 || s.target == null) { return s.visited ? 6 : (done > 0 ? 6 : 0); }
  return Math.min(6, Math.round(6 * done / s.target));
};
Score.day = (dk) => {
  const d = S().days[dk];
  if (!d) return { srs: 0, main: 0, bonus: 0, total: 0, possible: 20, note: 0, mcount: 2 };
  const srs = Score.srsPts(d);
  const main = U.sum(Object.values(d.tasks || {}).map(t => t.pts || 0));
  const bonus = (d.bonus && d.bonus.w ? 2 : 0) + (d.bonus && d.bonus.p ? 2 : 0);
  const mcount = d.light ? 1 : (d.mcount != null ? d.mcount : 2);
  const possible = 6 + 5 * mcount + 4;
  const total = srs + Math.min(main, 5 * Math.max(mcount, Object.keys(d.tasks || {}).length)) + bonus;
  return { srs, main, bonus, total, possible, note: Math.min(20, Math.round(20 * total / possible)), mcount };
};
Score.active = (dk) => { const s = Score.day(dk); return s.total >= 6 || s.srs >= 4; };
Score.isComplete = (dk) => { const s = Score.day(dk); return s.total >= s.possible - 1; };

/* События после действия: штамп, значки, серия */
Score.afterAction = (before, after) => {
  const ev = [];
  if (after.note > before.note) ev.push({ type: 'note', from: before.note, to: after.note });
  const full = after.total >= after.possible - 1, wasFull = before.total >= before.possible - 1;
  if (full && !wasFull) ev.push({ type: 'stamp', big: after.note >= 20 ? 'Excellent !' : 'Très bien !', small: 'День закрыт. Оценка ' + after.note + '/20' });
  Score.checkBadges().forEach(b => ev.push({ type: 'badge', badge: b }));
  return ev;
};

/* ---- серия ---- */
Streak.compute = () => {
  const today = U.today();
  const keys = Object.keys(S().days).filter(k => Score.active(k)).sort();
  if (!keys.length) return { cur: 0, best: 0, jokers: 1, frozen: [], total: 0, last: null, todayActive: false };
  let cur = 0, best = 0, jokers = 1, total = 0; const frozen = [];
  let k = keys[0];
  while (k <= today) {
    const act = Score.active(k), dow = U.dow(k);
    if (act) { cur++; total++; if (cur > best) best = cur; if (cur % 7 === 0) jokers = Math.min(3, jokers + 1); }
    else if (dow === 6) { /* воскресенье можно пропустить */ }
    else if (k === today) { /* день ещё идёт */ }
    else { if (jokers > 0) { jokers--; frozen.push(k); } else cur = 0; }
    k = U.addDays(k, 1);
  }
  return { cur, best, jokers, frozen, total, last: keys[keys.length - 1], todayActive: Score.active(today) };
};

/* ---- значки ---- */
const B = (id, name, desc, test) => ({ id, name, desc, test });
Score.BADGES = [
  B('start', 'Premier pas', 'Первый активный день', c => c.total >= 1),
  B('s3', 'Trois jours', 'Серия 3 дня', c => c.best >= 3),
  B('s7', 'Semaine !', 'Серия 7 дней', c => c.best >= 7),
  B('s14', 'Deux semaines', 'Серия 14 дней', c => c.best >= 14),
  B('s30', 'Un mois', 'Серия 30 дней', c => c.best >= 30),
  B('s60', 'Persévérance', 'Серия 60 дней', c => c.best >= 60),
  B('w50', '50 слов', '50 слов в памяти', c => c.known >= 50),
  B('w150', '150 слов', '150 слов в памяти', c => c.known >= 150),
  B('w400', '400 слов', '400 слов в памяти', c => c.known >= 400),
  B('w800', '800 слов', '800 слов в памяти', c => c.known >= 800),
  B('own10', 'Мои слова', 'Добавила 10 своих слов', c => c.custom >= 10),
  B('mat100', 'Надолго', '100 слов с интервалом от 21 дня', c => c.mature >= 100),
  B('g10', 'Грамматика I', '10 уроков грамматики', c => c.gram >= 10),
  B('g28', 'Вся грамматика', 'Все 28 уроков', c => c.gram >= 28),
  B('d10', 'Dictée ×10', '10 диктантов', c => c.dict >= 10),
  B('l10', 'Oreille fine', '10 заданий на аудирование', c => c.listen >= 10),
  B('r10', 'Lectrice', '10 текстов на чтение', c => c.read >= 10),
  B('wr5', 'Plume', '5 письменных работ', c => c.write >= 5),
  B('wr15', 'Plume d\'or', '15 письменных работ', c => c.write >= 15),
  B('sp5', 'Parole', '5 устных ответов', c => c.speak >= 5),
  B('sp15', 'Orateur', '15 устных ответов', c => c.speak >= 15),
  B('perfect', '20 sur 20', 'Идеальная оценка за день', c => c.perfect >= 1),
  B('mock1', 'Examen blanc', 'Первый пробный экзамен', c => c.mocks >= 1),
  B('mock50', 'Seuil atteint', 'Пробный экзамен ≥ 50/100', c => c.bestMock >= 50),
  B('mock85', 'Objectif 85', 'Пробный экзамен ≥ 85/100', c => c.bestMock >= 85),
  B('back', 'Retour', 'Вернулась после перерыва — это тоже сила', c => c.comeback >= 1),
  B('d100', 'Cent jours', '100 активных дней', c => c.total >= 100)
];
Score.badgeContext = () => {
  const st = SRS.stats(), sk = Streak.compute();
  const mocks = S().mocks || [];
  const tot = m => (m.co || 0) + (m.ce || 0) + (m.pe || 0) + (m.po || 0);
  let perfect = 0, comeback = 0, prevActive = null;
  Object.keys(S().days).sort().forEach(k => {
    if (Score.active(k)) {
      if (Score.day(k).note >= 20) perfect++;
      if (prevActive && U.diffDays(prevActive, k) >= 4) comeback++;
      prevActive = k;
    }
  });
  return {
    total: sk.total, best: sk.best, known: st.known, mature: st.mature, custom: st.custom,
    gram: Prog.countDone('grammar'), dict: Prog.countDone('dict'), listen: Prog.countDone('listen'), read: Prog.countDone('read'),
    write: Prog.countDone('write'), speak: Prog.countDone('speak'), perfect, comeback,
    mocks: mocks.length, bestMock: mocks.reduce((a, m) => Math.max(a, tot(m)), 0)
  };
};
Score.checkBadges = () => {
  const ctx = Score.badgeContext(), out = [];
  Score.BADGES.forEach(b => { if (!S().badges[b.id] && b.test(ctx)) { S().badges[b.id] = U.today(); out.push(b); } });
  if (out.length) Store.touch();
  return out;
};

/* ---- итоги недели ---- */
Score.week = (startKey) => {
  const sk = Streak.compute(); const today = U.today();
  const days = []; let active = 0, notes = [], news = 0, rev = 0, ms = 0, rvSum = 0, okSum = 0; const kinds = {};
  for (let i = 0; i < 7; i++) {
    const k = U.addDays(startKey, i), d = S().days[k];
    const act = d ? Score.active(k) : false, sc = Score.day(k);
    if (act) { active++; notes.push(sc.note); }
    if (d) { news += d.srs.n || 0; rev += d.srs.r || 0; ms += d.ms || 0; rvSum += d.srs.rv || 0; okSum += d.srs.ok || 0; Object.values(d.tasks || {}).forEach(t => { kinds[t.type] = (kinds[t.type] || 0) + 1; }); }
    days.push({ k, act, note: sc.note, joker: sk.frozen.includes(k), rest: U.dow(k) === 6, future: k > today, today: k === today });
  }
  return { start: startKey, days, active, avg: notes.length ? Math.round(U.sum(notes) / notes.length * 10) / 10 : 0, news, rev, minutes: Math.round(ms / 60000), retention: rvSum ? okSum / rvSum : null, kinds };
};
})();
