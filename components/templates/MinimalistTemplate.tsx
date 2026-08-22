'use client';

import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVCertifications, CVHobbies,
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';
import { getAccentColor } from '@/components/cv-sections/styles';
import { getSectionTitle } from '@/constants/sections';
import { groupSkillsByCategory } from '@/lib/utils';
interface TemplateProps {
  cv: CV;
}

export function MinimalistTemplate({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  
  const accentColor = getAccentColor('professional', cv.settings?.accentColor);
  const variant = 'professional';
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 font-sans text-sm leading-relaxed min-h-[297mm]">
      {/* Clean Header */}
      <header className="px-10 pt-10 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">
              {personalInfo.firstName} <span className="font-bold">{personalInfo.lastName}</span>
            </h1>
            <p className="text-lg mt-1" style={{ color: accentColor }}>
              {personalInfo.title}
            </p>
          </div>
          {personalInfo.photoUrl && (
            <Image 
              src={personalInfo.photoUrl} 
              alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: accentColor }}
            />
          )}
        </div>
        
        {/* Contact inline */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {socialLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: accentColor }}
            >
              {link.label || link.platform}
            </a>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="px-10 py-6 space-y-6">
        {/* Dynamic Content */}
        {sectionOrder.map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return <CVSummary key={sectionId} summary={personalInfo.summary} variant={variant} accentColor={accentColor} title={getSectionTitle('summary', cv.settings, lang)} />;
            case 'experience':
              return <CVExperience key={sectionId} experiences={experiences} variant={variant} accentColor={accentColor} title={getSectionTitle('experience', cv.settings, lang)} lang={lang} />;
            case 'education':
              return <CVEducation key={sectionId} education={education} variant={variant} accentColor={accentColor} title={getSectionTitle('education', cv.settings, lang)} lang={lang} />;
            case 'skills': {
              if (skills.length === 0) return null;
              const groupedSkills = groupSkillsByCategory(skills);
              return (
                <section key={sectionId}>
                  <h2 
                    className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b pb-2 mb-3"
                    style={{ borderColor: accentColor }}
                  >{getSectionTitle('skills', cv.settings, lang)}</h2>
                  <div className="space-y-4">
                    {groupedSkills.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-2">
                        {group.category && (
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{group.category}</h3>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((skill) => (
                            <span 
                              key={skill.id} 
                              className="px-3 py-1 text-xs rounded-full"
                              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            case 'qualities':
              return cv.qualities && cv.qualities.length > 0 ? (
                <section key={sectionId}>
                  <h2 
                    className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b pb-2 mb-3"
                    style={{ borderColor: accentColor }}
                  >
                    {getSectionTitle('qualities', cv.settings, lang)}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {cv.qualities.map((quality) => (
                      <span 
                        key={quality.id} 
                        className="px-3 py-1 text-xs rounded-full"
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                      >
                        {quality.name}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null;
            case 'languages':
              return languages.length > 0 ? (
                <section key={sectionId}>
                  <h2 
                    className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b pb-2 mb-3"
                    style={{ borderColor: accentColor }}
                  >{getSectionTitle('languages', cv.settings, lang)}</h2>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {languages.map((lang) => (
                      <span key={lang.id} className="text-slate-700">
                        <strong>{lang.name}</strong> — {lang.level}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null;
            case 'certifications':
              return <CVCertifications key={sectionId} certifications={certifications} variant={variant} accentColor={accentColor} title={getSectionTitle('certifications', cv.settings, lang)} />;
            case 'projects':
              return <CVProjects key={sectionId} projects={projects} variant={variant} accentColor={accentColor} title={getSectionTitle('projects', cv.settings, lang)} />;
            case 'hobbies':
              return <CVHobbies key={sectionId} hobbies={hobbies} variant={variant} accentColor={accentColor} title={getSectionTitle('hobbies', cv.settings, lang)} />;
            case 'references':
              return <CVReferences key={sectionId} references={references} variant={variant} accentColor={accentColor} title={getSectionTitle('references', cv.settings, lang)} />;
            case 'divers':
              return <CVDivers key={sectionId} divers={divers} variant={variant} accentColor={accentColor} title={getSectionTitle('divers', cv.settings, lang)} />;
            default:
              return null;
          }
        })}
        <CVFooter footer={footer} variant={variant}  lang={lang}/>
      </main>
    </div>
  );
}
