/* =========================================================================
   DILITECH — le catalogue
   -------------------------------------------------------------------------
   L'ÉTAT DES FILTRES VIT DANS L'URL, pas dans une variable. Conséquences
   voulues :
     — un filtrage est partageable par copier-coller du lien ;
     — le bouton « précédent » du navigateur défait le dernier filtre ;
     — la page d'accueil et le pied de page peuvent pointer directement sur
       une vue (`catalogue.html?cat=reseau&usage=entreprise`) ;
     — un rechargement ne perd rien.

   L'affichage se fait par tranches (générateur `*tranches()`), et la tranche
   suivante est demandée quand la sentinelle entre dans le cadre. Sur 55
   références ce n'est pas indispensable ; ce le sera quand le back-office en
   aura mis six cents.
   ========================================================================= */

import './commun.js';

import * as cat from '../core/catalogue.js';
import { PARTENAIRES } from '../data/partenaires.js';
import { grilleProduits, carteProduit } from '../components/carte-produit.js';
import { prix as fmtPrix, nombre } from '../config.js';
import { $, $$, esc, rendre, debounce } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal } from '../core/ui.js';

const PAR_TRANCHE = 24;

/* =========================================================================
   1. L'ÉTAT, LU ET ÉCRIT DANS L'URL
   ========================================================================= */

/* Bornes réelles du catalogue : le curseur de budget s'y cale, plutôt que
   sur des valeurs arbitraires qui vieilliraient mal. */
const BORNES = cat.bornesPrix();

function lireUrl() {
  const p = new URLSearchParams(location.search);
  const liste = (k) => (p.get(k) ? p.get(k).split(',').filter(Boolean) : []);
  const nb = (k, defaut) => {
    const v = Number(p.get(k));
    return Number.isFinite(v) && p.get(k) !== null ? v : defaut;
  };
  return {
    q: p.get('q') ?? '',
    cat: p.get('cat') ?? '',
    sous: p.get('sous') ?? '',
    marques: liste('marque'),
    usages: liste('usage'),
    etat: p.get('etat') ?? '',
    partenaire: p.get('partenaire') ?? '',
    prixMin: nb('min', BORNES.min),
    prixMax: nb('max', BORNES.max),
    promo: p.get('promo') === '1',
    tri: p.get('tri') ?? 'pertinence',
  };
}

/**
 * Réécrit l'URL sans recharger. `pousser` distingue une action délibérée
 * (cochage d'un filtre → une entrée d'historique, donc « précédent » la
 * défait) d'un ajustement continu comme la frappe ou le curseur de prix
 * (remplacement, pour ne pas remplir l'historique de dizaines d'états).
 */
function ecrireUrl(e, { pousser = true } = {}) {
  const p = new URLSearchParams();
  if (e.q) p.set('q', e.q);
  if (e.cat) p.set('cat', e.cat);
  if (e.sous) p.set('sous', e.sous);
  if (e.marques.length) p.set('marque', e.marques.join(','));
  if (e.usages.length) p.set('usage', e.usages.join(','));
  if (e.etat) p.set('etat', e.etat);
  if (e.partenaire) p.set('partenaire', e.partenaire);
  if (e.prixMin > BORNES.min) p.set('min', e.prixMin);
  if (e.prixMax < BORNES.max) p.set('max', e.prixMax);
  if (e.promo) p.set('promo', '1');
  if (e.tri !== 'pertinence') p.set('tri', e.tri);

  const url = `${location.pathname}${p.toString() ? `?${p}` : ''}${location.hash}`;
  history[pousser ? 'pushState' : 'replaceState'](null, '', url);
}

let etat = lireUrl();

/** Le critère passé à la couche catalogue, dérivé de l'état d'interface. */
function critere() {
  return {
    q: etat.q,
    cat: etat.cat || undefined,
    sous: etat.sous || undefined,
    marques: etat.marques,
    usages: etat.usages,
    etat: etat.etat || undefined,
    partenaire: etat.partenaire || undefined,
    prixMin: etat.prixMin > BORNES.min ? etat.prixMin : undefined,
    prixMax: etat.prixMax < BORNES.max ? etat.prixMax : undefined,
    promo: etat.promo || undefined,
    tri: etat.tri,
  };
}

/* =========================================================================
   2. RENDU DES FILTRES
   ========================================================================= */

