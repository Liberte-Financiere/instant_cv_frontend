'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TemplateId } from '@/types/cv';
import { cn } from '@/lib/utils';

interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  color: string;
}

const TEMPLATES: TemplateOption[] = [
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

interface TemplateSelectorProps {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            "relative p-4 rounded-xl text-left transition-all border-2 group",
            selectedId === template.id 
              ? "border-blue-600 ring-4 ring-blue-500/10" 
              : "border-slate-100 hover:border-blue-300 hover:shadow-md bg-white"
          )}
        >
          {/* Visual Preview (Abstract) */}
          <div className={cn("h-32 mb-4 rounded-lg shadow-sm flex flex-col p-3 overflow-hidden", template.color)}>
             <div className="w-1/2 h-2 bg-current opacity-20 rounded mb-2" />
             <div className="w-3/4 h-2 bg-current opacity-20 rounded mb-4" />
             <div className="space-y-1">
               <div className="w-full h-1 bg-current opacity-10 rounded" />
               <div className="w-full h-1 bg-current opacity-10 rounded" />
               <div className="w-2/3 h-1 bg-current opacity-10 rounded" />
             </div>
          </div>

          <div className="flex justify-between items-start">
             <div>
               <h3 className="font-bold text-slate-900">{template.name}</h3>
               <p className="text-xs text-slate-500 mt-1">{template.description}</p>
             </div>
             {selectedId === template.id && (
               <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
                 <Check className="w-3.5 h-3.5" />
               </div>
             )}
          </div>
        </button>
      ))}
    </div>
  );
}
