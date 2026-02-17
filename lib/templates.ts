// TEMPLATES is the SINGLE SOURCE OF TRUTH for template IDs.
// To add a new template: just add an entry here. Type + Zod schema derive automatically.

export const TEMPLATES = [
  { 
    id: 'professional', 
    name: 'Classique Épuré', 
    description: 'Tout blanc, élégant. Banques/Assurances.', 
    color: 'bg-white border text-slate-900' 
  },
  { 
    id: 'modern', 
    name: 'Moderne', 
    description: 'Sidebar sombre, idéal pour la Tech.', 
    color: 'bg-slate-900' 
  },  
  { 
    id: 'ats', 
    name: 'Compatible ATS', 
    description: 'Optimisé pour robots recruteurs.', 
    color: 'bg-white border-2 border-black text-black font-serif' 
  },
  { 
    id: 'ats-glacier', 
    name: 'Glacier (ATS)', 
    description: 'Design épuré et vertical. Profils Seniors.', 
    color: 'bg-white text-slate-800 border' 
  },
  { 
    id: 'ats-iron', 
    name: 'Iron (ATS)', 
    description: 'Structure forte, Serif. Finance/Légal.', 
    color: 'bg-white text-black border-4 border-double border-slate-200' 
  },
  { 
    id: 'creative', 
    name: 'Créatif', 
    description: 'Accents audacieux. Marketing/Design.', 
    color: 'bg-indigo-600 text-white' 
  },

  { 
    id: 'executive', 
    name: 'Exécutif', 
    description: 'Sérieux, police Serif. Pour Managers/Avocats.', 
    color: 'bg-[#f8f8f8] border-t-4 border-black text-black' 
  },

  { 
    id: 'tech', 
    name: 'Tech Expert', 
    description: 'Terminal style. Développeurs.', 
    color: 'bg-[#1e1e1e] text-green-400 font-mono' 
  },
  { 
    id: 'minimalist', 
    name: 'Minimaliste', 
    description: 'Ultra-épuré, élégant. Tous secteurs.', 
    color: 'bg-white border text-slate-700' 
  },
  { 
    id: 'elegant-photo', 
    name: 'Élégant Photo', 
    description: 'Deux colonnes, photo ronde, sidebar droite. Polyvalent.', 
    color: 'bg-white border-l-4 border-slate-300 text-slate-800' 
  },
  { 
    id: 'corporate-blue', 
    name: 'Corporate Blue', 
    description: 'Sidebar bleu foncé, compétences en points. Pro.', 
    color: 'bg-[#1e3a5f] text-white' 
  },
  { 
    id: 'clean-grid', 
    name: 'Grille Épurée', 
    description: 'Single-column, grille 2 colonnes. Classique.', 
    color: 'bg-white border text-slate-800' 
  },
  { 
    id: 'swiss', 
    name: 'Swiss', 
    description: 'Design suisse, typographie nette. Universel.', 
    color: 'bg-white border-t-4 border-red-500 text-slate-900' 
  },
  { 
    id: 'gradient', 
    name: 'Gradient', 
    description: 'Header dégradé moderne. Startups/Tech.', 
    color: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
  },
  { 
    id: 'timeline', 
    name: 'Timeline Pro', 
    description: 'Frise chronologique verticale. Carrières longues.', 
    color: 'bg-white border-l-4 border-blue-500 text-slate-800' 
  },
  { 
    id: 'compact', 
    name: 'Compact', 
    description: 'Dense, optimisé 1 page. Juniors/Stages.', 
    color: 'bg-slate-50 border text-slate-700' 
  },
  { 
    id: 'bold-header', 
    name: 'Bold Header', 
    description: 'Header XXL coloré. Impact visuel fort.', 
    color: 'bg-emerald-700 text-white' 
  },
  { 
    id: 'two-tone', 
    name: 'Two-Tone', 
    description: 'Split horizontal bicolore. Design/Marketing.', 
    color: 'bg-amber-600 text-white' 
  },
  { 
    id: 'infographic', 
    name: 'Infographie', 
    description: 'Barres et cercles visuels. Digital/Créatif.', 
    color: 'bg-teal-600 text-white' 
  },
  { 
    id: 'classic-serif', 
    name: 'Classic Serif', 
    description: 'Police Serif, académique. Droit/Finance.', 
    color: 'bg-[#faf8f5] border-2 border-amber-900 text-amber-900' 
  },
  { 
    id: 'nordic', 
    name: 'Nordic', 
    description: 'Scandinave minimal, épuré. Tous secteurs.', 
    color: 'bg-[#f5f0eb] text-slate-800 border' 
  },
  { 
    id: 'pastel', 
    name: 'Pastel Moderne', 
    description: 'Couleurs douces, friendly. RH/Communication.', 
    color: 'bg-pink-50 border border-pink-200 text-pink-800' 
  },
  { 
    id: 'blueprint-premium', 
    name: 'Blueprint Premium', 
    description: 'Photo arrondie, barre contact, 2 colonnes. Premium.', 
    color: 'bg-[#1e3a5f] text-white' 
  },
] as const satisfies ReadonlyArray<{ id: string; name: string; description: string; color: string }>;

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
}
