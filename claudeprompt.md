# Dilitech — contexte du site

Ce fichier résume le projet et **l'historique des décisions**, pour reprendre
le travail sans relire tout le code. Il joue le même rôle que celui de
Farafinatignɛ.

## Le projet

**Phase 1 du cahier des charges** « Digitalisation de Dilitech » (Dymo Labs,
08/08/2026) : le **site vitrine** et le **catalogue numérique**.

La **phase 2** — logiciel de gestion, CRM, stocks temps réel, back-office,
déploiement VPS — **n'est pas faite** : elle a été explicitement remise à plus
tard. Voir « Ce qui reste à faire » en bas.

## Le client

**Dilitech**, entreprise informatique de **Bamako, Torokorobougou (Commune V)**.

- Activité : vente d'ordinateurs portables toutes marques, accessoires
  informatiques, matériel réseau · maintenance PC · SAV · **formations
  professionnelles**
- Téléphones : **+223 71 92 71 98** (principal, WhatsApp) et **+223 91 91 30 60**
- E-mail affiché : `contact@dilitech.ml` — **à faire confirmer par le client**,
  il n'apparaît sur aucun support fourni
- Domaine visé : `dilitech.ml` — **à faire confirmer aussi**
- Réseaux : [Facebook](https://www.facebook.com/profile.php?id=100064903981504),
  Instagram et LinkedIn `@dilitech`. **Les URL Instagram et LinkedIn sont
  déduites du pseudonyme affiché sur les visuels, pas vérifiées** : à corriger
  dans `js/config.js` si elles ne pointent pas au bon endroit.
- Réseau de partenaires revendeurs : Dakar, Abidjan, Lomé, Conakry, Bangui,
  N'Djaména

**Positionnement, à tenir partout** : *« Nous ne vendons pas un ordinateur,
nous vendons la solution qui correspond à votre besoin. »* C'est pour ça que
le filtre **« pour quel usage ? »** passe avant le filtre marque dans le
catalogue, et que chaque article de conseil se termine par des produits.

## Identité — la charte, et ce qu'on en a tiré

Source : `../Docs/CHARTE GRAPHIQUE DILITECH.pdf` (février 2025, 19 pages).

### Couleurs — relevées dans la charte, pas inventées

| Rôle | Hex | Usage |
|---|---|---|
| Bleu marine | `#302784` | couleur principale, titres, boutons pleins |
| Bleu clair | `#009FE3` | accent, innovation, moitié maigre des titres |

Deux valeurs **dérivées** parce que le bleu clair de la charte ne passe pas
partout :

| Dérivée | Hex | Pourquoi |
|---|---|---|
| `--cyan-ink` | `#00719F` | `#009FE3` sur blanc = **3,0:1**, illisible en petit. Celle-ci donne 5,0:1. C'est elle pour tous les petits labels sur fond clair. |
| `--cyan-2` | `#4FC3F0` | `#009FE3` sur le marine = 4,4:1, trop juste en petit. Celle-ci donne 6,4:1. C'est elle pour les petits labels sur fond sombre. |

**Ne jamais mettre `#009FE3` en petit texte**, ni sur blanc ni sur marine.

### Typographie

**Montserrat**, en **Bold/ExtraBold (700–800)** et **ExtraLight (200)** — c'est
la charte. Le texte courant est en 400/500 : l'ExtraLight de la charte n'est
lisible qu'en très grand.

### L'idée directrice

Le logo Dilitech est bâti sur un contraste : **« DILI » gras marine, « TECH »
très maigre bleu clair**. On en a fait **la règle typographique du site** :

```html
<h2 class="titre">Le conseil <em>avant le produit.</em></h2>
```

`.titre em` bascule en 200 et en bleu. Chaque grand titre du site est donc
coupé en deux, comme le logo. **C'est la signature — ne pas la casser.**

⚠ Piège : mettre **un espace avant le `<em>`**. Sans lui, les deux moitiés se
collent (`faire.Nous`). Deux titres avaient ce défaut, corrigés.

Deux autres reprises du logo :

1. **Le disque entre deux barres** devient le visuel du hero de l'accueil
   (`.disque`), et le séparateur `.signe-sep`.
2. **La coupe en diagonale**, présente sur tous les supports de la charte,
   ferme chaque surface sombre : `.coupe-bas`, `.coupe-haut`, `.coupe-duo`.

### Rythme des pages

blanc → brume → blanc → **ancre marine** → blanc → brume → pied marine.
**Trois ancres sombres au maximum** : au-delà elles cessent d'être des repères.

### Ce qui a été écarté

- **Les drapeaux emoji** (🇲🇱 🇸🇳 …) pour les villes du réseau : Windows ne les
  dessine pas et les affiche en deux lettres nues. Remplacés par une pastille
  de code pays dessinée (`.pdv__dr`), lisible partout.
- Les **photos produits** : le client n'en a pas fourni. Chaque famille de
  matériel a donc son **dessin au trait** (`js/data/illustrations.js`). Le jour
  où une photo arrive, renseigner `img` sur le produit suffit : la photo
  recouvre le dessin, qui reste en repli si l'image casse.

## Passe « premium » (septembre 2026)

Après la livraison initiale, le client a demandé un niveau de finition
équivalent au site événementiel **Toguna Motors**
(`EventMotors/WebsiteEvent`, thème unique noir + or, GSAP, verre dépoli,
lueurs). Décision validée avec lui : **garder le rythme clair/sombre
existant** (pas de bascule en tout-sombre — un catalogue avec beaucoup de
texte et de tableaux de specs reste plus lisible sur fond clair), et élever
la CRAFT partout — sans ajouter GSAP ni aucune dépendance, pour rester
cohérent avec le reste du site (100 % statique, modules ES natifs).

Ce qui a été repris de l'inspiration Toguna, **transposé dans les bleus de
la marque** plutôt que copié tel quel (Toguna est or/automobile, Dilitech
est bleu/tech — mélanger les deux langages aurait brouillé l'identité) :

- **Halos en dérive lente** (`.halos` / `.halo`) — des taches de lumière
  floutées animées en `transform`, pas en dégradé (coût CPU nul). Le hero de
  l'accueil en a trois ; les huit autres en-têtes de page (`.entete-page`)
  en ont une seule, plus légère, posée en pur CSS (`::before`) pour ne
  toucher aucun fichier HTML individuellement.
- **Grain** (`.grain`, classe posée sur l'élément) — bruit fractal en SVG à
  5 % d'opacité, `mix-blend-mode: overlay`. Casse l'effet « dégradé plat ».
  ⚠ Le pseudo-élément `::after` peint SOUS le contenu statique du flux
  uniquement grâce à `z-index: -1` — sans lui, en CSS, un élément positionné
  passe TOUJOURS au-dessus du flux statique, quel que soit son ordre dans le
  DOM. Le motif `.circuit` existant suit la même règle.
- **Titre chromé** (`.heros__titre em`, hero de l'accueil uniquement) —
  dégradé animé blanc/cyan qui balaie le texte, écho au « chrome shine » de
  Toguna. Volontairement **réservé au plus grand titre du site** : le rejouer
  sur chaque `<h2>` de chaque page aurait été too much.
- **Bande de preuves en verre** (`.heros__preuves`) — `backdrop-filter`,
  séparateurs verticaux entre les chiffres : le langage « fiche technique »
  de Toguna, appliqué aux trois compteurs (références / marques / villes).
- **Boutons** : reflet diagonal au survol sur `.btn` (`::before`, rogné par
  `overflow: hidden` — `.btn--devis` en a été exclu car sa pastille de
  compte déborde intentionnellement de la boîte, voir le commentaire sur
  place) ; **lueur qui suit le curseur** sur `.btn--lueur`
  (`activerLueurBoutons()` dans `js/core/ui.js`, une seule délégation sur
  `document`, jamais un écouteur par bouton). Volontairement posée sur une
  poignée de boutons par page (l'appel principal de chaque section de
  clôture) — la généraliser l'aurait banalisée.
- **Cartes** : lift + ombre teintée cyan au survol sur toutes les familles
  (`.carte`, `.univ`, `.serv`, `.art`, `.pdv`, `.filiere`), courbe
  `--ease-expo`. `.arg` (section « pourquoi », fond sombre) est passée en
  **vrai verre dépoli** (`backdrop-filter: blur`), pas un aplat translucide.
- **Cascade d'apparition automatique** — `activerReveal()` calcule le rang
  de chaque élément parmi ses frères et pose `--i` en CSS ; `.reveal` lit
  cette variable dans son `transition-delay`. Toute nouvelle grille de
  cartes se dévoile donc en cascade sans qu'aucune règle `nth-child` ne soit
  à écrire nulle part — c'était le cas avant (des règles à la main,
  seulement sur `.grille-produits`), ce n'est plus vrai depuis.
- Le hero de l'accueil a sa **propre entrée au chargement**
  (`.entre`, indépendante du système `.reveal` qui attend le défilement :
  le hero est déjà visible à l'ouverture de la page).
- **Incohérence corrigée en chemin** : le CTA de fermeture de `reseau.html`
  était resté sur fond clair alors que toutes les autres pages referment sur
  une ancre sombre avant le pied de page. Aligné sur le même motif
  (`.nuit coupe-haut sur-nuit`).

Tout respecte `prefers-reduced-motion` — la règle globale existante
(`animation-duration: .001ms !important`) neutralise aussi les halos et le
chromage sans qu'il ait fallu l'étendre.

## Historique du hero — trois refontes avant la version retenue (septembre 2026)

Le premier jet de la passe premium (dessin SVG + halos CSS) n'a pas
convaincu le client : il voulait le niveau **EventMotors/WebsiteEvent**
(`event.toguna-motors.com`), avec une vraie photo. Il a fourni trois
références Pinterest : un mockup d'écran, le jet privé « Aeroluxe », le
drone « MDR Ultra Light ». Point commun des trois : **énormément de vide,
un seul geste visuel fort, aucune texture qui parasite**, un produit qui
semble flotter dans le noir avec une lueur.

**Deuxième tentative** (conservée un temps, puis abandonnée) : la photo en
fond plein cadre avec `background-size: cover` + `background-position`, un
dégradé de lisibilité par-dessus, et le motif `.circuit` (le quadrillage de
points) laissé actif comme sur les autres sections sombres. Rejetée par le
client : le quadrillage plaqué sur une vraie photo a l'air d'un gabarit, pas
d'une mise en scène, et le cadrage `cover` « saute » selon la hauteur réelle
du hero (jamais identique en aperçu et en vrai — a demandé plusieurs allers-
retours de `background-position` déjà rien que pour la deuxième tentative).

**Troisième tentative, celle qui est restée** — `.heros--v2` :

- **Aucun `.nuit`/`.grain`/`.coupe-bas` sur cette section.** Ces classes
  habillent des aplats de dégradé ; sur une vraie photo elles font gabarit.
  Fond propre : `radial-gradient(...)` quasi noir, un seul dégradé, rien
  d'autre. (`.sur-nuit` reste posé, lui — c'est un simple modificateur de
  couleur de texte/bouton, sans effet de fond : sans lui, le bouton
  « Demander un devis » et l'eyebrow ressortaient dans leurs teintes pensées
  pour fond clair, quasi invisibles sur le nouveau fond sombre.)
- **La photo est prédécoupée en amont, pas recadrée en CSS.** Fini le
  `background-position` réglé à l'aveugle : un masque radial (alpha, fondu
  gaussien) est appliqué à la photo AVANT de l'exporter, sur les
  **quatre côtés** — la première version du masque ne dégradait que le haut
  et laissait les trois autres bords nets, ce qui créait un rectangle
  fantôme visible dès que la teinte de fond CSS ne tombait pas exactement
  sur le noir de la photo. Recette (Python/Pillow) :
  1. recadrer sur la zone utile (l'écran qui luit + le clavier, en
     laissant de la marge noire tout autour pour que le fondu ait la place
     de retomber à zéro avant le bord du cadre) ;
  2. dessiner un masque en niveaux de gris : une ellipse pleine, **strictement
     à l'intérieur** du cadre (marge visible sur les 4 côtés, jamais une
     ellipse qui déborde) ;
  3. flouter ce masque (`GaussianBlur`, rayon ≈ 15 % de la plus petite
     dimension) ;
  4. `image.putalpha(masque)`, exporter en **WebP** (garde la
     transparence, bien plus léger qu'un PNG pour ce genre de photo).
  Résultat : `assets/img/hero-laptop-flottant.webp`. En CSS, la photo n'est
  plus qu'un `<img>` posé et légèrement éclairci (`filter: saturate/
  brightness/contrast` pour la ramener des tons rose/orange natifs vers les
  bleus de la marque) — zéro dégradé de lisibilité à gérer, la photo se
  fond toute seule dans le fond.
- **Titre monumental** : `clamp(2.9rem, 7vw, 5.4rem)`, `line-height: .98`,
  sans contrainte de largeur en caractères (une tentative avec `max-width:
  14ch` cassait la phrase n'importe où — « Le bon » / « matériel, » sur deux
  lignes — au lieu de suivre le sens ; `text-wrap: balance` seul suffit).
- **Bande de preuves « nue »** (`.heros__preuves2`, nouvelle classe) : les
  mêmes chiffres que partout, mais sans le panneau de verre — juste les
  nombres et un trait fin, comme les petites étiquettes de fiche technique
  d'Aeroluxe (« Flights 6.1K · Clients 12.8K »). **Ne pas confondre** avec
  `.heros__preuves` (panneau de verre complet), toujours utilisée telle
  quelle sur `reseau.html` — les deux classes coexistent, chacune sur sa
  page, et partagent le même `.heros__preuve` pour l'item (nombre + label).
- **Sourcing de la photo** : le client a d'abord demandé de télécharger
  depuis Pinterest — refusé, un pin agrège des sources et des licences trop
  variées pour un usage client. Photo sous **licence Unsplash** à la place
  (gratuite, usage commercial explicite) : *black laptop computer turned on
  in dim light*, par **Martin Katler** (@martinkatler),
  `https://unsplash.com/photos/black-laptop-computer-turned-on-in-dim-light-o9XN28KdyN8`.
  Pas la photo d'Andras Vas (`Bd7gNnWJBkU`, *MacBook Pro turned on*) bien
  que ce soit LA référence quand on cherche « macbook dark unsplash » —
  c'est l'une des photos de stock les plus réutilisées du web (des centaines
  de templates), la reprendre aurait fait « site fait avec un template »
  plutôt que sur mesure.
- **Le portable est un MacBook — Dilitech vend toutes marques.** Assumé, pas
  oublié : le client a demandé cette imagerie explicitement. Si la question
  revient un jour, la vraie réponse est qu'aucune alternative neutre de
  cette qualité dramatique n'a été trouvée en licence libre dans le temps
  imparti. Le mieux reste que le client fournisse ses propres photos
  (showroom, un poste en vente) — voir plus bas.
- ⚠ **Piège d'environnement, toujours vrai** : le `Bash` de cet
  environnement n'a **aucun accès réseau sortant** (`curl` fait timeout sur
  tout hôte externe) — seuls `WebFetch`/`WebSearch` atteignent l'extérieur,
  et ils ne rendent que du texte, pas des octets. **`PowerShell` a un accès
  réseau normal** (`Invoke-WebRequest` fonctionne) : c'est le chemin à
  reprendre pour tout téléchargement de fichier binaire sur ce projet.
- **Aussi intégrée pendant cette passe** : une vraie photo Dilitech (pas du
  stock) dans le bloc Service après-vente de `services.html` — recadrée
  depuis un visuel de communication du client. Voir
  `assets/img/agent-sav.jpg` et le commentaire au-dessus de
  `.bloc-serv__vis--photo` dans `style.css`.
- L'ancien visuel (disque + barres du logo en SVG, orbite de pastilles de
  marques, de la toute première version du hero) a été **entièrement
  retiré** — plus utilisé nulle part ailleurs, sa CSS morte est partie avec
  lui (`.disque*`, `.orbite*`, `@keyframes tourner/flotter`), ainsi que les
  deux lignes de `js/pages/accueil.js` qui le remplissaient.

