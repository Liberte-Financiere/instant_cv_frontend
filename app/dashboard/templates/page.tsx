'use client';

import { useState, useMemo } from 'react';
import { TEMPLATES, TemplateOption } from '@/lib/templates';
import { MOCK_PREVIEW_CV } from '@/lib/mock-cv';
import { CVThumbnail } from '@/components/dashboard/CVThumbnail';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Search, Eye, Plus } from 'lucide-react';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { LazyMount } from '@/components/ui/LazyMount';
import type { CategoryId } from '@/lib/mock-cv-profiles';

export default function DashboardTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || template.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  const categories: { id: CategoryId | 'all', label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'etudiant', label: 'Étudiants' },
    { id: 'professionnel', label: 'Professionnels' },
    { id: 'reconversion', label: 'Reconversion' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">
          Bibliothèque de Modèles
        </h1>
        <p className="text-slate-500 text-sm md:text-lg">
          Tous nos modèles sont optimisés pour les systèmes ATS. Trouve le design idéal pour ton CV.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setVisibleCount(8);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(8);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 mb-4">Aucun modèle ne correspond à votre recherche.</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-8">
          {visibleTemplates.map((template) => (
            <div 
              key={template.id} 
              className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col focus-within:ring-2 focus-within:ring-blue-500"
            >
              {/* Preview Header */}
              <div 
                className="bg-slate-50 relative h-[180px] md:h-[320px] overflow-hidden flex justify-center pt-4 md:pt-8 border-b border-slate-100 cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTemplate(template); }}
                tabIndex={0}
                role="button"
                aria-label={`Aperçu de ${template.name}`}
              >
                 <LazyMount className="w-full h-full">
                   <div className="transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 shadow-lg scale-[0.6] md:scale-[0.85] lg:scale-100 origin-top flex justify-center pointer-events-none">
                     <CVThumbnail 
                        cv={{ ...MOCK_PREVIEW_CV, templateId: template.id }} 
                        scale={0.25} 
                     />
                   </div>
                 </LazyMount>
                 
                 {/* Overlay Button */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                   <div className="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                     <Button variant="secondary" className="rounded-full shadow-xl pointer-events-none w-36 gap-2 bg-white/95 hover:bg-white text-slate-800 border-0">
                       <Eye className="w-4 h-4" /> Aperçu
                     </Button>
                     {/* 
                         We stop propagation manually here, because the parent div handles 
                         thumbnail clicks to open modal, but this Link should redirect instead.
                     */}
                     <div onClick={(e) => e.stopPropagation()}>
                       <Link href={`/dashboard/cvs/new?templateId=${template.id}`}>
                         <Button size="default" className="rounded-full shadow-xl w-36 gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer pointer-events-auto">
                           <Plus className="w-4 h-4" /> Utiliser
                         </Button>
                       </Link>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Info Footer */}
              <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1 md:mb-2 text-left">
                    <button 
                      className="text-sm md:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors truncate focus:outline-none"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {template.name}
                    </button>
                    <span className="hidden md:inline-block px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide flex-shrink-0">
                      Gratuit
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mb-2 md:mb-4 line-clamp-2 leading-relaxed hidden md:block text-left">
                    {template.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => setSelectedTemplate(template)}
                  className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1 group/link focus:outline-none w-max"
                  aria-label={`Voir les détails du modèle ${template.name}`}
                >
                  Voir les détails <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Charger plus de modèles
          </Button>
        </div>
      )}
      
      {/* Preview Modal */}
      <TemplatePreviewModal 
        template={selectedTemplate} 
        isOpen={!!selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
      />
    </div>
  );
}

