/* =========================================================================
   DILITECH — la carte produit
   -------------------------------------------------------------------------
   Un seul dessin de carte pour tout le site : grille du catalogue, blocs de
   la page d'accueil, produits conseillés en fin d'article, suggestions de la
   fiche. Ce qu'elle montre, dans cet ordre :

     l'illustration, le repère commercial (promo / nouveauté / notre choix),
     la marque, le nom, la promesse en une phrase, le prix, l'état du stock,
     puis UN bouton — « Ajouter à ma sélection ».

   Pas de bouton WhatsApp par produit : le parcours passe entièrement par la
   sélection, qui produit un récapitulatif unique. Un client qui écrit une
   fois avec sa liste complète est mieux servi que dix messages séparés.
   ========================================================================= */

import { prix as fmtPrix } from '../config.js';
import { illustration } from '../data/illustrations.js';
import { niveauStock, ETATS, TAGS } from '../core/catalogue.js';
import { esc } from '../core/dom.js';
import { icone } from '../core/icones.js';

/**
 * Balisage d'une carte produit.
 * @param {object} p produit
 * @param {object} [opts]
 * @param {boolean} [opts.compact] version resserrée (bandeaux, suggestions)
 */
export function carteProduit(p, { compact = false } = {}) {
  const stock = niveauStock(p);
  const tag = p.tag ? TAGS[p.tag] : null;
  const remise = p.prixBarre ? Math.round((1 - p.prix / p.prixBarre) * 100) : 0;
  const lien = `produit.html?id=${encodeURIComponent(p.id)}`;

  return `
  <article class="carte reveal${compact ? ' carte--compact' : ''}" data-produit="${esc(p.id)}">
    <a class="carte__visuel" href="${lien}"
       aria-label="Voir la fiche de ${esc(p.nom)}">
      <span class="carte__illus">${illustration(p.illus)}</span>
      ${
        p.img
          ? `<img src="${esc(p.img)}" alt="" loading="lazy" decoding="async" data-repli>`
          : ''
      }
      ${tag ? `<span class="etiq etiq--${tag.ton}">${esc(tag.nom)}</span>` : ''}
      ${remise > 0 ? `<span class="etiq etiq--remise">−${remise}&nbsp;%</span>` : ''}
    </a>

    <div class="carte__corps">
      <p class="carte__marque">
        ${esc(p.marque)}
        ${p.etat === 'reconditionne' ? `<span class="jeton jeton--recond">${esc(ETATS.reconditionne.nom)}</span>` : ''}
      </p>

      <h3 class="carte__nom"><a href="${lien}">${esc(p.nom)}</a></h3>

      ${compact ? '' : `<p class="carte__resume">${esc(p.resume)}</p>`}

      <div class="carte__pied">
        <p class="carte__prix">
          ${p.prixBarre ? `<span class="carte__barre">${esc(fmtPrix(p.prixBarre))}</span>` : ''}
          <span class="carte__actuel">${esc(fmtPrix(p.prix))}</span>
          ${p.unite ? `<span class="carte__unite">${esc(p.unite)}</span>` : ''}
        </p>
        <p class="stock stock--${stock.ton}">
          <span class="stock__point" aria-hidden="true"></span>${esc(stock.libelle)}
        </p>
      </div>

      <button type="button" class="btn btn--carte js-ajouter" data-id="${esc(p.id)}">
        ${icone('plus')}<span>Ajouter à ma sélection</span>
      </button>
    </div>
  </article>`;
}

/** Grille complète, ou message d'absence de résultat. */
export function grilleProduits(liste, opts = {}) {
  if (!liste.length) {
    return `
      <div class="vide">
        ${icone('recherche')}
        <p class="vide__titre">Aucun produit ne correspond</p>
        <p class="vide__txt">
          Élargissez les filtres, ou dites-nous ce que vous cherchez :
          nous commandons aussi sur demande.
        </p>
        <button type="button" class="btn btn--ligne js-reinit-filtres">Réinitialiser les filtres</button>
      </div>`;
  }
  return `<div class="grille-produits">${liste.map((p) => carteProduit(p, opts)).join('')}</div>`;
}
