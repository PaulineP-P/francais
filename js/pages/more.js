/* Ещё: ресурсы, настройки, резервная копия */
(function(){
'use strict';
const esc = U.esc, S = () => Store.state;

App.pages.more = function (view) {
  const lb = S().lastBackup;
  view.innerHTML = '<h1 class="page-title">Ещё</h1><div class="hub">' +
    '<a href="#/resources">' + U.icon('link') + '<b>Ресурсы</b><span>Подкасты, газеты, словари, официальные образцы</span></a>' +
    '<a href="#/settings">' + U.icon('gear') + '<b>Настройки</b><span>Дата экзамена, лимиты, голос, тема</span></a>' +
    '<a href="#/week">' + U.icon('star') + '<b>Итоги недели</b><span>Bulletin: что получилось</span></a>' +
    '<a href="#/exam/checklist">' + U.icon('flag') + '<b>Чек-лист экзамена</b><span>Документы, день экзамена, стратегии</span></a></div>' +
    '<section class="sheet" style="margin-top:16px"><h2>Резервная копия</h2><p class="muted">Прогресс хранится только в этом браузере. Если очистишь данные сайта, сменишь телефон или компьютер — всё исчезнет. Скачай копию и сохрани файл в облако; потом её можно загрузить на другом устройстве.</p>' +
    '<p class="muted">Последняя копия: <b>' + (lb ? U.ruShort(lb) : 'ещё не делала') + '</b></p>' +
    '<div class="row"><button class="btn" data-a="exp">' + U.icon('download') + 'Скачать копию</button><button class="btn soft" data-a="imp">' + U.icon('upload') + 'Загрузить копию</button><input type="file" id="fi" accept=".json,application/json" hidden></div></section>' +
    '<section class="sheet"><h2>Напоминание каждый день</h2><p class="muted">Скачай календарный файл — он добавит ежедневное напоминание в календарь телефона или компьютера до даты экзамена.</p><div class="row"><label class="fld" style="margin:0"><span>Время</span><input type="time" id="rt" value="' + esc(S().settings.remindTime) + '" style="width:130px"></label><button class="btn soft" data-a="ics">' + U.icon('clock') + 'Скачать напоминание (.ics)</button></div></section>' +
    '<p class="faint" style="font-size:.85rem">Cahier de français · личный тренажёр. Тексты для аудирования и чтения учебные, цифры в них иллюстративные. Официальные правила и даты проверяй на сайте Institut français и France Éducation international.</p>';
  App.setTitle('Ещё');
  view.onclick = async (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'exp') { U.download('cahier-backup-' + U.today() + '.json', Store.export(), 'application/json'); U.toast('Копия скачана'); App.render(); }
    if (a === 'imp') U.$('#fi', view).click();
    if (a === 'ics') {
      const t = U.$('#rt', view).value || '19:00'; S().settings.remindTime = t; Store.save();
      const [hh, mm] = t.split(':'); const start = U.today().replace(/-/g, '') + 'T' + hh + mm + '00';
      const until = S().settings.examDate.replace(/-/g, '') + 'T235959';
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cahier de francais//RU', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:cahier-daily-' + Date.now() + '@local', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), 'DTSTART:' + start, 'DURATION:PT20M', 'RRULE:FREQ=DAILY;UNTIL=' + until, 'SUMMARY:Cahier de français — devoirs du jour', 'DESCRIPTION:Открой сайт: слова + одно задание. Хватит 15 минут.\\n' + location.href.split('#')[0], 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Французский', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      U.download('cahier-rappel.ics', ics, 'text/calendar');
    }
  };
  U.$('#fi', view).onchange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = async () => {
      try { JSON.parse(rd.result); } catch (x) { U.toast('Файл не похож на копию'); return; }
      if (!await U.confirm('Загрузить копию? Текущий прогресс в этом браузере будет заменён.', 'Заменить')) return;
      try { Store.import(rd.result); App.applyTheme(); U.toast('Копия загружена'); location.hash = '#/today'; App.render(); } catch (x) { U.toast(x.message); }
    };
    rd.readAsText(f);
  };
};

App.pages.resources = function (view) {
  let html = '<div class="crumbs"><a href="#/more">Ещё</a> / ресурсы</div><h1 class="page-title">Ресурсы</h1><p class="page-sub">Это стартовые точки. Сайты иногда меняют адреса — если ссылка не открылась, найди название в поиске.</p>';
  window.RESOURCES.forEach(sec => {
    html += '<section class="sheet"><h2>' + esc(sec.cat) + '</h2>' + sec.items.map(i => '<div style="margin:10px 0">' + (i.u ? '<a href="' + esc(i.u) + '" target="_blank" rel="noopener"><b>' + esc(i.n) + '</b></a>' : '<b>' + esc(i.n) + '</b>') + '<div class="muted" style="font-size:.93rem">' + esc(i.d) + '</div></div>').join('') + '</section>';
  });
  view.innerHTML = html; App.setTitle('Ресурсы');
};

