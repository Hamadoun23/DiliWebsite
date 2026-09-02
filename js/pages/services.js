/* =========================================================================
   DILITECH — page Services
   -------------------------------------------------------------------------
   Le contenu rédactionnel est dans le HTML (le client doit pouvoir le
   corriger sans toucher au JavaScript). Ce module ne fait que deux choses :
   poser les illustrations des blocs et monter la liste des filières de
   formation.

   Les filières viennent des visuels de communication de Dilitech
   (publication « Découvrez nos filières de formations professionnelles »).
   ========================================================================= */

import './commun.js';

import { illustration } from '../data/illustrations.js';
import { $$, esc, rendre } from '../core/dom.js';
import { icone } from '../core/icones.js';
import { activerReveal } from '../core/ui.js';

/* --- illustrations des blocs ------------------------------------------- */

for (const n of $$('[data-illus]')) {
  n.innerHTML = illustration(n.dataset.illus);
}

/* --- filières de formation ---------------------------------------------- */

const FILIERES = [
  {
    ic: 'clavierIc', nom: 'Informatique bureautique',
    txt: "Word, Excel, PowerPoint et les usages du poste de travail. Le socle qui manque le plus souvent en entreprise.",
  },
  {
    ic: 'etoile', nom: 'Analyse de données',
    txt: "Tableurs avancés, tableaux croisés, tableaux de bord et restitution avec Power BI.",
  },
  {
    ic: 'devis', nom: 'Programmation',
    txt: "Bases de l'algorithmique et développement d'applications, pour débuter ou se reconvertir.",
  },
  {
    ic: 'bouclier', nom: 'Cybersécurité',
    txt: "Hygiène numérique, protection des postes et des données, réaction en cas d'incident.",
  },
  {
    ic: 'boite', nom: 'Gestion de projet',
    txt: "Cadrage, planification, suivi et pilotage budgétaire d'un projet, méthodes classiques et agiles.",
  },
  {
    ic: 'etincelle', nom: 'Finance',
    txt: "Lecture des états financiers, gestion budgétaire et analyse de la rentabilité.",
  },
  {
    ic: 'diplome', nom: 'Droit',
    txt: "Notions juridiques appliquées à la vie de l'entreprise et aux relations contractuelles.",
  },
];

rendre(
  '[data-filieres]',
  FILIERES.map(
    (f) => `
    <article class="filiere reveal">
      <span class="filiere__ic">${icone(f.ic)}</span>
      <div>
        <h3>${esc(f.nom)}</h3>
        <p>${esc(f.txt)}</p>
      </div>
    </article>`
  ).join('')
);

activerReveal();
