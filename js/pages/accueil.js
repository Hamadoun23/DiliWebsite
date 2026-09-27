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
import * as profil from '../core/profil.js';
import { PARTENAIRES, SIEGE } from '../data/partenaires.js';
import { ARTICLES } from '../data/articles.js';
import { carteConseil } from '../components/carte-conseil.js';
import { carteProduit } from '../components/carte-produit.js';
import { CONTACT } from '../config.js';
import { $, esc, rendre } from '../core/dom.js';
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

/* --- la sélection : quatre ordinateurs, une seule rangée -----------------
   Pas d'onglets : la rangée se compose seule.
     — sans réponse : un ordinateur par gamme (pro, études, création,
       bureau), le « Notre choix » de la gamme s'il y en a un, une
       marque différente à chaque fois ;
     — avec des réponses : les quatre ordinateurs qui leur correspondent le
       mieux (profil.scoreProduit), complétés par les gammes par défaut si le
       profil en trouve moins de quatre. */

const GAMMES = ['portables-pro', 'portables-etudes', 'portables-creation', 'bureau'];
const N_SELECTION = 4;

function parGamme() {
  const ordis = cat.filtrer({ cat: 'ordinateurs', tri: 'pertinence' });
  /* Une marque différente par case quand c'est possible : quatre gammes
     en quatre fois « HP » ne montreraient pas l'étendue du stock. */
  const marques = new Set();
  return GAMMES.map((g) => {
    const gamme = ordis.filter((p) => p.sous === g);
    const neuves = gamme.filter((p) => !marques.has(p.marque));
    const p = neuves.find((x) => x.tag === 'best') ?? neuves[0] ?? gamme[0];
    if (p) marques.add(p.marque);
    return p;
  }).filter(Boolean);
}

function quatreOrdinateurs() {
  const defaut = parGamme();
  if (profil.estVide()) return defaut;
  const choisis = profil.pourVous(99).filter((p) => p.cat === 'ordinateurs').slice(0, N_SELECTION);
  for (const p of defaut) {
    if (choisis.length >= N_SELECTION) break;
    if (!choisis.includes(p)) choisis.push(p);
  }
  return choisis;
}

function selection() {
  const zone = $('[data-selection]');
  const puces = $('[data-usage-puces]');
  const resume = $('[data-usage-resume]');
  if (!zone) return;

  /* Tout ce qui dépend des réponses : titre, puces, résumé, la rangée.
     Rappelé à chaque réponse, d'où qu'elle vienne (puces, concierge, autre
     onglet du navigateur). */
  const refleter = () => {
    const connu = !profil.estVide();

    $('[data-selection-surtitre]').textContent = connu ? 'D’après vos réponses' : 'Un ordinateur par gamme';
    const prenom = profil.prenom();
    $('[data-selection-titre]').innerHTML = connu
      ? `Sélectionné <em>pour vous${prenom ? `, ${esc(prenom)}` : ''}.</em>`
      : 'Notre sélection <em>du moment.</em>';

    const choisis = new Set(profil.etat().usages);
    if (puces) {
      puces.innerHTML = cat.USAGES.map(
        (u) => `<button type="button" class="puce-usage" data-usage="${esc(u.code)}"
                        aria-pressed="${choisis.has(u.code)}" title="${esc(u.desc)}">${esc(u.nom)}</button>`
      ).join('');
    }
    if (resume) {
      resume.hidden = !connu;
      resume.innerHTML = connu
        ? `${icone('check')}<span>Pensé pour <b>${esc(profil.resume())}</b>.</span>
           <button type="button" class="usage-choix__modifier" data-usage-effacer>Tout effacer</button>`
        : '';
    }

    zone.innerHTML = `<div class="grille-produits grille-produits--rangee">${quatreOrdinateurs()
      .map((p) => carteProduit(p))
      .join('')}</div>`;
    /* Les cartes viennent d'être créées : il faut les inscrire à
       l'observateur d'apparition, sinon elles restent invisibles. */
    activerReveal(zone);
  };

  puces?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-usage]');
    if (b) profil.basculerUsage(b.dataset.usage);
  });
  resume?.addEventListener('click', (e) => {
    if (e.target.closest('[data-usage-effacer]')) profil.effacerReponses();
  });

  /* Le magasin prévient aussi quand le concierge note ses propres compteurs
     (visites, question reportée…) : on ne refait la section que si les
     RÉPONSES ont changé. */
  let signature = null;
  profil.abonner((e) => {
    const s = JSON.stringify([e.prenom, e.metier, e.usages, e.lieu, e.postes, e.priorites, e.etat]);
    if (s === signature) return;
    signature = s;
    refleter();
  });
}

/* --- réseau : carte, chiffres, liste des villes -------------------------
   Les chiffres sont écrits directement (plus de compteur animé : il
   restait parfois à 0 quand la section passait trop vite à l'écran).
   La carte : les lignes sont en SVG étiré (`preserveAspectRatio="none"` +
   trait non déformé), les points et les noms en HTML positionnés en %,
   pour rester ronds et lisibles quelle que soit la largeur. */

