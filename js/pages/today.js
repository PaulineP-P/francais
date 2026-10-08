/* Страница «Сегодня» */
(function(){
'use strict';
const esc = U.esc;

function gradeSVG() {
  return '<svg viewBox="0 0 132 132" aria-hidden="true"><path d="M14 64C12 30 48 10 84 14c30 4 44 30 36 58-8 28-40 46-72 40C26 108 16 88 14 64z" fill="none" stroke="var(--red)" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 0"/></svg>';
}
function weekStrip(dk, sk) {
  const ws = U.weekStart(dk);
  let html = '<div class="week">';
  for (let i = 0; i < 7; i++) {
    const k = U.addDays(ws, i), sc = Score.day(k);
    let cls = '', mark = U.parse(k).getDate();
    if (k === dk) cls += ' today';
    if (i === 6) cls += ' rest';
    if (Score.active(k)) { cls += Score.isComplete(k) ? ' ok' : ' part'; mark = sc.note; }
    else if (sk.frozen.includes(k)) { cls += ' joker'; mark = '❄'; }
    html += '<div class="d' + cls + '">' + U.DAYS_RU_SHORT[i] + '<i>' + mark + '</i></div>';
  }
  return html + '</div>';
}
function taskHTML(t, plan, dk, q) {
  const day = Store.day(dk), tm = Plan.TYPES[t.type] || {};
  let done = false, sub = t.sub;
  if (t.key === 'srs') {
    done = Score.srsPts(day) >= 6;
    const n = q.review.length + q.dueLearnNow, nw = q.news.length;
    sub = (n + nw === 0) ? 'Сегодня ничего не нужно — загляни и отметься' : (n ? n + ' ' + U.plural(n, 'слово', 'слова', 'слов') + ' к повторению' : '') + (n && nw ? ' · ' : '') + (nw ? nw + ' ' + U.plural(nw, 'новое', 'новых', 'новых') : '');
    if (q.backlog) sub += ' · ещё ' + q.backlog + ' подождут';
  } else done = !!day.tasks[t.key];
  const icon = tm.icon || 'star';
  return '<a class="task' + (done ? ' done' : '') + '" href="' + t.route + '">' +
    '<span class="box">' + U.icon('check') + '</span>' +
    '<span class="kind">' + U.icon(icon) + '</span>' +
    '<span style="min-width:0"><div class="t">' + esc(t.title) + '</div><div class="s">' + esc(sub || '') + '</div></span>' +
    '<span class="go">' + (done ? 'готово' : '~' + t.min + ' мин') + '</span></a>';
}

App.pages.today = function (view) {
  const dk = U.today();
  const plan = Plan.forDay(dk, true);
  SRS.ensureTarget(dk);
  const q = SRS.queue(dk);
  const day = Store.day(dk);
  const sc = Score.day(dk), sk = Streak.compute();
  const st = Store.state.settings;
  const first = Object.keys(Store.state.days).length <= 1 && !Store.state.seenIntro;

  /* дни перерыва */
  let gap = 0;
  const lastAct = sk.last; if (lastAct) gap = U.diffDays(lastAct, dk);
  const milestone = sk.todayActive && [7, 14, 30, 60, 100].includes(sk.cur) ? sk.cur : 0;
  const remark = Remark.pick({ dk, n: sc.note, active: Score.active(dk), full: Score.isComplete(dk), gap, light: plan.light, rest: plan.rest, phase: plan.phase.id, streakMilestone: milestone });

  const days = Plan.daysToExam(dk);
  const w = Plan.wotd(dk), ph = Plan.phraseOfDay(dk);
  const tip = Plan.tip(dk);
  const tomorrow = Plan.forDay(U.addDays(dk, 1), false);
  const mainTasks = plan.tasks.filter(t => t.key !== 'bonus');

  let html = '';
  html += '<div class="hello"><div>' +
    '<h1 class="date-hand">' + esc(U.frDate(dk)) + '</h1>' +
    '<div class="muted">' + esc(U.ruDate(dk)) + ' · день ' + plan.dayNo + ' · ' + esc(plan.phase.name) + '</div>' +
    '<p class="remark">' + esc(remark) + '</p></div>' +
    '<div class="grade" title="Оценка дня">' + gradeSVG() + '<div class="num">' + sc.note + '<small>/20</small></div></div></div>';

  if (plan.phase.id === 'after') {
    html += '<div class="sheet"><h2>Экзамен позади</h2><p>Теперь — поддерживать форму: слова каждый день и французский для удовольствия (фильмы, подкасты, книги). Когда будут результаты, отметь их в разделе «Успех».</p></div>';
  }

  /* список заданий */
  html += '<section class="sheet ruled" aria-labelledby="hd"><div class="row between" style="margin-bottom:10px"><h2 id="hd" style="margin:0">Devoirs du jour</h2>' +
    '<span class="pill">≈ ' + plan.minutes + ' мин' + (plan.light ? ' · минимум' : '') + '</span></div><div class="tasks">' +
    mainTasks.map(t => taskHTML(t, plan, dk, q)).join('') + '</div>';
  if (plan.soft) html += '<p class="tip-hand" style="margin:12px 0 0">Первые три дня — мягкий старт: слова и одно задание. Дальше добавится второе.</p>';
  if (plan.rest && !plan.light) html += '<p class="tip-hand" style="margin:12px 0 0">Воскресенье — день отдыха. Слова — максимум пять минут, остальное необязательно.</p>';
  if (plan.phase.id !== 'after') {
    html += '<div class="row" style="margin-top:12px">' + (plan.light
      ? '<button class="btn small soft" data-a="full">Вернуть полный план</button><span class="faint" style="font-size:.88rem">Режим минимум: только слова и одно задание.</span>'
      : '<button class="btn small soft" data-a="light">Сегодня тяжело? Режим минимум (≈10 мин)</button>') + '</div>';
  }
  html += '</section>';

  /* слово и фраза дня */
  html += '<div class="grid c2">';
  html += '<section class="sheet wotd"><div class="row between"><span class="faint">Mot du jour</span><button class="iconbtn" data-a="say-w" aria-label="Произнести">' + U.icon('speaker') + '</button></div>' +
    '<div class="word">' + esc(w.fr) + '</div><div class="muted" style="margin-top:2px">' + esc(w.ru) + '</div>' +
    '<div class="ex">' + esc(w.ex) + '</div><div class="muted" style="font-size:.9rem">' + esc(w.exRu) + '</div>' +
    (w.note ? '<div class="note">' + esc(w.note) + '</div>' : '') +
    '<div class="row" style="margin-top:12px">' +
    (day.bonus.w ? '<span class="pill green">' + U.icon('check', 'ic') + 'выучено · +2</span>' : '<button class="btn small" data-a="ok-w">Запомнила · +2</button>') +
    '<button class="btn small ghost" data-a="add-w">В мои слова</button></div></section>';
  html += '<section class="sheet wotd"><div class="row between"><span class="faint">Phrase du jour</span><span class="row" style="gap:6px"><button class="iconbtn" data-a="say-p" aria-label="Произнести">' + U.icon('speaker') + '</button><button class="iconbtn" data-a="slow-p" aria-label="Медленно" title="Медленно">' + U.icon('clock') + '</button></span></div>' +
    '<div class="word" style="font-size:1.55rem;margin-top:8px">' + esc(ph.fr) + '</div><div class="muted" style="margin-top:6px">' + esc(ph.ru) + '</div>' +
    '<div class="note" style="font-size:1.15rem">Прочитай вслух 3 раза, потом закрой текст и скажи по памяти.</div>' +
    '<div class="row" style="margin-top:12px">' +
    (day.bonus.p ? '<span class="pill green">' + U.icon('check', 'ic') + 'повторила · +2</span>' : '<button class="btn small" data-a="ok-p">Повторила вслух · +2</button>') +
    '<button class="btn small ghost" data-a="add-p">В мои слова</button></div></section>';
  html += '</div>';

  /* неделя и серия */
  html += '<section class="sheet"><div class="row between" style="margin-bottom:6px"><h3 style="margin:0">Эта неделя</h3>' +
    '<span class="row" style="gap:8px"><span class="pill ' + (sk.todayActive ? 'green' : '') + '">' + U.icon('flame', 'ic') + 'серия ' + sk.cur + '</span><span class="pill" title="Джокер спасает серию, если пропустишь день">' + '❄ ' + sk.jokers + '</span></span></div>' +
    weekStrip(dk, sk) + '</section>';

  /* завтра + совет */
  html += '<div class="grid c2"><section class="sheet"><h3>Завтра</h3>' + (tomorrow.tasks.filter(t => t.key !== 'bonus' && t.key !== 'srs').map(t => '<div class="row" style="gap:8px;margin-bottom:6px"><span class="kind" style="width:30px;height:30px;border-radius:8px;background:var(--blue-soft);display:grid;place-items:center;color:var(--blue)"><span style="width:18px;height:18px;display:block">' + U.icon((Plan.TYPES[t.type] || {}).icon || 'star') + '</span></span><span>' + esc(t.title) + '</span></div>').join('') || '<p class="muted">Только слова — день отдыха.</p>') +
    '<style>.kind svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}</style></section>' +
    '<section class="sheet"><h3>Совет дня</h3><p class="tip-hand">' + esc(tip) + '</p></section></div>';

  /* резервная копия */
  const act = Object.keys(Store.state.days).length;
  const lb = Store.state.lastBackup;
  if (act >= 6 && (!lb || U.diffDays(lb, dk) > 10)) {
    html += '<div class="sheet" style="border-color:var(--hl);background:var(--hl-soft)"><b>Сохрани копию прогресса.</b> Данные лежат только в этом браузере. <a href="#/more">Скачать резервную копию</a> — это 1 клик.</div>';
  }
  if (!Store.ok) html += '<div class="sheet" style="border-color:var(--red)"><b>Браузер не сохраняет данные</b> (приватный режим?). Открой сайт в обычном окне.</div>';

  view.innerHTML = html;
  App.setTitle('Сегодня');

  /* ---- события ---- */
  const rerender = () => App.pages.today(view);
  view.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'say-w') U.speak(w.fr + '. ' + w.ex);
    if (a === 'say-p') U.speak(ph.fr);
    if (a === 'slow-p') U.speak(ph.fr, { rate: 0.6 });
    if (a === 'ok-w') { App.celebrate(Prog.bonus('w')); rerender(); }
    if (a === 'ok-p') { App.celebrate(Prog.bonus('p')); rerender(); }
    if (a === 'add-w') { const r = SRS.addCustom(w.fr, w.ru, w.ex, 'mot du jour'); U.toast(r && r.dup ? 'Это слово уже в «Моих словах»' : 'Добавлено в «Мои слова»'); App.refreshChrome(); }
    if (a === 'add-p') { const r = SRS.addCustom(ph.fr, ph.ru, '', 'phrase du jour'); U.toast(r && r.dup ? 'Эта фраза уже есть' : 'Добавлено в «Мои слова»'); App.refreshChrome(); }
    if (a === 'light') { Store.day(dk).light = true; Plan.forDay(dk, true); Store.touch(); rerender(); App.refreshChrome(); }
    if (a === 'full') { Store.day(dk).light = false; Plan.forDay(dk, true); Store.touch(); rerender(); }
  };

  if (first) {
    Store.state.seenIntro = true; Store.save(true);
    U.modal('<h2 style="margin-top:0">Bienvenue !</h2>' +
      '<p>Это твоя личная тетрадь для подготовки к DELF B2. Каждый день на экране «Сегодня» — короткий список: слова + 1–2 задания. Выполнила — получила оценку из 20 и штамп от «учителя».</p>' +
      '<p><b>Если сил нет</b> — есть режим «минимум» на 10 минут. Серия не обнуляется из-за одного пропуска: помогает «джокер» ❄. Воскресенье — день отдыха.</p>' +
      '<label class="fld"><span>Как к тебе обращаться?</span><input type="text" id="in-name" value="' + esc(st.name) + '"></label>' +
      '<label class="fld"><span>Дата экзамена (проверь на сайте Institut français — потом поменяешь в настройках)</span><input type="date" id="in-exam" value="' + esc(st.examDate) + '"></label>' +
      '<div class="row" style="justify-content:flex-end"><button class="btn" id="in-go">Начать</button></div>', (m, close) => {
        m.querySelector('#in-go').onclick = () => {
          const n = m.querySelector('#in-name').value.trim(); const ex = m.querySelector('#in-exam').value;
          if (n) st.name = n; if (ex) st.examDate = ex;
          Store.state.seenIntro = true; Store.save(true); close(); App.render();
        };
      });
  }
};
})();
