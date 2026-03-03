// TEMPLATES is the SINGLE SOURCE OF TRUTH for template IDs.
// To add a new template: just add an entry here. Type + Zod schema derive automatically.

import type { CategoryId } from '@/lib/mock-cv-profiles';

export const TEMPLATES = [
  { 
    id: 'professional', 
    name: 'Classique Épuré', 
    description: 'Tout blanc, élégant. Banques/Assurances.', 
    color: 'bg-white border text-slate-900',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Administration', professionnel: 'Manager IT', reconversion: 'Nouveau Départ - Comptabilité' },
  },
  { 
    id: 'modern', 
    name: 'Moderne', 
    description: 'Sidebar sombre, idéal pour la Tech.', 
    color: 'bg-slate-900',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Génie Logiciel', professionnel: 'Développeur Full-Stack Senior', reconversion: 'Transition Tech - Développeur' },
  },  
  { 
    id: 'ats', 
    name: 'Compatible ATS', 
    description: 'Optimisé pour robots recruteurs.', 
    color: 'bg-white border-2 border-black text-black font-serif',
    categories: ['etudiant', 'professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Data Science', professionnel: 'Chef de Projet Digital', reconversion: 'Transition Tech - Support' },
  },
  { 
    id: 'ats-glacier', 
    name: 'Glacier (ATS)', 
    description: 'Design épuré et vertical. Profils Seniors.', 
    color: 'bg-white text-slate-800 border',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage M2 - Architecture', professionnel: 'Architecte Solutions Cloud', reconversion: 'Reconversion - Consultant' },
  },
  { 
    id: 'ats-iron', 
    name: 'Iron (ATS)', 
    description: 'Structure forte, Serif. Finance/Légal.', 
    color: 'bg-white text-black border-4 border-double border-slate-200',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Finance', professionnel: 'Directeur Financier', reconversion: 'Reconversion - Audit' },
  },
  { 
    id: 'creative', 
    name: 'Créatif', 
    description: 'Accents audacieux. Marketing/Design.', 
    color: 'bg-indigo-600 text-white',
    categories: ['etudiant', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - UX Design', professionnel: 'Directeur Artistique', reconversion: 'Reconversion - Designer Graphique' },
  },
  { 
    id: 'executive', 
    name: 'Exécutif', 
    description: 'Sérieux, police Serif. Pour Managers/Avocats.', 
    color: 'bg-[#f8f8f8] border-t-4 border-black text-black',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Management', professionnel: 'Directeur Commercial', reconversion: 'Reconversion - Conseil RH' },
  },
  { 
    id: 'tech', 
    name: 'Tech Expert', 
    description: 'Terminal style. Développeurs.', 
    color: 'bg-[#1e1e1e] text-green-400 font-mono',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - DevOps', professionnel: 'DevOps Engineer Senior', reconversion: 'Reconversion - Développeur Backend' },
  },
  { 
    id: 'minimalist', 
    name: 'Minimaliste', 
    description: 'Ultra-épuré, élégant. Tous secteurs.', 
    color: 'bg-white border text-slate-700',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Premier Emploi - Marketing', professionnel: 'Product Manager', reconversion: 'Reconversion - Marketing' },
  },
  { 
    id: 'elegant-photo', 
    name: 'Élégant Photo', 
    description: 'Deux colonnes, photo ronde, sidebar droite. Polyvalent.', 
    color: 'bg-white border-l-4 border-slate-300 text-slate-800',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Communication', professionnel: 'Responsable Communication', reconversion: 'Reconversion - RP' },
  },
  { 
    id: 'corporate-blue', 
    name: 'Corporate Blue', 
    description: 'Sidebar bleu foncé, compétences en points. Pro.', 
    color: 'bg-[#1e3a5f] text-white',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Conseil', professionnel: 'Consultant Senior', reconversion: 'Reconversion - Gestion' },
  },
  { 
    id: 'clean-grid', 
    name: 'Grille Épurée', 
    description: 'Single-column, grille 2 colonnes. Classique.', 
    color: 'bg-white border text-slate-800',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Informatique', professionnel: 'Ingénieur Logiciel', reconversion: 'Reconversion - Analyste' },
  },
  { 
    id: 'swiss', 
    name: 'Swiss', 
    description: 'Design suisse, typographie nette. Universel.', 
    color: 'bg-white border-t-4 border-red-500 text-slate-900',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Ingénierie', professionnel: 'Manager IT', reconversion: 'Reconversion - IT' },
  },
  { 
    id: 'gradient', 
    name: 'Gradient', 
    description: 'Header dégradé moderne. Startups/Tech.', 
    color: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Startup', professionnel: 'CTO / VP Engineering', reconversion: 'Reconversion - Product' },
  },
  { 
    id: 'timeline', 
    name: 'Timeline Pro', 
    description: 'Frise chronologique verticale. Carrières longues.', 
    color: 'bg-white border-l-4 border-blue-500 text-slate-800',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Parcours Académique', professionnel: 'Directeur de Programmes', reconversion: 'Reconversion - Chef de Projet' },
  },
  { 
    id: 'compact', 
    name: 'Compact', 
    description: 'Dense, optimisé 1 page. Juniors/Stages.', 
    color: 'bg-slate-50 border text-slate-700',
    categories: ['etudiant'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Génie Logiciel', professionnel: 'Développeur Junior', reconversion: 'Reconversion - Support' },
  },
  { 
    id: 'bold-header', 
    name: 'Bold Header', 
    description: 'Header XXL coloré. Impact visuel fort.', 
    color: 'bg-emerald-700 text-white',
    categories: ['etudiant', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Premier Emploi - Marketing', professionnel: 'Brand Manager', reconversion: 'Nouveau Départ - Data Analyst' },
  },
  { 
    id: 'two-tone', 
    name: 'Two-Tone', 
    description: 'Split horizontal bicolore. Design/Marketing.', 
    color: 'bg-amber-600 text-white',
    categories: ['reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Design', professionnel: 'Designer Senior', reconversion: 'Reconversion - Designer UX' },
  },
  { 
    id: 'infographic', 
    name: 'Infographie', 
    description: 'Barres et cercles visuels. Digital/Créatif.', 
    color: 'bg-teal-600 text-white',
    categories: ['reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Data Viz', professionnel: 'Data Analyst Senior', reconversion: 'Reconversion - Web Designer' },
  },
  { 
    id: 'classic-serif', 
    name: 'Classic Serif', 
    description: 'Police Serif, académique. Droit/Finance.', 
    color: 'bg-[#faf8f5] border-2 border-amber-900 text-amber-900',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Droit', professionnel: 'Avocat Senior', reconversion: 'Reconversion - Juriste' },
  },
  { 
    id: 'nordic', 
    name: 'Nordic', 
    description: 'Scandinave minimal, épuré. Tous secteurs.', 
    color: 'bg-[#f5f0eb] text-slate-800 border',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Design Produit', professionnel: 'Product Designer', reconversion: 'Reconversion - Design' },
  },
  { 
    id: 'pastel', 
    name: 'Pastel Moderne', 
    description: 'Couleurs douces, friendly. RH/Communication.', 
    color: 'bg-pink-50 border border-pink-200 text-pink-800',
    categories: ['etudiant'] as CategoryId[],
    exampleTitles: { etudiant: 'Premier Emploi - RH', professionnel: 'Responsable RH', reconversion: 'Reconversion - RH' },
  },
  { 
    id: 'blueprint-premium', 
    name: 'Blueprint Premium', 
    description: 'Photo arrondie, barre contact, 2 colonnes. Premium.', 
    color: 'bg-[#1e3a5f] text-white',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Ingénierie', professionnel: 'Manager IT', reconversion: 'Reconversion - Conseil' },
  },
] as const satisfies ReadonlyArray<{ id: string; name: string; description: string; color: string; categories: CategoryId[]; exampleTitles: Record<CategoryId, string> }>;

// Derived: union type of all template IDs
export type TemplateId = (typeof TEMPLATES)[number]['id'];

// Derived: array of all template IDs (for Zod schema)
export const TEMPLATE_IDS = TEMPLATES.map(t => t.id);

// Derived: interface for template options (uses proper narrow type)
export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
  categories: CategoryId[];
  exampleTitles: Record<CategoryId, string>;
}
