/* Пробный экзамен, журнал результатов, чек-лист экзамена */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;
const tot = m => (m.co || 0) + (m.ce || 0) + (m.pe || 0) + (m.po || 0);
const verdict = m => {
  const t = tot(m), low = ['co', 'ce', 'pe', 'po'].filter(k => (m[k] || 0) < 5);
  if (low.length) return { cls: 'red', text: 'Ниже порога 5/25 в части ' + low.map(x => x.toUpperCase()).join(', ') + ' — диплом не засчитывается, даже если сумма высокая.' };
  if (t >= 85) return { cls: 'green', text: 'Цель 85+ достигнута. Держи уровень.' };
  if (t >= 70) return { cls: 'hl', text: 'Уверенно сдано. До цели 85 — ' + (85 - t) + ' баллов: смотри слабую часть.' };
  if (t >= 50) return { cls: 'hl', text: 'Порог 50 пройден. До цели 85 — ' + (85 - t) + ' баллов.' };
  return { cls: 'red', text: 'Пока ниже 50. Смотри, какая часть слабее всех, и работай над ней.' };
};

function pickMany(arr, doneFn, n) {
  const und = arr.filter(x => !doneFn(x)), rest = arr.filter(x => doneFn(x));
  return und.concat(U.shuffle(rest, U.today())).slice(0, n);
}

