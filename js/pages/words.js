/* Слова: темы, мои слова, поиск */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;
const LV_NAME = { A1: 'A1 · базовые темы', A2: 'A2 · расширение', B1: 'B1 · абстрактные темы', B2: 'B2 · аргументация', ECO: 'Экология', PH: 'Фразы и клише' };

function status(id) {
  const c = S().cards[id]; if (!c) return 'new';
  if (c.st === 'learn') return 'learn'; if (c.st === 'rev') return c.ivl >= 21 ? 'mature' : 'young'; if (c.st === 'susp') return 'new'; return 'new';
}
const STATUS_RU = { new: 'не начато', learn: 'учится', young: 'в памяти', mature: 'надолго' };
function topicStats(t) { let k = 0; t.ids.forEach(id => { if (S().cards[id] && S().cards[id].st !== 'susp' && S().cards[id].st !== 'new') k++; }); return k; }

function parseBulk(text) {
  const out = [];
  text.split('\n').forEach(raw => {
    const ln = raw.trim(); if (!ln) return;
    let fr, ru;
    if (ln.includes('\t')) [fr, ru] = ln.split('\t');
    else if (/\s[-–—]\s/.test(ln)) { const m = ln.split(/\s[-–—]\s/); fr = m[0]; ru = m.slice(1).join(' - '); }
    else if (ln.includes('|')) [fr, ru] = ln.split('|');
    else if (ln.includes(';')) [fr, ru] = ln.split(';');
    else if (ln.includes(' = ')) [fr, ru] = ln.split(' = ');
    if (fr && ru) out.push([fr.trim(), ru.trim()]);
  });
  return out;
}

