/* =========================================================================
   DILITECH — ce que le visiteur nous a dit de lui et de son usage
   -------------------------------------------------------------------------
   La vision de Dilitech : on part de l'usage, jamais de la fiche technique.
   Ce module garde en mémoire les réponses données au « concierge » (les
   petites cartes qui apparaissent au fil de la visite, voir
   js/components/concierge.js) ou aux puces de la section « sélection ».

   Même magasin que la sélection de devis (creerStore : localStorage +
   synchro entre onglets). Seule donnée personnelle : le prénom, facultatif,
   qui ne sert qu'à accueillir le visiteur et à signer sa demande de devis ;
   il reste dans son navigateur tant qu'il n'envoie rien.

   Les réponses servent à :
     — l'onglet « Pour vous » de la sélection (pourVous) ;
     — le bloc « Besoin exprimé » du message de devis (lignesBesoin) ;
     — la suggestion de filtre du catalogue ;
     — l'accueil personnalisé (« Bon retour, Awa »).
   ========================================================================= */

import { creerStore } from './store.js';
import * as cat from './catalogue.js';

/* --- le métier -----------------------------------------------------------
   Ce que le visiteur fait de ses journées dit souvent mieux son besoin que
   la liste des usages : un monteur vidéo n'achète pas comme un comptable.
   Chaque métier pré-coche des usages à la question suivante (`usages`) et
   favorise les familles de matériel qui lui servent vraiment (`sous`). */
export const METIERS = [
  { code: 'etudiant',    nom: 'Étudiant·e',                   usages: ['etudes'],                    sous: ['portables-etudes'] },
  { code: 'developpeur', nom: 'Développeur, informaticien',   usages: ['professionnel', 'creation'], sous: ['portables-creation', 'bureau', 'ecrans'] },
  { code: 'graphiste',   nom: 'Graphiste, designer',          usages: ['creation'],                  sous: ['portables-creation', 'ecrans', 'bureau'] },
  { code: 'video',       nom: 'Monteur vidéo, vidéaste',      usages: ['creation'],                  sous: ['portables-creation', 'stockage', 'bureau', 'audio'] },
  { code: 'architecte',  nom: 'Architecte, ingénieur BTP',    usages: ['creation', 'professionnel'], sous: ['portables-creation', 'bureau', 'ecrans'] },
  { code: 'gestion',     nom: 'Comptable, gestionnaire',      usages: ['bureautique', 'professionnel'], sous: ['portables-pro', 'ecrans'] },
  { code: 'enseignant',  nom: 'Enseignant, formateur',        usages: ['bureautique', 'etudes'],     sous: ['portables-etudes', 'audio'] },
  { code: 'commercial',  nom: 'Commercial, métier de terrain', usages: ['professionnel', 'mobilite'], sous: ['portables-pro', 'mobilite'] },
  { code: 'dirigeant',   nom: 'Dirigeant, entrepreneur',      usages: ['professionnel', 'entreprise'], sous: ['portables-pro'] },
  { code: 'joueur',      nom: 'Joueur, streamer',             usages: ['gaming'],                    sous: ['portables-creation', 'audio'] },
  { code: 'autre',       nom: 'Autre',                        usages: [],                            sous: [] },
];
const metierDe = (code) => METIERS.find((m) => m.code === code) ?? null;

/* --- les sept questions, en deux parties -----------------------------------
   Partie 1 (tôt dans la visite) : faire connaissance et cerner l'usage.
   Partie 2 (plus loin) : affiner. Pas de budget (choix du client).
   Ajouter une question : l'ajouter ici (+ CODES/valider si c'est un choix),
   la placer dans PARTIES, lui donner un poids dans scoreProduit() et une
   ligne dans lignesBesoin(). */
