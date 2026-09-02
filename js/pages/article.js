/* =========================================================================
   DILITECH — lecture d'un article
   -------------------------------------------------------------------------
   Le corps d'un article est un tableau de blocs typés, jamais du HTML brut
   (voir l'en-tête de js/data/articles.js) : le rendu est donc entièrement
   maîtrisé ici, et le futur back-office pourra publier sans qu'une balise
   saisie par erreur ne casse — ou n'ouvre — la page.

   Chaque article se termine par les produits qu'il recommande, résolus par
   référence dans le catalogue : le conseil mène au matériel, ce qui est tout
   le positionnement de Dilitech.
   ========================================================================= */

import './commun.js';

import { ARTICLES, parSlug, dateLisible } from '../data/articles.js';
import { illustration } from '../data/illustrations.js';
import { carteProduit } from '../components/carte-produit.js';
import { parId } from '../core/catalogue.js';
import { $, esc } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal } from '../core/ui.js';

const racine = $('[data-page-article]');
const slug = new URLSearchParams(location.search).get('a');
const article = slug ? parSlug(slug) : null;

/* --- rendu d'un bloc de corps ------------------------------------------ */

function bloc(b) {
  switch (b.t) {
    case 'h':
      return `<h2>${esc(b.v)}</h2>`;
    case 'liste':
      return `<ul>${b.v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    case 'note':
      return `<aside class="note">${icone('etincelle')}<p>${esc(b.v)}</p></aside>`;
    case 'p':
    default:
      return `<p>${esc(b.v)}</p>`;
  }
}

/* --- introuvable -------------------------------------------------------- */

function introuvable() {
  document.title = 'Article introuvable — Dilitech';
  racine.innerHTML = `
    <section class="entete-page nuit coupe-bas sur-nuit">
      <div class="motif circuit"></div>
      <div class="wrap">
        <p class="surtitre">Article introuvable</p>
        <h1 class="titre titre--geant">Cette page <em>n'existe pas.</em></h1>
        <p class="chapeau">Le lien est peut-être ancien. Voici tous nos conseils.</p>
        <div class="heros__actions">
          <a class="btn btn--cyan" href="conseils.html">Voir tous les conseils</a>
        </div>
      </div>
    </section>`;
}

/* --- montage ------------------------------------------------------------ */

function monter(a) {
  document.title = `${a.titre} — Dilitech`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = a.chapo;

  /* Les produits cités ; une référence retirée du catalogue est simplement
     ignorée plutôt que d'afficher une carte vide. */
  const cites = (a.produits ?? []).map(parId).filter(Boolean);

  /* L'article suivant, pour ne pas laisser le lecteur au bout d'un couloir. */
  const i = ARTICLES.indexOf(a);
  const suivant = ARTICLES[(i + 1) % ARTICLES.length];

  racine.innerHTML = `
  <section class="entete-page nuit coupe-bas sur-nuit">
    <div class="motif circuit"></div>
    <div class="wrap art-tete">
      <nav class="fil fil--sombre" aria-label="Fil d'Ariane">
        <a href="index.html">Accueil</a> ${icone('chevronDroite')}
        <a href="conseils.html">Conseils</a> ${icone('chevronDroite')}
        <a href="conseils.html?theme=${encodeURIComponent(a.categorie)}">${esc(a.categorie)}</a>
      </nav>
      <h1 class="titre titre--geant">${esc(a.titre)}</h1>
      <p class="chapeau">${esc(a.chapo)}</p>
      <p class="art-tete__meta">
        ${icone('horloge')} ${a.lecture} min de lecture
        <span aria-hidden="true">·</span>
        ${esc(dateLisible(a.date))}
      </p>
    </div>
  </section>

  <section class="sec--serre">
    <div class="wrap">
      <div class="papier">
        <div class="papier__visuel" aria-hidden="true">${illustration(a.illus)}</div>
        ${a.corps.map(bloc).join('')}
      </div>
    </div>
  </section>

  ${
    cites.length
      ? `<section class="sec--brume">
           <div class="wrap">
             <header class="tete-sec">
               <p class="surtitre">Ce que nous recommandons</p>
               <h2 class="titre titre--petit">Le matériel <em>dont il est question.</em></h2>
               <p class="chapeau">
                 Les références citées dans cet article, telles qu'elles sont
                 aujourd'hui au catalogue.
               </p>
             </header>
             <div class="grille-produits">
               ${cites.map((p) => carteProduit(p)).join('')}
             </div>
           </div>
         </section>`
      : ''
  }

  <section class="sec--serre">
    <div class="wrap">
      <a class="suite" href="article.html?a=${encodeURIComponent(suivant.slug)}">
        <span class="suite__sur">Article suivant</span>
        <span class="suite__titre">${esc(suivant.titre)}</span>
        <span class="suite__fl">${icone('fleche')}</span>
      </a>
    </div>
  </section>

  <section class="nuit coupe-haut sur-nuit cta sec--serre">
    <div class="motif circuit"></div>
    <div class="wrap cta__in">
      <h2 class="titre titre--petit">Un doute sur <em>votre cas précis&nbsp;?</em></h2>
      <p class="chapeau">
        Aucun article ne remplace une réponse sur votre situation. Décrivez-nous
        votre besoin, nous vous répondons.
      </p>
      <div class="cta__actions">
        <a class="btn btn--cyan" href="contact.html">Nous écrire</a>
        <a class="btn btn--ligne" href="conseils.html">Tous les conseils</a>
      </div>
    </div>
  </section>`;

  activerReveal(racine);
}

if (!article) introuvable();
else monter(article);
