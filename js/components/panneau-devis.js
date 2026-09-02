/* =========================================================================
   DILITECH — panneau « Ma sélection »
   -------------------------------------------------------------------------
   Tiroir latéral présent sur toutes les pages. Il tient tout le parcours de
   demande de devis : lignes, quantités, total indicatif, coordonnées, puis
   départ sur WhatsApp (avec repli e-mail).

   Deux garde-fous voulus par le cahier des charges :
     — le total est explicitement « indicatif » (le prix ferme vient du devis) ;
     — le nom et le téléphone sont obligatoires : sans client identifiable,
       la demande n'a pas de valeur pour le CRM de la phase 2.

   Il s'ouvre par n'importe quel `.js-ouvrir-devis` et écoute la délégation
   globale des clics sur `.js-ajouter` (posée par js/pages/commun.js).
   ========================================================================= */

import { CONTACT, prix as fmtPrix } from '../config.js';
import { illustration } from '../data/illustrations.js';
import * as devis from '../core/devis.js';
import { $, $$, esc } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { toast, verrouillerDefilement, deverrouillerDefilement, piegerFocus } from '../core/ui.js';

class PanneauDevis extends HTMLElement {
  #libererFocus = null;
  #desabonner = null;

  connectedCallback() {
    this.className = 'panneau';
    this.hidden = true;
    this.innerHTML = `
      <div class="panneau__voile" data-fermer></div>
      <aside class="panneau__boite" role="dialog" aria-modal="true"
             aria-label="Ma sélection pour devis">
        <header class="panneau__tete">
          <div>
            <p class="panneau__sur">Demande de devis</p>
            <h2 class="panneau__titre">Ma sélection</h2>
          </div>
          <button type="button" class="panneau__x" data-fermer aria-label="Fermer">
            ${icone('fermer')}
          </button>
        </header>

        <div class="panneau__corps" data-corps></div>

        <footer class="panneau__pied" data-pied hidden></footer>
      </aside>`;

    $$('[data-fermer]', this).forEach((n) => n.addEventListener('click', () => this.fermer()));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.hidden) this.fermer();
    });

    this.#desabonner = devis.abonner(() => this.#rendre());
  }

  disconnectedCallback() {
    this.#desabonner?.();
  }

  /* --- ouverture / fermeture ------------------------------------------- */

  ouvrir() {
    if (!this.hidden) return;
    this.hidden = false;
    /* Une image d'affichage avant d'ajouter la classe : sinon la transition
       d'entrée est avalée par le passage de `hidden` à visible. */
    requestAnimationFrame(() => this.classList.add('est-ouvert'));
    verrouillerDefilement();
    this.#libererFocus = piegerFocus(this);
  }

  fermer() {
    if (this.hidden) return;
    this.classList.remove('est-ouvert');
    deverrouillerDefilement();
    this.#libererFocus?.();
    this.#libererFocus = null;
    const cacher = () => { this.hidden = true; };
    this.addEventListener('transitionend', cacher, { once: true });
    setTimeout(cacher, 400); // repli si la transition ne part pas
  }

  /* --- rendu ------------------------------------------------------------ */

  #rendre() {
    const corps = $('[data-corps]', this);
    const pied = $('[data-pied]', this);
    if (!corps) return;

    const lignes = devis.lignes();

    if (!lignes.length) {
      corps.innerHTML = `
        <div class="panneau__vide">
          ${icone('devis')}
          <p class="panneau__vide-titre">Votre sélection est vide</p>
          <p class="panneau__vide-txt">
            Ajoutez les produits qui vous intéressent : vous obtiendrez un
            récapitulatif à envoyer d'un seul message, et nous vous répondrons
            avec un devis chiffré.
          </p>
          <a class="btn btn--plein" href="catalogue.html">Parcourir le catalogue</a>
        </div>`;
      pied.hidden = true;
      return;
    }

    corps.innerHTML = `
      <ul class="panneau__lignes">
        ${lignes.map((l) => this.#ligne(l)).join('')}
      </ul>
      <button type="button" class="panneau__vider js-vider">
        ${icone('corbeille')} Vider la sélection
      </button>

      <form class="panneau__form" novalidate>
        <p class="panneau__form-titre">Vos coordonnées</p>
        <p class="panneau__form-aide">
          Nécessaires pour établir le devis. Nous ne les utilisons que pour
          répondre à cette demande.
        </p>

        <label class="champ">
          <span>Nom et prénom <b aria-hidden="true">*</b></span>
          <input name="nom" type="text" autocomplete="name" required
                 placeholder="Ex. Awa Traoré">
        </label>

        <label class="champ">
          <span>Téléphone (WhatsApp de préférence) <b aria-hidden="true">*</b></span>
          <input name="telephone" type="tel" autocomplete="tel" required
                 placeholder="Ex. +223 71 00 00 00">
        </label>

        <div class="champ-duo">
          <label class="champ">
            <span>Structure</span>
            <input name="structure" type="text" autocomplete="organization"
                   placeholder="Facultatif">
          </label>
          <label class="champ">
            <span>Ville</span>
            <input name="ville" type="text" autocomplete="address-level2"
                   placeholder="Ex. Bamako">
          </label>
        </div>

        <label class="champ">
          <span>E-mail</span>
          <input name="email" type="email" autocomplete="email" placeholder="Facultatif">
        </label>

        <label class="champ">
          <span>Précisions</span>
          <textarea name="message" rows="3"
                    placeholder="Délai souhaité, contraintes, usage prévu…"></textarea>
        </label>
      </form>`;

    const alertes = devis.alertesStock();
    pied.hidden = false;
    pied.innerHTML = `
      ${
        alertes.length
          ? `<p class="panneau__alerte">
               ${icone('etincelle')}
               <span>${alertes.length === 1 ? 'Une quantité dépasse' : 'Des quantités dépassent'}
               notre stock réseau. Nous confirmerons le délai d'approvisionnement.</span>
             </p>`
          : ''
      }
      <div class="panneau__total">
        <span>Total indicatif</span>
        <strong>${esc(fmtPrix(devis.total()))}</strong>
      </div>
      <p class="panneau__mention">
        Hors remise et hors livraison. Le montant ferme vous est confirmé par devis.
      </p>
      <button type="button" class="btn btn--wa btn--large js-envoyer">
        ${icone('whatsapp')} Envoyer sur WhatsApp
      </button>
      <button type="button" class="btn btn--ligne btn--large js-envoyer-mail">
        ${icone('mail')} Envoyer par e-mail
      </button>`;

    this.#brancherActions();
    this.#remplirCoordonnees();
  }

  #ligne(l) {
    const p = l.produit;
    return `
      <li class="pligne" data-id="${esc(p.id)}">
        <span class="pligne__illus">${illustration(p.illus)}</span>
        <div class="pligne__txt">
          <a class="pligne__nom" href="produit.html?id=${encodeURIComponent(p.id)}">${esc(p.nom)}</a>
          <p class="pligne__ref">${esc(p.id)} · ${esc(fmtPrix(p.prix))}${p.unite ? ` / ${esc(p.unite)}` : ''}</p>
          <div class="qte">
            <button type="button" class="qte__b js-moins" aria-label="Retirer un">${icone('moins')}</button>
            <input class="qte__n js-qte" type="number" inputmode="numeric" min="1" max="99"
                   value="${l.qte}" aria-label="Quantité pour ${esc(p.nom)}">
            <button type="button" class="qte__b js-plus" aria-label="Ajouter un">${icone('plus')}</button>
          </div>
        </div>
        <div class="pligne__droite">
          <p class="pligne__total">${esc(fmtPrix(l.sousTotal))}</p>
          <button type="button" class="pligne__x js-retirer"
                  aria-label="Retirer ${esc(p.nom)} de la sélection">${icone('corbeille')}</button>
        </div>
      </li>`;
  }

  /* --- interactions ------------------------------------------------------ */

  #brancherActions() {
    /* Délégation : le contenu est re-rendu à chaque changement, brancher
       ligne par ligne ferait fuir les écouteurs. */
    const corps = $('[data-corps]', this);
    if (corps.dataset.branche) return;
    corps.dataset.branche = '1';

    corps.addEventListener('click', (e) => {
      const li = e.target.closest('.pligne');
      if (li) {
        const id = li.dataset.id;
        if (e.target.closest('.js-plus'))    { devis.ajouter(id, 1); return; }
        if (e.target.closest('.js-moins'))   { devis.definirQuantite(id, devis.quantite(id) - 1); return; }
        if (e.target.closest('.js-retirer')) { devis.retirer(id); return; }
      }
      if (e.target.closest('.js-vider')) {
        devis.vider();
        toast('Sélection vidée', { ton: 'info' });
      }
    });

    corps.addEventListener('change', (e) => {
      const champ = e.target.closest('.js-qte');
      if (!champ) return;
      const id = champ.closest('.pligne')?.dataset.id;
      if (id) devis.definirQuantite(id, champ.value);
    });

    const pied = $('[data-pied]', this);
    if (pied.dataset.branche) return;
    pied.dataset.branche = '1';
    pied.addEventListener('click', (e) => {
      if (e.target.closest('.js-envoyer')) this.#envoyer('whatsapp');
      if (e.target.closest('.js-envoyer-mail')) this.#envoyer('mail');
    });
  }

  /** Réinjecte les coordonnées déjà saisies lors d'une visite précédente. */
  #remplirCoordonnees() {
    const form = $('.panneau__form', this);
    const memo = devis.client();
    if (!form || !memo) return;
    for (const [k, v] of Object.entries(memo)) {
      const champ = form.elements[k];
      if (champ && !champ.value) champ.value = v ?? '';
    }
  }

  #coordonnees() {
    const form = $('.panneau__form', this);
    if (!form) return {};
    return Object.fromEntries(new FormData(form).entries());
  }

  async #envoyer(canal) {
    const form = $('.panneau__form', this);
    const data = this.#coordonnees();

    /* Validation maison plutôt que native : le panneau doit pouvoir marquer
       le champ fautif et l'amener sous les yeux, ce que `required` seul ne
       fait pas dans un tiroir qui défile. */
    const manquants = ['nom', 'telephone'].filter((k) => !String(data[k] ?? '').trim());
    $$('.champ.est-erreur', this).forEach((n) => n.classList.remove('est-erreur'));

    if (manquants.length) {
      for (const k of manquants) form.elements[k]?.closest('.champ')?.classList.add('est-erreur');
      const premier = form.elements[manquants[0]];
      premier?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      premier?.focus({ preventScroll: true });
      toast('Indiquez au moins votre nom et votre téléphone', { ton: 'alerte' });
      return;
    }

    const { lien } = await devis.soumettre(data);
    const cible = canal === 'mail' ? devis.lienMail(data, CONTACT.email) : lien;

    /* `noopener` systématique : la page ouverte ne doit pas pouvoir manipuler
       la nôtre. */
    const fenetre = open(cible, '_blank', 'noopener');
    if (!fenetre) {
      /* Bloqueur de fenêtres : on ne perd pas la demande, on donne le lien. */
      location.href = cible;
      return;
    }
    toast('Demande prête — terminez la conversation pour recevoir votre devis', {
      ton: 'ok',
      duree: 5200,
    });
  }
}

customElements.define('panneau-devis', PanneauDevis);

/** Ouvre le panneau depuis n'importe où. */
export function ouvrirPanneau() {
  document.querySelector('panneau-devis')?.ouvrir();
}
