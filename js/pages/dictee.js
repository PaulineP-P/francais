/* Диктант: слушаем и пишем, сравниваем по словам */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

function tokens(s) { return String(s).replace(/[’]/g, "'").match(/[A-Za-zÀ-ÿŒœ0-9]+(?:['\-][A-Za-zÀ-ÿŒœ0-9]+)*|[.,;:!?«»]/g) || []; }
/* выравнивание по словам (LCS), чтобы одна пропущенная буква не ломала всё */
function diff(ref, got) {
  const A = ref, B = got, n = A.length, m = B.length;
  const eq = (a, b) => U.norm(a) === U.norm(b);
  const dp = Array.from({ length: n + 1 }, () => new Int16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = eq(A[i], B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (eq(A[i], B[j])) { out.push({ t: 'ok', w: A[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ t: 'miss', w: A[i], got: null }); i++; }
    else { out.push({ t: 'extra', w: B[j] }); j++; }
  }
  while (i < n) out.push({ t: 'miss', w: A[i++] });
  while (j < m) out.push({ t: 'extra', w: B[j++] });
  // слияние «miss + extra» подряд в «замену» (ошибка в написании слова)
  const merged = [];
  for (let k = 0; k < out.length; k++) {
    if (out[k].t === 'miss' && out[k + 1] && out[k + 1].t === 'extra') { merged.push({ t: 'sub', w: out[k].w, got: out[k + 1].w }); k++; }
    else if (out[k].t === 'extra' && out[k + 1] && out[k + 1].t === 'miss') { merged.push({ t: 'sub', w: out[k + 1].w, got: out[k].w }); k++; }
    else merged.push(out[k]);
  }
  return merged;
}

App.pages.dictee = function (view, args) {
  const id = args[0];
  if (!id) {
    let html = '<div class="crumbs"><a href="#/practice">Практика</a> / диктанты</div><h1 class="page-title">Диктанты</h1><p class="page-sub">Слушаешь фразу — пишешь. Сравнение идёт по словам. Тренирует слух и орфографию одновременно. Можно слушать сколько угодно раз, но на «отлично» старайся с 3–4 прослушиваний.</p><div class="grid c2">';
    window.DICTATIONS.forEach((d, i) => {
      const r = S().prog.dict[d.id];
      html += '<a class="task' + (r && r.done ? ' done' : '') + '" href="#/dictee/' + d.id + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0"><div class="t">Диктант ' + (i + 1) + ' · ' + d.lvl + '</div><div class="s">' + esc(d.ru) + (r ? ' · ' + Math.round((r.best || 0) * 100) + '%' : '') + '</div></span></a>';
    });
    view.innerHTML = html + '</div>'; App.setTitle('Диктанты'); return;
  }
  const d = window.DICTATIONS.find(x => x.id === id);
  if (!d) { view.innerHTML = '<div class="sheet">Диктант не найден.</div>'; return; }
  const idx = window.DICTATIONS.indexOf(d), next = window.DICTATIONS[idx + 1];
  let plays = 0;
  view.innerHTML = '<div class="crumbs"><a href="#/dictee">Диктанты</a> / ' + (idx + 1) + '</div><h1 class="page-title">Диктант · ' + d.lvl + '</h1>' +
    '<div class="sheet"><div class="player"><button class="btn" data-a="play">' + U.icon('play') + 'Слушать</button><button class="btn soft" data-a="slow">' + U.icon('clock') + 'Медленно</button><span class="muted" id="pc"></span></div>' +
    '<label class="fld"><span>Напиши, что услышала</span><textarea id="dt" rows="3" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Слушай и пиши…"></textarea></label>' +
    '<div class="row"><button class="btn" data-a="check">Проверить</button></div><div id="dres"></div></div>' +
    (U.hasTTS() && U.frVoices().length === 0 ? '<p class="faint">Не нашла французский голос в браузере — звук может быть на другом языке. Попробуй Chrome/Safari и проверь, что установлен французский голос в настройках системы.</p>' : '');
  view.onclick = (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'play' || a === 'slow') { plays++; U.$('#pc', view).textContent = 'прослушиваний: ' + plays; U.speak(d.text, { rate: a === 'slow' ? 0.62 : 0.88 }); }
    if (a === 'check') {
      const val = U.$('#dt', view).value; if (!val.trim()) { U.toast('Сначала напиши'); return; }
      const ref = tokens(d.text).filter(t => /\w/.test(t)), got = tokens(val).filter(t => /\w/.test(t));
      const df = diff(ref, got);
      const bad = df.filter(x => x.t !== 'ok').length, refN = ref.length;
      const pct = Math.max(0, 1 - bad / refN);
      const html = df.map(x => x.t === 'ok' ? esc(x.w) : x.t === 'sub' ? '<s>' + esc(x.got) + '</s> <b style="color:var(--green-ink)">' + esc(x.w) + '</b>' : x.t === 'miss' ? '<b style="color:var(--green-ink)">[' + esc(x.w) + ']</b>' : '<s>' + esc(x.w) + '</s>').join(' ');
      const accentOnly = df.filter(x => x.t === 'sub' && U.deacc(U.norm(x.w)) === U.deacc(U.norm(x.got))).length;
      U.$('#dres', view).innerHTML = '<hr class="dash"><div class="fr" style="font-size:1.15rem;line-height:1.9">' + html + '</div>' +
        '<p class="hand" style="font-size:1.6rem;color:var(--red)">' + (bad === 0 ? 'Sans faute ! Безупречно.' : bad + ' ' + U.plural(bad, 'ошибка', 'ошибки', 'ошибок') + (accentOnly ? ' (из них только диакритика: ' + accentOnly + ')' : '')) + '</p>' +
        '<p class="muted">Зачёркнуто — твоё, зелёным — как правильно, [в скобках] — пропущено.</p>' +
        '<div class="row"><button class="btn soft" data-a="play">Послушать ещё</button>' + (next ? '<a class="btn" href="#/dictee/' + next.id + '">Следующий</a>' : '') + '<a class="btn ghost" href="#/today">На главную</a></div>';
      const ev = Prog.done('dictation', d.id, { pct: pct, ok: pct >= 0.6, info: { best: pct } }); App.celebrate(ev);
    }
  };
  App.setTitle('Диктант');
  return () => U.stopSpeak();
};
})();
