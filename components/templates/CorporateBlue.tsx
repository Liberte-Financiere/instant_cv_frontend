'use client';

import Image from "next/image";
import { CV } from '@/types/cv';
import { getSectionTitle , getPresentLabel } from '@/constants/sections';
import {
  CVCertifications, CVProjects, CVReferences, CVDivers, CVFooter
} from '@/components/cv-sections';

interface TemplateProps {
  cv: CV;
}

export function CorporateBlue({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const personalInfo = cv.personalInfo || {} as CV['personalInfo'];
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const qualities = cv.qualities || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const sidebarColor = cv.settings?.sidebarColor || '#1e3a5f';

  // Dots for skill level
  const renderDots = (level: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          key={dot}
          className={`w-2.5 h-2.5 rounded-full ${
            dot <= level ? 'bg-white' : 'bg-white/25'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 font-sans text-sm leading-relaxed min-h-[297mm]">
      <div className="flex min-h-[297mm]">

        {/* ===== LEFT SIDEBAR (Dark Blue) ===== */}
        <div 
          className="w-[220px] shrink-0 text-white p-0 flex flex-col"
          style={{ backgroundColor: sidebarColor }}
        >
          {/* Photo */}
          {personalInfo.photoUrl && (
            <div className="p-6 pb-4">
              <Image
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`}
                width={180}
                height={200}
                className="w-full h-auto object-cover rounded-sm"
              />
            </div>
          )}

          <div className="px-6 pb-6 space-y-5 flex-1">
            {/* Profil / Contact */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 pb-1 border-b border-white/20">{getSectionTitle('summary', undefined, lang)}</h2>
              <div className="space-y-2 text-xs text-white/90">
                {personalInfo.address && (
                  <div>
                    <p className="font-bold text-white/60 text-[10px] uppercase tracking-wider">Adresse</p>
                    <p>{personalInfo.address}</p>
                  </div>
                )}
                {personalInfo.email && (
                  <div>
                    <p className="font-bold text-white/60 text-[10px] uppercase tracking-wider">Email</p>
                    <p className="break-all">{personalInfo.email}</p>
                  </div>
                )}
                {personalInfo.phone && (
                  <div>
                    <p className="font-bold text-white/60 text-[10px] uppercase tracking-wider">Téléphone</p>
                    <p>{personalInfo.phone}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Compétences with dots */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 pb-1 border-b border-white/20">
                  {getSectionTitle('skills', undefined, lang) || 'COMPÉTENCES'}
                </h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-white/90 truncate">{skill.name}</span>
                      {renderDots(skill.level)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Langues */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 pb-1 border-b border-white/20">
                  {getSectionTitle('languages', undefined, lang) || 'LANGUES'}
                </h2>
                <div className="space-y-1.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between text-xs">
                      <span className="text-white/90">{lang.name}</span>
                      <span className="text-white/50">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Loisirs */}
            {hobbies.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 pb-1 border-b border-white/20">
                  {getSectionTitle('hobbies', undefined, lang) || 'LOISIRS'}
                </h2>
                <div className="space-y-1.5">
                  {hobbies.map((hobby) => (
                    <div key={hobby.id} className="flex items-center gap-2 text-xs text-white/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      <span>{hobby.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Qualités */}
            {qualities.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3 pb-1 border-b border-white/20">
                  {getSectionTitle('qualities', undefined, lang)}
                </h2>
                <div className="space-y-1.5">
                  {qualities.map((q) => (
                    <div key={q.id} className="flex items-center gap-2 text-xs text-white/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      <span>{q.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ===== RIGHT COLUMN (Main Content) ===== */}
        <div className="flex-1 flex flex-col">

          {/* Name Header Band */}
          <div 
            className="text-center py-6 px-8 text-white"
            style={{ backgroundColor: `${sidebarColor}dd` }}
          >
            <h1 className="text-2xl font-bold tracking-wide uppercase">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-sm mt-1 tracking-widest uppercase text-white/80">
              {personalInfo.title}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 flex-1 space-y-6">

            {/* Summary */}
            {personalInfo.summary && (
              <p className="text-sm text-slate-600 leading-relaxed ">
                {personalInfo.summary}
              </p>
            )}

            {/* Expériences */}
            {experiences.length > 0 && (
              <section>
                <h2 
                  className="text-sm font-bold uppercase tracking-widest text-center py-1.5 px-4 border-2 mb-4"
                  style={{ borderColor: sidebarColor, color: sidebarColor }}
                >
                  {getSectionTitle('experience', undefined, lang) || 'EXPÉRIENCES PROFESSIONNELLES'}
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      {/* Date column */}
                      <div className="w-[80px] shrink-0 text-right">
                        <p className="text-xs font-semibold" style={{ color: sidebarColor }}>
                          {exp.startDate}
                        </p>
                        <p className="text-xs text-slate-400">
                          {exp.current ? getPresentLabel(lang) : exp.endDate}
                        </p>
                      </div>
                      {/* Content */}
                      <div className="flex-1 border-l-2 pl-4" style={{ borderColor: `${sidebarColor}30` }}>
                        <h3 className="font-bold text-sm text-slate-900">
                          {exp.position} — <span className="font-semibold">{exp.company}</span>
                        </h3>
                        {exp.description && (
                          <p className="text-sm text-slate-600 mt-1  leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Formations / Education */}
            {education.length > 0 && (
              <section>
                <h2 
                  className="text-sm font-bold uppercase tracking-widest text-center py-1.5 px-4 border-2 mb-4"
                  style={{ borderColor: sidebarColor, color: sidebarColor }}
                >
                  {getSectionTitle('education', undefined, lang) || 'FORMATIONS'}
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      {/* Date column */}
                      <div className="w-[80px] shrink-0 text-right">
                        <p className="text-xs font-semibold" style={{ color: sidebarColor }}>
                          {edu.startDate}
                        </p>
                        <p className="text-xs text-slate-400">{edu.endDate}</p>
                      </div>
                      {/* Content */}
                      <div className="flex-1 border-l-2 pl-4" style={{ borderColor: `${sidebarColor}30` }}>
                        <h3 className="font-bold text-sm text-slate-900">{edu.degree}</h3>
                        <p className="text-xs text-slate-600 font-semibold">{edu.institution}</p>
                        {edu.field && <p className="text-xs text-slate-500 mt-0.5">{edu.field}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional sections */}
            <CVCertifications certifications={certifications} variant="professional" accentColor={sidebarColor} title={getSectionTitle('certifications', undefined, lang)} />
            <CVProjects projects={projects} variant="professional" accentColor={sidebarColor}  title={getSectionTitle('projects', undefined, lang)} />
            <CVReferences references={references} variant="professional" accentColor={sidebarColor}  title={getSectionTitle('references', undefined, lang)} />
            <CVDivers divers={divers} variant="professional" accentColor={sidebarColor}  title={getSectionTitle('divers', undefined, lang)} />
            <CVFooter footer={footer} variant="professional"  lang={lang}/>
          </div>
        </div>
      </div>
    </div>
  );
}