function filtreCategories() {
  const comptes = cat.comptesParSous({ ...critere(), cat: undefined, sous: undefined });
  const comptesCat = {};
  for (const c of cat.CATEGORIES) {
    comptesCat[c.code] = c.sous.reduce((n, s) => n + (comptes[s.code] ?? 0), 0);
  }

  const toutes = `<label class="opt">
       <input type="radio" name="cat" value="" ${etat.cat ? '' : 'checked'}>
       <span class="opt__nom">Toutes catégories</span>
       <span class="opt__nb">${cat.filtrer({ ...critere(), cat: undefined, sous: undefined }).length}</span>
     </label>`;

  rendre(
    '[data-f-categories]',
    toutes +
    cat.CATEGORIES.map(
      (c) => `
      <label class="opt">
        <input type="radio" name="cat" value="${c.code}" ${etat.cat === c.code ? 'checked' : ''}>
        <span class="opt__nom">${esc(c.nom)}</span>
        <span class="opt__nb">${comptesCat[c.code] ?? 0}</span>
      </label>
      ${
        etat.cat === c.code
          ? `<div class="opt-sous">${c.sous
              .map(
                (s) => `
              <label class="opt opt--sous">
                <input type="radio" name="sous" value="${s.code}" ${etat.sous === s.code ? 'checked' : ''}>
                <span class="opt__nom">${esc(s.nom)}</span>
                <span class="opt__nb">${comptes[s.code] ?? 0}</span>
              </label>`
              )
              .join('')}</div>`
          : ''
      }`
    ).join('')
  );
}

function filtreUsages() {
  rendre(
    '[data-f-usages]',
    cat.USAGES.map(
      (u) => `
      <label class="opt" title="${esc(u.desc)}">
        <input type="checkbox" name="usage" value="${u.code}"
               ${etat.usages.includes(u.code) ? 'checked' : ''}>
        <span class="opt__nom">${esc(u.nom)}</span>
        <span class="opt__nb">${cat.filtrer({ ...critere(), usages: [u.code] }).length}</span>
      </label>`
    ).join('')
  );
}

function filtreMarques() {
  const comptes = cat.comptesParMarque({ ...critere(), marques: undefined });
  /* On masque les marques que les autres filtres ont déjà vidées : proposer
     une case qui donnerait zéro résultat n'aide personne. */
  const visibles = cat.MARQUES.filter((m) => comptes[m] || etat.marques.includes(m));

  rendre(
    '[data-f-marques]',
    visibles
      .map(
        (m) => `
      <label class="opt">
        <input type="checkbox" name="marque" value="${esc(m)}"
               ${etat.marques.includes(m) ? 'checked' : ''}>
        <span class="opt__nom">${esc(m)}</span>
        <span class="opt__nb">${comptes[m] ?? 0}</span>
      </label>`
      )
      .join('')
  );
}

function filtreEtat() {
  const opts = [
    { v: '', nom: 'Tous' },
    { v: 'neuf', nom: 'Neuf' },
    { v: 'reconditionne', nom: 'Reconditionné garanti' },
  ];
  rendre(
    '[data-f-etat]',
    opts
      .map(
        (o) => `
      <label class="opt">
        <input type="radio" name="etat" value="${o.v}" ${etat.etat === o.v ? 'checked' : ''}>
        <span class="opt__nom">${esc(o.nom)}</span>
        ${o.v ? `<span class="opt__nb">${cat.filtrer({ ...critere(), etat: o.v }).length}</span>` : ''}
      </label>`
      )
      .join('')
  );
}

function filtrePartenaires() {
  rendre(
    '[data-f-partenaires]',
    `<label class="opt">
       <input type="radio" name="partenaire" value="" ${etat.partenaire ? '' : 'checked'}>
       <span class="opt__nom">Tout le réseau</span>
     </label>` +
      PARTENAIRES.map(
        (p) => `
      <label class="opt">
        <input type="radio" name="partenaire" value="${p.code}"
               ${etat.partenaire === p.code ? 'checked' : ''}>
        <span class="opt__nom">${esc(p.ville)}</span>
        <span class="opt__nb">${cat.filtrer({ ...critere(), partenaire: p.code }).length}</span>
      </label>`
      ).join('')
  );
}

