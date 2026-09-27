/* =========================================================================
   DILITECH — panneau « lecture d'un article »
   -------------------------------------------------------------------------
   Reprend le contenu qui vivait sur article.html (corps typé, produits
   cités, article suivant), en panneau superposé — même mécanique que
   <panneau-produit>, voir ce fichier pour le détail des choix.
   ========================================================================= */

import { ARTICLES, parSlug, dateLisible } from '../data/articles.js';
import { illustration } from '../data/illustrations.js';
import { carteProduit } from './carte-produit.js';
import { marque } from './chrome.js';
import { parId } from '../core/catalogue.js';
import { $, esc, definirParametre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { verrouillerDefilement, deverrouillerDefilement, piegerFocus } from '../core/ui.js';

function bloc(b) {
  switch (b.t) {
    case 'h':
      return `<h2>${esc(b.v)}</h2>`;
    case 'liste':
      return `<ul>${b.v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    case 'dialogue':
      return `<div class="dialogue">${b.v
        .map((r) => `<p class="dialogue__r dialogue__r--${r.qui === 'Dilitech' ? 'nous' : 'client'}">
                       <span class="dialogue__qui">${esc(r.qui)}</span>${esc(r.dit)}</p>`)
        .join('')}</div>`;
    case 'publication':
      /* Le texte exact de la publication, retours à la ligne compris. */
      return `<figure class="publication">
                <figcaption class="publication__tete">
                  <span class="publication__avatar" aria-hidden="true">${marque()}</span>
                  <span><b>Dilitech</b><small>Publié sur nos réseaux</small></span>
                </figcaption>
                <blockquote>${b.v.split('\n').map((l) => `<p>${esc(l)}</p>`).join('')}</blockquote>
              </figure>`;
    case 'note':
      return `<aside class="note">${icone('etincelle')}<p>${esc(b.v)}</p></aside>`;
    case 'p':
    default:
      return `<p>${esc(b.v)}</p>`;
  }
}

class PanneauArticle extends HTMLElement {
  #libererFocus = null;

  connectedCallback() {
    this.className = 'panneau panneau--large';
    this.hidden = true;
    this.innerHTML = `
      <div class="panneau__voile" data-fermer></div>
      <aside class="panneau__boite" role="dialog" aria-modal="true" aria-label="Article">
        <header class="panneau__tete">
          <div>
            <p class="panneau__sur" data-meta>&nbsp;</p>
            <h2 class="panneau__titre" data-titre>&nbsp;</h2>
          </div>
          <button type="button" class="panneau__x" data-fermer aria-label="Fermer">
            ${icone('fermer')}
          </button>
        </header>
        <div class="panneau__corps" data-corps></div>
      </aside>`;

    this.querySelectorAll('[data-fermer]').forEach((n) => n.addEventListener('click', () => this.fermer()));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.hidden) this.fermer();
    });

    /* « Article suivant » à l'intérieur du panneau : on remplace en place. */
    $('[data-corps]', this).addEventListener('click', (e) => {
      const declencheur = e.target.closest('.js-lire-article');
      if (!declencheur) return;
      e.preventDefault();
      this.ouvrir(declencheur.dataset.slug);
    });

    addEventListener('popstate', () => {
      const slug = new URLSearchParams(location.search).get('article');
      if (slug) this.ouvrir(slug, { pousser: false });
      else this.fermer({ pousser: false });
    });

    const initial = new URLSearchParams(location.search).get('article');
    if (initial) this.ouvrir(initial, { pousser: false });
  }

  ouvrir(slug, { pousser = true } = {}) {
    const a = parSlug(slug);
    if (!a) return;
    this.#rendre(a);
    if (pousser) definirParametre('article', slug);

    if (this.hidden) {
      this.hidden = false;
      requestAnimationFrame(() => this.classList.add('est-ouvert'));
      verrouillerDefilement();
      this.#libererFocus = piegerFocus(this);
    } else {
      $('[data-corps]', this).scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  fermer({ pousser = true } = {}) {
    if (this.hidden) return;
    if (pousser) definirParametre('article', null);
    this.classList.remove('est-ouvert');
    deverrouillerDefilement();
    this.#libererFocus?.();
    this.#libererFocus = null;
    const cacher = () => { this.hidden = true; };
    this.addEventListener('transitionend', cacher, { once: true });
    setTimeout(cacher, 400);
  }

  #rendre(a) {
    const cites = (a.produits ?? []).map(parId).filter(Boolean);
    const i = ARTICLES.indexOf(a);
    const suivant = ARTICLES[(i + 1) % ARTICLES.length];

    $('[data-meta]', this).textContent = `${a.categorie} · ${a.lecture} min de lecture`;
    $('[data-titre]', this).textContent = a.titre;

    /* La publication d'origine porte déjà la phrase : pas de doublon. */
    const aPublication = a.corps.some((b) => b.t === 'publication');

    $('[data-corps]', this).innerHTML = `
      <div class="sec--serre">
        <p class="art-tete__meta" style="margin-bottom:22px">
          ${icone('horloge')} ${a.lecture} min de lecture
          <span aria-hidden="true">·</span>
          ${esc(dateLisible(a.date))}
        </p>
        <div class="papier">
          ${a.citation && !aPublication ? `<p class="papier__citation">${esc(a.citation)}</p>` : ''}
          ${
            a.format === 'texte' && !a.img
              ? ''
              : `<div class="papier__visuel${a.img ? ' papier__visuel--photo' : ''}" aria-hidden="true">${
                  a.img
                    ? `<img src="${esc(a.img)}" alt=""${a.cadrage ? ` style="object-position:${esc(a.cadrage)}"` : ''}>`
                    : illustration(a.illus)
                }</div>`
          }
          ${a.corps.map(bloc).join('')}
          ${
            a.source
              ? `<a class="papier__source" href="${esc(a.source.url)}" target="_blank" rel="noopener">
                   ${icone(a.source.reseau.toLowerCase())} Voir la publication sur ${esc(a.source.reseau)} ${icone('fleche')}
                 </a>`
              : ''
          }
        </div>
      </div>

      ${
        cites.length
          ? `<div class="sec--brume">
               <p class="surtitre">Ce que nous recommandons</p>
               <h2 class="titre titre--petit" style="margin-bottom:18px">Le matériel <em>dont il est question.</em></h2>
               <div class="grille-produits">${cites.map((p) => carteProduit(p, { compact: true })).join('')}</div>
             </div>`
          : ''
      }

      <div class="sec--serre">
        <a class="suite js-lire-article" href="?article=${encodeURIComponent(suivant.slug)}" data-slug="${esc(suivant.slug)}">
          <span class="suite__sur">Article suivant</span>
          <span class="suite__titre">${esc(suivant.titre)}</span>
          <span class="suite__fl">${icone('fleche')}</span>
        </a>
      </div>`;
  }
}

customElements.define('panneau-article', PanneauArticle);

/** Ouvre un article depuis n'importe où. */
export function lireArticle(slug) {
  document.querySelector('panneau-article')?.ouvrir(slug);
}
