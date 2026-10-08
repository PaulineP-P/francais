/* Хранилище: всё лежит в localStorage браузера. Есть экспорт/импорт JSON. */
(function(){
'use strict';
const KEY = 'cahier-fr-v1';
const Store = window.Store = {};
let mem = null, saveT = null, listeners = [];

Store.defaults = () => ({
  v: 1,
  created: U.today(),
  settings: {
    name: 'Полина', examDate: '2027-03-13', startDate: '2026-10-08',
    newPerDay: 12, maxReviews: 60, theme: 'auto', ttsRate: 0.92, voice: '',
    reviewMode: 'mix', remindTime: '19:00', lightDefault: false, sound: true
  },
  cards: {},        // id -> состояние карточки (для встроенных — только когда увидены)
  prio: [],         // темы, которые пользователь поставил вперёд
  skipTopics: [],   // темы, которые пользователь пропустил
  days: {},         // 'YYYY-MM-DD' -> {srs:{}, tasks:{}, bonus:{}, picks:{}, plan:[], ms:0, light:false}
  prog: { grammar: {}, dict: {}, listen: {}, read: {}, write: {}, speak: {}, phr: {}, ext: {} },
  mocks: [],        // {date, co, ce, pe, po}
  badges: {},       // id -> дата получения
  lastBackup: null,
  seenIntro: false
});

function deepMerge(base, src) {
  for (const k in src) {
    if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) deepMerge(base[k], src[k]);
    else base[k] = src[k];
  }
  return base;
}

Store.ok = true;
Store.load = () => {
  let raw = null;
  try { raw = localStorage.getItem(KEY); } catch (e) { Store.ok = false; }
  const d = Store.defaults();
  if (raw) { try { Store.state = deepMerge(d, JSON.parse(raw)); } catch (e) { Store.state = d; Store.corrupt = true; } }
  else Store.state = d;
  return Store.state;
};
Store.save = (now) => {
  const run = () => { try { localStorage.setItem(KEY, JSON.stringify(Store.state)); } catch (e) { Store.ok = false; } };
  if (now) { clearTimeout(saveT); run(); return; }
  clearTimeout(saveT); saveT = setTimeout(run, 250);
};
window.addEventListener('pagehide', () => Store.save(true));
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Store.save(true); });

Store.day = (k) => {
  k = k || U.today();
  const D = Store.state.days;
  if (!D[k]) D[k] = { srs: { n: 0, r: 0, ok: 0, rv: 0, k: 0, target: null }, tasks: {}, bonus: {}, picks: {}, plan: null, ms: 0, light: Store.state.settings.lightDefault };
  const d = D[k];
  if (!d.srs) d.srs = { n: 0, r: 0, ok: 0, rv: 0, k: 0, target: null };
  if (!d.tasks) d.tasks = {}; if (!d.bonus) d.bonus = {}; if (!d.picks) d.picks = {};
  return d;
};
Store.peekDay = k => Store.state.days[k] || null;
Store.touch = () => { Store.save(); listeners.forEach(f => { try { f(); } catch (e) {} }); };
Store.onChange = f => listeners.push(f);

Store.export = () => {
  Store.state.lastBackup = U.today(); Store.save(true);
  return JSON.stringify(Store.state, null, 1);
};
Store.import = (text) => {
  const obj = JSON.parse(text);
  if (!obj || typeof obj !== 'object' || !obj.settings || !obj.days) throw new Error('Это не файл резервной копии «Cahier».');
  Store.state = deepMerge(Store.defaults(), obj);
  Store.save(true);
};
Store.reset = () => { Store.state = Store.defaults(); Store.save(true); };
Store.load();
})();
