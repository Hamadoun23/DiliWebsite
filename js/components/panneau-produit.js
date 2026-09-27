/* =========================================================================
   DILITECH — panneau « fiche produit »
   -------------------------------------------------------------------------
   Reprend le contenu qui vivait sur produit.html (specs, prix, disponibilité
   PAR PARTENAIRE, similaires), mais en panneau superposé plutôt qu'en page à
   part — le site n'a plus que deux pages (index.html, catalogue.html), la
   fiche s'ouvre par-dessus celle où l'on se trouve déjà.

   Mécanique identique à <panneau-devis> (voile, piège à focus, verrouillage
   du défilement) ; seule la largeur change (`.panneau--large`, voir
   style.css). L'état vit dans l'URL (`?produit=DT-…`, ajouté/retiré par
   `definirParametre`) : un lien vers une fiche reste donc partageable, et le
   bouton « précédent » du navigateur referme le panneau plutôt que de sortir
   du site.
   ========================================================================= */

import * as cat from '../core/catalogue.js';
import { illustration } from '../data/illustrations.js';
import { carteProduit } from './carte-produit.js';
import { SIEGE } from '../data/partenaires.js';
import { prix as fmtPrix, CONTACT, WHATSAPP } from '../config.js';
import { galerieDe } from '../data/galeries.js';
import * as profil from '../core/profil.js';
import { $, esc, definirParametre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { verrouillerDefilement, deverrouillerDefilement, piegerFocus } from '../core/ui.js';

const etatDe = (n) => (n <= 0 ? 'rupture' : n <= 3 ? 'faible' : 'moyen');
const libelleDe = (n) => (n <= 0 ? 'Sur commande' : n <= 3 ? 'Dernières pièces' : 'En stock');

class PanneauProduit extends HTMLElement {
  #libererFocus = null;
  #id = null;

  connectedCallback() {
    this.className = 'panneau panneau--large';
    this.hidden = true;
    this.innerHTML = `
      <div class="panneau__voile" data-fermer></div>
      <aside class="panneau__boite" role="dialog" aria-modal="true" aria-label="Fiche produit">
        <header class="panneau__tete">
          <div>
            <p class="panneau__sur">Fiche produit</p>
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

    /* Clic sur un produit similaire À L'INTÉRIEUR du panneau : on ne
       l'empile pas, on remplace le contenu en place. */
    $('[data-corps]', this).addEventListener('click', (e) => {
      const declencheur = e.target.closest('.js-voir-produit');
      if (!declencheur) return;
      e.preventDefault();
      this.ouvrir(declencheur.dataset.id);
    });

    addEventListener('popstate', () => {
      const id = new URLSearchParams(location.search).get('produit');
      if (id) this.ouvrir(id, { pousser: false });
      else this.fermer({ pousser: false });
    });

    /* Lien direct : `catalogue.html?produit=DT-…` ouvre la fiche au chargement. */
    const initial = new URLSearchParams(location.search).get('produit');
    if (initial) this.ouvrir(initial, { pousser: false });
  }

  ouvrir(id, { pousser = true } = {}) {
    const p = cat.parId(id);
    if (!p) return;
    this.#id = id;
    this.#rendre(p);
    if (pousser) definirParametre('produit', id);

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
    this.#id = null;
    if (pousser) definirParametre('produit', null);
    this.classList.remove('est-ouvert');
    deverrouillerDefilement();
    this.#libererFocus?.();
    this.#libererFocus = null;
    const cacher = () => { this.hidden = true; };
    this.addEventListener('transitionend', cacher, { once: true });
    setTimeout(cacher, 400);
  }

  #rendre(p) {
    const stock = cat.niveauStock(p);
    const dispo = cat.disponibilite(p);
    const remise = p.prixBarre ? Math.round((1 - p.prix / p.prixBarre) * 100) : 0;
    const similaires = cat.similaires(p, 3);
    const photos = galerieDe(p);
    const tag = p.tag && cat.TAGS[p.tag];
    const s = p.specs ?? {};

    /* Les quatre caractéristiques qui décident d'un achat, en tête de fiche ;
       le tableau complet reste plus bas. */
    const CLES = [
      ['Processeur', 'etoile'], ['Mémoire', 'batterie'], ['Stockage', 'boite'], ['Écran', 'portable'],
    ].filter(([k]) => s[k]);

    /* Écoute client : si le visiteur nous a dit son usage (concierge), on
       lui dit si cette machine y correspond. */
    const monUsage = profil.estVide() ? null : profil.scoreProduit(p) > 3;

    const message = encodeURIComponent(
      `Bonjour Dilitech, je suis intéressé(e) par : ${p.nom} (${p.id}) à ${fmtPrix(p.prix)}. Est-il disponible ?`
    );

    $('[data-titre]', this).textContent = p.nom;

    $('[data-corps]', this).innerHTML = `
      <div class="pf">
        <!-- ============ GALERIE ============ -->
        <div class="pf__galerie" data-galerie>
          <div class="pf__scene">
            ${
              photos.length
                ? photos.map((src, i) => `<img class="pf__photo${i === 0 ? ' est-active' : ''}" src="${esc(src)}"
                                              alt="${esc(p.nom)} — photo ${i + 1} sur ${photos.length}"
                                              ${i ? 'loading="lazy"' : ''} data-repli>`).join('')
                : `<span class="pf__illus">${illustration(p.illus)}</span>`
            }
            <div class="pf__etiquettes">
              ${tag ? `<span class="etiq etiq--${tag.ton}">${esc(tag.nom)}</span>` : ''}
              ${remise ? `<span class="etiq etiq--remise">−${remise}&nbsp;%</span>` : ''}
            </div>
            ${
              photos.length > 1
                ? `<button type="button" class="pf__fleche pf__fleche--g" data-g="-1" aria-label="Photo précédente">${icone('chevronGauche')}</button>
                   <button type="button" class="pf__fleche pf__fleche--d" data-g="1" aria-label="Photo suivante">${icone('chevronDroite')}</button>
                   <span class="pf__compteur" data-compteur-photo>1 / ${photos.length}</span>`
                : ''
            }
          </div>
          ${
            photos.length > 1
              ? `<div class="pf__vignettes" role="tablist" aria-label="Photos du produit">
                   ${photos.map((src, i) => `<button type="button" class="pf__vignette${i === 0 ? ' est-active' : ''}"
                                                      data-i="${i}" role="tab" aria-selected="${i === 0}"
                                                      aria-label="Photo ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}
                 </div>`
              : ''
          }
          <p class="pf__note">
            ${icone('etincelle')}
            <span>${
              !p.img
                ? 'Illustration de la famille de produit. La photo de l’article exact vous est envoyée sur demande.'
                : photos.length > 1
                  ? 'Photos prises dans notre boutique de Torokorobougou, sur la gamme de ce modèle. Demandez-nous la photo de votre machine exacte.'
                  : 'Photo prise dans notre boutique de Torokorobougou.'
            }</span>
          </p>
        </div>

        <!-- ============ ACHAT ============ -->
        <div class="pf__infos">
          <p class="pf__marque">
            <span>${esc(p.marque)}</span>
            <span class="pf__ref">${esc(p.id)}</span>
            <span class="jeton ${p.etat === 'reconditionne' ? 'jeton--recond' : 'pf__neuf'}">${esc(cat.ETATS[p.etat].nom)}</span>
          </p>
          <h1 class="pf__nom">${esc(p.nom)}</h1>
          <p class="pf__resume">${esc(p.resume)}</p>

          ${
            monUsage === null
              ? ''
              : monUsage
                ? `<p class="pf__usage pf__usage--oui">${icone('check')}<span>Correspond à ce que vous nous avez dit : <b>${esc(profil.resume())}</b></span></p>`
                : `<p class="pf__usage">${icone('etincelle')}<span>Pas notre premier choix pour <b>${esc(profil.resume())}</b> — <a href="index.html#selection">voir ce qui vous correspond</a></span></p>`
          }

          ${
            CLES.length
              ? `<ul class="pf__cles">
                   ${CLES.map(([k, ic]) => `<li>${icone(ic)}<span><small>${esc(k)}</small>${esc(s[k])}</span></li>`).join('')}
                 </ul>`
              : ''
          }

          <div class="pf__achat">
            <div class="pf__prix">
              ${p.prixBarre ? `<span class="pf__barre">${esc(fmtPrix(p.prixBarre))}</span>` : ''}
              <span class="pf__actuel">${esc(fmtPrix(p.prix))}</span>
              ${remise ? `<span class="pf__gain">−${esc(fmtPrix(p.prixBarre - p.prix))}</span>` : ''}
            </div>
            <p class="stock stock--${stock.ton}"><span class="stock__point" aria-hidden="true"></span>${esc(stock.libelle)}</p>
            <p class="pf__mention">${p.unite ? `Prix ${esc(p.unite)}. ` : ''}Prix indicatif TTC, hors livraison — confirmé par devis.</p>

            <div class="pf__boutons">
              <div class="qte">
                <button type="button" class="qte__b" data-q-moins aria-label="Retirer un">${icone('moins')}</button>
                <input class="qte__n" type="number" min="1" max="99" value="1" data-q-fiche aria-label="Quantité">
                <button type="button" class="qte__b" data-q-plus aria-label="Ajouter un">${icone('plus')}</button>
              </div>
              <button type="button" class="btn btn--plein js-ajouter pf__ajouter" data-id="${esc(p.id)}" data-qte="1">
                ${icone('plus')}<span>Ajouter à ma sélection</span>
              </button>
            </div>
            <a class="pf__wa" href="https://wa.me/${WHATSAPP}?text=${message}" target="_blank" rel="noopener">
              ${icone('whatsapp')} Une question ? Écrivez-nous sur WhatsApp
            </a>
          </div>

          <ul class="pf__garanties">
            <li>${icone('bouclier')}<span><b>Garantie ${esc(p.garantie ?? 'selon fabricant')}</b>${esc(cat.ETATS[p.etat].desc)}</span></li>
            <li>${icone('outil')}<span><b>SAV Dilitech</b>Par l’équipe qui vous l’a vendu, à ${esc(CONTACT.adresse.split(',')[0])}</span></li>
            <li>${icone('camion')}<span><b>Retrait ou livraison</b>Bamako, et acheminement vers les autres villes</span></li>
          </ul>

          <p class="fiche__usages">
            <span>Recommandé pour&nbsp;:</span>
            ${p.usages.map((u) => `<a href="catalogue.html?usage=${u}" class="jeton jeton--usage">${esc(cat.USAGES.find((x) => x.code === u)?.nom ?? u)}</a>`).join('')}
          </p>
        </div>
      </div>

      <!-- ============ CARACTÉRISTIQUES + DISPONIBILITÉ ============ -->
      <div class="pf-bas">
        <section class="pf-bloc">
          <h2 class="pf-bloc__titre">Caractéristiques <em>techniques</em></h2>
          <table class="specs">
            <tbody>
              ${Object.entries(s).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
              <tr><th scope="row">État</th><td>${esc(cat.ETATS[p.etat].nom)}</td></tr>
              <tr><th scope="row">Référence</th><td>${esc(p.id)}</td></tr>
            </tbody>
          </table>
        </section>

        <section class="pf-bloc">
          <h2 class="pf-bloc__titre">Disponibilité <em>dans le réseau</em></h2>
          <div class="dispo">
            ${
              dispo.length
                ? dispo.map((d) => `
                  <div class="dispo__l${d.role === 'siege' ? ' dispo__l--siege' : ''}">
                    <span class="dispo__dr" aria-hidden="true">${esc(d.iso)}</span>
                    <div>
                      <p class="dispo__ville">${esc(d.ville)}</p>
                      <p class="dispo__pays">${esc(d.pays)}${d.role === 'siege' ? ' · siège' : ''}</p>
                    </div>
                    <p class="dispo__etat stock stock--${etatDe(d.quantite)}">
                      <span class="stock__point" aria-hidden="true"></span>${esc(libelleDe(d.quantite))}
                    </p>
                  </div>`).join('')
                : `<p class="fiche-bloc__intro">Non stocké actuellement — nous le commandons sur demande.</p>`
            }
          </div>
          <p class="encart-siege">
            ${icone('broche')}
            <span>Pas dans une de ces villes ? Le stock circule dans le réseau : indiquez votre ville au devis, nous donnons le délai depuis ${esc(SIEGE.ville)}.</span>
          </p>
        </section>
      </div>

      ${
        similaires.length
          ? `<div class="pf-similaires">
               <h2 class="pf-bloc__titre">À comparer <em>dans la même gamme</em></h2>
               <div class="grille-produits">${similaires.map((x) => carteProduit(x, { compact: true })).join('')}</div>
             </div>`
          : ''
      }`;

    this.#brancherQuantite(p.id);
    this.#brancherGalerie(photos.length);
  }

  /* Galerie : flèches, vignettes, flèches du clavier, glisser au doigt. */
  #brancherGalerie(n) {
    const g = $('[data-galerie]', this);
    if (!g || n < 2) return;
    let i = 0;
    const aller = (k) => {
      i = (k + n) % n;
      g.querySelectorAll('.pf__photo').forEach((im, j) => im.classList.toggle('est-active', j === i));
      g.querySelectorAll('.pf__vignette').forEach((v, j) => {
        v.classList.toggle('est-active', j === i);
        v.setAttribute('aria-selected', String(j === i));
        if (j === i) v.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
      const c = g.querySelector('[data-compteur-photo]');
      if (c) c.textContent = `${i + 1} / ${n}`;
    };
    g.addEventListener('click', (e) => {
      const f = e.target.closest('[data-g]');
      if (f) { aller(i + Number(f.dataset.g)); return; }
      const v = e.target.closest('[data-i]');
      if (v) aller(Number(v.dataset.i));
    });
    this.#touches?.abort();
    this.#touches = new AbortController();
    addEventListener('keydown', (e) => {
      if (this.hidden || e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight') aller(i + 1);
      if (e.key === 'ArrowLeft') aller(i - 1);
    }, { signal: this.#touches.signal });
    let x0 = null;
    const scene = g.querySelector('.pf__scene');
    scene.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    scene.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) aller(i + (dx < 0 ? 1 : -1));
    });
  }

  #touches = null;

  #brancherQuantite(id) {
    const racine = $('[data-corps]', this);
    const champ = $('[data-q-fiche]', racine);
    const bouton = $('.pf__ajouter', racine);
    if (!champ || !bouton) return;

    const appliquer = () => {
      const n = Math.min(99, Math.max(1, Math.trunc(Number(champ.value)) || 1));
      champ.value = n;
      bouton.dataset.qte = n;
    };

    $('[data-q-moins]', racine).addEventListener('click', () => {
      champ.value = Math.max(1, Number(champ.value) - 1);
      appliquer();
    });
    $('[data-q-plus]', racine).addEventListener('click', () => {
      champ.value = Math.min(99, Number(champ.value) + 1);
      appliquer();
    });
    champ.addEventListener('change', appliquer);
    appliquer();
  }
}

customElements.define('panneau-produit', PanneauProduit);

/** Ouvre la fiche d'un produit depuis n'importe où. */
export function voirProduit(id) {
  document.querySelector('panneau-produit')?.ouvrir(id);
}
