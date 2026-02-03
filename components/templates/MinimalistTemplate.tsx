'use client';

import { CV } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter 
} from '@/components/cv-sections';
import { getAccentColor } from '@/components/cv-sections/styles';

interface TemplateProps {
  cv: CV;
}

export function MinimalistTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  
  const accentColor = getAccentColor('professional', cv.settings?.accentColor);
  const variant = 'professional';

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
            <img 
              src={personalInfo.photoUrl} 
              alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
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
        <CVSummary summary={personalInfo.summary} variant={variant} accentColor={accentColor} />
        <CVExperience experiences={experiences} variant={variant} accentColor={accentColor} />
        <CVEducation education={education} variant={variant} accentColor={accentColor} />
        
        {/* Skills inline */}
        {skills.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b pb-2 mb-3"
              style={{ borderColor: accentColor }}
            >
              Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1 text-xs rounded-full"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {/* Languages inline */}
        {languages.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b pb-2 mb-3"
              style={{ borderColor: accentColor }}
            >
              Langues
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {languages.map((lang) => (
                <span key={lang.id} className="text-slate-700">
                  <strong>{lang.name}</strong> — {lang.level}
                </span>
              ))}
            </div>
          </section>
        )}
        
        <CVCertifications certifications={certifications} variant={variant} accentColor={accentColor} />
        <CVProjects projects={projects} variant={variant} accentColor={accentColor} />
        <CVReferences references={references} variant={variant} accentColor={accentColor} />
        <CVDivers divers={divers} variant={variant} accentColor={accentColor} />
        <CVFooter footer={footer} variant={variant} />
      </main>
    </div>
  );
}
