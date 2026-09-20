/* =========================================================================
   DILITECH — coordonnées et constantes de marque
   -------------------------------------------------------------------------
   Source unique : tout le site lit ce fichier. Un changement de numéro ou
   d'adresse se fait ICI et nulle part ailleurs (aucun numéro codé en dur
   dans le HTML — les balises portent des `data-dt` remplis au chargement).
   Valeurs relevées sur la charte graphique de février 2025 et sur les
   visuels de la page Facebook @dilitech.
   ========================================================================= */

export const SITE = {
  nom: 'Dilitech',
  nomComplet: 'DILITECH',
  baseline: "Vente d'ordinateurs portables et accessoires informatiques",
  sousBaseline: 'Maintenance PC · SAV · Matériels réseaux',
  promesse: "Nous ne vendons pas un ordinateur, nous vendons la solution qui correspond à votre besoin.",
  url: 'https://www.dilitech.ml',
};

export const CONTACT = {
  telephones: [
    { label: '+223 71 92 71 98', tel: '+22371927198', whatsapp: '22371927198', principal: true },
    { label: '+223 91 91 30 60', tel: '+22391913060', whatsapp: '22391913060', principal: false },
  ],
  email: 'contact@dilitech.ml',
  adresse: 'Torokorobougou, Commune V',
  ville: 'Bamako',
  pays: 'Mali',
  mapsQuery: 'Torokorobougou, Bamako, Mali',
};

/** Numéro unique vers lequel partent toutes les demandes de devis. */
export const WHATSAPP = CONTACT.telephones[0].whatsapp;

export const HORAIRES = [
  { jours: 'Lundi – Vendredi', h: '08h00 – 18h00', ouvert: true },
  { jours: 'Samedi',           h: '09h00 – 15h00', ouvert: true },
  { jours: 'Dimanche',         h: 'Fermé',         ouvert: false },
];

export const RESEAUX = [
  { nom: 'Facebook',  url: 'https://www.facebook.com/profile.php?id=100064903981504', icone: 'facebook' },
  { nom: 'TikTok',    url: 'https://www.tiktok.com/@dilitech?is_from_webapp=1&sender_device=pc', icone: 'tiktok' },
  { nom: 'LinkedIn',  url: 'https://www.linkedin.com/company/dilitech', icone: 'linkedin' },
  { nom: 'WhatsApp',  url: `https://wa.me/${WHATSAPP}`,            icone: 'whatsapp' },
];

/* Le devis est le seul « tunnel » du site : aucun paiement en ligne (hors
   périmètre V1 du cahier des charges), la vente se finalise sur WhatsApp. */
export const DEVIS = {
  cle: 'dt-devis',            // clé localStorage de la sélection
  canal: 'dt-devis-sync',     // canal BroadcastChannel entre onglets
  maxLignes: 40,
};

/** Formatage monétaire unique du site : 1 250 000 FCFA. */
const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
export const prix = (v) => (v == null ? 'Sur devis' : `${nf.format(v)} FCFA`);
export const nombre = (v) => nf.format(v);