function preuvesReseau() {
  const partenaires = PARTENAIRES.filter((p) => p.role !== 'siege');
  rendre(
    '[data-preuves]',
    [
      { n: PARTENAIRES.length, mot: 'villes' },
      { n: new Set(PARTENAIRES.map((p) => p.pays)).size, mot: 'pays' },
      { n: partenaires.length, mot: 'partenaires' },
    ]
      .map((p) => `<li><b>${p.n}</b><span>${esc(p.mot)}</span></li>`)
      .join('')
  );
}

function carteReseau() {
  const autres = PARTENAIRES.filter((p) => p.role !== 'siege');
  /* Les coordonnées d'origine n'occupent qu'une partie du plan : on les
     étire sur toute la surface (0–100 dans les deux sens), sinon les villes
     se tassent au milieu du panneau. */
  const xs = PARTENAIRES.map((p) => p.coords.x);
  const ys = PARTENAIRES.map((p) => p.coords.y);
  const etire = (v, min, max) => ((v - min) / (max - min || 1)) * 100;
  const pos = (p) => ({
    x: etire(p.coords.x, Math.min(...xs), Math.max(...xs)),
    y: etire(p.coords.y, Math.min(...ys), Math.max(...ys)),
  });
  const s = pos(SIEGE);
  const lignes = autres
    .map((p) => {
      const c = pos(p);
      return `<line x1="${s.x}" y1="${s.y}" x2="${c.x}" y2="${c.y}" vector-effect="non-scaling-stroke"/>`;
    })
    .join('');
  const point = (p) => `
    <span class="point${p.role === 'siege' ? ' point--siege' : ''}" style="left:${10 + pos(p).x * 0.66}%; top:${12 + pos(p).y * 0.76}%">
      <i></i><b>${esc(p.ville)}</b>
    </span>`;
  rendre(
    '[data-reseau-carte]',
    `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${lignes}</svg>
     ${autres.map(point).join('')}${point(SIEGE)}`
  );
}

function partenaires() {
  rendre(
    '[data-partenaires]',
    PARTENAIRES.filter((p) => p.role !== 'siege')
      .map(
        (p) => `
        <a class="ville" href="catalogue.html?partenaire=${p.code}"
           title="Voir ce qui est disponible à ${esc(p.ville)}">
          <span class="ville__iso" aria-hidden="true">${esc(p.iso)}</span>
          <span class="ville__nom">${esc(p.ville)}<small>${esc(p.pays)}</small></span>
          <span class="ville__fleche" aria-hidden="true">${icone('fleche')}</span>
        </a>`
      )
      .join('')
  );
}

/* --- la boutique (siège & showroom) --------------------------------------
   Demandes client : parler de la boutique, pas du stock ; pas d'horaires.
   Une carte photo immersive : le mur de portables en fond, le texte sur un
   dégradé marine, les coordonnées en pastilles, deux vignettes. */

function siege() {
  const tel = CONTACT.telephones[0];
  rendre(
    '[data-siege]',
    `<div class="boutique2 reveal">
       <img class="boutique2__fond" src="assets/img/atelier/atelier-2.jpg"
            alt="Le mur de portables exposés dans la boutique Dilitech" loading="lazy">
       <div class="boutique2__txt">
         <p class="surtitre">Siège & showroom</p>
         <h2 class="titre">Notre boutique, <em>à Torokorobougou.</em></h2>
         <p class="chapeau">
           Venez voir les machines, les prendre en main et repartir conseillé.
           Showroom, atelier et service après-vente sous le même toit.
         </p>
         <ul class="boutique2__infos">
           <li>${icone('broche')}<span>Commune V, ${esc(CONTACT.ville)}</span></li>
           ${CONTACT.telephones
             .map((t) => `<li>${icone('telephone')}<a href="tel:${esc(t.tel)}">${esc(t.label)}</a></li>`)
             .join('')}
           <li>${icone('mail')}<a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></li>
         </ul>
         <div class="boutique2__actions">
           <a class="btn btn--cyan"
              href="https://www.google.com/maps/search/${encodeURIComponent(CONTACT.mapsQuery)}"
              target="_blank" rel="noopener">Venir à la boutique</a>
           <a class="btn boutique2__appel" href="tel:${esc(tel.tel)}">Appeler</a>
         </div>
       </div>
       <div class="boutique2__vignettes" aria-hidden="true">
         <img src="assets/img/produits/galerie/boutique-etageres.jpg" alt="" loading="lazy">
         <img src="assets/img/agent-sav.jpg" alt="" loading="lazy">
       </div>
     </div>`
  );
}

/* --- conseils : aperçu de 3, la page complète est conseils.html --------- */

function apercuConseils() {
  rendre('[data-articles]', ARTICLES.slice(0, 3).map((a) => carteConseil(a, { lien: 'page' })).join(''));
}

/* --- montage ------------------------------------------------------------- */

hero();
marques();
univers();
selection();
preuvesReseau();
carteReseau();
siege();
partenaires();
apercuConseils();

activerReveal();
