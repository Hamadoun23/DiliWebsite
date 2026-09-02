/* =========================================================================
   DILITECH — fiche produit
   -------------------------------------------------------------------------
   Le cahier des charges demande quatre choses sur cette page : les
   caractéristiques techniques, les photos, le prix et LA DISPONIBILITÉ PAR
   PARTENAIRE. C'est ce dernier point qui distingue le catalogue Dilitech
   d'une simple liste de prix : le visiteur d'Abidjan doit savoir si la
   machine est chez lui ou si elle doit venir de Bamako.

   La page se monte depuis `?id=DT-…`. Une référence inconnue ne produit pas
   une page vide mais une vraie page « introuvable », avec des suggestions.
   ========================================================================= */

import './commun.js';

import * as cat from '../core/catalogue.js';
import { illustration } from '../data/illustrations.js';
import { carteProduit } from '../components/carte-produit.js';
import { SIEGE } from '../data/partenaires.js';
import { prix as fmtPrix, CONTACT } from '../config.js';
import { $, esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal } from '../core/ui.js';

const racine = $('[data-page-produit]');
const id = new URLSearchParams(location.search).get('id');
const produit = id ? cat.parId(id) : null;


/* =========================================================================
   Page « référence introuvable »
   ========================================================================= */

function introuvable() {
  document.title = 'Référence introuvable — Dilitech';
  racine.innerHTML = `
    <section class="entete-page nuit grain coupe-bas sur-nuit">
      <div class="motif circuit"></div>
      <div class="wrap">
        <p class="surtitre">Référence introuvable</p>
        <h1 class="titre titre--geant">Cette fiche <em>n'existe pas.</em></h1>
        <p class="chapeau">
          Le lien est peut-être ancien, ou le produit a quitté le catalogue.
          Voici ce que nous proposons de plus proche.
        </p>
        <div class="heros__actions">
          <a class="btn btn--cyan btn--lueur" href="catalogue.html">Ouvrir le catalogue</a>
          <a class="btn btn--ligne" href="contact.html">Nous demander</a>
        </div>
      </div>
    </section>

    <section class="sec--serre">
      <div class="wrap">
        <h2 class="titre titre--petit" style="margin-bottom:26px">
          Nos <em>recommandations.</em>
        </h2>
        <div class="grille-produits">
          ${cat.recommandes().slice(0, 4).map((p) => carteProduit(p)).join('')}
        </div>
      </div>
    </section>`;
  activerReveal(racine);
}

/* =========================================================================
   Montage de la fiche
   ========================================================================= */

