'use client';

import { CV } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { SECTION_TITLES } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

/**
 * ATS "Glacier" Template
 * - Modern Sans-Serif
 * - Left-aligned header for strong hierarchy
 * - Minimalist borders
 * - Optimized for senior profiles (emphasis on experience)
 */
export function ATSGlacier({ cv }: TemplateProps) {
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 font-sans text-sm leading-relaxed min-h-[297mm] p-12">
      
      {/* Header - Left Aligned with bold name */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 uppercase">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl text-slate-600 font-medium mb-4">{personalInfo.title}</p>
        
        <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.email && (
                <>
                    <span className="text-slate-300">•</span>
                    <span>{personalInfo.email}</span>
                </>
            )}
            {personalInfo.phone && (
                <>
                    <span className="text-slate-300">•</span>
                    <span>{personalInfo.phone}</span>
                </>
            )}
            {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-1">
                     <span className="text-slate-300">•</span>
                     <span>{link.url.replace(/^https?:\/\//, '')}</span>
                </div>
            ))}
        </div>
      </header>

      {/* Summary - Boxed style for distinction */}
      {personalInfo.summary && (
        <section className="mb-8">
          <p className="text-slate-700 leading-7">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience - Clean list */}
      {experiences.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 min-w-fit">Expérience</h2>
             <div className="h-px bg-slate-200 w-full" />
          </div>

          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-slate-800">{exp.position}</h3>
                  <span className="text-sm font-medium text-slate-500 tabular-nums">
                    {exp.startDate && formatDate(exp.startDate)} — {exp.current ? 'Présent' : (exp.endDate && formatDate(exp.endDate))}
                  </span>
                </div>
                <div className="text-blue-600 font-medium mb-2">{exp.company}</div>
                {exp.description && (
                  <p className="text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 min-w-fit">{SECTION_TITLES.education}</h2>
             <div className="h-px bg-slate-200 w-full" />
          </div>
          
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                 <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-slate-800">{edu.institution}</h3>
                    <span className="text-sm text-slate-500 tabular-nums">
                        {edu.startDate} — {edu.endDate}
                    </span>
                 </div>
                 <p className="text-slate-600">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                 </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Tools - Compact Grid */}
      {(skills.length > 0 || languages.length > 0) && (
        <section className="mb-8">
           <div className="flex items-center gap-4 mb-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 min-w-fit">Compétences</h2>
             <div className="h-px bg-slate-200 w-full" />
          </div>
           
           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {skills.length > 0 && (
                  <div>
                      <h3 className="font-bold text-slate-900 mb-2 text-xs uppercase">Technique</h3>
                      <p className="text-slate-600 leading-relaxed">
                          {skills.map(s => s.name).join(', ')}
                      </p>
                  </div>
              )}
              
              {languages.length > 0 && (
                  <div>
                      <h3 className="font-bold text-slate-900 mb-2 text-xs uppercase">Langues</h3>
                      <p className="text-slate-600 leading-relaxed">
                          {languages.map(l => `${l.name} (${l.level})`).join(', ')}
                      </p>
                  </div>
              )}
           </div>
        </section>
      )}
      
      {/* Projects, Certifications, etc. can follow similar patterns if needed */}
      {projects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 min-w-fit">{SECTION_TITLES.projects}</h2>
             <div className="h-px bg-slate-200 w-full" />
          </div>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                   <h3 className="font-bold text-slate-800">{proj.name}</h3>
                </div>
                <p className="text-slate-600 text-sm mt-1">{proj.description}</p>
                {proj.technologies && <p className="text-xs text-slate-400 mt-1 font-mono">{proj.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      {footer.showFooter && (footer.madeAt || footer.madeDate) && (
        <footer className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 uppercase tracking-widest">
            Document généré le {footer.madeDate && new Date(footer.madeDate).toLocaleDateString()}
        </footer>
      )}
    </div>
  );
}
