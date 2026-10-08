/* «Красная ручка» (автоматические подсказки по тексту) и замечания учителя */
(function(){
'use strict';
const Pen = window.Pen = {}, Remark = window.Remark = {};

const CONN = ['tout d\'abord','d\'abord','ensuite','puis','enfin','de plus','en outre','par ailleurs','de surcroît','car','parce que','puisque','en effet','donc','par conséquent','ainsi','c\'est pourquoi','mais','cependant','pourtant','toutefois','néanmoins','en revanche','alors que','tandis que','certes','bien que','même si','malgré','par exemple','notamment','c\'est le cas de','en somme','en conclusion','pour conclure','en définitive','d\'un côté','d\'un autre côté','d\'une part','d\'autre part','grâce à','à cause de','afin de','pour que','lorsque','quand','si bien que'];
const OPINION = /(à mon avis|je pense que|il me semble|je suis convaincu|je suis convaincue|pour ma part|en ce qui me concerne|selon moi|à mon sens|de mon point de vue|je crois que|j'estime que)/i;
const INTRO = /(de nos jours|à l'heure où|il est indéniable|depuis quelques années|aujourd'hui|de plus en plus|à notre époque|on peut se demander|on peut alors se demander|la question|le débat)/i;
const CONC = /(pour conclure|en conclusion|en somme|en définitive|pour toutes ces raisons|en résumé|au final|finalement)/i;
const EXAMPLE = /(par exemple|notamment|c'est le cas|comme le montre|prenons l'exemple|selon un|d'après|l'exemple de|à titre d'exemple)/i;
const NUANCE = /(certes|cependant|néanmoins|toutefois|bien que|même si|en revanche|malgré|il convient de nuancer|il ne faut pas oublier)/i;
const SUBJ = /(il faut que|bien que|pour que|afin que|il est important que|il est essentiel que|il est nécessaire que|à condition que|avant que|il est regrettable que|je souhaite que|il vaut mieux que)/i;
const STOP = new Set('le la les un une des de du d l et en à au aux ce ces cet cette je tu il elle on nous vous ils elles me te se que qui quoi ne pas plus est sont a ont pour par sur dans avec sans mais ou donc car si y qu c s n m t j'.split(' '));

const MISTAKES = [
  [/\bje suis faim\b|\bj'suis faim\b/i, 'Je suis faim → J\'ai faim (avoir!).'],
  [/\bje suis \d+ ans\b/i, 'Возраст: J\'ai … ans (avoir, не être).'],
  [/\bil ya\b|\bil y'a\b/i, 'Il y a — три слова.'],
  [/\bparce-que\b|\bparceque\b/i, 'Parce que — два слова, без дефиса.'],
  [/\bquelquechose\b/i, 'Quelque chose — два слова.'],
  [/\bbeaucoup des\b/i, 'Beaucoup de (не des): beaucoup de gens.'],
  [/\bplus mieux\b|\bplus meilleur\b/i, 'Не plus mieux/meilleur: mieux, meilleur.'],
  [/\bsa va\b/i, 'Ça va — с cédille.'],
  [/\bdans mon opinion\b/i, 'Лучше: à mon avis / selon moi / de mon point de vue.'],
  [/\bles gens (est|a|dit)\b/i, 'Les gens — множественное: les gens sont / ont.'],
  [/\bje suis d'accord avec que\b/i, 'Je suis d\'accord pour dire que… / avec l\'idée que…'],
  [/\bà coté\b|\bacoté\b/i, 'À côté (с обеими диакритиками).'],
  [/\bmalgrès\b|\btoujour\b|\baujourdhui\b|\bsurtou\b/i, 'Проверь орфографию: malgré, toujours, aujourd\'hui, surtout.'],
  [/\bmoi je suis\b.*\bje suis\b/i, null],
  [/\bde le\b|\bde les\b|\bà le\b|\bà les\b/i, 'Слитные артикли: du, des, au, aux (de le → du; à le → au).'],
  [/\bc'est un problème grande\b/i, null]
];

Pen.review = (text, opt) => {
  opt = opt || {};
  const t = String(text || '');
  const low = t.toLowerCase().replace(/[’]/g, "'");
  const words = U.countWords(t);
  const target = opt.words || 0;
  const ok = [], bad = [];
  const kind = opt.kind || 'free'; // 'essay' | 'letter' | 'free'
  const advanced = opt.level === 'B2' || kind === 'essay' || kind === 'letter';

  if (target) {
    if (words >= target) ok.push('Объём: ' + words + ' слов (нужно ≥ ' + target + ').');
    else bad.push('Объём: ' + words + ' слов из ' + target + '. Добавь ещё ' + (target - words) + '.');
  }
  if (words > 0 && opt.level === 'B2' && words > 340) bad.push('Слишком много слов (' + words + '). Лучше 250–320: больше текста — больше ошибок.');

  const paras = t.split(/\n\s*\n|\n/).filter(x => x.trim()).length;
  if (advanced) {
    if (!opt.speech) { if (paras >= 3) ok.push('Абзацы: ' + paras + ' — структура видна.'); else bad.push('Абзацев мало (' + paras + '). Нужно минимум 3: введение, развитие, заключение.'); }
    const found = CONN.filter(c => low.includes(c));
    if (found.length >= 5) ok.push('Связки: ' + found.length + ' разных (' + found.slice(0, 5).join(', ') + '…).');
    else bad.push('Связок мало (' + found.length + '). Добавь: de plus, cependant, par exemple, en effet, pour conclure.');
    if (kind === 'essay' || opt.level === 'B2') {
      INTRO.test(low) ? ok.push('Введение: есть зачин / проблематика.') : bad.push('В введении нет клише: «De nos jours, … fait beaucoup débattre. On peut alors se demander si…».');
      OPINION.test(low) ? ok.push('Твоё мнение заявлено явно.') : bad.push('Не вижу позиции. Напиши: «À mon avis, …» / «Je suis convaincue que…».');
      EXAMPLE.test(low) ? ok.push('Есть пример.') : bad.push('Нет примера! Аргумент без примера — слабый: «Par exemple, …».');
      NUANCE.test(low) ? ok.push('Есть уступка / нюанс (certes, cependant…).') : bad.push('Нет нюанса. Добавь «Certes, … mais …» или «Cependant, …» — это признак B2.');
      CONC.test(low) ? ok.push('Заключение со словом-маркером.') : bad.push('Заключение: начни с «Pour conclure, …» или «En somme, …».');
      if (!opt.speech) SUBJ.test(low) ? ok.push('Subjonctif использован — плюс к грамматике.') : bad.push('Нет subjonctif. Попробуй: «Il faut que…», «Bien que…».');
    }
    if (kind === 'letter') {
      /(madame|monsieur)/i.test(t) ? ok.push('Обращение (Madame, Monsieur).') : bad.push('Начни с «Madame, Monsieur,».');
      /(salutations|cordialement|veuillez agréer|je vous prie d'agréer)/i.test(low) ? ok.push('Формула вежливости в конце.') : bad.push('Нет формулы окончания: «Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées».');
      if (/\b(tu|ton|ta|tes|toi)\b/i.test(t)) bad.push('В официальном письме «tu/ton/ta» нельзя — только «vous/votre».');
    }
    const ca = (low.match(/\bça\b/g) || []).length;
    if (ca > 2) bad.push('«ça» ' + ca + ' раза — в письменной речи лучше «cela», «ce».');
  } else {
    if (words > 0) {
      const sents = t.split(/[.!?]+/).filter(x => x.trim());
      const lowerStart = sents.filter(s => /^[a-zàâçéèêëîïôûùüÿœ]/.test(s.trim())).length;
      lowerStart > 0 ? bad.push('После точки — заглавная буква (' + lowerStart + ' раза нет).') : ok.push('Заглавные буквы после точек на месте.');
      /[.!?]\s*$/.test(t.trim()) ? ok.push('Текст заканчивается точкой.') : bad.push('Закончи последнее предложение точкой.');
    }
  }
  MISTAKES.forEach(([re, msg]) => { if (msg && re.test(t)) bad.push(msg); });

  /* повторы */
  const freq = {};
  (low.match(/[a-zàâçéèêëîïôûùüÿœ']+/g) || []).forEach(w => { const b = w.replace(/^.*'/, ''); if (b.length > 3 && !STOP.has(b)) freq[b] = (freq[b] || 0) + 1; });
  const rep = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  if (rep && rep[1] >= (advanced ? 6 : 5) && words > 60) bad.push('Слово «' + rep[0] + '» повторяется ' + rep[1] + ' раз — подбери синоним.');

  return { ok, bad, words, paras };
};

/* ---------- Замечания учителя ---------- */
const R = {
  fresh: ['Bonjour ! Начнём с пяти минут слов.', 'Тетрадь открыта, ручка готова.', 'Первая карточка — самая трудная. Дальше легче.', 'Сегодня один маленький шаг. Он тоже считается.', 'Allez, on y va ! Одна карточка.'],
  started: ['Хорошее начало, продолжай !', 'Уже идёшь. Так держать !', 'Ещё чуть-чуть — и оценка выше.', 'Bien ! Ещё одно задание, и день закрыт.'],
  good: ['Très bien ! Почти всё сделано.', 'Отличная работа сегодня.', 'Видно усилие. Это и есть прогресс.'],
  full: ['Excellent ! Можно отдыхать.', 'Parfait ! День закрыт — иди гулять.', 'Браво ! Завтра будет легче.'],
  gap: ['Рада тебя видеть ! Без упрёков — начнём с лёгкого.', 'С возвращением ! Достаточно одной карточки, чтобы вернуться.', 'Bon retour ! Серия — это инструмент, а не наказание.'],
  rest: ['Dimanche — день отдыха. Хватит пяти минут.', 'Воскресенье: отдых — тоже часть плана.', 'Сегодня можно только слова. Или вообще ничего.'],
  light: ['Режим минимум — это нормально. Главное — не пропадать.', 'Меньше, но каждый день. Верный путь.'],
  exam: ['Финишная прямая. Всё, что нужно, ты уже знаешь.', 'Спокойно. Подготовка — позади, осталось показать.'],
  after: ['Экзамен позади ! Горжусь тобой. Теперь — французский для удовольствия.']
};
Remark.pick = (ctx) => {
  const seed = ctx.dk + ':' + (ctx.n || 0);
  const choose = k => R[k][U.hash(seed + k) % R[k].length];
  if (ctx.phase === 'after') return choose('after');
  if (ctx.streakMilestone) return 'Серия ' + ctx.streakMilestone + ' дней ! Это уже привычка.';
  if (ctx.gap >= 3 && !ctx.active) return choose('gap');
  if (ctx.full) return choose('full');
  if (ctx.light && !ctx.active) return choose('light');
  if (ctx.phase === 'P4' && ctx.n < 12) return choose('exam');
  if (ctx.rest && ctx.n < 6) return choose('rest');
  if (ctx.n >= 13) return choose('good');
  if (ctx.n >= 4) return choose('started');
  return choose('fresh');
};
Remark.stampFor = note => note >= 20 ? 'Excellent !' : note >= 16 ? 'Très bien !' : note >= 12 ? 'Bien !' : 'Courage !';
})();