export const QUESTIONS = {
  prenom: {
    type: 'texte',
    titre: 'Comment doit-on vous appeler ?',
    aide: 'Votre prénom, pour vous accueillir comme il se doit. Facultatif.',
  },
  metier: {
    titre: 'Quel est votre métier ?',
    aide: 'Un monteur vidéo n’a pas les mêmes besoins qu’un comptable.',
    libre: 'Autre métier ? Précisez-le ici',
    options: METIERS.map((m) => ({ code: m.code, nom: m.nom })),
  },
  usages: {
    titre: 'Qu’allez-vous principalement faire avec votre matériel ?',
    aide: 'Plusieurs réponses possibles — c’est ce qui guide tout le reste.',
    multiple: true,
    options: cat.USAGES.map((u) => ({ code: u.code, nom: u.nom })),
  },
  lieu: {
    titre: 'Où allez-vous surtout vous en servir ?',
    aide: 'Autonomie, poids, robustesse : ça change tout.',
    options: [
      { code: 'poste', nom: 'Au bureau ou à la maison' },
      { code: 'terrain', nom: 'En déplacement, sur le terrain' },
      { code: 'cours', nom: 'En cours, à l’école' },
    ],
  },
  postes: {
    titre: 'Combien de personnes vont l’utiliser ?',
    aide: 'Un poste ou une équipe entière : on ne conseille pas la même chose.',
    options: [
      { code: 'seul', nom: 'Moi seul' },
      { code: 'quelques', nom: 'Quelques postes' },
      { code: 'equipe', nom: 'Toute une équipe' },
    ],
  },
  priorites: {
    titre: 'Qu’est-ce qui compte le plus pour vous ?',
    aide: 'Deux choix au plus — ce sont vos arbitrages qui nous guident.',
    multiple: true,
    max: 2,
    options: [
      { code: 'autonomie', nom: 'L’autonomie' },
      { code: 'legerete',  nom: 'La légèreté' },
      { code: 'puissance', nom: 'La puissance' },
      { code: 'solidite',  nom: 'La solidité, la durée' },
      { code: 'economie',  nom: 'Payer le juste prix' },
    ],
  },
  etat: {
    titre: 'Neuf ou reconditionné ?',
    aide: 'Nos reconditionnés sont testés en atelier et garantis.',
    options: [
      { code: 'neuf', nom: 'Neuf' },
      { code: 'reconditionne', nom: 'Reconditionné' },
      { code: 'indifferent', nom: 'Peu importe, conseillez-moi' },
    ],
  },
};

export const PARTIES = {
  1: ['prenom', 'metier', 'usages', 'lieu'],
  2: ['postes', 'priorites', 'etat'],
};
export const TOUTES = [...PARTIES[1], ...PARTIES[2]];

const MULTIPLES = new Set(['usages', 'priorites']);

const INITIAL = {
  prenom: '',
  metier: null,
  metierLibre: '',          // quand metier === 'autre'
  usages: [],
  lieu: null,
  postes: null,
  priorites: [],
  etat: null,
  /* --- tenue du concierge --- */
  visites: 0,
  accueilVu: false,
  silence: false,            // « Ne plus me demander »
};

const CODES = Object.fromEntries(
  Object.entries(QUESTIONS)
    .filter(([, q]) => q.options)
    .map(([k, q]) => [k, new Set(q.options.map((o) => o.code))])
);

const nettoyerPrenom = (v) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, 40);
const nettoyerLibre = (v) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);

/** L'état relu est nettoyé : un code inconnu (version antérieure) disparaît. */
function valider(relu) {
  if (!relu || typeof relu !== 'object') return null;
  const liste = (k) => (Array.isArray(relu[k]) ? relu[k].filter((x) => CODES[k].has(x)) : []);
  const un = (k) => (CODES[k].has(relu[k]) ? relu[k] : null);
  return {
    ...INITIAL,
    prenom: nettoyerPrenom(relu.prenom),
    metier: un('metier'),
    metierLibre: un('metier') === 'autre' ? nettoyerLibre(relu.metierLibre) : '',
    usages: liste('usages'),
    lieu: un('lieu'),
    postes: un('postes'),
    priorites: liste('priorites').slice(0, QUESTIONS.priorites.max),
    etat: un('etat'),
    visites: Number.isFinite(relu.visites) ? relu.visites : 0,
    accueilVu: !!relu.accueilVu,
    silence: !!relu.silence,
  };
}

