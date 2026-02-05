'use client';

import { useState } from 'react';
import { TEMPLATES, TemplateOption } from '@/lib/templates';
import { MOCK_PREVIEW_CV } from '@/lib/mock-cv';
import { CVThumbnail } from '@/components/dashboard/CVThumbnail';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';

export default function DashboardTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Bibliothèque de Modèles
        </h1>
        <p className="text-slate-500 text-lg">
          Tous nos modèles sont optimisés pour les systèmes ATS et conçus par des recruteurs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id} 
            onClick={() => setSelectedTemplate(template)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Preview Header */}
            <div className="bg-slate-50 relative h-[320px] overflow-hidden flex justify-center pt-8 border-b border-slate-100">
               <div className="transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 shadow-lg">
                 <CVThumbnail 
                    cv={{ ...MOCK_PREVIEW_CV, templateId: template.id }} 
                    scale={0.25} 
                 />
               </div>
               
               {/* Overlay Button */}
               <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                 <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                   <Button size="lg" className="rounded-full shadow-xl pointer-events-none bg-white text-slate-900 hover:bg-slate-50">
                     Aperçu rapide
                   </Button>
                 </div>
               </div>
            </div>

            {/* Info Footer */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                  Gratuit
                </span>
              </div>
              <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                {template.description}
              </p>
              <div className="text-blue-600 font-bold text-xs group-hover:underline flex items-center gap-1 group/link">
                Voir en détail <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Preview Modal */}
      <TemplatePreviewModal 
        template={selectedTemplate} 
        isOpen={!!selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
      />
    </div>
  );
}
