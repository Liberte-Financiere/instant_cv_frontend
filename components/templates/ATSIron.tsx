'use client';

import { CVDescription } from '../cv-sections/CVDescription';
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';

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
  const lang = cv.settings?.language || 'fr';
  const accentColor = cv.settings?.accentColor;
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif text-sm leading-relaxed min-h-[297mm] p-[15mm]">
      
      {/* Header - Centered & Authoritative */}
      <header className="text-center mb-8">
        <h1 
          className="text-3xl font-bold uppercase tracking-widest mb-1 border-b-2 pb-4"
          style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}
        >
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="mt-3 flex justify-center gap-4 text-sm font-medium">
             {personalInfo.email && <span>{personalInfo.email}</span>}
             {personalInfo.phone && <span>{personalInfo.phone}</span>}
             {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
      </header>

      {/* Dynamic Content */}
      {sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case 'summary':
            return personalInfo.summary ? (
              <section key={sectionId} className="mb-6">
                 <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>R\u00e9sum\u00e9</h2>
                 <p className="text-justify">{personalInfo.summary}</p>
              </section>
            ) : null;
          
          case 'experience':
            return experiences.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('experience', cv.settings, lang)}</h2>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between font-bold mb-1">
                        <span>{exp.company}</span>
                        <span>
                          {exp.startDate && formatDate(exp.startDate, lang)} \u2013 {exp.current ? getPresentLabel(lang) : (exp.endDate && formatDate(exp.endDate, lang))}
                        </span>
                      </div>
                      <div className="italic mb-2 font-medium">{exp.position}</div>
                      {exp.description && <CVDescription description={exp.description} className="whitespace-pre-line pl-2 border-l-2 border-gray-200" />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <section key={sectionId} className="mb-6">
                <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('education', cv.settings, lang)}</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                       <div>
                          <span className="font-bold">{edu.institution}</span>
                          <span className="block italic">{edu.degree}{edu.field && `, ${edu.field}`}</span>
                       </div>
                       <div className="text-right">
                          <span className="block">{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2013 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <section key={sectionId} className="mb-6">
                  <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <ul className="list-disc list-inside">
                      {skills.map(s => (
                          <li key={s.id}>
                              <span className="font-semibold">{s.name}</span>
                              {s.level > 0 && <span className="text-gray-500 text-xs ml-1">({s.level}/5)</span>}
                          </li>
                      ))}
                  </ul>
              </section>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <section key={sectionId} className="mb-6">
                  <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('languages', cv.settings, lang)}</h2>
                  <ul className="list-disc list-inside">
                      {languages.map(l => (
                          <li key={l.id}>
                              <span className="font-semibold">{l.name}</span>: {l.level}
                          </li>
                      ))}
                  </ul>
              </section>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <section key={sectionId} className="mb-6">
                 <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('certifications', cv.settings, lang)}</h2>
                 <ul className="list-disc list-inside">
                     {certifications.map(c => (
                         <li key={c.id}>
                             <span className="font-bold">{c.name}</span> - {c.organization} {c.date && `(${c.date})`}
                         </li>
                     ))}
                 </ul>
              </section>
            ) : null;

          case 'qualities':
            return cv.qualities && cv.qualities.length > 0 ? (
              <section key={sectionId} className="mb-6">
                 <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('qualities', cv.settings, lang)}</h2>
                 <p>{cv.qualities.map((q) => q.name).join(', ')}</p>
              </section>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <section key={sectionId} className="mb-6">
                 <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('projects', cv.settings, lang)}</h2>
                 <div className="space-y-3">
                     {projects.map(p => (
                         <div key={p.id}>
                             <div className="font-bold">{p.name}</div>
                             <p className="text-sm">{p.description}</p>
                         </div>
                     ))}
                 </div>
              </section>
            ) : null;

          case 'references':
            return references.length > 0 ? (
              <section key={sectionId} className="mb-6">
                 <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>{getSectionTitle('references', cv.settings, lang)}</h2>
                 <div className="space-y-2">
                     {references.map(r => (
                         <div key={r.id}>
                             <span className="font-bold">{r.name}</span>, {r.position} {r.company && `at ${r.company}`}
                             <br />
                             {!r.hideContact && r.email && <span>{r.email}</span>}
                             {!r.hideContact && r.email && r.phone && <span> | </span>}
                             {!r.hideContact && r.phone && <span>{r.phone}</span>}
                         </div>
                     ))}
                 </div>
              </section>
            ) : null;

          case 'divers':
            return divers ? (
              <section key={sectionId} className="mb-6">
                 <h2 className="font-bold text-sm uppercase border-b mb-3" style={accentColor ? { borderColor: accentColor, color: accentColor } : { borderColor: 'black' }}>INFORMATIONS COMPL\u00c9MENTAIRES</h2>
                 <p className="whitespace-pre-line">{divers}</p>
              </section>
            ) : null;

          default:
            return null;
        }
      })}
      
      {/* Footer */}
      {footer.showFooter && (
          <div className="mt-auto border-t-4 border-double border-black pt-2 text-center text-xs">
              {lang === 'fr' 
                  ? (footer.madeAt ? `Fait à ${footer.madeAt}, le ` : 'Fait le ') 
                  : (footer.madeAt ? `Done in ${footer.madeAt}, on ` : 'Done on ')}
              {(footer.madeDate ? new Date(footer.madeDate) : new Date()).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
          </div>
      )}

    </div>
  );
}
