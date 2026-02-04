import { TemplateId } from '@/types/cv';

export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
}

export const TEMPLATES: TemplateOption[] = [
  { 
    id: 'modern', 
    name: 'Moderne', 
    description: 'Sidebar sombre, idéal pour la Tech.', 
    color: 'bg-slate-900' 
  },
  { 
    id: 'professional', 
    name: 'Classique Épuré', 
    description: 'Tout blanc, élégant. Banques/Assurances.', 
    color: 'bg-white border text-slate-900' 
  },
  { 
    id: 'executive', 
    name: 'Exécutif', 
    description: 'Sérieux, police Serif. Pour Managers/Avocats.', 
    color: 'bg-[#f8f8f8] border-t-4 border-black text-black' 
  },
  { 
    id: 'creative', 
    name: 'Créatif', 
    description: 'Accents audacieux. Marketing/Design.', 
    color: 'bg-indigo-600 text-white' 
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
    id: 'ats', 
    name: 'Compatible ATS', 
    description: 'Optimisé pour robots recruteurs.', 
    color: 'bg-white border-2 border-black text-black font-serif' 
  },
];
