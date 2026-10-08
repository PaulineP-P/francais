/* Генератор плана на день. Выбирает следующее непройденное задание нужного вида. */
(function(){
'use strict';
const S = () => Store.state;
const Plan = window.Plan = {};

const TYPES = {
  srs:      { title: 'Слова: повторение', icon: 'cards', min: 12, pts: 6 },
  grammar:  { title: 'Грамматика', icon: 'grammar', min: 20 },
  drill:    { title: 'Закрепление грамматики', icon: 'repeat', min: 12 },
  phrases:  { title: 'Фразы вслух', icon: 'speaker', min: 12 },
  listen:   { title: 'Аудирование', icon: 'headphones', min: 18 },
  listen_x: { title: 'Аудирование «вживую»', icon: 'ear', min: 20 },
  read:     { title: 'Чтение', icon: 'book', min: 18 },
  read_x:   { title: 'Чтение «вживую»', icon: 'book', min: 20 },
  dictation:{ title: 'Диктант', icon: 'dict', min: 12 },
  write:    { title: 'Письмо', icon: 'pen', min: 30 },
  speak:    { title: 'Устная речь', icon: 'mic', min: 15 },
  mock:     { title: 'Пробный экзамен', icon: 'exam', min: 60 },
  bulletin: { title: 'Итоги недели', icon: 'star', min: 6 },
  checklist:{ title: 'Подготовка к экзамену', icon: 'flag', min: 10 },
  examday:  { title: 'День экзамена', icon: 'flag', min: 0 }
};
Plan.TYPES = TYPES;

const TABLE = {
  P1: [['grammar','phrases'],['listen','dictation'],['grammar','read'],['write','drill'],['listen_x','speak'],['read_x','dictation'],['bulletin']],
  P2: [['grammar','speak'],['listen','write'],['grammar','read'],['speak','drill'],['listen_x','write'],['read_x','dictation'],['bulletin']],
  P3: [['write','listen'],['speak','read'],['grammar','write'],['listen_x','speak'],['read_x','write'],['mock','drill'],['bulletin']]
};
const P4 = { 9: ['mock','drill'], 8: ['write','listen'], 7: ['mock','speak'], 6: ['listen_x','read'], 5: ['speak','write'], 4: ['listen','speak'], 3: ['read','drill'], 2: ['phrases'], 1: ['checklist'], 0: ['examday'] };

Plan.phase = (dk) => {
  const exam = S().settings.examDate, off = U.diffDays(dk, exam);
  if (off < 0) return { id: 'after', name: 'После экзамена', off };
  if (off <= 9) return { id: 'P4', name: 'Финишная прямая', off };
  if (off <= 44) return { id: 'P3', name: 'Формат экзамена', off };
  if (dk >= '2026-12-01') return { id: 'P2', name: 'B2: глубина и темы', off };
  return { id: 'P1', name: 'Фундамент: A1 → B1', off };
};
Plan.daysToExam = (dk) => U.diffDays(dk || U.today(), S().settings.examDate);
Plan.dayNo = (dk) => Math.max(1, U.diffDays(S().settings.startDate, dk) + 1);

/* ---- кандидаты по видам ---- */
const doneIn = (kind, id) => !!(S().prog[kind] && S().prog[kind][id] && S().prog[kind][id].done);
const lastOf = (kind, id) => (S().prog[kind] && S().prog[kind][id] && S().prog[kind][id].last) || '';
function firstUndone(kind, items, idf, prefer) {
  const arr = items.map(x => ({ x, id: idf(x) }));
  const pool = prefer ? arr.filter(a => prefer(a.x)) : arr;
  let c = pool.find(a => !doneIn(kind, a.id)) || arr.find(a => !doneIn(kind, a.id));
  if (c) return { id: c.id, item: c.x, repeat: false };
  const old = arr.slice().sort((a, b) => lastOf(kind, a.id) < lastOf(kind, b.id) ? -1 : 1)[0];
  return old ? { id: old.id, item: old.x, repeat: true } : null;
}
Plan.writeCandidates = (phase) => {
  const prompts = (window.WRITE_PROMPTS || []).map(p => ({ id: p.id, kind: 'prompt', lvl: p.lvl, t: p.t, words: p.words }));
  const topics = (window.TOPICS || []).filter(t => t.mode === 'ecrit').map(t => ({ id: 't' + t.id, kind: 'topic', lvl: 'B2', t: t.q, words: 250 }));
  const extra = (window.B2_EXTRA || []).filter(x => x.kind === 'ecrit').map(x => ({ id: x.id, kind: 'extra', lvl: 'B2', t: x.t, words: 250 }));
  if (phase === 'P1') return prompts.concat(topics, extra);
  if (phase === 'P3') return topics.concat(extra, prompts.filter(p => p.lvl === 'B1'));
  return prompts.filter(p => p.lvl === 'B1').concat(topics, extra);
};
Plan.speakCandidates = (phase) => {
  const prompts = (window.SPEAK_PROMPTS || []).map(p => ({ id: p.id, kind: 'prompt', lvl: p.lvl, t: p.t, min: p.min }));
  const oral = (window.TOPICS || []).filter(t => t.mode === 'oral').map(t => ({ id: 't' + t.id, kind: 'topic', lvl: 'B2', t: t.q, min: 6 }));
  const extra = (window.B2_EXTRA || []).filter(x => x.kind === 'oral').map(x => ({ id: x.id, kind: 'extra', lvl: 'B2', t: x.t, min: 6 }));
  const eco = (window.TOPICS || []).filter(t => t.mode === 'ecrit').map(t => ({ id: 't' + t.id, kind: 'topic', lvl: 'B2', t: t.q, min: 6 }));
  if (phase === 'P1') return prompts.concat(oral, extra, eco);
  if (phase === 'P3') return oral.concat(extra, eco, prompts.filter(p => p.lvl === 'B1'));
  return prompts.filter(p => p.lvl === 'B1').concat(oral, extra, eco);
};
const PH_ORDER = ['ph_daily1','ph_daily2','ph_news','ph_ecrit_intro','ph_ecrit_arg','ph_ecrit_nuance','ph_ecrit_conc','ph_lettre','ph_oral_mono','ph_oral_debat'];

function pickFor(type, phaseId) {
  const hi = phaseId !== 'P1';
  switch (type) {
    case 'grammar': {
      const r = firstUndone('grammar', window.GRAMMAR, g => g.id);
      if (r && !r.repeat) return { type: 'grammar', id: r.id, title: 'Урок ' + (window.GRAMMAR.indexOf(r.item) + 1) + '. ' + r.item.title, sub: r.item.lvl + ' · теория + упражнения', min: r.item.min || 20, route: '#/grammar/' + r.id };
      return { type: 'drill', id: 'mix', title: TYPES.drill.title, sub: 'Все уроки пройдены — смешанные упражнения', min: 12, route: '#/drill' };
    }
    case 'drill': if (Prog.countDone('grammar') < 2) return pickFor('grammar', phaseId); return { type: 'drill', id: 'mix', title: TYPES.drill.title, sub: '10 упражнений из пройденных уроков', min: 12, route: '#/drill' };
    case 'phrases': {
      const r = firstUndone('phr', PH_ORDER.map(id => SRS.Cards.topic(id)).filter(Boolean), t => t.id);
      if (!r) return null; const t = r.item;
      return { type: 'phrases', id: t.id, title: 'Фразы: ' + t.title, sub: t.ids.length + ' фраз — прочитай вслух и повтори по памяти', min: 12, route: '#/phrases/' + t.id };
    }
    case 'dictation': {
      const r = firstUndone('dict', window.DICTATIONS, d => d.id, d => hi ? (d.lvl === 'B1' || d.lvl === 'B2') : (d.lvl !== 'B2'));
      return { type: 'dictation', id: r.id, title: 'Диктант · ' + r.item.lvl, sub: r.item.ru + (r.repeat ? ' · повтор' : ''), min: 12, route: '#/dictee/' + r.id };
    }
    case 'listen': {
      const r = firstUndone('listen', window.LISTENINGS, l => l.id, l => hi ? (l.lvl === 'B2' || l.lvl === 'B1') : (l.lvl !== 'B2'));
      return { type: 'listen', id: r.id, title: 'Аудирование · ' + r.item.lvl, sub: r.item.title + ' · ' + r.item.kind + (r.repeat ? ' · повтор' : ''), min: 18, route: '#/listen/' + r.id };
    }
    case 'listen_x': {
      const r = firstUndone('ext', window.EXT_LISTEN, e => e.id);
      return { type: 'listen_x', id: r.id, title: 'Аудирование «вживую»', sub: r.item.t, min: 20, route: '#/listen/' + r.id };
    }
    case 'read': {
      const r = firstUndone('read', window.READINGS, l => l.id, l => hi ? (l.lvl === 'B2' || l.lvl === 'B1') : (l.lvl !== 'B2'));
      return { type: 'read', id: r.id, title: 'Чтение · ' + r.item.lvl + ' · ' + r.item.kind, sub: r.item.title + (r.repeat ? ' · повтор' : ''), min: 18, route: '#/read/' + r.id };
    }
    case 'read_x': {
      const r = firstUndone('ext', window.EXT_READ, e => e.id);
      return { type: 'read_x', id: r.id, title: 'Чтение «вживую»', sub: r.item.t, min: 20, route: '#/read/' + r.id };
    }
    case 'write': {
      const c = Plan.writeCandidates(phaseId);
      const r = firstUndone('write', c, x => x.id);
      return { type: 'write', id: r.id, title: 'Письмо' + (r.item.kind === 'prompt' ? ' · ' + r.item.lvl : ' · B2'), sub: r.item.t + (r.repeat ? ' · второй раз' : ''), min: r.item.words >= 250 ? 60 : 25, route: '#/write/' + r.id };
    }
    case 'speak': {
      const c = Plan.speakCandidates(phaseId);
      const r = firstUndone('speak', c, x => x.id);
      return { type: 'speak', id: r.id, title: 'Устная речь' + (r.item.kind === 'prompt' ? ' · ' + r.item.lvl : ' · B2'), sub: r.item.t + (r.repeat ? ' · второй раз' : ''), min: 15, route: '#/speak/' + r.id };
    }
    case 'mock': return { type: 'mock', id: 'mock', title: 'Пробный экзамен', sub: 'Одна или несколько частей по таймеру', min: 60, route: '#/exam' };
    case 'bulletin': return { type: 'bulletin', id: 'bulletin', title: 'Итоги недели', sub: 'Что получилось, что будет на следующей неделе', min: 6, route: '#/week' };
    case 'checklist': return { type: 'checklist', id: 'checklist', title: 'Чек-лист перед экзаменом', sub: 'Документы, маршрут, план утра', min: 10, route: '#/exam/checklist' };
    case 'examday': return { type: 'examday', id: 'examday', title: 'Сегодня экзамен', sub: 'Ты готова. Дыши. Читай вопросы до текста.', min: 0, route: '#/exam/checklist' };
  }
  return null;
}

/* Основная функция. persist=true — запоминает выбор заданий на день. */
Plan.forDay = (dk, persist) => {
  dk = dk || U.today();
  const ph = Plan.phase(dk), dow = U.dow(dk);
  const d = persist ? Store.day(dk) : (S().days[dk] || { srs: {}, tasks: {}, bonus: {}, picks: {}, light: false });
  const light = !!d.light;
  let types;
  if (ph.id === 'after') types = [];
  else if (ph.id === 'P4') types = (P4[ph.off] || []).slice();
  else types = (TABLE[ph.id][dow] || []).slice();
  const tasks = [];
  const soft = !light && ph.id !== 'after' && dk >= S().settings.startDate && Plan.dayNo(dk) <= 3;
  const target = d.srs && d.srs.target;
  tasks.push({ key: 'srs', type: 'srs', title: ph.id === 'after' ? 'Слова: поддерживаем форму' : TYPES.srs.title, sub: '', min: (light || soft) ? 8 : 12, route: '#/review', pts: 6 });
  const wanted = (light || soft) ? types.slice(0, 1) : types;
  if (persist) d.mcount = wanted.length;
  wanted.forEach((ty, i) => {
    const key = 'm' + (i + 1);
    let t;
    const stored = d.picks && d.picks[key];
    if (stored && stored.type === ty) t = Object.assign({}, stored.snap || {}, {});
    if (!t || !t.route) {
      t = pickFor(ty, ph.id === 'P4' || ph.id === 'P3' ? 'P3' : ph.id);
      if (persist && t) { d.picks[key] = { type: ty, snap: t }; }
    }
    if (t) { t.key = key; t.pts = 5; t.want = ty; tasks.push(t); }
  });
  tasks.push({ key: 'bonus', type: 'bonus', title: 'Слово и фраза дня', sub: 'Две минуты утром', min: 3, route: '#/today', pts: 4 });
  const total = U.sum(tasks.map(t => t.min));
  return { dk, phase: ph, dow, light, soft, tasks, minutes: total, dayNo: Plan.dayNo(dk), rest: dow === 6 };
};

/* Слово дня и фраза дня */
Plan.wotdList = () => {
  if (Plan._w) return Plan._w;
  Plan._w = (window.WOTD_RAW || '').trim().split('\n').map(l => { const p = l.split('|'); return { fr: p[0], ru: p[1], ex: p[2], exRu: p[3], note: p[4] }; });
  return Plan._w;
};
Plan.wotd = (dk) => { const L = Plan.wotdList(); const i = Math.max(0, U.diffDays(S().settings.startDate, dk)); return L[i % L.length]; };
Plan.phraseList = () => {
  if (Plan._p) return Plan._p;
  const out = [];
  ['ph_ecrit_intro','ph_ecrit_arg','ph_ecrit_nuance','ph_ecrit_conc','ph_oral_mono','ph_oral_debat','ph_lettre','ph_daily1','ph_daily2'].forEach(id => {
    const t = SRS.Cards.topic(id); if (!t) return;
    t.ids.forEach(cid => { const c = SRS.Cards.map[cid]; if (c.fr.length < 90 && !/^\s*$/.test(c.fr)) out.push({ id: cid, fr: c.fr, ru: c.ru, topic: t.title }); });
  });
  // перемешиваем так, чтобы категории чередовались
  Plan._p = U.shuffle(out, 'phr');
  return Plan._p;
};
Plan.phraseOfDay = (dk) => { const L = Plan.phraseList(); const i = Math.max(0, U.diffDays(S().settings.startDate, dk)); return L[i % L.length]; };
Plan.tip = (dk) => { const T = window.TIPS; return T[Math.max(0, U.diffDays(S().settings.startDate, dk)) % T.length]; };
})();
