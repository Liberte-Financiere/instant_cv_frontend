'use client';

import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import { getAccentColor } from '@/components/cv-sections/styles';
import {
  CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter
} from '@/components/cv-sections';

interface TemplateProps {
  cv: CV;
}

export function CleanGrid({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const personalInfo = cv.personalInfo || {} as CV['personalInfo'];
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const accentColor = getAccentColor('professional', cv.settings?.accentColor);
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  
  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 font-sans text-sm leading-relaxed min-h-[297mm] p-10">
      
      {/* Header: Name + Photo */}
      <header className="flex justify-between items-start mb-6 pb-4 border-b" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{personalInfo.firstName} {personalInfo.lastName}</h1>
          <p className="text-base mt-1" style={{ color: accentColor }}>{personalInfo.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.nationality && <span>{lang === 'fr' ? 'Nationalité' : 'Nationality'}: {personalInfo.nationality}</span>}
            {personalInfo.dateOfBirth && <span>{personalInfo.dateOfBirth}</span>}
          </div>
        </div>
        {personalInfo.photoUrl && (
          <Image
            src={personalInfo.photoUrl}
            alt={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
            width={80}
            height={90}
            className="w-20 h-[90px] object-cover rounded-sm border"
            style={{ borderColor: accentColor }}
          />
        )}
      </header>

      {/* Dynamic Content Sections */}
      {sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case 'summary':
            return personalInfo.summary ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('summary', cv.settings, lang)}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed ">{personalInfo.summary}</p>
              </section>
            ) : null;

          case 'experience':
            return experiences.length > 0 ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('experience', cv.settings, lang)}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <p className="text-xs font-semibold" style={{ color: accentColor }}>
                        {exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}
                      </p>
                      <h3 className="font-bold text-sm text-slate-900">{exp.position}</h3>
                      <p className="text-xs font-semibold text-slate-500">{exp.company}</p>
                      {exp.description && (
                        <ul className="mt-1 space-y-0.5">
                          {exp.description.split('\n').filter(Boolean).map((line, i) => (
                            <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                              <span className="text-slate-300 mt-0.5">•</span>
                              <span>{line.replace(/^[•\-–]\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('education', cv.settings, lang)}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-xs font-semibold" style={{ color: accentColor }}>{edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' — ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}</p>
                      <p className="font-bold text-sm text-slate-900">{edu.degree}</p>
                      <p className="text-xs text-slate-500">{edu.institution}</p>
                      {edu.field && <p className="text-xs text-slate-400">{edu.field}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('skills', cv.settings, lang)}
                </h2>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                  {skills.map((skill) => (
                    <span key={skill.id} className="text-xs text-slate-700">• {skill.name}</span>
                  ))}
                </div>
              </section>
            ) : null;

          case 'qualities':
            return cv.qualities && cv.qualities.length > 0 ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('qualities', cv.settings, lang)}
                </h2>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                  {cv.qualities.map((q) => (
                    <span key={q.id} className="text-xs text-slate-700">• {q.name}</span>
                  ))}
                </div>
              </section>
            ) : null;

          case 'hobbies':
            return hobbies.length > 0 ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('hobbies', cv.settings, lang)}
                </h2>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                  {hobbies.map((h) => (
                    <span key={h.id} className="text-xs text-slate-700">• {h.name}</span>
                  ))}
                </div>
              </section>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <section key={sectionId} className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                  {getSectionTitle('languages', cv.settings, lang)}
                </h2>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-xs text-slate-700">• {lang.name} — {lang.level}</span>
                  ))}
                </div>
              </section>
            ) : null;

          case 'certifications':
            return <CVCertifications key={sectionId} certifications={certifications} variant="professional" accentColor={accentColor} title={getSectionTitle('certifications', cv.settings, lang)} />;
          case 'projects':
            return <CVProjects key={sectionId} projects={projects} variant="professional" accentColor={accentColor} title={getSectionTitle('projects', cv.settings, lang)} />;
          case 'references':
            return <CVReferences key={sectionId} references={references} variant="professional" accentColor={accentColor} title={getSectionTitle('references', cv.settings, lang)} />;
          case 'divers':
            return <CVDivers key={sectionId} divers={divers} variant="professional" accentColor={accentColor} title={getSectionTitle('divers', cv.settings, lang)} />;

          default:
            return null;
        }
      })}
      <CVFooter footer={footer} variant="professional"  lang={lang}/>
    </div>
  );
}
