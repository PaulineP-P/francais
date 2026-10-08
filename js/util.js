/* Утилиты: DOM, даты, проверка ответов, озвучка, иконки */
(function(){
'use strict';
const U = window.U = {};

U.$ = (s, r) => (r || document).querySelector(s);
U.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
U.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
U.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
U.sum = a => a.reduce((x, y) => x + y, 0);
U.hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
U.shuffle = (a, seed) => { // детерминированно, если задан seed
  const r = a.slice(); let x = seed == null ? Math.random() * 4294967296 >>> 0 : U.hash(String(seed));
  const rnd = () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
};
U.plural = (n, a, b, c) => { n = Math.abs(n); const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return a; if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return b; return c; };

/* ---------- Время (можно подменить для тестов) ---------- */
let _offset = 0;
U.setNow = ms => { _offset = ms - Date.now(); };
U.now = () => Date.now() + _offset;
const pad = n => (n < 10 ? '0' : '') + n;
U.dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
U.today = () => U.dkey(new Date(U.now() - 3 * 3600 * 1000)); // новый «день» начинается в 3:00
U.parse = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); };
U.addDays = (k, n) => { const d = U.parse(k); d.setDate(d.getDate() + n); return U.dkey(d); };
U.diffDays = (a, b) => Math.round((U.parse(b) - U.parse(a)) / 86400000); // b - a
U.dow = k => (U.parse(k).getDay() + 6) % 7; // пн=0 … вс=6
U.weekStart = k => U.addDays(k, -U.dow(k));
const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const DAYS_FR = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const MONTHS_RU_G = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const DAYS_RU = ['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'];
const DAYS_RU_SHORT = ['пн','вт','ср','чт','пт','сб','вс'];
U.DAYS_RU_SHORT = DAYS_RU_SHORT;
U.frDate = k => { const d = U.parse(k); return DAYS_FR[U.dow(k)] + ' ' + d.getDate() + ' ' + MONTHS_FR[d.getMonth()]; };
U.ruDate = k => { const d = U.parse(k); return DAYS_RU[U.dow(k)] + ', ' + d.getDate() + ' ' + MONTHS_RU_G[d.getMonth()]; };
U.ruShort = k => { const d = U.parse(k); return d.getDate() + ' ' + MONTHS_RU_G[d.getMonth()]; };
U.ruLong = k => { const d = U.parse(k); return d.getDate() + ' ' + MONTHS_RU_G[d.getMonth()] + ' ' + d.getFullYear(); };
U.fmtMin = m => m >= 60 ? Math.floor(m / 60) + ' ч ' + (m % 60 ? (m % 60) + ' мин' : '') : m + ' мин';
U.fmtClock = s => { s = Math.max(0, Math.round(s)); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); };