App.pages.exam = function (view, args) {
  if (args[0] === 'checklist') return checklist(view);
  const days = Plan.daysToExam(U.today());
  const co = pickMany(window.LISTENINGS.filter(l => l.lvl === 'B2'), l => (S().prog.listen[l.id] || {}).done, 3);
  const ceInf = pickMany(window.READINGS.filter(r => r.kind === 'informatif' && r.lvl === 'B2'), r => (S().prog.read[r.id] || {}).done, 1)[0];
  const ceArg = pickMany(window.READINGS.filter(r => r.kind === 'argumentatif' && r.lvl === 'B2'), r => (S().prog.read[r.id] || {}).done, 1)[0];
  const pe = pickMany(window.TOPICS.filter(t => t.mode === 'ecrit'), t => (S().prog.write['t' + t.id] || {}).done, 1)[0];
  const po = pickMany(window.TOPICS.filter(t => t.mode === 'oral'), t => (S().prog.speak['t' + t.id] || {}).done, 1)[0];
  const mocks = S().mocks.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const last = mocks[mocks.length - 1];
  let html = '<h1 class="page-title">Пробный экзамен</h1><p class="page-sub">' + (days >= 0 ? 'До экзамена ' + days + ' ' + U.plural(days, 'день', 'дня', 'дней') + '. ' : '') + 'Проходи части по таймеру, как на реальном экзамене, и записывай баллы. Диплом: сумма ≥ 50 из 100 и не меньше 5 из 25 в каждой части. Твоя цель — 85+.</p>';
  html += '<div class="grid c2">' +
    '<section class="sheet"><h3>CO · Аудирование · ~30 мин</h3><p class="muted">3 упражнения: два длинных (2 прослушивания) и серия коротких (1 прослушивание). Включи «режим экзамена» в задании.</p>' + co.map((l, i) => '<div><a href="#/listen/' + l.id + '">' + (i + 1) + '. ' + esc(l.title) + '</a></div>').join('') + '</section>' +
    '<section class="sheet"><h3>CE · Чтение · 60 мин</h3><p class="muted">Два текста: informatif и argumentatif. Сначала вопросы, потом текст.</p>' + (ceInf ? '<div><a href="#/read/' + ceInf.id + '">1. ' + esc(ceInf.title) + '</a></div>' : '') + (ceArg ? '<div><a href="#/read/' + ceArg.id + '">2. ' + esc(ceArg.title) + '</a></div>' : '') + '<p class="faint" style="font-size:.88rem;margin-top:6px">Ориентир: 25–30 минут на текст.</p></section>' +
    '<section class="sheet"><h3>PE · Письмо · 60 мин</h3><p class="muted">≥ 250 слов (до 124 слов — 0 баллов!). Эссе, письмо или статья.</p>' + (pe ? '<div><a href="#/write/t' + pe.id + '">' + esc(pe.q) + '</a></div>' : '') + '</section>' +
    '<section class="sheet"><h3>PO · Речь · 30 мин подготовки + 20 мин</h3><p class="muted">Монолог 5–7 минут и дебаты. Включится таймер подготовки 30 минут.</p>' + (po ? '<div><a href="#/speak/t' + po.id + '">' + esc(po.q) + '</a></div>' : '') + '</section></div>';
  html += '<section class="sheet"><h2>Записать результат</h2><p class="muted">Официальные образцы заданий: <a href="https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b2" target="_blank" rel="noopener">France Éducation international</a>. Проверь работу по ключам и впиши баллы за каждую часть (из 25).</p>' +
    '<form id="mf" autocomplete="off"><div class="grid c3" style="gap:10px"><label class="fld"><span>Дата</span><input type="date" id="m-date" value="' + U.today() + '"></label><label class="fld"><span>CO /25</span><input type="number" id="m-co" min="0" max="25" step="0.5"></label><label class="fld"><span>CE /25</span><input type="number" id="m-ce" min="0" max="25" step="0.5"></label><label class="fld"><span>PE /25</span><input type="number" id="m-pe" min="0" max="25" step="0.5"></label><label class="fld"><span>PO /25</span><input type="number" id="m-po" min="0" max="25" step="0.5"></label></div>' +
    '<button class="btn" type="submit">Сохранить</button></form></section>';
  if (mocks.length) {
    html += '<section class="sheet"><h2>Мои пробные</h2>' + (last ? '<div class="fb ' + (verdict(last).cls === 'green' ? 'ok' : verdict(last).cls === 'red' ? 'bad' : 'near') + '">Последний: <b>' + tot(last) + ' / 100</b>. ' + verdict(last).text + '</div>' : '') +
      '<div class="scroll-x"><table class="gt"><tr><th>Дата</th><th>CO</th><th>CE</th><th>PE</th><th>PO</th><th>Итого</th></tr>' + mocks.slice().reverse().map(m => '<tr><td>' + U.ruShort(m.date) + '</td><td>' + (m.co || 0) + '</td><td>' + (m.ce || 0) + '</td><td>' + (m.pe || 0) + '</td><td>' + (m.po || 0) + '</td><td><b>' + tot(m) + '</b></td></tr>').join('') + '</table></div>' +
      (mocks.length >= 2 ? '<div id="mchart"></div>' : '') + '</section>';
  }
  html += '<p><a class="btn soft" href="#/exam/checklist">Чек-лист перед экзаменом</a></p>';
  view.innerHTML = html; App.setTitle('Экзамен');
  if (mocks.length >= 2) U.$('#mchart', view).innerHTML = spark(mocks.map(m => tot(m)), 100, 50, 85);
  U.$('#mf', view).onsubmit = (e) => {
    e.preventDefault();
    const g = k => parseFloat(U.$('#m-' + k, view).value);
    const m = { date: U.$('#m-date', view).value || U.today(), co: g('co'), ce: g('ce'), pe: g('pe'), po: g('po') };
    if (['co', 'ce', 'pe', 'po'].some(k => isNaN(m[k]) || m[k] < 0 || m[k] > 25)) { U.toast('Впиши все четыре оценки от 0 до 25'); return; }
    S().mocks.push(m); Store.touch();
    const ev = Prog.done('mock', 'mock', { ok: true });
    App.celebrate(ev); App.pages.exam(view, args);
    U.toast('Сохранено: ' + tot(m) + ' / 100');
  };
};

/* Простой SVG-график с линиями порога и цели */
function spark(vals, max, passLine, goalLine) {
  const W = 560, H = 120, pad = 10, n = vals.length;
  const x = i => pad + (n === 1 ? 0 : i * (W - 2 * pad) / (n - 1)), y = v => H - pad - (v / max) * (H - 2 * pad);
  const pts = vals.map((v, i) => x(i) + ',' + y(v)).join(' ');
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="spark" role="img" aria-label="Динамика результатов" preserveAspectRatio="none">' +
    (passLine != null ? '<line x1="0" x2="' + W + '" y1="' + y(passLine) + '" y2="' + y(passLine) + '" stroke="var(--red)" stroke-dasharray="4 4" stroke-width="1.5"/>' : '') +
    (goalLine != null ? '<line x1="0" x2="' + W + '" y1="' + y(goalLine) + '" y2="' + y(goalLine) + '" stroke="var(--green)" stroke-dasharray="4 4" stroke-width="1.5"/>' : '') +
    '<polyline fill="none" stroke="var(--ink)" stroke-width="2.5" points="' + pts + '"/>' + vals.map((v, i) => '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="4" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>').join('') + '</svg>';
}
window.spark = spark;

