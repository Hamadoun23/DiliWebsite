/* =========================================================================
   DILITECH — demande de devis
   -------------------------------------------------------------------------
   Le site ne vend pas en ligne (hors périmètre V1 : pas de paiement). Le
   parcours s'arrête à la demande de devis, qui part sur WhatsApp — c'est le
   canal que Dilitech utilise déjà tous les jours.

   La sélection vit dans localStorage, se synchronise entre les onglets
   ouverts, et survit à la navigation entre les pages. Elle ne stocke que des
   identifiants et des quantités : le prix et le libellé sont toujours relus
   dans le catalogue, pour qu'un changement de tarif ne laisse pas traîner
   un vieux montant dans le navigateur du visiteur.

   PHASE 2 (faite) — `soumettre()` poste aussi la demande au logiciel de
   gestion DiliApp (voir transmettreAuLogiciel plus bas), en plus du
   message WhatsApp qui reste le canal garanti.
   ========================================================================= */

import { creerStore } from './store.js';
import { parId, niveauStock } from './catalogue.js';
import { API, DEVIS, WHATSAPP, SITE, prix as fmtPrix } from '../config.js';
import { lignesBesoin } from './profil.js';

/** Une ligne relue est acceptée seulement si le produit existe encore. */
function validerEtatRelu(relu) {
  if (!relu || !Array.isArray(relu.lignes)) return null;
  const lignes = relu.lignes
    .filter((l) => l && typeof l.id === 'string' && parId(l.id))
    .map((l) => ({ id: l.id, qte: Math.min(99, Math.max(1, Math.trunc(Number(l.qte)) || 1)) }))
    .slice(0, DEVIS.maxLignes);
  return { lignes, client: relu.client ?? null };
}

const store = creerStore(
  { lignes: [], client: null },
  { cle: DEVIS.cle, canal: DEVIS.canal, valider: validerEtatRelu }
);

export const abonner = store.abonner;

/* --- lecture ---------------------------------------------------------- */

/** Lignes enrichies du produit courant. Une ligne orpheline est ignorée. */
export function lignes() {
  return store.etat.lignes
    .map((l) => {
      const produit = parId(l.id);
      return produit ? { ...l, produit, sousTotal: produit.prix * l.qte } : null;
    })
    .filter(Boolean);
}

export const contient = (id) => store.etat.lignes.some((l) => l.id === id);
export const quantite = (id) => store.etat.lignes.find((l) => l.id === id)?.qte ?? 0;

/** Nombre d'articles, toutes quantités confondues — c'est ce qu'affiche la pastille. */
export const nombreArticles = () => store.etat.lignes.reduce((n, l) => n + l.qte, 0);
export const nombreLignes = () => store.etat.lignes.length;

export function total() {
  return lignes().reduce((t, l) => t + l.sousTotal, 0);
}

/* --- écriture --------------------------------------------------------- */

/**
 * Ajoute un produit ou incrémente sa quantité.
 * @returns {'ajoute'|'incremente'|'plein'|'inconnu'}
 */
export function ajouter(id, qte = 1) {
  if (!parId(id)) return 'inconnu';
  const existante = store.etat.lignes.find((l) => l.id === id);
  if (existante) {
    existante.qte = Math.min(99, existante.qte + qte);
    return 'incremente';
  }
  if (store.etat.lignes.length >= DEVIS.maxLignes) return 'plein';
  store.etat.lignes.push({ id, qte: Math.min(99, Math.max(1, qte)) });
  return 'ajoute';
}

/** Fixe la quantité ; 0 ou moins retire la ligne. */
export function definirQuantite(id, qte) {
  const n = Math.trunc(Number(qte));
  const i = store.etat.lignes.findIndex((l) => l.id === id);
  if (i < 0) return;
  if (!Number.isFinite(n) || n <= 0) store.etat.lignes.splice(i, 1);
  else store.etat.lignes[i].qte = Math.min(99, n);
}

export function retirer(id) {
  const i = store.etat.lignes.findIndex((l) => l.id === id);
  if (i >= 0) store.etat.lignes.splice(i, 1);
}

export function vider() {
  store.transaction((e) => { e.lignes.length = 0; });
}

/** Coordonnées saisies dans le formulaire, mémorisées entre deux visites. */
export function definirClient(client) {
  store.transaction((e) => { e.client = client; });
}
export const client = () => store.etat.client;

/* --- mise en message -------------------------------------------------- */

/**
 * Récapitulatif texte envoyé sur WhatsApp. Volontairement lisible tel quel
 * dans la conversation : le commercial doit pouvoir le traiter sans ouvrir
 * autre chose. Chaque ligne porte sa référence DT-… pour que la saisie dans
 * le logiciel de gestion soit sans ambiguïté.
 */
