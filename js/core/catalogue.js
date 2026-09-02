/* =========================================================================
   DILITECH — couche d'accès au catalogue
   -------------------------------------------------------------------------
   AUCUNE page ne lit `PRODUITS` directement : tout passe par ici. C'est la
   couture prévue avec la phase 2 du projet. Quand le logiciel de gestion
   exposera son API, seule `charger()` change :

       const reponse = await fetch('/api/catalogue');
       source = await reponse.json();

   Le reste du site — filtres, recherche, fiches, devis — ne bouge pas d'une
   ligne, à condition que l'API renvoie des produits de la même forme
   (voir l'en-tête de js/data/produits.js).
   ========================================================================= */

import { PRODUITS, CATEGORIES, USAGES, MARQUES, ETATS, TAGS } from '../data/produits.js';
import { PAR_CODE } from '../data/partenaires.js';
import { sansAccent, grouperPar } from './dom.js';

let source = PRODUITS;

/** Point de bascule de la phase 2. Voir l'en-tête. */
export async function charger() {
  return source;
}

export { CATEGORIES, USAGES, MARQUES, ETATS, TAGS };

export const tous = () => source;
export const parId = (id) => source.find((p) => p.id === id) ?? null;
export const categorie = (code) => CATEGORIES.find((c) => c.code === code) ?? null;

export function sousCategorie(code) {
  for (const c of CATEGORIES) {
    const s = c.sous.find((x) => x.code === code);
    if (s) return { ...s, categorie: c };
  }
  return null;
}

/* --- disponibilité ---------------------------------------------------- */

/** Détail « où trouver ce produit », trié du mieux fourni au moins fourni. */
export function disponibilite(produit) {
  return Object.entries(produit.dispo)
    .map(([code, quantite]) => ({ ...PAR_CODE[code], code, quantite }))
    .filter((d) => d.ville)
    .sort((a, b) => b.quantite - a.quantite);
}

/**
 * Niveau de stock, exprimé sans jamais donner un chiffre au visiteur : le
 * stock réel est une donnée commerciale, et il bouge. La fiche annonce une
 * tendance, la confirmation se fait au devis.
 */
export function niveauStock(produit) {
  const n = produit.stockTotal;
  if (n <= 0)  return { code: 'rupture', libelle: 'Sur commande',      ton: 'rupture' };
  if (n <= 3)  return { code: 'faible',  libelle: 'Dernières pièces',  ton: 'faible'  };
  if (n <= 12) return { code: 'moyen',   libelle: 'En stock',          ton: 'moyen'   };
  return { code: 'large', libelle: 'En stock', ton: 'moyen' };
}

/* --- recherche & filtres ---------------------------------------------- */

/* Index de recherche construit une fois : concaténation normalisée du nom,
   de la marque, du résumé, des specs et de la référence. Sur 55 produits un
   filtre naïf suffirait, mais le catalogue est appelé à grossir et cet index
   garde la frappe fluide. */
const INDEX = new WeakMap();
function texteDe(p) {
  let t = INDEX.get(p);
  if (t === undefined) {
    t = sansAccent(
      [p.nom, p.marque, p.id, p.resume, ...Object.values(p.specs), ...p.usages].join(' ')
    );
    INDEX.set(p, t);
  }
  return t;
}

/**
 * Filtre unique du catalogue. Tous les critères sont facultatifs et se
 * combinent en ET, sauf `marques` et `usages` qui sont des OU internes.
 *
 * @param {object} critere
 * @param {string}   [critere.q]        recherche libre
 * @param {string}   [critere.cat]      code catégorie
 * @param {string}   [critere.sous]     code sous-catégorie
 * @param {string[]} [critere.marques]
 * @param {string[]} [critere.usages]
 * @param {string}   [critere.etat]     'neuf' | 'reconditionne'
 * @param {string}   [critere.partenaire] code point de vente
 * @param {number}   [critere.prixMin]
 * @param {number}   [critere.prixMax]
 * @param {boolean}  [critere.promo]
 * @param {string}   [critere.tri]      voir TRIS
 */
