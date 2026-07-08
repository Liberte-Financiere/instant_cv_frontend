'use client';

import { useState } from 'react';
import { LayoutTemplate, X, Check } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { TEMPLATES } from '@/lib/templates';
import { TemplateId } from '@/types/cv';
import { cn } from '@/lib/utils';
import { TemplatePreview } from '@/components/dashboard/TemplatePreview';
import { trackTelemetry } from '@/lib/telemetry';

interface TemplateSelectorProps {
  showNudge?: boolean;
  onNudgeDismiss?: () => void;
}

export function TemplateSelector({ showNudge = false, onNudgeDismiss }: TemplateSelectorProps) {
  const { currentCV, updateTemplateId } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentCV) return null;

  const handleSelect = (templateId: TemplateId) => {
    const oldTemplate = currentCV.templateId;
    updateTemplateId(templateId);
    setIsOpen(false);
    onNudgeDismiss?.();
    trackTelemetry('template_changed', { 
      cvId: currentCV.id, 
      from: oldTemplate, 
      to: templateId 
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
    onNudgeDismiss?.();
    trackTelemetry('template_selector_clicked', { cvId: currentCV.id });
  };

  return (
    <>
      <div className="relative group">
        <button
          onClick={handleOpen}
          className={cn(
            "relative flex items-center justify-center w-9 h-9 p-0 sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:gap-2 border rounded-lg transition-all text-sm font-semibold shadow-sm",
            showNudge 
              ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          )}
          title="Cliquez ici pour changer le modèle de votre CV"
        >
          {showNudge && (
            <span className="absolute inset-0 rounded-lg border-2 border-indigo-400/60 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />
          )}
          <div className="relative flex items-center justify-center">
            <LayoutTemplate className={cn("w-4 h-4", showNudge ? "text-indigo-600" : "text-slate-500")} />
          </div>
          <span className="hidden sm:inline">Changer de modèle</span>
        </button>

        {showNudge && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl z-50 pointer-events-none hidden md:block border border-slate-800">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-t border-l border-slate-800" />
            <p className="text-center font-medium leading-relaxed">🎨 Choisissez un modèle pour commencer !</p>
          </div>
        )}
      </div>

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
