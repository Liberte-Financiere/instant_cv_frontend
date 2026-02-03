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

export function TechStack({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'tech';

  return (
    <div className="cv-template w-full h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm min-h-[297mm] p-8 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-gray-700 pb-6 mb-8 flex justify-between items-end">
          <div>
            <p className="text-green-500 text-xs mb-1">// developer profile</p>
            <h1 className="text-3xl font-bold text-white">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-green-400 mt-1">&gt; {personalInfo.title}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="vertical" />
          </div>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content (2/3) */}
          <div className="col-span-2 space-y-8">
            <CVSummary summary={personalInfo.summary} variant={variant} title="/* About */" />
            <CVExperience experiences={experiences} variant={variant} title="/* Experience */" />
            <CVEducation education={education} variant={variant} title="/* Education */" />
            <CVProjects projects={projects} variant={variant} title="/* Projects */" />
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-8 border-l border-gray-700 pl-8">
            <CVSkills skills={skills} variant={variant} title="// skills" layout="tags" />
            <CVLanguages languages={languages} variant={variant} title="// languages" />
            <CVCertifications certifications={certifications} variant={variant} title="// certifications" />
            <CVHobbies hobbies={hobbies} variant={variant} title="// interests" />
            <CVReferences references={references} variant={variant} title="// references" showContact={false} />
          </div>
        </div>

        <div className="mt-8">
          <CVDivers divers={divers} variant={variant} title="/* Notes */" />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} />
    </div>
  );
}
