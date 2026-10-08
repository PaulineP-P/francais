/* Практика: хаб с разделами */
(function(){
'use strict';
const S = () => Store.state;
App.pages.practice = function (view) {
  const g = Prog.countDone('grammar'), d = Prog.countDone('dict'), l = Prog.countDone('listen'), r = Prog.countDone('read'), w = Prog.countDone('write'), s = Prog.countDone('speak'), p = Prog.countDone('phr');
  const tile = (href, ic, title, sub) => '<a href="' + href + '">' + U.icon(ic) + '<b>' + title + '</b><span>' + sub + '</span></a>';
  const plan = Plan.forDay(U.today(), true);
  const todo = plan.tasks.filter(t => t.key !== 'srs' && t.key !== 'bonus' && !Store.day().tasks[t.key]);
  view.innerHTML = '<h1 class="page-title">Практика</h1><p class="page-sub">Здесь все тренажёры. Задания на сегодня — на главной странице, а тут можно заниматься сверх плана, когда есть настроение.</p>' +
    (todo.length ? '<div class="sheet"><b>Ждёт сегодня:</b> ' + todo.map(t => '<a href="' + t.route + '">' + U.esc(t.title) + '</a>').join(' · ') + '</div>' : '') +
    '<div class="hub">' +
    tile('#/grammar', 'grammar', 'Грамматика', g + ' из ' + window.GRAMMAR.length + ' уроков') +
    tile('#/drill', 'repeat', 'Закрепление', '10 упражнений из пройденного') +
    tile('#/phrases', 'speaker', 'Фразы и клише', p + ' из 10 наборов') +
    tile('#/dictee', 'dict', 'Диктанты', d + ' из ' + window.DICTATIONS.length) +
    tile('#/listen', 'headphones', 'Аудирование', l + ' из ' + window.LISTENINGS.length + ' + «вживую»') +
    tile('#/read', 'book', 'Чтение', r + ' из ' + window.READINGS.length + ' + «вживую»') +
    tile('#/write', 'pen', 'Письмо', w + ' работ · красная ручка') +
    tile('#/speak', 'mic', 'Устная речь', s + ' ответов · запись голоса') +
    tile('#/exam', 'exam', 'Пробный экзамен', S().mocks.length + ' ' + U.plural(S().mocks.length, 'результат', 'результата', 'результатов')) +
    '</div>';
  App.setTitle('Практика');
};
})();
