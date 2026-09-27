/* =========================================================================
   DILITECH — page Conseils
   -------------------------------------------------------------------------
   Filtre par rubrique (état dans l'URL : ?rubrique=idees-recues, partageable
   et défait par « précédent »), le conseil le plus récent mis « à la une »
   quand on affiche tout. La lecture s'ouvre en panneau (?article=slug),
   géré par <panneau-article> — rien à faire ici.
   ========================================================================= */

import './commun.js';

import { ARTICLES, RUBRIQUES } from '../data/articles.js';
import { RESEAUX } from '../config.js';
import { carteConseil } from '../components/carte-conseil.js';
import { $, $$, esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal } from '../core/ui.js';

const lireRubrique = () => {
  const r = new URLSearchParams(location.search).get('rubrique');
  return RUBRIQUES.some((x) => x.code === r) ? r : '';
};
let active = lireRubrique();

function reseaux() {
  const utiles = RESEAUX.filter((r) => r.nom === 'Facebook' || r.nom === 'TikTok');
  rendre(
    '[data-reseaux]',
    `<span class="conseils-reseaux__mot">Ces conseils, nous les publions d’abord ici :</span>
     ${utiles
       .map(
         (r) => `<a class="conseils-reseaux__lien" href="${esc(r.url)}" target="_blank" rel="noopener">
                   ${icone(r.icone)} ${esc(r.nom)}
                 </a>`
       )
       .join('')}`
  );
}

function filtres() {
  const nb = (code) => ARTICLES.filter((a) => a.rubrique === code).length;
  rendre(
    '[data-rubriques]',
    [{ code: '', nom: 'Tout' }, ...RUBRIQUES]
      .filter((r) => !r.code || nb(r.code))
      .map(
        (r) => `<button type="button" role="tab" class="onglet${r.code === active ? ' est-actif' : ''}"
                        data-rubrique="${esc(r.code)}" aria-selected="${r.code === active}">
                  ${esc(r.nom)} <span class="onglet__nb">${r.code ? nb(r.code) : ARTICLES.length}</span>
                </button>`
      )
      .join('')
  );
}

function liste() {
  const visibles = active ? ARTICLES.filter((a) => a.rubrique === active) : ARTICLES;
  const desc = RUBRIQUES.find((r) => r.code === active)?.desc ?? '';
  const zone = $('[data-rubrique-desc]');
  zone.textContent = desc;
  zone.hidden = !desc;
  rendre(
    '[data-posts]',
    visibles.map((a, i) => carteConseil(a, { une: !active && i === 0 })).join('')
  );
  activerReveal($('[data-posts]'));
}

$('[data-rubriques]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-rubrique]');
  if (!b) return;
  active = b.dataset.rubrique;
  const p = new URLSearchParams(location.search);
  if (active) p.set('rubrique', active);
  else p.delete('rubrique');
  history.pushState(null, '', `${location.pathname}${p.toString() ? `?${p}` : ''}`);
  for (const o of $$('.onglet', $('[data-rubriques]'))) {
    const on = o.dataset.rubrique === active;
    o.classList.toggle('est-actif', on);
    o.setAttribute('aria-selected', String(on));
  }
  liste();
});

addEventListener('popstate', () => {
  const r = lireRubrique();
  if (r === active) return;   // simple ouverture/fermeture d'un article
  active = r;
  filtres();
  liste();
});

reseaux();
filtres();
liste();
