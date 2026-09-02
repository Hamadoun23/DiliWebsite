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

## Deuxième retour : hero avec vraie photo (septembre 2026)

Le premier jet de la passe premium (ci-dessus, tout en dessin/CSS) n'a pas
convaincu le client : il voulait le niveau **EventMotors/WebsiteEvent**
(`event.toguna-motors.com`), avec de vraies photos plutôt que des
illustrations au trait. Il a fourni trois captures Pinterest en référence
(monitor mockup, jet privé « Aeroluxe », drone « MDR Ultra Light » —
toutes : produit qui flotte dans un fond noir, avec une lueur).

**Sur le sourcing d'image** : le client a d'abord demandé de « télécharger
depuis Pinterest ». Refusé — un pin agrège des images de sources et de
licences très variées (souvent repostées sans mention), impossible à tracer
pour un usage commercial client. À la place : photographie **sous licence
Unsplash** (gratuite, usage commercial explicitement autorisé, aucune
autorisation à demander), trouvée par recherche puis téléchargée.

⚠ **Piège d'environnement** : le `Bash` de cet environnement n'a **aucun
accès réseau sortant** (`curl` timeout sur tout hôte externe) — seuls les
outils `WebFetch`/`WebSearch` peuvent atteindre l'extérieur, et ils ne
renvoient que du texte, pas des octets bruts. **`PowerShell` en revanche a
un accès réseau normal** : `Invoke-WebRequest` fonctionne. C'est le chemin
à reprendre pour tout téléchargement de fichier binaire futur dans ce
projet.

- **Photo retenue** : *black laptop computer turned on in dim light*, par
  **Martin Katler** (@martinkatler) sur Unsplash, licence Unsplash. URL
  source :
  `https://unsplash.com/photos/black-laptop-computer-turned-on-in-dim-light-o9XN28KdyN8`.
  Choisie plutôt que la photo d'Andras Vas (*MacBook Pro turned on*,
  `Bd7gNnWJBkU`) parce que cette dernière est l'une des photos de stock les
  plus réutilisées du web (elle traîne sur des centaines de templates) — la
  reprendre aurait fait « site fait avec un template » plutôt que
  « site sur mesure ». Enregistrée dans `assets/img/hero-laptop.jpg`.
- **Le portable est un MacBook — Dilitech vend toutes marques.** Point
  assumé, pas oublié : le client a explicitement demandé cette imagerie.
  Mais si un jour la question se pose (« pourquoi un Mac sur le site d'un
  revendeur multi-marques ? »), la réponse honnête est qu'aucune
  alternative neutre de cette qualité dramatique n'a été trouvée en licence
  libre dans le temps imparti — à revoir si le client founit ses propres
  photos de vitrine.
- **Traitement colorimétrique** : la photo source est nativement
  rose/orange/bleu (rétroéclairage RGB générique). `filter: saturate(.5)
  brightness(.8) contrast(1.08)` sur `.heros__photo` la ramène vers des
  bleus proches de la charte, et les halos cyan existants (`.halos`,
  `mix-blend-mode: screen`) sont repositionnés par-dessus pour renforcer la
  couleur de marque au lieu de simplement flotter à côté.
- **Composition** : source portrait (2400×3600) affichée en fond de hero
  large via `background-size: cover` — la majeure partie de la hauteur
  sort du cadre. `background-position: 68% 73%` a été trouvé **par
  itération visuelle** (calcul de la fenêtre visible, puis capture d'écran,
  puis ajustement) pour que le clavier reste dans le cadre plutôt que le
  bureau vide sous la machine. Si la photo change, refaire cette itération
  — ne pas deviner la valeur.
- L'ancien visuel (disque + barres du logo en SVG, orbite de pastilles de
  marques) a été **entièrement retiré** — plus utilisé nulle part ailleurs
  sur le site, sa CSS morte a été supprimée avec lui (`.disque*`,
  `.orbite*`, `@keyframes tourner/flotter`), ainsi que les deux lignes de
  `js/pages/accueil.js` qui le remplissaient.
- **Aussi intégrée** : une vraie photo Dilitech (pas du stock) dans le bloc
  Service après-vente de `services.html` — recadrée depuis un visuel de
  communication du client, voir `assets/img/agent-sav.jpg` et le
  commentaire au-dessus de `.bloc-serv__vis--photo` dans `style.css`.

**Reste à faire si le client fournit ses propres photos** : remplacer
`assets/img/hero-laptop.jpg` par une vraie photo Dilitech (showroom, un
poste en vente) suffit — aucune classe CSS à toucher, `background-position`
à réitérer comme ci-dessus si le cadrage source diffère.

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
