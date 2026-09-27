/* =========================================================================
   DILITECH — en-tête et pied de page
   -------------------------------------------------------------------------
   Deux éléments personnalisés, `<site-entete>` et `<site-pied>`, plutôt que
   le même bloc HTML recopié dans six fichiers. Il n'y a donc RIEN à
   régénérer quand la navigation change : on modifie ce fichier, et les six
   pages suivent.

   Ils travaillent en DOM clair (pas de Shadow DOM) pour que style.css
   s'applique normalement — c'est un site vitrine, l'isolation des styles
   n'apporterait ici que de la complexité.

   La page indique son propre onglet actif par `<site-entete page="catalogue">`.
   ========================================================================= */

import { SITE, CONTACT, WHATSAPP } from '../config.js';
import { CATEGORIES } from '../data/produits.js';
import { icone } from '../core/icones.js';
import { esc, $, $$ } from '../core/dom.js';
import { verrouillerDefilement, deverrouillerDefilement, piegerFocus, toast } from '../core/ui.js';
import * as devis from '../core/devis.js';

/* --- le logo, seul endroit où la marque est dessinée ------------------- */

/** Marque « IOI » : deux barres et un disque, proportions de la charte. */
export const marque = () => `
  <svg class="marque__signe" viewBox="0 0 160 100" aria-hidden="true">
    <rect x="0" y="0" width="19.2" height="100" rx="9.6"/>
    <circle cx="79.9" cy="50" r="44.7"/>
    <rect x="140.8" y="0" width="19.2" height="100" rx="9.6"/>
  </svg>`;

/** Logo complet : le signe + le mot, « DILI » gras et « TECH » très fin. */
export const logo = (classe = '') => `
  <span class="marque ${classe}">
    ${marque()}
    <span class="marque__mot"><b>DILI</b><i>TECH</i></span>
  </span>`;

/* Le site n'a plus que deux pages : index.html (tout le contenu, en
   sections) et catalogue.html (filtres, recherche — le seul écran qui a
   vraiment besoin d'être à part). Services/Réseau/Conseils/Contact pointent
   donc vers des ancres de l'accueil (#services, #reseau, #conseils,
   #contact), jamais vers une page dédiée : services.html, reseau.html,
   conseils.html, contact.html, produit.html et article.html ont été
   supprimés, leur contenu vit désormais dans index.html (fiche produit et
   article en panneau superposé, voir panneau-produit.js/panneau-article.js).
   Le préfixe `index.html` (plutôt qu'un simple `#services`) est ce qui
   permet à ces liens de fonctionner depuis catalogue.html aussi, pas
   seulement depuis l'accueil ; activerAncresAccueil() dans ui.js transforme
   ensuite le clic en défilement doux quand on est déjà sur l'accueil, pour
   éviter un rechargement complet. */
/* Réseau et Conseils retirés du menu à la demande du client (trop de liens) :
   leurs sections restent sur l'accueil, joignables en défilant. */
const LIENS = [
  { cle: 'accueil',   href: 'index.html',              libelle: 'Accueil' },
  { cle: 'catalogue', href: 'catalogue.html',          libelle: 'Catalogue' },
  { cle: 'services',  href: 'index.html#services',     libelle: 'Services' },
  { cle: 'conseils',  href: 'conseils.html',           libelle: 'Conseils' },
  { cle: 'contact',   href: 'index.html#contact',      libelle: 'Contact' },
];

const telPrincipal = CONTACT.telephones.find((t) => t.principal) ?? CONTACT.telephones[0];

/* =========================================================================
   <site-entete page="...">
   ========================================================================= */

