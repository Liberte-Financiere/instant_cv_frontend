// TEMPLATES is the SINGLE SOURCE OF TRUTH for template IDs.
// To add a new template: just add an entry here. Type + Zod schema derive automatically.

import type { CategoryId } from '@/lib/mock-cv-profiles';

export const TEMPLATES = [
  { 
    id: 'professional', 
    name: 'L\'Essentiel', 
    description: 'Design épuré et intemporel. Idéal pour les secteurs bancaires, administratifs et commerciaux.', 
    color: 'bg-white border text-slate-900',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Administration', professionnel: 'Manager IT', reconversion: 'Nouveau Départ - Comptabilité' },
  },
  { 
    id: 'modern', 
    name: 'Le Moderne', 
    description: 'Sidebar contrastée. Pensé pour les métiers de la Tech, de l\'ingénierie et du digital.', 
    color: 'bg-slate-900',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Génie Logiciel', professionnel: 'Développeur Full-Stack Senior', reconversion: 'Transition Tech - Développeur' },
  },  
  { 
    id: 'ats', 
    name: 'Le Standard', 
    description: 'Format universel sobre. Parfait pour les grandes entreprises et les algorithmes de recrutement.', 
    color: 'bg-white border-2 border-black text-black font-serif',
    categories: ['etudiant', 'professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Data Science', professionnel: 'Chef de Projet Digital', reconversion: 'Transition Tech - Support' },
  },
  { 
    id: 'ats-glacier', 
    name: 'Le Glacier', 
    description: 'Verticalité élégante et claire. Recommandé pour les profils seniors et le management.', 
    color: 'bg-white text-slate-800 border',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage M2 - Architecture', professionnel: 'Architecte Solutions Cloud', reconversion: 'Reconversion - Consultant' },
  },
  { 
    id: 'ats-iron', 
    name: 'L\'Industriel', 
    description: 'Structure robuste et affirmée. Excellent choix pour l\'ingénierie lourde, l\'industrie et les mines.', 
    color: 'bg-white text-black border-4 border-double border-slate-200',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Finance', professionnel: 'Ingénieur Minier', reconversion: 'Reconversion - Logistique' },
  },
  { 
    id: 'creative', 
    name: 'Le Visionnaire', 
    description: 'Accents visuels audacieux. Taillé sur mesure pour le marketing, la communication et le design.', 
    color: 'bg-indigo-600 text-white',
    categories: ['etudiant', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - UX Design', professionnel: 'Directeur Artistique', reconversion: 'Reconversion - Designer Graphique' },
  },
  { 
    id: 'executive', 
    name: 'Le Stratège', 
    description: 'Sérieux et charismatique. Conçu pour les postes de direction, les managers et les cadres.', 
    color: 'bg-slate-50 border-t-4 border-black text-black',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Management', professionnel: 'Directeur Commercial', reconversion: 'Reconversion - Conseil RH' },
  },
  { 
    id: 'tech', 
    name: 'L\'Innovateur', 
    description: 'Inspiré des interfaces de code. Le choix naturel des développeurs et experts IT.', 
    color: 'bg-zinc-900 text-green-400 font-mono',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - DevOps', professionnel: 'Tech Lead / Architecte', reconversion: 'Reconversion - Dev Backend' },
  },
  { 
    id: 'minimalist', 
    name: 'L\'Authentique', 
    description: 'L\'élégance par la simplicité. Polyvalent et redoutablement efficace pour tout secteur.', 
    color: 'bg-white border text-slate-700',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Premier Emploi - Marketing', professionnel: 'Product Manager', reconversion: 'Reconversion - Marketing' },
  },
  { 
    id: 'elegant-photo', 
    name: 'L\'Élégant', 
    description: 'Mise en page équilibrée avec portrait. Valorise le relationnel pour les métiers de contact.', 
    color: 'bg-white border-l-4 border-slate-300 text-slate-800',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Communication', professionnel: 'Responsable Communication', reconversion: 'Reconversion - RP' },
  },
  { 
    id: 'corporate-blue', 
    name: 'L\'Institutionnel', 
    description: 'Design formel de confiance. Un standard institutionnel pour la finance, l\'audit et la fonction publique.', 
    color: 'bg-slate-950 text-white',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Banque', professionnel: 'Conseiller Financier', reconversion: 'Reconversion - Audit' },
  },
  { 
    id: 'clean-grid', 
    name: 'Le Structuré', 
    description: 'Agencement symétrique et géométrique. Très adapté aux profils analytiques et scientifiques.', 
    color: 'bg-white border text-slate-800',
    categories: ['etudiant', 'professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage L3 - Informatique', professionnel: 'Ingénieur Logiciel', reconversion: 'Reconversion - Analyste' },
  },
  { 
    id: 'swiss', 
    name: 'L\'Universel', 
    description: 'Inspiré de la typographie suisse. Lisibilité absolue pour le BTP, l\'architecture et la santé.', 
    color: 'bg-white border-t-4 border-red-500 text-slate-900',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Ingénierie', professionnel: 'Manager IT', reconversion: 'Reconversion - IT' },
  },
  { 
    id: 'gradient', 
    name: 'Le Dynamique', 
    description: 'En-tête vibrant et moderne. Idéal pour l\'écosystème startup, l\'événementiel et l\'innovation.', 
    color: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Startup', professionnel: 'Growth Hacker', reconversion: 'Reconversion - Product' },
  },
  { 
    id: 'timeline', 
    name: 'Le Parcours', 
    description: 'Frise chronologique claire. Idéal pour raconter les carrières longues et riches en expériences.', 
    color: 'bg-white border-l-4 border-blue-500 text-slate-800',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Parcours Académique', professionnel: 'Directeur de Programmes', reconversion: 'Reconversion - Chef de Projet' },
  },
  { 
    id: 'bold-header', 
    name: 'L\'Audacieux', 
    description: 'Impact visuel fort. Idéal pour s\'imposer et marquer les esprits (indépendants, freelances, créatifs).', 
    color: 'bg-emerald-700 text-white',
    categories: ['etudiant', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Premier Emploi - Marketing', professionnel: 'Brand Manager', reconversion: 'Nouveau Départ - Data Analyst' },
  },
  { 
    id: 'infographic', 
    name: 'Le Visuel', 
    description: 'Orienté données et graphiques. Destiné aux métiers de l\'analyse de la data et du contrôle de gestion.', 
    color: 'bg-teal-600 text-white',
    categories: ['reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Data Viz', professionnel: 'Data Analyst Senior', reconversion: 'Reconversion - Web Designer' },
  },
  { 
    id: 'classic-serif', 
    name: 'Le Juriste', 
    description: 'Police à empattements, académique et solennelle. La référence absolue pour le droit, les juristes et la conformité.', 
    color: 'bg-stone-50 border-2 border-amber-900 text-amber-900',
    categories: ['professionnel', 'reconversion'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Droit', professionnel: 'Avocat Senior', reconversion: 'Reconversion - Juriste' },
  },
  { 
    id: 'pastel', 
    name: 'L\'Harmonieux', 
    description: 'Tons doux et accueillants. Parfaitement adapté pour les métiers de l\'humain (RH, médical, formation).', 
    color: 'bg-pink-50 border border-pink-200 text-pink-800',
    categories: ['etudiant'] as CategoryId[],
    exampleTitles: { etudiant: 'Premier Emploi - RH', professionnel: 'Responsable RH', reconversion: 'Reconversion - RH' },
  },
  { 
    id: 'blueprint-premium', 
    name: 'L\'Expert', 
    description: 'Design rigoureux et structure dense. Réservé aux profils consultants et hauts niveaux de responsabilités.', 
    color: 'bg-slate-950 text-white',
    categories: ['professionnel'] as CategoryId[],
    exampleTitles: { etudiant: 'Stage - Ingénierie', professionnel: 'Consultant IT', reconversion: 'Reconversion - Conseil' },
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
