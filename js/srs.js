/* Каталог карточек и интервальное повторение (вариант SM-2) */
(function(){
'use strict';
const S = () => Store.state;
const SRS = window.SRS = {};
const Cards = SRS.Cards = { map: {}, topics: [], order: [] };

/* ---- каталог ---- */
(function build(){
  const all = (window.VOCAB_TOPICS || []).concat(window.PHRASE_TOPICS || []);
  all.forEach(t => {
    const lines = t.cards.split('\n').map(s => s.trim()).filter(Boolean);
    const ids = [];
    lines.forEach((ln, i) => {
      const k = ln.indexOf('|'); if (k < 0) return;
      const id = t.id + '.' + i;
      Cards.map[id] = { id, fr: ln.slice(0, k).trim(), ru: ln.slice(k + 1).trim(), topic: t.id, level: t.level, builtin: true };
      ids.push(id);
    });
    Cards.topics.push({ id: t.id, level: t.level, title: t.title, fr: t.fr, ids });
  });
  const T = id => Cards.topics.find(x => x.id === id);
  const byLevel = lv => Cards.topics.filter(t => t.level === lv).map(t => t.id);
  const A1 = byLevel('A1'), A2 = byLevel('A2'), B1 = byLevel('B1'), B2 = byLevel('B2'), ECO = byLevel('ECO');
  const order = [].concat(A1, A2, ['ph_daily1', 'ph_daily2'], B1, ['ph_ecrit_intro', 'ph_ecrit_arg', 'ph_news']);
  const ph = ['ph_ecrit_nuance', 'ph_ecrit_conc', 'ph_lettre', 'ph_oral_mono', 'ph_oral_debat'];
  const n = Math.max(B2.length, ECO.length);
  for (let i = 0; i < n; i++) {
    if (i < B2.length) order.push(B2[i]);
    if (i < ECO.length) order.push(ECO[i]);
    if (i % 3 === 2 && ph.length) order.push(ph.shift());
  }
  ph.forEach(x => order.push(x));
  Cards.order = order.filter(id => T(id));
  Cards.topic = T;
})();

/* ---- доступ к карточке ---- */
SRS.get = id => {
  const base = Cards.map[id]; const st = S().cards[id];
  if (!base && !st) return null;
  return Object.assign({ st: 'new', ease: 2.5, ivl: 0, due: null, dueAt: 0, step: 0, reps: 0, lapses: 0 }, base || {}, st || {});
};
SRS.set = (id, patch) => { const c = S().cards[id] || (S().cards[id] = {}); Object.assign(c, patch); };
SRS.isCustom = id => !Cards.map[id];
SRS.typable = c => c.level !== 'PH' && c.ru && U.answerVariants(c.fr)[0] && U.answerVariants(c.fr)[0].split(' ').length <= 5;

/* ---- пользовательские слова ---- */
SRS.addCustom = (fr, ru, ex, tag) => {
  fr = String(fr || '').trim(); ru = String(ru || '').trim();
  if (!fr || !ru) return null;
  const dup = Object.keys(S().cards).find(id => S().cards[id].custom && U.norm(S().cards[id].fr) === U.norm(fr));
  if (dup) return { dup: dup };
  const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  S().cards[id] = { custom: true, fr, ru, ex: ex || '', tag: tag || '', level: 'C', topic: 'custom', st: 'new', ease: 2.5, ivl: 0, due: null, dueAt: 0, step: 0, reps: 0, lapses: 0, added: U.now() };
  Store.touch();
  return { id };
};
SRS.removeCustom = id => { delete S().cards[id]; Store.touch(); };

/* ---- очередь ---- */
SRS.customNewIds = () => Object.keys(S().cards).filter(id => S().cards[id].custom && S().cards[id].st === 'new').sort((a, b) => S().cards[a].added - S().cards[b].added);
SRS.topicOrder = () => {
  const skip = new Set(S().skipTopics), prio = S().prio.filter(t => Cards.topic(t));
  const rest = Cards.order.filter(t => !prio.includes(t));
  return prio.concat(rest).filter(t => !skip.has(t));
};
SRS.nextNewBuiltin = (limit) => {
  const out = [];
  for (const tid of SRS.topicOrder()) {
    for (const id of Cards.topic(tid).ids) {
      if (!S().cards[id]) { out.push(id); if (out.length >= limit) return out; }
    }
  }
  return out;
};
SRS.newQuota = (dk) => {
  dk = dk || U.today();
  const d = Store.day(dk), st = S().settings;
  let q = st.newPerDay - d.srs.n;
  if (d.light) q = Math.min(q, Math.max(0, 5 - d.srs.n));
  if (d.extraNew) q += d.extraNew;
  if (SRS.dueCounts(dk).total > st.maxReviews + 20) q = 0; // сначала разгрести долг
  return Math.max(0, q);
};
SRS.dueCounts = (dk) => {
  dk = dk || U.today();
  const now = U.now(); let learn = 0, review = 0;
  const lim = now + 20 * 60000;
  for (const id in S().cards) {
    const c = S().cards[id];
    if (c.st === 'learn' && c.dueAt <= lim) learn++;
    else if (c.st === 'rev' && c.due && c.due <= dk) review++;
  }
  return { learn, review, total: learn + review };
};
/* Очередь на сейчас. Возвращает {learn:[], review:[], news:[], backlog:n} */
SRS.queue = (dk) => {
  dk = dk || U.today();
  const now = U.now(), st = S().settings, d = Store.day(dk);
  const learn = [], review = [];
  for (const id in S().cards) {
    const c = S().cards[id];
    if (c.st === 'learn') learn.push(id);
    else if (c.st === 'rev' && c.due && c.due <= dk) review.push(id);
  }
  learn.sort((a, b) => S().cards[a].dueAt - S().cards[b].dueAt);
  review.sort((a, b) => (S().cards[a].due < S().cards[b].due ? -1 : S().cards[a].due > S().cards[b].due ? 1 : U.hash(a + dk) - U.hash(b + dk)));
  const cap = Math.max(10, st.maxReviews - d.srs.rv);
  const shownReview = d.light ? review.slice(0, Math.min(cap, 20)) : review.slice(0, cap);
  const quota = SRS.newQuota(dk);
  const customNew = SRS.customNewIds();
  let news = customNew.slice(0, quota);
  if (news.length < quota) news = news.concat(SRS.nextNewBuiltin(quota - news.length));
  return { learn, review: shownReview, news, backlog: Math.max(0, review.length - shownReview.length), dueLearnNow: learn.filter(id => S().cards[id].dueAt <= now).length };
};
/* Цель дня для оценки: сколько карточек нужно пройти, чтобы «закрыть» блок */
SRS.ensureTarget = (dk) => {
  const d = Store.day(dk);
  if (d.srs.target == null) {
    const q = SRS.queue(dk);
    d.srs.target = U.clamp(q.review.length + q.news.length + q.learn.filter(id => S().cards[id].dueAt <= U.now() + 20 * 60000).length, 0, 14);
    Store.touch();
  }
  return d.srs.target;
};

/* ---- ответы ---- */
const STEPS = [1, 10];
function nextLearning(c, rating, now) {
  const relearn = !!c.relearn;
  const steps = relearn ? [10] : STEPS;
  if (rating === 1) { c.step = 0; c.dueAt = now + 60000 * (relearn ? 10 : 1); return false; }
  if (rating === 2) { c.dueAt = now + 60000 * (c.step === 0 ? 5 : 10); return false; }
  if (rating === 3) {
    c.step = (c.step || 0) + 1;
    if (c.step >= steps.length) return 'grad1';
    c.dueAt = now + 60000 * steps[c.step]; return false;
  }
  return 'grad4';
}
SRS.apply = (c, rating, now, today) => {
  c = Object.assign({}, c);
  c.last = today;
  if (c.st === 'new' || c.st === 'learn') {
    const g = nextLearning(c, rating, now);
    c.st = 'learn';
    if (g) {
      c.st = 'rev';
      const base = c.relearn ? Math.max(1, c.ivl || 1) : 0;
      c.ivl = g === 'grad4' ? Math.max(4, base) : Math.max(1, base);
      c.relearn = false; c.step = 0; c.dueAt = 0;
      c.due = U.addDays(today, c.ivl);
    }
  } else if (c.st === 'rev') {
    if (rating === 1) {
      c.lapses = (c.lapses || 0) + 1; c.ease = Math.max(1.3, (c.ease || 2.5) - 0.2);
      c.ivl = Math.max(1, Math.round(c.ivl * 0.25));
      c.st = 'learn'; c.relearn = true; c.step = 0; c.dueAt = now + 600000; c.due = null;
    } else {
      let ivl = c.ivl || 1, e = c.ease || 2.5;
      if (rating === 2) { ivl = Math.max(ivl + 1, Math.round(ivl * 1.2)); e = Math.max(1.3, e - 0.15); }
      else if (rating === 3) { ivl = Math.max(ivl + 1, Math.round(ivl * e)); }
      else { ivl = Math.max(ivl + 2, Math.round(ivl * e * 1.3)); e = e + 0.15; }
      c.ivl = Math.min(365, ivl); c.ease = Math.round(e * 100) / 100; c.due = U.addDays(today, c.ivl);
    }
  }
  c.reps = (c.reps || 0) + 1;
  return c;
};
SRS.label = (id, rating) => {
  const c = SRS.get(id); if (!c) return '';
  const now = U.now(), today = U.today();
  const n = SRS.apply(c, rating, now, today);
  if (n.st === 'learn') { const m = Math.max(1, Math.round((n.dueAt - now) / 60000)); return m < 60 ? m + ' мин' : Math.round(m / 60) + ' ч'; }
  const d = n.ivl; return d < 30 ? d + ' дн' : d < 365 ? Math.round(d / 30) + ' мес' : '1 год';
};
SRS.answer = (id, rating, opts) => {
  opts = opts || {};
  const today = U.today(), now = U.now(), dayRec = Store.day(today);
  const before = SRS.get(id); if (!before) return null;
  const wasNew = before.st === 'new' && !S().cards[id];
  const wasNewCustom = before.st === 'new' && !!S().cards[id] && before.custom;
  const n = SRS.apply(before, rating, now, today);
  const save = {}; ['st','ease','ivl','due','dueAt','step','reps','lapses','relearn','last'].forEach(k => save[k] = n[k]);
  SRS.set(id, save);
  const s = dayRec.srs; s.r++;
  if (before.st === 'new') s.n++;
  if (before.st === 'rev') { s.rv++; if (rating >= 2) s.ok++; }
  if (opts.ms) s.ms = (s.ms || 0) + opts.ms;
  Store.touch();
  return n;
};
SRS.knowIt = (id) => {
  const today = U.today(), c = SRS.get(id); if (!c) return;
  SRS.set(id, { st: 'rev', ease: 2.5, ivl: 21, due: U.addDays(today, 21), dueAt: 0, step: 0, reps: 1, lapses: 0, last: today, known: true });
  Store.day(today).srs.k++;
  Store.touch();
};
SRS.knowTopic = (tid) => {
  const t = Cards.topic(tid); if (!t) return 0; let n = 0;
  const today = U.today();
  t.ids.forEach((id, i) => { if (!S().cards[id]) { SRS.set(id, { st: 'rev', ease: 2.5, ivl: 14 + (i % 14), due: U.addDays(today, 14 + (i % 14)), dueAt: 0, step: 0, reps: 1, lapses: 0, last: today, known: true }); n++; } });
  Store.touch(); return n;
};
SRS.suspend = id => { SRS.set(id, { st: 'susp' }); Store.touch(); };

/* ---- статистика ---- */
SRS.stats = () => {
  const c = S().cards; let nw = 0, learn = 0, young = 0, mature = 0, lapsesHigh = 0;
  const totalBuiltin = Object.keys(Cards.map).length;
  let seenBuiltin = 0;
  for (const id in c) {
    const x = c[id];
    if (!x.custom && Cards.map[id]) seenBuiltin++;
    if (x.st === 'learn') learn++; else if (x.st === 'rev') { if (x.ivl >= 21) mature++; else young++; } else if (x.st === 'new') nw++;
    if ((x.lapses || 0) >= 3) lapsesHigh++;
  }
  const custom = Object.keys(c).filter(id => c[id].custom).length;
  return { learn, young, mature, known: learn + young + mature, newCustom: nw, totalBuiltin, seenBuiltin, unseen: totalBuiltin - seenBuiltin, custom, hard: lapsesHigh };
};
SRS.forecast = (days) => {
  const today = U.today(), out = Array(days).fill(0);
  for (const id in S().cards) {
    const c = S().cards[id]; if (c.st !== 'rev' || !c.due) continue;
    const k = U.diffDays(today, c.due); if (k <= 0) out[0]++; else if (k < days) out[k]++;
  }
  return out;
};
SRS.retention = (n) => { // за последние n дней
  const today = U.today(); let rv = 0, ok = 0;
  for (let i = 0; i < n; i++) { const d = S().days[U.addDays(today, -i)]; if (d) { rv += d.srs.rv || 0; ok += d.srs.ok || 0; } }
  return rv ? ok / rv : null;
};
SRS.hardCards = () => Object.keys(S().cards).filter(id => (S().cards[id].lapses || 0) >= 3 && S().cards[id].st !== 'susp');
SRS.allCards = () => {
  const ids = new Set(Object.keys(Cards.map)); Object.keys(S().cards).forEach(i => ids.add(i));
  return Array.from(ids);
};
})();
