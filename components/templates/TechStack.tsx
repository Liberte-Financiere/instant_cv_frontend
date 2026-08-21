'use client';

import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVSkills, CVLanguages, CVHobbies, CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';

import { getSectionTitle } from '@/constants/sections';
import { getAccentColor } from '@/components/cv-sections/styles';

interface TemplateProps {
  cv: CV;
}

export function TechStack({ cv }: TemplateProps) {
  const lang = cv.settings?.language || 'fr';
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const qualities = cv.qualities || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };

  const variant = 'tech';
  const accentColor = getAccentColor(variant, cv.settings?.accentColor);
  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];

  return (
    <div className="cv-template w-full h-full bg-zinc-900 text-gray-300 font-mono text-sm min-h-[297mm] p-8 flex flex-col">
      <style>{`
        @media print {
          @page {
            margin: 0 !important;
          }
          html, body {
            background-color: #18181b !important;
          }
          .cv-template {
            padding-top: 15mm !important;
            padding-bottom: 15mm !important;
          }
          
          /* Hack CSS magique : empêche le texte de coller au bord lors d'un saut de page */
          /* On ajoute une bordure transparente qui sert de "marge interne" au saut de page */
          /* et un margin-top négatif qui l'annule au milieu de la page ! */
          .cv-template section, .cv-item {
            border-top: 15mm solid transparent !important;
            margin-top: -15mm !important;
            background-clip: padding-box !important;
          }
        }
      `}</style>
      
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-gray-700 pb-6 mb-8 flex justify-between items-end">
          <div>
            <p className="text-xs mb-1" style={{ color: accentColor }}>{`// ${getSectionTitle('summary', cv.settings, lang).toLowerCase()}`}</p>
            <h1 className="text-3xl font-bold text-white">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="mt-1" style={{ color: accentColor }}>&gt; {personalInfo.title}</p>
            )}
          </div>
          <div className="text-right text-xs text-gray-500">
            <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="vertical" accentColor={accentColor} />
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {sectionOrder.map((sectionId) => {
            switch (sectionId) {
              case 'summary':
                return <CVSummary key={sectionId} summary={personalInfo.summary} variant={variant} title={`/* ${getSectionTitle('summary', cv.settings, lang)} */`} accentColor={accentColor} />;
              case 'skills':
                return skills.length > 0 ? (
                  <CVSkills key={sectionId} skills={skills} variant={variant} layout="tags" title={`// ${getSectionTitle('skills', cv.settings, lang).toLowerCase()}`} accentColor={accentColor} />
                ) : null;
              case 'languages':
                return languages.length > 0 ? (
                  <CVLanguages key={sectionId} languages={languages} variant={variant} title={`// ${getSectionTitle('languages', cv.settings, lang).toLowerCase()}`} accentColor={accentColor} />
                ) : null;
              case 'experience':
                return <CVExperience key={sectionId} experiences={experiences} variant={variant} title={`/* ${getSectionTitle('experience', cv.settings, lang)} */`} lang={lang} accentColor={accentColor} />;
              case 'education':
                return <CVEducation key={sectionId} education={education} variant={variant} title={`/* ${getSectionTitle('education', cv.settings, lang)} */`} lang={lang} accentColor={accentColor} />;
              case 'projects':
                return <CVProjects key={sectionId} projects={projects} variant={variant} title={`/* ${getSectionTitle('projects', cv.settings, lang)} */`} accentColor={accentColor} />;
              case 'certifications':
                return <CVCertifications key={sectionId} certifications={certifications} variant={variant} title={`/* ${getSectionTitle('certifications', cv.settings, lang)} */`} accentColor={accentColor} />;
              case 'qualities':
                return <CVQualities key={sectionId} qualities={qualities} variant={variant} title={`/* ${getSectionTitle('qualities', cv.settings, lang)} */`} accentColor={accentColor} />;
              case 'hobbies':
                return <CVHobbies key={sectionId} hobbies={hobbies} variant={variant} title={`/* ${getSectionTitle('hobbies', cv.settings, lang)} */`} accentColor={accentColor} />;
              case 'references':
                return <CVReferences key={sectionId} references={references} variant={variant} title={`/* ${getSectionTitle('references', cv.settings, lang)} */`} showContact={false} accentColor={accentColor} />;
              case 'divers':
                return <CVDivers key={sectionId} divers={divers} variant={variant} title={`/* ${getSectionTitle('divers', cv.settings, lang)} */`} accentColor={accentColor} />;
              default:
                return null;
            }
          })}
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} lang={lang} accentColor={accentColor} />
    </div>
  );
}
