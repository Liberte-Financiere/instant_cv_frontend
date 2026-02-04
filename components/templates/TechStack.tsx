'use client';

import { CV } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';

import { SECTION_TITLES } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

export function TechStack({ cv }: TemplateProps) {
  // ... (skipping destructuring)

  return (
    <div className="cv-template w-full h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm min-h-[297mm] p-8 flex flex-col">
      <div className="flex-1">
        {/* ... (skipping Header) ... */}

        {/* Main Content */}
        <div className="space-y-8">
          <CVSummary summary={personalInfo.summary} variant={variant} title="/* About */" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <CVSkills skills={skills} variant={variant} layout="tags" title="// skills" />
            </div>
            <div>
              <CVLanguages languages={languages} variant={variant} title="// languages" />
            </div>
          </div>

          <CVExperience experiences={experiences} variant={variant} title="/* Experience */" />
          <CVEducation education={education} variant={variant} title={`/* ${SECTION_TITLES.education} */`} />
          <CVProjects projects={projects} variant={variant} title="/* Projects */" />
          <CVCertifications certifications={certifications} variant={variant} title={`/* ${SECTION_TITLES.certifications} */`} />
          <CVQualities qualities={qualities} variant={variant} title={`/* ${SECTION_TITLES.qualities} */`} />
          <CVHobbies hobbies={hobbies} variant={variant} title="/* Interests */" />
          <CVReferences references={references} variant={variant} title="/* References */" showContact={false} />
          <CVDivers divers={divers} variant={variant} title="/* Notes */" />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} />
    </div>
  );
}
