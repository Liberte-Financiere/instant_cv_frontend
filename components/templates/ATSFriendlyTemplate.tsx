'use client';

import { CV } from '@/types/cv';
import { formatDate } from '@/lib/utils';

interface TemplateProps {
  cv: CV;
}

/**
 * ATS-Friendly Template
 * - No columns, simple structure
 * - No graphics/icons that confuse ATS
 * - Clear section headings
 * - Standard fonts
 * - Contact info at top
 */
export function ATSFriendlyTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif text-sm leading-relaxed min-h-[297mm] p-10">
      {/* Header - Name and Contact */}
      <header className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-base mt-1">{personalInfo.title}</p>
        
        <p className="mt-3 text-sm">
          {[personalInfo.email, personalInfo.phone, personalInfo.address]
            .filter(Boolean)
            .join(' | ')}
        </p>
        
        {socialLinks.length > 0 && (
          <p className="mt-1 text-sm">
            {socialLinks.map((link) => link.url).join(' | ')}
          </p>
        )}
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            PROFIL PROFESSIONNEL
          </h2>
          <p className="text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            EXPÉRIENCE PROFESSIONNELLE
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="cv-item">
                <div className="flex justify-between items-baseline">
                  <strong className="text-base">{exp.position}</strong>
                  <span className="text-sm">
                    {exp.startDate && formatDate(exp.startDate)} - {exp.current ? 'Présent' : (exp.endDate && formatDate(exp.endDate))}
                  </span>
                </div>
                <p className="italic">{exp.company}</p>
                {exp.description && (
                  <p className="mt-1 whitespace-pre-wrap">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            FORMATION
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="cv-item">
                <div className="flex justify-between items-baseline">
                  <strong>{edu.degree}{edu.field && ` - ${edu.field}`}</strong>
                  <span className="text-sm">
                    {edu.startDate && `${edu.startDate}`}{edu.endDate && ` - ${edu.endDate}`}
                  </span>
                </div>
                <p className="italic">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            COMPÉTENCES
          </h2>
          <p>{skills.map((s) => s.name).join(', ')}</p>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            LANGUES
          </h2>
          <p>
            {languages.map((lang) => `${lang.name} (${lang.level})`).join(', ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 pb-1 mb-3">
            CERTIFICATIONS
          </h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <p key={cert.id} className="cv-item">
                <strong>{cert.name}</strong> - {cert.organization}
                {cert.date && ` (${cert.date})`}
              </p>
            ))}
          </div>
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
