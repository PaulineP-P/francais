/* Каркас приложения: маршрутизатор, навигация, праздничные эффекты */
(function(){
'use strict';
const App = window.App = { pages: {}, cleanup: null, route: null };
const $ = U.$;

const NAV = [
  { id: 'today', href: '#/today', label: 'Сегодня', icon: 'today', match: ['today', 'week'] },
  { id: 'words', href: '#/words', label: 'Слова', icon: 'cards', match: ['words', 'review'] },
  { id: 'practice', href: '#/practice', label: 'Практика', icon: 'practice', match: ['practice', 'grammar', 'drill', 'phrases', 'dictee', 'listen', 'read', 'write', 'speak', 'exam'] },
  { id: 'progress', href: '#/progress', label: 'Успех', icon: 'chart', match: ['progress'] },
  { id: 'more', href: '#/more', label: 'Ещё', icon: 'more', match: ['more', 'resources', 'settings'] }
];

App.applyTheme = () => {
  const t = Store.state.settings.theme, r = document.documentElement;
  if (t === 'light' || t === 'dark') r.setAttribute('data-theme', t); else r.removeAttribute('data-theme');
};

function dueBadge() {
  try { const q = SRS.queue(U.today()); return q.review.length + q.dueLearnNow; } catch (e) { return 0; }
}
App.renderNav = (active) => {
  const due = dueBadge();
  const items = NAV.map(n => {
    const cur = n.match.includes(active) ? ' aria-current="page"' : '';
    const badge = n.id === 'words' && due > 0 ? ' badge-dot" data-n="' + Math.min(due, 99) : '';
    return '<a class="nav' + badge + '" href="' + n.href + '"' + cur + '>' + U.icon(n.icon) + '<span>' + n.label + '</span></a>';
  }).join('');
  $('.bottom').innerHTML = items;
  const days = Plan.daysToExam(U.today());
  const cd = days >= 0 ? '<div class="count"><b>' + days + '</b><span class="muted">' + U.plural(days, 'день', 'дня', 'дней') + ' до экзамена</span></div>' : '<div class="count"><span class="muted">Экзамен позади</span></div>';
  $('.side').innerHTML = '<a class="brand" href="#/today">Cahier<b>.</b></a><div class="tag">Français · B2 · DELF</div>' + items + '<div class="spacer"></div>' + cd;
};

App.parseHash = () => {
  const h = (location.hash || '#/today').replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  const q = {}; (qs || '').split('&').forEach(p => { if (p) { const [k, v] = p.split('='); q[k] = decodeURIComponent(v || ''); } });
  return { name: parts[0] || 'today', args: parts.slice(1), q };
};
App.go = (hash) => { if (location.hash === hash) App.render(); else location.hash = hash; };

App.render = () => {
  const r = App.parseHash();
  if (App.cleanup) { try { App.cleanup(); } catch (e) {} App.cleanup = null; }
  U.stopSpeak();
  U.$$('.modal-bg').forEach(m => m.remove());
  const view = $('#view');
  const page = App.pages[r.name] || App.pages.today;
  App.route = r;
  App.renderNav(r.name);
  view.innerHTML = '';
  view.onclick = null;
  view.className = 'page';
  try {
    const res = page(view, r.args, r.q);
    if (typeof res === 'function') App.cleanup = res;
  } catch (e) {
    console.error(e);
    view.innerHTML = '<div class="sheet"><h2>Что-то пошло не так</h2><p class="muted">' + U.esc(e.message) + '</p><p><a class="btn" href="#/today">На главную</a></p></div>';
  }
  window.scrollTo(0, 0);
  document.title = (App.title || 'Cahier') + ' · Cahier de français';
  App.title = null;
  updateTopbar();
};
function updateTopbar() {
  const days = Plan.daysToExam(U.today());
  const sk = Streak.compute();
  $('.topbar').innerHTML = '<a class="brand" href="#/today">Cahier<b>.</b></a><div class="row" style="gap:8px">' +
    '<span class="pill ' + (sk.todayActive ? 'green' : '') + '" title="Серия дней">' + U.icon('flame', 'ic') + sk.cur + '</span>' +
    (days >= 0 ? '<span class="pill red">' + days + ' ' + U.plural(days, 'день', 'дня', 'дней') + '</span>' : '') + '</div>';
  U.$$('.topbar .pill svg').forEach(s => { s.style.cssText = 'width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round'; });
}
App.refreshChrome = () => { App.renderNav(App.route ? App.route.name : 'today'); updateTopbar(); };

/* Праздничные события */
App.celebrate = (events) => {
  (events || []).forEach((e, i) => {
    if (e.type === 'stamp') setTimeout(() => App.stamp(e.big, e.small), 250 + i * 50);
    if (e.type === 'badge') setTimeout(() => U.toast('Новый значок: ' + e.badge.name + ' — ' + e.badge.desc, 4200), 600 + i * 500);
  });
  App.refreshChrome();
};
App.stamp = (big, small) => {
  const old = U.$('.stamp'); if (old) old.remove();
  const el = document.createElement('div'); el.className = 'stamp'; el.setAttribute('role', 'alert');
  el.innerHTML = '<div><div class="big">' + U.esc(big) + '</div><div class="small">' + U.esc(small || '') + '</div></div>';
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 2600);
};
App.title = null;
App.setTitle = t => { App.title = t; };

/* Время, проведённое на сайте (считаем только активные минуты) */
let lastInput = Date.now();
['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(ev => window.addEventListener(ev, () => { lastInput = Date.now(); }, { passive: true }));
setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  if (Date.now() - lastInput > 90000) return;
  const d = Store.day(U.today()); d.ms = (d.ms || 0) + 10000; Store.save();
}, 10000);

App.boot = () => {
  App.applyTheme();
  window.addEventListener('hashchange', App.render);
  Store.onChange(() => {});
  App.render();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
};
})();
