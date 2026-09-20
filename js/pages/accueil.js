/* =========================================================================
   DILITECH — page d'accueil
   -------------------------------------------------------------------------
   Tout ce qui est chiffré ou listé sur l'accueil est CALCULÉ depuis le
   catalogue, jamais recopié dans le HTML : le nombre de références, les
   marques du bandeau, les sous-catégories, la sélection du moment, les
   villes du réseau, les derniers articles. Ajouter un produit met la page
   d'accueil à jour sans y toucher.
   ========================================================================= */

import './commun.js';

import * as cat from '../core/catalogue.js';
import { PARTENAIRES } from '../data/partenaires.js';
import { ARTICLES, dateLisible } from '../data/articles.js';
import { illustration } from '../data/illustrations.js';
import { carteProduit } from '../components/carte-produit.js';
import { $, $$, esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal, activerSpotlightHero, masquerBulleWaSurHero } from '../core/ui.js';

/* --- hero : trio ---------------------------------------------------------
   Le hero (voir index.html) reprend la composition de la référence STEP
   Sneakers. Les puces « marques disponibles » ont été retirées (demande du
   client) — leur espace reste réservé en CSS (.hero__specs-vide). Le trio
   du bas mélange deux faits fixes déjà énoncés plus bas sur la page
   (garantie, SAV) avec le réseau, seul chiffre encore calculé ici. */

function hero() {
  const s = cat.statistiques();

  const villes = $('[data-hero-villes]');
  if (villes) villes.textContent = `Réseau ${s.villes} villes`;

  activerSpotlightHero();
  masquerBulleWaSurHero();
}

/* --- bandeau des marques ---------------------------------------------- */

function marques() {
  /* La piste est dupliquée : c'est ce qui permet à l'animation de reboucler
     sans saut visible (on translate de -50 %). */
  const une = cat.MARQUES.map(
    (m) => `<a class="marques__m" href="catalogue.html?marque=${encodeURIComponent(m)}">${esc(m)}</a>`
  ).join('');
  rendre('[data-marques]', une + une);
}

/* --- l'univers Dilitech (bento) -----------------------------------------
   Grille reprise à la lettre depuis Docs/section/univers (cartes
   catégories).jfif — voir index.html pour la structure des sept tuiles.
   Tout le contenu vient du catalogue et du réseau, rien n'est inventé. */

function bentoChips() {
  const [premiere, seconde] = cat.MARQUES;
  rendre(
    '[data-bento-chips]',
    [premiere, seconde]
      .map((m) => `<span>${esc(m.slice(0, 2).toUpperCase())}</span>`)
      .join('') + `<span>+${cat.MARQUES.length - 2}</span>`
  );
}

/* Carte du réseau, réduite à des points reliés au siège — les coordonnées
   (PARTENAIRES[].coords, en pourcentage) attendaient un usage depuis leur
   création ; aucune n'est inventée ici. */
function bentoCarte() {
  const siege = PARTENAIRES.find((p) => p.role === 'siege');
  const autres = PARTENAIRES.filter((p) => p.role !== 'siege');

  const lignes = autres
    .map(
      (p) =>
        `<line x1="${siege.coords.x}" y1="${siege.coords.y}" x2="${p.coords.x}" y2="${p.coords.y}"
               stroke="rgba(79,195,240,.25)" stroke-width=".6"/>`
    )
    .join('');
  const points = autres
    .map((p) => `<circle cx="${p.coords.x}" cy="${p.coords.y}" r="2.2" fill="rgba(255,255,255,.55)"/>`)
    .join('');

  /* La pastille « Bamako » suit le point du siège (siege.coords, en %) —
     même repère que le SVG, donc un simple left/top en pourcentage suffit
     à la poser dessus, comme le pavé « Argentina » sur la carte de la
     référence. Rendue ici plutôt qu'en HTML statique : `rendre()` remplace
     tout le contenu de la tuile, un élément figé dans l'index.html serait
     écrasé à chaque appel. */
  rendre(
    '[data-bento-carte]',
    `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%">
      ${lignes}
      ${points}
      <circle cx="${siege.coords.x}" cy="${siege.coords.y}" r="4" style="fill:var(--cyan-2)"/>
      <circle cx="${siege.coords.x}" cy="${siege.coords.y}" r="4" fill="none" style="stroke:var(--cyan-2)" stroke-width="1" opacity=".5">
        <animate attributeName="r" values="4;9;4" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".5;0;.5" dur="2.4s" repeatCount="indefinite"/>
      </circle>
    </svg>
    <span class="bento__carte-pill" style="left:${siege.coords.x}%; top:${siege.coords.y}%">${esc(siege.ville)}</span>`
  );
}

function univers() {
  const s = cat.statistiques();
  const references = $('[data-bento-references]');
  if (references) references.textContent = s.references;
  const villes = $('[data-bento-villes]');
  if (villes) villes.textContent = s.villes;

  bentoChips();
  bentoCarte();
}

/* --- sélection du moment (onglets) -------------------------------------- */

const VUES = {
  best:    { nom: 'Notre choix', liste: () => cat.recommandes() },
  promo:   { nom: 'Promotions',  liste: () => cat.promotions() },
  nouveau: { nom: 'Nouveautés',  liste: () => cat.nouveautes() },
};

