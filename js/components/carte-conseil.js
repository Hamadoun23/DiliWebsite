/* =========================================================================
   DILITECH — la carte « conseil », façon publication de réseau social
   -------------------------------------------------------------------------
   Une seule carte pour l'aperçu de l'accueil (3 conseils) et pour la page
   conseils.html. Elle met en avant la phrase-choc (`citation`) quand
   l'article en a une — c'est le ton des publications Facebook/TikTok du
   patron —, sinon le titre.

   `lien` :
     — 'panneau' (conseils.html) : le clic ouvre la lecture en panneau sur
       place (`.js-lire-article`, délégation de commun.js) ;
     — 'page' (accueil) : le clic mène à conseils.html, lecture ouverte.
   ========================================================================= */

import { dateLisible } from '../data/articles.js';
import { illustration } from '../data/illustrations.js';
import { marque } from './chrome.js';
import { esc } from '../core/dom.js';
import { icone } from '../core/icones.js';

export function carteConseil(a, { lien = 'panneau', une = false } = {}) {
  const href = lien === 'page'
    ? `conseils.html?article=${encodeURIComponent(a.slug)}`
    : `?article=${encodeURIComponent(a.slug)}`;
  const attrs = lien === 'page' ? '' : ` class="js-lire-article" data-slug="${esc(a.slug)}"`;
  const cls = (base) => (lien === 'page' ? base : `${base} js-lire-article`);
  const data = lien === 'page' ? '' : ` data-slug="${esc(a.slug)}"`;

  /* Publication sans image (format « texte ») : la phrase en grand sur fond
     sombre, comme la publication Facebook d'origine. */
  const texte = a.format === 'texte' && !a.img;
  const visuel = a.img
    ? `<img src="${esc(a.img)}" alt="" loading="lazy" decoding="async"${a.cadrage ? ` style="object-position:${esc(a.cadrage)}"` : ''}>`
    : texte
      ? `<span class="post__texte">${esc(a.citation ?? a.titre)}</span>`
      : illustration(a.illus);

  return `
  <article class="post reveal${une ? ' post--une' : ''}${a.citation ? ' post--citation' : ''}${texte ? ' post--texte' : ''}">
    <a class="${cls('post__visuel')}${a.img ? ' post__visuel--photo' : ''}${texte ? ' post__visuel--texte' : ''}" href="${href}"${data}
       aria-hidden="true" tabindex="-1">
      ${visuel}
      <span class="post__rubrique">${esc(a.categorie)}</span>
    </a>
    <div class="post__corps">
      <p class="post__auteur">
        <span class="post__avatar" aria-hidden="true">${marque()}</span>
        <span><b>Dilitech</b> <span class="post__date">· ${esc(dateLisible(a.date))}</span></span>
        ${a.source ? `<span class="post__source">${icone(a.source.reseau.toLowerCase())} ${esc(a.source.reseau)}</span>` : ''}
      </p>
      ${
        a.citation && texte
          ? `<h3 class="post__titre"><a href="${href}"${attrs}>${esc(a.titre)}</a></h3>`
          : a.citation
          ? `<p class="post__citation"><a href="${href}"${attrs}>${esc(a.citation)}</a></p>
             ${a.source ? '' : `<h3 class="post__titre-petit">${esc(a.titre)}</h3>`}`
          : `<h3 class="post__titre"><a href="${href}"${attrs}>${esc(a.titre)}</a></h3>`
      }
      <p class="post__chapo">${esc(a.chapo)}</p>
      <a class="${cls('lien-fleche post__lire')}" href="${href}"${data}>
        Lire la suite — ${a.lecture} min ${icone('fleche')}
      </a>
    </div>
  </article>`;
}
