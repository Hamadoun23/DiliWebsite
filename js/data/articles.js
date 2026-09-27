/* =========================================================================
   DILITECH — conseils d'achat & actualités
   -------------------------------------------------------------------------
   Le cahier des charges demande des « articles de conseils d'achat ». C'est
   aussi le meilleur support du positionnement Dilitech : vendre une solution
   adaptée plutôt qu'un produit. Chaque article se termine donc par une
   recommandation qui pointe vers des références réelles du catalogue
   (`produits: [...]` = identifiants DT-…, résolus à l'affichage).

   `corps` est un tableau de blocs : { t: 'p' | 'h' | 'liste' | 'note' |
   'dialogue', ... } — volontairement pas de HTML brut, pour que le futur
   back-office puisse éditer un article sans risque d'injection.
   Un bloc 'dialogue' = [{ qui: 'Client' | 'Dilitech', dit: '…' }, …].

   `rubrique` classe les conseils sur conseils.html (voir RUBRIQUES).
   `citation` (facultatif) : la phrase-choc, telle qu'on la publierait sur les
   réseaux — affichée en grand sur la carte à la place du titre.
   `source` (facultatif) : { reseau: 'Facebook', url } — la publication
   d'origine ; la carte affiche « Publié sur Facebook ». Les publications
   ont été relevées sur la page Facebook de Dilitech (texte exact dans un
   bloc 'publication', suivi de notre développement).
   `format: 'texte'` : publication sans image — la carte reprend la
   phrase en grand sur fond sombre, comme sur Facebook.
   `cadrage` (facultatif) : object-position de la photo (« 50% 30% »).
   ========================================================================= */

/** Les rubriques, dans l'ordre d'affichage des filtres. */
export const RUBRIQUES = [
  { code: 'franc-parler', nom: 'Franc-parler',         desc: 'Les phrases du patron, telles qu’elles sont publiées sur nos réseaux.' },
  { code: 'idees-recues', nom: 'Idées reçues',         desc: 'Ce qu’on entend tous les jours en boutique — et ce qui est vrai.' },
  { code: 'vrai-prix',    nom: 'Le vrai prix',         desc: 'Le prix affiché, et tout ce qu’il ne dit pas.' },
  { code: 'bien-choisir', nom: 'Bien choisir',         desc: 'Les bonnes questions avant d’acheter.' },
  { code: 'en-boutique',  nom: 'En boutique',          desc: 'Les machines du moment, présentées comme au comptoir.' },
  { code: 'aupres-de-vous', nom: 'Auprès de vous',     desc: 'Nos clients, leurs projets, leurs réussites — et un peu de nous dedans.' },
  { code: 'entretien',    nom: 'Entretien & sécurité', desc: 'Faire durer la machine et protéger ce qu’il y a dedans.' },
  { code: 'entreprise',   nom: 'Entreprise & réseau',  desc: 'Équiper une équipe, câbler un bureau.' },
];

const FACEBOOK = 'https://www.facebook.com/people/Dilitech/100064903981504/';