**Reste à faire si le client fournit ses propres photos** : remplacer
`assets/img/hero-laptop-flottant.webp` par un nouveau détourage (reprendre
la recette Pillow ci-dessus sur la nouvelle photo) — le CSS n'a rien à
changer, il ne fait que poser et éclaircir l'image qu'on lui donne.


## Quatrième refonte : le hero est repris directement de VP (celle qui reste)

Après la troisième tentative (photo détourée flottante ci-dessus), le client a
recadré la demande : **« récupère le code de VP et adapte-le, ne te casse pas
la tête »** — VP = `Downloads/Dilitech/WebsiteVP`, le site de la marque de
couture **Vêtement Palace** (vpofficiel.com), un autre projet Dymo Labs. Plutôt
que de continuer à deviner par itérations, la structure et le CSS du hero de
VP (`WebsiteVP/index.html` + `WebsiteVP/style.css`, classes `.hero*`,
`.cta-pill`, `.cta-link`) ont été **repris tels quels**, avec uniquement la
palette, la police et le contenu adaptés. C'est la version en place
aujourd'hui — **les trois tentatives précédentes ci-dessus sont de
l'historique, pas l'état courant.**

Ce qui a été gardé à l'identique de VP (mécanique et structure) :
- Photo plein cadre (`.hero__media img`) + double dégradé de lisibilité
  (`.hero__overlay`, radial + linéaire) ;
- **Mot fantôme en filigrane** (`.hero__ghost`) : VP affiche « Palace » en
  contour (`-webkit-text-stroke`, fond transparent) derrière le titre ;
  Dilitech affiche **« TECH »** — le demi-mot maigre du logo, cohérent avec
  la charte ;
