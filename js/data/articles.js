/* =========================================================================
   DILITECH — conseils d'achat & actualités
   -------------------------------------------------------------------------
   Le cahier des charges demande des « articles de conseils d'achat ». C'est
   aussi le meilleur support du positionnement Dilitech : vendre une solution
   adaptée plutôt qu'un produit. Chaque article se termine donc par une
   recommandation qui pointe vers des références réelles du catalogue
   (`produits: [...]` = identifiants DT-…, résolus à l'affichage).

   `corps` est un tableau de blocs : { t: 'p' | 'h' | 'liste' | 'note', ... }
   — volontairement pas de HTML brut, pour que le futur back-office puisse
   éditer un article sans risque d'injection.
   ========================================================================= */

export const ARTICLES = [
  {
    slug: 'choisir-portable-2026',
    titre: 'Quel ordinateur portable choisir en 2026 ?',
    chapo: "Quatre questions suffisent à cadrer un achat. Ni la marque ni le prix affiché ne sont la première d'entre elles.",
    categorie: 'Conseil d’achat',
    date: '2026-08-18',
    lecture: 6,
    illus: 'portable',
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
    categorie: 'Maintenance',
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
    categorie: 'Entreprise',
    date: '2026-07-21',
    lecture: 7,
    illus: 'switch',
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
    categorie: 'Conseil d’achat',
    date: '2026-07-07',
    lecture: 4,
    illus: 'ultrabook',
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
    categorie: 'Sécurité',
    date: '2026-06-16',
    lecture: 5,
    illus: 'stockage',
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
    categorie: 'Réseau',
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

export const parSlug = (slug) => ARTICLES.find((a) => a.slug === slug) ?? null;

/** Date lisible : « 18 août 2026 ». */
const df = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
export const dateLisible = (iso) => df.format(new Date(`${iso}T12:00:00`));
