'use client';

import { CV } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';
import { getAccentColor } from '@/components/cv-sections/styles';

import { SECTION_TITLES } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

export function MinimalistTemplate({ cv }: TemplateProps) {
  // ... (skipping destructuring)

  return (
    <div className="cv-template w-full h-full bg-white text-slate-900 font-sans text-sm leading-relaxed min-h-[297mm]">
      {/* ... (skipping Header) ... */}

      {/* Content */}
      <main className="px-10 py-6 space-y-6">
        <CVSummary summary={personalInfo.summary} variant={variant} accentColor={accentColor} />
        <CVExperience experiences={experiences} variant={variant} accentColor={accentColor} />
        <CVEducation education={education} variant={variant} accentColor={accentColor} title={SECTION_TITLES.education} />
        
        {/* Skills inline */}
        {/* ... */}
        
        {/* Qualities inline */}
        {cv.qualities && cv.qualities.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b pb-2 mb-3"
              style={{ borderColor: accentColor }}
            >
              {SECTION_TITLES.qualities}
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
        )}

        {/* Languages inline */}
        {/* ... */}
        
        <CVCertifications certifications={certifications} variant={variant} accentColor={accentColor} title={SECTION_TITLES.certifications} />
        <CVProjects projects={projects} variant={variant} accentColor={accentColor} />
        <CVReferences references={references} variant={variant} accentColor={accentColor} />
        <CVDivers divers={divers} variant={variant} accentColor={accentColor} />
        <CVFooter footer={footer} variant={variant} />
      </main>
    </div>
  );
}