class SiteEntete extends HTMLElement {
  connectedCallback() {
    const actif = this.getAttribute('page') ?? '';
    this.className = 'site-entete';
    /* Par défaut la page ouvre sur une bande sombre (`.entete-page.nuit` ou
       le hero de l'accueil) : la nav peut s'y superposer en transparence et
       se solidifier au défilement, comme chez VP/EventMotors. Les pages qui
       ouvrent directement sur une section claire (fiche produit, article —
       leur en-tête est injecté en JS, pas une bande sombre fixe) le signalent
       avec `fond="clair"` : la nav y reste opaque dès le premier pixel. */
    if (this.getAttribute('fond') !== 'clair') this.classList.add('site-entete--sombre');

    this.innerHTML = `
      <div class="nav">
        <div class="wrap nav__in">
          <a class="nav__logo" href="index.html" aria-label="${esc(SITE.nomComplet)} — accueil">
            ${logo()}
          </a>

          <nav class="nav__liens" aria-label="Navigation principale">
            ${LIENS.map(
              (l) => `<a href="${l.href}"${l.cle === actif ? ' aria-current="page"' : ''}>${esc(l.libelle)}</a>`
            ).join('')}
          </nav>

          <div class="nav__actions">
            <button type="button" class="btn btn--devis js-ouvrir-devis" aria-label="Ouvrir ma sélection">
              ${icone('devis')}
              <span class="btn--devis__mot">Ma sélection</span>
              <span class="pastille" data-pastille hidden>0</span>
            </button>
            <button type="button" class="nav__burger js-burger"
                    aria-label="Ouvrir le menu" aria-expanded="false">
              ${icone('menu', { classe: 'js-ico-menu' })}
            </button>
          </div>
        </div>
      </div>

      <!-- menu mobile : panneau plein écran, fermé par défaut -->
      <div class="menu" hidden>
        <div class="menu__in">
          <nav class="menu__liens" aria-label="Navigation">
            ${LIENS.map(
              (l, i) =>
                `<a href="${l.href}" style="--i:${i}"${l.cle === actif ? ' aria-current="page"' : ''}>
                   <span>${esc(l.libelle)}</span>${icone('chevronDroite')}
                 </a>`
            ).join('')}
          </nav>
          <div class="menu__cats">
            <p class="menu__titre">Catalogue</p>
            ${CATEGORIES.map(
              (c) => `<a href="catalogue.html?cat=${c.code}">${esc(c.nom)}</a>`
            ).join('')}
          </div>
          <div class="menu__pied">
            <a class="btn btn--wa" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">
              ${icone('whatsapp')} Écrire sur WhatsApp
            </a>
            <a class="menu__tel" href="tel:${esc(telPrincipal.tel)}">
              ${icone('telephone')} ${esc(telPrincipal.label)}
            </a>
          </div>
        </div>
      </div>`;

    this.#brancherMenu();
    this.#brancherPastille();
  }

  /* --- menu mobile ---------------------------------------------------- */
  #brancherMenu() {
    const burger = $('.js-burger', this);
    const menu = $('.menu', this);
    let libererFocus = null;

    const definir = (ouvert) => {
      menu.hidden = !ouvert;
      this.classList.toggle('menu-ouvert', ouvert);
      burger.setAttribute('aria-expanded', String(ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      burger.innerHTML = icone(ouvert ? 'fermer' : 'menu');
      if (ouvert) {
        verrouillerDefilement();
        libererFocus = piegerFocus(menu);
      } else {
        deverrouillerDefilement();
        libererFocus?.();
        libererFocus = null;
      }
    };

    burger.addEventListener('click', () => definir(menu.hidden));
    /* Un lien cliqué ferme le menu : sur une ancre de la même page, aucune
       navigation n'a lieu et le panneau resterait ouvert par-dessus. */
    $$('.menu a', this).forEach((a) => a.addEventListener('click', () => definir(false)));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) definir(false);
    });
    /* Repasser en grand écran alors que le menu mobile est ouvert le laissait
       verrouiller le défilement de la page. */
    matchMedia('(min-width: 981px)').addEventListener('change', (e) => {
      if (e.matches && !menu.hidden) definir(false);
    });
  }

  /* --- pastille de la sélection ---------------------------------------- */
  #brancherPastille() {
    const maj = () => {
      const n = devis.nombreArticles();
      for (const p of $$('[data-pastille]', this)) {
        p.textContent = n > 99 ? '99+' : String(n);
        p.hidden = n === 0;
      }
      this.classList.toggle('a-selection', n > 0);
    };
    devis.abonner(maj);
  }
}

/* =========================================================================
   <site-pied>
   ========================================================================= */