/* Чек-лист */
const CHECK = [
  ['За 2–3 недели', ['Проверь на сайте Institut français дату, время и аудиторию своей сессии', 'Убедись, что регистрация и оплата подтверждены', 'Пройди хотя бы один полный пробный экзамен по таймеру']],
  ['За день до экзамена', ['Convocation (приглашение) распечатано или сохранено на телефоне', 'Паспорт (или документ, указанный в приглашении) — в сумке', 'Две ручки (чёрная/синяя), запасная, бутылка воды, наушников не нужно', 'Маршрут проверен, дорога с запасом 40+ минут', 'Хороший сон важнее ночной зубрёжки: никаких новых тем']],
  ['Утро экзамена', ['Лёгкий завтрак, вода', 'Прочитай вслух шаблон введения и заключения — 5 минут', 'Повтори 10 любимых связок', 'Приди за 30–40 минут до начала']],
  ['Аудирование', ['1 минута перед записью: прочитай ВСЕ вопросы и подчеркни ключевые слова', 'Первое прослушивание — общий смысл и позиция; второе — детали и цифры', 'Не застревай: следующий вопрос важнее прошлого', 'Не оставляй пустых ответов: QCM, угадывание не штрафуется']],
  ['Чтение', ['Сначала вопросы, потом текст', 'Отметь, где мнение автора, а где чужое («certains pensent que…»)', '25–30 минут на текст', 'Слова оценки (heureusement, malheureusement) выдают позицию автора']],
  ['Письмо', ['5 минут на план — не пропускай его', 'Минимум 250 слов, идеально 250–300', 'Введение: accroche → проблема → позиция', 'Каждый аргумент = мысль + пример', 'Заключение — вывод, не повтор', '8–10 минут на проверку: согласование, артикли, причастия с être, орфография']],
  ['Устная часть', ['30 минут подготовки: 3 мин выбрать документ, 15 мин план, 10 мин — введение и заключение целиком', 'Не читай по бумаге — смотри на экзаменатора', 'Не пересказывай документ: давай своё мнение', 'На возражение: «Je comprends votre argument, mais…»', 'Не поняла вопрос — переспроси: «Pourriez-vous préciser ?»']]
];
function checklist(view) {
  const saved = S().prog.ext._check = S().prog.ext._check || { items: {} };
  let html = '<div class="crumbs"><a href="#/exam">Экзамен</a> / чек-лист</div><h1 class="page-title">Чек-лист экзамена</h1><p class="page-sub">Даты, правила приёма и требования к документам проверяй только на официальном сайте Institut français и в своём приглашении (convocation) — они могут меняться.</p>';
  CHECK.forEach((sec, si) => {
    html += '<section class="sheet"><h3>' + esc(sec[0]) + '</h3>' + sec[1].map((t, i) => '<label class="opt"><input type="checkbox" data-k="' + si + '-' + i + '"' + (saved.items[si + '-' + i] ? ' checked' : '') + '><span>' + esc(t) + '</span></label>').join('') + '</section>';
  });
  html += '<div class="row"><button class="btn green" data-a="ready">Я готова</button></div>';
  view.innerHTML = html; App.setTitle('Чек-лист');
  view.onclick = (e) => {
    const c = e.target.closest('input[data-k]'); if (c) { saved.items[c.dataset.k] = c.checked; Store.save(); }
    if (e.target.closest('[data-a="ready"]')) {
      App.celebrate(Prog.done('checklist', 'checklist', { ok: true }).concat(Prog.done('examday', 'examday', { ok: true })));
      App.stamp('Tu es prête !', 'Спокойно. Ты много сделала.');
    }
  };
}
})();
