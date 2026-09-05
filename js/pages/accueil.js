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
import { activerReveal, activerCompteurs, activerSpotlightHero } from '../core/ui.js';

/* --- hero : chiffres ---------------------------------------------------
   Le visuel du hero est désormais une photo (voir index.html) : rien à
   calculer côté JS pour lui. Seule la bande de preuves reste dynamique. */

function hero() {
  const s = cat.statistiques();

  rendre(
    '[data-preuves]',
    [
      { n: s.references, mot: 'références' },
      { n: s.marques,    mot: 'marques' },
      { n: s.villes,     mot: 'villes' },
    ]
      .map(
        (p) => `<li class="hero__stat">
                  <b data-compteur="${p.n}">0</b>
                  <span>${esc(p.mot)}</span>
                </li>`
      )
      .join('')
  );

  activerSpotlightHero();
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

/* --- les trois univers ------------------------------------------------- */

function univers() {
  rendre(
    '[data-univers]',
    cat.CATEGORIES.map((c) => {
      const n = cat.filtrer({ cat: c.code }).length;
      return `
        <article class="univ reveal">
          <p class="univ__nb">${n} réf.</p>
          <span class="univ__illus">${illustration(c.illus)}</span>
          <h3 class="univ__nom">${esc(c.nom)}</h3>
          <p class="univ__txt">${esc(c.accroche)}</p>
          <div class="univ__sous">
            ${c.sous
              .map(
                (s) =>
                  `<a href="catalogue.html?cat=${c.code}&sous=${s.code}">${esc(s.nom)}</a>`
              )
              .join('')}
          </div>
        </article>`;
    }).join('')
  );
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
activerCompteurs();
