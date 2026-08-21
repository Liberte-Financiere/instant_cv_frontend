'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { formatDate } from '@/lib/utils';

import { getSectionTitle , getPresentLabel } from '@/constants/sections';

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
  const lang = cv.settings?.language || 'fr';
  const accentColor = cv.settings?.accentColor;
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif text-sm leading-relaxed min-h-[297mm] p-10">
      {/* Header - Name and Contact */}
      <header 
        className="text-center border-b-2 pb-4 mb-6"
        style={accentColor ? { borderColor: accentColor } : { borderColor: 'black' }}
      >
        <h1 
          className="text-2xl font-bold uppercase tracking-wide"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-base mt-1">{personalInfo.title}</p>
        
        <p className="mt-3 text-sm">
          {[personalInfo.email, personalInfo.phone, personalInfo.address]
            .filter(Boolean)
            .join(' | ')}
        </p>
        
        {(personalInfo.nationality || personalInfo.dateOfBirth) && (
          <p className="mt-1 text-sm">
            {[
              personalInfo.nationality && `Nationalité : ${personalInfo.nationality}`,
              personalInfo.dateOfBirth && `Âge : ${personalInfo.dateOfBirth}`
            ].filter(Boolean).join(' | ')}
          </p>
        )}
        
        {socialLinks.length > 0 && (
          <p className="mt-1 text-sm">
            {socialLinks.map((link) => link.url).join(' | ')}
          </p>
        )}
      </header>

      {/* Dynamic sections based on user-defined order */}
      {sectionOrder.map((sectionId) => {
        const headingStyle = accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: '#9ca3af' };
        const headingClass = "text-sm font-bold uppercase border-b pb-1 mb-3";

        switch (sectionId) {
          case 'summary':
            return personalInfo.summary ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('summary', cv.settings, lang)}</h2>
                <p className="text-justify">{personalInfo.summary}</p>
              </section>
            ) : null;

          case 'experience':
            return experiences.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="cv-item">
                      <div className="flex justify-between items-baseline">
                        <strong className="text-base">{exp.position}</strong>
                        <span className="text-sm">
                          {exp.startDate && formatDate(exp.startDate, lang)} - {exp.current ? getPresentLabel(lang) : (exp.endDate && formatDate(exp.endDate, lang))}
                        </span>
                      </div>
                      <p className="italic">{exp.company}</p>
                      {exp.description && <CVDescription description={exp.description} className="mt-1 whitespace-pre-line" />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('education', cv.settings, lang)}</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="cv-item">
                      <div className="flex justify-between items-baseline">
                        <strong>{edu.degree}{edu.field && ` - ${edu.field}`}</strong>
                        <span className="text-sm">
                          {edu.startDate && `${edu.startDate}`}{(edu.endDate || edu.current) && ` - ${edu.current ? getPresentLabel(lang) : edu.endDate}`}
                        </span>
                      </div>
                      <p className="italic">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                <p>{skills.map((s) => s.name).join(', ')}</p>
              </section>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                <p>{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</p>
              </section>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('certifications', cv.settings, lang)}</h2>
                <div className="space-y-1">
                  {certifications.map((cert) => (
                    <p key={cert.id} className="cv-item">
                      <strong>{cert.name}</strong> - {cert.organization}
                      {cert.date && ` (${cert.date})`}
                    </p>
                  ))}
                </div>
              </section>
            ) : null;

          case 'qualities':
            return (cv.qualities?.length || 0) > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                <p>{cv.qualities!.map((q) => q.name).join(', ')}</p>
              </section>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('projects', cv.settings, lang)}</h2>
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
            ) : null;

          case 'references':
            return references.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('references', cv.settings, lang)}</h2>
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
            ) : null;

          case 'divers':
            return divers ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('divers', cv.settings, lang)}</h2>
                <p>{divers}</p>
              </section>
            ) : null;

          case 'hobbies':
            return (cv.hobbies?.length || 0) > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className={headingClass} style={headingStyle}>{getSectionTitle('hobbies', cv.settings, lang)}</h2>
                <p>{cv.hobbies!.map((h) => h.name).join(', ')}</p>
              </section>
            ) : null;

          default:
            return null;
        }
      })}

      {/* Footer */}
      {footer.showFooter && (footer.madeAt || footer.madeDate) && (
        <footer className="mt-8 pt-4 border-t border-gray-300 text-right text-sm text-gray-600">
          {lang === 'fr' ? 'Fait' : 'Done'}
          {footer.madeAt && (lang === 'fr' ? ` à ${footer.madeAt}` : ` in ${footer.madeAt}`)}
          {footer.madeAt && footer.madeDate && ', '}
          {footer.madeDate && (lang === 'fr' ? 'le ' : 'on ')}
          {footer.madeDate && new Date(footer.madeDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </footer>
      )}
    </div>
  );
}