App.pages.words = function (view, args, q) {
  let tab = q.tab || 'topics';
  const dk = U.today();
  const render = () => {
    const Q = SRS.queue(dk), stats = SRS.stats();
    const dueN = Q.review.length + Q.dueLearnNow;
    const hard = SRS.hardCards().length;
    let html = '<h1 class="page-title">Слова</h1><p class="page-sub">884 слова и фразы по темам + твои собственные. Повторение по интервалам: чем лучше помнишь, тем реже карточка возвращается.</p>';
    html += '<section class="sheet"><div class="row between" style="align-items:flex-start">' +
      '<div><div class="stat"><b>' + dueN + '</b><small>к повторению сейчас</small></div>' +
      '<div class="muted" style="margin-top:4px">' + (Q.news.length ? Q.news.length + ' ' + U.plural(Q.news.length, 'новое слово', 'новых слова', 'новых слов') + ' на сегодня' : 'новые на сегодня закончились') + (Q.backlog ? ' · ещё ' + Q.backlog + ' подождут до завтра' : '') + '</div></div>' +
      '<a class="btn" href="#/review">' + U.icon('play') + ((dueN + Q.news.length) ? 'Начать повторение' : 'Открыть') + '</a></div>' +
      '<hr class="dash"><div class="grid c3" style="gap:10px">' +
      '<div class="stat"><b>' + stats.known + '</b><small>слов в памяти</small></div>' +
      '<div class="stat"><b>' + stats.mature + '</b><small>выучено надолго (≥ 21 дня)</small></div>' +
      '<div class="stat"><b>' + stats.unseen + '</b><small>ещё не открыто из ' + stats.totalBuiltin + '</small></div></div>' +
      (hard ? '<div style="margin-top:12px"><a class="btn small soft" href="#/review?mode=hard">Потренировать сложные слова (' + hard + ')</a></div>' : '') + '</section>';
    html += '<div class="tabs" role="tablist">' + [['topics', 'Темы'], ['mine', 'Мои слова' + (stats.custom ? ' · ' + stats.custom : '')], ['search', 'Поиск']].map(t => '<button role="tab" data-tab="' + t[0] + '" class="' + (tab === t[0] ? 'on' : '') + '">' + t[1] + '</button>').join('') + '</div>';
    html += '<div id="tabbody"></div>';
    view.innerHTML = html;
    drawTab();
  };
  const drawTab = () => {
    const body = U.$('#tabbody', view);
    if (tab === 'topics') drawTopics(body);
    else if (tab === 'mine') drawMine(body);
    else drawSearch(body);
  };

  const drawTopics = (body) => {
    const order = SRS.topicOrder(); const orderIdx = {}; SRS.Cards.order.forEach((id, i) => orderIdx[id] = i);
    const levels = ['A1', 'A2', 'B1', 'B2', 'ECO', 'PH'];
    let html = '';
    levels.forEach(lv => {
      const ts = SRS.Cards.topics.filter(t => t.level === lv);
      if (!ts.length) return;
      const tot = U.sum(ts.map(t => t.ids.length)), kn = U.sum(ts.map(topicStats));
      html += '<h2 style="margin:22px 0 8px" class="row between"><span>' + esc(LV_NAME[lv]) + '</span><span class="muted" style="font-size:.9rem;font-family:var(--f-ui);font-weight:500">' + kn + ' / ' + tot + '</span></h2>';
      ts.forEach(t => {
        const k = topicStats(t), pct = Math.round(100 * k / t.ids.length);
        const skipped = S().skipTopics.includes(t.id), prio = S().prio.includes(t.id);
        html += '<details class="topic" data-tid="' + t.id + '"><summary><div><div class="tt">' + esc(t.title) + (t.fr ? ' <span class="faint fr" style="font-weight:400">· ' + esc(t.fr) + '</span>' : '') + '</div>' +
          '<div class="ts">' + k + ' из ' + t.ids.length + (prio ? ' · учим сейчас' : '') + (skipped ? ' · пропущена' : '') + '</div></div><div class="mini"><div class="bar ' + (pct === 100 ? 'green' : '') + '"><i style="width:' + pct + '%"></i></div></div></summary><div class="tbody"></div></details>';
      });
    });
    body.innerHTML = html;
    body.addEventListener('toggle', (e) => {
      const d = e.target; if (!d.matches || !d.matches('details.topic') || !d.open) return;
      const tb = d.querySelector('.tbody'); if (tb.dataset.done) return; tb.dataset.done = 1;
      const t = SRS.Cards.topic(d.dataset.tid);
      const skipped = S().skipTopics.includes(t.id), prio = S().prio.includes(t.id);
      tb.innerHTML = '<div class="row" style="padding:10px 14px;gap:8px">' +
        '<button class="btn small" data-a="prio" data-t="' + t.id + '">' + (prio ? 'Убрать из «учим сейчас»' : 'Учить эту тему сейчас') + '</button>' +
        '<button class="btn small soft" data-a="know-topic" data-t="' + t.id + '">Знаю всю тему</button>' +
        '<button class="btn small soft" data-a="skip" data-t="' + t.id + '">' + (skipped ? 'Вернуть тему' : 'Пропустить тему') + '</button>' +
        '<a class="btn small ghost" href="#/review?topic=' + t.id + '">Потренировать</a></div>' +
        '<table class="cards"><tbody>' + t.ids.map(id => { const c = SRS.Cards.map[id], s = status(id); return '<tr><td class="f">' + esc(c.fr) + '</td><td>' + esc(c.ru) + '</td><td class="s" title="' + STATUS_RU[s] + '"><span class="dot ' + s + '"></span></td></tr>'; }).join('') + '</tbody></table>';
    }, true);
  };

  const drawMine = (body) => {
    const mine = Object.keys(S().cards).filter(id => S().cards[id].custom).sort((a, b) => S().cards[b].added - S().cards[a].added);
    let html = '<section class="sheet"><h3>Добавить слово</h3>' +
      '<form id="addf" autocomplete="off"><div class="grid c2" style="gap:10px"><label class="fld"><span>По-французски</span><input type="text" id="a-fr" placeholder="un enjeu" autocapitalize="none"></label><label class="fld"><span>Перевод</span><input type="text" id="a-ru" placeholder="вызов, ставка"></label></div>' +
      '<label class="fld"><span>Пример (необязательно)</span><input type="text" id="a-ex" placeholder="Le climat est un enjeu majeur."></label>' +
      '<button class="btn" type="submit">' + U.icon('plus') + 'Добавить</button></form></section>';
    html += '<section class="sheet"><details class="fold"><summary>Вставить сразу много слов (из Quizlet, Excel, заметок)</summary><p class="muted" style="margin-top:8px">Одна пара на строку. Разделитель: Tab, « - », « — », « | » или « ; ».</p><textarea id="bulk" rows="6" placeholder="la sécheresse\tзасуха\nune hausse - рост"></textarea><div style="margin-top:8px"><button class="btn small" id="bulk-go">Добавить все</button></div></details></section>';
    html += '<section class="sheet"><div class="row between"><h3 style="margin:0">Мои слова · ' + mine.length + '</h3><span class="row" style="gap:8px">' + (mine.length ? '<a class="btn small soft" href="#/review?topic=custom">Потренировать</a><button class="btn small ghost" id="copy-mine">Скопировать для Quizlet</button>' : '') + '</span></div>';
    if (!mine.length) html += '<div class="empty"><div class="hand">Здесь появятся твои слова</div><p>Сохраняй слова из статей и подкастов — они попадут в то же интервальное повторение.</p></div>';
    else html += '<table class="cards" style="margin-top:8px"><tbody>' + mine.map(id => { const c = S().cards[id], s = status(id); return '<tr><td class="f">' + esc(c.fr) + (c.ex ? '<div class="faint" style="font-weight:400;font-size:.85rem;font-style:italic">' + esc(c.ex) + '</div>' : '') + '</td><td>' + esc(c.ru) + '</td><td class="s"><span class="dot ' + s + '" title="' + STATUS_RU[s] + '"></span> <button class="iconbtn" style="width:32px;height:32px" data-a="del" data-id="' + id + '" aria-label="Удалить">' + U.icon('trash') + '</button></td></tr>'; }).join('') + '</tbody></table>';
    html += '</section>';
    body.innerHTML = html;
    U.$('#addf', body).onsubmit = (e) => {
      e.preventDefault();
      const fr = U.$('#a-fr', body).value, ru = U.$('#a-ru', body).value, ex = U.$('#a-ex', body).value;
      if (!fr.trim() || !ru.trim()) { U.toast('Заполни слово и перевод'); return; }
      const r = SRS.addCustom(fr, ru, ex);
      if (r && r.dup) U.toast('Такое слово уже есть'); else U.toast('Добавлено · завтра оно появится в повторении');
      App.refreshChrome(); drawTab();
    };
    const bg = U.$('#bulk-go', body);
    if (bg) bg.onclick = () => {
      const pairs = parseBulk(U.$('#bulk', body).value); let n = 0, d = 0;
      pairs.forEach(([a, b]) => { const r = SRS.addCustom(a, b); if (r && r.id) n++; else d++; });
      U.toast('Добавлено: ' + n + (d ? ', повторов: ' + d : '')); App.refreshChrome(); drawTab();
    };
    const cm = U.$('#copy-mine', body);
    if (cm) cm.onclick = () => {
      const txt = mine.map(id => S().cards[id].fr + '\t' + S().cards[id].ru).join('\n');
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => U.toast('Скопировано — вставь в импорт Quizlet'), () => { U.download('moi-slova.txt', txt); });
    };
  };

  const drawSearch = (body) => {
    body.innerHTML = '<section class="sheet"><label class="fld"><span>Найти слово (по-французски или по-русски)</span><input type="text" id="sq" placeholder="например: enjeu или засуха"></label><div id="sr"></div></section>';
    const sr = U.$('#sr', body), inp = U.$('#sq', body);
    const run = () => {
      const v = U.deacc(U.norm(inp.value));
      if (v.length < 2) { sr.innerHTML = '<p class="muted">Введи минимум 2 буквы.</p>'; return; }
      const res = SRS.allCards().map(id => SRS.get(id)).filter(c => U.deacc(U.norm(c.fr)).includes(v) || U.norm(c.ru).includes(U.norm(inp.value))).slice(0, 60);
      sr.innerHTML = res.length ? '<table class="cards"><tbody>' + res.map(c => '<tr><td class="f">' + esc(c.fr) + '</td><td>' + esc(c.ru) + '</td><td class="s"><span class="lv ' + c.level + '">' + (c.level === 'C' ? 'моё' : c.level) + '</span></td></tr>').join('') + '</tbody></table>' : '<p class="muted">Ничего не найдено. Можно <a href="#/words?tab=mine">добавить своё слово</a>.</p>';
    };
    inp.oninput = run; run(); setTimeout(() => inp.focus(), 50);
  };

  view.onclick = async (e) => {
    const tabb = e.target.closest('[data-tab]');
    if (tabb) { tab = tabb.dataset.tab; render(); return; }
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a, t = b.dataset.t;
    if (a === 'prio') { const i = S().prio.indexOf(t); if (i >= 0) S().prio.splice(i, 1); else S().prio.unshift(t); Store.touch(); U.toast(i >= 0 ? 'Убрано' : 'Эта тема пойдёт первой среди новых слов'); }
    else if (a === 'skip') { const i = S().skipTopics.indexOf(t); if (i >= 0) S().skipTopics.splice(i, 1); else S().skipTopics.push(t); Store.touch(); }
    else if (a === 'know-topic') { if (await U.confirm('Отметить все слова темы как знакомые? Они всё равно вернутся в повторение через 2–4 недели, чтобы проверить.', 'Да, знаю')) { const n = SRS.knowTopic(t); U.toast('Отмечено слов: ' + n); } else return; }
    else if (a === 'del') { if (await U.confirm('Удалить это слово?', 'Удалить')) SRS.removeCustom(b.dataset.id); else return; }
    if (['prio', 'skip', 'know-topic', 'del'].includes(a)) { App.refreshChrome(); const open = Array.from(view.querySelectorAll('details.topic[open]')).map(d => d.dataset.tid); render(); open.forEach(id => { const d = view.querySelector('details[data-tid="' + id + '"]'); if (d) d.open = true; }); }
  };

  App.setTitle('Слова');
  render();
};
})();
