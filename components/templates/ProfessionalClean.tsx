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

export function ProfessionalClean({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'professional';

  return (
    <div className="cv-template w-full h-full bg-white text-slate-800 font-sans p-12 min-h-[297mm] flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-8 mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-4">{personalInfo.title}</p>
          <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="horizontal" />
        </header>

        {/* Content */}
        <div className="space-y-8">
          <CVSummary summary={personalInfo.summary} variant={variant} />
          <CVExperience experiences={experiences} variant={variant} />
          <CVEducation education={education} variant={variant} />
          
          {/* Skills & Languages side by side */}
          <div className="grid grid-cols-2 gap-8">
            <CVSkills skills={skills} variant={variant} layout="list" />
            <CVLanguages languages={languages} variant={variant} />
          </div>

          <CVCertifications certifications={certifications} variant={variant} />
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
