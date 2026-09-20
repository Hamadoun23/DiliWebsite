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

import { SITE, CONTACT, RESEAUX, HORAIRES, WHATSAPP } from '../config.js';
import { CATEGORIES } from '../data/produits.js';
import { icone } from '../core/icones.js';
import { esc, $, $$ } from '../core/dom.js';
import { verrouillerDefilement, deverrouillerDefilement, piegerFocus } from '../core/ui.js';
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

/* Services/Réseau/Conseils/Contact pointent vers les sections de l'accueil
   (#services, #reseau, #conseils, #contact) plutôt que vers leurs pages
   dédiées : la nav tient sur une seule page, Catalogue mis à part — lui
   seul garde un vrai besoin de page séparée (filtres, recherche). Les
   pages dédiées (services.html, reseau.html, conseils.html, contact.html)
   restent en ligne pour qui a le lien direct ou pour le référencement,
   simplement retirées du menu principal.
   Le préfixe `index.html` (plutôt qu'un simple `#services`) est ce qui
   permet à ces liens de fonctionner depuis n'importe quelle page — la nav
   est partagée par les neuf pages du site, pas seulement l'accueil ;
   activerAncresAccueil() dans ui.js transforme ensuite le clic en défilement
   doux quand on est déjà sur l'accueil, pour éviter un rechargement complet. */
const LIENS = [
  { cle: 'accueil',   href: 'index.html',              libelle: 'Accueil' },
  { cle: 'catalogue', href: 'catalogue.html',          libelle: 'Catalogue' },
  { cle: 'services',  href: 'index.html#services',     libelle: 'Services' },
  { cle: 'reseau',    href: 'index.html#reseau',       libelle: 'Réseau' },
  { cle: 'conseils',  href: 'index.html#conseils',     libelle: 'Conseils' },
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
      <!-- bandeau d'activité : ce que fait Dilitech, dès le premier pixel -->
      <div class="bandeau">
        <div class="wrap bandeau__in">
          <p class="bandeau__txt">
            <span>${esc(SITE.baseline)}</span>
            <span class="bandeau__sep" aria-hidden="true">·</span>
            <span>${esc(SITE.sousBaseline)}</span>
          </p>
          <p class="bandeau__coord">
            <a href="tel:${esc(telPrincipal.tel)}">${icone('telephone')}${esc(telPrincipal.label)}</a>
            <span class="bandeau__sep" aria-hidden="true">·</span>
            <span class="bandeau__lieu">${icone('broche')}${esc(CONTACT.adresse)}, ${esc(CONTACT.ville)}</span>
          </p>
        </div>
      </div>

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
            <a class="nav__ico" href="catalogue.html#recherche" aria-label="Rechercher un produit">
              ${icone('recherche')}
            </a>
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
    const annee = new Date().getFullYear();

    this.innerHTML = `
      <!-- Bande « contact » reprise à la lettre de la référence (Docs/section/
           contact dili tech.jfif) : texte fantôme, pastille, titre, cartes en
           taille réelle — pas la version compacte d'une colonne de pied de
           page. Posée sur toutes les pages, au-dessus des colonnes de liens
           habituelles plutôt qu'à leur place : un footer garde sa fonction de
           plan du site, ce bandeau lui ajoute la vitrine de contact. -->
      <div class="pied-contact">
        <div class="motif circuit"></div>
        <p class="entete-page__fantome" aria-hidden="true">Contact</p>
        <div class="wrap pied-contact__in">
          <span class="contact-pill">${icone('devis')} Nous joindre</span>
          <h2 class="titre titre--petit">Une question ? <em>Écrivez-nous.</em></h2>
          <div class="contact-cartes">
            <a class="contact-carte" href="tel:${esc(telPrincipal.tel)}">
              <span class="contact-carte__ic">${icone('telephone')}</span>
              <span class="contact-carte__txt">
                <span class="contact-carte__label">Téléphone</span>
                <span class="contact-carte__valeur">${esc(telPrincipal.label)}</span>
              </span>
              <span class="contact-carte__fleche">${icone('fleche')}</span>
            </a>
            <a class="contact-carte" href="mailto:${esc(CONTACT.email)}">
              <span class="contact-carte__ic">${icone('mail')}</span>
              <span class="contact-carte__txt">
                <span class="contact-carte__label">E-mail</span>
                <span class="contact-carte__valeur">${esc(CONTACT.email)}</span>
              </span>
              <span class="contact-carte__fleche">${icone('fleche')}</span>
            </a>
            <a class="contact-carte" target="_blank" rel="noopener"
               href="https://www.google.com/maps/search/${encodeURIComponent(CONTACT.mapsQuery)}">
              <span class="contact-carte__ic">${icone('broche')}</span>
              <span class="contact-carte__txt">
                <span class="contact-carte__label">Adresse</span>
                <span class="contact-carte__valeur">${esc(CONTACT.adresse)}, ${esc(CONTACT.ville)}</span>
              </span>
              <span class="contact-carte__fleche">${icone('fleche')}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="wrap pied__haut">
        <div class="pied__marque">
          <a href="index.html" aria-label="${esc(SITE.nomComplet)} — accueil">${logo('marque--pied')}</a>
          <p class="pied__promesse">${esc(SITE.promesse)}</p>
          <ul class="pied__reseaux">
            ${RESEAUX.map(
              (r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener"
                             aria-label="${esc(r.nom)}">${icone(r.icone)}</a></li>`
            ).join('')}
          </ul>
        </div>

        <div class="pied__col">
          <p class="pied__titre">Catalogue</p>
          <ul>
            ${CATEGORIES.map(
              (c) => `<li><a href="catalogue.html?cat=${c.code}">${esc(c.nom)}</a></li>`
            ).join('')}
            <li><a href="catalogue.html?promo=1">Promotions</a></li>
          </ul>
        </div>

        <div class="pied__col">
          <p class="pied__titre">Services</p>
          <ul>
            <li><a href="services.html#vente">Vente & conseil</a></li>
            <li><a href="services.html#maintenance">Maintenance PC</a></li>
            <li><a href="services.html#sav">Service après-vente</a></li>
            <li><a href="services.html#reseau">Installation réseau</a></li>
            <li><a href="services.html#formation">Formations</a></li>
          </ul>
        </div>

        <div class="pied__col">
          <p class="pied__titre">Horaires</p>
          <ul class="pied__horaires">
            ${HORAIRES.map(
              (h) => `<li${h.ouvert ? '' : ' class="est-ferme"'}>
                        <span>${esc(h.jours)}</span><span>${esc(h.h)}</span>
                      </li>`
            ).join('')}
          </ul>
        </div>
      </div>

      <div class="wrap pied__bas">
        <p>© ${annee} ${esc(SITE.nomComplet)} — ${esc(CONTACT.ville)}, ${esc(CONTACT.pays)}. Tous droits réservés.</p>
        <p class="pied__credit">
          Site conçu et développé par <a href="#" rel="noopener">Dymo&nbsp;Labs</a>
        </p>
      </div>

      <button type="button" class="remonter" aria-label="Revenir en haut de la page">
        ${icone('flecheHaut')}
      </button>`;
  }
}

customElements.define('site-entete', SiteEntete);
customElements.define('site-pied', SitePied);
