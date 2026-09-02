/* =========================================================================
   DILITECH — utilitaires DOM
   -------------------------------------------------------------------------
   Tout le site est en JavaScript natif, sans framework ni build. Ce module
   fournit le strict nécessaire pour écrire du rendu lisible : sélection,
   création d'éléments, échappement, et quelques primitives de temps.
   ========================================================================= */

export const $  = (sel, racine = document) => racine.querySelector(sel);
export const $$ = (sel, racine = document) => [...racine.querySelectorAll(sel)];

/**
 * Échappement systématique de tout ce qui vient des données.
 * Les fiches produits et les articles sont aujourd'hui statiques, mais ils
 * viendront demain du back-office : aucune chaîne ne doit atteindre
 * innerHTML sans passer par ici.
 */
export function esc(v) {
  return String(v ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Gabarit balisé : `html`…`` échappe automatiquement les interpolations.
 * Pour insérer du balisage déjà construit (donc déjà sûr), l'envelopper
 * dans `brut()`.
 *
 *   html`<h2>${titreUtilisateur}</h2>${brut(carteHTML)}`
 */
const BRUT = Symbol('html-brut');
export const brut = (s) => ({ [BRUT]: String(s) });

export function html(morceaux, ...valeurs) {
  return morceaux.reduce((acc, m, i) => {
    if (i === 0) return m;
    const v = valeurs[i - 1];
    let rendu;
    if (v == null || v === false) rendu = '';
    else if (v?.[BRUT] !== undefined) rendu = v[BRUT];
    else if (Array.isArray(v)) rendu = v.map((x) => (x?.[BRUT] !== undefined ? x[BRUT] : esc(x))).join('');
    else rendu = esc(v);
    return acc + rendu + m;
  }, '');
}

/** Création d'élément concise : el('div', { class: 'x' }, 'texte'). */
export function el(balise, attrs = {}, ...enfants) {
  const n = document.createElement(balise);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  n.append(...enfants.flat().filter((c) => c != null && c !== false));
  return n;
}

/** Remplace le contenu d'un conteneur par du balisage, en une passe. */
export function rendre(cible, balisage) {
  const n = typeof cible === 'string' ? $(cible) : cible;
  if (n) n.innerHTML = balisage;
  return n;
}

/* --- temps ------------------------------------------------------------ */

export function debounce(fn, ms = 220) {
  let t;
  const enveloppe = (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
  enveloppe.annuler = () => clearTimeout(t);
  return enveloppe;
}

/** Limite une fonction à une exécution par image d'affichage. */
export function parFrame(fn) {
  let prevu = false;
  let dernier;
  return (...a) => {
    dernier = a;
    if (prevu) return;
    prevu = true;
    requestAnimationFrame(() => {
      prevu = false;
      fn(...dernier);
    });
  };
}

/* --- préférences utilisateur ------------------------------------------ */

/* Évalué à la volée et non au chargement du module : le catalogue et les
   données doivent rester importables hors navigateur (tests, outils). */
const mqAnimation = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;

/** Respecté partout : aucune animation décorative si l'OS la refuse. */
export const animationsReduites = () => mqAnimation?.matches ?? false;

/* --- divers ----------------------------------------------------------- */

/** Retire les accents, pour une recherche tolérante. */
export const sansAccent = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/** Object.groupBy n'est pas encore partout : repli discret. */
export const grouperPar = (liste, cle) =>
  Object.groupBy?.(liste, cle) ??
  liste.reduce((acc, x) => {
    const k = cle(x);
    (acc[k] ??= []).push(x);
    return acc;
  }, {});

/** Défilement vers une ancre en tenant compte de l'en-tête fixe. */
export function allerA(selecteur) {
  const cible = typeof selecteur === 'string' ? $(selecteur) : selecteur;
  if (!cible) return;
  const hauteurNav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
  const y = cible.getBoundingClientRect().top + scrollY - hauteurNav - 16;
  scrollTo({ top: y, behavior: animationsReduites() ? 'auto' : 'smooth' });
}
