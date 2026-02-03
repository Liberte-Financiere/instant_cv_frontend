'use client';

import { CV } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter 
} from '@/components/cv-sections';

interface TemplateProps {
  cv: CV;
}

export function ExecutiveCorporate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'executive';

  return (
    <div className="cv-template w-full h-full bg-white text-black font-serif p-12 min-h-[297mm] leading-snug flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2 border-b-2 border-black inline-block pb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg font-medium mt-4">{personalInfo.title}</p>
          <div className="mt-4">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="horizontal" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <CVSummary summary={personalInfo.summary} variant={variant} />
          <CVExperience experiences={experiences} variant={variant} />
          <CVEducation education={education} variant={variant} />
          <CVCertifications certifications={certifications} variant={variant} />
          
          {/* Skills & Languages */}
          <div className="grid grid-cols-2 gap-8">
            <CVSkills skills={skills} variant={variant} layout="list" />
            <CVLanguages languages={languages} variant={variant} />
          </div>

          <CVProjects projects={projects} variant={variant} />
          <CVHobbies hobbies={hobbies} variant={variant} />
          <CVReferences references={references} variant={variant} />
          <CVDivers divers={divers} variant={variant} />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} />
    </div>
  );
}
