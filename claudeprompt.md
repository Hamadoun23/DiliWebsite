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

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | hero, marques, 3 univers, sélection du moment, « le conseil avant le produit », services, réseau, conseils, appel |
| `catalogue.html` | filtres, recherche, tri, grille par tranches |
| `produit.html?id=` | fiche : specs, prix, **disponibilité par partenaire**, similaires |
| `services.html` | 6 métiers, filières de formation, équipement de parc |
| `reseau.html` | le siège, les 6 partenaires, comment ça se passe |
| `conseils.html` | liste filtrable par thème |
| `article.html?a=` | lecture d'un article + produits recommandés |
| `contact.html` | formulaire de devis, coordonnées, questions fréquentes |
| `404.html` | page d'erreur |

**Il n'y a AUCUN script de génération de pages.** La navigation et le pied de
page sont des **éléments personnalisés** — `<site-entete page="…">` et
`<site-pied>` — définis dans `js/components/chrome.js`. Modifier ce fichier
met les neuf pages à jour. (C'est la différence avec Farafinatignɛ, qui
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
    dom.js                $, $$, esc, html``, debounce, parFrame
    store.js              magasin réactif : Proxy + localStorage + BroadcastChannel
    catalogue.js          ★ COUCHE D'ACCÈS — filtres, tri, disponibilité, stats
    devis.js              sélection, quantités, message WhatsApp
    ui.js                 apparition au défilement, notifications, piège à focus
    icones.js             jeu d'icônes
  components/
    chrome.js             <site-entete> et <site-pied>
    carte-produit.js      la carte, une seule pour tout le site
    panneau-devis.js      <panneau-devis>, le tiroir de sélection
  pages/
    commun.js             ★ chargé par toutes les pages, délégation globale
    accueil.js catalogue.js produit.js services.js reseau.js conseils.js
    article.js contact.js
```

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
- Les modules de page qui appellent des `const` fléchées définies plus bas
  doivent **placer leur aiguillage en fin de fichier** (zone morte
  temporelle). C'est le cas de `produit.js`, et c'est commenté sur place.

## Le parcours de devis

C'est le seul tunnel du site. **Aucun paiement en ligne** — hors périmètre V1.

1. Le visiteur ajoute des produits depuis n'importe où (`.js-ajouter`)
2. La sélection vit dans `localStorage` et **se synchronise entre les onglets**
   (BroadcastChannel)
3. Le tiroir `<panneau-devis>` ou le formulaire de `contact.html` — **le même
   moteur** — collecte nom et téléphone (**obligatoires**)
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