function filtrePrix() {
  const zone = $('[data-f-prix]');
  if (!zone) return;
  /* Rendu une seule fois : re-générer le balisage à chaque glissement
     couperait le geste en cours. */
  if (!zone.dataset.pret) {
    zone.dataset.pret = '1';
    zone.innerHTML = `
      <p class="prix-plage__val">
        <span data-prix-min></span><span data-prix-max></span>
      </p>
      <div class="prix-plage__piste">
        <span class="prix-plage__actif" data-prix-actif></span>
        <input type="range" data-min min="${BORNES.min}" max="${BORNES.max}" step="1000"
               value="${etat.prixMin}" aria-label="Budget minimum">
        <input type="range" data-max min="${BORNES.min}" max="${BORNES.max}" step="1000"
               value="${etat.prixMax}" aria-label="Budget maximum">
      </div>`;

    const min = $('[data-min]', zone);
    const max = $('[data-max]', zone);

    const bouger = (pousser) => {
      /* Les deux poignées partagent la même piste : on les empêche de se
         croiser, sinon la plage devient négative. */
      let a = Number(min.value);
      let b = Number(max.value);
      if (a > b) [a, b] = [b, a];
      etat.prixMin = a;
      etat.prixMax = b;
      majPrixVisuel();
      ecrireUrl(etat, { pousser });
      rafraichir({ garderPrix: true });
    };

    const differe = debounce(() => bouger(true), 420);
    for (const n of [min, max]) {
      n.addEventListener('input', () => { majPrixVisuel(); differe(); });
      n.addEventListener('change', () => { differe.annuler(); bouger(true); });
    }
  }
  majPrixVisuel();
}

function majPrixVisuel() {
  const zone = $('[data-f-prix]');
  if (!zone?.dataset.pret) return;
  const min = $('[data-min]', zone);
  const max = $('[data-max]', zone);
  const a = Math.min(Number(min.value), Number(max.value));
  const b = Math.max(Number(min.value), Number(max.value));
  const etendue = BORNES.max - BORNES.min || 1;
  const g = ((a - BORNES.min) / etendue) * 100;
  const d = ((b - BORNES.min) / etendue) * 100;

  const actif = $('[data-prix-actif]', zone);
  actif.style.left = `${g}%`;
  actif.style.width = `${d - g}%`;
  $('[data-prix-min]', zone).textContent = fmtPrix(a);
  $('[data-prix-max]', zone).textContent = fmtPrix(b);
}

/* =========================================================================
   3. JETONS DE FILTRES ACTIFS
   ========================================================================= */

function jetonsActifs() {
  const j = [];
  const sous = etat.sous ? cat.sousCategorie(etat.sous) : null;

  if (etat.q) j.push({ t: 'q', lib: `« ${etat.q} »` });
  if (etat.cat && !sous) j.push({ t: 'cat', lib: cat.categorie(etat.cat)?.nom ?? etat.cat });
  if (sous) j.push({ t: 'sous', lib: sous.nom });
  for (const m of etat.marques) j.push({ t: 'marque', v: m, lib: m });
  for (const u of etat.usages) {
    j.push({ t: 'usage', v: u, lib: cat.USAGES.find((x) => x.code === u)?.nom ?? u });
  }
  if (etat.etat) j.push({ t: 'etat', lib: cat.ETATS[etat.etat]?.nom ?? etat.etat });
  if (etat.partenaire) {
    j.push({
      t: 'partenaire',
      lib: `Disponible à ${PARTENAIRES.find((p) => p.code === etat.partenaire)?.ville ?? ''}`,
    });
  }
  if (etat.promo) j.push({ t: 'promo', lib: 'En promotion' });
  if (etat.prixMin > BORNES.min || etat.prixMax < BORNES.max) {
    j.push({ t: 'prix', lib: `${fmtPrix(etat.prixMin)} – ${fmtPrix(etat.prixMax)}` });
  }

  rendre(
    '[data-actifs]',
    j.length
      ? j
          .map(
            (x) => `
        <span class="actif">
          ${esc(x.lib)}
          <button type="button" data-retirer="${x.t}" ${x.v ? `data-val="${esc(x.v)}"` : ''}
                  aria-label="Retirer le filtre ${esc(x.lib)}">${icone('fermer')}</button>
        </span>`
          )
          .join('') +
          `<button type="button" class="actif actif--tout js-reinit-filtres">Tout effacer</button>`
      : ''
  );

  const nb = $('[data-actifs-nb]');
  if (nb) {
    nb.textContent = j.length;
    nb.hidden = j.length === 0;
  }
}

/* =========================================================================
   4. GRILLE ET CHARGEMENT PAR TRANCHES
   ========================================================================= */

/** Découpe la liste en tranches successives. */
function* tranches(liste, taille) {
  for (let i = 0; i < liste.length; i += taille) yield liste.slice(i, i + taille);
}