- **Spotlight qui suit le curseur** (`.hero__spotlight`) : un halo radial
  positionné par `--mx`/`--my`, posés par un seul `mousemove` sur le hero.
  Porté dans `activerSpotlightHero()` (`js/core/ui.js`), appelé uniquement
  par `js/pages/accueil.js` (page d'accueil seulement, comme chez VP) ;
- **Pilule magnétique** (`.cta-pill`) pour l'appel principal — le fond se
  remplit au survol (`::before` qui grandit en `scaleX`), l'icône flèche
  pivote à 45° — et **lien souligné avec puce verte** (`.cta-link`,
  `.cta-link__dot` couleur `--wa`) pour l'appel secondaire ;
- Cadre inset fin (`.hero__frame`), libellé vertical en bord gauche
  (`.hero__side`, `writing-mode: vertical-rl`), pagination à points
  décorative sur le bord droit (`.hero__dots` — purement statique chez VP
  comme ici, ce n'est pas un vrai carrousel) ;
- Bande de bas de hero (`.hero__foot`) : chiffres à gauche (`.hero__stats`/
  `.hero__stat`, `b` + `span`, séparés par une bordure), réseaux sociaux à
  droite (`.hero__foot-social`).

Ce qui a été volontairement changé (pas une reprise à l'identique) :
- **Couleur** : l'or de VP (`--gold-light` #C9AD74 sur fond sombre,
  `--gold-dark` #7C6127 sur fond clair) devient le cyan Dilitech
  (`--cyan-2`, `--cyan-ink`) ; `--ink` devient `--navy-ink`.
- **Police** : VP utilise Bodoni Moda (serif italique) en display. La charte
  Dilitech impose Montserrat partout — **aucune police serif n'a été
  ajoutée**. Le titre garde donc la règle maison du site (gras marine →
  très maigre bleu clair, `.hero__title em`) plutôt que l'italique doré de
  VP : c'est le seul endroit où la reprise s'écarte du gabarit d'origine,
  et c'est délibéré (ne pas trahir la charte pour coller à VP).
- **La photo n'est pas recolorée en bleu** : contrairement aux deux
  tentatives précédentes qui essayaient de teinter la photo vers le cyan,
  ici — comme VP qui laisse le mannequin en gris désaturé et réserve l'or
  aux éléments d'interface — la photo reste **neutre** (`filter: grayscale
  brightness contrast saturate`, aucune teinte de couleur) et c'est
  l'interface (fantôme, spotlight, halos, pilule) qui porte le cyan. Plus
  simple, et ça a réglé d'un coup le problème de teinte qui demandait des
  réglages fins à chaque nouvelle photo.
- **Nav non reprise** : VP passe sa nav en `position: fixed` overlay
  transparent qui devient opaque au scroll (`.nav--overlay`, classe
  `.scrolled` en JS). La nav de Dilitech reste `position: sticky` avec son
  bandeau de coordonnées au-dessus — non touchée. Piège évité : le hero de
  VP a `padding-top: var(--nav-h)` pour compenser sa nav en overlay ; **ne
  pas copier ce padding ici**, la nav de Dilitech occupe déjà sa propre
  place dans le flux, l'ajouter pousserait le contenu deux fois. `.hero`
  utilise `min-height: calc(100vh - var(--nav-h) - var(--bandeau-h))` à la
  place.
- **Photo source** : recadrée en amont (Python/Pillow) sur un ratio large
  (~1.55:1, voir `assets/img/hero-laptop-large.jpg`) plutôt que d'utiliser
  `object-fit: cover` sur la photo verticale d'origine (2400×3600) — cover
  sur un ratio aussi éloigné du hero recadre trop fort et redevient
  sensible à la hauteur exacte de l'écran, le problème déjà rencontré à la
  tentative précédente.
- L'asset `assets/img/hero-laptop-flottant.webp` (photo détourée de la
  tentative précédente) est **supprimé**, plus référencé nulle part.

**Reste à faire si le client fournit ses propres photos** : remplacer
`assets/img/hero-laptop-large.jpg` par un nouveau recadrage large (même
ratio ~1.55:1) — le CSS n'a rien à changer, `.hero__media img` se charge du
reste (`object-fit: cover` + filtre neutre).

**À regarder si on porte d'autres pages de VP** : `WebsiteVP/claudeprompt.md`
documente toute la direction artistique (section « Direction artistique »)
et liste les pièges déjà rencontrés côté VP (ex. section retirée du HTML
sans retirer le `$("#id")` correspondant dans le JS, qui interrompt
silencieusement le reste du script) — à lire avant de reprendre autre chose
de ce site.

## Vraies photos produits, enfin (septembre 2026)

Le client a fourni un dossier `Docs/images/` avec **14 photos réelles prises
au dépôt/showroom de Torokorobougou** (Dell, Microsoft Surface, Apple
MacBook, Lenovo ThinkPad, HP — cartons, étagères, vitrine) et demandé de les
« classer dans les assets du site et les utiliser ». C'est la première fois
que de vraies photos produit sont disponibles — jusqu'ici tout le catalogue
tournait sur les dessins au trait de `js/data/illustrations.js` (voir plus
haut, section « Ce qui a été écarté »).

**Classement** (hors du dossier `site/`, qui ne doit contenir que des
assets déployés et prêts) :
- `Docs/classement/produits-stock/` — les 14 photos d'origine, renommées
  clairement (`dell-ferme.jpeg`, `thinkpad-ecran-couleur.jpeg`…).
- `Docs/classement/communication-reseaux/` — les 6 visuels de communication
  déjà repérés lors de la phase 1 (posts Facebook/Instagram), idem.

**Utilisées sur le site** — 5 correspondances marque/modèle fiables,
recadrées (Python/Pillow : crop 4:3 centré sur la machine + autocontrast +
unsharp mask léger, pour uniformiser des photos prises par téléphone dans
des conditions de lumière différentes) et posées dans
`site/assets/img/produits/` :

| Produit catalogue | Photo utilisée |
|---|---|
| HP EliteBook 840 G9 (`DT-PC-001`) | `hp-elitebook-840.jpg` — la façade ouverte, l'autocollant « ELITEBOOK » est lisible sur la coque |
| Dell Latitude 5440 (`DT-PC-002`) | `dell-latitude.jpg` — capot fermé |
| Lenovo ThinkPad T14 Gen 4 (`DT-PC-003`) | `thinkpad-t14.jpg` — ouvert, posé sur son carton |
| Apple MacBook Air 13" M3 (`DT-PC-004`) | `macbook-air.jpg` — fermé, avec chargeur et câble |
| HP ProBook 450 G10 (`DT-PC-005`) | `hp-probook.jpg` — capot fermé, fond de vitrine flou |

Champ `img` ajouté sur ces 5 entrées dans `js/data/produits.js` — c'est le
mécanisme déjà prévu depuis la phase 1 (`carte-produit.js` affiche la photo
par-dessus le dessin si `img` est renseigné, et retombe sur le dessin si
l'image ne charge pas). **Aucun autre produit n'a été touché** : forcer une
photo sur un modèle qu'on n'est pas sûr d'identifier (ex. le Lenovo Legion
gaming, très différent visuellement d'un ThinkPad) aurait été trompeur —
mieux vaut un dessin honnête qu'une photo qui ne correspond pas.

**Aussi utilisées** — trois photos d'ambiance (étagères de cartons,
vitrine floue, carton ThinkPad) en petite galerie sur `reseau.html`, section
siège (`.siege-photos`, sous le bloc `.siege` existant) : la légende assume
que ce sont des photos de téléphone prises sur place plutôt que de les
maquiller en studio — c'est ce qui les rend crédibles, pas malgré ce détail
mais grâce à lui. Voir `js/pages/reseau.js` et `assets/img/atelier/`.

**Non utilisées, et pourquoi** : les autres photos du lot (Surface, les
trois MacBook empilés, le ThinkPad qui démarre avec quelqu'un en arrière-
plan, le gros plan clavier) sont classées mais pas posées sur le site —
soit parce qu'aucun produit du catalogue ne correspond (pas de Surface au
catalogue, un 2-en-1 tactile n'est pas dans le périmètre du cahier des
charges), soit parce que la photo est plus candide que "fiche produit"
(quelqu'un en arrière-plan). Elles restent disponibles dans
`Docs/classement/produits-stock/` si un usage se présente.

**Format des cartes** : `.carte__visuel` est en `aspect-ratio: 4/3` avec
`object-fit: cover` — le crop en amont vise cette proportion pour que le
cover ne recadre pas au hasard, la même leçon que pour le hero (recadrer en
connaissance du contenu plutôt que laisser `object-fit` deviner).

## Deuxième passe photos : couverture élargie, portrait, et vrai déplacement des assets (septembre 2026)

Le client a réagi à une capture d'écran de la grille « Notre sélection du
moment » où 3 des 4 cartes montraient encore un dessin générique : consigne
sans ambiguïté — *« il faut tout changer, utilise les images des ordi
partout, utilise le poster aussi, regarde comment est FaraFinaTignè et fais
pareil, les images du dossier Docs doivent être déplacées vers les assets du
site »*. Quatre choses distinctes en découlent.

**1. Trois photos produit de plus.** En reprenant le lot de 14 photos déjà
classées, trois correspondances marque/modèle supplémentaires étaient
honnêtes :

| Produit | Photo |
|---|---|
| Dell Latitude 7420 — reconditionné (`DT-PC-006`) | `dell-latitude.jpg` (même photo que le 5440 : même carrosserie Latitude, capot fermé) |
| HP EliteBook 840 G6 — reconditionné (`DT-PC-010`) | `hp-elitebook-840.jpg` (même photo que le G9 : même famille EliteBook) |
| Apple MacBook Pro 14" M3 Pro (`DT-PC-014`) | `macbook-pro.jpg` — nouveau recadrage, les trois MacBook empilés (`macbooks-empiles.jpeg`) recadrés sur celui du dessus |

Ce qui reste en dessin et pourquoi n'a pas changé depuis la passe précédente :
HP 250 G9 (photos dispo trop premium pour une gamme d'entrée, survendrait le
produit), Lenovo IdeaPad Slim 3 (les photos Lenovo disponibles montrent le
sigle « ThinkPad », contradiction de marque), Acer/Asus (aucune photo de ces
marques), gaming (aucune photo à esthétique gaming), tours et AIO (aucune
photo de bureau — poser une photo de portable dessus mentirait sur le format).
Les accessoires (souris, écran, webcam, SSD) restent en dessin aussi : le
lot de photos ne couvre que des ordinateurs portables, pas de périphériques.
**8 des 19 `ordinateurs` ont désormais une vraie photo** — c'est la limite
honnête du matériel disponible, pas un choix arbitraire de s'arrêter là.

**2. Le poster « Bonne journée de vendredi ».** Le client a explicitement
demandé d'utiliser ce visuel malgré son caractère daté et religieux — instruction
directe qui prime sur le jugement éditorial initial de l'écarter. Recadré
(portrait 450×1080, cadrage resserré à droite du visuel pour couper le texte
« BONNE JOURNÉE DE VENDREDI » et ne garder que la photo) en
`site/assets/img/equipe/portrait-vendredi.jpg`. Posé en tête de
`contact.html`, dans `[data-infos]` (`js/pages/contact.js`) : une carte
`.bloc-info--photo` avant « Showroom & atelier », avec une légende intemporelle
(« Toute l'équipe Dilitech est joignable directement ») plutôt que le
message du visuel d'origine, daté. `object-position: 50% 38%` cadre sur le
visage — vérifié par capture d'écran, la première tentative à `20%` ne
montrait que le bonnet.

**3. Taxonomie des assets, sur le modèle FaraFinaTignè.** Le projet
`FaraFinaTigne/site` range ses photos en
`assets/produits/<categorie>/<sous-categorie>/nom.webp`. Les photos produit
de Dilitech suivent maintenant le même principe :
`site/assets/img/produits/ordinateurs/portables-pro/*.jpg` et
`.../portables-creation/macbook-pro.jpg` (mécanique : chemins mis à jour dans
`js/data/produits.js` par substitution, rien d'autre à changer côté JS —
le champ `img` est une chaîne opaque pour `carte-produit.js`).

**4. Déplacement réel des images de `Docs/`.** Jusqu'ici le classement
(`Docs/classement/…`) était une *copie* : les originaux restaient dans
`Docs/` et `Docs/images/`. Consigne du client : déplacer, pas dupliquer.
Tout ce qui est image a quitté `Docs/` pour
`site/assets/originaux/{communication,produits-brut,references}/` — les
originaux bruts derrière les photos déjà utilisées sur le site (pas servis
publiquement, mais physiquement dans les assets du site comme demandé) :
- `communication/` — les 6 posters réseaux sociaux + `post-bon-weekend.png`
  + le poster vendredi (le doublon `post-vendredi.jpeg`/`post-vendredi-source.jpeg`,
  identique au hash MD5, a été dédupliqué).
- `produits-brut/` — les 14 photos téléphone d'origine.
- `references/` — 3 fichiers `.jfif` (« télécharger (N) ») dont le contenu
  n'a pas été vérifié individuellement (nom typique de téléchargement
  navigateur, probablement une inspiration Pinterest et non du contenu
  Dilitech) ; déplacés par prudence plutôt que supprimés sans certitude.
`Docs/` ne contient plus que les deux PDF de charte graphique — ce ne sont
pas des images, l'instruction ne les visait pas.

## Refonte hero + nav + cartes (septembre 2026) — après un « supprime tout »

Le client a rejeté le rendu en bloc, en des termes sans détour : *« ce site
n'a aucune vie, revoit totalement, supprime tout ce que t'as fait, reprend
un truc premium comme VP et EventMotors »*, avec instruction explicite
d'installer Playwright et de comparer moi-même les trois sites. Fait : les
deux projets de référence ont été servis localement (`WebsiteVP` port 5611,
`EventMotors/WebsiteEvent` port 5612) et capturés à côté de Dilitech pour un
diagnostic image par image plutôt qu'une impression.

**Ce que la comparaison a montré, concrètement** :
- Le hero de VP est **plein cadre** (la photo occupe 100 % du hero) ; celui
  de Dilitech ne montrait qu'un bandeau de clavier en bas de cadre, le reste
  en noir — parce que **la photo source elle-même** (`hero-laptop-large.jpg`,
  un stock générique) était vide aux trois quarts. Aucun réglage CSS ne
  répare une photo vide : il fallait en changer.
- La nav de VP/EventMotors est **posée en transparence sur le hero sombre**
  et se solidifie au défilement ; celle de Dilitech était une barre blanche
  fixe qui coupait le hero net sous elle — aucune continuité entre chrome et
  contenu.
- Les tuiles produit sans photo (accessoires, réseau) affichaient un dessin
  au trait flottant sur fond blanc/gris clair : lu comme un placeholder
  oublié plutôt qu'un choix, exactement le reproche du client (« icônes
  bizarres »).

**Ce qui a changé** :

1. **Nouvelle image de hero, issue du stock réel Dilitech.** Plus de photo
   de stock : `hero-laptop-large.jpg` est maintenant un agrandissement
   (×2,6, Lanczos + `autocontrast` + `UnsharpMask`) de
   `thinkpad-ecran-couleur.jpeg` — un ThinkPad à l'écran arc-en-ciel très
   vif, posé devant des cartons floutés de l'entrepôt de Torokorobougou.
   Photo authentique, mais source téléphone à 810×1080 : l'agrandissement
   reste visible de près, acceptable en fond de hero, pas au-delà.

2. **Hero recomposé en deux zones, pas en plein cadre texte-sur-photo.**
   Contrairement au portrait VP (un visage a une zone neutre naturelle pour
   poser du texte), un écran arc-en-ciel est vif sur toute sa surface :
   aucun assombrissement uniforme ne rend le texte lisible sans aussi tuer
   ce qui rend la photo intéressante. Solution — `.hero__media` n'occupe
   plus que les 58 % droits du hero (`left: 42%`), avec un fondu
   (`mask-image`) plutôt qu'une coupure nette ; le texte vit sur le
   dégradé de marque `--nuit` à gauche (le même que les bandes sombres du
   reste du site). Le texte est donc passé de centré à aligné à gauche
   (`.hero__inner`, `.hero__text`, `.hero__sub`, `.hero__actions`), et
   `.hero__title` a rétréci (`clamp(2.1rem, 3.4vw, 3.15rem)`) pour tenir
   dans une colonne de 420px. Le mot fantôme (`.hero__ghost`, « TECH ») a
   été retiré de cette page : il ajoutait du bruit sur une photo déjà
   chargée, sans la zone calme qui le rendait élégant chez VP.
   En dessous de 900px, plus de place pour deux colonnes : la photo repasse
   plein cadre (`.hero__media { left: 0 }`) et un assombrissement beaucoup
   plus fort (`brightness(.4)` sur l'image + dégradé quasi opaque) porte
   seul la lisibilité.

3. **La nav flotte désormais par-dessus le contenu.** `.site-entete` est
   passé de `position: relative` (nav `sticky` dans le flux) à
   `position: fixed`. Toutes les pages dont la première section est une
   bande sombre (`.entete-page.nuit` ou le hero de l'accueil — la majorité)
   en profitent : la nav y est transparente, texte clair, jusqu'au
   défilement (`.site-entete--sombre`, classe posée par `chrome.js` par
   défaut). Les deux pages qui ouvrent sur une section claire — fiche
   produit et article, dont l'en-tête est injecté en JS plutôt qu'une bande
   fixe — déclarent `<site-entete fond="clair">` : la nav y reste opaque dès
   le premier pixel. `#contenu` récupère le `padding-top` que la nav ne
   réserve plus, sauf sur les pages sombres où la bande veut commencer à
   y = 0 (`.site-entete--sombre ~ #contenu { padding-top: 0 }`). Le bandeau
   d'activité (numéro, adresse) se réduit à zéro pendant qu'on n'a pas
   défilé sur une page sombre, pour ne pas doubler la hauteur de chrome
   par-dessus une photo.

4. **Les tuiles produit sans photo reprennent le dégradé de marque.**
   `.carte__visuel` passe du fond clair (`--mist` → blanc) au même dégradé
   `--nuit` que le hero et les bandes sombres, avec une fine trame
   (grille 24px, blanc à 6 %) en repère plutôt qu'un vide. Le dessin
   (`.carte__illus`) passe en blanc/cyan sur ce fond sombre, agrandi
   (46 % au lieu de 62 %, l'espace est repris par la trame) avec une ombre
   portée. Résultat : une carte sans photo a maintenant l'air d'un choix de
   direction artistique — pas d'un gabarit qui attend sa photo. Le dessin
   au trait lui-même n'a pas été redessiné (portée trop large pour cette
   passe) ; c'est sa mise en scène qui change.

Vérifié : les 9 pages, 3 largeurs (390/768/1440), zéro erreur console, zéro
débordement horizontal (voir script de la passe précédente, réutilisé).

**Ce qui reste ouvert**, par manque de matière ou de temps dans cette passe :
le style des pictogrammes eux-mêmes (toujours du trait fin, pas redessiné) ;
les sections de l'accueil sous le hero (univers, services, aperçu réseau,
articles) n'ont pas été retouchées ; les autres pages n'ont eu que le
bénéfice de la nav flottante, pas une refonte de leurs propres sections.

## Vie locale : Dilitech sponsor d'un challenge digital (septembre 2026)

Le client a fourni 11 photos (`Docs/images/`) d'un événement organisé par un
autre acteur bamakois, **2D Digitals** (formation informatique/graphisme/
marketing digital) : Dilitech y était **sponsor officiel du « Challenge
Digital — Mini-Business Concept »**, un concours d'entrepreneuriat digital
pour jeunes, et a fourni le matériel remis aux lauréats (ordinateurs,
tablette Lenovo, casquettes et t-shirts Dilitech). Une des photos montre
l'attestation de reconnaissance remise à Dilitech pour ce sponsoring — le
texte exact de l'attestation est repris en citation.

Nouvelle section **« Vie locale »**, sur `reseau.html` à l'origine (fondue
dans `index.html#reseau` depuis, voir plus bas) : texte + une carte-citation
(photo de la remise de l'attestation + le texte de l'attestation + qui l'a
remise) à côté d'une galerie de 3 photos de l'événement (mêmes codes visuels
que `.siege-photos` déjà existante : légende, grille, lift au survol).

Photos traitées avec la même recette que les passes précédentes (Pillow :
`autocontrast` + `UnsharpMask` léger ; deux des quatre photos utilisées sont
recadrées de portrait 3:4 vers paysage 4:3, crop vérifié par capture avant
export plutôt que deviné). Posées dans `assets/img/engagement/`. Les 11
photos d'origine, renommées, déplacées (pas copiées) dans
`assets/originaux/evenements/` — même principe que les passes précédentes
sur les photos produits, `Docs/images/` ne contient donc plus rien.

## Fusion en page unique (septembre 2026)

Après avoir vu le résultat des sections « aperçu » de l'accueil (3 services
sur 6, 3 partenaires sur 7, 3 articles sur 6, un CTA à la place du
formulaire), le client a tranché sans détour : *« j'ai pas aimé, je veux
voir tout sur une seule page, je veux un site single page comme pour toguna
motors, il y'aura juste une page à part sur le catalogue »*, puis, en
message de suivi : *« si tu peux même supprimer les autres pages en html,
garde juste l'index.html et le catalogue.html »*.

**Ce qui a été fait** — voir « Pages » et « Architecture JS » plus haut pour
l'état final :
- Le contenu **complet** de `services.html`, `reseau.html`, `conseils.html`
  et `contact.html` a été fondu dans les sections `#services`/`#reseau`/
  `#conseils`/`#contact` de `index.html` (plus des aperçus), puis ces quatre
  fichiers ont été supprimés. Leur logique JS a été portée dans
  `accueil.js` (même balisage, mêmes classes CSS — aucune réécriture de
  fond, un déplacement).
- **Fiche produit et lecture d'article** (`produit.html`, `article.html`)
  sont devenues des **panneaux superposés** (`<panneau-produit>`,
  `<panneau-article>`, `js/components/`) plutôt que des pages : question
  posée explicitement au client avant de s'y engager (impact réel sur
  l'architecture), tranchée pour le panneau plutôt que garder les deux
  pages. Mécanique copiée sur `<panneau-devis>` (déjà sur le site) : voile,
  piège à focus, verrouillage du défilement — seule la largeur change
  (`.panneau--large`, 920px). L'état vit dans l'URL (`?produit=DT-…`,
  `?article=slug`, via la nouvelle `definirParametre()` de `core/dom.js`) :
  un lien reste partageable, recharger la page rouvre le bon panneau, et le
  bouton « précédent » du navigateur referme le panneau au lieu de quitter
  le site — jamais de rechargement complet.
- Collision d'ids évitée : la section « Installation réseau » des services
  (`id="reseau"` dans l'ancien `services.html`) est devenue
  `id="service-reseau"` — `#reseau` est maintenant pris par la section
  réseau/partenaires de niveau page.
- **Rythme des ancres sombres revu à la baisse** : chaque ancienne page
  ouvrait sur sa propre bande `.nuit` pleine page et se refermait souvent
  sur son propre CTA `.nuit` — mis bout à bout sur une seule page, ça aurait
  fait une dizaine de bandes sombres à la suite. Les bannières d'ouverture
  sont devenues de simples en-têtes `tete-sec`/`tete-duo` (même traitement
  que les autres sections de l'accueil), et les CTA redondants (fin de
  `conseils.html`, « devenir partenaire » de `reseau.html`) ont été retirés
  ou réduits à un lien inline — seules les bandes `.nuit` qui portent un
  vrai contenu (les étapes de « Équipement de parc », les étapes de
  « Comment ça se passe », la bande d'ouverture de Contact) sont restées.
- **Repère de section actif dans la nav** (`activerScrollspy()`,
  `core/ui.js`) : la page ne rechargeant plus entre « Accueil » et
  « Services », la nav doit dire où l'on est pendant le défilement. Basé
  sur une ligne de seuil sous l'en-tête fixe (dernière section dont le haut
  l'a franchie), **pas** sur `IntersectionObserver`/ratio d'intersection —
  premier essai, écarté : les sections fondues ont des hauteurs très
  différentes (un `#services` court, un `#reseau` très long), et un ratio
  d'intersection favorise toujours mécaniquement la section la plus courte.
- `activerAncresAccueil()` (défilement doux vers une ancre `index.html#…`)
  utilise maintenant `allerA()` (`core/dom.js`, tenait déjà compte de
  `--nav-h`) au lieu d'un `scrollIntoView` brut qui plaçait la cible sous
  l'en-tête fixe.
- `sitemap.xml` réduit à `/` et `/catalogue.html`. `404.html` **gardé**
  malgré la formulation « garde juste l'index.html et le catalogue.html » —
  ce n'est jamais un lien de nav, seulement une page technique servie par
  l'hébergeur ; à signaler au client plutôt qu'à supprimer sans le dire.

Vérifié par Playwright : les deux pages × 3 largeurs (390/768/1440), zéro
erreur console, zéro débordement horizontal ; ouverture/fermeture des deux
panneaux (Échap, clic sur le voile, bouton « précédent »), rechargement sur
`?produit=`/`?article=` rouvre le bon panneau, recherche du catalogue
toujours fonctionnelle.

### Retrait de la grande section Contact — redondante avec le pied de page

Juste après cette fusion, retour du client sur une capture de la section
Contact : *« retire la section contact et devis, pas besoin »*. Le site a
déjà, sur **toutes** les pages, une bande de contact dans `<site-pied>`
(`pied-contact` — coordonnées, formulaire court, WhatsApp) : la grande
section `#contact` de l'accueil (bande sombre + formulaire riche à sujets +
FAQ) faisait double emploi.

- Les deux sections (Contact/devis complet + FAQ) sont retirées d'`index.html`.
- **`id="contact"` déplacé sur `.pied-contact`** (`chrome.js`, `<site-pied>`)
  : tous les liens `index.html#contact` déjà semés dans le site (nav, hero,
  CTA « Demander un diagnostic »/« Nous confier un chiffrage »/etc., le lien
  « Une question sur ce produit ? » du panneau produit) continuent de
  fonctionner sans être touchés un par un — ils amènent maintenant au pied
  de page, présent sur les deux pages.
- `accueil.js` perd tout ce qui ne servait qu'à cette section : formulaire
  de devis, rappel de sélection, sujets, horaires/ouverture affichés en
  carte, FAQ — environ 280 lignes, avec leurs imports (`devis`, `toast`,
  `RESEAUX`, `prix`) devenus inutiles ici (le tiroir `<panneau-devis>` et le
  petit formulaire du pied de page couvrent déjà ce besoin).
- **Piège rencontré et corrigé** : un commentaire dans `chrome.js` citait
  littéralement `` `index.html#contact` `` entre apostrophes inverses — à
  l'intérieur d'un template literal JS (`this.innerHTML = \`…\``), ça
  ferme la chaîne en plein milieu et casse tout le composant
  (`SyntaxError: Unexpected identifier 'index'`, plus aucune nav ni pied de
  page sur le site). Corrigé avec des guillemets français « » dans les
  commentaires JS à partir de maintenant.
- **Le scrollspy (`activerScrollspy()`) ne suffisait plus pour « Contact »** :
  le pied de page est plus court qu'un écran et se trouve tout en bas d'un
  document désormais très long — le calcul « dernière section dont le haut a
  franchi le seuil » ne l'attrape pas toujours (il ne peut pas être amené
  sous la nav par le défilement, il n'y a plus de place en dessous). Deux
  filets ajoutés dans `core/ui.js` :
  1. un repli « en bas de page → dernière ancre » (`enBas`, avec une marge
     large de 150px : la hauteur totale du document bouge encore un peu au
     moment du calcul, à cause des images `loading="lazy"` pas encore
     chargées plus bas) ;
  2. `activerAncresAccueil()` (clic sur un lien de nav) pose désormais le
     repère **tout de suite**, avec plusieurs reposes échelonnées (300 à
     2500 ms) le temps que l'animation de défilement native se termine —
     elle n'a pas de durée garantie, et le scrollspy recalculait entre-temps
     et pouvait se tromper. Le code des deux fonctions partage maintenant
     `marquerNavActif()` plutôt que deux logiques séparées.

## Photos de la boutique (septembre 2026)

Six nouvelles photos du dépôt/showroom de Torokorobougou (`Docs/images/`).
Les trois vignettes de « Le stock, en vrai » (`assets/img/atelier/
atelier-1..3.jpg`) ont été **remplacées sur place** — mêmes noms de fichier,
donc aucun HTML/JS à toucher, et les `alt` existants décrivaient déjà le bon
sujet : étagères de portables (1), vitrine vitrée avec éclairage LED bleu
(2 — la plus belle du lot, candidate évidente si le hero doit un jour
changer de photo), cartons réceptionnés (3). Recette habituelle : recadrage
paysage qui coupe le plafond, `autocontrast` + `UnsharpMask`. Originaux
renommés et déplacés dans `assets/originaux/boutique/`.

## Bascule jour / nuit (septembre 2026)

Demande : *« le fond bleu est top en nuit, mets-y un fond blanc pour le
jour »*, sur le modèle de `EventMotors/Catalogue` (Toguna). Même mécanique
que Toguna : `data-theme="light"` sur `<html>`, choix mémorisé dans
`localStorage` (clé `dilitech-theme`), script inline bloquant en tête des
trois pages pour éviter le flash sombre au chargement, bouton soleil/lune
dans la nav (et dans le menu mobile, où les icônes de nav sont masquées).
Le mode nuit reste le défaut ; `prefers-color-scheme` n'est pas lu.

**Parti pris : en mode jour, TOUT passe au clair** — hero, bandes d'accent
(`.nuit`), tuiles bento, visuels produits, pied de page, menu mobile. Un
premier jet gardait ces zones sombres en jour (comme les panneaux marine de
Toguna) ; le client l'a refusé : *« en mode jour, il faut que tout change
vers le blanc, tout le hero doit aller en blanc, pareil pour les autres
sections »*. Seuls le marine et le cyan de marque (boutons, pastilles,
étiquettes) restent identiques.

Comment c'est câblé dans `style.css` :
- **`--fond`** : fond générique de `body` et `section` (vaut `var(--nuit)`
  en nuit, donc le mode nuit est pixel pour pixel l'ancien site).
- **Bloc `:root[data-theme="light"]`** : bascule aussi les jetons « sur fond
  sombre » — `--nuit` (devient un blanc à peine teinté avec des halos très
  légers, pour que le hero et les bandes restent distincts des sections
  unies), `--sur-sombre*` (texte blanc → encre), `--cyan-2` (devient la
  valeur de `--cyan-ink`, 5:1 sur blanc). Tous les composants pensés pour le
  sombre suivent donc sans règle à part.
- **Nouveau jeton `--sur-rgb`** (`255, 255, 255` la nuit, encre marine le
  jour) : les ~40 `rgba(255, 255, 255, .x)` codés en dur (traits, voiles de
  verre, bordures du hero…) sont devenus `rgba(var(--sur-rgb), .x)`. Les
  `#fff` posés sur des fonds qui basculent sont devenus `var(--sur-sombre)`.
  Restent en `#fff` volontairement : le texte sur fond marine/cyan/vert
  plein (boutons, étiquettes, pastilles, toasts) — ces fonds ne changent pas.
- Les fonds sombres écrits en dégradés littéraux (tuiles bento, badge
  « villes », cartes de contact, formulaires du pied de page, voiles du
  hero…) ont leur pendant clair **regroupé dans un seul bloc**, juste sous
  le bloc de jetons, pour voir d'un coup d'œil tout ce que le mode jour
  réécrit. ⚠ Tout nouveau composant avec un fond sombre en dur doit y avoir
  son équivalent clair (ou, mieux, utiliser `var(--nuit)`/`--paper`/
  `--sur-rgb` dès le départ).

Corrigés en chemin, révélés par le mode jour :
- `.heros__preuves` (bande de chiffres de `#reseau`) avait ses chiffres en
  `#fff` en dur — conçue pour l'ancienne bande sombre de `reseau.html`.
  Passée sur `--tx-1`/`--tx-3`, carte pleine en jour.
- Onglet actif des conseils (`.cat-filtres .onglet.est-actif`) : bug de
  spécificité existant — `.cat-filtres .onglet { background: var(--paper) }`
  écrasait le fond marine de `.onglet.est-actif`, seul le texte blanc
  restait. Invisible en nuit (blanc sur papier sombre), blanc sur blanc en
  jour.
- **Scrollspy** limité à l'accueil (`if (!$('#hero')) return;`) : depuis que
  `id="contact"` est sur le pied de page, il existe aussi sur
  `catalogue.html`, où « Contact » restait marqué actif à côté de
  « Catalogue ».

Vérifié par Playwright : bascule + mémorisation + thème déjà posé au
premier rendu de la page suivante ; deux thèmes × trois pages × trois
largeurs sans erreur console ni débordement ; captures section par section
en jour, et comparaison du mode nuit avant/après.

## Nav allégée (septembre 2026)

Demande du client : *« je veux pas voir trop de liens »*.
- **Bandeau d'activité retiré** (la fine barre au-dessus de la nav : activité,
  téléphone, adresse) — markup dans `chrome.js`, règles `.bandeau*` et
  variable `--bandeau-h` supprimées du CSS. Téléphone et adresse restent
  dans le pied de page et le menu mobile.
- **Loupe retirée** de la nav (elle menait à `catalogue.html#recherche`). La
  barre de recherche **du catalogue lui-même** est conservée.
- **Liens « Réseau » et « Conseils » retirés** de `LIENS` (nav + menu
  mobile). Les sections `#reseau` et `#conseils` restent sur l'accueil,
  intactes ; le scrollspy continue de les suivre (aucun lien n'est marqué
  actif pendant qu'on les traverse, plutôt qu'un faux « Services »).
  Nav finale : Accueil · Catalogue · Services · Contact.

## Le « concierge » : écoute client au fil de la visite (septembre 2026)

Vision du patron : écoute client, bon usage du matériel, accompagnement —
le site ne doit pas seulement vendre, il doit faire préciser l'usage. Le
client a demandé des petits pop-ups doux et graduels (« un accueil digne
d'un hôtel 5 étoiles ») et une sélection qui garde les réponses en mémoire.
Choix explicites du client : **questions uniquement sur l'usage** (pas de
budget, pas de prénom, pas de ville) ; **ordre des sections inchangé**.

**Ce que vit le visiteur**
- 1re visite, ~4 s après le premier défilement : carte d'accueil
  (« Bienvenue chez Dilitech… ») avec « Commencer maintenant » (pose Q1
  tout de suite) ou « Je regarde d'abord ». Visites suivantes, s'il a déjà
  répondu : « Bon retour parmi nous — votre sélection vous attend ».
- 3 questions, une à la fois, armées par l'arrivée sur une section :
  Q1 usages (multi, les 7 `USAGES` du catalogue) sur `#univers` ou la grille
  du catalogue ; Q2 lieu (bureau / terrain / cours) sur `#pourquoi` ; Q3
  nombre de postes sur `#services`. Toujours dans l'ordre (pas « où » avant
  « quoi »).
- **Les questions reviennent à chaque chargement de page** (demande du
  client, 2e passe : « faire réapparaître les pop-ups » tout en gardant la
  mémoire). Déjà répondue ? Elle revient pré-cochée (« Votre dernière
  réponse est cochée : confirmez, ou changez-la » → « C'est toujours ça »).
  Les compteurs (questions déjà montrées, plafond, délai) vivent en mémoire
  de la PAGE, pas de la session : une actualisation repart à zéro.
  « Plus tard » = pas d'autre carte spontanée pour cette question sur cette
  page ; « Ne plus me demander » (persisté) coupe toutes les cartes
  spontanées. L'accueil « Bienvenue » : une fois dans la vie du visiteur ;
  « Bon retour » : une fois par session d'onglet (`sessionStorage`
  `dt-bon-retour`), avec « Mon besoin a changé ».
- **À la demande** : tout `.js-ouvrir-conseiller` ouvre le QUESTIONNAIRE
  GUIDÉ (« Question 1 sur 3 » → « Suivant » → … → merci), sans délai, même
  après « Ne plus me demander ». Aujourd'hui : les deux interrupteurs de
  l'univers Dilitech (voir plus bas).
- ⚠ **Pas de bouton flottant façon « chat / assistant »** : essayé, refusé
  par le client (« non pas de chat, je voulais que les pop-ups
  réapparaissent »).
- Règles de politesse (`concierge.js`, en tête) : 25 s entre la fermeture
  d'une carte et la suivante, 3 questions spontanées max par page, rien
  tant que le visiteur n'a pas défilé, rien pendant qu'un panneau/menu est
  ouvert (`body.defilement-bloque`). Non modal, Échap ferme.
- **Interrupteurs de l'univers Dilitech** (tuiles D « 55 références » et E
  « Le conseil avant le produit ») : autrefois décoratifs, ce sont
  maintenant de vrais boutons qui rouvrent les questions. Éteints (gris,
  bouton à gauche) tant que le visiteur n'a rien dit de son usage, allumés
  (cyan) ensuite — état posé par le concierge sur tout `[data-etat-profil]`
  (`data-actif`, et `aria-checked` sur `role="switch"`). La tuile E est
  devenue un `<button>` entier, avec « Dites-nous votre usage → » remplacé
  par « Pensé pour : … » (`[data-profil-mini]`). La tuile D reste un lien
  vers le catalogue par un **lien étiré** (`.bento__etire`, position
  absolue sur toute la tuile) — l'interrupteur est posé au-dessus
  (`z-index: 2`), parce qu'un bouton ne peut pas vivre dans un `<a>`.
- Section `#selection` : puces « Pour quel usage ? » (même mémoire que les
  cartes) ; dès qu'un usage est connu, titre « Sélectionné pour vous »,
  onglet « Pour vous » (point cyan) en premier et actif, phrase « Pensé
  pour … » + « Tout effacer ».
- Devis : bloc « Besoin exprimé sur le site » dans le message WhatsApp
  (`devis.messageTexte()` → `profil.lignesBesoin()`).
- Catalogue : bandeau « Vous nous avez dit : … — N'afficher que ce qui vous
  convient » quand un usage est connu ET qu'aucun filtre n'est posé
  (jamais appliqué d'office).

**Où ça vit**
- `js/core/profil.js` — mémoire (`creerStore`, clé `dt-profil`, synchro
  entre onglets), les `QUESTIONS`, `scoreProduit()` / `pourVous()`,
  `resume()`, `lignesBesoin()`. Compteur de visites par session d'onglet.
- `js/components/concierge.js` — `<dilitech-concierge>`, injecté par
  `demarrer()` (commun.js) sur l'accueil et le catalogue, pas sur la 404.
  Déclencheurs (IntersectionObserver) « arment » ; un ordonnanceur (1,5 s)
  montre. Méthode publique `ouvrirQuestionnaire()`.
- Ajouter une question : l'entrée dans `QUESTIONS` + `CODES`/`valider`
  (profil.js), sa place dans `ORDRE` et `DECLENCHEURS` (concierge.js), son
  poids dans `scoreProduit()` et sa ligne dans `lignesBesoin()`.

**Classement « Pour vous »** : +3 par usage en commun (un produit sans aucun
usage commun est exclu), puis bonus de départage — terrain : +2 si
`mobilite`, −4 si matériel sédentaire (écran, poste fixe, impression,
réseau câblé) ; cours : +2 `etudes` ; plusieurs postes : +2 `entreprise` ;
+1 pour les ordinateurs (qui parle d'usage cherche d'abord une machine). À
score égal, l'ordre éditorial du catalogue.

**Piège rencontré** : le repli `setTimeout(cacher, 400)` de fermeture masque
souvent la carte avant la fin de sa transition — `transitionend` ne part
jamais, l'écouteur `{ once }` reste accroché et refermait la carte
SUIVANTE dès son ouverture. Garde ajoutée (`cacher` ne masque que si aucune
carte n'a été rouverte). Même mécanique dans les trois panneaux, mais leur
transition (0,34 s) finit avant les 400 ms : pas touché.

Vérifié par Playwright : parcours complet d'une 1re visite (accueil → Q1 →
merci → onglet « Pour vous » → Q2 après le délai → Q3 → « Plus tard »),
2e visite (« Bon retour »), message de devis, bandeau du catalogue,
« Ne plus me demander », puces sans concierge ; deux thèmes × trois pages ×
trois largeurs sans erreur ni débordement.

### 3e passe du concierge : six questions en deux passages, Précédent / Suivant

Retour du client : la question 2 « va vite » (un clic sur un choix unique
passait directement à la suivante), et il veut **six questions, en deux
passages**, avec le **prénom** en partie 1 (champ texte). Il avait écarté le
prénom au premier tour ; il l'a demandé ici explicitement.

- **Partie 1 « Faisons connaissance »** (armée sur `#univers`, ou la grille
  du catalogue) : prénom (champ, facultatif, 40 car. max), usages (multi),
  lieu. **Partie 2 « Pour affiner nos conseils »** (armée sur `#services`,
  ou `#contact` = le pied de page sur le catalogue) : nombre de postes,
  priorités (multi, **2 au plus** : autonomie, légèreté, puissance,
  solidité, juste prix), neuf / reconditionné / peu importe. Les deux
  dernières questions sont un choix de ma part (le client a demandé « 6
  questions » sans les préciser) — orientées besoin, toujours pas de budget.
  Définitions : `QUESTIONS` et `PARTIES` dans `profil.js`.
- Chaque passage = un parcours à étapes : barre de progression, « Faisons
  connaissance · Question 2 sur 3 », **« ← Précédent » / « Suivant → »**,
  « C'est noté » à la dernière. Un clic sur un choix le coche seulement ;
  c'est « Suivant » qui enregistre et avance (un choix non coché = question
  passée, sans effacer l'ancienne réponse). Entrée dans le champ prénom =
  « Suivant ». « Enchanté, Awa. » juste après le prénom ; « Merci Awa,
  c'est noté » à la fin ; « Bon retour parmi nous, Awa » ; titre de la
  sélection « Sélectionné pour vous, Awa ». Le prénom part aussi dans le
  bloc « Besoin exprimé » du devis.
- Les interrupteurs de l'univers (et « Mon besoin a changé ») ouvrent les
  **six** d'affilée (« Votre besoin · Question 1 sur 6 »).
- Choix coché : teinte cyan + « ✓ », plus le fond marine plein — il se
  confondait avec le bouton « Suivant / C'est toujours ça » (capture du
  client). Même style pour les puces d'usage de la sélection.
- `estVide()` = **aucun usage connu** (avant : aucune des réponses) — sans
  usage, « Pour vous » n'aurait aucun produit à montrer ; prénom, lieu,
  priorités… ne font que départager.
- Classement : priorités et état ajoutés à `scoreProduit()` (autonomie /
  légèreté → mobilité ; puissance → création, gaming ; solidité → pro,
  entreprise ; juste prix → reconditionné ou ≤ 400 000 FCFA ; reconditionné
  demandé → +3 aux reconditionnés).

### 4e passe : la question « métier »

Retour du client : *« au niveau des besoins il manque un truc : est-ce pour
un dev, un graphiste, un monteur vidéo, un architecte… ? »*. Ajout de
**« Quel est votre métier ? »** en partie 1, juste après le prénom (partie 1
= prénom, métier, usages, lieu ; partie 2 inchangée ; 7 questions au total).

- `METIERS` dans `profil.js` : 10 métiers + « Autre ». Chacun porte des
  `usages` (**pré-cochés** à la question suivante quand l'usage n'est pas
  encore connu, avec « D'après votre métier, nous avons pré-coché ce qui
  vous ressemble — ajustez librement ») et des sous-catégories `sous` qui
  lui servent vraiment (monteur vidéo → portables création, stockage,
  stations, audio ; graphiste → écrans…), **+2** dans `scoreProduit()`.
- « Autre » n'est pas une puce : c'est le champ libre sous la liste
  (« Autre métier ? Précisez-le ici », 60 car.) → `metier: 'autre'` +
  `metierLibre`. Taper dans le champ décoche les puces ; choisir une puce
  vide le champ.
- Le métier entre dans le résumé (« Pensé pour : monteur vidéo et
  création ») et dans le bloc « Besoin exprimé » du devis.
- La carte ne dépasse jamais l'écran (`max-height` + défilement interne) :
  la question métier a beaucoup de puces. Sur mobile, elle tient entre la
  nav et les boutons flottants.

## Photos partout à la place des dessins de PC (septembre 2026)

Demande du client : *« les parties où on voit les PC, assure d'utiliser toutes
les images de PC au lieu de faire des illustrations »*. Il restait 11
ordinateurs sur 19 en dessin (HP 250, IdeaPad, Acer, Vivobook, Asus TUF,
Legion, Precision, et les 4 postes fixes). **Les 19 ont désormais une photo.**

Règle suivie (script de recadrage 4:3 : autocontrast + UnsharpMask, comme
les passes précédentes) :
- **Même marque quand c'est possible** : HP 250 → HP fermé de la vitrine ;
  IdeaPad → Lenovo au démarrage ; Legion → Lenovo écran couleur ;
  Precision → Dell fermé.
- **Aucune photo d'Acer, d'Asus ni de poste fixe** dans le lot du client :
  recadrages des rayons et des cartons de la boutique **où aucune marque ne
  se lit** (le premier recadrage « Asus TUF » laissait voir un logo Dell et
  un ThinkPad : refait).
- Ces 11 produits portent `photoBoutique: true` dans `produits.js` → la
  fiche produit affiche « Photo prise dans notre boutique de
  Torokorobougou. La photo du modèle exact vous est envoyée sur demande. »
  (même principe que la note « Illustration de la famille » d'avant).
- Écartées volontairement : `bento-windows-laptop.jpg`, `bento-macbook.jpg`,
  `hero-macbook-mystic.jpg` (origine inconnue, pas de licence documentée) —
  pas de photo d'origine douteuse sur une fiche produit.
- Articles de conseil qui parlent d'ordinateurs : champ `img` dans
  `articles.js` (choisir un portable, équiper un bureau, neuf ou
  reconditionné, sécuriser son poste) → photo dans la carte et en tête de
  la lecture. Onduleurs et Wi-Fi gardent leur dessin (pas de photo).
- Bloc « Vente & conseil » : photo de la vitrine LED (`vente-vitrine.jpg`)
  au lieu du dessin de portable. Lignes du tiroir « Ma sélection » : la
  photo du produit quand elle existe.
- Fichiers : `assets/img/produits/ordinateurs/{portables-etudes,
  portables-creation,bureau}/`, `assets/img/conseils/`.

**Reste en dessin** (aucune photo fournie) : accessoires, matériel réseau,
blocs Maintenance (onduleur) et Installation réseau (baie). **À demander au
client** : de vraies photos des postes fixes (aujourd'hui des photos de
cartons/rayons) et du hero — `hero-tablet-desk.jpg` est toujours la photo
de travail Pinterest **sans licence commerciale**, à remplacer avant la
mise en ligne.

## Mode jour seul (septembre 2026)

Décision du client : *« on va rester uniquement sur le mode jour, en fond
blanc, désactive le mode nuit/jour »*. Le site est **figé en mode jour** :
`<html lang="fr" data-theme="light">` en dur dans les trois pages. Retirés :
les boutons soleil/lune (nav + menu mobile), le script anti-flash et
`activerBasculeTheme()`. Un ancien choix « nuit » resté dans le
`localStorage` des visiteurs est simplement ignoré.

**Le CSS des deux thèmes est conservé** (jetons de `:root` = nuit, bloc
`:root[data-theme="light"]` = jour) : pour réactiver la bascule un jour,
remettre les boutons et la fonction (voir l'historique « Bascule jour /
nuit » plus haut). Toutes les notes de ce fichier qui parlent du « mode
nuit » décrivent donc un état non visible aujourd'hui.

## Page Conseils (septembre 2026)

Demande : recréer les conseils autour du ton réel de l'entreprise sur les
réseaux — les idées reçues (« un i7 est plus fort qu'un i5 »), l'ironie
(« vous voulez un carton coûte que coûte… vous allez manger le carton ? »),
le prix (« même prix que les autres : chez qui achèteriez-vous ? — pour le
SAV et la qualité — voilà la vraie différence »). Structure choisie par le
client : **3 conseils sur l'accueil qui mènent à une vraie page
`conseils.html`**, comme le catalogue (le site a donc de nouveau trois pages
+ la 404 ; « Conseils » est revenu dans la nav, lien vers la page).

- `js/data/articles.js` : `RUBRIQUES` (Idées reçues, Le vrai prix, Bien
  choisir, Entretien & sécurité, Entreprise & réseau), champ `rubrique`
  (remplace `categorie`, recalculé pour le code existant), `citation`
  (phrase-choc affichée en grand), nouveau bloc `dialogue` (bulles
  Client / Dilitech dans la lecture). 3 nouveaux posts rédigés dans le ton
  du patron à partir de ses exemples — **à relire par le client**.
- `js/components/carte-conseil.js` : carte « publication » (avatar, date,
  rubrique, citation, chapo), partagée accueil / page. Accueil : lien vers
  `conseils.html?article=slug` ; page : lecture en panneau sur place.
- `conseils.html` + `js/pages/conseils.js` : filtres par rubrique (URL
  `?rubrique=`), le plus récent « à la une » en pleine largeur, liens
  Facebook / TikTok (« ces conseils, nous les publions d'abord ici »).
- Photos : `assets/img/conseils/` (sticker Intel Core i7, carton ThinkPad,
  vitrine pour le prix).

### Conseils = aussi le blog des publications Facebook

Le client : *« la page conseil sert aussi de blog d'articles, regarde la
page Facebook et recense toi-même »*. Relevé fait avec Playwright sur la
page publique (sans connexion, Facebook ne laisse charger que les
publications les plus récentes — **9 accessibles**). 7 reprises sur le
site, texte exact dans un bloc `publication` + un court développement de
notre part ; 2 écartées car hors sujet informatique (un post sur un
consultant en communication, une citation sur la richesse). Textes bruts,
dates relatives et visuels d'origine : `assets/originaux/facebook/`.

- Nouvelles rubriques : **Franc-parler** (phrases du patron), **En
  boutique** (machines du moment — ThinkPad X1 Yoga Gen 7 à 380 000),
  **Auprès de vous** (clients, réussites : le post du diplôme).
- Champs ajoutés : `source` (lien vers la publication ; carte « Facebook »,
  lecture « Voir la publication sur Facebook »), `format: 'texte'`
  (publication sans image → phrase en grand sur fond sombre, comme le post),
  `cadrage` (object-position des photos portrait).
- Piège : dans `.post__visuel` (grille centrée), une image en
  `height: 100%` ne remplissait pas la case et montrait le haut de la photo
  (le plafond au lieu du visage) : les photos sont maintenant en
  `position: absolute; inset: 0`.
- **À signaler au client** : la page Facebook affiche l'e-mail
  `Cisseboubacar605@gmail.com`, le LinkedIn `linkedin.com/company/dilitech`
  et un site `dilitech.odoo.com` ; le site utilise toujours
  `contact@dilitech.ml` (jamais confirmé). Pour ajouter d'autres
  publications : copier le texte dans une entrée d'`ARTICLES` avec
  `source`, et l'image dans `assets/img/conseils/`.

## Fiche produit refaite + galerie (septembre 2026)

Demande : *« un meilleur design, et plusieurs images d'un ordi »*. Panneau
élargi à 1080px ; nouvelle mise en page `.pf` (panneau-produit.js,
`#rendre`) :
- **Galerie** à gauche (reste en place au défilement) : grande photo 4:3,
  flèches, compteur « 2 / 6 », vignettes, flèches du clavier, glisser au
  doigt. Photos : `galerieDe(p)` dans **`js/data/galeries.js`** = photo
  principale, puis les autres vues de la même marque prises en boutique
  (`assets/img/produits/galerie/`), puis la vitrine et les rayons. 3 à 6
  photos par ordinateur. `MEME_PHOTO` évite de montrer deux fois la même
  photo d'origine ; **les postes fixes n'héritent pas des vues de portables**
  de leur marque (trompeur). Note sous la galerie : « Photos prises dans
  notre boutique, sur la gamme de ce modèle — demandez la photo de votre
  machine exacte ». Le jour où le client fournit les photos d'un modèle :
  champ `galerie: [...]` sur le produit, elle passe devant tout.
- À droite : marque · référence · état, nom, résumé, **« Correspond à ce
  que vous nous avez dit »** (si le concierge connaît l'usage, via
  `profil.scoreProduit`), 4 caractéristiques clés en tuiles, bloc prix /
  stock / quantité / ajout, **bouton WhatsApp pré-rempli** avec le produit,
  garanties, usages recommandés.
- En bas : caractéristiques complètes et disponibilité en deux cartes,
  puis « à comparer ».
- Piège : enfants de grille sans `min-width: 0` → la bande de vignettes
  élargissait la colonne au-delà de l'écran sur mobile.

## Accueil raccourci (septembre 2026)

Demande : « la page d'accueil est trop longue, on va optimiser ».

- **Sélection = une seule rangée de 4 ordinateurs**, plus d'onglets
  (Notre choix / Promotions / Nouveautés / Pour vous supprimés ; à la place,
  un lien « Tous les ordinateurs » → `catalogue.html?cat=ordinateurs`).
  `selection()` dans `js/pages/accueil.js` :
  - sans réponse : `parGamme()` — un ordinateur par gamme (`portables-pro`,
    `portables-etudes`, `portables-creation`, `bureau`), le « Notre choix »
    de la gamme de préférence, **une marque différente par case** ;
  - avec réponses : les 4 meilleurs `profil.pourVous()` limités aux
    ordinateurs, complétés par les gammes par défaut s'il en manque.
  CSS : `.grille-produits--rangee` (4 colonnes dès 1100 px, 2 en dessous).
- **Garantie sans durée, partout** (consigne client : « ne dis pas 12 mois,
  ne dis pas de date, mentionne juste la garantie ») : hero, tuile bento A,
  argument 04, métiers, fiche produit (`<b>Garantie</b>`, le champ
  `garantie` des produits reste en données mais n'est plus affiché),
  résumés produits, articles, aide du concierge. **Ne pas réintroduire de
  durée** dans un texte.
- **« Nos métiers » condensé** : les six blocs pleine largeur
  (`.bloc-serv`, filières, étapes du parc) remplacés par une grille
  `.metiers` de six cases `.metier` (photo « Vente » haute à gauche,
  Formations en large avec les filières en puces, Parc en case marine avec
  les 4 étapes). Chaque case garde l'ancre de l'ancien bloc (`#vente`,
  `#maintenance`, `#sav`, `#service-reseau`, `#formation`, `#parc`).
  `servicesIllustrations()`, `FILIERES` et `filieres()` supprimés d'accueil.js
  (les styles `.bloc-serv`/`.filiere` restent dans style.css, inutilisés).

### Réseau, boutique et vie locale condensés

- **Réseau** (`#reseau`, `.reseau2`) : propos + trois chiffres écrits en dur
  (villes, pays, partenaires — l'ancien compteur animé restait parfois à 0)
  à gauche ; à droite six petites cases `.ville` (code pays, ville, pays),
  chacune lien vers `catalogue.html?partenaire=CODE`. Les longues cartes
  `.pdv` (notes, univers, nombre de références) ont disparu.
- **Boutique** (`#boutique`, `.boutique`, rendue par `siege()`) : consigne
  client « supprime les infos concernant le stock, parle juste de la
  boutique » → plus aucune statistique (ordinateurs, accessoires,
  références tenues au siège). Texte boutique, coordonnées + horaires en
  deux colonnes, boutons Maps / Nous écrire, mosaïque de 3 photos
  (mur de portables, rayonnages, conseiller SAV).
- **Vie locale** (`#vie-locale`, `.vie`) : une grande photo des lauréates,
  un chapeau court, la citation de l'attestation 2D Digitals raccourcie,
  trois vignettes, un lien partenariat. Les anciens `.engagement*` sont
  inutilisés.
- Hauteur de l'accueil : ~11 400 → ~9 300 px (bureau), ~18 600 → ~14 400 px
  (mobile).

### Réseau, boutique et conseils — 2e passe (« pas top »)

- **Réseau** (`.reseau3`) : un seul panneau. À gauche, carte marine
  (`carteReseau()`) : les coordonnées de `partenaires.js` sont **étirées**
  sur toute la surface (sinon tout se tasse au centre), lignes pointillées
  en SVG `preserveAspectRatio="none"` + `vector-effect`, points et noms en
  HTML positionnés en % (ronds à toutes les largeurs), Bamako en pastille
  blanche pulsante. À droite : titre, chiffres, 6 villes en liste 2
  colonnes (lien catalogue filtré). Mobile : carte au-dessus, flèches
  masquées sous 420 px.
- **Boutique** (`.boutique2`, `siege()`) : **plus d'horaires** (demande
  client), plus de stock. Carte photo immersive : mur de portables en fond,
  dégradé marine, coordonnées en pastilles, boutons « Venir à la boutique »
  (Maps) et « Appeler », deux vignettes inclinées à droite (bureau). Mobile :
  photo en bandeau, texte dessous. `HORAIRES` n'est plus importé par
  accueil.js (toujours utilisé ailleurs via config.js si besoin).
- **Conseils (aperçu)** : bureau = le plus récent en grand à gauche, les
  deux autres en lignes horizontales à droite (sans chapô ni réseau
  d'origine) ; tablette = le grand en pleine largeur puis deux cartes ;
  mobile = le grand puis deux lignes compactes vignette + titre. Le lien
  « Tous nos conseils » repasse à droite du titre.

## Stack

- **100 % statique** : HTML / CSS / **modules ES natifs**. Aucun framework,
  aucun build, aucune dépendance npm. Se dépose tel quel sur n'importe quel
  hébergement.
- Une seule ressource externe : **Montserrat** via Google Fonts.
- Dev local : `python tools/servir.py` → **http://127.0.0.1:5610**
  ⚠ viser **`127.0.0.1`**, pas `localhost` (capté par Docker/WSL sur ce poste).
- Les modules ES **exigent un serveur** : ouvrir `index.html` en `file://` ne
  marchera pas.
- Vérification visuelle : Playwright, appelé depuis le dossier temporaire —
  aucune dépendance ajoutée au projet.

## Pages — deux, depuis septembre 2026

Le site tenait sur 9 pages jusqu'à une demande explicite du client :
*« je veux voir tout sur une seule page, un site single page comme pour
Toguna Motors, il y'aura juste une page à part pour le catalogue »*, puis
*« si tu peux même supprimer les autres pages HTML, garde juste l'index.html
et le catalogue.html »*. Voir « Fusion en page unique » plus bas pour
l'historique complet de cette passe.

| Fichier | Contenu |
|---|---|
| `index.html` | hero, marques, univers, sélection du moment, « le conseil avant le produit », **services condensés** (grille de 6 métiers), **réseau complet** (siège, 6 partenaires, vie locale, comment ça se passe), **conseils complets** (filtrable, 6 articles) — le contact tient dans le pied de page (`<site-pied>`, présent sur les deux pages), pas de grande section dédiée |
| `catalogue.html` | filtres, recherche, tri, grille par tranches — seule page restée à part (filtres + recherche en justifient une) |
| `404.html` | page d'erreur — gardée pour l'hébergeur, jamais un lien de nav |

**Fiche produit et lecture d'un article ne sont plus des pages** —
`produit.html` et `article.html` ont été supprimées. Elles s'ouvrent en
**panneau superposé** (`<panneau-produit>`, `<panneau-article>`, même
mécanique que `<panneau-devis>`) par-dessus la page courante, avec l'état
dans l'URL (`?produit=DT-…`, `?article=slug`) pour rester partageables —
voir « Panneaux superposés » plus bas.

**Il n'y a AUCUN script de génération de pages.** La navigation et le pied de
page sont des **éléments personnalisés** — `<site-entete page="…">` et
`<site-pied>` — définis dans `js/components/chrome.js`. Modifier ce fichier
met les deux pages à jour. (C'est la différence avec Farafinatignɛ, qui
regénérait ses pages avec `tools/build-pages.py`.)

## Architecture JS

```
js/
  config.js               coordonnées, horaires, réseaux, format des prix
  data/
    produits.js           SOURCE UNIQUE : 55 références, 3 catégories, 26 marques
    partenaires.js        les 7 points de vente
    articles.js           6 conseils, corps en blocs typés (jamais de HTML brut)
    illustrations.js      22 dessins d'appareils
  core/
    dom.js                $, $$, esc, html``, debounce, parFrame, definirParametre
    store.js              magasin réactif : Proxy + localStorage + BroadcastChannel
    catalogue.js          ★ COUCHE D'ACCÈS — filtres, tri, disponibilité, stats
    devis.js              sélection, quantités, message WhatsApp
    ui.js                 apparition au défilement, notifications, piège à focus,
                           scrollspy de nav (activerScrollspy)
    icones.js             jeu d'icônes
  components/
    chrome.js              <site-entete> et <site-pied>
    carte-produit.js       la carte, une seule pour tout le site
    panneau-devis.js       <panneau-devis>, le tiroir de sélection
    panneau-produit.js     <panneau-produit>, fiche produit en panneau (ex-produit.html)
    panneau-article.js     <panneau-article>, lecture d'un article en panneau (ex-article.html)
  pages/
    commun.js              ★ chargé par les deux pages, délégation globale,
                            injecte les trois panneaux
    accueil.js              TOUT index.html : hero, univers, sélection, services,
                            réseau (siège+partenaires+vie locale), conseils
    catalogue.js            catalogue.html
```

Les anciens `services.js`, `reseau.js`, `conseils.js`, `contact.js`,
`produit.js` et `article.js` ont été **fusionnés dans `accueil.js`** (le
rendu) et dans `panneau-produit.js`/`panneau-article.js` (les deux fiches).
Rien n'a été réécrit dans la logique elle-même, seulement déplacé — même
balisage, mêmes classes CSS, mêmes fonctions de `core/catalogue.js`.

### Les deux fichiers à comprendre avant de toucher au reste

**`js/core/catalogue.js`** — *aucune page ne lit `PRODUITS` directement.*
C'est la couture prévue avec la phase 2 : quand le logiciel de gestion
exposera son API, seule la fonction `charger()` change. Le reste du site ne
bouge pas d'une ligne, à condition que l'API renvoie des produits de la même
forme (`dispo` compris).

**`js/pages/commun.js`** — pose la **délégation globale** des clics sur
`document` : `.js-ajouter` et `.js-ouvrir-devis` fonctionnent d'où qu'ils
viennent. C'est ce qui permet de re-rendre les grilles librement (filtres,
recherche, tranches) **sans jamais rebrancher d'écouteurs ni en laisser fuir**.

### Décisions techniques à connaître

- **L'état des filtres du catalogue vit dans l'URL**, pas dans une variable.
  Un filtrage est donc partageable, le bouton « précédent » défait le dernier
  filtre, et un rechargement ne perd rien. La frappe et le curseur de prix
  utilisent `replaceState` (pas d'historique pollué), les cases `pushState`.
- **Le magasin (`store.js`) persiste et diffuse `brutEtat`, jamais `etat`** :
  ce dernier est un Proxy, et `structuredClone` refuse de cloner un Proxy.
  Ça avait cassé la synchro entre onglets.
- **Le stock exact n'est jamais montré** au visiteur : c'est une donnée
  commerciale et elle bouge. On affiche « En stock » / « Dernières pièces » /
  « Sur commande », et le nombre de **références** par point de vente.
- **Les références `DT-PC-001`… sont générées** en fin de `produits.js`, dans
  l'ordre du tableau : **insérer un produit au milieu décale toutes les
  suivantes** — ajouter en fin de bloc de sous-catégorie.
- **Les panneaux superposés** (`panneau-devis.js`, `panneau-produit.js`,
  `panneau-article.js`) partagent tous la même mécanique : voile, piège à
  focus (`piegerFocus`), verrouillage du défilement, classe `.est-ouvert`
  pour la transition. `panneau-produit`/`panneau-article` ajoutent en plus
  `definirParametre()` (`core/dom.js`) pour que `?produit=`/`?article=`
  vivent dans l'URL — un lien vers une fiche reste donc partageable, et le
  bouton « précédent » referme le panneau au lieu de quitter le site.

## Le parcours de devis

C'est le seul tunnel du site. **Aucun paiement en ligne** — hors périmètre V1.

1. Le visiteur ajoute des produits depuis n'importe où (`.js-ajouter`)
2. La sélection vit dans `localStorage` et **se synchronise entre les onglets**
   (BroadcastChannel)
3. Le tiroir `<panneau-devis>` ou le formulaire de `index.html#contact` —
   **le même moteur** — collecte nom et téléphone (**obligatoires**)
4. Un récapitulatif texte part sur **WhatsApp**, avec les références `DT-…`
   pour que la saisie côté Dilitech soit sans ambiguïté. Repli par e-mail.

**Le point d'accroche de la phase 2 est unique** : `devis.soumettre()` dans
`js/core/devis.js`. C'est là qu'il faudra poster la demande à l'API pour créer
le Devis et la fiche Client. Le renvoi WhatsApp reste, il ne le remplace pas.

## Contenu à faire valider par le client

Le site est complet et cohérent, mais une partie du contenu a été **rédigée
faute d'information fournie**. À revoir avec Dilitech :

- **Les 55 produits et leurs prix en FCFA** : références et tarifs plausibles
  pour le marché de Bamako, mais ce n'est **pas le stock réel**. À remplacer
  par le vrai catalogue.
- **Les quantités par point de vente** (`dispo`) : inventées, elles servent à
  faire fonctionner l'affichage de disponibilité.
- **L'e-mail et le domaine** (`contact@dilitech.ml`, `dilitech.ml`).
- **Les horaires d'ouverture** : hypothèse raisonnable, non communiquée.
- **Les quartiers des partenaires** (Plateau, Kaloum, Bè…) et leurs notes.
- **Les six articles de conseil** : le fond est juste, la signature « nous »
  engage Dilitech — à relire.
- Les liens **Instagram** et **LinkedIn**.

## Ce qui reste à faire (phase 2)

Le cahier des charges prévoit, en plus de ce qui est livré :

- Back-office simple : gestion du catalogue (produits, prix, photos) et
  historique des messages reçus
- CRM : fiche client enrichie (métier, profil de pouvoir d'achat, centres
  d'intérêt), **score client**, suivi des devis jusqu'à la vente, relances
- **Contrainte métier forte** : aucune vente sans fiche client — `FK NOT NULL`
  en base, pas seulement une validation côté application
- Gestion commerciale et stocks multi-sites **en temps réel**, alertes de
  seuil, fournisseurs, facturation, tickets SAV
- Tableau de bord temps réel, comptes par rôle
- Déploiement VPS : domaine, HTTPS, pare-feu, sauvegardes, supervision