App.pages.settings = function (view) {
  const st = S().settings;
  const voices = U.frVoices();
  const draw = () => {
    view.innerHTML = '<div class="crumbs"><a href="#/more">Ещё</a> / настройки</div><h1 class="page-title">Настройки</h1>' +
      '<section class="sheet"><h2>Экзамен</h2><div class="grid c2"><label class="fld"><span>Дата экзамена</span><input type="date" id="s-exam" value="' + esc(st.examDate) + '"></label><label class="fld"><span>Начало подготовки</span><input type="date" id="s-start" value="' + esc(st.startDate) + '"></label></div>' +
      '<p class="muted">Точные даты весенней сессии в Москве публикует Institut français — проверь их и поменяй тут. План и таймлайн подстроятся автоматически.</p></section>' +
      '<section class="sheet"><h2>Темп</h2><label class="fld"><span>Новых слов в день: <b id="v-new">' + st.newPerDay + '</b></span><input type="range" id="s-new" min="3" max="30" value="' + st.newPerDay + '"></label>' +
      '<label class="fld"><span>Максимум повторений в день: <b id="v-max">' + st.maxReviews + '</b> (остальное подождёт до завтра)</span><input type="range" id="s-max" min="20" max="200" step="10" value="' + st.maxReviews + '"></label>' +
      '<label class="fld"><span>Режим карточек</span><select id="s-mode"><option value="mix">Смешанный (рекомендуется)</option><option value="flip">Только узнавание: французский → русский</option><option value="type">Больше ввода с клавиатуры: русский → французский</option></select></label>' +
      '<label class="switch"><input type="checkbox" id="s-light"' + (st.lightDefault ? ' checked' : '') + '><span>Начинать каждый день в режиме «минимум» (10 минут)</span></label></section>' +
      '<section class="sheet"><h2>Звук</h2><label class="switch" style="margin-bottom:10px"><input type="checkbox" id="s-snd"' + (st.sound !== false ? ' checked' : '') + '><span>Автоматически озвучивать слова</span></label>' +
      '<label class="fld"><span>Скорость голоса: <b id="v-rate">' + st.ttsRate + '</b></span><input type="range" id="s-rate" min="0.5" max="1.2" step="0.02" value="' + st.ttsRate + '"></label>' +
      (voices.length ? '<label class="fld"><span>Голос</span><select id="s-voice"><option value="">Автоматически</option>' + voices.map(v => '<option value="' + esc(v.name) + '"' + (v.name === st.voice ? ' selected' : '') + '>' + esc(v.name) + ' (' + esc(v.lang) + ')</option>').join('') + '</select></label>' : '<p class="muted">Французский голос в браузере не найден. В Chrome и Safari он обычно есть; на телефоне проверь, что в настройках системы скачан французский голос.</p>') +
      '<button class="btn soft" id="s-test">' + U.icon('speaker') + 'Проверить звук</button></section>' +
      '<section class="sheet"><h2>Оформление</h2><label class="fld"><span>Тема</span><select id="s-theme"><option value="auto">Как в системе</option><option value="light">Светлая</option><option value="dark">Тёмная</option></select></label><label class="fld"><span>Как к тебе обращаться</span><input type="text" id="s-name" value="' + esc(st.name) + '"></label></section>' +
      '<section class="sheet"><h2>Данные</h2><div class="row"><a class="btn soft" href="#/more">Резервная копия</a><button class="btn ghost" data-a="intro">Показать вступление</button><button class="btn red" data-a="reset">Стереть весь прогресс</button></div></section>';
    U.$('#s-mode', view).value = st.reviewMode; U.$('#s-theme', view).value = st.theme;
  };
  draw();
  const bind = (id, fn) => { const el = U.$(id, view); if (el) el.addEventListener('input', fn); };
  bind('#s-exam', e => { if (e.target.value) { st.examDate = e.target.value; Store.save(); App.refreshChrome(); } });
  bind('#s-start', e => { if (e.target.value) { st.startDate = e.target.value; Store.save(); } });
  bind('#s-new', e => { st.newPerDay = +e.target.value; U.$('#v-new', view).textContent = st.newPerDay; Store.save(); });
  bind('#s-max', e => { st.maxReviews = +e.target.value; U.$('#v-max', view).textContent = st.maxReviews; Store.save(); });
  bind('#s-mode', e => { st.reviewMode = e.target.value; Store.save(); });
  bind('#s-light', e => { st.lightDefault = e.target.checked; Store.save(); });
  bind('#s-snd', e => { st.sound = e.target.checked; Store.save(); });
  bind('#s-rate', e => { st.ttsRate = +e.target.value; U.$('#v-rate', view).textContent = st.ttsRate; Store.save(); });
  bind('#s-voice', e => { st.voice = e.target.value; Store.save(); });
  bind('#s-theme', e => { st.theme = e.target.value; Store.save(); App.applyTheme(); });
  bind('#s-name', e => { st.name = e.target.value; Store.save(); });
  view.onclick = async (e) => {
    const b = e.target.closest('[data-a], #s-test'); if (!b) return;
    if (b.id === 's-test') { U.speak('Bonjour ! Ceci est un test de la voix française.'); return; }
    if (b.dataset.a === 'intro') { Store.state.seenIntro = false; Store.save(true); location.hash = '#/today'; App.render(); }
    if (b.dataset.a === 'reset') {
      if (await U.confirm('Стереть ВСЁ: слова, оценки, серию, настройки? Это нельзя отменить. Сначала скачай копию.', 'Стереть всё') && await U.confirm('Точно стереть?', 'Да, стереть')) { Store.reset(); App.applyTheme(); location.hash = '#/today'; App.render(); }
    }
  };
  App.setTitle('Настройки');
};
})();