export function messageTexte(coordonnees = {}) {
  const l = lignes();
  const out = [];

  out.push(`*Demande de devis — ${SITE.nomComplet}*`);
  out.push('');

  if (coordonnees.nom)       out.push(`Nom : ${coordonnees.nom}`);
  if (coordonnees.structure) out.push(`Structure : ${coordonnees.structure}`);
  if (coordonnees.ville)     out.push(`Ville : ${coordonnees.ville}`);
  if (coordonnees.telephone) out.push(`Téléphone : ${coordonnees.telephone}`);
  if (coordonnees.email)     out.push(`E-mail : ${coordonnees.email}`);
  if (coordonnees.nom || coordonnees.telephone) out.push('');

  /* Ce que le visiteur a dit de son usage sur le site (concierge ou puces
     de la sélection) : le commercial sait à qui il parle avant de répondre. */
  const besoin = lignesBesoin();
  if (besoin.length) {
    out.push('*Besoin exprimé sur le site*');
    for (const b of besoin) out.push(`• ${b}`);
    out.push('');
  }

  if (l.length) {
    out.push(`*Sélection (${nombreArticles()} article${nombreArticles() > 1 ? 's' : ''})*`);
    for (const ligne of l) {
      const p = ligne.produit;
      out.push(`• ${ligne.qte} × ${p.nom}`);
      out.push(`  ${p.id} — ${fmtPrix(p.prix)}${p.unite ? ` (${p.unite})` : ''} → ${fmtPrix(ligne.sousTotal)}`);
    }
    out.push('');
    out.push(`*Total indicatif : ${fmtPrix(total())}*`);
    out.push('_Montant hors remise et hors livraison — à confirmer par Dilitech._');
  } else {
    out.push('_Aucun article sélectionné : demande de conseil._');
  }

  if (coordonnees.message) {
    out.push('');
    out.push('*Précisions*');
    out.push(coordonnees.message);
  }

  out.push('');
  out.push(`Envoyé depuis ${SITE.url}`);
  return out.join('\n');
}

/** Lien WhatsApp prêt à ouvrir, message inclus. */
export function lienWhatsApp(coordonnees = {}) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(messageTexte(coordonnees))}`;
}

/** Lien mailto de repli, pour qui n'a pas WhatsApp sur cet appareil. */
export function lienMail(coordonnees = {}, email) {
  const sujet = `Demande de devis — ${coordonnees.nom || 'site web'}`;
  return `mailto:${email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(
    messageTexte(coordonnees).replace(/\*/g, '').replace(/_/g, '')
  )}`;
}

/**
 * Transmet la demande au logiciel de gestion DiliApp (phase 2) : elle apparaît
 * en direct dans le pipeline « Devis » des commerciaux, rattachée à la fiche
 * client si le numéro est connu.
 *
 * Volontairement NON attendue : les formulaires ouvrent WhatsApp juste après
 * `soumettre()`, et un navigateur bloque une fenêtre ouverte après une attente
 * réseau (elle n'est plus rattachée au clic). `keepalive` laisse la requête
 * aboutir même si la page change. Si l'API est injoignable, rien ne casse :
 * WhatsApp reste le canal garanti.
 */
function transmettreAuLogiciel(coordonnees) {
  if (!API.url || !coordonnees.telephone) return;
  fetch(`${API.url}/public/devis/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      nom: coordonnees.nom || 'Visiteur du site',
      telephone: coordonnees.telephone,
      email: coordonnees.email || '',
      ville: coordonnees.ville || '',
      message: [coordonnees.structure && `Structure : ${coordonnees.structure}`, coordonnees.message]
        .filter(Boolean).join('\n'),
      recapitulatif: messageTexte(coordonnees).replace(/\*/g, '').replace(/_/g, ''),
      lignes: store.etat.lignes.map((l) => ({ reference: l.id, quantite: l.qte })),
    }),
  }).catch(() => {});
}

/** Point de sortie unique de la demande : logiciel de gestion + WhatsApp. */
export async function soumettre(coordonnees = {}) {
  definirClient({
    nom: coordonnees.nom ?? '',
    structure: coordonnees.structure ?? '',
    ville: coordonnees.ville ?? '',
    telephone: coordonnees.telephone ?? '',
    email: coordonnees.email ?? '',
  });
  transmettreAuLogiciel(coordonnees);
  return { lien: lienWhatsApp(coordonnees), texte: messageTexte(coordonnees) };
}

/* --- avertissements affichés au récapitulatif -------------------------- */

/** Signale les lignes dont la quantité dépasse le stock réseau connu. */
export function alertesStock() {
  return lignes()
    .filter((l) => l.qte > l.produit.stockTotal)
    .map((l) => ({
      id: l.id,
      nom: l.produit.nom,
      demande: l.qte,
      niveau: niveauStock(l.produit),
    }));
}
