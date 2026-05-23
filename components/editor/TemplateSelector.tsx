'use client';

import { useState } from 'react';
import { LayoutTemplate, X, Check } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { TEMPLATES } from '@/lib/templates';
import { TemplateId } from '@/types/cv';
import { cn } from '@/lib/utils';
import { TemplatePreview } from '@/components/dashboard/TemplatePreview';

export function TemplateSelector() {
  const { currentCV, updateTemplateId } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentCV) return null;

  const handleSelect = (templateId: TemplateId) => {
    updateTemplateId(templateId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-9 h-9 p-0 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:gap-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors text-sm font-medium text-slate-700"
        title="Changer de modèle"
      >
        <LayoutTemplate className="w-4 h-4 text-slate-500" />
        <span className="hidden sm:inline">Modèle</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 p-6 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Choisir un modèle de CV</h3>
                <p className="text-sm text-slate-500">Sélectionnez le style idéal pour votre profil professionnel</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TEMPLATES.map((template) => {
                  const isSelected = currentCV.templateId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template.id)}
                      className={cn(
                        "relative p-3 rounded-2xl text-left transition-all border-2 group",
                        isSelected 
                          ? "border-blue-600 ring-4 ring-blue-500/10 bg-blue-50/10" 
                          : "border-slate-100 hover:border-blue-300 hover:shadow-md bg-white"
                      )}
                    >
                      {/* Real Template Preview */}
                      <div className="h-40 mb-3 rounded-xl shadow-sm border border-slate-100 overflow-hidden bg-slate-50 relative">
                         <TemplatePreview templateId={template.id} />
                      </div>

                      <div className="flex justify-between items-start gap-2">
                         <div className="min-w-0">
                           <h4 className="font-bold text-slate-900 text-sm truncate">{template.name}</h4>
                           <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>
                         </div>
                         {isSelected && (
                           <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
                             <Check className="w-3 h-3" />
                           </div>
                         )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
