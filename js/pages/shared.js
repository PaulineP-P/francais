/* Общие компоненты: QCM, задания «вживую», добавление слов, таймер */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

/* QCM — вопросы с тремя вариантами */
window.QCM = {
  render(box, questions, onSubmit, opts) {
    opts = opts || {};
    let html = '';
    questions.forEach((q, i) => {
      html += '<div class="qcm" data-i="' + i + '"><div class="q">' + (i + 1) + '. ' + esc(q.q) + '</div>' +
        q.o.map((o, k) => '<label class="opt"><input type="radio" name="q' + i + '" value="' + k + '"><span>' + esc(o) + '</span></label>').join('') + '<div class="why" hidden></div></div>';
    });
    html += '<div class="row"><button class="btn" data-a="submit">Проверить ответы</button><span class="muted">Не знаешь — угадывай: баллы за неверные не снимаются.</span></div><div id="qres"></div>';
    box.innerHTML = html;
    let done = false;
    box.onclick = (e) => {
      const b = e.target.closest('[data-a="submit"]'); if (!b || done) return;
      const ans = questions.map((q, i) => { const c = U.$('input[name="q' + i + '"]:checked', box); return c ? +c.value : -1; });
      const left = ans.filter(a => a < 0).length;
      if (left) { U.toast('Ответь на все вопросы (осталось ' + left + ')'); return; }
      done = true; let ok = 0;
      questions.forEach((q, i) => {
        const wrap = U.$$('.qcm', box)[i], opts2 = U.$$('.opt', wrap);
        opts2.forEach((el, k) => { el.querySelector('input').disabled = true; if (k === q.a) el.classList.add('ok'); else if (k === ans[i]) el.classList.add('bad'); });
        if (ans[i] === q.a) ok++;
        const w = U.$('.why', wrap); w.hidden = false; w.textContent = (ans[i] === q.a ? '✓ ' : '✗ ') + (q.why || '');
      });
      const pct = ok / questions.length;
      U.$('#qres', box).innerHTML = '<div class="sheet" style="margin-top:14px;text-align:center"><div class="hand" style="font-size:2.4rem;color:var(--red)">' + ok + ' / ' + questions.length + '</div><div class="hand" style="font-size:1.5rem">' + (pct === 1 ? 'Parfait !' : pct >= 0.7 ? 'Très bien !' : pct >= 0.5 ? 'Bien — перечитай ошибки.' : 'Не страшно: послушай ещё раз с текстом.') + '</div></div>';
      onSubmit({ ok, total: questions.length, pct });
    };
  }
};

/* Блок «добавить слово из текста» */
window.AddWord = {
  html(prefix) {
    return '<details class="fold sheet" id="aw"><summary>' + U.icon('plus', 'ic') + ' Добавить незнакомое слово в «Мои слова»</summary><div style="margin-top:10px"><p class="muted" style="margin-bottom:8px">Выдели слово в тексте и нажми «Из выделенного» — или впиши сам.</p>' +
      '<div class="grid c2" style="gap:10px"><label class="fld"><span>По-французски</span><input type="text" id="aw-fr" autocapitalize="none"></label><label class="fld"><span>Перевод</span><input type="text" id="aw-ru"></label></div>' +
      '<div class="row"><button class="btn small soft" data-aw="sel" type="button">Из выделенного</button><button class="btn small" data-aw="add" type="button">Добавить</button></div></div></details>';
  },
  bind(root) {
    const host = U.$('#aw', root); if (!host) return;
    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-aw]'); if (!b) return;
      if (b.dataset.aw === 'sel') { const t = String(window.getSelection ? window.getSelection() : '').trim(); if (t) U.$('#aw-fr', root).value = t.slice(0, 80); else U.toast('Сначала выдели слово в тексте'); }
      if (b.dataset.aw === 'add') {
        const fr = U.$('#aw-fr', root).value, ru = U.$('#aw-ru', root).value;
        if (!fr.trim() || !ru.trim()) { U.toast('Нужны и слово, и перевод'); return; }
        const r = SRS.addCustom(fr, ru, ''); U.toast(r && r.dup ? 'Такое слово уже есть' : 'Добавлено · появится в повторении');
        U.$('#aw-fr', root).value = ''; U.$('#aw-ru', root).value = ''; App.refreshChrome();
      }
    });
  }
};

/* Задание «вживую»: внешний ресурс + шаги + заметки */
window.ExtTask = {
  render(view, item, type, backHref, backLabel) {
    const rec = S().prog.ext[item.id] || {};
    const steps = item.how.map((h, i) => '<label class="opt"><input type="checkbox" data-s="' + i + '"><span>' + esc(h) + '</span></label>').join('');
    view.innerHTML = '<div class="crumbs"><a href="' + backHref + '">' + backLabel + '</a></div><h1 class="page-title">' + esc(item.t) + '</h1>' +
      '<div class="sheet"><p>Это задание вне сайта: открой ресурс, выполни шаги и вернись.</p><p><a class="btn" href="' + esc(item.u) + '" target="_blank" rel="noopener">' + U.icon('link') + 'Открыть ресурс</a></p>' +
      '<h3>Шаги</h3>' + steps + '<label class="fld" style="margin-top:12px"><span>Заметки: слова, цифры, мысли</span><textarea id="xn" rows="4" placeholder="Что услышала / прочитала?">' + esc(rec.note || '') + '</textarea></label>' +
      '<div class="row"><button class="btn" data-a="done">Готово</button><span class="muted">Нажимай, когда сделала все шаги.</span></div></div>' + window.AddWord.html();
    window.AddWord.bind(view);
    view.onclick = (e) => {
      const b = e.target.closest('[data-a="done"]'); if (!b) return;
      const boxes = U.$$('input[data-s]', view), n = boxes.filter(x => x.checked).length;
      if (n < boxes.length) { U.toast('Отметь все шаги — или честно пропусти то, что не сделала.'); if (n === 0) return; }
      const note = U.$('#xn', view).value;
      const ev = Prog.done(type, item.id, { pct: n / boxes.length, ok: true, info: { note } });
      S().prog.ext[item.id].last = U.today();
      App.celebrate(ev); U.toast('Записано. Хорошая работа.');
      view.innerHTML = '<div class="sheet" style="text-align:center"><div class="hand" style="font-size:2.3rem;color:var(--red)">Merci !</div><p class="muted">Задание записано в твой прогресс.</p><div class="row" style="justify-content:center"><a class="btn" href="#/today">На главную</a><a class="btn ghost" href="' + backHref + '">' + backLabel + '</a></div></div>';
    };
  }
};

/* Таймер: обратный (по умолчанию) или прямой (up:true) */
window.Timer = {
  create(el, secs, opts) {
    opts = opts || {};
    const up = !!opts.up;
    let t = up ? 0 : secs, iv = null, running = false;
    const draw = () => { el.textContent = U.fmtClock(t); el.classList.toggle('warn', !up && t <= 60 && running); };
    const api = {
      start() {
        if (running) return; running = true;
        iv = setInterval(() => {
          t += up ? 1 : -1;
          if (!up && t <= 0) { t = 0; api.stop(); if (opts.onEnd) opts.onEnd(); }
          draw(); if (opts.onTick) opts.onTick(t);
        }, 1000);
        draw();
      },
      stop() { running = false; clearInterval(iv); draw(); },
      reset(s) { api.stop(); if (s != null) secs = s; t = up ? 0 : secs; draw(); },
      get running() { return running; },
      get left() { return t; },
      get elapsed() { return up ? t : secs - t; }
    };
    draw();
    return api;
  }
};
})();
