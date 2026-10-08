/* Грамматика: уроки 1–14 (A1 → A2). Ответы: «a» — допускаются варианты через « / ». */
window.GRAMMAR = window.GRAMMAR || [];
window.GRAMMAR.push(
{id:'g01',lvl:'A1',title:'Être, avoir и местоимения',min:15,
theory:`
<p>Два главных глагола французского. Без них не построить ни одной базовой фразы и ни одного сложного времени (passé composé!).</p>
<table class="gt"><tr><th></th><th>être (быть)</th><th>avoir (иметь)</th></tr>
<tr><td>je</td><td>suis</td><td>ai</td></tr><tr><td>tu</td><td>es</td><td>as</td></tr>
<tr><td>il / elle / on</td><td>est</td><td>a</td></tr><tr><td>nous</td><td>sommes</td><td>avons</td></tr>
<tr><td>vous</td><td>êtes</td><td>avez</td></tr><tr><td>ils / elles</td><td>sont</td><td>ont</td></tr></table>
<p class="ex">Je suis étudiante. · Elle a vingt-huit ans. · Nous avons un examen en mars.</p>
<p><b>Возраст, голод, холод — через avoir:</b> <span class="fr">avoir 25 ans, avoir faim, avoir froid, avoir raison</span>.</p>
<p><b>Профессия без артикля:</b> <span class="fr">Elle est chercheuse.</span> (но: <span class="fr">C'est une chercheuse brillante</span>).</p>
<p><b>on</b> в разговорной речи = «мы»: <span class="fr">On est prêts.</span> Глагол — как для il.</p>
<p class="tip">Ловушка: «я голодна» — <span class="fr">j'ai faim</span>, а не <s>je suis faim</s>.</p>`,
ex:[
{q:'Je ___ étudiante.',a:'suis'},{q:'Nous ___ un examen en mars.',a:'avons'},{q:'Vous ___ très gentille.',a:'êtes'},
{q:'Ils ___ deux enfants.',a:'ont'},{q:'Tu ___ fatigué ?',a:'es'},{q:'Elle ___ 28 ans.',a:'a'},
{q:'Les cours ___ intéressants.',a:'sont'},{q:'J\' ___ faim.',a:'ai'}]},

{id:'g02',lvl:'A1',title:'Артикли, род и число',min:15,
theory:`
<table class="gt"><tr><th></th><th>муж.</th><th>жен.</th><th>мн.</th></tr>
<tr><td>определённый</td><td>le (l')</td><td>la (l')</td><td>les</td></tr>
<tr><td>неопределённый</td><td>un</td><td>une</td><td>des</td></tr>
<tr><td>частичный («немного»)</td><td>du (de l')</td><td>de la (de l')</td><td>—</td></tr></table>
<p><b>Определённый</b> — когда понятно, о чём речь, или предмет один: <span class="fr">Le président parle.</span> Также для общих понятий: <span class="fr">J'aime la nature.</span></p>
<p><b>Неопределённый</b> — «какой-то, один»: <span class="fr">J'ai un livre.</span></p>
<p><b>Частичный</b> — нельзя посчитать: <span class="fr">Je bois du café. Il y a de la pollution.</span></p>
<p><b>После отрицания</b> un/une/des/du/de la → <b>de (d')</b>: <span class="fr">Je n'ai pas de voiture.</span> (кроме глагола être: <span class="fr">Ce n'est pas un problème.</span>)</p>
<p><b>Число:</b> обычно +s (<span class="fr">un livre → des livres</span>); -al → -aux (<span class="fr">un journal → des journaux</span>); -eau → -eaux; -eu → -eux.</p>
<p><b>Род:</b> -tion, -té, -ure чаще женские (<span class="fr">la solution, la liberté</span>); -ment, -age чаще мужские (<span class="fr">le gouvernement, le paysage</span>). Исключения учим с артиклем: <span class="fr">un problème, une image</span>.</p>`,
ex:[
{q:'___ climat change vite. (определённый, м.)',a:'le'},{q:'J\'ai ___ idée. (неопред., ж.)',a:'une'},
{q:'Je bois ___ eau. (частичный, ж., перед гласной)',a:'de l\''},{q:'Il y a ___ déchets partout. (неопред., мн.)',a:'des'},
{q:'Je n\'ai pas ___ voiture.',a:'de'},{q:'Un journal → des ___',a:'journaux'},
{q:'Elle mange ___ pain. (частичный, м.)',a:'du'},{q:'___ solution est simple. (определённый, ж.)',a:'la'}]},

{id:'g03',lvl:'A1',title:'Présent: глаголы на -er и отрицание',min:15,
theory:`
<p>90% французских глаголов — на <b>-er</b>. Образование: основа + окончания <b>-e, -es, -e, -ons, -ez, -ent</b>.</p>
<table class="gt"><tr><th>parler</th><th></th></tr><tr><td>je parle</td><td>nous parlons</td></tr><tr><td>tu parles</td><td>vous parlez</td></tr><tr><td>il parle</td><td>ils parlent</td></tr></table>
<p><b>Особенности:</b> manger → nous mang<b>e</b>ons; commencer → nous commen<b>ç</b>ons; appeler → j'appe<b>ll</b>e; acheter → j'ach<b>è</b>te; préférer → je préf<b>è</b>re; payer → je pa<b>i</b>e.</p>
<p><b>Отрицание</b> = <b>ne … pas</b> вокруг глагола: <span class="fr">Je ne parle pas russe.</span> Перед гласной ne → n': <span class="fr">Il n'aime pas ça.</span></p>
<p>В разговоре ne часто пропускают, но на экзамене (письмо!) — всегда с ne.</p>
<p class="ex">Другие отрицания: ne … jamais (никогда), ne … plus (больше не), ne … rien (ничего), ne … personne (никого).</p>`,
ex:[
{q:'Nous (manger) ___ à midi.',a:'mangeons'},{q:'Je (parler) ___ français.',a:'parle'},
{q:'Ils (habiter) ___ à Moscou.',a:'habitent'},{q:'Vous (étudier) ___ beaucoup.',a:'étudiez'},
{q:'Je ___ parle ___ allemand. (отрицание: два слова)',a:'ne / pas'},{q:'Nous (commencer) ___ demain.',a:'commençons'},
{q:'Il n\'___ plus de temps. (avoir)',a:'a'},{q:'J\'(acheter) ___ du pain.',a:'achète'}]},

{id:'g04',lvl:'A1',title:'Вопросы',min:15,
theory:`
<p>Три способа задать вопрос «да/нет»:</p>
<ul><li><b>Интонация</b> (разговорно): <span class="fr">Tu viens ?</span></li>
<li><b>Est-ce que</b> (нейтрально, безопасно): <span class="fr">Est-ce que tu viens ?</span></li>
<li><b>Инверсия</b> (письменно, формально): <span class="fr">Viens-tu ? / Avez-vous des questions ?</span></li></ul>
<p><b>Вопросительные слова:</b></p>
<table class="gt"><tr><td>qui</td><td>кто</td><td>où</td><td>где / куда</td></tr><tr><td>que / quoi</td><td>что</td><td>quand</td><td>когда</td></tr>
<tr><td>pourquoi</td><td>почему</td><td>comment</td><td>как</td></tr><tr><td>combien (de)</td><td>сколько</td><td>quel(le)(s)</td><td>какой</td></tr></table>
<p class="ex">Où habites-tu ? · Pourquoi est-ce que vous apprenez le français ? · Quel est votre objectif ? · Combien de mots apprenez-vous ?</p>
<p>Ответ на отрицательный вопрос: <b>si</b> (да!), а не oui: <span class="fr">Tu n'as pas faim ? — Si, j'ai faim.</span></p>`,
ex:[
{q:'Comment vous ___ ? — Je m\'appelle Anna. (s\'appeler)',a:'appelez'},{q:'___ est-ce que tu habites ? — À Moscou.',a:'Où'},
{q:'___ de livres as-tu ? — Dix.',a:'Combien'},{q:'___ est ton nom ? (какой, м.)',a:'Quel'},
{q:'Tu ne viens pas ? — ___, je viens !',a:'Si'},{q:'___ est-ce que tu pleures ? — Parce que je suis triste.',a:'Pourquoi'},
{q:'___ -vous français ? (parler, инверсия)',a:'Parlez'},{q:'___ commence le cours ? — À neuf heures.',a:'Quand'}]},

{id:'g05',lvl:'A1',title:'Главные неправильные глаголы',min:20,
theory:`
<p>Эти 8 глаголов надо знать «на автомате» — они в каждой второй фразе.</p>
<table class="gt"><tr><th></th><th>aller</th><th>faire</th><th>venir</th><th>prendre</th></tr>
<tr><td>je</td><td>vais</td><td>fais</td><td>viens</td><td>prends</td></tr>
<tr><td>tu</td><td>vas</td><td>fais</td><td>viens</td><td>prends</td></tr>
<tr><td>il</td><td>va</td><td>fait</td><td>vient</td><td>prend</td></tr>
<tr><td>nous</td><td>allons</td><td>faisons</td><td>venons</td><td>prenons</td></tr>
<tr><td>vous</td><td>allez</td><td>faites</td><td>venez</td><td>prenez</td></tr>
<tr><td>ils</td><td>vont</td><td>font</td><td>viennent</td><td>prennent</td></tr></table>
<table class="gt"><tr><th></th><th>pouvoir</th><th>vouloir</th><th>devoir</th><th>savoir</th></tr>
<tr><td>je</td><td>peux</td><td>veux</td><td>dois</td><td>sais</td></tr>
<tr><td>tu</td><td>peux</td><td>veux</td><td>dois</td><td>sais</td></tr>
<tr><td>il</td><td>peut</td><td>veut</td><td>doit</td><td>sait</td></tr>
<tr><td>nous</td><td>pouvons</td><td>voulons</td><td>devons</td><td>savons</td></tr>
<tr><td>vous</td><td>pouvez</td><td>voulez</td><td>devez</td><td>savez</td></tr>
<tr><td>ils</td><td>peuvent</td><td>veulent</td><td>doivent</td><td>savent</td></tr></table>
<p class="tip">vous faites, vous dites — единственные формы vous не на -ez. И ils vont, ils font, ils ont, ils sont — «четвёрка» с -ont.</p>`,
ex:[
{q:'Je ___ à la bibliothèque. (aller)',a:'vais'},{q:'Vous ___ une pause ? (faire)',a:'faites'},{q:'Ils ___ de Paris. (venir)',a:'viennent'},
{q:'Nous ___ le métro. (prendre)',a:'prenons'},{q:'Elle ___ parler trois langues. (savoir)',a:'sait'},{q:'Tu ___ m\'aider ? (pouvoir)',a:'peux'},
{q:'Je ___ réussir. (vouloir)',a:'veux'},{q:'Nous ___ travailler. (devoir)',a:'devons'}]},

{id:'g06',lvl:'A1',title:'Прилагательные, притяжательные и указательные',min:15,
theory:`
<p><b>Прилагательное</b> согласуется с существительным: женский +e, множественное +s.</p>
<p class="ex">un grand appartement · une grande ville · des grands parents/ des grandes villes</p>
<p>Особые: beau/belle, nouveau/nouvelle, vieux/vieille (перед мужским с гласной: bel, nouvel, vieil). -eux → -euse (heureux/heureuse); -if → -ive (actif/active); -er → -ère (cher/chère).</p>
<p><b>Место:</b> обычно после существительного (<span class="fr">une idée intéressante</span>), но короткие частые — до: <span class="fr">un petit, grand, beau, bon, mauvais, jeune, vieux, nouveau garçon</span> (BAGS).</p>
<table class="gt"><tr><th></th><th>муж.</th><th>жен.</th><th>мн.</th></tr>
<tr><td>мой</td><td>mon</td><td>ma (mon + гласная)</td><td>mes</td></tr>
<tr><td>твой</td><td>ton</td><td>ta</td><td>tes</td></tr><tr><td>его/её</td><td>son</td><td>sa</td><td>ses</td></tr>
<tr><td>наш</td><td>notre</td><td>notre</td><td>nos</td></tr><tr><td>ваш</td><td>votre</td><td>votre</td><td>vos</td></tr>
<tr><td>их</td><td>leur</td><td>leur</td><td>leurs</td></tr>
<tr><td>этот</td><td>ce (cet)</td><td>cette</td><td>ces</td></tr></table>
<p class="tip">Притяжательное согласуется с <b>предметом</b>, не с владельцем: <span class="fr">son père</span> = и «его отец», и «её отец». Перед гласной: <span class="fr">mon amie</span> (хотя amie женского рода).</p>`,
ex:[
{q:'une ville (grand) → une ___ ville',a:'grande'},{q:'Elle est (heureux) → elle est ___',a:'heureuse'},{q:'___ amie (моя, ж. на гласную)',a:'mon'},
{q:'Marie et ___ frère (её)',a:'son'},{q:'___ livres (наши)',a:'nos'},{q:'___ homme (этот)',a:'cet'},
{q:'___ idées (эти)',a:'ces'},{q:'un journal (nouveau) → un ___ journal',a:'nouveau'}]},

{id:'g07',lvl:'A1',title:'Предлоги места, à/de, страны и города',min:15,
theory:`
<p><b>à + le = au, à + les = aux; de + le = du, de + les = des.</b> (à la, à l', de la, de l' — без изменений)</p>
<p class="ex">Je vais au cinéma. · Il parle aux étudiants. · Le livre du professeur. · La fin des vacances.</p>
<table class="gt"><tr><th>Куда/где</th><th>правило</th><th>пример</th></tr>
<tr><td>город</td><td>à</td><td>à Moscou, à Paris</td></tr>
<tr><td>страна ж. (-e)</td><td>en</td><td>en France, en Russie</td></tr>
<tr><td>страна м.</td><td>au</td><td>au Canada, au Japon</td></tr>
<tr><td>страна мн.</td><td>aux</td><td>aux États-Unis</td></tr></table>
<p>Откуда: <span class="fr">de Paris, de France, du Canada, des États-Unis</span>.</p>
<p><b>Место:</b> sur (на), sous (под), dans (в), devant, derrière, entre, à côté de, en face de, près de ≠ loin de, au milieu de.</p>
<p class="ex">La banque est en face de la gare. · Le parc est près de chez moi.</p>
<p>chez + человек: <span class="fr">chez le médecin, chez moi</span>.</p>`,
ex:[
{q:'Je vais ___ cinéma. (à + le)',a:'au'},{q:'Elle habite ___ France.',a:'en'},{q:'Il revient ___ Canada. (de + le)',a:'du'},
{q:'Nous allons ___ Paris.',a:'à'},{q:'Le livre ___ professeur. (de + le)',a:'du'},{q:'Ils vivent ___ États-Unis.',a:'aux'},
{q:'Le café est ___ face de la gare.',a:'en'},{q:'Je vais ___ le dentiste.',a:'chez'}]},

{id:'g08',lvl:'A2',title:'Возвратные глаголы и повелительное наклонение',min:15,
theory:`
<p>Возвратные глаголы (se lever, se coucher, se réveiller, s'inscrire…) имеют местоимение перед глаголом:</p>
<p class="ex">je me lève · tu te lèves · il se lève · nous nous levons · vous vous levez · ils se lèvent</p>
<p>Отрицание вокруг обоих слов: <span class="fr">Je ne me lève pas tôt.</span> Перед гласной: m', t', s'.</p>
<p><b>Impératif</b> = форма présent без подлежащего (для -er без -s в tu): <span class="fr">Parle ! Parlons ! Parlez !</span></p>
<p>Неправильные: <span class="fr">sois, soyons, soyez</span> (être); <span class="fr">aie, ayons, ayez</span> (avoir); <span class="fr">va</span> (aller, без s).</p>
<p>Возвратные в повелительном: утверждение — после глагола через дефис <span class="fr">Lève-toi !</span>; отрицание — как обычно <span class="fr">Ne te lève pas !</span></p>`,
ex:[
{q:'Je ___ lève à sept heures.',a:'me'},{q:'Nous ___ couchons tard.',a:'nous'},{q:'Elle ___ réveille facilement.',a:'se'},
{q:'___ attention ! (faire, tu)',a:'Fais'},{q:'___ patients ! (être, vous)',a:'Soyez'},{q:'Ne ___ pas ! (s\'inquiéter, tu)',a:'t\'inquiète'},
{q:'___-toi ! (se dépêcher)',a:'Dépêche'},{q:'(Parler, nous) ___ plus lentement.',a:'Parlons'}]},

{id:'g09',lvl:'A2',title:'Passé composé с avoir',min:20,
theory:`
<p><b>Passé composé</b> = avoir (présent) + participe passé. Для действий, которые случились и закончились.</p>
<p><b>Participe passé:</b> -er → <b>-é</b> (parler → parlé); -ir → <b>-i</b> (finir → fini); -re → <b>-u</b> (vendre → vendu).</p>
<p><b>Неправильные — выучить:</b></p>
<table class="gt"><tr><td>avoir → eu</td><td>être → été</td><td>faire → fait</td><td>prendre → pris</td></tr>
<tr><td>voir → vu</td><td>pouvoir → pu</td><td>vouloir → voulu</td><td>devoir → dû</td></tr>
<tr><td>savoir → su</td><td>lire → lu</td><td>écrire → écrit</td><td>dire → dit</td></tr>
<tr><td>mettre → mis</td><td>boire → bu</td><td>connaître → connu</td><td>ouvrir → ouvert</td></tr></table>
<p class="ex">J'ai travaillé hier. · Nous avons pris le train. · Elle a écrit un article.</p>
<p>Отрицание вокруг avoir: <span class="fr">Je n'ai pas compris.</span> Наречия (déjà, encore, bien, trop) — между avoir и причастием.</p>
<p><b>Accord:</b> если COD стоит ПЕРЕД глаголом, причастие согласуется с ним: <span class="fr">Les articles que j'ai écrits.</span> <span class="fr">La leçon, je l'ai apprise.</span></p>`,
ex:[
{q:'Hier, j\'___ (travailler) beaucoup.',a:'ai travaillé'},{q:'Nous ___ (prendre) le métro.',a:'avons pris'},{q:'Elle ___ (écrire) un article.',a:'a écrit'},
{q:'Ils ___ (finir) le projet.',a:'ont fini'},{q:'Tu ___ (voir) ce film ?',a:'as vu'},{q:'Je n\'ai pas ___ (comprendre).',a:'compris'},
{q:'Vous ___ (faire) une erreur.',a:'avez fait'},{q:'La leçon que j\'ai ___ (apprendre, ж.)',a:'apprise'}]},

{id:'g10',lvl:'A2',title:'Passé composé с être',min:20,
theory:`
<p>Avec <b>être</b>: 14 глаголов движения/изменения (DR MRS VANDERTRAMP) + <b>все возвратные</b>.</p>
<table class="gt"><tr><td>aller → allé</td><td>venir → venu</td><td>arriver → arrivé</td><td>partir → parti</td></tr>
<tr><td>entrer → entré</td><td>sortir → sorti</td><td>monter → monté</td><td>descendre → descendu</td></tr>
<tr><td>naître → né</td><td>mourir → mort</td><td>rester → resté</td><td>tomber → tombé</td>
</tr><tr><td>retourner → retourné</td><td>devenir → devenu</td><td colspan="2">+ rentrer, revenir, passer…</td></tr></table>
<p><b>Причастие согласуется с подлежащим:</b></p>
<p class="ex">Il est allé · Elle est allée · Ils sont allés · Elles sont allées</p>
<p>Возвратные: <span class="fr">Elle s'est levée tôt. Nous nous sommes inscrits.</span> (Но: <span class="fr">Elle s'est lavé les mains</span> — COD «mains» после глагола, согласования нет.)</p>
<p class="tip">Ловушка: с COD вместо движения → avoir: <span class="fr">J'ai sorti la poubelle</span> (но <span class="fr">Je suis sortie</span>). <span class="fr">Elle a passé un examen</span>, но <span class="fr">Elle est passée par Lyon</span>.</p>
<p><b>Devenir → devenu</b> (как venir → venu). Вспомни: <span class="fr">Elle est devenue chercheuse.</span></p>`,
ex:[
{q:'Elle ___ (arriver, ж.) hier.',a:'est arrivée'},{q:'Nous ___ (partir, м. мн.) tôt.',a:'sommes partis'},{q:'Ils ___ (rester) à la maison.',a:'sont restés'},
{q:'Elle ___ (se lever) à six heures.',a:'s\'est levée'},{q:'Je ___ (naître, м.) en 1998.',a:'suis né'},{q:'Elles ___ (devenir) expertes.',a:'sont devenues'},
{q:'Il ___ (sortir) la poubelle.',a:'a sorti'},{q:'Vous ___ (aller, ж. ед. вежл.) au musée ?',a:'êtes allée'}]},

{id:'g11',lvl:'A2',title:'Imparfait',min:15,
theory:`
<p>Основа — форма <b>nous</b> в présent без -ons + окончания <b>-ais, -ais, -ait, -ions, -iez, -aient</b>.</p>
<p class="ex">nous parlons → je parlais · nous finissons → je finissais · nous faisons → je faisais · nous prenons → je prenais</p>
<p>Единственное исключение — <b>être</b>: j'étais, tu étais, il était, nous étions, vous étiez, ils étaient.</p>
<p><b>Когда imparfait?</b></p>
<ul><li>описание, фон: <span class="fr">Il faisait beau, les enfants jouaient.</span></li>
<li>привычка в прошлом: <span class="fr">Quand j'étais petite, je lisais tous les soirs.</span></li>
<li>состояние, чувства, возраст: <span class="fr">J'avais peur. Il était fatigué.</span></li></ul>
<p>Маркеры: <span class="fr">autrefois, souvent, toujours, chaque jour, à l'époque, pendant que</span>.</p>
<p>-ger, -cer: nous mangeons → je mangeais; nous commençons → je commençais (с ç, чтобы c читалось как [s]).</p>`,
ex:[
{q:'Quand j\'___ (être) petite…',a:'étais'},{q:'Il ___ (faire) beau.',a:'faisait'},{q:'Nous ___ (habiter) à Kazan.',a:'habitions'},
{q:'Ils ___ (avoir) peur.',a:'avaient'},{q:'Vous ___ (finir) tard.',a:'finissiez'},{q:'Elle ___ (manger) toujours seule.',a:'mangeait'},
{q:'Tu ___ (prendre) le bus.',a:'prenais'},{q:'Nous ___ (commencer) à huit heures.',a:'commencions'}]},

{id:'g12',lvl:'A2',title:'Passé composé или imparfait?',min:20,
theory:`
<p><b>Формула:</b> imparfait = «фон/кино в процессе», passé composé = «событие/кадр».</p>
<p class="ex">Il pleuvait (фон) quand je suis sortie (событие). · Je lisais (процесс) quand le téléphone a sonné (событие).</p>
<table class="gt"><tr><th>passé composé</th><th>imparfait</th></tr>
<tr><td>одно законченное действие</td><td>длительный процесс, описание</td></tr>
<tr><td>цепочка событий</td><td>привычка, повторяемость</td></tr>
<tr><td>точный момент: hier, soudain, un jour</td><td>à l'époque, souvent, d'habitude</td></tr></table>
<p><b>Смысл меняется:</b> <span class="fr">J'ai su la vérité</span> (узнала) vs <span class="fr">Je savais la vérité</span> (знала). <span class="fr">Il a voulu partir</span> (захотел и попытался) vs <span class="fr">Il voulait partir</span> (хотел).</p>
<p>Рассказ: фон — imparfait, сюжет — passé composé. Тренируй на мини-историях: <span class="fr">C'était un lundi. Il faisait froid. Je suis arrivée au travail et j'ai découvert que…</span></p>`,
ex:[
{q:'Il ___ (pleuvoir) quand je ___ (sortir).',a:'pleuvait / suis sortie',alt:['pleuvait / suis sorti']},{q:'Hier, je ___ (visiter) un musée.',a:'ai visité'},
{q:'Quand j\'___ (avoir) dix ans, je ___ (jouer) au piano.',a:'avais / jouais'},{q:'Soudain, le téléphone ___ (sonner).',a:'a sonné'},
{q:'Il ___ (être) fatigué, donc il ___ (rester) à la maison.',a:'était / est resté'},{q:'Nous ___ (regarder) la télé quand tu ___ (arriver).',a:'regardions / es arrivé',alt:['regardions / es arrivée']},
{q:'D\'habitude, elle ___ (prendre) le bus.',a:'prenait'},{q:'Un jour, elle ___ (décider) de partir.',a:'a décidé'}]},

{id:'g13',lvl:'A2',title:'Будущее: futur proche и futur simple',min:15,
theory:`
<p><b>Futur proche</b> = aller (présent) + инфинитив. Ближайшее, запланированное: <span class="fr">Je vais passer l'examen en mars.</span></p>
<p><b>Futur simple</b> = инфинитив (у -re отпадает e) + <b>-ai, -as, -a, -ons, -ez, -ont</b>.</p>
<p class="ex">parler → je parlerai · finir → je finirai · prendre → je prendrai</p>
<p><b>Особые основы (выучить):</b></p>
<table class="gt"><tr><td>être → ser-</td><td>avoir → aur-</td><td>aller → ir-</td><td>faire → fer-</td></tr>
<tr><td>venir → viendr-</td><td>voir → verr-</td><td>pouvoir → pourr-</td><td>vouloir → voudr-</td></tr>
<tr><td>devoir → devr-</td><td>savoir → saur-</td><td>falloir → faudr-</td><td>envoyer → enverr-</td></tr></table>
<p>Futur simple — в письменной речи, обещаниях, прогнозах: <span class="fr">Le climat se réchauffera. Nous agirons.</span></p>
<p><b>Passé récent:</b> venir de + инфинитив — «только что»: <span class="fr">Je viens de finir.</span></p>
<p>После <span class="fr">quand, dès que, lorsque</span> с будущим смыслом — тоже futur: <span class="fr">Quand j'aurai le temps, je t'écrirai.</span></p>`,
ex:[
{q:'Demain, je ___ (aller) à Moscou. (futur simple)',a:'irai'},{q:'Il ___ (faire) beau. (futur simple)',a:'fera'},{q:'Nous ___ (être) prêts.',a:'serons'},
{q:'Je ___ ___ passer l\'examen. (futur proche)',a:'vais'},{q:'Vous ___ (pouvoir) venir ?',a:'pourrez'},{q:'Elle ___ (avoir) le résultat.',a:'aura'},
{q:'Je ___ de finir mon article. (только что)',a:'viens'},{q:'Ils ___ (venir) en mars.',a:'viendront'}]},

{id:'g14',lvl:'A2',title:'Местоимения-дополнения COD и COI',min:20,
theory:`
<p>Местоимения заменяют дополнение и ставятся <b>перед глаголом</b>.</p>
<table class="gt"><tr><th></th><th>COD (кого? что?)</th><th>COI (кому? к кому?)</th></tr>
<tr><td>я</td><td>me (m')</td><td>me (m')</td></tr><tr><td>ты</td><td>te (t')</td><td>te (t')</td></tr>
<tr><td>он / она</td><td>le / la (l')</td><td>lui</td></tr><tr><td>мы</td><td>nous</td><td>nous</td></tr>
<tr><td>вы</td><td>vous</td><td>vous</td></tr><tr><td>они</td><td>les</td><td>leur</td></tr></table>
<p class="ex">Je vois Marie → Je <b>la</b> vois. · Je parle à Marie → Je <b>lui</b> parle. · J'ai écrit aux étudiants → Je <b>leur</b> ai écrit.</p>
<p><b>В passé composé</b> — перед avoir: <span class="fr">Je l'ai vue.</span> (причастие согласуется с COD: la = ж.) <span class="fr">Je lui ai téléphoné.</span> (с COI согласования нет).</p>
<p><b>С инфинитивом</b> — перед инфинитивом: <span class="fr">Je veux le voir.</span></p>
<p><b>Повелительное утвердительное:</b> после глагола, <b>moi/toi</b>: <span class="fr">Écoute-moi ! Donne-lui le livre !</span></p>
<p>COI (à qn): parler à, téléphoner à, répondre à, écrire à, donner à, dire à, demander à. Но: <span class="fr">attendre qn, écouter qn, regarder qn, chercher qn</span> — COD.</p>`,
ex:[
{q:'Je vois Marie. → Je ___ vois.',a:'la'},{q:'Je parle à Paul. → Je ___ parle.',a:'lui'},{q:'Il écrit aux clients. → Il ___ écrit.',a:'leur'},
{q:'Nous aimons ce film. → Nous ___ aimons.',a:'l\''},{q:'Elle a vu les photos. → Elle ___ a vues.',a:'les'},{q:'Tu as téléphoné à Anne ? → Tu ___ as téléphoné ?',a:'lui'},
{q:'Je veux ___ voir. (его)',a:'le'},{q:'Écoute-___ ! (меня)',a:'moi'}]}
);