export function filtrer(critere = {}) {
  const { q, cat, sous, marques, usages, etat, partenaire, prixMin, prixMax, promo, tri } = critere;

  /* La recherche est tolérante aux accents et acceptée mot à mot : « hp 16 go »
     doit trouver la machine même si les termes sont éloignés dans la fiche. */
  const mots = q ? sansAccent(q).split(/\s+/).filter(Boolean) : null;

  let liste = source.filter((p) => {
    if (cat && p.cat !== cat) return false;
    if (sous && p.sous !== sous) return false;
    if (etat && p.etat !== etat) return false;
    if (promo && !p.prixBarre) return false;
    if (marques?.length && !marques.includes(p.marque)) return false;
    if (usages?.length && !usages.some((u) => p.usages.includes(u))) return false;
    if (partenaire && !(p.dispo[partenaire] > 0)) return false;
    if (prixMin != null && p.prix < prixMin) return false;
    if (prixMax != null && p.prix > prixMax) return false;
    if (mots) {
      const t = texteDe(p);
      if (!mots.every((m) => t.includes(m))) return false;
    }
    return true;
  });

  return trier(liste, tri);
}

export const TRIS = {
  pertinence: { nom: 'Pertinence' },
  'prix-asc': { nom: 'Prix croissant' },
  'prix-desc': { nom: 'Prix décroissant' },
  nouveaute: { nom: 'Nouveautés' },
  nom: { nom: 'Nom (A → Z)' },
};

/* Ordre par défaut : les recommandations d'abord, puis les nouveautés et les
   promotions. C'est l'ordre éditorial voulu par Dilitech — le conseil passe
   avant le prix. */
const POIDS_TAG = { best: 0, nouveau: 1, promo: 2 };

function trier(liste, tri = 'pertinence') {
  const copie = [...liste];
  switch (tri) {
    case 'prix-asc':  return copie.sort((a, b) => a.prix - b.prix);
    case 'prix-desc': return copie.sort((a, b) => b.prix - a.prix);
    case 'nom':       return copie.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    case 'nouveaute':
      return copie.sort(
        (a, b) => (a.tag === 'nouveau' ? 0 : 1) - (b.tag === 'nouveau' ? 0 : 1) || b.prix - a.prix
      );
    default:
      return copie.sort(
        (a, b) =>
          (POIDS_TAG[a.tag] ?? 9) - (POIDS_TAG[b.tag] ?? 9) ||
          b.stockTotal - a.stockTotal ||
          a.nom.localeCompare(b.nom, 'fr')
      );
  }
}

/* --- sélections éditoriales ------------------------------------------- */

export const promotions = () => source.filter((p) => p.prixBarre);
export const nouveautes = () => source.filter((p) => p.tag === 'nouveau');
export const recommandes = () => source.filter((p) => p.tag === 'best');

/** Produits proches : même sous-catégorie d'abord, puis même catégorie. */
export function similaires(produit, n = 4) {
  const memeSous = source.filter((p) => p.id !== produit.id && p.sous === produit.sous);
  const memeCat = source.filter(
    (p) => p.id !== produit.id && p.cat === produit.cat && p.sous !== produit.sous
  );
  /* On ordonne par proximité de prix : le visiteur compare d'abord dans sa
     tranche de budget. */
  const proximite = (a, b) => Math.abs(a.prix - produit.prix) - Math.abs(b.prix - produit.prix);
  return [...memeSous.sort(proximite), ...memeCat.sort(proximite)].slice(0, n);
}

/* --- comptages pour l'interface --------------------------------------- */

/** Nombre de produits par sous-catégorie, pour les compteurs des filtres. */
export function comptesParSous(critereSansSous = {}) {
  const liste = filtrer({ ...critereSansSous, sous: undefined });
  const groupes = grouperPar(liste, (p) => p.sous);
  return Object.fromEntries(Object.entries(groupes).map(([k, v]) => [k, v.length]));
}

export function comptesParMarque(critereSansMarque = {}) {
  const liste = filtrer({ ...critereSansMarque, marques: undefined });
  const groupes = grouperPar(liste, (p) => p.marque);
  return Object.fromEntries(Object.entries(groupes).map(([k, v]) => [k, v.length]));
}

/** Bornes de prix réelles du catalogue courant — alimente le curseur. */
export function bornesPrix(liste = source) {
  if (!liste.length) return { min: 0, max: 0 };
  const prix = liste.map((p) => p.prix);
  return { min: Math.min(...prix), max: Math.max(...prix) };
}

/** Statistiques affichées sur la page d'accueil. */
export function statistiques() {
  return {
    references: source.length,
    marques: MARQUES.length,
    categories: CATEGORIES.length,
    villes: new Set(source.flatMap((p) => Object.keys(p.dispo))).size,
  };
}