const store = creerStore(INITIAL, { cle: 'dt-profil', canal: 'dt-profil-sync', valider });

export const abonner = store.abonner;
export const etat = () => store.etat;

/* Une visite = une session d'onglet, comptée une seule fois. */
try {
  if (!sessionStorage.getItem('dt-visite')) {
    sessionStorage.setItem('dt-visite', '1');
    store.transaction((e) => { e.visites += 1; });
  }
} catch { /* stockage indisponible : on compte zéro visite, rien ne casse */ }

/* --- lecture ------------------------------------------------------------ */

export const estMultiple = (q) => MULTIPLES.has(q);

export function valeur(q) {
  const v = store.etat[q];
  return Array.isArray(v) ? [...v] : v;
}

export const aRepondu = (q) => {
  const v = store.etat[q];
  return Array.isArray(v) ? v.length > 0 : !!v;
};

export const prenom = () => store.etat.prenom;

/** « Pour vous » n'a de sens qu'une fois l'usage connu : c'est lui qui
    qualifie les produits, le reste ne fait que départager. */
export const estVide = () => store.etat.usages.length === 0;

const nomDe = (q, code) => QUESTIONS[q].options.find((o) => o.code === code)?.nom ?? code;

/** « Graphiste, designer », ou le métier saisi à la main. */
export function nomMetier() {
  const e = store.etat;
  if (e.metier === 'autre') return e.metierLibre;
  return e.metier ? nomDe('metier', e.metier) : '';
}

/** Usages que le métier laisse deviner — pré-cochés à la question suivante. */
export const usagesSuggeres = () => metierDe(store.etat.metier)?.usages ?? [];

/** Morceaux lisibles : « Bureautique », « en déplacement »… */
export function morceaux() {
  const e = store.etat;
  const out = [];
  /* « graphiste », « monteur vidéo » : le premier mot du libellé suffit
     dans une phrase (« Pensé pour : graphiste, création… »). */
  if (e.metier && e.metier !== 'autre') out.push(nomDe('metier', e.metier).split(',')[0].toLowerCase());
  if (e.metier === 'autre' && e.metierLibre) out.push(e.metierLibre.toLowerCase());
  out.push(...e.usages.map((u) => nomDe('usages', u)));
  if (e.lieu === 'terrain') out.push('en déplacement');
  if (e.lieu === 'cours') out.push('en cours');
  if (e.lieu === 'poste') out.push('au bureau ou à la maison');
  if (e.postes === 'quelques') out.push('pour quelques postes');
  if (e.postes === 'equipe') out.push('pour toute une équipe');
  if (e.postes === 'seul') out.push('pour vous seul');
  return out;
}

/** « bureautique, en déplacement et pour quelques postes » */
export function resume() {
  const m = morceaux().map((x, i) => (i === 0 ? x : x.charAt(0).toLowerCase() + x.slice(1)));
  if (m.length <= 1) return m.join('');
  return `${m.slice(0, -1).join(', ')} et ${m.at(-1)}`;
}

/** Lignes du bloc « Besoin exprimé » du message de devis. */
export function lignesBesoin() {
  const e = store.etat;
  const out = [];
  if (e.prenom) out.push(`Prénom : ${e.prenom}`);
  if (nomMetier()) out.push(`Métier : ${nomMetier()}`);
  if (e.usages.length) out.push(`Usage : ${e.usages.map((u) => nomDe('usages', u)).join(', ')}`);
  if (e.lieu) out.push(`Utilisation : ${nomDe('lieu', e.lieu)}`);
  if (e.postes) out.push(`Pour : ${nomDe('postes', e.postes)}`);
  if (e.priorites.length) out.push(`Priorités : ${e.priorites.map((u) => nomDe('priorites', u)).join(', ')}`);
  if (e.etat) out.push(`Neuf / reconditionné : ${nomDe('etat', e.etat)}`);
  return out;
}

/* --- correspondance produit ↔ réponses --------------------------------- */

