'use client';

import { CV } from '@/types/cv';
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
          <CVSummary summary={personalInfo.summary} variant={variant} title={`/* ${getSectionTitle('summary', cv.settings, lang)} */`} accentColor={accentColor} />

          {(skills.length > 0 || languages.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.length > 0 && (
                <div>
                  <CVSkills skills={skills} variant={variant} layout="tags" title={`// ${getSectionTitle('skills', cv.settings, lang).toLowerCase()}`} accentColor={accentColor} />
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <CVLanguages languages={languages} variant={variant} title={`// ${getSectionTitle('languages', cv.settings, lang).toLowerCase()}`} accentColor={accentColor} />
                </div>
              )}
            </div>
          )}

          <CVExperience experiences={experiences} variant={variant} title={`/* ${getSectionTitle('experience', cv.settings, lang)} */`} lang={lang} accentColor={accentColor} />
          <CVEducation education={education} variant={variant} title={`/* ${getSectionTitle('education', cv.settings, lang)} */`} lang={lang} accentColor={accentColor} />
          <CVProjects projects={projects} variant={variant} title={`/* ${getSectionTitle('projects', cv.settings, lang)} */`} accentColor={accentColor} />
          <CVCertifications certifications={certifications} variant={variant} title={`/* ${getSectionTitle('certifications', cv.settings, lang)} */`} accentColor={accentColor} />
          <CVQualities qualities={qualities} variant={variant} title={`/* ${getSectionTitle('qualities', cv.settings, lang)} */`} accentColor={accentColor} />
          <CVHobbies hobbies={hobbies} variant={variant} title={`/* ${getSectionTitle('hobbies', cv.settings, lang)} */`} accentColor={accentColor} />
          <CVReferences references={references} variant={variant} title={`/* ${getSectionTitle('references', cv.settings, lang)} */`} showContact={false} accentColor={accentColor} />
          <CVDivers divers={divers} variant={variant} title={`/* ${getSectionTitle('divers', cv.settings, lang)} */`} accentColor={accentColor} />
        </div>
      </div>

      <CVFooter footer={footer} variant={variant} lang={lang} accentColor={accentColor} />
    </div>
  );
}
