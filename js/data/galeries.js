/* =========================================================================
   DILITECH — galeries photo des fiches produit
   -------------------------------------------------------------------------
   Le client veut plusieurs photos par ordinateur. Les photos disponibles
   sont celles prises à la boutique de Torokorobougou (assets/originaux/),
   pas un shooting par modèle : chaque fiche montre donc la photo principale
   du produit, puis les autres vues de la même marque, puis la boutique.
   La fiche le dit (« photos de la gamme, prises en boutique »).

   Le jour où le client fournit les photos d'un modèle précis, il suffit de
   renseigner `galerie: [...]` sur le produit dans produits.js : elle passe
   devant tout le reste.
   ========================================================================= */

const G = 'assets/img/produits/galerie/';

/** Autres vues par marque (même famille de machines, photos de la boutique). */
const PAR_MARQUE = {
  HP:     ['hp-ouvert', 'hp-ferme'],
  Lenovo: ['lenovo-ecran', 'lenovo-clavier', 'lenovo-ferme', 'lenovo-demarrage', 'lenovo-carton'],
  Apple:  ['apple-chargeur', 'apple-empiles'],
  Dell:   ['dell-ferme'],
};

/** La boutique, en fin de galerie pour tout le monde : « il est chez nous ». */
const BOUTIQUE = ['boutique-vitrine', 'boutique-etageres'];

/* Photo principale d'un produit → la vue de galerie tirée de la MÊME photo
   d'origine : on ne la montre pas deux fois. */
const MEME_PHOTO = {
  'hp-elitebook-840': 'hp-ouvert', 'hp-probook': 'hp-ferme', 'hp-250': 'hp-ferme',
  'thinkpad-t14': 'lenovo-ecran', 'lenovo-legion': 'lenovo-ecran', 'lenovo-ideapad': 'lenovo-demarrage',
  'macbook-air': 'apple-chargeur', 'macbook-pro': 'apple-empiles',
  'dell-latitude': 'dell-ferme', 'dell-precision': 'dell-ferme',
};

const MAX = 6;

/**
 * Les photos d'un produit, principale d'abord, sans doublon.
 * Accessoires et réseau : seulement leur photo s'ils en ont une.
 */
export function galerieDe(p) {
  const liste = [
    ...(p.galerie ?? []),
    p.img,
    /* Postes fixes : les vues de marque sont des portables — trompeur. */
    ...(p.cat === 'ordinateurs' && p.sous !== 'bureau' ? (PAR_MARQUE[p.marque] ?? []).map((n) => `${G}${n}.jpg`) : []),
    ...(p.cat === 'ordinateurs' ? BOUTIQUE.map((n) => `${G}${n}.jpg`) : []),
  ].filter(Boolean);
  /* Même photo sous deux chemins (la principale est souvent aussi une vue
     de marque) : on compare le sujet, pas seulement le chemin. */
  const vus = new Set();
  return liste.filter((src) => {
    const nom = src.split('/').pop().replace(/\.jpg$/, '');
    const cle = MEME_PHOTO[nom] ?? nom;
    if (vus.has(src) || vus.has(cle)) return false;
    vus.add(src); vus.add(cle);
    return true;
  }).slice(0, MAX);
}
