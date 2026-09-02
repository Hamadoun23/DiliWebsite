/* =========================================================================
   DILITECH — le réseau
   -------------------------------------------------------------------------
   Bamako est le siège ; les six autres villes sont des partenaires
   revendeurs. Chaque point de vente porte un `code` court : c'est lui qui
   sert de clé dans le champ `dispo` des produits, et ce sera plus tard la
   clé de la table Stock du logiciel de gestion (phase 2). Ne pas renommer
   un code sans reprendre js/data/produits.js.
   ========================================================================= */

export const PARTENAIRES = [
  {
    code: 'BKO', ville: 'Bamako', pays: 'Mali', iso: 'ML',
    role: 'siege', libelleRole: 'Siège & showroom',
    quartier: 'Torokorobougou, Commune V',
    tel: '+223 71 92 71 98', whatsapp: '22371927198',
    coords: { x: 30, y: 40 },
    note: "Showroom, atelier de maintenance et service après-vente. C'est ici que transitent les commandes du réseau.",
  },
  {
    code: 'DKR', ville: 'Dakar', pays: 'Sénégal', iso: 'SN',
    role: 'partenaire', libelleRole: 'Partenaire revendeur',
    quartier: 'Plateau', tel: null, whatsapp: '22371927198',
    coords: { x: 8, y: 34 },
    note: "Point d'entrée du réseau sur la côte atlantique : import, stock tampon et livraison régionale.",
  },
  {
    code: 'CKY', ville: 'Conakry', pays: 'Guinée', iso: 'GN',
    role: 'partenaire', libelleRole: 'Partenaire revendeur',
    quartier: 'Kaloum', tel: null, whatsapp: '22371927198',
    coords: { x: 12, y: 52 },
    note: 'Vente de postes de travail et accessoires, relais SAV pour la Guinée.',
  },
  {
    code: 'ABJ', ville: 'Abidjan', pays: "Côte d'Ivoire", iso: 'CI',
    role: 'partenaire', libelleRole: 'Partenaire revendeur',
    quartier: 'Plateau', tel: null, whatsapp: '22371927198',
    coords: { x: 30, y: 64 },
    note: 'Le plus gros volume du réseau après Bamako, surtout en matériel réseau et parcs entreprise.',
  },
  {
    code: 'LFW', ville: 'Lomé', pays: 'Togo', iso: 'TG',
    role: 'partenaire', libelleRole: 'Partenaire revendeur',
    quartier: 'Bè', tel: null, whatsapp: '22371927198',
    coords: { x: 47, y: 62 },
    note: 'Plateforme logistique côtière : réception des conteneurs et éclatement vers le Sahel.',
  },
  {
    code: 'NDJ', ville: "N'Djaména", pays: 'Tchad', iso: 'TD',
    role: 'partenaire', libelleRole: 'Partenaire revendeur',
    quartier: 'Centre-ville', tel: null, whatsapp: '22371927198',
    coords: { x: 72, y: 44 },
    note: "Couverture Tchad et bassin du lac : ONG, administrations et bureaux d'études.",
  },
  {
    code: 'BGF', ville: 'Bangui', pays: 'Centrafrique', iso: 'CF',
    role: 'partenaire', libelleRole: 'Partenaire revendeur',
    quartier: 'Centre-ville', tel: null, whatsapp: '22371927198',
    coords: { x: 74, y: 62 },
    note: 'Fourniture de matériel bureautique et réseau aux missions et institutions.',
  },
];

export const SIEGE = PARTENAIRES[0];

/** Index code → partenaire, pour les fiches produits. */
export const PAR_CODE = Object.fromEntries(PARTENAIRES.map((p) => [p.code, p]));

export const villeDe = (code) => PAR_CODE[code]?.ville ?? code;
