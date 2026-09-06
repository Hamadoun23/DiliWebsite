/* =========================================================================
   DILITECH — catalogue numérique : SOURCE UNIQUE DE VÉRITÉ
   -------------------------------------------------------------------------
   Tout ce que le site affiche de commercial vient d'ici : la grille du
   catalogue, les fiches produits, la recherche, les filtres, les compteurs
   de la page d'accueil, les promotions.

   PHASE 2 — ce fichier a vocation à être remplacé par un appel API au
   logiciel de gestion (`GET /api/catalogue`). Le reste du code ne lit jamais
   ce tableau directement : il passe par js/core/catalogue.js. Le jour de la
   bascule, seule la fonction de chargement change ; l'objet produit garde
   exactement la même forme, `dispo` compris.

   ⚠ Les références DT-… sont générées EN FIN DE FICHIER, dans l'ordre du
   tableau. Insérer un produit au milieu décale toutes les suivantes :
   ajouter plutôt en fin de bloc de sous-catégorie.
   ========================================================================= */

/* --- taxonomie ------------------------------------------------------- */

export const CATEGORIES = [
  {
    code: 'ordinateurs', nom: 'Ordinateurs', illus: 'portable',
    accroche: "Portables et postes fixes, neufs ou reconditionnés garantis, choisis pour l'usage réel du poste.",
    sous: [
      { code: 'portables-pro',      nom: 'Portables professionnels' },
      { code: 'portables-etudes',   nom: 'Portables études & bureautique' },
      { code: 'portables-creation', nom: 'Création & gaming' },
      { code: 'bureau',             nom: 'Postes fixes & stations' },
    ],
  },
  {
    code: 'accessoires', nom: 'Accessoires informatiques', illus: 'clavier',
    accroche: "Ce qui fait tenir un poste de travail au quotidien : écran, périphériques, stockage, énergie.",
    sous: [
      { code: 'peripheriques', nom: 'Souris & claviers' },
      { code: 'ecrans',        nom: 'Écrans' },
      { code: 'audio',         nom: 'Audio & visioconférence' },
      { code: 'stockage',      nom: 'Stockage & mémoire' },
      { code: 'energie',       nom: 'Énergie & protection' },
      { code: 'mobilite',      nom: 'Sacoches & mobilité' },
      { code: 'impression',    nom: 'Impression' },
    ],
  },
  {
    code: 'reseau', nom: 'Matériel réseau', illus: 'routeur',
    accroche: "Du routeur d'agence à la baie brassée : de quoi câbler un bureau entier et le garder debout.",
    sous: [
      { code: 'routeurs',          nom: 'Routeurs & passerelles' },
      { code: 'commutation',       nom: 'Switchs & commutation' },
      { code: 'wifi',              nom: 'Bornes Wi-Fi' },
      { code: 'videosurveillance', nom: 'Vidéosurveillance' },
      { code: 'cablage',           nom: 'Câblage & baies' },
    ],
  },
];

/** Les usages servent au filtre « pour quoi faire ? » — l'angle conseil du site. */
export const USAGES = [
  { code: 'bureautique',   nom: 'Bureautique',       desc: 'Word, Excel, mail, navigation.' },
  { code: 'etudes',        nom: 'Études',            desc: 'Cours, mémoire, recherche, budget serré.' },
  { code: 'professionnel', nom: 'Professionnel',     desc: 'Déplacements, autonomie, robustesse.' },
  { code: 'creation',      nom: 'Création',          desc: 'Montage, graphisme, 3D.' },
  { code: 'gaming',        nom: 'Gaming',            desc: 'Jeu, streaming, hautes performances.' },
  { code: 'entreprise',    nom: 'Parc & entreprise', desc: 'Équiper plusieurs postes, réseau, serveurs.' },
  { code: 'mobilite',      nom: 'Mobilité',          desc: 'Terrain, déplacements, autonomie.' },
];

export const ETATS = {
  neuf:          { nom: 'Neuf',          desc: 'Sous emballage constructeur.' },
  reconditionne: { nom: 'Reconditionné', desc: 'Testé, nettoyé et garanti par notre atelier.' },
};

export const TAGS = {
  promo:   { nom: 'Promotion', ton: 'promo' },
  nouveau: { nom: 'Nouveauté', ton: 'nouveau' },
  best:    { nom: 'Notre choix', ton: 'best' },
};

/* --- produits --------------------------------------------------------- */

