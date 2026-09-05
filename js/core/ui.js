/* =========================================================================
   DILITECH — comportements d'interface partagés
   -------------------------------------------------------------------------
   Chargé sur toutes les pages. Rien ici ne dépend du contenu : ce sont des
   mécanismes (apparition au défilement, notifications, verrouillage du
   défilement, bouton de remontée, animation de compteurs).

   Règle tenue partout : si l'utilisateur a demandé à son système de réduire
   les animations, tout se contente d'apparaître.
   ========================================================================= */

import { $, $$, animationsReduites, parFrame } from './dom.js';
import { icone } from './icones.js';

/* --- apparition au défilement ----------------------------------------- */

let observateurReveal = null;

/**
 * Fait apparaître les éléments `.reveal` quand ils entrent dans le cadre.
 * Idempotent : appelable après chaque rendu de grille sans dupliquer.
 */
export function activerReveal(racine = document) {
  const cibles = $$('.reveal:not(.est-vu)', racine);
  if (!cibles.length) return;

  if (animationsReduites()) {
    cibles.forEach((n) => n.classList.add('est-vu'));
    return;
  }

  /* Cascade automatique : chaque élément reçoit son rang parmi les frères
     de CE lot (pas dans toute la page), posé comme variable CSS `--i` que
     `.reveal` lit dans son `transition-delay`. Une rangée de cartes se
     dévoile donc de gauche à droite sans qu'aucune grille n'ait à écrire
     ses propres règles nth-child — plafonné à 6 pour qu'une longue liste
     ne fasse pas traîner l'apparition des dernières cartes. */
  const rangParParent = new Map();
  for (const n of cibles) {
    const rang = rangParParent.get(n.parentElement) ?? 0;
    rangParParent.set(n.parentElement, rang + 1);
    n.style.setProperty('--i', Math.min(rang, 6));
  }

  observateurReveal ??= new IntersectionObserver(
    (entrees, obs) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('est-vu');
        obs.unobserve(e.target); // une seule fois : on ne rejoue pas au retour
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
  );

  cibles.forEach((n) => observateurReveal.observe(n));
}

/* --- notifications ----------------------------------------------------- */

let pileToasts = null;

/**
 * Message court, non bloquant. `ton` : 'ok' | 'info' | 'alerte'.
 * Les messages s'empilent et s'effacent seuls ; ils sont annoncés aux
 * lecteurs d'écran via une région live discrète.
 */
export function toast(texte, { ton = 'ok', duree = 3600, action } = {}) {
  pileToasts ??= (() => {
    const n = document.createElement('div');
    n.className = 'toasts';
    n.setAttribute('role', 'status');
    n.setAttribute('aria-live', 'polite');
    document.body.append(n);
    return n;
  })();

  const t = document.createElement('div');
  t.className = `toast toast--${ton}`;
  t.innerHTML = `
    ${icone(ton === 'alerte' ? 'etincelle' : 'check')}
    <span class="toast__txt"></span>
    ${action ? `<button type="button" class="toast__action">${action.libelle}</button>` : ''}
    <button type="button" class="toast__x" aria-label="Fermer">${icone('fermer')}</button>`;
  t.querySelector('.toast__txt').textContent = texte;

  const partir = () => {
    t.classList.add('part');
    t.addEventListener('animationend', () => t.remove(), { once: true });
    /* Repli : si l'animation ne se déclenche pas (onglet en arrière-plan),
       on retire quand même. */
    setTimeout(() => t.remove(), 500);
  };

  t.querySelector('.toast__x').addEventListener('click', partir);
  t.querySelector('.toast__action')?.addEventListener('click', () => {
    action.faire?.();
    partir();
  });

  pileToasts.append(t);
  const minuterie = setTimeout(partir, duree);
  t.addEventListener('mouseenter', () => clearTimeout(minuterie));
  return t;
}

/* --- verrouillage du défilement ---------------------------------------- */

/* Compteur : deux couches ouvertes en même temps (menu + panneau devis) ne
   doivent pas se rendre le défilement l'une à l'autre. */
let verrous = 0;
let scrollMemorise = 0;

export function verrouillerDefilement() {
  if (verrous++ === 0) {
    scrollMemorise = scrollY;
    document.body.style.top = `${-scrollMemorise}px`;
    document.body.classList.add('defilement-bloque');
  }
}

export function deverrouillerDefilement() {
  if (verrous === 0) return;
  if (--verrous === 0) {
    document.body.classList.remove('defilement-bloque');
    document.body.style.top = '';
    scrollTo({ top: scrollMemorise, behavior: 'auto' });
  }
}