let fluxTranches = null;
let grilleInterne = null;

function rendreResultats() {
  const liste = cat.filtrer(critere());
  const zone = $('[data-grille]');

  rendre('[data-compte]', `<b>${nombre(liste.length)}</b> ${liste.length > 1 ? 'produits' : 'produit'}`);

  fluxTranches = tranches(liste, PAR_TRANCHE);
  const premiere = fluxTranches.next();

  zone.innerHTML = grilleProduits(premiere.done ? [] : premiere.value);
  grilleInterne = $('.grille-produits', zone);
  activerReveal(zone);
  majBoutonCharger(liste.length);
}

function chargerTranche() {
  if (!fluxTranches || !grilleInterne) return;
  const suivante = fluxTranches.next();
  if (suivante.done) {
    majBoutonCharger(0);
    return;
  }
  grilleInterne.insertAdjacentHTML(
    'beforeend',
    suivante.value.map((p) => carteProduit(p)).join('')
  );
  activerReveal(grilleInterne);
  majBoutonCharger(cat.filtrer(critere()).length);
}

function majBoutonCharger(total) {
  const zone = $('[data-charger]');
  if (!zone) return;
  const affiches = grilleInterne?.children.length ?? 0;
  zone.hidden = affiches >= total;
}

/* =========================================================================
   5. RAFRAÎCHISSEMENT
   ========================================================================= */

function rafraichir({ garderPrix = false } = {}) {
  filtreCategories();
  filtreUsages();
  filtreMarques();
  filtreEtat();
  filtrePartenaires();
  if (!garderPrix) filtrePrix();
  jetonsActifs();
  rendreResultats();
  majTitre();
}

/** Le titre de page suit le filtre : c'est ce que l'utilisateur a demandé. */
function majTitre() {
  const t = $('[data-titre]');
  const st = $('[data-sous-titre]');
  if (!t) return;

  const sous = etat.sous ? cat.sousCategorie(etat.sous) : null;
  const categorie = etat.cat ? cat.categorie(etat.cat) : null;

  if (sous) {
    t.innerHTML = `${esc(sous.nom)}<em> ${esc(sous.categorie.nom.toLowerCase())}.</em>`;
    st.textContent = sous.categorie.accroche;
    document.title = `${sous.nom} — Catalogue Dilitech`;
  } else if (categorie) {
    t.innerHTML = `${esc(categorie.nom)}<em> chez Dilitech.</em>`;
    st.textContent = categorie.accroche;
    document.title = `${categorie.nom} — Catalogue Dilitech`;
  } else if (etat.promo) {
    t.innerHTML = `Promotions <em>en cours.</em>`;
    st.textContent = "Les prix barrés du moment, dans les trois univers du catalogue.";
    document.title = 'Promotions — Catalogue Dilitech';
  } else {
    t.innerHTML = `Tout le matériel, <em>filtré par usage.</em>`;
    st.textContent =
      "Ordinateurs, accessoires et matériel réseau. Filtrez par marque, par budget ou — c'est le plus utile — par ce que vous voulez en faire.";
    document.title = 'Catalogue — Dilitech';
  }
}

/* =========================================================================
   6. ÉCOUTEURS
   ========================================================================= */

