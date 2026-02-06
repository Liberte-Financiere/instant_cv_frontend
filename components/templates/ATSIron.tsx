'use client';

import { CV } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { SECTION_TITLES } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

/**
 * ATS "Iron" Template
 * - Classic Serif (Times New Roman style)
 * - Strong horizontal rules
 * - Centered header
 * - Conservative and authoritative
 */
export function ATSIron({ cv }: TemplateProps) {
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const projects = cv.projects || [];
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif text-sm leading-relaxed min-h-[297mm] p-[15mm]">
      
      {/* Header - Centered & Authoritative */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-1 border-b-2 border-black pb-4">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="mt-3 flex justify-center gap-4 text-sm font-medium">
             {personalInfo.email && <span>{personalInfo.email}</span>}
             {personalInfo.phone && <span>{personalInfo.phone}</span>}
             {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
           <h2 className="font-bold text-sm uppercase border-b border-black mb-3">Résumé</h2>
           <p className="text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-sm uppercase border-b border-black mb-3">Expérience Professionnelle</h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold mb-1">
                  <span>{exp.company}</span>
                  <span>
                    {exp.startDate && formatDate(exp.startDate)} – {exp.current ? 'Présent' : (exp.endDate && formatDate(exp.endDate))}
                  </span>
                </div>
                <div className="italic mb-2 font-medium">{exp.position}</div>
                {exp.description && (
                  <p className="whitespace-pre-wrap pl-2 border-l-2 border-gray-200">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold text-sm uppercase border-b border-black mb-3">{SECTION_TITLES.education}</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                 <div>
                    <span className="font-bold">{edu.institution}</span>
                    <span className="block italic">{edu.degree}{edu.field && `, ${edu.field}`}</span>
                 </div>
                 <div className="text-right">
                    <span className="block">{edu.startDate} – {edu.endDate}</span>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills in columns */}
      {(skills.length > 0 || languages.length > 0) && (
        <section className="mb-6">
            <h2 className="font-bold text-sm uppercase border-b border-black mb-3">Compétences & Langues</h2>
            <div className="flex gap-12">
               {skills.length > 0 && (
                   <div className="flex-1">
                       <ul className="list-disc list-inside">
                           {skills.map(s => (
                               <li key={s.id}>
                                   <span className="font-semibold">{s.name}</span>
                                   {s.level > 0 && <span className="text-gray-500 text-xs ml-1">({s.level}/5)</span>}
                               </li>
                           ))}
                       </ul>
                   </div>
               )}
               {languages.length > 0 && (
                   <div className="flex-1">
                        <ul className="list-disc list-inside">
                           {languages.map(l => (
                               <li key={l.id}>
                                   <span className="font-semibold">{l.name}</span>: {l.level}
                               </li>
                           ))}
                       </ul>
                   </div>
               )}
            </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
           <h2 className="font-bold text-sm uppercase border-b border-black mb-3">{SECTION_TITLES.projects}</h2>
           <div className="space-y-3">
               {projects.map(p => (
                   <div key={p.id}>
                       <div className="font-bold">{p.name}</div>
                       <p className="text-sm">{p.description}</p>
                   </div>
               ))}
           </div>
        </section>
      )}
      
      {/* Footer */}
      {footer.showFooter && (
          <div className="mt-auto border-t-4 border-double border-black pt-2 text-center text-xs">
              CV généré le {new Date().toLocaleDateString()}
          </div>
      )}

    </div>
  );
}