function selection() {
  const barre = $('[data-onglets]');
  const zone = $('[data-selection]');
  if (!barre || !zone) return;

  barre.innerHTML = Object.entries(VUES)
    .map(
      ([cle, v], i) =>
        `<button type="button" role="tab" class="onglet${i === 0 ? ' est-actif' : ''}"
                 data-vue="${cle}" aria-selected="${i === 0}">${esc(v.nom)}</button>`
    )
    .join('');

  const afficher = (cle) => {
    const liste = VUES[cle].liste().slice(0, 8);
    zone.innerHTML = `<div class="grille-produits">${liste
      .map((p) => carteProduit(p))
      .join('')}</div>`;
    /* Les cartes viennent d'être créées : il faut les inscrire à
       l'observateur d'apparition, sinon elles restent invisibles. */
    activerReveal(zone);
  };

  barre.addEventListener('click', (e) => {
    const b = e.target.closest('[data-vue]');
    if (!b) return;
    for (const autre of $$('.onglet', barre)) {
      const actif = autre === b;
      autre.classList.toggle('est-actif', actif);
      autre.setAttribute('aria-selected', String(actif));
    }
    afficher(b.dataset.vue);
  });

  afficher('best');
}

/* --- services ----------------------------------------------------------- */

const SERVICES = [
  {
    ic: 'portable', ancre: 'vente', titre: 'Vente & conseil',
    txt: "Ordinateurs portables et fixes, toutes marques, neufs ou reconditionnés garantis, plus tous les accessoires du poste de travail.",
  },
  {
    ic: 'outil', ancre: 'maintenance', titre: 'Maintenance PC',
    txt: "Diagnostic, nettoyage, remplacement de batterie ou de disque, réinstallation système, récupération de données. Devis avant intervention.",
  },
  {
    ic: 'bouclier', ancre: 'sav', titre: 'Service après-vente',
    txt: "Suivi des garanties, prise en charge des retours, prêt de matériel selon disponibilité. Le SAV est assuré par l'équipe qui a vendu.",
  },
  {
    ic: 'reseau', ancre: 'reseau', titre: 'Installation réseau',
    txt: "Relevé de couverture, câblage Cat 6, baies brassées, bornes Wi-Fi, vidéosurveillance. Du plan d'implantation à la mise en service.",
  },
  {
    ic: 'diplome', ancre: 'formation', titre: 'Formations professionnelles',
    txt: "Bureautique, analyse de données, programmation, gestion de projet, finance, droit et cybersécurité. Sessions en présentiel à Bamako.",
  },
  {
    ic: 'boite', ancre: 'parc', titre: 'Équipement de parc',
    txt: "Chiffrage poste par poste, matériel homogène, livraison et installation sur site, coordination avec nos partenaires régionaux.",
  },
];

function services() {
  rendre(
    '[data-services]',
    SERVICES.map(
      (s) => `
      <article class="serv reveal">
        <span class="serv__ic">${icone(s.ic)}</span>
        <h3>${esc(s.titre)}</h3>
        <p>${esc(s.txt)}</p>
        <a class="lien-fleche" href="services.html#${s.ancre}">En savoir plus ${icone('fleche')}</a>
      </article>`
    ).join('')
  );
}

/* --- aperçu du réseau ---------------------------------------------------- */

function reseau() {
  /* Le siège d'abord, puis les deux partenaires les mieux dotés : l'accueil
     donne un aperçu, la page dédiée donne la liste complète. */
  const stockPar = (code) =>
    cat.tous().reduce((n, p) => n + (p.dispo[code] ?? 0), 0);

  const liste = [
    PARTENAIRES[0],
    ...PARTENAIRES.slice(1).sort((a, b) => stockPar(b.code) - stockPar(a.code)).slice(0, 2),
  ];

  rendre(
    '[data-reseau-apercu]',
    liste
      .map(
        (p) => `
      <article class="pdv reveal${p.role === 'siege' ? ' pdv--siege' : ''}">
        <div class="pdv__tete">
          <span class="pdv__dr" aria-hidden="true">${esc(p.iso)}</span>
          <div>
            <p class="pdv__ville">${esc(p.ville)}</p>
            <p class="pdv__pays">${esc(p.pays)}</p>
          </div>
        </div>
        <p class="pdv__role">${esc(p.libelleRole)}</p>
        <p class="pdv__note">${esc(p.note)}</p>
        <a class="lien-fleche pdv__lien" href="catalogue.html?partenaire=${p.code}">
          Voir ce qui est disponible ${icone('fleche')}
        </a>
      </article>`
      )
      .join('')
  );
}

/* --- derniers articles ---------------------------------------------------- */

function articles() {
  rendre(
    '[data-articles]',
    ARTICLES.slice(0, 3)
      .map(
        (a) => `
      <article class="art reveal">
        <a class="art__visuel" href="article.html?a=${encodeURIComponent(a.slug)}" aria-hidden="true" tabindex="-1">
          ${illustration(a.illus)}
        </a>
        <div class="art__corps">
          <p class="art__meta">${esc(a.categorie)} <span>· ${esc(dateLisible(a.date))}</span></p>
          <h3><a href="article.html?a=${encodeURIComponent(a.slug)}">${esc(a.titre)}</a></h3>
          <p class="art__chapo">${esc(a.chapo)}</p>
          <a class="lien-fleche" href="article.html?a=${encodeURIComponent(a.slug)}">
            Lire — ${a.lecture} min ${icone('fleche')}
          </a>
        </div>
      </article>`
      )
      .join('')
  );
}

/* --- note de bas d'appel à l'action --------------------------------------- */

function noteCta() {
  const s = cat.statistiques();
  rendre(
    '[data-cta-note]',
    `${s.references} références en ligne · ${s.marques} marques · réponse sous 24 h ouvrées`
  );
}

/* --- montage ------------------------------------------------------------- */

hero();
marques();
univers();
selection();
services();
reseau();
articles();
noteCta();

activerReveal();