export const ARTICLES = [
  /* ===== relevées sur la page Facebook (septembre 2026) ================ */
  {
    slug: 'je-reste-avec-toi-apres-achat',
    titre: 'Des ordinateurs fiables — et quelqu’un après l’achat',
    citation: 'Je vends des ordinateurs fiables. Et surtout : je reste avec toi après l’achat.',
    chapo: "Vendre une machine, beaucoup savent le faire. Répondre au téléphone six mois plus tard, beaucoup moins.",
    rubrique: 'franc-parler',
    format: 'texte',
    source: { reseau: 'Facebook', url: 'https://www.facebook.com/share/p/1D7ueJA5HA/' },
    date: '2026-09-27',
    lecture: 1,
    illus: 'portable',
    produits: ['DT-PC-005', 'DT-PC-006'],
    corps: [
      { t: 'publication', v: "Je vends des ordinateurs fiables.\nEt surtout : je reste avec toi après l’achat." },
      { t: 'p', v: "Deux phrases, et toute notre façon de travailler. Une machine fiable, c'est la moitié du travail. L'autre moitié commence le jour où vous repartez avec : la garantie écrite, le SAV assuré par l'équipe qui vous a vendu la machine, le conseil quand vous hésitez à ajouter de la mémoire ou à changer la batterie." },
      { t: 'note', v: "12 mois de garantie sur le neuf, 6 mois sur nos reconditionnés — et un numéro qui répond : +223 71 92 71 98." },
    ],
  },

  {
    slug: 'jusqu-a-la-remise-du-diplome',
    titre: 'Quand ton ordinateur t’accompagne jusqu’au diplôme',
    citation: 'Quand ton ordinateur t’accompagne jusqu’à la remise du diplôme…',
    chapo: "Derrière chaque projet, chaque mémoire, chaque recherche… il y a souvent un ordinateur. Félicitations à celles et ceux qui ont réussi.",
    rubrique: 'aupres-de-vous',
    source: { reseau: 'Facebook', url: FACEBOOK },
    date: '2026-09-26',
    lecture: 1,
    illus: 'portable',
    img: 'assets/img/conseils/fb-diplome.jpg',
    cadrage: '50% 50%',
    produits: ['DT-PC-008', 'DT-PC-007', 'DT-PC-010'],
    corps: [
      { t: 'publication', v: "DILITECH FOR ALL YOUR COMPUTER NEEDS 💻\nQuand ton ordinateur t’accompagne jusqu’à la remise du diplôme…\nFélicitations pour cette belle réussite ! 🎓👏🏽\nDerrière chaque projet, chaque mémoire, chaque recherche… il y a souvent un ordinateur.\nEt nous, chez DILITECH, sommes fiers d’avoir pu contribuer, même un peu, à ces parcours.\nLa prochaine réussite peut être la tienne.\nEt si tu prépares la prochaine étape de ton parcours, on est là pour t’aider à choisir la machine qu’il te faut." },
      { t: 'p', v: "Un mémoire, c'est des mois de rédaction, de recherches et de sauvegardes. La machine qui tient jusqu'au bout n'est pas forcément la plus chère : c'est celle qui a assez de mémoire, un SSD, une batterie qui tient un après-midi de bibliothèque — et quelqu'un à appeler si elle flanche la veille du dépôt." },
      { t: 'note', v: "Étudiant ? Dites-nous votre filière et votre budget : nous vous conseillons la machine qui vous mènera jusqu'au diplôme." },
    ],
  },

  {
    slug: 'winrar-vraiment-un-concept',
    titre: 'WinRAR, c’est vraiment un concept',
    citation: 'WinRAR, c’est vraiment un concept.',
    chapo: "Le logiciel te demande d’acheter une licence… Tu refuses… Et pourtant, tu continues à l’utiliser pendant des années.",
    rubrique: 'franc-parler',
    source: { reseau: 'Facebook', url: FACEBOOK },
    date: '2026-09-26',
    lecture: 1,
    illus: 'portable',
    img: 'assets/img/conseils/fb-winrar.jpg',
    cadrage: '50% 18%',
    corps: [
      { t: 'publication', v: "WinRAR, c’est vraiment un concept.\nLe logiciel te demande d’acheter une licence…\nTu refuses…\nEt pourtant, tu continues à l’utiliser pendant des années.\nQui a déjà acheté WinRAR ici ?" },
      { t: 'p', v: "On en rit — tout le monde a cliqué sur « Fermer » au moins une fois. Mais la question des licences est sérieuse sur un poste de travail : un logiciel « cracké » est la porte d'entrée préférée des virus." },
      { t: 'note', v: "Pour les archives, 7-Zip est gratuit, libre et fait la même chose. Sur les machines que nous préparons, nous installons des logiciels propres et légaux — demandez-nous la liste." },
    ],
  },

  {
    slug: 'moins-cher-pas-forcement-economie',
    titre: 'La vraie économie, c’est de bien choisir dès le départ',
    citation: 'Un ordinateur moins cher n’est pas forcément une économie.',
    chapo: "Et un ordinateur plus cher n’est pas forcément un meilleur investissement. La vraie économie, c’est de bien choisir dès le départ.",
    rubrique: 'vrai-prix',
    format: 'texte',
    source: { reseau: 'Facebook', url: FACEBOOK },
    date: '2026-09-26',
    lecture: 1,
    illus: 'portable',
    produits: ['DT-PC-005', 'DT-PC-011'],
    corps: [
      { t: 'publication', v: "Un ordinateur moins cher n’est pas forcément une économie.\nEt un ordinateur plus cher n’est pas forcément un meilleur investissement.\nLa vraie économie, c’est de bien choisir dès le départ." },
      { t: 'p', v: "Trop juste, la machine rame dès la deuxième année et il faut la remplacer. Trop puissante, vous avez payé pour une carte graphique qui ne servira jamais à Excel. Le bon achat part de l'usage : ce que vous ferez de l'ordinateur, où, et pendant combien de temps." },
    ],
  },

  {
    slug: 'thinkpad-x1-yoga-gen-7',
    titre: 'Lenovo ThinkPad X1 Yoga Gen 7 : un seul ordinateur, plusieurs façons de travailler',
    citation: 'Un seul ordinateur. Plusieurs façons de travailler.',
    chapo: "Core i7 12ᵉ génération, 32 Go de RAM, 256 Go SSD — et le meilleur : il est tactile et convertible à 360°. 380 000 FCFA.",
    rubrique: 'en-boutique',
    source: { reseau: 'Facebook', url: FACEBOOK },
    date: '2026-09-26',
    lecture: 1,
    illus: 'ultrabook',
    img: 'assets/img/conseils/fb-x1-yoga.jpg',
    cadrage: '50% 72%',
    corps: [
      { t: 'publication', v: "Un seul ordinateur. Plusieurs façons de travailler.\nLenovo ThinkPad X1 Yoga Gen 7.\nCore i7 12ᵉ génération, 32 Go de RAM et 256 Go SSD.\nEt le meilleur ? Il est tactile et convertible à 360°.\n380.000" },
      { t: 'liste', v: [
        "Mode portable pour écrire, mode tablette pour lire et annoter, mode tente pour présenter.",
        "32 Go de mémoire : de quoi garder des dizaines d'onglets et de gros fichiers ouverts sans ralentir.",
        "Un i7 de 12ᵉ génération — la génération compte plus que le « i7 », voir notre article sur le sujet.",
      ] },
      { t: 'note', v: "380 000 FCFA, selon disponibilité en boutique à Torokorobougou. Demandez-le par WhatsApp : +223 71 92 71 98." },
    ],
  },

  {
    slug: 'mauvais-ordinateur-coute-3-fois',
    titre: 'Un mauvais ordinateur coûte trois fois plus cher',
    citation: 'Un mauvais ordinateur coûte 3 fois plus cher en temps perdu qu’il n’a coûté à l’achat.',
    chapo: "Le prix d'une machine se paie une fois. Le temps qu'elle vous fait perdre se paie tous les jours.",
    rubrique: 'vrai-prix',
    source: { reseau: 'Facebook', url: FACEBOOK },
    date: '2026-09-26',
    lecture: 2,
    illus: 'portable',
    img: 'assets/img/conseils/fb-patron-temps-perdu.jpg',
    cadrage: '50% 60%',
    produits: ['DT-PC-005', 'DT-PC-002'],
    corps: [
      { t: 'publication', v: "Un mauvais ordinateur coûte 3 fois plus cher en temps perdu qu'il n'a coûté à l'achat." },
      { t: 'p', v: "Faites le calcul : dix minutes perdues par jour à attendre qu'un fichier s'ouvre, qu'un logiciel démarre, que la machine redémarre après une coupure. Sur une année de travail, cela fait plus de quarante heures — une semaine entière. Multipliée par le nombre de postes d'une entreprise, la facture dépasse vite le prix d'une bonne machine." },
      { t: 'note', v: "Un SSD et 16 Go de mémoire sont souvent la différence entre une machine qui fait perdre du temps et une machine qui en fait gagner." },
    ],
  },

  {
    slug: 'arretez-les-ordinateurs-jetables',
    titre: 'Arrêtez d’acheter des ordinateurs jetables pour vos entreprises',
    citation: 'Arrêtez d’acheter des ordinateurs jetables pour vos entreprises.',
    chapo: "Le premier prix grand public tient rarement deux ans sur un bureau qui travaille huit heures par jour.",
    rubrique: 'entreprise',
    format: 'texte',
    source: { reseau: 'Facebook', url: FACEBOOK },
    date: '2026-09-26',
    lecture: 2,
    illus: 'bureau',
    produits: ['DT-PC-002', 'DT-PC-016', 'DT-PC-006'],
    corps: [
      { t: 'publication', v: "Arrêtez d'acheter des ordinateurs jetables pour vos entreprises." },
      { t: 'p', v: "Un ordinateur d'entreprise travaille huit heures par jour, cinq jours par semaine, avec des coupures de courant. Les gammes professionnelles (Latitude, EliteBook, ThinkPad, OptiPlex) sont faites pour ça : châssis plus solides, pièces détachées disponibles des années, réparables en atelier." },
      { t: 'liste', v: [
        "Un parc homogène se gère, se répare et se remplace plus facilement.",
        "Un reconditionné professionnel vaut souvent mieux qu'un premier prix neuf au même tarif.",
        "Comptez l'onduleur et la maintenance dans le budget, pas après la première panne.",
      ] },
    ],
  },

  /* ===== articles et posts rédigés pour le site ======================== */
  {
    slug: 'i7-plus-fort-que-i5',
    titre: 'Un i7 est-il toujours plus fort qu’un i5 ?',
    citation: '« Un i7, c’est forcément plus fort qu’un i5. » Pas forcément.',
    chapo: "Le chiffre après le « i » n'est que la moitié de l'histoire. L'autre moitié, c'est la génération — et presque personne ne la regarde.",
    rubrique: 'idees-recues',
    date: '2026-09-20',
    lecture: 3,
    illus: 'portable',
    img: 'assets/img/conseils/i7-ou-i5.jpg',
    produits: ['DT-PC-005', 'DT-PC-006', 'DT-PC-002'],
    corps: [
      { t: 'p', v: "C'est la phrase que nous entendons le plus au comptoir : « Je veux un i7, pas un i5. » Nous comprenons : sur l'étiquette, 7 est plus grand que 5. Mais un processeur ne se lit pas comme une note sur 10." },
      { t: 'dialogue', v: [
        { qui: 'Client', dit: 'Je prends celui-là, c’est un i7.' },
        { qui: 'Dilitech', dit: 'Il a cinq ans. Celui d’à côté est un i5, mais il a deux ans.' },
        { qui: 'Client', dit: 'Et alors ? Un i7 reste un i7.' },
        { qui: 'Dilitech', dit: 'Allumez les deux, ouvrez les mêmes fichiers. Le i5 récent finit avant.' },
      ] },
      { t: 'h', v: 'Regardez la génération, pas seulement le « i »' },
      { t: 'p', v: "Dans « Core i5-1335U », les deux premiers chiffres après le tiret donnent la génération : 13e. Dans « Core i7-8565U », c'est la 8e. Cinq générations d'écart, c'est plus que l'écart entre un i5 et un i7 de la même année." },
      { t: 'h', v: 'Et la lettre à la fin' },
      { t: 'liste', v: [
        "U : basse consommation, fait pour l'autonomie des portables — c'est la majorité.",
        "P : un peu plus de puissance, toujours pour le portable.",
        "H ou HX : haute performance (montage, calcul, jeu), mais la batterie le sent.",
      ] },
      { t: 'note', v: "Au quotidien, 16 Go de mémoire et un SSD changent plus la vie qu'un i7 à la place d'un i5. Dites-nous ce que vous faites de la machine : nous vous dirons si l'i7 vaut vraiment la différence." },
    ],
  },

  {
    slug: 'le-carton-ne-fait-pas-le-neuf',
    titre: 'Le carton ne fait pas le neuf',
    citation: '« Je veux la machine dans son carton. » D’accord… mais vous comptez manger le carton ?',
    chapo: "Un carton scellé rassure. Il ne prouve pourtant rien : ce qui compte, c'est ce qu'il y a dedans, et qui répond si ça tombe en panne.",
    rubrique: 'idees-recues',
    date: '2026-09-12',
    lecture: 3,
    illus: 'ultrabook',
    img: 'assets/img/conseils/carton.jpg',
    produits: ['DT-PC-006', 'DT-PC-010', 'DT-PC-005'],
    corps: [
      { t: 'p', v: "Il y a des clients qui veulent un carton, coûte que coûte. Le carton passe avant la machine, avant la garantie, avant l'usage. Alors on leur pose la question, avec le sourire : vous allez manger le carton ?" },
      { t: 'p', v: "Un carton se referme, se rescelle et se réimprime. Ce n'est ni une date de fabrication, ni une garantie, ni un rapport de test. Nous voyons passer des machines « neuves dans leur carton » qui ont deux ans de stock, un clavier étranger, ou une garantie constructeur qui ne couvre pas le Mali." },
      { t: 'h', v: 'Ce qui prouve vraiment qu’une machine est bonne' },
      { t: 'liste', v: [
        "Le numéro de série, vérifiable sur le site du constructeur : date de fabrication et garantie restante.",
        "Une facture à votre nom, avec la garantie écrite dessus.",
        "Quelqu'un à Bamako qui répond au téléphone quand il y a un problème.",
        "Pour un reconditionné : le rapport de test de l'atelier (batterie, disque, écran, clavier).",
      ] },
      { t: 'note', v: "Nos reconditionnés arrivent sans leur carton d'origine — mais avec batterie et SSD remplacés, un rapport de test et 6 mois de garantie Dilitech. Entre un beau carton et une machine vérifiée, choisissez la machine." },
    ],
  },

  {
    slug: 'meme-prix-chez-qui-acheter',
    titre: 'Même prix partout : chez qui achèteriez-vous ?',
    citation: '« Si mon prix était le même que celui d’à côté, chez qui achèteriez-vous ? »',
    chapo: "Toujours moins cher, toujours plus bas. Nous posons une seule question à ceux qui négocient au franc près — et c'est souvent eux qui donnent la réponse.",
    rubrique: 'vrai-prix',
    date: '2026-09-05',
    lecture: 3,
    illus: 'portable',
    img: 'assets/img/conseils/prix-sav.jpg',
    produits: ['DT-PC-005', 'DT-PC-002'],
    corps: [
      { t: 'dialogue', v: [
        { qui: 'Client', dit: 'À côté, c’est moins cher.' },
        { qui: 'Dilitech', dit: 'Admettons que mon prix soit exactement le même que le leur. Chez qui vous achetez ?' },
        { qui: 'Client', dit: 'Chez vous.' },
        { qui: 'Dilitech', dit: 'Pourtant c’est le même prix. Pourquoi chez moi ?' },
        { qui: 'Client', dit: 'Pour le SAV. Et la qualité.' },
        { qui: 'Dilitech', dit: 'Voilà. La vraie différence, ce n’est pas le prix.' },
      ] },
      { t: 'p', v: "Un ordinateur ne coûte pas seulement ce que vous payez le jour de l'achat. Il coûte aussi le jour où il tombe en panne : les jours sans machine, le travail perdu, le technicien qu'on ne retrouve plus, la garantie que personne n'honore." },
      { t: 'h', v: 'Ce que votre prix paie chez Dilitech' },
      { t: 'liste', v: [
        "Une garantie écrite : 12 mois sur le neuf, 6 mois sur nos reconditionnés.",
        "Un SAV assuré par l'équipe qui vous a vendu la machine — pas un numéro qui ne répond pas.",
        "Un conseil avant l'achat, pour ne pas payer une machine qui ne correspond pas à votre usage.",
        "Un prêt de matériel selon disponibilité pendant une réparation.",
      ] },
      { t: 'note', v: "Nous ne serons pas toujours les moins chers. Nous serons là après la vente. Comparez les deux, pas seulement le premier." },
    ],
  },

  {
    slug: 'choisir-portable-2026',
    titre: 'Quel ordinateur portable choisir en 2026 ?',
    chapo: "Quatre questions suffisent à cadrer un achat. Ni la marque ni le prix affiché ne sont la première d'entre elles.",
    rubrique: 'bien-choisir',
    date: '2026-08-18',
    lecture: 6,
    illus: 'portable',
    img: 'assets/img/conseils/choisir-portable.jpg',
    produits: ['DT-PC-007', 'DT-PC-005', 'DT-PC-001'],
    corps: [
      { t: 'p', v: "Nous voyons passer la même scène chaque semaine au showroom de Torokorobougou : quelqu'un arrive avec un budget et un nom de marque en tête, repart avec une machine surdimensionnée pour ce qu'il en fera — ou, plus grave, sous-dimensionnée. L'ordre des questions compte." },

      { t: 'h', v: '1. Que ferez-vous de la machine, concrètement ?' },
      { t: 'p', v: "Pas « du travail » : dites les logiciels. Word, Excel et un navigateur, c'est une chose. Un tableur de 40 000 lignes, AutoCAD ou du montage vidéo, c'en est une autre, et l'écart de prix entre les deux dépasse le double. Un poste de saisie n'a besoin ni d'une carte graphique dédiée ni de 32 Go de mémoire." },

      { t: 'h', v: '2. Combien de mémoire vive ?' },
      { t: 'p', v: "C'est le critère que nous voyons le plus souvent sacrifié, et celui qui se paie le plus cher à l'usage. 8 Go est un plancher, pas un confort. 16 Go est le bon choix dès que vous gardez une dizaine d'onglets ouverts pendant qu'un tableur tourne. Au-delà, seuls la création et la virtualisation le justifient." },

      { t: 'h', v: '3. SSD, jamais de disque mécanique' },
      { t: 'p', v: "Sur une machine neuve, la question ne se pose plus. Sur un poste existant qui rame, remplacer le disque mécanique par un SSD est l'intervention la plus rentable de notre atelier : le temps de démarrage passe de deux minutes à vingt secondes, pour une fraction du prix d'un nouvel ordinateur." },

      { t: 'h', v: "4. Quelle autonomie réelle, et sur quel réseau électrique ?" },
      { t: 'p', v: "Les autonomies annoncées par les constructeurs sont mesurées en lecture vidéo, écran à mi-luminosité. Comptez 60 à 70 % de la valeur affichée en usage bureautique réel. Et si vous travaillez dans une zone à coupures fréquentes, l'autonomie du portable devient un critère de continuité d'activité, pas de confort." },

      { t: 'note', v: "Le neuf n'est pas toujours le bon calcul. Un châssis professionnel reconditionné en atelier — batterie et SSD remplacés, garantie Dilitech de 6 mois — offre souvent une meilleure machine qu'un premier prix neuf au même tarif." },

      { t: 'h', v: 'Ce que nous conseillons' },
      { t: 'liste', v: [
        "Bureautique et études : 8 à 16 Go, SSD 256 Go minimum, écran Full HD. Inutile de payer plus.",
        "Travail nomade : privilégiez le poids et l'autonomie avant la puissance brute — un châssis 14 pouces sous 1,4 kg.",
        "Création et calcul : 32 Go de mémoire et une carte graphique dédiée, sinon l'investissement est incomplet.",
        "Dans tous les cas : prévoyez la sacoche et l'onduleur dans le budget, pas après.",
      ] },
    ],
  },

  {
    slug: 'proteger-son-materiel-coupures',
    titre: 'Protéger son matériel des coupures et des surtensions',
    chapo: "Le premier ennemi d'un parc informatique à Bamako n'est ni la poussière ni les virus : c'est le réseau électrique.",
    rubrique: 'entretien',
    date: '2026-08-04',
    lecture: 5,
    illus: 'onduleur',
    produits: ['DT-AC-013', 'DT-AC-014'],
    corps: [
      { t: 'p', v: "Une coupure franche fait perdre le travail en cours. Une microcoupure répétée, ou une surtension au retour du courant, fait bien pire : elle use les alimentations, corrompt les systèmes de fichiers et finit par tuer des disques. Nous récupérons chaque mois des postes dont la panne n'a pas d'autre cause." },

      { t: 'h', v: 'Une multiprise parafoudre ne suffit pas' },
      { t: 'p', v: "Elle absorbe une pointe de tension, et c'est déjà utile. Mais elle ne fait rien contre la coupure elle-même : l'ordinateur s'éteint brutalement, en pleine écriture disque. C'est exactement le scénario qui corrompt un système." },

      { t: 'h', v: "Ce qu'un onduleur apporte réellement" },
      { t: 'p', v: "Un onduleur ne sert pas à continuer de travailler une heure. Il sert à vous donner cinq à quinze minutes : le temps d'enregistrer, de fermer proprement, d'éteindre. C'est cette poignée de minutes qui protège vos données et votre matériel." },
      { t: 'liste', v: [
        "Poste de travail seul : 650 VA suffisent largement.",
        "Poste + écran + imprimante réseau : visez 1000 VA et ne branchez jamais l'imprimante laser sur la sortie secourue — elle appelle trop de courant.",
        "Baie réseau (switch, routeur, NVR) : 1500 VA en rack, avec supervision USB.",
      ] },

      { t: 'h', v: 'Les gestes qui prolongent un parc' },
      { t: 'liste', v: [
        "Dépoussiérer les ventilations tous les six mois : en saison sèche, la poussière fait monter les températures de 15 à 20 °C.",
        "Ne jamais poser un portable en fonctionnement sur un lit ou un coussin : les ouïes d'aération sont dessous.",
        "Changer la batterie d'un portable dès qu'elle gonfle — c'est un risque, pas une gêne.",
        "Tester la batterie de l'onduleur une fois par an : elle se dégrade en silence, en trois à quatre ans.",
      ] },

      { t: 'note', v: "Notre atelier de Torokorobougou effectue le diagnostic et le nettoyage complet d'un poste, ainsi que le test de charge d'un onduleur. Passez avec le matériel, le devis est établi avant toute intervention." },
    ],
  },

  {
    slug: 'equiper-un-bureau-de-dix-postes',
    titre: 'Équiper un bureau de dix postes : la liste complète',
    chapo: "Ce qu'on oublie systématiquement dans un budget d'équipement, et ce que cela coûte de le rattraper après.",
    rubrique: 'entreprise',
    date: '2026-07-21',
    lecture: 7,
    illus: 'switch',
    img: 'assets/img/conseils/equiper-bureau.jpg',
    produits: ['DT-PC-005', 'DT-RS-004', 'DT-RS-001', 'DT-RS-012'],
    corps: [
      { t: 'p', v: "Un budget d'équipement se construit presque toujours autour des ordinateurs, et presque toujours en oubliant ce qui les relie. Résultat : le parc arrive, et il manque le réseau, les onduleurs et le câblage. Voici la liste que nous déroulons avec nos clients entreprise." },

      { t: 'h', v: '1. Les postes' },
      { t: 'p', v: "Standardisez le modèle. Dix machines identiques, c'est un seul jeu de pièces détachées, une seule image système à déployer, un seul chargeur de rechange. L'économie apparente d'acheter dix machines différentes en promotion se paie au premier dépannage." },

      { t: 'h', v: '2. Le réseau' },
      { t: 'liste', v: [
        "Un routeur capable de tenir la charge — pas la box du fournisseur d'accès, qui plafonne vers quinze appareils.",
        "Un switch avec au moins 30 % de ports libres pour les évolutions.",
        "Une borne Wi-Fi dédiée par zone : le Wi-Fi du routeur ne couvre pas un plateau.",
        "Du câble Cat 6 serti sur mesure, jamais des rallonges empilées.",
      ] },

      { t: 'h', v: '3. Ce qui est toujours oublié' },
      { t: 'liste', v: [
        "Les onduleurs — un par poste critique au minimum, plus un pour la baie.",
        "Le second écran : c'est le gain de productivité le moins cher qui existe.",
        "Les sauvegardes : un disque externe par service, et une copie hors des locaux.",
        "Les licences système et bureautique, à compter dès le départ.",
        "La baie et le repérage des câbles : sans étiquettes, chaque panne devient une enquête.",
      ] },

      { t: 'note', v: "Dilitech établit un devis global chiffré poste par poste, installe sur place à Bamako et coordonne la livraison via ses partenaires à Dakar, Abidjan, Lomé, Conakry, Bangui et N'Djaména." },
    ],
  },

  {
    slug: 'neuf-ou-reconditionne',
    titre: 'Neuf ou reconditionné : comment trancher',
    chapo: "Le reconditionné n'est pas de l'occasion. La différence tient à ce qui a été remplacé, et à qui garantit.",
    rubrique: 'bien-choisir',
    date: '2026-07-07',
    lecture: 4,
    illus: 'ultrabook',
    img: 'assets/img/conseils/neuf-ou-reconditionne.jpg',
    produits: ['DT-PC-006', 'DT-PC-010'],
    corps: [
      { t: 'p', v: "Un ordinateur d'occasion est vendu tel quel. Un ordinateur reconditionné est passé par un atelier : il a été testé, les pièces d'usure ont été remplacées, le système a été réinstallé proprement, et quelqu'un engage sa garantie dessus. Ce sont deux marchés différents, et un seul des deux est raisonnable." },

      { t: 'h', v: 'Ce que nous remplaçons systématiquement' },
      { t: 'liste', v: [
        "La batterie, quand elle est sous 80 % de sa capacité d'origine.",
        "Le disque, toujours, par un SSD neuf — c'est la pièce qui meurt et celle qui porte vos données.",
        "La pâte thermique du processeur.",
        "Les pieds, le clavier ou le pavé tactile si l'usure est visible.",
      ] },

      { t: 'h', v: 'Quand le reconditionné est le meilleur choix' },
      { t: 'p', v: "Pour un budget de 200 000 à 400 000 FCFA, un châssis professionnel reconditionné bat presque toujours un premier prix neuf : meilleur écran, meilleur clavier, plus de mémoire, une construction pensée pour cinq ans de service au lieu de deux. C'est notre recommandation la plus fréquente aux étudiants et aux jeunes indépendants." },

      { t: 'h', v: 'Quand il faut du neuf' },
      { t: 'p', v: "Dès qu'un parc doit être homogène et suivi sur trois ans, dès qu'une garantie constructeur sur site est exigée par un bailleur ou un marché public, et pour tout ce qui touche à la création ou au calcul, où les générations de processeurs comptent vraiment." },

      { t: 'note', v: "Tout reconditionné Dilitech part avec 6 mois de garantie atelier et un rapport de test remis avec la machine. Si une pièce lâche dans ce délai, nous la reprenons." },
    ],
  },

  {
    slug: 'securiser-son-poste-de-travail',
    titre: 'Sécuriser un poste de travail sans budget logiciel',
    chapo: "Cinq réglages gratuits qui écartent l'essentiel des incidents que nous traitons en SAV.",
    rubrique: 'entretien',
    date: '2026-06-16',
    lecture: 5,
    illus: 'stockage',
    img: 'assets/img/conseils/securiser-poste.jpg',
    produits: ['DT-AC-009', 'DT-AC-010'],
    corps: [
      { t: 'p', v: "La grande majorité des postes que nous récupérons infectés ou bloqués ne l'ont pas été par manque d'antivirus payant. Ils l'ont été par des réglages absents et des habitudes coûteuses." },

      { t: 'h', v: '1. Les mises à jour, activées et laissées tranquilles' },
      { t: 'p', v: "Reporter indéfiniment les mises à jour du système est le premier facteur de risque. La plupart des attaques exploitent des failles corrigées depuis des mois." },

      { t: 'h', v: '2. Un compte utilisateur, pas un compte administrateur' },
      { t: 'p', v: "Travailler en permanence avec les droits d'administrateur, c'est laisser tout programme installer ce qu'il veut. Créez un compte standard pour l'usage quotidien et gardez le compte administrateur pour les installations." },

      { t: 'h', v: '3. Le chiffrement du disque' },
      { t: 'p', v: "BitLocker sur Windows Pro, FileVault sur macOS : inclus, gratuits, à activer en trois clics. Sans lui, un portable volé livre tous ses fichiers à qui sort le disque." },

      { t: 'h', v: '4. La règle 3-2-1 pour les sauvegardes' },
      { t: 'p', v: "Trois copies de vos données, sur deux supports différents, dont une hors du bureau. Un disque externe et un espace en ligne suffisent. C'est la seule protection réelle contre un rançongiciel." },

      { t: 'h', v: '5. Se méfier des clés USB partagées' },
      { t: 'p', v: "Dans les cybercafés et les secrétariats, la clé USB reste le premier vecteur de propagation. Désactivez l'exécution automatique et analysez avant d'ouvrir." },

      { t: 'note', v: "Dilitech réalise l'audit et la remise en état d'un poste compromis, sauvegarde des données comprise avant toute réinstallation." },
    ],
  },

  {
    slug: 'wifi-qui-coupe-diagnostic',
    titre: "Le Wi-Fi coupe : le diagnostic dans l'ordre",
    chapo: "Avant de changer de matériel ou d'accuser le fournisseur d'accès, six vérifications qui règlent la plupart des cas.",
    rubrique: 'entreprise',
    date: '2026-05-28',
    lecture: 6,
    illus: 'borne',
    produits: ['DT-RS-001', 'DT-RS-003', 'DT-RS-010'],
    corps: [
      { t: 'p', v: "« Le Wi-Fi coupe » recouvre au moins quatre pannes différentes. Les traiter dans le désordre fait acheter du matériel qui ne résout rien. Voici l'ordre que suivent nos techniciens." },

      { t: 'h', v: '1. Est-ce le Wi-Fi ou la connexion ?' },
      { t: 'p', v: "Branchez un poste en filaire sur le routeur. Si la coupure persiste, le problème est chez le fournisseur d'accès ou sur le routeur, pas sur le Wi-Fi. Cette seule vérification économise beaucoup d'achats inutiles." },

      { t: 'h', v: '2. Combien d’appareils sont connectés ?' },
      { t: 'p', v: "Une box de fournisseur d'accès plafonne en pratique vers quinze à vingt appareils actifs. Au-delà, elle décroche par intermittence. C'est une limite de matériel, pas un défaut de couverture." },

      { t: 'h', v: '3. La couverture, mesurée et pas devinée' },
      { t: 'p', v: "Le Wi-Fi traverse mal le béton armé et pas du tout le métal. Relevez le signal dans chaque pièce avec une application de mesure : sous −70 dBm, la connexion devient instable quoi que vous fassiez au routeur." },

      { t: 'h', v: '4. Le canal radio' },
      { t: 'p', v: "En zone dense, une dizaine de réseaux voisins se partagent les mêmes canaux 2,4 GHz. Forcez un canal libre, et basculez sur 5 GHz tout ce qui est proche du routeur." },

      { t: 'h', v: '5. Une borne, pas un répéteur' },
      { t: 'p', v: "Un répéteur divise le débit par deux et crée un second réseau instable. Une borne dédiée reliée en câble, ou un système maillé, résout durablement ce qu'un répéteur ne fait que déplacer." },

      { t: 'h', v: '6. L’alimentation' },
      { t: 'p', v: "Un routeur qui redémarre à chaque microcoupure donne exactement la même sensation qu'un Wi-Fi défaillant. Un petit onduleur sur la baie règle la question." },

      { t: 'note', v: "Dilitech réalise le relevé de couverture sur site à Bamako et remet un plan d'implantation des bornes avant tout achat." },
    ],
  },
];

/* Tri antéchronologique : le plus récent d'abord, partout sur le site. */
ARTICLES.sort((a, b) => b.date.localeCompare(a.date));

/* `categorie` (nom lisible de la rubrique) reste disponible pour le code
   qui l'affiche. */
for (const a of ARTICLES) a.categorie = RUBRIQUES.find((r) => r.code === a.rubrique)?.nom ?? '';

export const parSlug = (slug) => ARTICLES.find((a) => a.slug === slug) ?? null;

/** Date lisible : « 18 août 2026 ». */
const df = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
export const dateLisible = (iso) => df.format(new Date(`${iso}T12:00:00`));
