/* Задания на письмо и речь для уровней A1–B1; для B2 используются 18 тем экологии (topics.js) + общие темы. */
window.WRITE_PROMPTS = [
{id:'w01',lvl:'A1',words:40,t:'Présentez-vous : nom, âge, ville, profession, deux passions.',hint:'Je m\'appelle…, J\'ai … ans, J\'habite à…, Je suis…, J\'aime…'},
{id:'w02',lvl:'A1',words:50,t:'Décrivez votre journée habituelle (du matin au soir).',hint:'Le matin, je me lève… Ensuite… L\'après-midi… Le soir…'},
{id:'w03',lvl:'A1',words:50,t:'Décrivez votre appartement ou votre chambre.',hint:'Il y a…, À gauche…, Devant la fenêtre…'},
{id:'w04',lvl:'A1',words:50,t:'Écrivez un message à un ami pour l\'inviter à dîner samedi.',hint:'Salut…, Tu es libre samedi ? On pourrait…, À bientôt !'},
{id:'w05',lvl:'A2',words:70,t:'Racontez vos dernières vacances ou votre dernier week-end (passé composé).',hint:'Je suis allée…, J\'ai visité…, C\'était…'},
{id:'w06',lvl:'A2',words:70,t:'Racontez un souvenir d\'enfance (imparfait + passé composé).',hint:'Quand j\'étais petite…, Un jour…, Soudain…'},
{id:'w07',lvl:'A2',words:70,t:'Écrivez à un hôtel pour demander des informations sur une chambre.',hint:'Madame, Monsieur, Je voudrais savoir si…, Pourriez-vous…, Cordialement'},
{id:'w08',lvl:'A2',words:80,t:'Décrivez vos projets pour l\'année prochaine (futur proche et futur simple).',hint:'Je vais…, L\'année prochaine, je…'},
{id:'w09',lvl:'B1',words:100,t:'Votre ville : avantages et inconvénients. Quelle est votre opinion ?',hint:'D\'un côté…, D\'un autre côté…, À mon avis…'},
{id:'w10',lvl:'B1',words:100,t:'Un forum demande : « Aimez-vous les réseaux sociaux ? ». Donnez votre avis.',hint:'Pour ma part, Je pense que…, Par exemple…'},
{id:'w11',lvl:'B1',words:110,t:'Racontez une expérience qui vous a appris quelque chose (plus-que-parfait autorisé).',hint:'Cette expérience m\'a appris que…'},
{id:'w12',lvl:'B1',words:110,t:'Lettre formelle : vous demandez un remboursement pour un produit défectueux.',hint:'Je me permets de vous écrire…, Je vous prie d\'agréer…'},
{id:'w13',lvl:'B1',words:120,t:'Faut-il apprendre une langue étrangère à l\'école dès six ans ? Donnez votre avis.',hint:'Il me semble que…, Premièrement…, Deuxièmement…'},
{id:'w14',lvl:'B1',words:120,t:'Que peut-on faire à son niveau pour protéger l\'environnement ?',hint:'Chacun peut…, Il faut que…, Par exemple…'},
{id:'w15',lvl:'B1',words:130,t:'Décrivez la personne que vous admirez le plus et expliquez pourquoi.',hint:'La personne que j\'admire est…, dont…, qui…'},
{id:'w16',lvl:'B1',words:130,t:'Les voyages forment-ils la jeunesse ? Argumentez en deux paragraphes.',hint:'D\'une part… D\'autre part…, En conclusion…'}
];
window.SPEAK_PROMPTS = [
{id:'s01',lvl:'A1',min:1,t:'Présentez-vous en 1 minute : qui êtes-vous, que faites-vous, que faites-vous pour vos loisirs ?'},
{id:'s02',lvl:'A1',min:1,t:'Décrivez votre famille et votre appartement.'},
{id:'s03',lvl:'A1',min:1,t:'Qu\'est-ce que vous mangez le matin, à midi et le soir ?'},
{id:'s04',lvl:'A2',min:2,t:'Racontez votre dernier week-end.'},
{id:'s05',lvl:'A2',min:2,t:'Parlez de votre travail ou de vos études : pourquoi les avez-vous choisis ?'},
{id:'s06',lvl:'A2',min:2,t:'Décrivez votre ville et dites ce que vous aimez ou n\'aimez pas.'},
{id:'s07',lvl:'A2',min:2,t:'Parlez de vos projets pour l\'été prochain.'},
{id:'s08',lvl:'B1',min:3,t:'Pourquoi apprenez-vous le français ? Que voulez-vous faire avec cette langue ?'},
{id:'s09',lvl:'B1',min:3,t:'Parlez d\'une tradition de votre pays.'},
{id:'s10',lvl:'B1',min:3,t:'Que pensez-vous du télétravail ? Donnez deux avantages et un inconvénient.'},
{id:'s11',lvl:'B1',min:3,t:'Pensez-vous que la technologie nous rend plus heureux ?'},
{id:'s12',lvl:'B1',min:3,t:'Quelle est, selon vous, la plus grande qualité d\'un bon professeur ?'},
{id:'s13',lvl:'B1',min:4,t:'Les jeunes lisent-ils moins qu\'avant ? Pourquoi ?'},
{id:'s14',lvl:'B1',min:4,t:'Faut-il voyager pour mieux comprendre le monde ?'}
];
/* Общие темы для B2, помимо экологии (для устной и письменной частей) */
window.B2_EXTRA = [
{id:'x01',kind:'ecrit',t:'Les réseaux sociaux : un outil de communication ou une source d\'isolement ?'},
{id:'x02',kind:'ecrit',t:'Peut-on réussir sans diplôme ?'},
{id:'x03',kind:'ecrit',t:'Faut-il limiter le temps d\'écran des enfants ?'},
{id:'x04',kind:'ecrit',t:'Le télétravail doit-il devenir la norme ?'},
{id:'x05',kind:'oral',t:'L\'intelligence artificielle : une chance ou un danger pour l\'éducation ?'},
{id:'x06',kind:'oral',t:'Faut-il rendre le vote obligatoire ?'},
{id:'x07',kind:'oral',t:'La culture doit-elle être gratuite ?'},
{id:'x08',kind:'oral',t:'Étudier à l\'étranger : une expérience indispensable ?'},
{id:'x09',kind:'ecrit',t:'Les sciences : jusqu\'où peut-on aller (éthique et recherche) ?'},
{id:'x10',kind:'oral',t:'L\'égalité hommes-femmes au travail est-elle atteinte ?'}
];
