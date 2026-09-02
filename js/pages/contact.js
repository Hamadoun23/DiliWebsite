/* =========================================================================
   DILITECH — contact et demande de devis
   -------------------------------------------------------------------------
   Le formulaire du cahier des charges. Il réutilise EXACTEMENT le même
   moteur que le panneau « Ma sélection » (js/core/devis.js) : la sélection
   composée dans le catalogue est donc jointe d'office, et le message part
   au même format, quel que soit le point d'entrée.

   PHASE 2 — le point d'accroche vers l'API du logiciel de gestion est unique
   et se trouve dans `devis.soumettre()`. Rien à modifier ici.
   ========================================================================= */

import './commun.js';

import * as devis from '../core/devis.js';
import { CONTACT, HORAIRES, RESEAUX, SITE, prix as fmtPrix } from '../config.js';
import { SIEGE } from '../data/partenaires.js';
import { $, $$, esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { toast } from '../core/ui.js';

/* =========================================================================
   1. SUJETS DE LA DEMANDE
   ========================================================================= */

const SUJETS = [
  'Achat d’ordinateurs',
  'Accessoires',
  'Matériel réseau',
  'Maintenance / réparation',
  'Service après-vente',
  'Équipement de parc',
  'Formation professionnelle',
  'Devenir partenaire',
];

rendre(
  '[data-sujets]',
  SUJETS.map(
    (s, i) => `
    <label class="puce">
      <input type="checkbox" name="sujet" value="${esc(s)}" id="sujet-${i}">
      <span>${esc(s)}</span>
    </label>`
  ).join('')
);

/* =========================================================================
   2. COORDONNÉES
   ========================================================================= */

rendre(
  '[data-infos]',
  `<div class="bloc-info">
     <p class="bloc-info__titre">${icone('broche')} Showroom & atelier</p>
     <p class="bloc-info__gros">${esc(SIEGE.quartier)}</p>
     <p class="bloc-info__txt">${esc(CONTACT.ville)}, ${esc(CONTACT.pays)}</p>
     <a class="lien-fleche" target="_blank" rel="noopener"
        href="https://www.google.com/maps/search/${encodeURIComponent(CONTACT.mapsQuery)}">
       Ouvrir dans Maps ${icone('fleche')}
     </a>
   </div>

   <div class="bloc-info">
     <p class="bloc-info__titre">${icone('telephone')} Téléphone & WhatsApp</p>
     <ul class="bloc-info__liste">
       ${CONTACT.telephones
         .map(
           (t) => `<li>
             <a href="tel:${esc(t.tel)}">${esc(t.label)}</a>
             ${t.principal ? '<span class="jeton">Principal</span>' : ''}
           </li>`
         )
         .join('')}
     </ul>
     <a class="btn btn--wa" href="https://wa.me/${esc(CONTACT.telephones[0].whatsapp)}"
        target="_blank" rel="noopener">${icone('whatsapp')} Écrire sur WhatsApp</a>
   </div>

   <div class="bloc-info">
     <p class="bloc-info__titre">${icone('mail')} E-mail</p>
     <p class="bloc-info__gros">
       <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a>
     </p>
   </div>

   <div class="bloc-info">
     <p class="bloc-info__titre">${icone('horloge')} Horaires d'ouverture</p>
     <ul class="bloc-info__horaires">
       ${HORAIRES.map(
         (h) => `<li${h.ouvert ? '' : ' class="est-ferme"'}>
                   <span>${esc(h.jours)}</span><b>${esc(h.h)}</b>
                 </li>`
       ).join('')}
     </ul>
     <p class="bloc-info__txt" data-ouverture></p>
   </div>

   <div class="bloc-info">
     <p class="bloc-info__titre">Nous suivre</p>
     <ul class="pied__reseaux bloc-info__reseaux">
       ${RESEAUX.map(
         (r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener"
                        aria-label="${esc(r.nom)}">${icone(r.icone)}</a></li>`
       ).join('')}
     </ul>
   </div>`
);

/* --- « ouvert en ce moment ? », calculé sur l'heure de Bamako ------------ */

/* Le Mali est à UTC+0 toute l'année : on lit donc l'heure UTC, et le message
   reste juste quel que soit le fuseau du visiteur. */
function etatOuverture() {
  const d = new Date();
  const jour = d.getUTCDay();            // 0 = dimanche
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();
  const plages = {
    1: [480, 1080], 2: [480, 1080], 3: [480, 1080], 4: [480, 1080], 5: [480, 1080],
    6: [540, 900],
  };
  const plage = plages[jour];
  if (!plage) return { ouvert: false, txt: 'Fermé le dimanche — ouverture lundi à 08h00.' };
  if (minutes < plage[0]) {
    return { ouvert: false, txt: `Fermé pour le moment — ouverture aujourd'hui à ${fmtH(plage[0])}.` };
  }
  if (minutes >= plage[1]) {
    return { ouvert: false, txt: 'Fermé pour le moment — nous répondons dès la réouverture.' };
  }
  return { ouvert: true, txt: `Ouvert en ce moment — jusqu'à ${fmtH(plage[1])}.` };
}
const fmtH = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}h${String(m % 60).padStart(2, '0')}`;

const ouverture = etatOuverture();
const zoneOuv = $('[data-ouverture]');
if (zoneOuv) {
  zoneOuv.className = `bloc-info__txt ouverture ${ouverture.ouvert ? 'est-ouvert' : 'est-ferme'}`;
  zoneOuv.innerHTML = `<span class="stock__point" aria-hidden="true"></span>${esc(ouverture.txt)}`;
}

/* =========================================================================
   3. RAPPEL DE LA SÉLECTION EN COURS
   ========================================================================= */

function rappelSelection() {
  const zone = $('[data-rappel-selection]');
  if (!zone) return;
  const lignes = devis.lignes();

  if (!lignes.length) {
    zone.innerHTML = `
      <p class="rappel rappel--vide">
        ${icone('devis')}
        <span>
          Aucune sélection en cours. Vous pouvez aussi
          <a href="catalogue.html">composer une liste depuis le catalogue</a> :
          elle sera jointe automatiquement à cette demande.
        </span>
      </p>`;
    return;
  }

  zone.innerHTML = `
    <div class="rappel">
      <p class="rappel__tete">
        ${icone('devis')}
        <span><b>${devis.nombreArticles()} article${devis.nombreArticles() > 1 ? 's' : ''}</b>
        de votre sélection seront joints à cette demande</span>
        <button type="button" class="rappel__voir js-ouvrir-devis">Modifier</button>
      </p>
      <ul class="rappel__liste">
        ${lignes
          .map(
            (l) => `<li><span>${l.qte} × ${esc(l.produit.nom)}</span>
                        <b>${esc(fmtPrix(l.sousTotal))}</b></li>`
          )
          .join('')}
      </ul>
      <p class="rappel__total">
        <span>Total indicatif</span><b>${esc(fmtPrix(devis.total()))}</b>
      </p>
    </div>`;
}

/* La sélection peut changer pendant que le formulaire est ouvert (panneau
   latéral, ou autre onglet) : le rappel se remet à jour tout seul. */
devis.abonner(rappelSelection);

/* =========================================================================
   4. ENVOI
   ========================================================================= */

const form = $('[data-form-devis]');

/** Prégarnit avec les coordonnées mémorisées lors d'une visite précédente. */
const memo = devis.client();
if (memo) {
  for (const [k, v] of Object.entries(memo)) {
    const champ = form.elements[k];
    if (champ && !champ.value) champ.value = v ?? '';
  }
}

function coordonnees() {
  const d = Object.fromEntries(new FormData(form).entries());
  const sujets = $$('[name="sujet"]:checked', form).map((n) => n.value);
  /* Les sujets cochés sont préfixés au message : le commercial voit tout de
     suite de quoi il s'agit, sans lire les six lignes de description. */
  const message = [
    sujets.length ? `Objet : ${sujets.join(', ')}` : '',
    d.message ?? '',
  ]
    .filter(Boolean)
    .join('\n');
  return { ...d, message };
}

function valider() {
  $$('.champ.est-erreur', form).forEach((n) => n.classList.remove('est-erreur'));
  const manquants = ['nom', 'telephone', 'message'].filter(
    (k) => !String(form.elements[k]?.value ?? '').trim()
  );
  if (!manquants.length) return true;

  for (const k of manquants) form.elements[k]?.closest('.champ')?.classList.add('est-erreur');
  const premier = form.elements[manquants[0]];
  premier?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  premier?.focus({ preventScroll: true });
  toast('Nom, téléphone et description du besoin sont nécessaires', { ton: 'alerte' });
  return false;
}

async function envoyer(canal) {
  if (!valider()) return;
  const data = coordonnees();
  const { lien } = await devis.soumettre(data);
  const cible = canal === 'mail' ? devis.lienMail(data, CONTACT.email) : lien;

  const fenetre = open(cible, '_blank', 'noopener');
  if (!fenetre) {
    /* Fenêtre bloquée : on ne perd pas la demande, on y va dans l'onglet. */
    location.href = cible;
    return;
  }
  toast('Demande prête — terminez la conversation pour recevoir votre devis', {
    ton: 'ok',
    duree: 5200,
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  envoyer('whatsapp');
});
$('[data-envoyer-mail]').addEventListener('click', () => envoyer('mail'));

/* =========================================================================
   5. QUESTIONS FRÉQUENTES
   ========================================================================= */

const FAQ = [
  {
    q: 'Peut-on acheter directement en ligne sur le site ?',
    r: `Non, et c'est volontaire. Le site sert à composer une demande précise ;
        la vente se finalise avec un commercial, par WhatsApp ou au showroom.
        Cela nous permet de vérifier que le matériel choisi correspond bien à
        l'usage, et de confirmer la disponibilité réelle avant tout engagement.`,
  },
  {
    q: 'Les prix affichés sont-ils fermes ?',
    r: `Ils sont indicatifs. Le prix ferme figure sur le devis : il tient compte
        des quantités, de la livraison et des remises éventuelles. Les tarifs du
        matériel importé évoluent avec le change et l'approvisionnement.`,
  },
  {
    q: 'Livrez-vous en dehors de Bamako ?',
    r: `Oui. Le retrait se fait au showroom de Torokorobougou et la livraison est
        assurée sur Bamako. Pour les autres villes, l'acheminement passe par nos
        partenaires : indiquez votre ville au devis, nous vous donnons le délai.`,
  },
  {
    q: 'Que couvre exactement la garantie ?',
    r: `Douze mois sur le matériel neuf et six mois sur nos reconditionnés, contre
        les défauts de fonctionnement. Chaque reconditionné part avec son rapport
        de test. Le suivi est assuré par l'équipe qui a vendu.`,
  },
  {
    q: 'Reprenez-vous l’ancien matériel ?',
    r: `Nous étudions la reprise au cas par cas, selon l'état et le modèle. Le plus
        souvent, une remise en état en atelier revient moins cher au client qu'un
        remplacement : nous le disons quand c'est le cas.`,
  },
  {
    q: 'Faites-vous des interventions sur site ?',
    r: `Oui, sur Bamako, pour l'installation réseau, le câblage, la vidéosurveillance
        et l'équipement de parc. Le déplacement est chiffré dans le devis.`,
  },
];

rendre(
  '[data-faq]',
  FAQ.map(
    (f, i) => `
    <details class="faq__i"${i === 0 ? ' open' : ''}>
      <summary>
        <span>${esc(f.q)}</span>
        ${icone('chevronBas', { classe: 'faq__ch' })}
      </summary>
      <p>${esc(f.r.replace(/\s+/g, ' ').trim())}</p>
    </details>`
  ).join('')
);

/* Le nom du site sert de repli au titre du document si la page est ouverte
   depuis un lien partagé sans contexte. */
document.title = `Contact & demande de devis — ${SITE.nom}`;