function monter(p) {
  const categorie = cat.categorie(p.cat);
  const sous = cat.sousCategorie(p.sous);
  const stock = cat.niveauStock(p);
  const dispo = cat.disponibilite(p);
  const remise = p.prixBarre ? Math.round((1 - p.prix / p.prixBarre) * 100) : 0;
  const similaires = cat.similaires(p, 4);

  document.title = `${p.nom} — Dilitech`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${p.nom} — ${p.resume}`;

  racine.innerHTML = `
  <section class="sec--serre">
    <div class="wrap">

      <!-- fil d'Ariane -->
      <nav class="fil" aria-label="Fil d'Ariane">
        <a href="index.html">Accueil</a> ${icone('chevronDroite')}
        <a href="catalogue.html">Catalogue</a> ${icone('chevronDroite')}
        <a href="catalogue.html?cat=${p.cat}">${esc(categorie?.nom ?? '')}</a> ${icone('chevronDroite')}
        <a href="catalogue.html?cat=${p.cat}&sous=${p.sous}">${esc(sous?.nom ?? '')}</a>
      </nav>

      <div class="fiche">

        <!-- ============ VISUEL ============ -->
        <div class="fiche__gauche">
          <div class="fiche__visuel">
            <span class="carte__illus">${illustration(p.illus)}</span>
            ${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.nom)}" data-repli>` : ''}
            ${p.tag && cat.TAGS[p.tag] ? `<span class="etiq etiq--${cat.TAGS[p.tag].ton}">${esc(cat.TAGS[p.tag].nom)}</span>` : ''}
            ${remise ? `<span class="etiq etiq--remise">−${remise}&nbsp;%</span>` : ''}
          </div>
          ${
            !p.img
              ? `<p class="fiche__note-visuel">
                   ${icone('etincelle')}
                   Illustration de la famille de produit. La photo de l'article
                   exact vous est envoyée sur demande.
                 </p>`
              : ''
          }
        </div>

        <!-- ============ ACHAT ============ -->
        <div class="fiche__droite">
          <p class="fiche__marque">${esc(p.marque)} · ${esc(p.id)}</p>
          <h1>${esc(p.nom)}</h1>
          <p class="fiche__resume">${esc(p.resume)}</p>

          <div class="fiche__prix">
            <span class="actuel">${esc(fmtPrix(p.prix))}</span>
            ${p.prixBarre ? `<span class="barre">${esc(fmtPrix(p.prixBarre))}</span>` : ''}
            ${remise ? `<span class="gain">Économisez ${esc(fmtPrix(p.prixBarre - p.prix))}</span>` : ''}
          </div>
          <p class="fiche__mention">
            ${p.unite ? `Prix ${esc(p.unite)}. ` : ''}Prix indicatif TTC, hors livraison.
            Le montant ferme est confirmé par devis.
          </p>

          <div class="fiche__achat">
            <div class="qte">
              <button type="button" class="qte__b" data-q-moins aria-label="Retirer un">${icone('moins')}</button>
              <input class="qte__n" type="number" min="1" max="99" value="1" data-q-fiche
                     aria-label="Quantité">
              <button type="button" class="qte__b" data-q-plus aria-label="Ajouter un">${icone('plus')}</button>
            </div>
            <button type="button" class="btn btn--plein js-ajouter"
                    data-id="${esc(p.id)}" data-qte="1">
              ${icone('plus')}<span>Ajouter à ma sélection</span>
            </button>
          </div>

          <ul class="fiche__points">
            <li class="fiche__point">
              ${icone('bouclier')}
              <span><b>Garantie ${esc(p.garantie ?? 'selon fabricant')}</b> —
              ${esc(cat.ETATS[p.etat].desc)}</span>
            </li>
            <li class="fiche__point">
              ${icone('outil')}
              <span><b>SAV et maintenance</b> assurés par notre atelier de
              ${esc(CONTACT.adresse)}, ${esc(CONTACT.ville)}.</span>
            </li>
            <li class="fiche__point">
              ${icone('camion')}
              <span><b>Retrait ou livraison</b> à Bamako, et acheminement par le
              réseau vers les autres villes.</span>
            </li>
            <li class="fiche__point">
              ${icone('etincelle')}
              <span><b>Conseil avant achat</b> — dites-nous l'usage prévu, nous
              validons que c'est le bon choix, ou nous vous en proposons un autre.</span>
            </li>
          </ul>

          <p class="fiche__usages">
            <span>Recommandé pour&nbsp;:</span>
            ${p.usages
              .map(
                (u) =>
                  `<a href="catalogue.html?usage=${u}" class="jeton jeton--usage">${esc(
                    cat.USAGES.find((x) => x.code === u)?.nom ?? u
                  )}</a>`
              )
              .join('')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ CARACTÉRISTIQUES + DISPONIBILITÉ ============ -->
  <section class="sec--brume">
    <div class="wrap fiche-bas">

      <div class="fiche-bloc reveal">
        <h2 class="titre titre--petit">Caractéristiques <em>techniques.</em></h2>
        <table class="specs">
          <tbody>
            ${Object.entries(p.specs)
              .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
              .join('')}
            <tr><th scope="row">État</th><td>${esc(cat.ETATS[p.etat].nom)}</td></tr>
            <tr><th scope="row">Référence</th><td>${esc(p.id)}</td></tr>
          </tbody>
        </table>
      </div>

      <div class="fiche-bloc reveal">
        <h2 class="titre titre--petit">Disponibilité <em>dans le réseau.</em></h2>
        <p class="fiche-bloc__intro">
          État consolidé au ${esc(aujourdhui())}. Nous confirmons la
          disponibilité exacte à la réponse au devis.
        </p>

        <p class="stock stock--${stock.ton} stock--gros">
          <span class="stock__point" aria-hidden="true"></span>${esc(stock.libelle)}
        </p>

        <div class="dispo">
          ${
            dispo.length
              ? dispo
                  .map(
                    (d) => `
              <div class="dispo__l${d.role === 'siege' ? ' dispo__l--siege' : ''}">
                <span class="dispo__dr" aria-hidden="true">${esc(d.iso)}</span>
                <div>
                  <p class="dispo__ville">${esc(d.ville)}</p>
                  <p class="dispo__pays">${esc(d.pays)}${d.role === 'siege' ? ' · siège' : ''}</p>
                </div>
                <p class="dispo__etat stock stock--${etatDe(d.quantite)}">
                  <span class="stock__point" aria-hidden="true"></span>${esc(libelleDe(d.quantite))}
                </p>
              </div>`
                  )
                  .join('')
              : `<p class="fiche-bloc__intro">
                   Non stocké actuellement — nous le commandons sur demande.
                 </p>`
          }
        </div>

        <p class="encart-siege">
          ${icone('broche')}
          <span>
            Vous n'êtes pas dans une de ces villes ? Le stock circule dans le
            réseau : indiquez votre ville au devis, nous vous donnons le délai
            d'acheminement depuis ${esc(SIEGE.ville)}.
          </span>
        </p>
      </div>

    </div>
  </section>

  <!-- ============ SIMILAIRES ============ -->
  ${
    similaires.length
      ? `<section>
           <div class="wrap">
             <header class="tete-duo">
               <div>
                 <p class="surtitre">À comparer</p>
                 <h2 class="titre titre--petit">Dans la même <em>gamme.</em></h2>
               </div>
               <a class="lien-fleche" href="catalogue.html?cat=${p.cat}&sous=${p.sous}">
                 Toute la sous-catégorie ${icone('fleche')}
               </a>
             </header>
             <div class="grille-produits">
               ${similaires.map((s) => carteProduit(s)).join('')}
             </div>
           </div>
         </section>`
      : ''
  }

  <!-- ============ APPEL ============ -->
  <section class="nuit coupe-haut sur-nuit cta sec--serre">
    <div class="motif circuit"></div>
    <div class="wrap cta__in">
      <h2 class="titre titre--petit">Une question sur <em>ce produit&nbsp;?</em></h2>
      <p class="chapeau">
        Compatibilité, extension de mémoire, délai, prix pour plusieurs postes :
        posez la question, la réponse vient d'un technicien, pas d'un formulaire.
      </p>
      <div class="cta__actions">
        <button type="button" class="btn btn--cyan js-ajouter" data-id="${esc(p.id)}">
          ${icone('plus')}<span>Ajouter à ma sélection</span>
        </button>
        <a class="btn btn--ligne" href="contact.html">Nous écrire</a>
      </div>
    </div>
  </section>`;

  brancherQuantite();
  activerReveal(racine);
}

/* =========================================================================
   Utilitaires locaux
   ========================================================================= */

/* Les paliers restent volontairement flous : le stock réel est une donnée
   commerciale, et il bouge d'un jour à l'autre. */
const etatDe = (n) => (n <= 0 ? 'rupture' : n <= 3 ? 'faible' : 'moyen');
const libelleDe = (n) =>
  n <= 0 ? 'Sur commande' : n <= 3 ? 'Dernières pièces' : 'En stock';

function aujourdhui() {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date());
}

/**
 * Le compteur de la fiche pilote l'attribut `data-qte` du bouton d'ajout :
 * la délégation globale de commun.js le lit au clic, sans rien connaître de
 * cette page.
 */
function brancherQuantite() {
  const champ = $('[data-q-fiche]', racine);
  const bouton = $('.fiche__achat .js-ajouter', racine);
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

/* =========================================================================
   Aiguillage — en fin de fichier À DESSEIN
   -------------------------------------------------------------------------
   `etatDe` et `libelleDe` sont des `const` : les appeler depuis le haut du
   module tomberait dans leur zone morte temporelle. Le montage se déclenche
   donc une fois tout le fichier évalué.
   ========================================================================= */

if (!produit) introuvable();
else monter(produit);
