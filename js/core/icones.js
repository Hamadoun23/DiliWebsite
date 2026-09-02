/* =========================================================================
   DILITECH — jeu d'icônes
   -------------------------------------------------------------------------
   Icônes au trait, dessinées sur une grille 24, épaisseur 1,7 — assez fine
   pour cohabiter avec Montserrat ExtraLight sans l'écraser. Les logos de
   réseaux sociaux sont pleins (`fill`), parce que c'est ainsi qu'ils sont
   reconnaissables.

   Aucune bibliothèque, aucune requête : le balisage est inséré tel quel.
   ========================================================================= */

const trait = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;

const plein = (d) =>
  `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${d}</svg>`;

export const ICONES = {
  /* --- navigation --- */
  menu:     trait('<path d="M3 6h18M3 12h18M3 18h18"/>'),
  fermer:   trait('<path d="M18 6 6 18M6 6l12 12"/>'),
  recherche: trait('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  chevronBas:    trait('<path d="m6 9 6 6 6-6"/>'),
  chevronDroite: trait('<path d="m9 6 6 6-6 6"/>'),
  chevronGauche: trait('<path d="m15 6-6 6 6 6"/>'),
  fleche:   trait('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  flecheHaut: trait('<path d="M12 19V5M6 11l6-6 6 6"/>'),

  /* --- actions --- */
  plus:     trait('<path d="M12 5v14M5 12h14"/>'),
  moins:    trait('<path d="M5 12h14"/>'),
  corbeille: trait('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>'),
  check:    trait('<path d="m4 12 5 5L20 6"/>'),
  copier:   trait('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
  filtre:   trait('<path d="M3 5h18M7 12h10M10 19h4"/>'),
  devis:    trait('<path d="M7 4h7l4 4v12H7z"/><path d="M14 4v4h4M10 13h5M10 16h5"/>'),
  telecharger: trait('<path d="M12 4v11M8 11l4 4 4-4M5 19h14"/>'),

  /* --- contact --- */
  telephone: trait('<path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6L16 13.5 21 15v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3z"/>'),
  mail:     trait('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
  broche:   trait('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
  horloge:  trait('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>'),

  /* --- métier --- */
  portable: trait('<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>'),
  reseau:   trait('<rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 14v-3h10v3M12 11V7"/><circle cx="12" cy="5" r="2"/>'),
  clavierIc: trait('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>'),
  outil:    trait('<path d="M15 4a5 5 0 0 0-6.6 6.4L4 14.8V20h5.2l4.4-4.4A5 5 0 0 0 20 9l-3 3-2-2 3-3a5 5 0 0 0-3-3z"/>'),
  bouclier: trait('<path d="M12 3 20 6v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  camion:   trait('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>'),
  casqueIc: trait('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="2"/><rect x="17.5" y="13" width="4" height="6" rx="2"/><path d="M17.5 19h-3a2 2 0 0 1-2 2H11"/>'),
  diplome:  trait('<path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>'),
  etincelle: trait('<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.3 6.3l3.5 3.5M14.2 14.2l3.5 3.5M17.7 6.3l-3.5 3.5M9.8 14.2l-3.5 3.5"/>'),
  batterie: trait('<rect x="2" y="8" width="17" height="8" rx="2"/><path d="M22 11v2M6 11v2M10 11v2"/>'),
  boite:    trait('<path d="M3 8 12 4l9 4v8l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v8"/>'),
  etoile:   trait('<path d="m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8z"/>'),

  /* --- réseaux sociaux (pleins) --- */
  whatsapp: plein('<path d="M12.04 2A9.9 9.9 0 0 0 3.6 17.1L2.05 22l5.03-1.5A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.13 15.06l-.3-.18-2.98.88.9-2.9-.2-.31A8.1 8.1 0 0 1 12.04 3.8zm-3.4 4.1c-.17 0-.45.06-.68.31-.24.25-.9.87-.9 2.13 0 1.25.92 2.47 1.05 2.64.13.17 1.8 2.86 4.44 3.9 2.2.87 2.65.7 3.13.65.48-.04 1.54-.62 1.76-1.23.22-.6.22-1.12.16-1.23-.07-.1-.24-.17-.5-.3-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.25-.67.85-.82 1.02-.15.18-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.29-.77-.68-1.29-1.53-1.44-1.79-.15-.25-.02-.39.11-.52.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.18.04-.33-.02-.46-.07-.13-.58-1.4-.8-1.92-.2-.5-.4-.43-.55-.44h-.48z"/>'),
  facebook: plein('<path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.3-.04-1.3-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.23H7.5V14h2.67v8z"/>'),
  instagram: plein('<path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.62.07 4.81s0 3.56-.07 4.81c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.25.06-1.62.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.56 2.2 15.19 2.2 12s0-3.56.07-4.81c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.44 2.2 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17C2.4 9.9 2.4 10.27 2.4 12s0 2.1.06 3.13c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.03.06-1.4.06-3.13s0-2.1-.06-3.13c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4C15.5 4.01 15.14 4 12 4zm0 3.03a4.97 4.97 0 1 1 0 9.94 4.97 4.97 0 0 1 0-9.94zm0 1.8a3.17 3.17 0 1 0 0 6.34 3.17 3.17 0 0 0 0-6.34zm5.18-3.24a1.16 1.16 0 1 1 0 2.32 1.16 1.16 0 0 1 0-2.32z"/>'),
  linkedin: plein('<path d="M6.94 8.5H3.6V21h3.34zM5.27 3a1.94 1.94 0 1 0 0 3.88 1.94 1.94 0 0 0 0-3.88zM21 21h-3.33v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.69-2.49 3.43V21H9.7V8.5h3.2v1.71h.04c.45-.84 1.53-1.73 3.15-1.73 3.37 0 3.99 2.22 3.99 5.1z"/>'),
};

/**
 * Rend une icône, avec une taille facultative.
 * `nom` inconnu → chaîne vide, plutôt qu'un carré vide dans la page.
 */
export function icone(nom, { classe = '', taille } = {}) {
  const svg = ICONES[nom];
  if (!svg) return '';
  const cls = `ic${classe ? ` ${classe}` : ''}`;
  const style = taille ? ` style="width:${taille}px;height:${taille}px"` : '';
  return `<span class="${cls}"${style}>${svg}</span>`;
}
