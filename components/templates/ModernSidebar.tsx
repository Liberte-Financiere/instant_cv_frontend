'use client';

import Image from "next/image";
import { CV, CVSectionId, DEFAULT_SECTION_ORDER } from '@/types/cv';
import { 
  CVContact, CVSummary, CVExperience, CVEducation, 
  CVCertifications, 
  CVProjects, CVReferences, CVDivers, CVFooter, CVQualities 
} from '@/components/cv-sections';
import { getAccentColor } from '@/components/cv-sections/styles';

import { getSectionTitle } from '@/constants/sections';

interface TemplateProps {
  cv: CV;
}

export function ModernSidebar({ cv }: TemplateProps) {
  const personalInfo = cv.personalInfo || {};
  const { experiences = [], education = [], skills = [], languages = [] } = cv;
  const hobbies = cv.hobbies || [];
  const certifications = cv.certifications || [];
  const projects = cv.projects || [];
  const references = cv.references || [];
  const socialLinks = cv.socialLinks || [];
  const divers = cv.divers || '';
  const footer = cv.footer || { showFooter: false, madeAt: '', madeDate: '' };
  const lang = cv.settings?.language || 'fr';
  
  const accentColor = getAccentColor('modern', cv.settings?.accentColor);
  const sidebarColor = cv.settings?.sidebarColor || '#0f172a'; // Default to Slate 900
  const tagsColor = cv.settings?.tagsColor || 'transparent';

  const sectionOrder: CVSectionId[] = cv.sectionOrder || [...DEFAULT_SECTION_ORDER];
  const SIDEBAR_SECTIONS: CVSectionId[] = ['skills', 'languages', 'hobbies'];
  const MAIN_SECTIONS: CVSectionId[] = ['summary', 'experience', 'education', 'certifications', 'projects', 'qualities', 'references', 'divers'];
  const sidebarOrder = sectionOrder.filter(s => SIDEBAR_SECTIONS.includes(s));
  const mainOrder = sectionOrder.filter(s => MAIN_SECTIONS.includes(s));
  
  // Fonction pour déterminer si une couleur hex est claire
  const isColorLight = (color: string) => {
    if (!color || color === 'transparent') return false;
    const hex = color.replace('#', '');
    if (hex.length !== 6 && hex.length !== 3) return false;
    const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2]+hex[2] : hex.substring(4, 6), 16);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 160; // Seuil de clarté
  };

  const isTagsTransparent = tagsColor === 'transparent';
  const tagTextColorClass = isTagsTransparent 
    ? 'text-white/90' 
    : (isColorLight(tagsColor) ? 'text-slate-800' : 'text-white');
  const tagBgClass = isTagsTransparent ? 'bg-black/20' : '';

  const variant = 'modern';

  return (
    <div className="cv-template w-full h-full text-slate-800 font-sans text-sm leading-relaxed flex flex-col min-h-[297mm] bg-white print:bg-transparent">
      <style>{`
        @media print {
          @page {
            margin: 0 !important;
          }
          html, body {
            background: linear-gradient(to right, ${sidebarColor} 0%, ${sidebarColor} 30%, white 30%, white 100%) !important;
          }
          /* Empêche le texte de coller au bord lors d'un saut de page */
          .cv-template section, .cv-item {
            border-top: 10mm solid transparent !important;
            margin-top: -10mm !important;
            background-clip: padding-box !important;
          }
        }
      `}</style>
      
      <div className="flex flex-col sm:flex-row flex-1">
        {/* Sidebar (Left Column) */}
        <div 
          className="w-full sm:w-[30%] text-white p-5 space-y-5 flex-shrink-0 print:text-white print:bg-transparent"
          style={{ backgroundColor: sidebarColor }}
        >          {/* Avatar & Name */}
          <div className="text-center sm:text-left">
             {personalInfo.photoUrl ? (
               <Image 
                 src={personalInfo.photoUrl} 
                 alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                 width={96}
                 height={96}
                 className="w-24 h-24 mx-auto sm:mx-0 rounded-full object-cover mb-6 ring-4 ring-black/10 ring-offset-2 ring-offset-transparent"
               />
             ) : (
               <div 
                 className={`w-24 h-24 mx-auto sm:mx-0 rounded-full flex items-center justify-center text-3xl font-bold mb-6 ring-4 ring-black/10 ring-offset-2 ring-offset-transparent ${tagBgClass}`}
                 style={{ color: accentColor, backgroundColor: !isTagsTransparent ? tagsColor : undefined }}
               >
                 {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
               </div>
             )}
             
             <h1 className="text-2xl font-bold leading-tight mb-2">
               {personalInfo.firstName} <br /> {personalInfo.lastName}
             </h1>
             <p className="font-medium text-sm uppercase tracking-wider" style={{ color: accentColor }}>
               {personalInfo.title}
             </p>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
             <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">{getSectionTitle('contact', cv.settings, lang)}</h3>
             <CVContact personalInfo={personalInfo} socialLinks={socialLinks} variant={variant} layout="sidebar" accentColor={accentColor} />
          </div>

          {/* Sidebar sections in user-defined order */}
          {sidebarOrder.map((sectionId) => {
            switch (sectionId) {
              case 'skills':
                return skills.length > 0 ? (
                  <div key={sectionId}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">{getSectionTitle('skills', cv.settings, lang)}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span 
                          key={skill.id || index} 
                          className={`px-3 py-1.5 rounded text-xs font-medium ${tagBgClass} ${tagTextColorClass}`}
                          style={{ backgroundColor: !isTagsTransparent ? tagsColor : undefined }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;

              case 'languages':
                return languages.length > 0 ? (
                  <div key={sectionId}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">{getSectionTitle('languages', cv.settings, lang)}</h3>
                    <div className="space-y-3">
                      {languages.map((lang, index) => (
                        <div key={lang.id || index} className="flex justify-between items-center text-sm">
                          <span className="text-white/90">{lang.name}</span>
                          <span className="text-xs text-white/60 font-medium">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case 'hobbies':
                return hobbies.length > 0 ? (
                  <div key={sectionId}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">{getSectionTitle('hobbies', cv.settings, lang)}</h3>
                    <div className="flex flex-wrap gap-2">
                      {hobbies.map((hobby, index) => (
                        <span 
                          key={hobby.id || index} 
                          className={`px-3 py-1.5 rounded text-xs font-medium ${tagBgClass} ${tagTextColorClass}`}
                          style={{ backgroundColor: !isTagsTransparent ? tagsColor : undefined }}
                        >
                          {hobby.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;

              default:
                return null;
            }
          })}
        </div>

        {/* Main sections in user-defined order */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 bg-white">
          {mainOrder.map((sectionId) => {
            switch (sectionId) {
              case 'summary':
                return <CVSummary key={sectionId} summary={personalInfo.summary} variant={variant} accentColor={accentColor} title={getSectionTitle('summary', cv.settings, lang)} />;
              case 'experience':
                return <CVExperience key={sectionId} experiences={experiences} variant={variant} accentColor={accentColor} title={getSectionTitle('experience', cv.settings, lang)} lang={lang} />;
              case 'education':
                return <CVEducation key={sectionId} education={education} variant={variant} accentColor={accentColor} title={getSectionTitle('education', cv.settings, lang)} lang={lang} />;
              case 'certifications':
                return <CVCertifications key={sectionId} certifications={certifications} variant={variant} accentColor={accentColor} title={getSectionTitle('certifications', cv.settings, lang)} />;
              case 'projects':
                return <CVProjects key={sectionId} projects={projects} variant={variant} accentColor={accentColor} title={getSectionTitle('projects', cv.settings, lang)} />;
              case 'qualities':
                return <CVQualities key={sectionId} qualities={cv.qualities || []} variant={variant} accentColor={accentColor} title={getSectionTitle('qualities', cv.settings, lang)} />;
              case 'references':
                return <CVReferences key={sectionId} references={references} variant={variant} accentColor={accentColor} title={getSectionTitle('references', cv.settings, lang)} />;
              case 'divers':
                return <CVDivers key={sectionId} divers={divers} variant={variant} accentColor={accentColor} title={getSectionTitle('divers', cv.settings, lang)} />;
              default:
                return null;
            }
          })}
          <CVFooter footer={footer} variant={variant} lang={lang} />
        </div>
      </div>
    </div>
  );
}