class SitePied extends HTMLElement {
  connectedCallback() {
    this.className = 'site-pied grain';

    this.innerHTML = `
      <!-- Bande « contact » reprise à la lettre de la référence (Docs/section/
           contact dili tech.jfif) : texte fantôme, pastille, titre, cartes en
           taille réelle — pas la version compacte d'une colonne de pied de
           page. Posée sur toutes les pages, au-dessus des colonnes de liens
           habituelles plutôt qu'à leur place : un footer garde sa fonction de
           plan du site, ce bandeau lui ajoute la vitrine de contact.

           id="contact" : depuis que la grande section Contact/devis de
           l'accueil a été retirée (le client la jugeait redondante avec ce
           bandeau), c'est CE bloc qui reçoit tous les liens
           « index.html#contact » du site (nav, hero, CTA de services, panneau
           produit…) — présent sur les deux pages puisque <site-pied> l'est. -->
      <div class="pied-contact" id="contact">
        <p class="entete-page__fantome" aria-hidden="true">Contact</p>
        <div class="pied-contact__trait pied-contact__trait--gauche" aria-hidden="true"></div>
        <div class="pied-contact__trait pied-contact__trait--droite" aria-hidden="true"></div>
        <div class="wrap pied-contact__in">
          <div class="pied-contact__grille">
            <div class="pied-contact__intro">
              <span class="contact-pill">◉ Contact</span>
              <h2 class="titre titre--petit">Une question ? <em>Écrivez-nous.</em></h2>
              <p class="pied-contact__texte">
                Un conseil, un devis, ou du matériel à faire réparer ?
                Notre équipe vous répond sous 24 heures ouvrées.
              </p>
              <div class="contact-cartes">
                <a class="contact-carte" href="mailto:${esc(CONTACT.email)}">
                  <span class="contact-carte__ic">${icone('mail')}</span>
                  <span class="contact-carte__txt">
                    <span class="contact-carte__label">Nous écrire</span>
                    <span class="contact-carte__valeur">${esc(CONTACT.email)}</span>
                  </span>
                  <span class="contact-carte__fleche">${icone('fleche')}</span>
                </a>
                <a class="contact-carte" href="tel:${esc(telPrincipal.tel)}">
                  <span class="contact-carte__ic">${icone('telephone')}</span>
                  <span class="contact-carte__txt">
                    <span class="contact-carte__label">Nous appeler</span>
                    <span class="contact-carte__valeur">${esc(telPrincipal.label)}</span>
                  </span>
                  <span class="contact-carte__fleche">${icone('fleche')}</span>
                </a>
                <a class="contact-carte" target="_blank" rel="noopener"
                   href="https://www.google.com/maps/search/${encodeURIComponent(CONTACT.mapsQuery)}">
                  <span class="contact-carte__ic">${icone('broche')}</span>
                  <span class="contact-carte__txt">
                    <span class="contact-carte__label">Notre adresse</span>
                    <span class="contact-carte__valeur">${esc(CONTACT.adresse)}, ${esc(CONTACT.ville)}</span>
                  </span>
                  <span class="contact-carte__fleche">${icone('fleche')}</span>
                </a>
              </div>
            </div>

            <!-- Formulaire court : même moteur que la page Contact (devis.js),
                 pour qu'une demande lancée depuis n'importe quelle page parte
                 au même format WhatsApp — pas de collecte séparée qui n'irait
                 nulle part. -->
            <form class="pied-contact__form" data-form-pied-contact novalidate>
              <p class="pied-contact__form-titre">Message rapide</p>
              <label class="champ">
                <span class="sr-only">Nom</span>
                <input name="nom" type="text" autocomplete="name" required placeholder="Votre nom">
              </label>
              <label class="champ">
                <span class="sr-only">Téléphone / WhatsApp</span>
                <input name="telephone" type="tel" autocomplete="tel" required placeholder="Téléphone / WhatsApp">
              </label>
              <label class="champ">
                <span class="sr-only">Votre message</span>
                <textarea name="message" rows="3" required placeholder="Votre besoin en quelques mots"></textarea>
              </label>
              <button type="submit" class="btn btn--wa">
                ${icone('whatsapp')} Envoyer sur WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>

      <button type="button" class="remonter" aria-label="Revenir en haut de la page">
        ${icone('flecheHaut')}
      </button>`;

    this.#brancherFormulaire();
  }

  /* --- message rapide du pied de page ---------------------------------- */
  #brancherFormulaire() {
    const form = $('[data-form-pied-contact]', this);
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = Object.fromEntries(new FormData(form).entries());
      const { lien } = await devis.soumettre(d);
      const fenetre = open(lien, '_blank', 'noopener');
      if (!fenetre) { location.href = lien; return; }
      toast('Demande prête — terminez la conversation pour recevoir votre devis', {
        ton: 'ok',
        duree: 5200,
      });
      form.reset();
    });
  }
}

customElements.define('site-entete', SiteEntete);
customElements.define('site-pied', SitePied);