export const PRODUITS = [

  /* ===== ORDINATEURS · portables professionnels ====================== */
  {
    cat: 'ordinateurs', sous: 'portables-pro', marque: 'HP', illus: 'ultrabook',
    img: 'assets/img/produits/ordinateurs/portables-pro/hp-elitebook-840.jpg',
    nom: 'HP EliteBook 840 G9', prix: 895000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'bureautique', 'entreprise'], tag: 'best',
    resume: "Le portable d'affaires que nous déployons le plus en parc : châssis aluminium, clavier confortable et une autonomie qui tient une journée de terrain.",
    specs: { Processeur: 'Intel Core i7-1255U', Mémoire: '16 Go DDR5', Stockage: 'SSD 512 Go NVMe',
             Écran: '14" WUXGA antireflet', Graphiques: 'Intel Iris Xe', Autonomie: "Jusqu'à 10 h",
             Connectique: '2× Thunderbolt 4, 2× USB-A, HDMI 2.0', Poids: '1,36 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 7, ABJ: 4, DKR: 3, LFW: 2, NDJ: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-pro', marque: 'Dell', illus: 'ultrabook',
    img: 'assets/img/produits/ordinateurs/portables-pro/dell-latitude.jpg',
    nom: 'Dell Latitude 5440', prix: 725000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'bureautique', 'entreprise'], tag: null,
    resume: "Le cheval de trait des flottes d'entreprise : pièces détachées faciles à trouver, station d'accueil standard, réparable des années.",
    specs: { Processeur: 'Intel Core i5-1335U', Mémoire: '16 Go DDR5', Stockage: 'SSD 512 Go NVMe',
             Écran: '14" Full HD', Graphiques: 'Intel Iris Xe', Autonomie: "Jusqu'à 9 h",
             Connectique: 'USB-C, 2× USB-A, HDMI, RJ45', Poids: '1,45 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 9, ABJ: 5, DKR: 2, CKY: 2, BGF: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-pro', marque: 'Lenovo', illus: 'ultrabook',
    img: 'assets/img/produits/ordinateurs/portables-pro/thinkpad-t14.jpg',
    nom: 'Lenovo ThinkPad T14 Gen 4', prix: 840000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'entreprise', 'mobilite'], tag: null,
    resume: "Le meilleur clavier du marché et un châssis testé militaire. À conseiller à qui écrit toute la journée et voyage beaucoup.",
    specs: { Processeur: 'AMD Ryzen 7 PRO 7840U', Mémoire: '16 Go LPDDR5', Stockage: 'SSD 1 To NVMe',
             Écran: '14" WUXGA IPS', Graphiques: 'AMD Radeon 780M', Autonomie: "Jusqu'à 12 h",
             Connectique: '2× USB-C, 2× USB-A, HDMI 2.1', Poids: '1,32 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 4, ABJ: 2, LFW: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-pro', marque: 'Apple', illus: 'ultrabook',
    img: 'assets/img/produits/ordinateurs/portables-pro/macbook-air.jpg',
    nom: 'Apple MacBook Air 13" M3', prix: 1150000, prixBarre: 1290000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'creation', 'bureautique', 'mobilite'], tag: 'promo',
    resume: "Silencieux, froid, deux jours d'autonomie réelle. Le portable de direction et de communication par excellence.",
    specs: { Processeur: 'Apple M3 (8 cœurs)', Mémoire: '16 Go unifiée', Stockage: 'SSD 512 Go',
             Écran: '13,6" Liquid Retina', Graphiques: 'GPU 10 cœurs', Autonomie: "Jusqu'à 18 h",
             Connectique: '2× Thunderbolt, MagSafe 3, jack', Poids: '1,24 kg', Système: 'macOS' },
    dispo: { BKO: 3, ABJ: 2, DKR: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-pro', marque: 'HP', illus: 'portable',
    img: 'assets/img/produits/ordinateurs/portables-pro/hp-probook.jpg',
    nom: 'HP ProBook 450 G10', prix: 585000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'bureautique', 'entreprise'], tag: null,
    resume: "Le compromis que nous recommandons pour équiper une équipe entière sans faire exploser le budget matériel.",
    specs: { Processeur: 'Intel Core i5-1335U', Mémoire: '8 Go DDR4 (extensible 32 Go)', Stockage: 'SSD 512 Go NVMe',
             Écran: '15,6" Full HD', Graphiques: 'Intel UHD', Autonomie: "Jusqu'à 8 h",
             Connectique: 'USB-C, 2× USB-A, HDMI, RJ45', Poids: '1,79 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 12, ABJ: 6, DKR: 4, CKY: 3, LFW: 2, NDJ: 2 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-pro', marque: 'Dell', illus: 'ultrabook',
    img: 'assets/img/produits/ordinateurs/portables-pro/dell-latitude.jpg',
    nom: 'Dell Latitude 7420 — reconditionné', prix: 385000, etat: 'reconditionne', garantie: '6 mois',
    usages: ['professionnel', 'bureautique'], tag: 'best',
    resume: "Passé par notre atelier : batterie remplacée, SSD neuf, système réinstallé. Le meilleur rapport qualité-prix de la boutique.",
    specs: { Processeur: 'Intel Core i7-1185G7', Mémoire: '16 Go DDR4', Stockage: 'SSD 512 Go NVMe (neuf)',
             Écran: '14" Full HD tactile', Graphiques: 'Intel Iris Xe', Autonomie: "Jusqu'à 8 h (batterie neuve)",
             Connectique: '2× Thunderbolt 4, USB-A, HDMI', Poids: '1,33 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 6, ABJ: 3, CKY: 2 },
  },

  /* ===== ORDINATEURS · portables études & bureautique ================ */
  {
    cat: 'ordinateurs', sous: 'portables-etudes', marque: 'HP', illus: 'portable',
    nom: 'HP 250 G9', prix: 315000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'bureautique'], tag: null,
    resume: "L'entrée de gamme honnête : assez de mémoire et un vrai SSD, pour que la machine reste utilisable dans trois ans.",
    specs: { Processeur: 'Intel Core i3-1215U', Mémoire: '8 Go DDR4', Stockage: 'SSD 256 Go NVMe',
             Écran: '15,6" Full HD', Graphiques: 'Intel UHD', Autonomie: "Jusqu'à 7 h",
             Connectique: 'USB-C, 2× USB-A, HDMI, RJ45', Poids: '1,74 kg', Système: 'Windows 11' },
    dispo: { BKO: 15, ABJ: 8, DKR: 5, CKY: 4, LFW: 3, NDJ: 3, BGF: 2 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-etudes', marque: 'Lenovo', illus: 'portable',
    nom: 'Lenovo IdeaPad Slim 3', prix: 285000, prixBarre: 325000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'bureautique'], tag: 'promo',
    resume: "Léger, sobre, silencieux. Le portable d'étudiant que nous vendons le plus à chaque rentrée.",
    specs: { Processeur: 'AMD Ryzen 5 7520U', Mémoire: '8 Go LPDDR5', Stockage: 'SSD 512 Go NVMe',
             Écran: '15,6" Full HD', Graphiques: 'AMD Radeon 610M', Autonomie: "Jusqu'à 9 h",
             Connectique: 'USB-C, 2× USB-A, HDMI', Poids: '1,62 kg', Système: 'Windows 11' },
    dispo: { BKO: 11, ABJ: 6, DKR: 3, LFW: 2 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-etudes', marque: 'Acer', illus: 'portable',
    nom: 'Acer Aspire 3 A315', prix: 245000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'bureautique'], tag: null,
    resume: "Le premier prix que nous acceptons de vendre : en dessous, la machine ne tient pas la charge de travail réelle d'un étudiant.",
    specs: { Processeur: 'Intel Core i3-N305', Mémoire: '8 Go LPDDR5', Stockage: 'SSD 256 Go NVMe',
             Écran: '15,6" Full HD', Graphiques: 'Intel UHD', Autonomie: "Jusqu'à 8 h",
             Connectique: 'USB-C, 2× USB-A, HDMI', Poids: '1,78 kg', Système: 'Windows 11' },
    dispo: { BKO: 18, ABJ: 9, DKR: 6, CKY: 5, NDJ: 3 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-etudes', marque: 'HP', illus: 'portable',
    img: 'assets/img/produits/ordinateurs/portables-pro/hp-elitebook-840.jpg',
    nom: 'HP EliteBook 840 G6 — reconditionné', prix: 215000, etat: 'reconditionne', garantie: '6 mois',
    usages: ['etudes', 'bureautique'], tag: 'best',
    resume: "Un châssis professionnel pour un budget d'entrée de gamme. Batterie et SSD remplacés en atelier, 6 mois de garantie Dilitech.",
    specs: { Processeur: 'Intel Core i5-8365U', Mémoire: '16 Go DDR4', Stockage: 'SSD 256 Go NVMe (neuf)',
             Écran: '14" Full HD', Graphiques: 'Intel UHD 620', Autonomie: "Jusqu'à 7 h (batterie neuve)",
             Connectique: 'USB-C, 2× USB-A, HDMI, RJ45', Poids: '1,33 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 14, ABJ: 5, CKY: 3, BGF: 2 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-etudes', marque: 'Asus', illus: 'portable',
    nom: 'Asus Vivobook 15 X1504', prix: 335000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'bureautique', 'professionnel'], tag: 'nouveau',
    resume: "Écran large et clavier avec pavé numérique : agréable pour la saisie comptable et les longues sessions de tableur.",
    specs: { Processeur: 'Intel Core i5-1235U', Mémoire: '16 Go DDR4', Stockage: 'SSD 512 Go NVMe',
             Écran: '15,6" Full HD', Graphiques: 'Intel Iris Xe', Autonomie: "Jusqu'à 8 h",
             Connectique: 'USB-C, 2× USB-A, HDMI, lecteur SD', Poids: '1,7 kg', Système: 'Windows 11' },
    dispo: { BKO: 8, ABJ: 4, DKR: 2, LFW: 2 },
  },

  /* ===== ORDINATEURS · création & gaming ============================= */
  {
    cat: 'ordinateurs', sous: 'portables-creation', marque: 'Asus', illus: 'gamer',
    nom: 'Asus TUF Gaming F15', prix: 985000, etat: 'neuf', garantie: '12 mois',
    usages: ['gaming', 'creation'], tag: null,
    resume: "La carte graphique dédiée la plus abordable de la boutique. Suffisante pour le montage 1080p et la plupart des jeux récents.",
    specs: { Processeur: 'Intel Core i7-13620H', Mémoire: '16 Go DDR5', Stockage: 'SSD 1 To NVMe',
             Écran: '15,6" Full HD 144 Hz', Graphiques: 'NVIDIA RTX 4050 6 Go', Autonomie: "Jusqu'à 5 h",
             Connectique: 'USB-C, 3× USB-A, HDMI 2.1, RJ45', Poids: '2,2 kg', Système: 'Windows 11' },
    dispo: { BKO: 5, ABJ: 3, DKR: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-creation', marque: 'Lenovo', illus: 'gamer',
    nom: 'Lenovo Legion Pro 5', prix: 1495000, etat: 'neuf', garantie: '12 mois',
    usages: ['gaming', 'creation'], tag: 'nouveau',
    resume: "Refroidissement sérieux et dalle rapide : la machine que nous conseillons aux studios de montage et aux joueurs exigeants.",
    specs: { Processeur: 'AMD Ryzen 7 7745HX', Mémoire: '32 Go DDR5', Stockage: 'SSD 1 To NVMe',
             Écran: '16" WQXGA 240 Hz', Graphiques: 'NVIDIA RTX 4070 8 Go', Autonomie: "Jusqu'à 5 h",
             Connectique: 'USB-C, 3× USB-A, HDMI 2.1, RJ45', Poids: '2,55 kg', Système: 'Windows 11' },
    dispo: { BKO: 2, ABJ: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-creation', marque: 'Apple', illus: 'ultrabook',
    img: 'assets/img/produits/ordinateurs/portables-creation/macbook-pro.jpg',
    nom: 'Apple MacBook Pro 14" M3 Pro', prix: 1890000, etat: 'neuf', garantie: '12 mois',
    usages: ['creation', 'professionnel'], tag: null,
    resume: "Pour le montage vidéo 4K et la photo : l'écran le plus juste que nous ayons en rayon, calibré d'usine.",
    specs: { Processeur: 'Apple M3 Pro (11 cœurs)', Mémoire: '18 Go unifiée', Stockage: 'SSD 512 Go',
             Écran: '14,2" Liquid Retina XDR', Graphiques: 'GPU 14 cœurs', Autonomie: "Jusqu'à 17 h",
             Connectique: '3× Thunderbolt 4, HDMI, SDXC, MagSafe', Poids: '1,61 kg', Système: 'macOS' },
    dispo: { BKO: 2, ABJ: 1 },
  },
  {
    cat: 'ordinateurs', sous: 'portables-creation', marque: 'Dell', illus: 'gamer',
    nom: 'Dell Precision 3580', prix: 1350000, etat: 'neuf', garantie: '12 mois',
    usages: ['creation', 'professionnel', 'entreprise'], tag: null,
    resume: "Station de travail mobile certifiée pour AutoCAD, ArchiCAD et QGIS. Le choix des bureaux d'études et des géomètres.",
    specs: { Processeur: 'Intel Core i7-1360P', Mémoire: '32 Go DDR5', Stockage: 'SSD 1 To NVMe',
             Écran: '15,6" Full HD', Graphiques: 'NVIDIA RTX A500 4 Go', Autonomie: "Jusqu'à 8 h",
             Connectique: '2× Thunderbolt 4, 2× USB-A, HDMI, RJ45', Poids: '1,63 kg', Système: 'Windows 11 Pro' },
    dispo: { BKO: 3, ABJ: 2, LFW: 1 },
  },

  /* ===== ORDINATEURS · postes fixes ================================== */
  {
    cat: 'ordinateurs', sous: 'bureau', marque: 'HP', illus: 'bureau',
    nom: 'HP ProDesk 400 G9 SFF', prix: 425000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'entreprise'], tag: null,
    resume: "Format compact, tient sous un guichet. Notre poste fixe standard pour les administrations et les caisses.",
    specs: { Processeur: 'Intel Core i5-12500', Mémoire: '8 Go DDR4 (extensible 64 Go)', Stockage: 'SSD 512 Go NVMe',
             Graphiques: 'Intel UHD 770', Connectique: '6× USB-A, 2× USB-C, DisplayPort, HDMI, RJ45',
             Format: 'Small Form Factor', Système: 'Windows 11 Pro' },
    dispo: { BKO: 10, ABJ: 5, DKR: 3, NDJ: 2 },
  },
  {
    cat: 'ordinateurs', sous: 'bureau', marque: 'Dell', illus: 'bureau',
    nom: 'Dell OptiPlex 7010 Tour', prix: 495000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'entreprise'], tag: null,
    resume: "Boîtier tour classique, facile à ouvrir et à faire évoluer : on y ajoute de la mémoire ou un disque sans démonter la moitié du poste.",
    specs: { Processeur: 'Intel Core i5-13500', Mémoire: '16 Go DDR5', Stockage: 'SSD 512 Go NVMe',
             Graphiques: 'Intel UHD 770', Connectique: '8× USB, DisplayPort, HDMI, RJ45',
             Format: 'Tour', Système: 'Windows 11 Pro' },
    dispo: { BKO: 7, ABJ: 4, CKY: 2 },
  },
  {
    cat: 'ordinateurs', sous: 'bureau', marque: 'Dilitech', illus: 'bureau',
    nom: 'Poste assemblé Dilitech Bureau', prix: 265000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'etudes', 'entreprise'], tag: 'best',
    resume: "Monté et testé dans notre atelier de Torokorobougou, avec des composants que nous savons remplacer sur place. La configuration s'adapte à votre budget.",
    specs: { Processeur: 'Intel Core i3-12100 (au choix)', Mémoire: '8 Go DDR4', Stockage: 'SSD 480 Go',
             Graphiques: 'Intel UHD 730', Alimentation: '450 W certifiée', Boîtier: 'Micro-ATX ventilé',
             Système: 'Windows 11 ou Ubuntu, au choix' },
    dispo: { BKO: 20 },
  },
  {
    cat: 'ordinateurs', sous: 'bureau', marque: 'Dell', illus: 'ecran',
    nom: 'Dell OptiPlex 7400 Tout-en-un 24"', prix: 720000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'entreprise'], tag: null,
    resume: "Écran et unité centrale d'un seul tenant : un seul câble sur le bureau, idéal pour les accueils et les salles de formation.",
    specs: { Processeur: 'Intel Core i5-12500', Mémoire: '16 Go DDR4', Stockage: 'SSD 512 Go NVMe',
             Écran: '23,8" Full HD IPS', Webcam: 'HD escamotable',
             Connectique: 'USB-C, 6× USB-A, HDMI, RJ45', Système: 'Windows 11 Pro' },
    dispo: { BKO: 4, ABJ: 2 },
  },

  /* ===== ACCESSOIRES · souris & claviers ============================= */
  {
    cat: 'accessoires', sous: 'peripheriques', marque: 'Logitech', illus: 'souris',
    nom: 'Logitech MX Master 3S', prix: 62000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'creation'], tag: 'best',
    resume: "La souris que nous mettons entre les mains de ceux qui passent huit heures par jour sur un tableur. Silencieuse, précise, trois appareils appairés.",
    specs: { Capteur: '8 000 DPI', Connexion: 'Bluetooth + récepteur Logi Bolt', Autonomie: '70 jours',
             Charge: 'USB-C', Boutons: '7 programmables', Compatibilité: 'Windows, macOS, Linux' },
    dispo: { BKO: 14, ABJ: 7, DKR: 4, LFW: 2 },
  },
  {
    cat: 'accessoires', sous: 'peripheriques', marque: 'Logitech', illus: 'souris',
    nom: 'Logitech M170 sans fil', prix: 8500, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'etudes'], tag: null,
    resume: "La souris d'appoint honnête : un an de pile, un nano-récepteur, rien à configurer.",
    specs: { Capteur: '1 000 DPI', Connexion: 'Sans fil 2,4 GHz', Autonomie: '12 mois (1 pile AA)',
             Boutons: '3', Compatibilité: 'Windows, macOS, Linux, ChromeOS' },
    dispo: { BKO: 60, ABJ: 30, DKR: 20, CKY: 15, LFW: 12, NDJ: 10, BGF: 8 },
  },
  {
    cat: 'accessoires', sous: 'peripheriques', marque: 'Logitech', illus: 'clavier',
    nom: 'Logitech MK270 — clavier + souris', prix: 22000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'etudes', 'entreprise'], tag: null,
    resume: "L'ensemble sans fil que nous livrons par défaut avec les postes fixes. Disposition AZERTY, pavé numérique complet.",
    specs: { Disposition: 'AZERTY français', Connexion: 'Sans fil 2,4 GHz (récepteur unique)',
             Autonomie: '24 mois clavier / 12 mois souris', Touches: 'Pavé numérique + 8 raccourcis',
             Compatibilité: 'Windows, ChromeOS' },
    dispo: { BKO: 35, ABJ: 18, DKR: 10, CKY: 8, NDJ: 6 },
  },
  {
    cat: 'accessoires', sous: 'peripheriques', marque: 'Microsoft', illus: 'clavier',
    nom: 'Microsoft Ergonomic Keyboard', prix: 48000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'professionnel'], tag: null,
    resume: "Repose-poignets intégré et courbure douce : à conseiller dès qu'un utilisateur se plaint du poignet.",
    specs: { Disposition: 'AZERTY français', Connexion: 'Filaire USB-A', Confort: 'Repose-poignets rembourré',
             Touches: 'Pavé numérique + raccourcis dédiés', Compatibilité: 'Windows, macOS' },
    dispo: { BKO: 9, ABJ: 4 },
  },

  /* ===== ACCESSOIRES · écrans ======================================== */
  {
    cat: 'accessoires', sous: 'ecrans', marque: 'Dell', illus: 'ecran',
    nom: 'Dell P2422H 24" Full HD', prix: 145000, etat: 'neuf', garantie: '24 mois',
    usages: ['bureautique', 'professionnel', 'entreprise'], tag: 'best',
    resume: "Notre écran de référence en entreprise : dalle IPS stable, pied réglable en hauteur et pivotable, garantie 24 mois.",
    specs: { Taille: '23,8"', Résolution: '1920 × 1080', Dalle: 'IPS antireflet', Fréquence: '60 Hz',
             Connectique: 'HDMI, DisplayPort, VGA, 4× USB-A',
             Ergonomie: 'Hauteur, inclinaison, pivot, rotation' },
    dispo: { BKO: 16, ABJ: 8, DKR: 5, LFW: 3, NDJ: 2 },
  },
  {
    cat: 'accessoires', sous: 'ecrans', marque: 'Samsung', illus: 'ecran',
    nom: 'Samsung ViewFinity S6 27" QHD', prix: 265000, prixBarre: 295000, etat: 'neuf', garantie: '24 mois',
    usages: ['creation', 'professionnel'], tag: 'promo',
    resume: "27 pouces en QHD : la surface de travail qui change vraiment la vie sur un tableur large ou un plan.",
    specs: { Taille: '27"', Résolution: '2560 × 1440', Dalle: 'IPS 99 % sRGB', Fréquence: '75 Hz',
             Connectique: 'USB-C 65 W, HDMI, DisplayPort, RJ45', Ergonomie: 'Hauteur, inclinaison, pivot' },
    dispo: { BKO: 6, ABJ: 3, DKR: 2 },
  },
  {
    cat: 'accessoires', sous: 'ecrans', marque: 'HP', illus: 'ecran',
    nom: 'HP V22i 22" Full HD', prix: 95000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'etudes'], tag: null,
    resume: "Le second écran à petit prix. Doubler la surface d'affichage reste l'amélioration la moins chère et la plus rentable d'un poste.",
    specs: { Taille: '21,5"', Résolution: '1920 × 1080', Dalle: 'IPS', Fréquence: '75 Hz',
             Connectique: 'HDMI, VGA', Ergonomie: 'Inclinaison' },
    dispo: { BKO: 22, ABJ: 11, DKR: 7, CKY: 5, NDJ: 4, BGF: 3 },
  },

  /* ===== ACCESSOIRES · audio & visio ================================= */
  {
    cat: 'accessoires', sous: 'audio', marque: 'Jabra', illus: 'casque',
    nom: 'Jabra Evolve2 40 SE', prix: 118000, etat: 'neuf', garantie: '24 mois',
    usages: ['professionnel', 'entreprise'], tag: null,
    resume: "Micro à réduction de bruit certifié Teams : on vous entend même dans un open space ou depuis un bureau donnant sur la rue.",
    specs: { Type: 'Casque filaire USB-A', Micro: '3 micros, réduction de bruit',
             Certification: 'Microsoft Teams', Confort: 'Mousse à mémoire de forme', Poids: '136 g' },
    dispo: { BKO: 8, ABJ: 4, DKR: 2 },
  },
  {
    cat: 'accessoires', sous: 'audio', marque: 'Logitech', illus: 'camera',
    nom: 'Logitech C920 HD Pro — webcam', prix: 58000, etat: 'neuf', garantie: '24 mois',
    usages: ['professionnel', 'bureautique', 'entreprise'], tag: 'best',
    resume: "La webcam qui règle 90 % des problèmes de visioconférence. Se pose sur un écran, se branche, fonctionne.",
    specs: { Résolution: '1080p / 30 ips', Micro: 'Stéréo intégré', Objectif: 'Verre, mise au point auto',
             Champ: '78°', Connexion: 'USB-A', Compatibilité: 'Windows, macOS, ChromeOS' },
    dispo: { BKO: 12, ABJ: 6, DKR: 3, LFW: 2, NDJ: 2 },
  },
  {
    cat: 'accessoires', sous: 'audio', marque: 'JBL', illus: 'casque',
    nom: 'JBL Tune 520BT Bluetooth', prix: 42000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'bureautique'], tag: null,
    resume: "Casque Bluetooth d'appoint, 57 heures d'autonomie : de quoi tenir la semaine entre deux charges.",
    specs: { Type: 'Casque Bluetooth 5.3', Autonomie: '57 h', Charge: 'USB-C (5 min = 3 h)',
             Micro: 'Intégré', Poids: '160 g' },
    dispo: { BKO: 18, ABJ: 8, CKY: 4, NDJ: 3 },
  },

  /* ===== ACCESSOIRES · stockage & mémoire ============================ */
  {
    cat: 'accessoires', sous: 'stockage', marque: 'Samsung', illus: 'stockage',
    nom: 'Samsung 990 EVO — SSD NVMe 1 To', prix: 82000, etat: 'neuf', garantie: '60 mois',
    usages: ['professionnel', 'creation', 'entreprise'], tag: 'best',
    resume: "Le disque que nous montons quand un poste rame : passer d'un disque mécanique à ce SSD divise le temps de démarrage par cinq.",
    specs: { Capacité: '1 To', Format: 'M.2 2280 NVMe PCIe 4.0', Lecture: "Jusqu'à 5 000 Mo/s",
             Écriture: "Jusqu'à 4 200 Mo/s", Endurance: '600 To écrits', Garantie: '5 ans constructeur' },
    dispo: { BKO: 25, ABJ: 12, DKR: 6, LFW: 4, NDJ: 3 },
  },
  {
    cat: 'accessoires', sous: 'stockage', marque: 'Seagate', illus: 'stockage',
    nom: 'Seagate Expansion 2 To — disque externe', prix: 68000, etat: 'neuf', garantie: '24 mois',
    usages: ['bureautique', 'etudes', 'professionnel'], tag: null,
    resume: "La sauvegarde la plus simple qui soit : un disque, un câble, et vos dossiers ne dépendent plus d'une seule machine.",
    specs: { Capacité: '2 To', Format: '2,5" portable', Connexion: 'USB 3.0',
             Alimentation: 'Par le port USB', Compatibilité: 'Windows, macOS (reformatage)' },
    dispo: { BKO: 20, ABJ: 10, DKR: 6, CKY: 4, BGF: 2 },
  },
  {
    cat: 'accessoires', sous: 'stockage', marque: 'Kingston', illus: 'memoire',
    nom: 'Kingston Fury 16 Go DDR4 3200', prix: 38000, etat: 'neuf', garantie: '60 mois',
    usages: ['professionnel', 'gaming', 'entreprise'], tag: null,
    resume: "Passer de 8 à 16 Go coûte peu et se ressent immédiatement dès qu'on ouvre plusieurs onglets et un tableur lourd.",
    specs: { Capacité: '16 Go (1 × 16)', Type: 'DDR4 SO-DIMM ou DIMM (à préciser)', Fréquence: '3200 MHz',
             Latence: 'CL16', Garantie: 'À vie constructeur' },
    dispo: { BKO: 30, ABJ: 14, DKR: 8, LFW: 5 },
  },
  {
    cat: 'accessoires', sous: 'stockage', marque: 'SanDisk', illus: 'stockage',
    nom: 'SanDisk Ultra 128 Go — clé USB', prix: 11000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'bureautique'], tag: null,
    resume: "Clé USB 3.0 de capacité utile : assez pour un mémoire complet, ses annexes et ses sauvegardes.",
    specs: { Capacité: '128 Go', Connexion: 'USB 3.0', Lecture: "Jusqu'à 130 Mo/s", Format: 'Rétractable' },
    dispo: { BKO: 80, ABJ: 40, DKR: 25, CKY: 20, LFW: 15, NDJ: 12, BGF: 10 },
  },

  /* ===== ACCESSOIRES · énergie ======================================= */
  {
    cat: 'accessoires', sous: 'energie', marque: 'APC', illus: 'onduleur',
    nom: 'APC Back-UPS BX650LI 650 VA', prix: 78000, etat: 'neuf', garantie: '24 mois',
    usages: ['bureautique', 'entreprise'], tag: 'best',
    resume: "Sur le réseau électrique de Bamako, c'est l'accessoire le plus rentable du catalogue : il donne le temps d'enregistrer et d'éteindre proprement.",
    specs: { Puissance: '650 VA / 325 W', Autonomie: '5 à 15 min selon la charge',
             Prises: '4 (dont 2 secourues)', Protection: 'Surtension + ligne téléphonique', Recharge: '8 h' },
    dispo: { BKO: 24, ABJ: 12, DKR: 6, CKY: 5, NDJ: 4, BGF: 3 },
  },
  {
    cat: 'accessoires', sous: 'energie', marque: 'Eaton', illus: 'onduleur',
    nom: 'Eaton 5E 1500i — onduleur rack/tour', prix: 285000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise'], tag: null,
    resume: "L'onduleur du local technique : il tient une baie complète avec switch, routeur et NAS le temps d'un arrêt propre.",
    specs: { Puissance: '1500 VA / 900 W', Autonomie: '10 à 25 min', Prises: '6 IEC',
             Supervision: 'USB + logiciel Eaton', Montage: 'Tour ou rack 1U' },
    dispo: { BKO: 5, ABJ: 3, LFW: 1 },
  },
  {
    cat: 'accessoires', sous: 'energie', marque: 'Anker', illus: 'chargeur',
    nom: 'Anker 65 W GaN — chargeur universel', prix: 34000, etat: 'neuf', garantie: '18 mois',
    usages: ['professionnel', 'etudes', 'mobilite'], tag: 'nouveau',
    resume: "Un seul chargeur pour le portable, la tablette et le téléphone. Le compagnon de déplacement à ne pas oublier.",
    specs: { Puissance: '65 W', Ports: '2× USB-C + 1× USB-A',
             Technologie: 'GaN II, Power Delivery 3.0', Format: 'Broches repliables', Poids: '112 g' },
    dispo: { BKO: 26, ABJ: 12, DKR: 7, LFW: 4 },
  },

  /* ===== ACCESSOIRES · mobilité ====================================== */
  {
    cat: 'accessoires', sous: 'mobilite', marque: 'HP', illus: 'sacoche',
    nom: 'HP Business Slim — sacoche 15,6"', prix: 26000, etat: 'neuf', garantie: '12 mois',
    usages: ['professionnel', 'etudes', 'mobilite'], tag: null,
    resume: "Compartiment matelassé, poche documents, bandoulière. Sobre, et surtout : elle protège vraiment en cas de chute.",
    specs: { Compatibilité: 'Jusqu’à 15,6"', Matière: 'Polyester renforcé',
             Poches: '3 + rangement câbles', Portage: 'Poignée, bandoulière, passant trolley' },
    dispo: { BKO: 30, ABJ: 15, DKR: 8, CKY: 6, NDJ: 5 },
  },
  {
    cat: 'accessoires', sous: 'mobilite', marque: 'Lenovo', illus: 'sacoche',
    nom: 'Lenovo Backpack B210 — sac à dos 15,6"', prix: 21000, etat: 'neuf', garantie: '12 mois',
    usages: ['etudes', 'mobilite'], tag: null,
    resume: "Le sac à dos d'étudiant : dos rembourré, deux bretelles, le poids réparti — meilleur pour le dos qu'une sacoche à l'épaule.",
    specs: { Compatibilité: 'Jusqu’à 15,6"', Matière: 'Polyester déperlant',
             Poches: '2 grandes + poche avant', Portage: 'Bretelles rembourrées' },
    dispo: { BKO: 34, ABJ: 16, DKR: 10, CKY: 8, LFW: 6, BGF: 4 },
  },
  {
    cat: 'accessoires', sous: 'mobilite', marque: 'Dell', illus: 'chargeur',
    nom: "Dell WD19S — station d'accueil USB-C 130 W", prix: 165000, etat: 'neuf', garantie: '24 mois',
    usages: ['professionnel', 'entreprise'], tag: null,
    resume: "Un seul câble sur le bureau : deux écrans, le réseau filaire, le clavier et la charge du portable partent de là.",
    specs: { Connexion: 'USB-C', Alimentation: '130 W vers le portable', Écrans: "Jusqu'à 2 × 4K",
             Ports: '3× USB-A, 2× USB-C, HDMI, 2× DisplayPort, RJ45, jack' },
    dispo: { BKO: 7, ABJ: 4, DKR: 2 },
  },

  /* ===== ACCESSOIRES · impression ==================================== */
  {
    cat: 'accessoires', sous: 'impression', marque: 'Epson', illus: 'imprimante',
    nom: 'Epson EcoTank L3260 — 3 en 1', prix: 168000, etat: 'neuf', garantie: '12 mois',
    usages: ['bureautique', 'etudes', 'entreprise'], tag: 'best',
    resume: "Réservoirs rechargeables au lieu de cartouches : la page imprimée revient à quelques francs. Notre recommandation ferme pour tout bureau qui imprime en couleur.",
    specs: { Fonctions: 'Impression, copie, numérisation', Technologie: "Jet d'encre à réservoirs",
             Vitesse: '10 ppm noir / 5 ppm couleur', Connexion: 'Wi-Fi, Wi-Fi Direct, USB',
             Rendement: "Jusqu'à 4 500 pages noir par flacon" },
    dispo: { BKO: 11, ABJ: 6, DKR: 3, CKY: 2, NDJ: 2 },
  },
  {
    cat: 'accessoires', sous: 'impression', marque: 'HP', illus: 'imprimante',
    nom: 'HP LaserJet Pro M404dn', prix: 245000, etat: 'neuf', garantie: '12 mois',
    usages: ['entreprise', 'professionnel'], tag: null,
    resume: "Laser monochrome rapide et increvable, avec recto-verso automatique et port réseau : l'imprimante de service partagée.",
    specs: { Fonctions: 'Impression seule', Technologie: 'Laser monochrome', Vitesse: '38 ppm',
             'Recto-verso': 'Automatique', Connexion: 'USB, Ethernet',
             Charge: "Jusqu'à 80 000 pages/mois" },
    dispo: { BKO: 6, ABJ: 3, LFW: 2 },
  },

  /* ===== RÉSEAU · routeurs =========================================== */
  {
    cat: 'reseau', sous: 'routeurs', marque: 'TP-Link', illus: 'routeur',
    nom: 'TP-Link Archer AX55 — Wi-Fi 6 AX3000', prix: 78000, etat: 'neuf', garantie: '24 mois',
    usages: ['bureautique', 'entreprise'], tag: 'best',
    resume: "Le routeur Wi-Fi 6 que nous installons le plus en petit bureau et en logement : il encaisse une trentaine d'appareils sans broncher.",
    specs: { Norme: 'Wi-Fi 6 (802.11ax) AX3000',
             Débit: '2402 Mb/s (5 GHz) + 574 Mb/s (2,4 GHz)',
             Ports: '1× WAN Gigabit, 4× LAN Gigabit, USB 3.0', Antennes: '4 externes',
             Fonctions: 'OFDMA, MU-MIMO, VPN, contrôle parental' },
    dispo: { BKO: 18, ABJ: 9, DKR: 5, CKY: 4, LFW: 3, NDJ: 3 },
  },
  {
    cat: 'reseau', sous: 'routeurs', marque: 'MikroTik', illus: 'routeur',
    nom: 'MikroTik hEX RB750Gr3 — routeur 5 ports', prix: 52000, etat: 'neuf', garantie: '12 mois',
    usages: ['entreprise'], tag: null,
    resume: "Le petit routeur des techniciens : RouterOS complet, VPN, pare-feu, bande passante maîtrisée — pour qui sait le configurer, et nous savons.",
    specs: { Processeur: 'Dual-core 880 MHz', Mémoire: '256 Mo', Ports: '5× Gigabit Ethernet',
             Système: 'RouterOS L4', Fonctions: 'Pare-feu, VPN, QoS, hotspot, PPPoE' },
    dispo: { BKO: 12, ABJ: 6, LFW: 2 },
  },
  {
    cat: 'reseau', sous: 'routeurs', marque: 'TP-Link', illus: 'routeur',
    nom: 'TP-Link Deco M4 — maillage Wi-Fi (lot de 3)', prix: 145000, prixBarre: 165000,
    etat: 'neuf', garantie: '24 mois',
    usages: ['bureautique', 'entreprise'], tag: 'promo',
    resume: "Pour couvrir une villa ou un plateau de bureaux sans coupure : trois bornes qui se relaient sous un seul nom de réseau.",
    specs: { Norme: 'Wi-Fi 5 AC1200 maillé', Couverture: "Jusqu'à 370 m²",
             Appareils: "Jusqu'à 100", Ports: '2× Gigabit par unité', Gestion: 'Application Deco' },
    dispo: { BKO: 9, ABJ: 5, DKR: 3 },
  },

  /* ===== RÉSEAU · commutation ======================================== */
  {
    cat: 'reseau', sous: 'commutation', marque: 'TP-Link', illus: 'switch',
    nom: 'TP-Link TL-SG1008D — switch 8 ports Gigabit', prix: 28000, etat: 'neuf', garantie: '36 mois',
    usages: ['bureautique', 'entreprise'], tag: null,
    resume: "Le switch non administrable de base : on le branche, il fonctionne. Idéal pour désengorger un petit bureau.",
    specs: { Ports: '8× Gigabit RJ45', Type: 'Non administrable', Boîtier: 'Métal, silencieux',
             Consommation: '4,5 W max', Montage: 'Bureau ou mural' },
    dispo: { BKO: 26, ABJ: 13, DKR: 8, CKY: 6, NDJ: 4, BGF: 3 },
  },
  {
    cat: 'reseau', sous: 'commutation', marque: 'Cisco', illus: 'switch',
    nom: 'Cisco CBS250-24P — switch 24 ports PoE+', prix: 685000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise'], tag: null,
    resume: "24 ports qui alimentent eux-mêmes les caméras et les bornes Wi-Fi : plus de bloc secteur à chaque point d'installation.",
    specs: { Ports: '24× Gigabit PoE+ + 4× SFP', 'Budget PoE': '195 W',
             Type: 'Administrable niveau 2+', Fonctions: 'VLAN, QoS, agrégation, supervision web',
             Montage: 'Rack 1U' },
    dispo: { BKO: 3, ABJ: 2 },
  },
  {
    cat: 'reseau', sous: 'commutation', marque: 'D-Link', illus: 'switch',
    nom: 'D-Link DGS-1016D — switch 16 ports Gigabit', prix: 72000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise', 'bureautique'], tag: null,
    resume: "Le format rack le plus abordable pour un plateau de dix à quinze postes filaires.",
    specs: { Ports: '16× Gigabit RJ45', Type: 'Non administrable', Boîtier: 'Métal rackable 1U',
             Commutation: '32 Gb/s', Montage: 'Rack 19" ou bureau' },
    dispo: { BKO: 8, ABJ: 4, LFW: 2 },
  },

  /* ===== RÉSEAU · Wi-Fi ============================================== */
  {
    cat: 'reseau', sous: 'wifi', marque: 'Ubiquiti', illus: 'borne',
    nom: 'Ubiquiti UniFi U6+ — borne Wi-Fi 6', prix: 165000, etat: 'neuf', garantie: '12 mois',
    usages: ['entreprise'], tag: 'nouveau',
    resume: "La borne plafonnier que nous posons dans les hôtels et les écoles : alimentée par le câble réseau, pilotée depuis un seul tableau de bord.",
    specs: { Norme: 'Wi-Fi 6 (802.11ax)',
             Débit: '573,5 Mb/s (2,4 GHz) + 2402 Mb/s (5 GHz)', Clients: "Jusqu'à 300",
             Alimentation: 'PoE 802.3af', Gestion: 'Contrôleur UniFi' },
    dispo: { BKO: 10, ABJ: 6, DKR: 3, LFW: 2 },
  },
  {
    cat: 'reseau', sous: 'wifi', marque: 'TP-Link', illus: 'borne',
    nom: 'TP-Link EAP225 — borne Wi-Fi Omada', prix: 82000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise', 'bureautique'], tag: null,
    resume: "L'alternative économique en Wi-Fi 5 pour un hall, une salle de réunion ou un restaurant : portail captif inclus.",
    specs: { Norme: 'Wi-Fi 5 AC1350', Débit: '867 Mb/s (5 GHz) + 450 Mb/s (2,4 GHz)',
             Clients: "Jusqu'à 100", Alimentation: 'PoE 802.3af ou adaptateur',
             Gestion: 'Contrôleur Omada' },
    dispo: { BKO: 14, ABJ: 7, CKY: 3, NDJ: 2 },
  },

  /* ===== RÉSEAU · vidéosurveillance ================================== */
  {
    cat: 'reseau', sous: 'videosurveillance', marque: 'Hikvision', illus: 'camera',
    nom: 'Hikvision DS-2CD1043G2 — caméra IP 4 MP', prix: 68000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise'], tag: null,
    resume: "Caméra extérieure 4 MP avec vision nocturne 30 m, alimentée par le câble réseau. La brique de base de nos installations.",
    specs: { Capteur: '4 MP', Objectif: '2,8 mm fixe', Vision: 'Infrarouge 30 m',
             Étanchéité: 'IP67', Alimentation: 'PoE 802.3af ou 12 V', Compression: 'H.265+' },
    dispo: { BKO: 22, ABJ: 12, DKR: 6, CKY: 4, LFW: 4, NDJ: 3 },
  },
  {
    cat: 'reseau', sous: 'videosurveillance', marque: 'Hikvision', illus: 'baie',
    nom: 'Hikvision DS-7608NI — enregistreur NVR 8 voies', prix: 195000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise'], tag: null,
    resume: "Huit caméras enregistrées et consultables à distance depuis le téléphone. Disque dur à prévoir selon la durée d'archivage voulue.",
    specs: { Voies: '8 caméras IP', Résolution: "Jusqu'à 8 MP",
             Stockage: '1 baie SATA (disque non fourni)', Réseau: '1× RJ45 Gigabit',
             Accès: 'Hik-Connect (mobile et web)' },
    dispo: { BKO: 8, ABJ: 4, DKR: 2 },
  },
  {
    cat: 'reseau', sous: 'videosurveillance', marque: 'Dahua', illus: 'camera',
    nom: 'Dahua IPC-HDW2431T — dôme IP 4 MP', prix: 62000, etat: 'neuf', garantie: '24 mois',
    usages: ['entreprise'], tag: null,
    resume: "Format dôme discret pour l'intérieur : accueil, couloir, salle des serveurs. Moins visible qu'une caméra tube.",
    specs: { Capteur: '4 MP', Objectif: '2,8 mm', Vision: 'Infrarouge 30 m', Étanchéité: 'IP67',
             Alimentation: 'PoE', Fonctions: 'Détection de mouvement, WDR 120 dB' },
    dispo: { BKO: 16, ABJ: 8, CKY: 3, BGF: 2 },
  },

  /* ===== RÉSEAU · câblage & baies ==================================== */
  {
    cat: 'reseau', sous: 'cablage', marque: 'Dilitech', illus: 'cable',
    nom: 'Câble réseau Cat 6 — au mètre', prix: 900, etat: 'neuf', garantie: null,
    usages: ['entreprise', 'bureautique'], tag: null, unite: 'le mètre',
    resume: "Câble Cat 6 cuivre vendu au mètre et serti sur place à la longueur exacte. Pas de rouleau entamé qui traîne au bureau.",
    specs: { Catégorie: 'Cat 6 U/UTP', Conducteur: 'Cuivre pur 23 AWG',
             Débit: "Jusqu'à 1 Gb/s sur 100 m", Gaine: 'LSZH',
             Sertissage: 'Inclus (RJ45 aux deux extrémités)' },
    dispo: { BKO: 2000, ABJ: 800, DKR: 500, LFW: 400 },
  },
  {
    cat: 'reseau', sous: 'cablage', marque: 'Dilitech', illus: 'baie',
    nom: 'Baie brassée 12U 600 × 600', prix: 385000, etat: 'neuf', garantie: '12 mois',
    usages: ['entreprise'], tag: null,
    resume: "Coffret mural 12U livré monté, avec panneau de brassage, passe-câbles et bandeau de prises. L'installation et le repérage des liens sont inclus à Bamako.",
    specs: { Hauteur: '12U', Dimensions: '600 × 600 mm', Porte: 'Vitrée verrouillable',
             Inclus: 'Panneau 24 ports, 2 passe-câbles, bandeau 6 prises, ventilateur',
             Charge: "Jusqu'à 60 kg" },
    dispo: { BKO: 4, ABJ: 2 },
  },
  {
    cat: 'reseau', sous: 'cablage', marque: 'TP-Link', illus: 'cable',
    nom: 'Injecteur PoE Gigabit TL-POE160S', prix: 24000, etat: 'neuf', garantie: '36 mois',
    usages: ['entreprise'], tag: null,
    resume: "Alimente une caméra ou une borne Wi-Fi par le câble réseau, sans changer de switch. Le dépannage classique d'une installation existante.",
    specs: { Norme: 'PoE+ 802.3at', Puissance: '30 W', Portée: "Jusqu'à 100 m",
             Ports: '2× Gigabit', Protection: 'Surcharge et court-circuit' },
    dispo: { BKO: 15, ABJ: 8, DKR: 4, NDJ: 3 },
  },
];

/* --- références automatiques -------------------------------------------
   DT-<CAT>-<n>, dans l'ordre du tableau. Voir l'avertissement en tête. */
const PREFIXE = { ordinateurs: 'PC', accessoires: 'AC', reseau: 'RS' };
const compteurs = Object.create(null);

for (const p of PRODUITS) {
  const pre = PREFIXE[p.cat] ?? 'XX';
  compteurs[pre] = (compteurs[pre] ?? 0) + 1;
  p.id = `DT-${pre}-${String(compteurs[pre]).padStart(3, '0')}`;
  p.img ??= null;
  p.tag ??= null;
  p.prixBarre ??= null;
  p.unite ??= null;
  /* Consolidation du stock réseau — remplacé en phase 2 par la vue temps
     réel du logiciel de gestion. */
  p.stockTotal = Object.values(p.dispo).reduce((a, b) => a + b, 0);
  Object.freeze(p.specs);
  Object.freeze(p.dispo);
  Object.freeze(p);
}

Object.freeze(PRODUITS);

/** Marques présentes, triées — alimente le filtre « marque » du catalogue. */
export const MARQUES = [...new Set(PRODUITS.map((p) => p.marque))].sort((a, b) =>
  a.localeCompare(b, 'fr')
);
