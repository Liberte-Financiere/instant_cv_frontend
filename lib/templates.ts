import { TemplateId } from '@/types/cv';

export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
}

export const TEMPLATES: TemplateOption[] = [
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
];