function brancher() {
  const filtres = $('#filtres');

  /* --- cases et boutons radio, en délégation --- */
  filtres.addEventListener('change', (e) => {
    const n = e.target;
    if (!n.name) return;

    switch (n.name) {
      case 'cat':
        etat.cat = n.value;
        etat.sous = ''; // changer de catégorie invalide la sous-catégorie
        break;
      case 'sous':
        etat.sous = n.value;
        break;
      case 'etat':
        etat.etat = n.value;
        break;
      case 'partenaire':
        etat.partenaire = n.value;
        break;
      case 'marque':
        etat.marques = $$('[name="marque"]:checked', filtres).map((x) => x.value);
        break;
      case 'usage':
        etat.usages = $$('[name="usage"]:checked', filtres).map((x) => x.value);
        break;
      default:
        return;
    }
    ecrireUrl(etat);
    rafraichir();
  });

  /* --- recherche --- */
  const champ = $('[data-q]');
  const vider = $('[data-q-vider]');
  champ.value = etat.q;
  vider.hidden = !etat.q;

  const chercher = debounce(() => {
    etat.q = champ.value.trim();
    vider.hidden = !etat.q;
    /* Remplacement et non empilement : chaque frappe ne doit pas créer une
       entrée d'historique. */
    ecrireUrl(etat, { pousser: false });
    rafraichir();
  }, 230);

  champ.addEventListener('input', chercher);
  champ.addEventListener('search', chercher);
  vider.addEventListener('click', () => {
    champ.value = '';
    champ.focus();
    chercher();
  });

  /* --- tri --- */
  const tri = $('[data-tri]');
  tri.innerHTML = Object.entries(cat.TRIS)
    .map(([k, v]) => `<option value="${k}" ${etat.tri === k ? 'selected' : ''}>${esc(v.nom)}</option>`)
    .join('');
  tri.addEventListener('change', () => {
    etat.tri = tri.value;
    ecrireUrl(etat);
    rendreResultats();
  });

  /* --- retrait d'un jeton --- */
  $('[data-actifs]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-retirer]');
    if (!b) return;
    const { retirer, val } = b.dataset;
    switch (retirer) {
      case 'q': etat.q = ''; $('[data-q]').value = ''; break;
      case 'cat': etat.cat = ''; etat.sous = ''; break;
      case 'sous': etat.sous = ''; break;
      case 'etat': etat.etat = ''; break;
      case 'partenaire': etat.partenaire = ''; break;
      case 'promo': etat.promo = false; break;
      case 'marque': etat.marques = etat.marques.filter((m) => m !== val); break;
      case 'usage': etat.usages = etat.usages.filter((u) => u !== val); break;
      case 'prix':
        etat.prixMin = BORNES.min;
        etat.prixMax = BORNES.max;
        reinitPrixVisuel();
        break;
    }
    ecrireUrl(etat);
    rafraichir({ garderPrix: retirer !== 'prix' });
  });

  /* --- réinitialisation (le bouton existe à trois endroits) --- */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.js-reinit-filtres')) return;
    etat = {
      q: '', cat: '', sous: '', marques: [], usages: [], etat: '', partenaire: '',
      prixMin: BORNES.min, prixMax: BORNES.max, promo: false, tri: 'pertinence',
    };
    $('[data-q]').value = '';
    $('[data-q-vider]').hidden = true;
    $('[data-tri]').value = 'pertinence';
    reinitPrixVisuel();
    ecrireUrl(etat);
    rafraichir({ garderPrix: true });
  });

  /* --- chargement de la tranche suivante --- */
  $('[data-charger]').addEventListener('click', (e) => {
    if (e.target.closest('.js-charger-plus')) chargerTranche();
  });

  /* La sentinelle : quand le bouton « afficher plus » approche du cadre, on
     charge sans attendre le clic. Le bouton reste, pour le clavier et pour
     qui a désactivé le défilement automatique. */
  const sentinelle = new IntersectionObserver(
    (entrees) => {
      for (const x of entrees) if (x.isIntersecting) chargerTranche();
    },
    { rootMargin: '400px' }
  );
  sentinelle.observe($('[data-charger]'));

  /* --- filtres en panneau sur mobile --- */
  const panneauFiltres = $('#filtres');
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-ouvrir-filtres')) panneauFiltres.classList.add('est-ouvert');
    if (e.target.closest('.js-fermer-filtres')) panneauFiltres.classList.remove('est-ouvert');
  });

  /* --- boutons « précédent / suivant » du navigateur --- */
  addEventListener('popstate', () => {
    etat = lireUrl();
    $('[data-q]').value = etat.q;
    $('[data-q-vider]').hidden = !etat.q;
    $('[data-tri]').value = etat.tri;
    reinitPrixVisuel();
    rafraichir({ garderPrix: true });
  });
}

/** Recale les deux poignées du curseur sur l'état courant. */
function reinitPrixVisuel() {
  const zone = $('[data-f-prix]');
  if (!zone?.dataset.pret) return;
  $('[data-min]', zone).value = etat.prixMin;
  $('[data-max]', zone).value = etat.prixMax;
  majPrixVisuel();
}

/* =========================================================================
   7. DÉMARRAGE
   ========================================================================= */

/* Un lien peut arriver avec `?marque=HP` (bandeau de l'accueil) : la valeur
   est déjà lue par `lireUrl`, il n'y a rien de plus à faire. */
brancher();
rafraichir();

/* `catalogue.html#recherche` (loupe de la barre de navigation) place le
   curseur dans le champ. */
if (location.hash === '#recherche') {
  $('[data-q]')?.focus({ preventScroll: false });
}
