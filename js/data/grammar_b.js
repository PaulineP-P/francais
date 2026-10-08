/* Грамматика: уроки 15–28 (A2 → B2). */
window.GRAMMAR = window.GRAMMAR || [];
window.GRAMMAR.push(
{id:'g15',lvl:'A2',title:'Местоимения y и en',min:15,
theory:`
<p><b>y</b> заменяет «à/dans/chez + место или вещь»: <span class="fr">Je vais à Paris → J'y vais. Je pense à mon examen → J'y pense.</span></p>
<p><b>en</b> заменяет «de + что-то» или количество:</p>
<p class="ex">Tu as des frères ? — Oui, j'en ai deux. · Tu viens de Lyon ? — Oui, j'en viens. · Il parle de son projet → Il en parle.</p>
<p>Количество остаётся после глагола: <span class="fr">J'en ai trois. Il n'en reste plus.</span></p>
<p>Позиция та же: перед глаголом (перед avoir в passé composé): <span class="fr">J'y suis allée. Nous en avons pris.</span></p>
<p class="tip">Про людей: «penser à Marie» → <span class="fr">penser à elle</span> (не y). А «parler de Marie» → <span class="fr">parler d'elle</span>.</p>`,
ex:[
{q:'Tu vas à la bibliothèque ? — Oui, j\'___ vais.',a:'y'},{q:'Tu as des livres ? — Oui, j\'___ ai cinq.',a:'en'},
{q:'Il parle de son travail → Il ___ parle.',a:'en'},{q:'Nous pensons à l\'examen → Nous ___ pensons.',a:'y'},
{q:'Elle est allée à Lyon → Elle ___ est allée.',a:'y'},{q:'Vous venez de Paris ? — Oui, j\'___ viens.',a:'en'},
{q:'Il n\'y a plus de pain → Il n\'___ a plus.',a:'y en'},{q:'Tu as mangé du gâteau ? — Oui, j\'___ ai mangé.',a:'en'}]},

{id:'g16',lvl:'A2',title:'Сравнение, количество, превосходная степень',min:15,
theory:`
<p><b>Сравнительная степень:</b> plus / moins / aussi + прилагательное + <b>que</b>.</p>
<p class="ex">Le train est plus rapide que le bus. · Elle est aussi motivée que lui. · Il y a moins de pollution ici.</p>
<p><b>Особые:</b> bon → <b>meilleur</b> (<span class="fr">Ce café est meilleur</span>); bien → <b>mieux</b> (<span class="fr">Elle chante mieux</span>); mauvais → pire (<i>реже:</i> plus mauvais).</p>
<p><b>Превосходная:</b> le / la / les plus (moins) + прил.: <span class="fr">C'est le plus grand problème. C'est la meilleure solution.</span></p>
<p><b>Количество:</b> beaucoup <b>de</b>, peu <b>de</b>, assez <b>de</b>, trop <b>de</b>, un peu <b>de</b>, plus <b>de</b>, la plupart <b>des</b>, chaque (+ ед. ч.), plusieurs.</p>
<p class="ex">Il y a beaucoup de pollution. · Trop de voitures circulent. · La plupart des gens pensent que…</p>
<p class="tip">Ловушка: «чем … тем»: <span class="fr">Plus on étudie, plus on progresse.</span></p>`,
ex:[
{q:'Ce café est ___ (хороший → лучше).',a:'meilleur'},{q:'Elle parle ___ (bien → лучше).',a:'mieux'},{q:'Paris est plus grand ___ Lyon.',a:'que'},
{q:'C\'est ___ plus grand problème. (определённый, м.)',a:'le'},{q:'Il y a trop ___ bruit. (de)',a:'de'},{q:'___ on étudie, ___ on progresse. (чем…тем)',a:'plus / plus'},
{q:'La ___ des gens pensent ainsi. (большинство)',a:'plupart'},{q:'Il est aussi fatigué ___ moi.',a:'que'}]},

{id:'g17',lvl:'B1',title:'Conditionnel и предложения с si',min:20,
theory:`
<p><b>Conditionnel présent</b> = основа futur simple + окончания imparfait (<b>-ais, -ais, -ait, -ions, -iez, -aient</b>).</p>
<p class="ex">je parlerais · tu finirais · il serait · nous aurions · ils pourraient · vous voudriez</p>
<p><b>Зачем нужен:</b></p>
<ul><li>вежливость: <span class="fr">Je voudrais un renseignement. Pourriez-vous répéter ?</span></li>
<li>совет: <span class="fr">Tu devrais te reposer.</span></li>
<li>гипотеза, желание: <span class="fr">Ce serait formidable.</span></li>
<li>неподтверждённая информация (в СМИ): <span class="fr">Le président aurait démissionné.</span></li></ul>
<table class="gt"><tr><th>Тип</th><th>si + …</th><th>…</th></tr>
<tr><td>реальное</td><td>si + présent</td><td>futur / impératif / présent</td></tr>
<tr><td>нереальное сейчас</td><td>si + imparfait</td><td>conditionnel présent</td></tr>
<tr><td>нереальное в прошлом</td><td>si + plus-que-parfait</td><td>conditionnel passé</td></tr></table>
<p class="ex">Si j'ai le temps, j'irai. · Si j'avais le temps, j'irais. · Si j'avais eu le temps, je serais allée.</p>
<p class="tip">После <b>si</b> НИКОГДА не ставим futur или conditionnel (⛔ si j'aurais). Исключение — косвенный вопрос: <span class="fr">Je me demande si elle viendra.</span></p>`,
ex:[
{q:'Si j\'ai le temps, j\'___ (aller) au musée.',a:'irai'},{q:'Si j\'avais le temps, j\'___ (aller) au musée.',a:'irais'},{q:'Je ___ (vouloir) un café, s\'il vous plaît.',a:'voudrais'},
{q:'Tu ___ (devoir) dormir plus.',a:'devrais'},{q:'Si nous ___ (avoir) de l\'argent, nous voyagerions.',a:'avions'},{q:'___-vous (pouvoir) répéter ?',a:'Pourriez'},
{q:'Si elle étudiait plus, elle ___ (réussir).',a:'réussirait'},{q:'Si j\'avais su, je ne ___ (venir) pas. (cond. présent)',a:'viendrais'}]},

{id:'g18',lvl:'B1',title:'Относительные местоимения: qui, que, où, dont',min:20,
theory:`
<table class="gt"><tr><th></th><th>функция</th><th>пример</th></tr>
<tr><td><b>qui</b></td><td>подлежащее («который» делает)</td><td>L'homme <b>qui</b> parle est mon prof.</td></tr>
<tr><td><b>que</b></td><td>прямое дополнение</td><td>Le livre <b>que</b> je lis est long.</td></tr>
<tr><td><b>où</b></td><td>место / время</td><td>La ville <b>où</b> j'habite. Le jour <b>où</b> je suis arrivée.</td></tr>
<tr><td><b>dont</b></td><td>de + что</td><td>Le problème <b>dont</b> je parle. L'auteur <b>dont</b> j'ai lu le livre.</td></tr></table>
<p><b>Как выбрать:</b> подставь вопрос. «Кто делает?» → qui. «Кого/что <i>я</i> …?» → que. «О чём/о ком говорят (de)?» → dont.</p>
<p>Dont заменяет «de + ...»: parler <b>de</b>, avoir besoin <b>de</b>, avoir peur <b>de</b>, se souvenir <b>de</b>, s'occuper <b>de</b>, être content <b>de</b>.</p>
<p class="tip">После <b>dont</b> стоит подлежащее: <span class="fr">Le sujet dont on parle</span> — не «dont de lui». Причастие при que согласуется: <span class="fr">La leçon que j'ai apprise.</span></p>`,
ex:[
{q:'L\'article ___ est publié en mars.',a:'qui'},{q:'Le livre ___ je lis est long.',a:'que'},{q:'La ville ___ j\'habite est petite.',a:'où'},
{q:'Le sujet ___ nous parlons est important.',a:'dont'},{q:'C\'est la personne ___ m\'a aidée.',a:'qui'},{q:'Voici le film ___ j\'ai besoin pour mon cours. (de + что)',a:'dont'},
{q:'Les exercices ___ tu fais sont utiles.',a:'que'},{q:'Le jour ___ je suis arrivée, il pleuvait.',a:'où'}]},

{id:'g19',lvl:'B1',title:'Логические связки (connecteurs)',min:20,
theory:`
<p>Связки — сердце письменной и устной части. Выучи по одной на каждую функцию, чтобы текст «читался».</p>
<table class="gt">
<tr><td><b>Порядок</b></td><td>d'abord, tout d'abord, ensuite, puis, enfin, pour finir</td></tr>
<tr><td><b>Добавление</b></td><td>de plus, en outre, par ailleurs, de surcroît</td></tr>
<tr><td><b>Причина</b></td><td>car, parce que, puisque, en effet, grâce à (+), à cause de (−)</td></tr>
<tr><td><b>Следствие</b></td><td>donc, par conséquent, ainsi, c'est pourquoi, si bien que</td></tr>
<tr><td><b>Противопоставление</b></td><td>mais, cependant, pourtant, toutefois, en revanche, alors que</td></tr>
<tr><td><b>Уступка</b></td><td>certes… mais, bien que + subj., même si, malgré + сущ.</td></tr>
<tr><td><b>Пример</b></td><td>par exemple, notamment, c'est le cas de</td></tr>
<tr><td><b>Вывод</b></td><td>en somme, en conclusion, pour conclure, en définitive</td></tr></table>
<p class="tip"><b>Parce que</b> — ответ на pourquoi; <b>car</b> — пишем в середине предложения, не в начале; <b>puisque</b> — причина известна собеседнику.</p>
<p><b>Grâce à</b> — хорошая причина (<span class="fr">grâce à cette loi</span>), <b>à cause de</b> — плохая (<span class="fr">à cause de la pollution</span>).</p>`,
ex:[
{q:'Il pleut, ___ je prends un parapluie. (следствие)',a:'donc'},{q:'Je reste ici ___ je suis fatiguée. (причина)',a:'parce que'},{q:'Elle a réussi ___ à son travail. (благодаря)',a:'grâce'},
{q:'Les gestes comptent. ___, ils ne suffisent pas. (однако)',a:'Cependant',alt:['Pourtant','Toutefois']},{q:'___ il soit jeune, il est expérimenté. (хотя)',a:'Bien qu\'',alt:['Bien que']},{q:'Il est malade, ___ il travaille. (тем не менее)',a:'pourtant'},
{q:'Il y a des avantages; ___ , il y a des risques. (с другой стороны, в отличие)',a:'en revanche'},{q:'Les retards sont dus ___ la grève. (из-за, негатив)',a:'à cause de'}]},

{id:'g20',lvl:'B1',title:'Subjonctif présent',min:25,
theory:`
<p><b>Образование:</b> основа от <i>ils</i> (présent) + <b>-e, -es, -e, -ions, -iez, -ent</b>.</p>
<p class="ex">ils finissent → que je finisse · ils partent → qu'il parte · ils prennent → que tu prennes (но nous prenions)</p>
<p><b>Неправильные (запомнить):</b></p>
<table class="gt"><tr><td>être → que je sois</td><td>avoir → que j'aie</td></tr>
<tr><td>aller → que j'aille</td><td>faire → que je fasse</td></tr>
<tr><td>pouvoir → que je puisse</td><td>savoir → que je sache</td></tr>
<tr><td>vouloir → que je veuille</td><td>falloir → qu'il faille</td></tr></table>
<p><b>Когда subjonctif?</b> После выражений: </p>
<ul><li>необходимость: <span class="fr">il faut que, il est nécessaire que, il est important que</span></li>
<li>желание/приказ: <span class="fr">vouloir que, souhaiter que, exiger que</span></li>
<li>чувства: <span class="fr">être content que, regretter que, avoir peur que, craindre que</span></li>
<li>сомнение, отрицание: <span class="fr">douter que, ne pas penser que, il est possible que</span></li>
<li>союзы: <span class="fr">bien que, pour que, avant que, à condition que, afin que, jusqu'à ce que</span></li></ul>
<p class="tip">Если подлежащее одно и то же — инфинитив: <span class="fr">Je veux réussir</span>, но <span class="fr">Je veux que tu réussisses.</span> А <b>penser que</b> (утверждение) и <b>il est certain que</b> — indicatif!</p>`,
ex:[
{q:'Il faut que je ___ (finir) mon article.',a:'finisse'},{q:'Il faut que nous ___ (aller) à la bibliothèque.',a:'allions'},{q:'Je veux qu\'elle ___ (être) heureuse.',a:'soit'},
{q:'Bien qu\'il ___ (faire) froid, nous sortons.',a:'fasse'},{q:'Il faut que tu ___ (prendre) tes notes.',a:'prennes'},{q:'Je doute qu\'il ___ (pouvoir) venir.',a:'puisse'},
{q:'Il est important que vous ___ (avoir) du temps.',a:'ayez'},{q:'Pour que vous ___ (comprendre), j\'explique.',a:'compreniez'}]},

{id:'g21',lvl:'B1',title:'Plus-que-parfait',min:15,
theory:`
<p><b>Plus-que-parfait</b> = avoir/être à imparfait + participe passé. Действие, которое произошло <b>раньше</b> другого прошлого действия.</p>
<p class="ex">J'avais fini quand il est arrivé. · Elle était déjà partie quand j'ai appelé.</p>
<p>Согласование и выбор вспомогательного — те же, что в passé composé: <span class="fr">Elles étaient arrivées. Il s'était levé tôt.</span></p>
<p>Маркеры: <span class="fr">déjà, avant, la veille, une heure plus tôt</span>.</p>
<p><b>Использование в гипотезе:</b> <span class="fr">Si j'avais étudié, j'aurais réussi.</span></p>
<p><b>Использование в рассказе:</b> фон (imparfait) → события (passé composé) → «предыстория» (plus-que-parfait).</p>
<p class="ex">Je suis arrivée à la gare, mais le train était déjà parti.</p>`,
ex:[
{q:'J\'___ (finir) quand il est arrivé.',a:'avais fini'},{q:'Elle ___ (partir) déjà.',a:'était partie'},{q:'Nous ___ (manger) avant le film.',a:'avions mangé'},
{q:'Ils ___ (se lever) tôt.',a:'s\'étaient levés'},{q:'Tu ___ (voir) ce film ?',a:'avais vu'},{q:'Quand je suis arrivée, le cours ___ (commencer).',a:'avait commencé'},
{q:'Si j\'___ (étudier), j\'aurais réussi.',a:'avais étudié'},{q:'Vous ___ (écrire) la lettre la veille.',a:'aviez écrit'}]},

{id:'g22',lvl:'B1',title:'Косвенная речь',min:20,
theory:`
<p>Меняется время, если глагол речи в прошедшем:</p>
<table class="gt"><tr><th>прямая</th><th>косвенная (в прошлом)</th></tr>
<tr><td>présent</td><td>imparfait</td></tr><tr><td>passé composé</td><td>plus-que-parfait</td></tr>
<tr><td>futur simple</td><td>conditionnel présent</td></tr><tr><td>futur proche (je vais)</td><td>j'allais</td></tr></table>
<p class="ex">« Je suis fatiguée. » → Elle a dit <b>qu'elle était fatiguée</b>.<br>« J'ai fini. » → Il a dit <b>qu'il avait fini</b>.<br>« Je viendrai. » → Il a promis <b>qu'il viendrait</b>.</p>
<p><b>Вопросы:</b> да/нет → <b>si</b>; что → <b>ce que</b>; кто → <b>qui</b>; порядок слов прямой, без инверсии.</p>
<p class="ex">« Tu viens ? » → Il m'a demandé <b>si je venais</b>. · « Que fais-tu ? » → Il m'a demandé <b>ce que je faisais</b>.</p>
<p><b>Меняются слова:</b> ici → là; aujourd'hui → ce jour-là; demain → le lendemain; hier → la veille; maintenant → alors; ce soir → ce soir-là.</p>
<p><b>Приказ:</b> <span class="fr">« Ferme la porte ! » → Il m'a dit de fermer la porte.</span></p>`,
ex:[
{q:'« Je suis fatiguée. » → Elle a dit qu\'elle ___ fatiguée.',a:'était'},{q:'« J\'ai fini. » → Il a dit qu\'il ___ fini.',a:'avait'},{q:'« Je viendrai. » → Il a promis qu\'il ___ .',a:'viendrait'},
{q:'« Tu viens ? » → Il m\'a demandé ___ je venais.',a:'si'},{q:'« Que fais-tu ? » → Il m\'a demandé ___ je faisais.',a:'ce que'},{q:'« Demain, je pars. » → Il a dit que ___ il partait.',a:'le lendemain'},
{q:'« Ferme la porte ! » → Il m\'a dit ___ fermer la porte.',a:'de'},{q:'« Nous irons. » → Ils ont dit qu\'ils ___ .',a:'iraient'}]},

{id:'g23',lvl:'B2',title:'Пассив и способы его избежать',min:20,
theory:`
<p><b>Passif</b> = être (в нужном времени) + participe passé (согласуется с подлежащим) + <b>par</b> + деятель.</p>
<p class="ex">La loi est votée par le Parlement. · Les déchets ont été collectés. · Le projet sera financé par l'État.</p>
<p><b>Когда пассив?</b> Когда важнее результат, а не деятель: <span class="fr">Le décret a été annulé.</span> Деятель часто опускается.</p>
<p><b>Как избежать (стиль!):</b></p>
<ul><li>on: <span class="fr">On a annulé le décret.</span></li>
<li>возвратный: <span class="fr">Ce produit se vend bien. Le français se parle en Afrique.</span></li>
<li>se faire + инфинитив: <span class="fr">Il s'est fait voler son sac.</span></li>
<li>существительные: <span class="fr">L'adoption de la loi…</span></li></ul>
<p>Для письменной части B2 пассив — хороший знак: <span class="fr">Il est démontré que… / Il est admis que… / Cette mesure est jugée insuffisante.</span></p>`,
ex:[
{q:'La loi ___ (voter) par le Parlement. (présent)',a:'est votée'},{q:'Les déchets ___ (collecter) hier. (passé composé, мн.)',a:'ont été collectés'},{q:'Le projet ___ (financer) l\'an prochain. (futur)',a:'sera financé'},
{q:'Ce produit ___ bien. (se vendre, présent)',a:'se vend'},{q:'Active: On a annulé le décret. → Passif: Le décret ___ .',a:'a été annulé'},{q:'Les mesures ___ (juger) insuffisantes. (présent)',a:'sont jugées'},
{q:'Il ___ (faire) voler son sac. (passé composé, он, se faire)',a:'s\'est fait'},{q:'La conférence ___ (organiser) par l\'université. (imparfait)',a:'était organisée'}]},

{id:'g24',lvl:'B2',title:'Gérondif и participe présent',min:20,
theory:`
<p><b>Participe présent</b> = основа nous (présent) + <b>-ant</b>: parlant, finissant, faisant, prenant. Исключения: étant, ayant, sachant.</p>
<p><b>Gérondif</b> = <b>en</b> + participe présent. Подлежащее одно и то же. Значения:</p>
<ul><li>одновременность: <span class="fr">Elle écoute de la musique en travaillant.</span></li>
<li>способ: <span class="fr">On progresse en pratiquant chaque jour.</span></li>
<li>условие: <span class="fr">En réduisant le plastique, on protège la mer.</span></li>
<li>причина: <span class="fr">En étudiant tard, il s'est fatigué.</span></li></ul>
<p>В эссе: <span class="fr">En réduisant nos déchets, nous contribuons…</span> — отлично заменяет «si on réduit…».</p>
<p class="tip">Participe présent (без en) — письменный стиль: <span class="fr">Les gens habitant en ville…</span> = <span class="fr">les gens qui habitent</span>. На B2 понимать надо, использовать — по желанию.</p>`,
ex:[
{q:'Elle écoute de la musique ___ (travailler).',a:'en travaillant'},{q:'___ (réduire) le plastique, on protège la mer.',a:'En réduisant'},{q:'Il apprend ___ (lire) beaucoup.',a:'en lisant'},
{q:'Participe présent de finir : ___',a:'finissant'},{q:'Participe présent de faire : ___',a:'faisant'},{q:'___ (être) fatiguée, elle s\'est couchée.',a:'Étant'},
{q:'Il est tombé ___ (courir).',a:'en courant'},{q:'___ (prendre) le bus, elle gagne du temps.',a:'En prenant'}]},

{id:'g25',lvl:'B2',title:'Сложные относительные и ce qui / ce que / ce dont',min:20,
theory:`
<p><b>ce qui / ce que / ce dont</b> — «то, что» (когда нет существительного-антецедента).</p>
<p class="ex">Je ne comprends pas <b>ce qui</b> se passe. (подлежащее) · Dis-moi <b>ce que</b> tu penses. (COD) · Voilà <b>ce dont</b> j'ai besoin. (de + что)</p>
<p><b>Preposition + lequel</b> — после предлога (кроме de, который = dont):</p>
<table class="gt"><tr><td>avec lequel / laquelle / lesquels / lesquelles</td><td>le stylo avec lequel j'écris</td></tr>
<tr><td>pour lequel…</td><td>la raison pour laquelle</td></tr>
<tr><td>dans lequel…</td><td>le cadre dans lequel</td></tr>
<tr><td>auquel / à laquelle / auxquels</td><td>le projet auquel je pense</td></tr></table>
<p>Для людей — qui: <span class="fr">la personne avec qui je travaille</span>.</p>
<p class="ex">La raison pour laquelle j'écris est simple. · Le débat auquel j'ai participé était intense. · C'est une question à laquelle on ne répond pas facilement.</p>`,
ex:[
{q:'Je ne comprends pas ___ se passe.',a:'ce qui'},{q:'Dis-moi ___ tu penses.',a:'ce que'},{q:'Voilà ___ j\'ai besoin.',a:'ce dont'},
{q:'La raison pour ___ j\'écris est simple. (ж.)',a:'laquelle'},{q:'Le projet ___ je pense est ambitieux. (à + lequel)',a:'auquel'},{q:'La personne avec ___ je travaille est aimable.',a:'qui'},
{q:'Le cadre dans ___ nous agissons est strict. (м.)',a:'lequel'},{q:'Les questions ___ nous réfléchissons sont complexes. (à + lesquelles)',a:'auxquelles'}]},

{id:'g26',lvl:'B2',title:'Уступка и противопоставление',min:20,
theory:`
<p>Отличный способ сделать эссе «умным» — признать контраргумент и ответить на него. Конструкции (B2, не C1!):</p>
<table class="gt">
<tr><td><b>certes… mais / cependant</b></td><td>Certes, les gestes comptent, mais ils ne suffisent pas.</td></tr>
<tr><td><b>bien que + subjonctif</b></td><td>Bien que ce soit utile, c'est insuffisant.</td></tr>
<tr><td><b>même si + indicatif</b></td><td>Même si c'est difficile, il faut essayer.</td></tr>
<tr><td><b>malgré + сущ.</b></td><td>Malgré les efforts, la situation s'aggrave.</td></tr>
<tr><td><b>pourtant, néanmoins</b></td><td>Il est jeune. Pourtant, il est très mûr.</td></tr>
<tr><td><b>alors que / tandis que</b></td><td>Certains voyagent, alors que d'autres restent.</td></tr>
<tr><td><b>en revanche</b></td><td>La ville est bruyante; en revanche, elle est vivante.</td></tr></table>
<p class="tip">Не путай: <b>malgré</b> + существительное (<span class="fr">malgré la pluie</span>), <b>bien que</b> + глагол в subjonctif (<span class="fr">bien qu'il pleuve</span>). Даже «même si» никогда не берёт conditionnel/futur после себя.</p>
<p><b>Шаблон для debate:</b> <span class="fr">Je comprends votre argument, mais…</span> / <span class="fr">Certes, mais il ne faut pas oublier que…</span></p>`,
ex:[
{q:'___ les efforts, la situation s\'aggrave. (несмотря)',a:'Malgré'},{q:'Bien ___ ce soit utile, c\'est insuffisant.',a:'que'},{q:'___ si c\'est difficile, il faut essayer.',a:'Même'},
{q:'Certes, c\'est cher, ___ c\'est utile.',a:'mais'},{q:'Il est jeune. ___, il est très mûr.',a:'Pourtant',alt:['Néanmoins']},{q:'Certains voyagent, ___ que d\'autres restent.',a:'alors'},
{q:'Bien qu\'il ___ (pleuvoir), nous sortons.',a:'pleuve'},{q:'___ la pluie, il est sorti. (несмотря на)',a:'Malgré'}]},

{id:'g27',lvl:'B2',title:'Номинализация: стиль письменной части',min:20,
theory:`
<p>В письменной части «звучать как B2» помогают существительные вместо глаголов. Это то, что преподаватели называют <i>style soutenu</i>.</p>
<table class="gt"><tr><th>глагол</th><th>существительное</th><th>фраза</th></tr>
<tr><td>augmenter</td><td>l'augmentation</td><td>L'augmentation des prix inquiète.</td></tr>
<tr><td>réduire</td><td>la réduction</td><td>La réduction des déchets est un enjeu.</td></tr>
<tr><td>développer</td><td>le développement</td><td>Le développement durable</td></tr>
<tr><td>protéger</td><td>la protection</td><td>La protection de l'environnement</td></tr>
<tr><td>polluer</td><td>la pollution</td><td>La pollution de l'air</td></tr>
<tr><td>consommer</td><td>la consommation</td><td>La consommation responsable</td></tr>
<tr><td>décider</td><td>la décision</td><td>La décision du gouvernement</td></tr>
<tr><td>disparaître</td><td>la disparition</td><td>La disparition des espèces</td></tr>
<tr><td>s'engager</td><td>l'engagement</td><td>L'engagement des jeunes</td></tr>
<tr><td>sensibiliser</td><td>la sensibilisation</td><td>La sensibilisation du public</td></tr></table>
<p class="ex">Разговорно: «On pollue beaucoup, donc le climat change.» → Письменно: «L'importance de la pollution entraîne un dérèglement du climat.»</p>
<p>Связующие глаголы: <span class="fr">entraîner, provoquer, favoriser, permettre, contribuer à, résulter de, dépendre de</span>.</p>`,
ex:[
{q:'augmenter → ___ (существительное, ж.)',a:'l\'augmentation'},{q:'réduire → ___',a:'la réduction'},{q:'protéger → ___',a:'la protection'},
{q:'disparaître → ___',a:'la disparition'},{q:'sensibiliser → ___',a:'la sensibilisation'},{q:'décider → ___',a:'la décision'},
{q:'La pollution ___ (entraîner) des maladies. (слово «влечёт», présent, 3е л. ед.)',a:'entraîne'},{q:'Cette mesure ___ à réduire les déchets. (способствует; contribuer, 3е л. ед.)',a:'contribue'}]},

{id:'g28',lvl:'B2',title:'Выделение, гипотеза, порядок двух местоимений',min:25,
theory:`
<p><b>Mise en relief:</b> <span class="fr">C'est … qui / que</span> — подчёркиваем слово.</p>
<p class="ex">Ce sont les entreprises <b>qui</b> polluent le plus. · C'est de la formation <b>que</b> dépend le succès. · Ce que je veux, c'est réussir.</p>
<p><b>Гипотеза и условие:</b> <span class="fr">au cas où + conditionnel</span> (<span class="fr">au cas où il pleuvrait</span>); <span class="fr">à condition que + subj.</span> (<span class="fr">à condition qu'on agisse</span>); <span class="fr">sauf si + indicatif</span>; <span class="fr">à moins que + subj.</span></p>
<p><b>Два местоимения подряд:</b> порядок</p>
<p class="ex">me/te/nous/vous → le/la/les → lui/leur → y → en</p>
<p>Примеры: <span class="fr">Je te le donne. · Je le lui donne. · Il m'en parle. · Il y en a trois.</span></p>
<p><b>Повелительное утвердительное:</b> <span class="fr">Donne-le-moi ! Dis-le-lui !</span> Отрицательное — как обычно: <span class="fr">Ne me le donne pas !</span></p>`,
ex:[
{q:'Ce sont les entreprises ___ polluent le plus.',a:'qui'},{q:'C\'est de la formation ___ dépend le succès.',a:'que'},{q:'Je donne le livre à Paul. → Je ___ ___ donne.',a:'le lui'},
{q:'Il me parle de ce sujet. → Il m\'___ parle.',a:'en'},{q:'Au cas où il ___ (pleuvoir), prends un parapluie.',a:'pleuvrait'},{q:'Nous agirons à condition qu\'on nous ___ (aider).',a:'aide'},
{q:'Donne-___-moi ! (le livre)',a:'le'},{q:'___ que je veux, c\'est réussir.',a:'Ce'}]}
);
