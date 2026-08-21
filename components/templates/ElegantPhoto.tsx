'use client';

import { CVDescription } from '../cv-sections/CVDescription';
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

export function ElegantPhoto({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const personalInfo = cv.personalInfo || {} as CV['personalInfo'];
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const qualities = cv.qualities || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  const accentColor = getAccentColor('professional', cv.settings?.accentColor);

  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  const SIDEBAR_SECTIONS: CVSectionId[] = ['education', 'skills', 'languages', 'hobbies'];
  const MAIN_SECTIONS: CVSectionId[] = ['summary', 'experience', 'qualities', 'certifications', 'projects', 'references', 'divers'];
  const sidebarOrder = sectionOrder.filter(s => SIDEBAR_SECTIONS.includes(s));
  const mainOrder = sectionOrder.filter(s => MAIN_SECTIONS.includes(s));

  const sectionHeadingClass = "text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 pb-1 border-b";

  const getSkillLabel = (level: number, lang: string) => {
    if (lang === 'en') {
      if (level <= 1) return 'Basics';
      if (level === 2) return 'Beginner';
      if (level === 3) return 'Intermediate';
      if (level === 4) return 'Advanced';
      return 'Expert';
    }
    if (level <= 1) return 'Notions';
    if (level === 2) return 'Débutant';
    if (level === 3) return 'Intermédiaire';
    if (level === 4) return 'Avancé';
    return 'Expert';
  };

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 font-sans text-sm leading-relaxed min-h-[297mm] print:bg-transparent">
      <style>{`
        @media print {
          @page { margin: 0 !important; }
          html, body {
            background: linear-gradient(to left, #f8fafc 0%, #f8fafc 230px, white 230px, white 100%) !important;
          }
          .cv-template section, .cv-item {
            border-top: 10mm solid transparent !important;
            margin-top: -10mm !important;
            background-clip: padding-box !important;
          }
        }
      `}</style>
      <div className="flex min-h-[297mm]">

        {/* ===== LEFT COLUMN (Main Content) ===== */}
        <div className="flex-1 p-10 pr-8">
          
          {/* Header: Photo + Name */}
          <header className="flex items-start gap-6 mb-6">
            {personalInfo.photoUrl && (
              <Image
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
                width={110}
                height={110}
                className="w-[110px] h-[110px] rounded-full object-cover border-2 shrink-0"
                style={{ borderColor: accentColor }}
              />
            )}
            <div className="pt-2">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <p className="text-base mt-1" style={{ color: accentColor }}>
                {personalInfo.title}
              </p>
            </div>
          </header>

          {/* Main sections in user-defined order */}
          {mainOrder.map((sectionId) => {
            switch (sectionId) {
              case 'summary':
                return personalInfo.summary ? (
                  <section key={sectionId} className="mb-6">
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('summary', cv.settings, lang) || 'A PROPOS'}
                    </h2>
                    <p className="text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                  </section>
                ) : null;

              case 'experience':
                return experiences.length > 0 ? (
                  <section key={sectionId} className="mb-6">
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('experience', cv.settings, lang) || 'EXPERIENCES PROFESSIONNELLES'}
                    </h2>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="relative pl-4 border-l-2 break-inside-avoid" style={{ borderColor: `${accentColor}30` }}>
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">
                              {exp.position} — <span className="font-semibold">{exp.company}</span>
                            </h3>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: accentColor }}>
                            {exp.startDate} — {exp.current ? getPresentLabel(lang) : exp.endDate}
                          </p>
                          {exp.description && <CVDescription description={exp.description} className="text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0" />}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              case 'qualities':
                return qualities.length > 0 ? (
                  <section key={sectionId} className="mb-6">
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('qualities', cv.settings, lang)}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {qualities.map((q) => (
                        <span key={q.id} className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
                          {q.name}
                        </span>
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
          <CVFooter footer={footer} variant="professional" lang={lang} />
        </div>

        {/* ===== Vertical Separator ===== */}
        <div className="w-px bg-slate-200" />

        {/* ===== RIGHT COLUMN (Sidebar) ===== */}
        <div className="w-[230px] shrink-0 bg-slate-50 p-6 space-y-6 print:bg-transparent">

          {/* Contact */}
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 pb-1 border-b"
              style={{ borderColor: accentColor }}
            >{getSectionTitle('contact', cv.settings, lang)}</h2>
            <div className="space-y-2 text-sm text-slate-700">
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: accentColor }}>📞</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: accentColor }}>✉️</span>
                  <span className="break-all text-xs">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: accentColor }}>📍</span>
                  <span className="text-xs">{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.nationality && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{lang === 'fr' ? 'Nationalité :' : 'Nationality :'}</span>
                  <span className="text-xs">{personalInfo.nationality}</span>
                </div>
              )}
              {personalInfo.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{lang === 'fr' ? 'Âge :' : 'Age :'}</span>
                  <span className="text-xs">{personalInfo.dateOfBirth}</span>
                </div>
              )}
              {socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: accentColor }}>🔗</span>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs hover:underline"
                    style={{ color: accentColor }}
                  >
                    {link.label || link.platform}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar sections in user-defined order */}
          {sidebarOrder.map((sectionId) => {
            switch (sectionId) {
              case 'education':
                return education.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('education', cv.settings, lang) || 'FORMATIONS'}
                    </h2>
                    <div className="space-y-3">
                      {education.map((edu) => (
                        <div key={edu.id} className="break-inside-avoid">
                          <p className="text-xs font-semibold" style={{ color: accentColor }}>
                            {edu.startDate}{edu.startDate && (edu.endDate || edu.current) ? ' \u2014 ' : ''}{edu.current ? getPresentLabel(lang) : edu.endDate}
                          </p>
                          <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                          <p className="text-xs text-slate-600">{edu.institution}</p>
                          {edu.field && <p className="text-xs text-slate-500 mt-0.5">{edu.field}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              case 'skills':
                return skills.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('skills', cv.settings, lang) || 'COMPETENCES'}
                    </h2>
                    <div className="space-y-2.5">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-start gap-2 break-inside-avoid">
                          <div className="flex items-start gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: accentColor }} />
                            <span className="text-sm text-slate-700 leading-snug">{skill.name}</span>
                          </div>
                          {skill.level ? (
                            <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap mt-1">
                              {getSkillLabel(skill.level, lang)}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              case 'languages':
                return languages.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('languages', cv.settings, lang) || 'LANGUES'}
                    </h2>
                    <div className="space-y-1.5">
                      {languages.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-2 text-sm break-inside-avoid">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                          <span className="text-slate-700">{lang.name}</span>
                          <span className="text-xs text-slate-400 ml-auto">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              case 'hobbies':
                return hobbies.length > 0 ? (
                  <section key={sectionId}>
                    <h2 className={sectionHeadingClass} style={{ borderColor: accentColor }}>
                      {getSectionTitle('hobbies', cv.settings, lang) || 'LOISIRS'}
                    </h2>
                    <div className="space-y-1.5">
                      {hobbies.map((hobby) => (
                        <div key={hobby.id} className="flex items-center gap-2 text-sm text-slate-700 break-inside-avoid">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                          <span>{hobby.name}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
