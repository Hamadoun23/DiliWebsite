/* =========================================================================
   DILITECH — illustrations d'appareils, dessinées en SVG
   -------------------------------------------------------------------------
   Le client n'a pas encore fourni de photothèque produit. Plutôt que de
   laisser des cadres vides ou de charger des images d'agence sans licence,
   chaque famille de matériel a ici son dessin au trait, dans les deux bleus
   de la charte. Le jour où une vraie photo arrive, il suffit de renseigner
   `img` sur le produit (js/data/produits.js) : la photo prend le dessus et
   le dessin devient le repli. Voir <product-figure>.

   Convention : viewBox 0 0 220 170, trait de 4, `currentColor` pour la
   structure et la classe `.il-a` pour les aplats en bleu clair.
   ========================================================================= */

const S = (body) =>
  `<svg viewBox="0 0 220 170" fill="none" stroke="currentColor" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ILLUSTRATIONS = {
  /* --- ordinateurs --------------------------------------------------- */
  portable: S(`
    <rect class="il-a" x="52" y="34" width="116" height="76" rx="5" fill="currentColor" stroke="none" opacity=".12"/>
    <rect x="52" y="34" width="116" height="76" rx="5"/>
    <path d="M64 46h58M64 58h40"/>
    <path d="M34 124h152l14 20H20z"/>
    <path d="M92 134h36"/>`),

  ultrabook: S(`
    <rect class="il-a" x="46" y="30" width="128" height="82" rx="8" fill="currentColor" stroke="none" opacity=".12"/>
    <rect x="46" y="30" width="128" height="82" rx="8"/>
    <circle class="il-a" cx="110" cy="71" r="17" stroke="currentColor"/>
    <path d="M30 126h160l12 18H18z"/>`),

  gamer: S(`
    <rect x="46" y="28" width="128" height="82" rx="6"/>
    <path class="il-a" d="M60 44h44M60 56h28" stroke="currentColor"/>
    <path d="M28 124h164l14 20H14z"/>
    <path class="il-a" d="M56 134h108" stroke="currentColor"/>
    <path d="M110 12v10M86 18l6 8M134 18l-6 8"/>`),

  bureau: S(`
    <rect x="62" y="20" width="70" height="128" rx="8"/>
    <circle class="il-a" cx="97" cy="42" r="7" fill="currentColor" stroke="none"/>
    <path d="M78 66h38M78 80h38M78 94h22"/>
    <rect x="148" y="60" width="52" height="60" rx="5"/>
    <path d="M160 132h28M174 120v12"/>`),

  ecran: S(`
    <rect class="il-a" x="26" y="26" width="168" height="98" rx="7" fill="currentColor" stroke="none" opacity=".12"/>
    <rect x="26" y="26" width="168" height="98" rx="7"/>
    <path d="M110 124v20M78 150h64"/>
    <path class="il-a" d="M48 96l30-34 24 26 20-16 30 40" stroke="currentColor"/>`),

  tablette: S(`
    <rect x="60" y="16" width="100" height="138" rx="12"/>
    <rect class="il-a" x="72" y="32" width="76" height="98" rx="4" fill="currentColor" stroke="none" opacity=".14"/>
    <path d="M100 142h20"/>`),

  /* --- accessoires ---------------------------------------------------- */
  souris: S(`
    <path d="M110 26c26 0 42 18 42 44v40c0 26-16 44-42 44s-42-18-42-44V70c0-26 16-44 42-44z"/>
    <path class="il-a" d="M110 34v36" stroke="currentColor"/>
    <path d="M68 70h84"/>`),

  clavier: S(`
    <rect x="18" y="48" width="184" height="76" rx="8"/>
    <path d="M36 68h12M60 68h12M84 68h12M108 68h12M132 68h12M156 68h12M180 68h4"/>
    <path d="M36 88h12M60 88h12M84 88h12M108 88h12M132 88h12M156 88h28"/>
    <path class="il-a" d="M70 108h80" stroke="currentColor"/>`),

  casque: S(`
    <path d="M46 100V88a64 64 0 0 1 128 0v12"/>
    <rect x="30" y="96" width="30" height="46" rx="12"/>
    <rect x="160" y="96" width="30" height="46" rx="12"/>
    <path class="il-a" d="M160 132h-16a14 14 0 0 0-14 14h-14" stroke="currentColor"/>`),

  stockage: S(`
    <rect x="34" y="46" width="152" height="80" rx="8"/>
    <circle cx="110" cy="86" r="26"/>
    <circle class="il-a" cx="110" cy="86" r="7" fill="currentColor" stroke="none"/>
    <path d="M158 62h12"/>`),

  memoire: S(`
    <rect x="20" y="56" width="180" height="56" rx="5"/>
    <path d="M40 56v56M64 56v56M88 56v56M112 56v56M136 56v56M160 56v56M184 56v56"/>
    <path class="il-a" d="M20 112h180" stroke="currentColor" stroke-width="6"/>`),

  chargeur: S(`
    <rect x="30" y="52" width="76" height="66" rx="10"/>
    <path d="M106 85h34a26 26 0 0 1 26 26v18"/>
    <path d="M152 129h28M158 129v14M174 129v14"/>
    <path class="il-a" d="M56 74l14 22h-14l14 22" stroke="currentColor"/>`),

  sacoche: S(`
    <path d="M32 66h156l-12 84H44z"/>
    <path d="M78 66V44a32 32 0 0 1 64 0v22"/>
    <path class="il-a" d="M72 104h76" stroke="currentColor"/>`),

  imprimante: S(`
    <path d="M62 62V26h96v36"/>
    <rect x="30" y="62" width="160" height="56" rx="8"/>
    <circle class="il-a" cx="164" cy="82" r="6" fill="currentColor" stroke="none"/>
    <path d="M62 108h96v42H62z"/>`),

  onduleur: S(`
    <rect x="52" y="24" width="116" height="126" rx="10"/>
    <rect class="il-a" x="70" y="44" width="80" height="30" rx="4" fill="currentColor" stroke="none" opacity=".16"/>
    <path class="il-a" d="M112 92l-14 24h24l-14 24" stroke="currentColor"/>
    <path d="M70 44h80v30H70z"/>`),

  /* --- réseau ---------------------------------------------------------- */
  routeur: S(`
    <rect x="30" y="94" width="160" height="46" rx="9"/>
    <path d="M64 94V32M110 94V22M156 94V32"/>
    <circle class="il-a" cx="60" cy="117" r="5" fill="currentColor" stroke="none"/>
    <circle class="il-a" cx="80" cy="117" r="5" fill="currentColor" stroke="none"/>
    <path d="M120 117h50"/>`),

  switch: S(`
    <rect x="16" y="66" width="188" height="52" rx="7"/>
    <path d="M40 92h12M60 92h12M80 92h12M100 92h12M120 92h12M140 92h12M160 92h12"/>
    <circle class="il-a" cx="188" cy="80" r="5" fill="currentColor" stroke="none"/>`),

  borne: S(`
    <circle cx="110" cy="112" r="30"/>
    <circle class="il-a" cx="110" cy="112" r="9" fill="currentColor" stroke="none"/>
    <path class="il-a" d="M74 70a50 50 0 0 1 72 0" stroke="currentColor"/>
    <path d="M56 46a76 76 0 0 1 108 0"/>`),

  camera: S(`
    <path d="M34 62h96a18 18 0 0 1 18 18v26a18 18 0 0 1-18 18H34z"/>
    <path d="M148 84l40-22v58l-40-22z"/>
    <circle class="il-a" cx="70" cy="93" r="12" stroke="currentColor"/>
    <path d="M84 140v14M104 154H64"/>`),

  cable: S(`
    <path d="M40 40v34h36V40z"/>
    <path d="M46 40V26h24v14"/>
    <path d="M58 74c0 44 104 12 104 56"/>
    <path class="il-a" d="M144 130h36v34h-36z" stroke="currentColor"/>
    <path d="M150 164v12h24v-12"/>`),

  baie: S(`
    <rect x="46" y="18" width="128" height="134" rx="8"/>
    <path d="M62 44h96M62 70h96M62 96h96M62 122h96"/>
    <circle class="il-a" cx="150" cy="44" r="4" fill="currentColor" stroke="none"/>
    <circle class="il-a" cx="150" cy="70" r="4" fill="currentColor" stroke="none"/>`),

  /* --- repli ----------------------------------------------------------- */
  materiel: S(`
    <rect x="40" y="40" width="140" height="90" rx="10"/>
    <path class="il-a" d="M66 70h60M66 92h34" stroke="currentColor"/>`),
};

/** Renvoie le dessin d'une famille, avec repli silencieux. */
export const illustration = (key) => ILLUSTRATIONS[key] ?? ILLUSTRATIONS.materiel;