/* Ce qui ne quitte pas un bureau : pénalisé quand l'usage est « terrain ». */
const SEDENTAIRE = new Set(['ecrans', 'bureau', 'impression', 'commutation', 'cablage']);

/** 0 = rien à voir avec ce qui a été dit ; plus c'est haut, mieux ça colle. */
export function scoreProduit(p) {
  const e = store.etat;
  let s = 0;
  for (const u of e.usages) if (p.usages.includes(u)) s += 3;
  if (s === 0) return 0;   // les bonus ci-dessous départagent, ils ne qualifient pas
  if (e.lieu === 'terrain') s += p.usages.includes('mobilite') ? 2 : SEDENTAIRE.has(p.sous) ? -4 : 0;
  if (e.lieu === 'cours' && p.usages.includes('etudes')) s += 2;
  if (e.lieu === 'poste' && p.usages.includes('bureautique')) s += 1;
  if ((e.postes === 'quelques' || e.postes === 'equipe') && p.usages.includes('entreprise')) s += 2;
  if (e.postes === 'equipe' && p.cat === 'reseau') s += 1;
  if (metierDe(e.metier)?.sous.includes(p.sous)) s += 2;
  for (const pr of e.priorites) {
    if ((pr === 'autonomie' || pr === 'legerete') && p.usages.includes('mobilite')) s += 2;
    if (pr === 'legerete' && SEDENTAIRE.has(p.sous)) s -= 2;
    if (pr === 'puissance' && (p.usages.includes('creation') || p.usages.includes('gaming'))) s += 2;
    if (pr === 'solidite' && (p.usages.includes('professionnel') || p.usages.includes('entreprise'))) s += 1;
    if (pr === 'economie' && (p.etat === 'reconditionne' || p.prix <= 400000)) s += 2;
  }
  if (e.etat === 'neuf' && p.etat === 'neuf') s += 1;
  if (e.etat === 'reconditionne') s += p.etat === 'reconditionne' ? 3 : 0;
  /* Qui parle de son usage cherche d'abord une machine : les ordinateurs
     passent devant les accessoires à correspondance égale. */
  if (p.cat === 'ordinateurs') s += 1;
  return Math.max(s, 0);
}

/**
 * Les produits qui correspondent aux réponses, les mieux assortis d'abord ;
 * à score égal, l'ordre éditorial du catalogue (« Notre choix », stock…).
 */
export function pourVous(n = 8) {
  if (estVide()) return [];
  const ordre = cat.filtrer({ tri: 'pertinence' });
  return ordre
    .map((p, i) => ({ p, i, s: scoreProduit(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map((x) => x.p);
}

/* --- écriture ------------------------------------------------------------ */

export function repondre(q, v, libre = '') {
  store.transaction((e) => {
    if (q === 'metier') {
      e.metier = CODES.metier.has(v) ? v : null;
      e.metierLibre = e.metier === 'autre' ? nettoyerLibre(libre) : '';
    } else if (QUESTIONS[q].type === 'texte') e[q] = nettoyerPrenom(v);
    else if (MULTIPLES.has(q)) {
      const propres = [...new Set(v)].filter((x) => CODES[q].has(x));
      e[q] = QUESTIONS[q].max ? propres.slice(0, QUESTIONS[q].max) : propres;
    } else e[q] = CODES[q].has(v) ? v : null;
  });
}

/** Ajoute/retire un usage (puces de la section sélection). */
export function basculerUsage(code) {
  const actuels = new Set(store.etat.usages);
  if (actuels.has(code)) actuels.delete(code);
  else actuels.add(code);
  repondre('usages', [...actuels]);
}

export function marquerAccueilVu() {
  store.transaction((e) => { e.accueilVu = true; });
}

export function taire() {
  store.transaction((e) => { e.silence = true; });
}

/** « Tout effacer » : toutes les réponses, prénom compris. */
export function effacerReponses() {
  store.transaction((e) => {
    e.prenom = '';
    e.metier = null;
    e.metierLibre = '';
    e.usages = [];
    e.lieu = null;
    e.postes = null;
    e.priorites = [];
    e.etat = null;
    e.silence = false;
  });
}
