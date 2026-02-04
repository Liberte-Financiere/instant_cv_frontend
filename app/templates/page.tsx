'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/landing/Footer';
import { TEMPLATES, TemplateOption } from '@/lib/templates';
import { MOCK_PREVIEW_CV } from '@/lib/mock-cv';
import { CVThumbnail } from '@/components/dashboard/CVThumbnail';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">
            Nos Modèles de CV Professionnels
          </h1>
          <p className="text-xl text-slate-600">
            Choisissez parmi notre collection de modèles optimisés pour les ATS.
            Changez de design en un clic, à tout moment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TEMPLATES.map((template) => (
            <div 
              key={template.id} 
              onClick={() => setSelectedTemplate(template)}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Preview Header */}
              <div className="bg-slate-100 relative h-[320px] overflow-hidden flex justify-center pt-8">
                 <div className="transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                   <CVThumbnail 
                      cv={{ ...MOCK_PREVIEW_CV, templateId: template.id }} 
                      scale={0.25} 
                   />
                 </div>
                 
                 {/* Overlay Button */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                     <Button size="lg" className="rounded-full shadow-xl pointer-events-none">
                       Aperçu rapide
                     </Button>
                   </div>
                 </div>
              </div>

              {/* Info Footer */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    Gratuit
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="text-blue-600 font-bold text-sm group-hover:underline flex items-center gap-1 group/link">
                  Voir en détail <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center bg-[#2563eb] rounded-3xl p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="relative z-10">
               <h2 className="text-3xl font-bold mb-6">Prêt à décrocher votre job de rêve ?</h2>
               <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                 Rejoignez 10,000+ candidats qui ont boosté leur carrière avec nos modèles.
               </p>
               <Link href="/auth">
                 <Button variant="ghost" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                   Créer mon CV maintenant
                 </Button>
               </Link>
             </div>
        </div>

      </main>
      
      <Footer />

      {/* Preview Modal */}
      <TemplatePreviewModal 
        template={selectedTemplate} 
        isOpen={!!selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
      />
    </div>
  );
}
