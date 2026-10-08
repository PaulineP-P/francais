/* Service worker: сайт работает офлайн. Увеличь VERSION при обновлении файлов. */
const VERSION = 'cahier-v1';
const CORE = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css', 'css/fonts.css',
  'js/util.js', 'js/store.js', 'js/srs.js', 'js/plan.js', 'js/score.js', 'js/pen.js', 'js/app.js',
  'js/data/vocab.js', 'js/data/phrases.js', 'js/data/grammar_a.js', 'js/data/grammar_b.js', 'js/data/dictation.js', 'js/data/listening.js', 'js/data/reading.js', 'js/data/prompts.js', 'js/data/topics.js', 'js/data/wotd.js', 'js/data/resources.js', 'js/data/ext.js',
  'js/pages/shared.js', 'js/pages/today.js', 'js/pages/review.js', 'js/pages/words.js', 'js/pages/practice.js', 'js/pages/grammar.js', 'js/pages/phrases.js', 'js/pages/dictee.js', 'js/pages/listen.js', 'js/pages/read.js', 'js/pages/write.js', 'js/pages/speak.js', 'js/pages/exam.js', 'js/pages/progress.js', 'js/pages/more.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Сначала сеть (чтобы обновления доходили), при отсутствии сети — кэш. Шрифты и картинки — сначала кэш. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isAsset = /\.(woff2|png|ico)$/.test(req.url);
  if (isAsset) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; })));
    return;
  }
  e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
});
