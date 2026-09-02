# Dilitech — site vitrine & catalogue numérique

Site public de **Dilitech** (Bamako, Torokorobougou) : vente d'ordinateurs
portables et d'accessoires informatiques, matériel réseau, maintenance PC, SAV
et formations professionnelles.

Réalisation **Dymo Labs** — phase 1 du cahier des charges du 08/08/2026.

---

## Démarrer

Le site est **entièrement statique**, mais il utilise les **modules ES** :
il lui faut un serveur, `file://` ne suffit pas.

```bash
python tools/servir.py
# →  http://127.0.0.1:5610
```

> Viser **`127.0.0.1`** et non `localhost` : sur un poste où Docker ou WSL
> tourne, `localhost` part en IPv6 vers un autre service.

Aucune installation, aucune dépendance, aucune étape de construction.

## Mettre en ligne

Déposer le contenu de ce dossier à la racine du serveur web. C'est tout.

Deux réglages côté hébergement :

1. **HTTPS** (exigé par le cahier des charges).
2. Rediriger les erreurs 404 vers `/404.html`. En Apache :
   ```apache
   ErrorDocument 404 /404.html
   ```

Avant la mise en production, remplacer le domaine `www.dilitech.ml` dans
`js/config.js`, `robots.txt`, `sitemap.xml` et les balises `canonical` des
pages, s'il change.

---

## Structure

```
index.html          accueil
catalogue.html      catalogue filtrable
produit.html?id=    fiche produit
services.html       les six métiers
reseau.html         siège et partenaires
conseils.html       conseils d'achat
article.html?a=     lecture d'un conseil
contact.html        devis et coordonnées
404.html            page d'erreur

style.css           feuille de style unique
assets/             logo et favicon
js/
  config.js         coordonnées, horaires, format des prix
  data/             produits, partenaires, articles, illustrations
  core/             magasin d'état, catalogue, devis, interface, icônes
  components/       en-tête, pied de page, carte produit, panneau de devis
  pages/            un module par page
tools/servir.py     serveur de développement
```

---

## Modifier le contenu

### Ajouter ou corriger un produit

Tout est dans **`js/data/produits.js`**. Un produit ressemble à ceci :

```js
{
  cat: 'ordinateurs', sous: 'portables-pro', marque: 'HP', illus: 'ultrabook',
  nom: 'HP EliteBook 840 G9', prix: 895000, etat: 'neuf', garantie: '12 mois',
  usages: ['professionnel', 'bureautique'], tag: 'best',
  resume: "Une phrase qui dit à qui cette machine s'adresse.",
  specs: { Processeur: '…', Mémoire: '…' },
  dispo: { BKO: 7, ABJ: 4 },        // quantité par point de vente
}
```

- `tag` : `'best'` (notre choix), `'promo'`, `'nouveau'`, ou `null`
- `prixBarre` : ancien prix, pour afficher une remise
- `illus` : famille de dessin — voir les clés de `js/data/illustrations.js`
- `img` : chemin d'une **photo**, si vous en avez une. Elle recouvre alors le
  dessin, qui reste en repli si le fichier manque.

> ⚠ Les références `DT-PC-001`, `DT-AC-001`… sont **générées automatiquement**
> dans l'ordre du tableau. Insérer un produit au milieu décale toutes les
> suivantes : ajoutez plutôt **en fin de bloc de sous-catégorie**.

Le reste du site suit tout seul : compteurs de l'accueil, filtres, marques,
promotions, chiffres du réseau.

### Changer un numéro, une adresse, des horaires

**`js/config.js`**, et nulle part ailleurs. Aucune coordonnée n'est écrite en
dur dans les pages.

### Modifier la navigation ou le pied de page

**`js/components/chrome.js`**. Les neuf pages se mettent à jour ensemble —
il n'y a rien à regénérer.

### Écrire un article de conseil

**`js/data/articles.js`**. Le corps est une suite de blocs typés :

```js
corps: [
  { t: 'p', v: 'Un paragraphe.' },
  { t: 'h', v: 'Un sous-titre' },
  { t: 'liste', v: ['Premier point', 'Deuxième point'] },
  { t: 'note', v: 'Un encadré mis en avant.' },
]
```

Pas de HTML dans les données : tout est échappé au rendu. Ajoutez
`produits: ['DT-PC-001', …]` pour terminer l'article par des références du
catalogue.

---

## Ce qui a guidé les choix

- **La charte graphique de février 2025** : bleu marine `#302784`, bleu clair
  `#009FE3`, Montserrat en Bold et ExtraLight.
- **Le contraste du logo** — « DILI » gras, « TECH » maigre — est devenu la
  règle de tous les titres du site.
- **Mobile d'abord**, vérifié de 320 px à 1440 px.
- **Accessibilité** : contrastes mesurés (le bleu clair de la charte est
  illisible en petit sur blanc — deux dérivées ont été calculées pour ça),
  navigation au clavier, focus visible, animations désactivées si le système
  le demande.

Le détail des décisions est dans **`claudeprompt.md`**.

---

## Phase 2

Le logiciel de gestion (CRM, stocks temps réel, back-office, VPS) reste à
faire. Le site est déjà préparé pour s'y brancher :

- `js/core/catalogue.js` — remplacer `charger()` par un appel à l'API ;
  aucune page ne lit les données produits directement.
- `js/core/devis.js` — `soumettre()` est le point unique où poster une demande
  de devis pour créer le Devis et la fiche Client.
