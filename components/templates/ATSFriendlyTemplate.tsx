'use client';

import { CV } from '@/types/cv';
import { formatDate } from '@/lib/utils';

import { SECTION_TITLES } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

// ... (skipping comment block)

export function ATSFriendlyTemplate({ cv }: TemplateProps) {
  // ... (skipping destructuring)

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif text-sm leading-relaxed min-h-[297mm] p-10">
      {/* ... (skipping Header and Summary) ... */}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            {SECTION_TITLES.experience}
          </h2>
          {/* ... */}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            {SECTION_TITLES.education}
          </h2>
          {/* ... */}
        </section>
      )}

      {/* ... Skills ... */}

      {/* ... Languages ... */}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            {SECTION_TITLES.certifications}
          </h2>
          {/* ... */}
        </section>
      )}

      {/* Qualities */}
      {cv.qualities && cv.qualities.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            {SECTION_TITLES.qualities}
          </h2>
          <p>{cv.qualities.map((q) => q.name).join(', ')}</p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            PROJETS
          </h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="cv-item">
                <strong>{project.name}</strong>
                {project.description && <p>{project.description}</p>}
                {project.technologies && (
                  <p className="text-sm italic">Technologies: {project.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            RÉFÉRENCES
          </h2>
          <div className="space-y-2">
            {references.map((ref) => (
              <p key={ref.id} className="cv-item">
                <strong>{ref.name}</strong> - {ref.position}
                {ref.company && `, ${ref.company}`}
                {!ref.hideContact && ref.email && ` | ${ref.email}`}
                {!ref.hideContact && ref.phone && ` | ${ref.phone}`}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Divers */}
      {divers && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            INFORMATIONS COMPLÉMENTAIRES
          </h2>
          <p className="whitespace-pre-wrap">{divers}</p>
        </section>
      )}

      {/* Footer */}
      {footer.showFooter && (footer.madeAt || footer.madeDate) && (
        <footer className="mt-8 pt-4 border-t border-gray-300 text-right text-sm text-gray-600">
          Fait{footer.madeAt && ` à ${footer.madeAt}`}
          {footer.madeAt && footer.madeDate && ', '}
          {footer.madeDate && `le ${new Date(footer.madeDate).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}`}
        </footer>
      )}
    </div>
  );
}
