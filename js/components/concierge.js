/* =========================================================================
   DILITECH — le « concierge »
   -------------------------------------------------------------------------
   Une petite carte en bas à droite qui accueille le visiteur et lui demande
   son usage, au fil de la visite. L'esprit : l'accueil d'un bon hôtel, pas
   un formulaire. Les réponses vont dans js/core/profil.js (mémoire partagée
   avec la section « sélection »).

   Six questions, en DEUX passages (profil.PARTIES) :
     — partie 1, tôt dans la page : prénom, usage, lieu d'utilisation ;
     — partie 2, plus loin : nombre de postes, priorités, neuf/reconditionné.
   Chaque passage est un petit parcours à étapes avec « Précédent » et
   « Suivant » — rien n'avance tout seul (retour du client : un clic qui
   passait directement à la question suivante allait trop vite).

   Deux façons d'arriver aux questions :
     — SPONTANÉE, à chaque chargement de page : des DÉCLENCHEURS (arrivée sur
       une section) « arment » une partie ; un ORDONNANCEUR (toutes les
       1,5 s) la montre quand les conditions sont réunies — carte fermée,
       aucun panneau ouvert, délai de politesse écoulé, le visiteur a
       défilé, la partie 1 passée avant la 2. Les réponses déjà données sont
       pré-remplies : confirmer prend un clic.
     — À LA DEMANDE : tout `.js-ouvrir-conseiller` (les interrupteurs de
       l'univers Dilitech) ouvre les six questions d'affilée, même après
       « Ne plus me demander » (qui ne coupe que les passages spontanés).
   Pas de bouton flottant façon « chat » : refusé par le client.

   Les éléments `[data-etat-profil]` reçoivent `data-actif="true|false"`
   (et `aria-checked` s'ils sont des interrupteurs) selon que l'usage du
   visiteur est connu ou non ; `[data-profil-mini]` affiche le résumé.
   ========================================================================= */

import * as profil from '../core/profil.js';
import { marque } from './chrome.js';
import { icone } from '../core/icones.js';
import { $, $$, esc } from '../core/dom.js';

/* Où chaque partie s'arme ; la première cible présente sur la page compte. */
const DECLENCHEURS = {
  1: ['#univers', '[data-grille]'],
  2: ['#services', '#contact'],   // #contact = le pied de page, sur toutes les pages
};

const DELAI_ACCUEIL = 4000;        // après le premier défilement
const DELAI_POLITESSE = 25000;     // entre la fermeture d'une carte et la suivante
const FERMETURE_MERCI = 7000;

const INTITULES = {
  1: 'Faisons connaissance',
  2: 'Pour affiner nos conseils',
  guide: 'Votre besoin',
};

/* « Bon retour » : une fois par session d'onglet — le répéter à chaque
   actualisation deviendrait pesant, contrairement aux questions. */
function retourDejaDit() {
  try { return sessionStorage.getItem('dt-bon-retour') === '1'; } catch { return false; }
}
function noterRetour() {
  try { sessionStorage.setItem('dt-bon-retour', '1'); } catch { /* sans mémoire de session */ }
}

const surAccueil = () => !!$('#hero');

class Concierge extends HTMLElement {
  #carte = null;
  #armees = new Set();      // parties armées sur cette page
  #vues = new Set();        // parties déjà montrées sur cette page
  #derniere = 0;            // fermeture de la carte précédente

  /* parcours en cours */
  #mode = null;             // 'accueil' | 'retour' | 'parcours' | 'merci'
  #etapes = [];             // codes de questions
  #i = 0;
  #intitule = '';
  #choix = new Set();

  #minuterie = null;
  #fermetureAuto = null;
  #aDefile = false;
  #debut = Date.now();