/* --- piège à focus ------------------------------------------------------ */

const FOCUSABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Maintient le focus clavier à l'intérieur d'une couche ouverte.
 * Renvoie la fonction de libération, qui rend le focus à l'élément d'origine.
 */
export function piegerFocus(conteneur) {
  const origine = document.activeElement;
  const ctrl = new AbortController();

  const premier = () => $$(FOCUSABLES, conteneur).filter((n) => n.offsetParent !== null);

  conteneur.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Tab') return;
      const liste = premier();
      if (!liste.length) return;
      const debut = liste[0];
      const fin = liste.at(-1);
      if (e.shiftKey && document.activeElement === debut) {
        e.preventDefault();
        fin.focus();
      } else if (!e.shiftKey && document.activeElement === fin) {
        e.preventDefault();
        debut.focus();
      }
    },
    { signal: ctrl.signal }
  );

  queueMicrotask(() => premier()[0]?.focus());

  return () => {
    ctrl.abort();
    if (origine instanceof HTMLElement) origine.focus({ preventScroll: true });
  };
}

/* --- compteurs animés --------------------------------------------------- */

/**
 * Anime un nombre de 0 à sa valeur, une seule fois, à l'entrée dans le cadre.
 * L'élément porte `data-compteur="1234"`.
 */
export function activerCompteurs(racine = document) {
  const cibles = $$('[data-compteur]:not(.est-compte)', racine);
  if (!cibles.length) return;

  const fmt = new Intl.NumberFormat('fr-FR');
  const jouer = (n) => {
    n.classList.add('est-compte');
    const cible = Number(n.dataset.compteur) || 0;
    if (animationsReduites()) {
      n.textContent = fmt.format(cible);
      return;
    }
    const duree = 1100;
    const debut = performance.now();
    const pas = (t) => {
      const p = Math.min(1, (t - debut) / duree);
      /* easeOutCubic : démarrage franc, arrivée douce sur la valeur. */
      const e = 1 - (1 - p) ** 3;
      n.textContent = fmt.format(Math.round(cible * e));
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };

  const obs = new IntersectionObserver(
    (entrees, o) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        jouer(e.target);
        o.unobserve(e.target);
      }
    },
    { threshold: 0.4 }
  );
  cibles.forEach((n) => obs.observe(n));
}

/* --- en-tête et bouton de remontée -------------------------------------- */

export function activerChromeDePage() {
  const entete = $('.site-entete');
  const remonte = $('.remonter');

  const surDefilement = parFrame(() => {
    const y = scrollY;
    entete?.classList.toggle('est-pose', y > 12);
    remonte?.classList.toggle('est-visible', y > 900);
  });

  addEventListener('scroll', surDefilement, { passive: true });
  surDefilement();

  remonte?.addEventListener('click', () =>
    scrollTo({ top: 0, behavior: animationsReduites() ? 'auto' : 'smooth' })
  );
}

/* --- lueur qui suit le curseur -------------------------------------------
   Réservée aux boutons `.btn--lueur` (un ou deux par page, les appels
   principaux) : une délégation unique sur `document`, jamais un écouteur
   par bouton — le coût reste nul même si la page en affiche plusieurs. */
export function activerLueurBoutons(racine = document) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  racine.addEventListener('pointermove', (e) => {
    const b = e.target.closest?.('.btn--lueur');
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    b.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
}

/**
 * Spotlight qui suit le curseur dans le hero de l'accueil — technique
 * portée telle quelle du site VP (`initHeroSpotlight` dans
 * WebsiteVP/js/common.js) : un seul `mousemove` sur le hero, --mx/--my en
 * pourcentage, lus par le dégradé radial de `.hero__spotlight` en CSS.
 * Écran tactile ou souris imprécise : on ne pose même pas l'écouteur.
 */
export function activerSpotlightHero(id = '#hero') {
  const hero = $(id);
  if (!hero || !matchMedia('(pointer: fine)').matches) return;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    hero.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
}

/* --- images différées ---------------------------------------------------- */

/**
 * Les photos produits sont facultatives (le catalogue tombe sinon sur ses
 * dessins). Quand une photo est renseignée mais introuvable, on retire
 * simplement l'image : le dessin reste visible dessous.
 */
export function surveillerImages(racine = document) {
  for (const img of $$('img[data-repli]', racine)) {
    img.addEventListener(
      'error',
      () => {
        img.remove();
      },
      { once: true }
    );
  }
}
