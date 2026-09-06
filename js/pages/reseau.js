/* =========================================================================
   DILITECH — page Réseau
   -------------------------------------------------------------------------
   Les chiffres affichés par point de vente sont CALCULÉS depuis le catalogue
   (`dispo` de chaque produit) : nombre de références tenues et poids relatif
   dans le réseau. Rien n'est saisi à la main, donc rien ne peut se
   désynchroniser du catalogue.

   Aucun chiffre de stock brut n'est montré au visiteur — c'est une donnée
   commerciale. On publie le nombre de RÉFÉRENCES disponibles, qui dit
   l'essentiel sans exposer les quantités.
   ========================================================================= */

import './commun.js';

import { PARTENAIRES, SIEGE } from '../data/partenaires.js';
import { CONTACT, HORAIRES } from '../config.js';
import * as cat from '../core/catalogue.js';
import { esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal, activerCompteurs } from '../core/ui.js';

/* --- mesures tirées du catalogue --------------------------------------- */

/** Nombre de références que ce point de vente tient en stock. */
const referencesDe = (code) => cat.tous().filter((p) => (p.dispo[code] ?? 0) > 0).length;

/** Répartition par univers, pour dire ce que chaque partenaire tient vraiment. */
function universDe(code) {
  return cat.CATEGORIES.map((c) => ({
    nom: c.nom,
    n: cat.tous().filter((p) => p.cat === c.code && (p.dispo[code] ?? 0) > 0).length,
  })).filter((x) => x.n > 0);
}

/* --- bandeau de chiffres ------------------------------------------------ */

rendre(
  '[data-preuves]',
  [
    { n: PARTENAIRES.length, mot: 'points de vente' },
    { n: new Set(PARTENAIRES.map((p) => p.pays)).size, mot: 'pays' },
    { n: cat.statistiques().references, mot: 'références' },
  ]
    .map(
      (p) => `<li class="heros__preuve">
                <b data-compteur="${p.n}">0</b><span>${esc(p.mot)}</span>
              </li>`
    )
    .join('')
);

/* --- le siège ----------------------------------------------------------- */

rendre(
  '[data-siege]',
  `<div class="siege reveal">
     <div class="siege__txt">
       <p class="surtitre">Siège & showroom</p>
       <h2 class="titre">${esc(SIEGE.ville)}, <em>${esc(SIEGE.quartier)}.</em></h2>
       <p class="chapeau">${esc(SIEGE.note)}</p>

       <ul class="siege__infos">
         <li>${icone('broche')}<span>${esc(SIEGE.quartier)} — ${esc(CONTACT.ville)}, ${esc(CONTACT.pays)}</span></li>
         ${CONTACT.telephones
           .map((t) => `<li>${icone('telephone')}<a href="tel:${esc(t.tel)}">${esc(t.label)}</a></li>`)
           .join('')}
         <li>${icone('mail')}<a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></li>
       </ul>

       <ul class="siege__horaires">
         ${HORAIRES.map(
           (h) => `<li${h.ouvert ? '' : ' class="est-ferme"'}>
                     ${icone('horloge')}<span>${esc(h.jours)}</span><b>${esc(h.h)}</b>
                   </li>`
         ).join('')}
       </ul>

       <div class="cta__actions" style="justify-content:flex-start">
         <a class="btn btn--plein"
            href="https://www.google.com/maps/search/${encodeURIComponent(CONTACT.mapsQuery)}"
            target="_blank" rel="noopener">Ouvrir dans Maps</a>
         <a class="btn btn--ligne" href="contact.html">Nous écrire</a>
       </div>
     </div>

     <div class="siege__stats">
       ${universDe(SIEGE.code)
         .map(
           (u) => `<div class="siege__stat">
                     <b>${u.n}</b><span>${esc(u.nom)}</span>
                   </div>`
         )
         .join('')}
       <div class="siege__stat siege__stat--large">
         <b>${referencesDe(SIEGE.code)}</b><span>références tenues au siège</span>
       </div>
     </div>
   </div>

   <!-- Le stock, en photo : pas des visuels d'agence, l'entrepôt et la
        vitrine réels de Torokorobougou. -->
   <div class="siege-photos reveal">
     <p class="siege-photos__legende">Le stock, en vrai — Torokorobougou</p>
     <div class="siege-photos__grille">
       <img src="assets/img/atelier/atelier-1.jpg" alt="Étagères de portables en stock à l'entrepôt Dilitech" loading="lazy">
       <img src="assets/img/atelier/atelier-2.jpg" alt="Vitrine de la boutique Dilitech avec plusieurs modèles exposés" loading="lazy">
       <img src="assets/img/atelier/atelier-3.jpg" alt="Cartons de portables neufs réceptionnés à l'entrepôt Dilitech" loading="lazy">
     </div>
   </div>`
);

/* --- les partenaires ----------------------------------------------------- */

rendre(
  '[data-partenaires]',
  PARTENAIRES.filter((p) => p.role !== 'siege')
    .map((p) => {
      const refs = referencesDe(p.code);
      const univers = universDe(p.code);
      return `
      <article class="pdv reveal">
        <div class="pdv__tete">
          <span class="pdv__dr" aria-hidden="true">${esc(p.iso)}</span>
          <div>
            <p class="pdv__ville">${esc(p.ville)}</p>
            <p class="pdv__pays">${esc(p.pays)}${p.quartier ? ` · ${esc(p.quartier)}` : ''}</p>
          </div>
        </div>
        <p class="pdv__role">${esc(p.libelleRole)}</p>
        <p class="pdv__note">${esc(p.note)}</p>

        <p class="pdv__refs">
          <b>${refs}</b> référence${refs > 1 ? 's' : ''} disponible${refs > 1 ? 's' : ''}
        </p>
        <div class="pdv__univers">
          ${univers.map((u) => `<span>${esc(u.nom)} · ${u.n}</span>`).join('')}
        </div>

        <a class="lien-fleche pdv__lien" href="catalogue.html?partenaire=${p.code}">
          Filtrer le catalogue sur ${esc(p.ville)} ${icone('fleche')}
        </a>
      </article>`;
    })
    .join('')
);

activerReveal();
activerCompteurs();