  connectedCallback() {
    this.className = 'concierge';
    this.innerHTML = `
      <aside class="concierge__carte" aria-live="polite" aria-label="Dilitech, à votre écoute" hidden>
        <div class="concierge__tete">
          <span class="concierge__signe">${marque()}</span>
          <p class="concierge__qui">Dilitech <span>· à votre écoute</span></p>
          <button type="button" class="concierge__x" data-fermer aria-label="Fermer">${icone('fermer')}</button>
        </div>
        <div class="concierge__corps" data-corps></div>
      </aside>`;
    this.#carte = $('.concierge__carte', this);

    this.#carte.addEventListener('click', (e) => this.#clic(e));
    this.#carte.addEventListener('input', (e) => {
      if (!e.target.matches('[data-libre]')) return;
      if (e.target.value.trim()) {
        this.#choix = new Set(['autre']);
        for (const b of $$('[data-opt]', this)) b.setAttribute('aria-pressed', 'false');
      }
    });
    this.#carte.addEventListener('keydown', (e) => {
      /* Entrée dans le champ prénom = « Suivant ». */
      if (e.key === 'Enter' && e.target.matches('[data-champ], [data-libre]')) {
        e.preventDefault();
        this.#avancer(1);
      }
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.#ouverte) this.#fermer();
    });
    /* Survol ou focus : la carte de remerciement ne se ferme pas sous le doigt. */
    this.#carte.addEventListener('pointerenter', () => clearTimeout(this.#fermetureAuto));
    this.#carte.addEventListener('focusin', () => clearTimeout(this.#fermetureAuto));

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.js-ouvrir-conseiller')) return;
      e.preventDefault();
      this.ouvrirQuestionnaire();
    });

    profil.abonner(() => this.#refleterEtat());

    this.#armerDeclencheurs();
    addEventListener('scroll', () => { this.#aDefile = true; }, { passive: true, once: true });
    this.#minuterie = setInterval(() => this.#ordonnancer(), 1500);
  }

  disconnectedCallback() {
    clearInterval(this.#minuterie);
  }

  get #ouverte() { return !this.#carte.hidden; }

  /* --- état visible dans la page ---------------------------------------- */

  #refleterEtat() {
    const actif = !profil.estVide();
    for (const n of $$('[data-etat-profil]')) {
      n.dataset.actif = String(actif);
      if (n.getAttribute('role') === 'switch') n.setAttribute('aria-checked', String(actif));
    }
    for (const n of $$('[data-profil-mini]')) {
      n.textContent = actif ? `Pensé pour : ${profil.resume()}` : n.dataset.profilMini;
    }
  }

  /* --- déclencheurs ------------------------------------------------------ */

  #armerDeclencheurs() {
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          this.#armees.add(Number(e.target.dataset.conciergePartie));
          obs.unobserve(e.target);
        }
      },
      { threshold: 0.2 }
    );
    for (const [partie, cibles] of Object.entries(DECLENCHEURS)) {
      for (const sel of cibles) {
        const n = $(sel);
        if (!n) continue;
        n.dataset.conciergePartie = partie;
        obs.observe(n);
        break;
      }
    }
  }

  /* --- ordonnanceur (passages spontanés) ---------------------------------- */

  #ordonnancer() {
    if (this.#ouverte || document.hidden) return;
    if (document.body.classList.contains('defilement-bloque')) return;
    if (!this.#aDefile) return;
    const e = profil.etat();

    /* L'accueil, une seule fois dans la vie du visiteur. */
    if (!e.accueilVu) {
      if (Date.now() - this.#debut < DELAI_ACCUEIL) return;
      this.#afficherAccueil();
      return;
    }
    /* « Bon retour », une fois par visite, s'il nous avait déjà répondu. */
    if (!retourDejaDit() && e.visites > 1 && !profil.estVide()) {
      if (Date.now() - this.#debut < DELAI_ACCUEIL) return;
      noterRetour();
      this.#afficherRetour();
      return;
    }

    if (e.silence) return;
    if (Date.now() - this.#derniere < DELAI_POLITESSE) return;

    /* Dans l'ordre : la partie 2 attend que la 1 ait été proposée. */
    for (const partie of [1, 2]) {
      if (this.#vues.has(partie)) continue;
      if (this.#armees.has(partie)) this.#lancerPartie(partie);
      return;
    }
  }

  #lancerPartie(partie) {
    this.#vues.add(partie);
    this.#demarrer(profil.PARTIES[partie], INTITULES[partie], partie);
  }

  /** Les six questions d'affilée. Appelé par les interrupteurs, « Commencer
      maintenant », « Mon besoin a changé ». */
  ouvrirQuestionnaire() {
    profil.marquerAccueilVu();
    this.#vues.add(1);
    this.#vues.add(2);
    this.#demarrer(profil.TOUTES, INTITULES.guide, 'guide');
  }

  #demarrer(etapes, intitule, origine) {
    this.#mode = 'parcours';
    this.#origine = origine;
    this.#etapes = etapes;
    this.#i = 0;
    this.#intitule = intitule;
    this.#rendreEtape();
    this.#ouvrir();
  }

  #origine = null;          // 1 | 2 | 'guide'

  /* --- rendu -------------------------------------------------------------- */

  #corps() { return $('[data-corps]', this); }

  #afficherAccueil() {
    this.#mode = 'accueil';
    this.#corps().innerHTML = `
      <p class="concierge__titre">Bienvenue chez Dilitech.</p>
      <p class="concierge__texte">
        Ici, on commence toujours par votre usage. Faisons connaissance en
        quelques questions : nous vous montrerons ce qui vous convient vraiment.
      </p>
      <div class="concierge__actions">
        <button type="button" class="concierge__principal" data-commencer>Commencer maintenant</button>
        <button type="button" class="concierge__lien" data-fermer>Je regarde d’abord</button>
      </div>`;
    this.#ouvrir();
  }

  #afficherRetour() {
    this.#mode = 'retour';
    const p = profil.prenom();
    this.#corps().innerHTML = `
      <p class="concierge__titre">Bon retour parmi nous${p ? `, ${esc(p)}` : ''}.</p>
      <p class="concierge__texte">
        Votre sélection, pensée pour ${esc(profil.resume())}, vous attend.
      </p>
      <div class="concierge__actions">
        <a class="concierge__principal" href="index.html#selection" data-fermer-lien>La voir ${icone('fleche')}</a>
        <button type="button" class="concierge__lien" data-tout>Mon besoin a changé</button>
      </div>`;
    this.#ouvrir();
  }

  #rendreEtape() {
    const q = this.#etapes[this.#i];
    const Q = profil.QUESTIONS[q];
    const n = this.#etapes.length;
    const premiere = this.#i === 0;
    const derniere = this.#i === n - 1;
    const valeur = profil.valeur(q);
    const dejaDit = profil.aRepondu(q);
    const prenom = profil.prenom();
    this.#choix = new Set(Array.isArray(valeur) ? valeur : valeur ? [valeur] : []);

    /* Usage encore inconnu mais métier donné : on pré-coche ce que le métier
       laisse deviner (graphiste → création…) — le visiteur ajuste. */
    const suggere = q === 'usages' && !dejaDit && profil.usagesSuggeres().length > 0;
    if (suggere) this.#choix = new Set(profil.usagesSuggeres());

    /* Un mot d'accueil juste après avoir donné son prénom. */
    const salut = prenom && this.#etapes[this.#i - 1] === 'prenom'
      ? `<p class="concierge__salut">Enchanté, ${esc(prenom)}.</p>`
      : '';

    const saisie = Q.type === 'texte'
      ? `<label class="concierge__champ-bloc">
           <span class="sr-only">${esc(Q.titre)}</span>
           <input class="concierge__champ" data-champ type="text" maxlength="40"
                  autocomplete="given-name" placeholder="Votre prénom" value="${esc(prenom)}">
         </label>`
      : `<div class="concierge__options" role="group" aria-label="${esc(Q.titre)}">
           ${Q.options
             /* « Autre » n'est pas une puce : c'est le champ libre en dessous. */
             .filter((o) => !(Q.libre && o.code === 'autre'))
             .map(
               (o) => `<button type="button" class="concierge__opt" data-opt="${esc(o.code)}"
                               aria-pressed="${this.#choix.has(o.code)}">${esc(o.nom)}</button>`
             )
             .join('')}
         </div>
         ${
           Q.libre
             ? `<label class="concierge__champ-bloc concierge__champ-bloc--libre">
                  <span class="sr-only">${esc(Q.libre)}</span>
                  <input class="concierge__champ" data-libre type="text" maxlength="60"
                         autocomplete="organization-title" placeholder="${esc(Q.libre)}"
                         value="${esc(this.#choix.has('autre') ? profil.etat().metierLibre : '')}">
                </label>`
             : ''
         }`;

    const aide = suggere
      ? `D’après votre métier, nous avons pré-coché ce qui vous ressemble — ajustez librement.`
      : dejaDit && Q.type !== 'texte'
        ? 'Votre dernière réponse est cochée : confirmez, ou changez-la.'
        : Q.aide;

    this.#corps().innerHTML = `
      <div class="concierge__progres" aria-hidden="true">
        ${this.#etapes.map((_, k) => `<i class="${k < this.#i ? 'est-fait' : k === this.#i ? 'est-actuel' : ''}"></i>`).join('')}
      </div>
      <p class="concierge__etape">${esc(this.#intitule)} · Question ${this.#i + 1} sur ${n}</p>
      ${salut}
      <p class="concierge__titre">${esc(Q.titre)}</p>
      <p class="concierge__aide">${esc(aide)}</p>
      ${saisie}
      <div class="concierge__nav">
        ${premiere ? '<span></span>' : `<button type="button" class="concierge__retour" data-precedent>${icone('chevronGauche')} Précédent</button>`}
        <button type="button" class="concierge__principal" data-suivant>
          ${derniere ? 'C’est noté' : `Suivant ${icone('chevronDroite')}`}
        </button>
      </div>
      ${
        this.#origine === 'guide'
          ? ''
          : `<div class="concierge__pied">
               <button type="button" class="concierge__lien" data-fermer>Plus tard</button>
               <span aria-hidden="true">·</span>
               <button type="button" class="concierge__lien" data-silence>Ne plus me demander</button>
             </div>`
      }`;

    /* Le champ prénom prend le focus s'il est vide — pas de clavier qui
       surgit sur mobile quand le visiteur n'a encore rien demandé. */
    const champ = $('[data-champ]', this);
    if (champ && !champ.value && this.#origine === 'guide') champ.focus({ preventScroll: true });
  }

  /** Enregistre la réponse de l'étape affichée (si le visiteur en a donné une). */
  #enregistrer() {
    const q = this.#etapes[this.#i];
    const Q = profil.QUESTIONS[q];
    if (Q.type === 'texte') {
      const champ = $('[data-champ]', this);
      if (champ) profil.repondre(q, champ.value);
      return;
    }
    if (Q.libre) {
      const libre = $('[data-libre]', this)?.value.trim() ?? '';
      if (libre) { profil.repondre(q, 'autre', libre); return; }
      this.#choix.delete('autre');
    }
    if (!this.#choix.size) return;   // rien de coché : on passe sans effacer
    profil.repondre(q, profil.estMultiple(q) ? [...this.#choix] : [...this.#choix][0]);
  }

  #avancer(pas) {
    this.#enregistrer();
    const i = this.#i + pas;
    if (i < 0) return;
    if (i >= this.#etapes.length) { this.#merci(); return; }
    this.#i = i;
    this.#rendreEtape();
  }

  #merci() {
    this.#mode = 'merci';
    const p = profil.prenom();
    if (profil.estVide()) {
      this.#corps().innerHTML = `
        <p class="concierge__titre">Merci${p ? ` ${esc(p)}` : ''}.</p>
        <p class="concierge__texte">Dites-nous votre usage quand vous voudrez : la sélection s’adaptera.</p>`;
    } else {
      const vers = surAccueil()
        ? { href: 'index.html#selection', mot: 'Voir ma sélection' }
        : { href: `catalogue.html?usage=${encodeURIComponent(profil.etat().usages.join(','))}`, mot: 'Voir ce qui vous correspond' };
      this.#corps().innerHTML = `
        <div class="concierge__merci">
          <span class="concierge__ok">${icone('check')}</span>
          <div>
            <p class="concierge__titre">Merci${p ? ` ${esc(p)}` : ''}, c’est noté.</p>
            <p class="concierge__texte">La sélection s’est adaptée à vous.</p>
            <a class="concierge__lien concierge__lien--fort" href="${vers.href}" data-fermer-lien>${vers.mot} ${icone('fleche')}</a>
          </div>
        </div>`;
    }
    this.#fermetureAuto = setTimeout(() => this.#fermer(), FERMETURE_MERCI);
  }

  #ouvrir() {
    clearTimeout(this.#fermetureAuto);
    if (this.#ouverte) return;
    this.#carte.hidden = false;
    requestAnimationFrame(() => this.classList.add('est-ouvert'));
  }

  #fermer() {
    if (!this.#ouverte) return;
    clearTimeout(this.#fermetureAuto);
    if (this.#mode === 'accueil') profil.marquerAccueilVu();
    this.#mode = null;
    this.#derniere = Date.now();
    this.classList.remove('est-ouvert');
    /* Le repli à 400 ms masque souvent la carte AVANT la fin de sa
       transition : `transitionend` ne part alors jamais et l'écouteur reste
       accroché — il refermait la carte suivante dès son ouverture. D'où la
       garde : on ne masque que si aucune carte n'a été rouverte entre-temps. */
    const cacher = () => { if (!this.#mode) this.#carte.hidden = true; };
    this.#carte.addEventListener('transitionend', cacher, { once: true });
    setTimeout(cacher, 400);
  }

  /* --- interactions ------------------------------------------------------ */

  #clic(e) {
    const t = e.target;

    if (t.closest('[data-fermer-lien]')) { this.#fermer(); return; }
    if (t.closest('[data-fermer]')) { this.#fermer(); return; }
    if (t.closest('[data-silence]')) { profil.taire(); this.#fermer(); return; }
    if (t.closest('[data-commencer]')) {
      profil.marquerAccueilVu();
      this.#lancerPartie(1);
      return;
    }
    if (t.closest('[data-tout]')) { this.ouvrirQuestionnaire(); return; }
    if (t.closest('[data-precedent]')) { this.#avancer(-1); return; }
    if (t.closest('[data-suivant]')) { this.#avancer(1); return; }

    const opt = t.closest('[data-opt]');
    if (!opt || this.#mode !== 'parcours') return;
    const q = this.#etapes[this.#i];
    const code = opt.dataset.opt;
    if (profil.estMultiple(q)) {
      if (this.#choix.has(code)) this.#choix.delete(code);
      else {
        const max = profil.QUESTIONS[q].max;
        if (max && this.#choix.size >= max) return;   // plafond atteint : on ne coche pas
        this.#choix.add(code);
      }
    } else {
      /* Choix unique : un clic coche (ou décoche) — c'est « Suivant » qui
         avance, pas le clic. */
      this.#choix = this.#choix.has(code) ? new Set() : new Set([code]);
      const libre = $('[data-libre]', this);
      if (libre) libre.value = '';
    }
    for (const b of $$('[data-opt]', this)) {
      b.setAttribute('aria-pressed', String(this.#choix.has(b.dataset.opt)));
    }
  }
}

customElements.define('dilitech-concierge', Concierge);
