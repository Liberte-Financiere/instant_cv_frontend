'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TemplateId } from '@/types/cv';
import { cn } from '@/lib/utils';
import { TEMPLATES, TemplateOption } from '@/lib/templates';
import { TemplatePreview } from './TemplatePreview';

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
          {/* Real Template Preview */}
          <div className="h-48 mb-4 rounded-lg shadow-sm border border-slate-100 overflow-hidden bg-slate-50 relative">
             <TemplatePreview templateId={template.id} />
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
