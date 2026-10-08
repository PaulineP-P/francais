/* Аудирование: тексты озвучиваются голосом браузера (TTS). Формат DELF B2 — QCM, 3 варианта.
   «a» — индекс правильного ответа (0,1,2). Реплики диалога — строки «Имя: текст». */
window.LISTENINGS = [
{id:'l01',lvl:'A2',title:'Réservation d\'un restaurant',kind:'Диалог',
text:`Employé : Restaurant Le Marronnier, bonjour.
Cliente : Bonjour, je voudrais réserver une table pour quatre personnes, samedi soir.
Employé : Samedi, d'accord. À quelle heure ?
Cliente : Vers vingt heures, si c'est possible.
Employé : Je suis désolé, à vingt heures nous sommes complets. Mais j'ai une table à dix-neuf heures trente ou à vingt et une heures.
Cliente : Dix-neuf heures trente, ça va très bien. Au nom de Morel.
Employé : Parfait. Une table pour quatre, au nom de Morel, samedi à dix-neuf heures trente.`,
q:[{q:'Pour combien de personnes la cliente réserve-t-elle ?',o:['Pour deux','Pour quatre','Pour six'],a:1,why:'«une table pour quatre personnes».'},
{q:'Pourquoi la cliente ne peut-elle pas avoir 20 h ?',o:['Le restaurant est fermé','Il n\'y a plus de place','Elle n\'a pas réservé à temps'],a:1,why:'«à vingt heures nous sommes complets».'},
{q:'Quelle heure est finalement choisie ?',o:['19 h 30','20 h','21 h'],a:0,why:'«Dix-neuf heures trente, ça va très bien».'}]},

{id:'l02',lvl:'A2',title:'Message du médecin',kind:'Message',
text:`Bonjour, ici le cabinet du docteur Lambert. Votre rendez-vous de jeudi quinze heures est reporté à vendredi à dix heures, car le docteur est en formation. Si cet horaire ne vous convient pas, appelez-nous au zéro un, quarante-deux, quinze, soixante-dix, vingt-trois, avant mercredi midi. Merci de votre compréhension.`,
q:[{q:'Pourquoi le rendez-vous est-il déplacé ?',o:['Le docteur est malade','Le docteur suit une formation','Le cabinet est fermé'],a:1,why:'«car le docteur est en formation».'},
{q:'Quand a lieu le nouveau rendez-vous ?',o:['Jeudi à 15 h','Vendredi à 10 h','Mercredi à midi'],a:1,why:'«reporté à vendredi à dix heures».'},
{q:'Jusqu\'à quand peut-on appeler ?',o:['Mercredi midi','Jeudi 15 h','Vendredi 10 h'],a:0,why:'«avant mercredi midi».'}]},

{id:'l03',lvl:'B1',title:'Un nouveau mode de transport',kind:'Info radio',
text:`Depuis lundi, les habitants de Lyon peuvent utiliser un nouveau service de vélos électriques en libre-service. Quatre cents vélos sont disponibles dans une trentaine de stations. Le prix est de un euro pour trente minutes. La mairie espère ainsi réduire la circulation dans le centre-ville. Toutefois, certains commerçants s'inquiètent : selon eux, la suppression de places de parking pourrait faire baisser leurs ventes.`,
q:[{q:'Que propose la ville de Lyon ?',o:['Des vélos électriques','Des trottinettes','Des bus gratuits'],a:0,why:'«vélos électriques en libre-service».'},
{q:'Quel est l\'objectif de la mairie ?',o:['Gagner de l\'argent','Réduire la circulation','Développer le tourisme'],a:1,why:'«réduire la circulation dans le centre-ville».'},
{q:'Que craignent les commerçants ?',o:['Moins de clients à cause du manque de parking','Des vols de vélos','Du bruit dans les rues'],a:0,why:'«la suppression de places de parking pourrait faire baisser leurs ventes».'}]},

{id:'l04',lvl:'B1',title:'Interview : le télétravail',kind:'Interview',
text:`Journaliste : Julie, vous travaillez à distance trois jours par semaine. Qu'est-ce qui a changé dans votre vie ?
Julie : Beaucoup de choses. Je gagne deux heures par jour qui étaient perdues dans les transports. Je peux aussi organiser mon travail plus librement.
Journaliste : Y a-t-il des inconvénients ?
Julie : Oui. Au début, je me sentais un peu isolée. Je n'avais plus de contact spontané avec mes collègues. Maintenant, nous organisons un déjeuner d'équipe chaque vendredi, et cela aide beaucoup.
Journaliste : Recommanderiez-vous le télétravail à tout le monde ?
Julie : Pas forcément. Il faut de la discipline, et un espace de travail calme. Ce n'est pas adapté à tous les métiers ni à toutes les personnalités.`,
q:[{q:'Quel est le principal avantage cité par Julie ?',o:['Un meilleur salaire','Du temps gagné sur les trajets','Moins de réunions'],a:1,why:'«je gagne deux heures par jour... dans les transports».'},
{q:'Quel problème a-t-elle rencontré au début ?',o:['Un manque de matériel','Un sentiment d\'isolement','Un excès de travail'],a:1,why:'«je me sentais un peu isolée».'},
{q:'Que pense-t-elle du télétravail pour tous ?',o:['Il convient à tout le monde','Il ne convient pas à tout le monde','Il devrait être obligatoire'],a:1,why:'«Pas forcément... pas adapté à tous».'}]},

{id:'l05',lvl:'B1',title:'La Fête de la musique',kind:'Info radio',
text:`Chaque année, le vingt et un juin, la France célèbre la Fête de la musique. Cette fête a été créée en 1982 et elle est désormais organisée dans plus de cent pays. Le principe est simple : tout le monde peut jouer ou chanter dans la rue, gratuitement, et les concerts sont ouverts à tous. Les organisateurs veulent ainsi montrer que la musique n'est pas réservée aux professionnels.`,
q:[{q:'Quand a lieu la Fête de la musique ?',o:['Le 21 juin','Le 14 juillet','Le 1er mai'],a:0,why:'«le vingt et un juin».'},
{q:'Quel est le principe de la fête ?',o:['Des concerts payants','Une musique ouverte à tous','Un concours entre professionnels'],a:1,why:'«tout le monde peut jouer... gratuitement».'},
{q:'Où est-elle célébrée aujourd\'hui ?',o:['Seulement en France','Dans une dizaine de pays','Dans plus de cent pays'],a:2,why:'«organisée dans plus de cent pays».'}]},

{id:'l06',lvl:'B1',title:'Offre d\'emploi',kind:'Annonce',
text:`Notre entreprise de logiciels recherche un chargé de communication. Vous êtes à l'aise à l'écrit comme à l'oral, vous connaissez les réseaux sociaux et vous parlez anglais couramment. Le poste est basé à Nantes, avec la possibilité de travailler deux jours à domicile. Le contrat est un CDI, avec un salaire selon expérience. Pour postuler, envoyez votre CV avant le quinze du mois.`,
q:[{q:'Quel poste est proposé ?',o:['Développeur','Chargé de communication','Directeur commercial'],a:1,why:'«recherche un chargé de communication».'},
{q:'Qu\'est-ce qui est possible pour ce poste ?',o:['Travailler deux jours à domicile','Travailler à l\'étranger','Choisir ses horaires librement'],a:0,why:'«deux jours à domicile».'},
{q:'Jusqu\'à quand peut-on candidater ?',o:['Jusqu\'au 5','Jusqu\'au 15','Jusqu\'à la fin du mois'],a:1,why:'«avant le quinze du mois».'}]},

{id:'l07',lvl:'B2',title:'Débat : la semaine de quatre jours',kind:'Débat',
text:`Animatrice : Plusieurs entreprises testent la semaine de quatre jours. Marc, vous êtes plutôt pour ?
Marc : Oui, car les expériences montrent que les salariés sont plus motivés et moins stressés. La productivité, elle, ne baisse pas forcément : on travaille de manière plus concentrée.
Animatrice : Sophie, vous n'êtes pas d'accord ?
Sophie : Je suis partagée. Pour des bureaux, pourquoi pas. Mais dans les hôpitaux ou les magasins, il faut quelqu'un cinq ou six jours par semaine. Réduire le temps de travail obligerait à embaucher, ce qui coûterait cher. Et puis, certains salariés doivent travailler plus longtemps chaque jour pour compenser, ce qui est fatigant.
Marc : C'est vrai que ce n'est pas une solution universelle, mais on peut l'adapter.
Sophie : Adapter, oui, à condition de ne pas oublier ceux qui ne peuvent pas en profiter.`,
q:[{q:'Quel argument Marc avance-t-il en faveur de la semaine de quatre jours ?',o:['Elle augmente les salaires','Les salariés sont plus motivés','Elle crée de nouveaux emplois'],a:1,why:'«plus motivés et moins stressés».'},
{q:'Quelle est la position de Sophie ?',o:['Totalement contre','Nuancée','Totalement pour'],a:1,why:'«Je suis partagée».'},
{q:'Quel problème Sophie mentionne-t-elle pour les hôpitaux et les magasins ?',o:['Ils sont trop petits','Il faut une présence presque tous les jours','Ils n\'ont pas d\'ordinateurs'],a:1,why:'«il faut quelqu\'un cinq ou six jours par semaine».'},
{q:'Sur quoi les deux interlocuteurs s\'accordent-ils finalement ?',o:['La mesure doit être adaptée','La mesure doit être abandonnée','La mesure est parfaite'],a:0,why:'«Adapter, oui, à condition de…»'}]},

{id:'l08',lvl:'B2',title:'Reportage : le tri des déchets',kind:'Reportage',
text:`À Besançon, la ville a décidé de réduire ses déchets en changeant son système de tarification. Désormais, chaque foyer paie en fonction du poids de ses ordures non triées. Résultat : en deux ans, la quantité de déchets ménagers a diminué d'un tiers et le recyclage a nettement augmenté. Certains habitants se plaignent pourtant d'une mesure qu'ils jugent contraignante. D'autres soulignent qu'elle les a poussés à mieux consommer, par exemple en achetant moins d'emballages. La municipalité reconnaît que le dispositif demande un effort d'information, notamment auprès des personnes âgées, mais elle compte l'étendre à d'autres quartiers dès l'année prochaine.`,
q:[{q:'Comment la ville a-t-elle changé le système ?',o:['En supprimant les poubelles','En faisant payer selon le poids des déchets non triés','En offrant des composteurs'],a:1,why:'«paie en fonction du poids de ses ordures non triées».'},
{q:'Quel est le résultat après deux ans ?',o:['Les déchets ont diminué d\'un tiers','Les déchets ont doublé','Rien n\'a changé'],a:0,why:'«diminué d\'un tiers».'},
{q:'Que reproche une partie des habitants à la mesure ?',o:['Elle est trop chère pour la ville','Elle est contraignante','Elle est mal connue'],a:1,why:'«jugent contraignante».'},
{q:'Que veut faire la municipalité ?',o:['Abandonner le dispositif','Le limiter aux personnes âgées','L\'étendre à d\'autres quartiers'],a:2,why:'«compte l\'étendre à d\'autres quartiers».'}]},

{id:'l09',lvl:'B2',title:'Les jeunes et l\'information',kind:'Chronique',
text:`Selon une étude récente, plus de la moitié des jeunes de quinze à vingt-quatre ans s'informent principalement par les réseaux sociaux. Cette habitude pose un problème : les algorithmes montrent surtout ce qui plaît, pas forcément ce qui est exact. Pourtant, les jeunes ne sont pas naïfs. Beaucoup disent vérifier une information avant de la partager, et certains suivent même des comptes de journalistes. Les enseignants souhaiteraient que l'éducation aux médias soit renforcée dès le collège. Selon eux, apprendre à reconnaître une source fiable est devenu aussi essentiel que savoir lire.`,
q:[{q:'Par quel moyen la majorité des jeunes s\'informent-ils ?',o:['La télévision','Les réseaux sociaux','Les journaux papier'],a:1,why:'«principalement par les réseaux sociaux».'},
{q:'Quel risque est mentionné ?',o:['Les informations sont trop longues','Les algorithmes privilégient ce qui plaît','Les jeunes ne lisent plus'],a:1,why:'«montrent surtout ce qui plaît, pas forcément ce qui est exact».'},
{q:'Que fait une partie des jeunes selon l\'étude ?',o:['Ils partagent sans réfléchir','Ils vérifient les informations','Ils évitent l\'actualité'],a:1,why:'«vérifier une information avant de la partager».'},
{q:'Que demandent les enseignants ?',o:['Interdire les réseaux','Renforcer l\'éducation aux médias','Supprimer les écrans'],a:1,why:'«l\'éducation aux médias soit renforcée».'}]},

{id:'l10',lvl:'B2',title:'Incendies de forêt : prévenir',kind:'Info radio',
text:`Alors que l'été approche, les autorités appellent à la vigilance face aux incendies de forêt. Chaque année, la majorité des départs de feu sont d'origine humaine : mégots, barbecues, travaux agricoles. Les pompiers rappellent qu'il est interdit de faire du feu dans les zones boisées en période de sécheresse. Par ailleurs, les propriétaires de maisons proches des forêts doivent débroussailler un périmètre autour de leur habitation. Ce travail, appelé obligation légale de débroussaillement, peut sauver des vies. En cas de fumée suspecte, il faut immédiatement appeler le dix-huit.`,
q:[{q:'Quelle est l\'origine de la majorité des incendies ?',o:['La foudre','Les activités humaines','Les volcans'],a:1,why:'«la majorité des départs de feu sont d\'origine humaine».'},
{q:'Que doivent faire les propriétaires de maisons proches des forêts ?',o:['Quitter leur logement','Débroussailler autour de leur maison','Installer des alarmes'],a:1,why:'«débroussailler un périmètre».'},
{q:'Que faire en cas de fumée suspecte ?',o:['Éteindre soi-même','Appeler le 18','Attendre l\'arrivée de la police'],a:1,why:'«appeler le dix-huit».'}]},

{id:'l11',lvl:'B2',title:'Table ronde : l\'IA à l\'université',kind:'Débat',
text:`Modératrice : L'intelligence artificielle est désormais accessible à tous les étudiants. Professeur Girard, comment réagissez-vous ?
Professeur Girard : Avec prudence. Ces outils peuvent aider à reformuler ou à comprendre un texte difficile. Mais lorsqu'un étudiant leur confie la rédaction, il ne développe plus ses propres compétences.
Étudiante : Je ne suis pas tout à fait d'accord. Moi, je m'en sers comme d'un dictionnaire amélioré. Cela me fait gagner du temps pour des tâches répétitives.
Professeur Girard : Oui, mais le risque, c'est l'illusion de maîtrise. On croit savoir, et pourtant, au moment de l'examen, on se retrouve seul.
Modératrice : Que proposez-vous ?
Professeur Girard : Des règles claires : autoriser l'IA pour certaines étapes, l'interdire pour d'autres, et surtout évaluer davantage à l'oral.`,
q:[{q:'Quelle est l\'attitude du professeur Girard ?',o:['Enthousiaste','Prudente','Hostile'],a:1,why:'«Avec prudence».'},
{q:'Pour quoi l\'étudiante utilise-t-elle l\'IA ?',o:['Pour tout écrire à sa place','Comme un dictionnaire amélioré','Pour tricher aux examens'],a:1,why:'«un dictionnaire amélioré».'},
{q:'Quel risque le professeur souligne-t-il ?',o:['Le coût des outils','L\'illusion de maîtrise','Le manque d\'ordinateurs'],a:1,why:'«l\'illusion de maîtrise».'},
{q:'Que propose-t-il ?',o:['Interdire l\'IA partout','Fixer des règles et davantage d\'évaluation orale','Laisser les étudiants libres'],a:1,why:'«règles claires... évaluer davantage à l\'oral».'}]},

{id:'l12',lvl:'B2',title:'Le prix du billet de train',kind:'Info courte',
text:`La compagnie ferroviaire annonce une hausse moyenne de trois pour cent du prix des billets à partir du mois prochain. Elle justifie cette décision par l'augmentation du coût de l'énergie. En revanche, les abonnements mensuels resteront inchangés, afin de ne pas pénaliser ceux qui voyagent tous les jours. Les associations d'usagers jugent cette hausse prématurée et demandent plus de ponctualité avant toute augmentation.`,
q:[{q:'Comment la compagnie explique-t-elle la hausse ?',o:['Par la hausse du coût de l\'énergie','Par des travaux','Par une baisse du nombre de voyageurs'],a:0,why:'«l\'augmentation du coût de l\'énergie».'},
{q:'Qu\'est-ce qui ne change pas ?',o:['Les billets à l\'unité','Les abonnements mensuels','Les horaires'],a:1,why:'«les abonnements mensuels resteront inchangés».'},
{q:'Que demandent les associations d\'usagers ?',o:['Plus de ponctualité','Des tarifs plus élevés','La fin des abonnements'],a:0,why:'«demandent plus de ponctualité».'}]},

{id:'l13',lvl:'B2',title:'Ma ville idéale',kind:'Témoignage',
text:`Pour moi, la ville idéale ressemblerait à une ville moyenne, ni trop grande, ni trop petite. J'y retrouverais l'essentiel : des transports en commun fiables, des espaces verts, une bibliothèque et quelques cafés où l'on peut travailler. J'ai vécu dix ans à Paris, et même si j'ai adoré l'énergie de la capitale, j'étais fatiguée par le bruit et par les loyers très élevés. Aujourd'hui, j'habite à Nantes. Je vais au travail à vélo, ce qui me donne l'impression de mieux respirer. Si je devais conseiller quelqu'un, je lui dirais de choisir une ville où l'on peut tout faire sans voiture.`,
q:[{q:'Quelle taille de ville la narratrice préfère-t-elle ?',o:['Une très grande ville','Une ville moyenne','Un village'],a:1,why:'«ville moyenne».'},
{q:'Qu\'est-ce qui la fatiguait à Paris ?',o:['Le climat','Le bruit et les loyers','Le manque de travail'],a:1,why:'«fatiguée par le bruit et par les loyers».'},
{q:'Comment va-t-elle travailler aujourd\'hui ?',o:['En voiture','En métro','À vélo'],a:2,why:'«Je vais au travail à vélo».'}]},

{id:'l14',lvl:'B2',title:'Alerte pollution',kind:'Message',
text:`Attention, un épisode de pollution à l'ozone est prévu demain dans l'agglomération. Les personnes sensibles, comme les enfants, les personnes âgées et les asthmatiques, sont invitées à éviter les efforts physiques intenses en extérieur. La circulation différenciée sera appliquée : seuls les véhicules les moins polluants pourront circuler dans le centre. Les transports en commun seront gratuits toute la journée. Les autorités rappellent que le covoiturage reste la meilleure façon de réduire la pollution.`,
q:[{q:'Quel polluant est mentionné ?',o:['L\'ozone','Les particules fines','Le plomb'],a:0,why:'«pollution à l\'ozone».'},
{q:'Que recommande-t-on aux personnes sensibles ?',o:['Rester au lit','Éviter les efforts intenses dehors','Porter un masque en toute circonstance'],a:1,why:'«éviter les efforts physiques intenses en extérieur».'},
{q:'Qu\'est-ce qui est gratuit demain ?',o:['Le parking','Les transports en commun','Le covoiturage'],a:1,why:'«Les transports en commun seront gratuits».'}]},

{id:'l15',lvl:'B2',title:'Conférence : le plastique dans l\'océan',kind:'Conférence',
text:`Mesdames et Messieurs, chaque minute, l'équivalent d'un camion de déchets plastiques finit dans l'océan. Ce plastique se fragmente en microparticules, qui sont ensuite absorbées par les poissons, puis par nous. On ne connaît pas encore tous les effets sur la santé, mais plusieurs études suggèrent une accumulation dans l'organisme. Face à cela, deux stratégies existent : nettoyer ce qui est déjà dans la mer, ou empêcher le plastique d'y arriver. Les chercheurs sont unanimes : la seconde est bien plus efficace. Cela passe par la réduction des emballages, une meilleure collecte des déchets et le développement de matériaux biodégradables.`,
q:[{q:'Que deviennent les plastiques dans l\'océan ?',o:['Ils disparaissent','Ils se fragmentent en microparticules','Ils se transforment en sable'],a:1,why:'«se fragmente en microparticules».'},
{q:'Que dit-on des effets sur la santé ?',o:['Ils sont totalement connus','Ils ne sont pas encore tous connus','Ils sont inexistants'],a:1,why:'«On ne connaît pas encore tous les effets».'},
{q:'Quelle stratégie les chercheurs jugent-ils la plus efficace ?',o:['Nettoyer l\'océan','Empêcher le plastique d\'y arriver','Interdire la pêche'],a:1,why:'«la seconde est bien plus efficace».'},
{q:'Que doit-on développer ?',o:['Des matériaux biodégradables','Des bateaux plus grands','Des usines de plastique'],a:0,why:'«matériaux biodégradables».'}]},

{id:'l16',lvl:'B2',title:'Lettre d\'un lecteur',kind:'Lecture',
text:`Je me permets de vous écrire à propos de votre article sur la réduction de la vitesse en ville. Vous affirmez que cette mesure fait perdre du temps aux conducteurs. Or, selon plusieurs études, la vitesse moyenne en ville varie peu, car la circulation est de toute façon ralentie par les feux. En revanche, le nombre d'accidents graves diminue nettement. Ne devrait-on pas considérer ce bénéfice avant de parler de perte de temps ? Je suis conducteur moi-même, et j'avoue que mon avis a changé depuis que mon fils va à l'école à vélo.`,
q:[{q:'Quel est le sujet de l\'article critiqué ?',o:['La réduction de la vitesse en ville','L\'interdiction des voitures','Le prix de l\'essence'],a:0,why:'«la réduction de la vitesse en ville».'},
{q:'Selon l\'auteur, que se passe-t-il pour la vitesse moyenne ?',o:['Elle baisse beaucoup','Elle varie peu','Elle augmente'],a:1,why:'«varie peu».'},
{q:'Qu\'est-ce qui a changé l\'opinion de l\'auteur ?',o:['Un accident','Son fils qui va à l\'école à vélo','Un article scientifique'],a:1,why:'«depuis que mon fils va à l\'école à vélo».'}]}
];