/* ---------- Проверка ответа ---------- */
U.deacc = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
U.norm = s => String(s == null ? '' : s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[«»"“”]/g, '').replace(/\s+/g, ' ').replace(/[.!?;:,]+$/g, '').replace(/\s*\/\s*/g, ' / ').trim();
U.answerVariants = ans => {
  const out = new Set();
  String(ans).split(/\s+\/\s+/).forEach(part => {
    let p = part.replace(/\((?:f|m|pl|f pl|m pl|m\/f|f\/m|m ou f)\)/gi, '').replace(/\s+/g, ' ').trim();
    out.add(U.norm(p));
    if (/\(/.test(p)) {
      out.add(U.norm(p.replace(/\s*\([^)]*\)/g, '')));
      out.add(U.norm(p.replace(/[()]/g, '')));
    }
  });
  return Array.from(out).filter(Boolean);
};
const ART = /^(le |la |les |l'|un |une |des |du |de la |de l'|d')/;
/* Возвращает 'ok' | 'accent' | 'near' (нет артикля) | 'wrong' */
U.check = (input, answer, alts) => {
  const variants = U.answerVariants(answer).concat((alts || []).flatMap(a => U.answerVariants(a)));
  const i = U.norm(input);
  if (!i) return 'wrong';
  if (variants.includes(i)) return 'ok';
  const id = U.deacc(i);
  if (variants.some(v => U.deacc(v) === id)) return 'accent';
  if (variants.some(v => U.deacc(v.replace(ART, '')) === id.replace(ART, '') && id.replace(ART, '') === id)) return 'near';
  return 'wrong';
};
/* Для упражнений с несколькими пропусками: «a / b» */
U.checkMulti = (input, answer, alts) => {
  const a = String(answer);
  const direct = U.check(input, a, alts);
  if (direct === 'ok' || direct === 'accent') return direct;
  const A = a.split(/\s+\/\s+/), I = String(input).split(/\s*\/\s*/);
  if (A.length > 1 && A.every(x => !/\s/.test(x.trim()))) {
    const T = String(input).split(/[\s\/,;]+/).filter(Boolean);
    if (T.length === A.length) { const r = A.map((x, k) => U.check(T[k], x)); if (r.every(x => x === 'ok')) return 'ok'; if (r.every(x => x === 'ok' || x === 'accent')) return 'accent'; }
  }
  if (A.length > 1 && I.length === A.length) {
    const r = A.map((x, k) => U.check(I[k], x));
    if (r.every(x => x === 'ok')) return 'ok';
    if (r.every(x => x === 'ok' || x === 'accent')) return 'accent';
  }
  return 'wrong';
};

/* ---------- Озвучка ---------- */
let _voices = [];
const loadVoices = () => { try { _voices = (window.speechSynthesis && speechSynthesis.getVoices()) || []; } catch (e) { _voices = []; } };
if ('speechSynthesis' in window) { loadVoices(); try { speechSynthesis.addEventListener('voiceschanged', loadVoices); } catch (e) {} }
U.hasTTS = () => 'speechSynthesis' in window;
U.frVoices = () => _voices.filter(v => /^fr/i.test(v.lang));
U.pickVoice = (idx) => {
  const name = window.Store && Store.state && Store.state.settings.voice;
  const fr = U.frVoices();
  if (idx == null && name) { const m = fr.find(v => v.name === name); if (m) return m; }
  const pref = fr.filter(v => /fr[-_]FR/i.test(v.lang));
  const pool = pref.length ? pref : fr;
  if (!pool.length) return null;
  if (idx != null && pool.length > 1) return pool[idx % pool.length];
  return pool.find(v => /google|premium|enhanced|amelie|thomas|audrey|marie/i.test(v.name)) || pool[0];
};
U.stopSpeak = () => { try { speechSynthesis.cancel(); } catch (e) {} };
U.speak = (text, o) => {
  o = o || {};
  if (!U.hasTTS()) { if (o.onend) o.onend(); return false; }
  try {
    if (!o.queue) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    const v = U.pickVoice(o.voiceIdx); if (v) u.voice = v;
    const st = window.Store && Store.state ? Store.state.settings : {};
    u.rate = o.rate || st.ttsRate || 0.92;
    u.pitch = o.pitch || 1;
    if (o.onend) { u.onend = o.onend; u.onerror = o.onend; }
    speechSynthesis.speak(u);
    return true;
  } catch (e) { if (o.onend) o.onend(); return false; }
};
/* Читает реплики «Имя : текст» разными голосами */
U.speakScript = (text, o) => {
  o = o || {};
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
  const names = []; let i = 0; let stopped = false;
  U._scriptStop = () => { stopped = true; U.stopSpeak(); };
  const next = () => {
    if (stopped || i >= lines.length) { if (!stopped && o.onend) o.onend(); return; }
    const m = lines[i].match(/^([A-Za-zÀ-ÿ' ]{2,18})\s:\s(.+)$/);
    let who = null, t = lines[i];
    if (m) { who = m[1]; t = m[2]; if (!names.includes(who)) names.push(who); }
    i++;
    const k = who ? names.indexOf(who) : 0;
    U.speak(t, { queue: true, rate: o.rate, pitch: k % 2 ? 1.18 : 0.95, voiceIdx: k % 2 ? 1 : 0, onend: () => setTimeout(next, 220) });
  };
  U.stopSpeak(); next();
};

/* ---------- Иконки ---------- */
const P = {
  today:'<rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 2.8v3.4M16 2.8v3.4M8.6 14.6l2.4 2.4 4.4-4.6"/>',
  cards:'<rect x="3.5" y="6.5" width="14" height="12" rx="2"/><path d="M7 3.5h12.5a1.5 1.5 0 0 1 1.5 1.5v10"/>',
  practice:'<path d="M4 20l1.2-4.4L16.6 4.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.4 18.8 4 20z"/><path d="M14.5 6.3l3.2 3.2"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  more:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  play:'<path d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11-7.2a.8.8 0 0 0 0-1.4L8.2 4.1A.8.8 0 0 0 7 4.8z"/>',
  speaker:'<path d="M4 9.5v5h3.4L12 18.5v-13L7.4 9.5H4zM15.5 9a4.2 4.2 0 0 1 0 6M18 6.6a7.6 7.6 0 0 1 0 10.8"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  flame:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-2.4-1.3-4.3-2.7-6.1-.5 1.3-1.3 2.1-2.3 2.6.3-2.7-.8-5.4-3.5-7.3.1 3-1.4 4.5-2.8 6.2C6.4 11.9 5.5 13 5.5 14.8 5.5 18.4 8.1 21 12 21z"/>',
  book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  headphones:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="7" rx="1.6"/><rect x="16.5" y="14" width="4.5" height="7" rx="1.6"/>',
  pen:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  chat:'<path d="M20 12a8 8 0 0 1-11.7 7.1L3.5 20.5l1.4-4.4A8 8 0 1 1 20 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8L12 3.5z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H4.5v1.5A3 3 0 0 0 8 10.5M16 6h3.5v1.5a3 3 0 0 1-3.5 3M12 13v4M8.5 20.5h7M10 17h4"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.7" cy="6" r=".9"/><circle cx="4.7" cy="12" r=".9"/><circle cx="4.7" cy="18" r=".9"/>',
  download:'<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M4.5 19.5h15"/>',
  upload:'<path d="M12 16V5M7.5 9L12 4.5 16.5 9M4.5 19.5h15"/>',
  trash:'<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  edit:'<path d="M4 20l1-4L16 5a2 2 0 0 1 3 3L8 19l-4 1z"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  repeat:'<path d="M4 11V9a3 3 0 0 1 3-3h11M15 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H6M9 21l-3-3 3-3"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  ear:'<path d="M7 9a5 5 0 0 1 10 0c0 3-3 3.5-3 6.5a3 3 0 0 1-5.5 1.5"/><path d="M10 9a2 2 0 0 1 4 0"/>',
  grammar:'<path d="M4 19l4.5-12L13 19M5.8 14.5h5.4M16 8h4M16 12h4M16 16h4"/>',
  dict:'<path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3"/>',
  exam:'<path d="M5 3.5h10l4 4v13H5v-17zM14.5 3.5v4.5H19M8.5 13l2 2 4-4.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3L7 7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7"/>',
  moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  home:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 14a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
};
U.icon = (n, cls) => '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + (P[n] || '') + '</svg>';

/* ---------- Мелочи интерфейса ---------- */
U.toast = (msg, ms) => {
  const old = U.$('.toast'); if (old) old.remove();
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), ms || 2600);
};
U.modal = (html, onMount) => {
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  bg.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + '</div>';
  const close = () => bg.remove();
  bg.addEventListener('click', e => { if (e.target === bg) close(); });
  document.body.appendChild(bg);
  if (onMount) onMount(bg.firstChild, close);
  return close;
};
U.confirm = (msg, yes, ok) => new Promise(res => {
  U.modal('<p style="font-size:1.05rem">' + U.esc(msg) + '</p><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-a="n">Отмена</button><button class="btn red" data-a="y">' + U.esc(yes || 'Да') + '</button></div>', (m, close) => {
    m.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return; close(); res(a.dataset.a === 'y'); });
  });
});
U.download = (name, text, type) => {
  const b = new Blob([text], { type: type || 'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
};
U.countWords = t => (String(t).trim().match(/[A-Za-zÀ-ÿŒœ0-9]+(?:['’\-][A-Za-zÀ-ÿŒœ0-9]+)*/g) || []).length;
})();
