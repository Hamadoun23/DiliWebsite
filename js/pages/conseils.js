/* =========================================================================
   DILITECH — liste des conseils
   -------------------------------------------------------------------------
   Les thèmes de filtrage sont déduits des articles eux-mêmes : publier un
   article dans une nouvelle catégorie fait apparaître son onglet, sans rien
   déclarer ailleurs.
   ========================================================================= */

import './commun.js';

import { ARTICLES, dateLisible } from '../data/articles.js';
import { illustration } from '../data/illustrations.js';
import { $, $$, esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal } from '../core/ui.js';

const THEMES = ['Tous', ...new Set(ARTICLES.map((a) => a.categorie))];
let themeActif = new URLSearchParams(location.search).get('theme') ?? 'Tous';
if (!THEMES.includes(themeActif)) themeActif = 'Tous';

function onglets() {
  rendre(
    '[data-categories]',
    THEMES.map(
      (t) => `<button type="button" role="tab" class="onglet${t === themeActif ? ' est-actif' : ''}"
                      data-theme="${esc(t)}" aria-selected="${t === themeActif}">
                ${esc(t)}
                <span class="onglet__nb">${
                  t === 'Tous' ? ARTICLES.length : ARTICLES.filter((a) => a.categorie === t).length
                }</span>
              </button>`
    ).join('')
  );
}

function liste() {
  const visibles =
    themeActif === 'Tous' ? ARTICLES : ARTICLES.filter((a) => a.categorie === themeActif);

  rendre(
    '[data-articles]',
    visibles
      .map(
        (a) => `
      <article class="art reveal">
        <a class="art__visuel" href="article.html?a=${encodeURIComponent(a.slug)}"
           aria-hidden="true" tabindex="-1">${illustration(a.illus)}</a>
        <div class="art__corps">
          <p class="art__meta">${esc(a.categorie)} <span>· ${esc(dateLisible(a.date))}</span></p>
          <h3><a href="article.html?a=${encodeURIComponent(a.slug)}">${esc(a.titre)}</a></h3>
          <p class="art__chapo">${esc(a.chapo)}</p>
          <a class="lien-fleche" href="article.html?a=${encodeURIComponent(a.slug)}">
            Lire — ${a.lecture} min ${icone('fleche')}
          </a>
        </div>
      </article>`
      )
      .join('')
  );

  activerReveal($('[data-articles]'));
}

$('[data-categories]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-theme]');
  if (!b) return;
  themeActif = b.dataset.theme;

  for (const autre of $$('.onglet')) {
    const actif = autre === b;
    autre.classList.toggle('est-actif', actif);
    autre.setAttribute('aria-selected', String(actif));
  }

  /* Le thème choisi passe dans l'URL : le lien reste partageable et le
     bouton « précédent » du navigateur revient au thème précédent. */
  const p = new URLSearchParams(location.search);
  if (themeActif === 'Tous') p.delete('theme');
  else p.set('theme', themeActif);
  history.pushState(null, '', `${location.pathname}${p.toString() ? `?${p}` : ''}`);

  liste();
});

addEventListener('popstate', () => {
  themeActif = new URLSearchParams(location.search).get('theme') ?? 'Tous';
  if (!THEMES.includes(themeActif)) themeActif = 'Tous';
  onglets();
  liste();
});

onglets();
liste();
