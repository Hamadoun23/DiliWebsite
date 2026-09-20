/* =========================================================================
   DILITECH — amorce commune à toutes les pages
   -------------------------------------------------------------------------
   Chaque page charge ce module en premier. Il enregistre les composants,
   allume les comportements d'interface, et pose la DÉLÉGATION GLOBALE des
   clics : un seul écouteur sur `document` traite « ajouter à ma sélection »
   et « ouvrir la sélection », d'où qu'ils viennent.

   C'est ce qui permet aux grilles d'être re-rendues librement (filtres,
   recherche, chargement progressif) sans jamais rebrancher d'écouteurs — ni
   en laisser fuir.
   ========================================================================= */

import '../components/chrome.js';
import '../components/panneau-devis.js';
import { ouvrirPanneau } from '../components/panneau-devis.js';

import * as devis from '../core/devis.js';
import { parId } from '../core/catalogue.js';
import { WHATSAPP } from '../config.js';
import { ICONES, icone } from '../core/icones.js';
import { $, $$, animationsReduites } from '../core/dom.js';
import {
  activerReveal,
  activerCompteurs,
  activerChromeDePage,
  activerLueurSections,
  activerAncresAccueil,
  surveillerImages,
  toast,
} from '../core/ui.js';

/* --- délégation globale ------------------------------------------------- */

document.addEventListener('click', (e) => {
  /* Ouvrir la sélection */
  if (e.target.closest('.js-ouvrir-devis')) {
    e.preventDefault();
    ouvrirPanneau();
    return;
  }

  /* Ajouter un produit — le bouton porte data-id, y compris hors du catalogue */
  const bouton = e.target.closest('.js-ajouter');
  if (bouton) {
    e.preventDefault();
    const id = bouton.dataset.id;
    const produit = parId(id);
    const quantite = Number(bouton.dataset.qte) || 1;
    const issue = devis.ajouter(id, quantite);

    if (issue === 'inconnu') {
      toast("Ce produit n'est plus au catalogue", { ton: 'alerte' });
      return;
    }
    if (issue === 'plein') {
      toast('Sélection pleine — envoyez cette demande avant d’en ajouter', { ton: 'alerte' });
      return;
    }

    /* Retour visuel sur le bouton lui-même : on confirme là où l'utilisateur
       regarde, sans déplacer son attention vers un coin de l'écran. */
    bouton.classList.add('est-ajoute');
    setTimeout(() => bouton.classList.remove('est-ajoute'), 1400);

    toast(
      issue === 'incremente'
        ? `${produit.nom} — quantité mise à jour`
        : `${produit.nom} ajouté à votre sélection`,
      { ton: 'ok', action: { libelle: 'Voir', faire: ouvrirPanneau } }
    );
  }
});

/* --- état « déjà sélectionné » sur les boutons -------------------------- */

/* Les boutons d'ajout sont partout et la sélection change de partout (deux
   onglets compris) : on les resynchronise à chaque notification du magasin
   plutôt qu'au moment du clic. */
devis.abonner(() => {
  for (const b of $$('.js-ajouter')) {
    const n = devis.quantite(b.dataset.id);
    b.classList.toggle('est-dedans', n > 0);
    const mot = b.querySelector('span');
    if (mot) {
      mot.textContent = n > 0 ? `Dans ma sélection (${n})` : 'Ajouter à ma sélection';
    }
  }
});

/* --- icônes déclaratives ------------------------------------------------ */

/**
 * Le HTML écrit `<span class="ic" data-ic="fleche"></span>` ; le dessin est
 * injecté ici. Les pages restent lisibles et aucun SVG n'y est recopié.
 */
function remplirIcones(racine = document) {
  for (const n of $$('[data-ic]', racine)) {
    n.innerHTML = ICONES[n.dataset.ic] ?? '';
    n.removeAttribute('data-ic');
  }
}

/* --- bulle WhatsApp ------------------------------------------------------ */

function brancherBulleWhatsApp() {
  const bulle = $('[data-wa]');
  if (!bulle) return;
  bulle.href = `https://wa.me/${WHATSAPP}`;
  bulle.innerHTML = icone('whatsapp');
}

/* --- démarrage ---------------------------------------------------------- */

function demarrer() {
  /* Le panneau de devis est injecté ici : inutile de le répéter dans les six
     pages HTML, et il doit exister avant tout clic. */
  if (!$('panneau-devis')) document.body.append(document.createElement('panneau-devis'));

  remplirIcones();
  brancherBulleWhatsApp();
  activerChromeDePage();
  activerLueurSections();
  activerAncresAccueil();
  activerReveal();
  activerCompteurs();
  surveillerImages();

  /* Les transitions de vue rendent la navigation entre pages moins sèche,
     là où le navigateur les gère. Sans elles, rien ne change. */
  if (!animationsReduites()) document.documentElement.classList.add('anim');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', demarrer, { once: true });
} else {
  demarrer();
}

/* Réexports : les modules de page n'ont ainsi qu'un seul import à faire. */
export { activerReveal, activerCompteurs, toast, ouvrirPanneau };
