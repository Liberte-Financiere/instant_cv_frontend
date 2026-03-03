'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/landing/Footer';
import { TEMPLATES, TemplateOption } from '@/lib/templates';
import { CATEGORIES, CategoryId } from '@/lib/mock-cv-profiles';
import { CVThumbnail } from '@/components/dashboard/CVThumbnail';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('etudiant');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);

  // Filter templates by active category
  const filteredTemplates = TEMPLATES.filter((t) =>
    t.categories.includes(activeCategory)
  );

  // Get mock CV for current category
  const currentCategoryConfig = CATEGORIES.find((c) => c.id === activeCategory)!;
  const mockCV = currentCategoryConfig.mockCV;

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 container mx-auto px-4">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10">
          Bibliothèque de Modèles de CV
        </h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-lg shadow-purple-500/25'
                  : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template as unknown as TemplateOption)}
              className="group cursor-pointer"
            >
              {/* Card */}
              <div className="bg-[#1a1f2e] rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500/70 transition-all duration-300 hover:shadow-xl hover:shadow-black/30">
                {/* Thumbnail Container */}
                <div className="p-4 pb-3">
                  <div className="rounded-xl overflow-hidden bg-white transform group-hover:scale-[1.02] transition-transform duration-300">
                    <CVThumbnail
                      cv={{
                        ...mockCV,
                        templateId: template.id,
                        title: template.exampleTitles[activeCategory],
                      }}
                      scale={0.32}
                    />
                  </div>
                </div>
              </div>

              {/* Title below card */}
              <p className="mt-3 text-sm font-medium text-slate-300 group-hover:text-white transition-colors text-center">
                {template.exampleTitles[activeCategory]}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à décrocher votre job de rêve ?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez 10,000+ candidats qui ont boosté leur carrière avec nos modèles.
            </p>
            <Link href="/auth">
              <Button
                variant="ghost"
                size="lg"
                className="bg-white text-[#7c3aed] hover:bg-purple-50 gap-2"
              >
                Créer mon CV maintenant <ArrowRight className="w-5 h-5" />
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
