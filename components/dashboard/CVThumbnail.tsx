'use client';

import { memo } from 'react';
import { CV } from '@/types/cv';
import dynamic from 'next/dynamic';

// Dynamic imports for templates
const ModernSidebar = dynamic(() => import('@/components/templates/ModernSidebar').then(mod => mod.ModernSidebar));
const ProfessionalClean = dynamic(() => import('@/components/templates/ProfessionalClean').then(mod => mod.ProfessionalClean));
const ExecutiveCorporate = dynamic(() => import('@/components/templates/ExecutiveCorporate').then(mod => mod.ExecutiveCorporate));
const CreativeGrid = dynamic(() => import('@/components/templates/CreativeGrid').then(mod => mod.CreativeGrid));
const TechStack = dynamic(() => import('@/components/templates/TechStack').then(mod => mod.TechStack));
const MinimalistTemplate = dynamic(() => import('@/components/templates/MinimalistTemplate').then(mod => mod.MinimalistTemplate));
const ATSFriendlyTemplate = dynamic(() => import('@/components/templates/ATSFriendlyTemplate').then(mod => mod.ATSFriendlyTemplate));
const ATSGlacier = dynamic(() => import('@/components/templates/ATSGlacier').then(mod => mod.ATSGlacier));
const ATSIron = dynamic(() => import('@/components/templates/ATSIron').then(mod => mod.ATSIron));
const ElegantPhoto = dynamic(() => import('@/components/templates/ElegantPhoto').then(mod => mod.ElegantPhoto));
const CorporateBlue = dynamic(() => import('@/components/templates/CorporateBlue').then(mod => mod.CorporateBlue));
const CleanGrid = dynamic(() => import('@/components/templates/CleanGrid').then(mod => mod.CleanGrid));
const Swiss = dynamic(() => import('@/components/templates/Swiss').then(mod => mod.Swiss));
const GradientHeader = dynamic(() => import('@/components/templates/GradientHeader').then(mod => mod.GradientHeader));
const TimelinePro = dynamic(() => import('@/components/templates/TimelinePro').then(mod => mod.TimelinePro));
const BoldHeader = dynamic(() => import('@/components/templates/BoldHeader').then(mod => mod.BoldHeader));
const ClassicSerif = dynamic(() => import('@/components/templates/ClassicSerif').then(mod => mod.ClassicSerif));
const Infographic = dynamic(() => import('@/components/templates/Infographic').then(mod => mod.Infographic));
const PastelModern = dynamic(() => import('@/components/templates/PastelModern').then(mod => mod.PastelModern));
const BlueprintPremium = dynamic(() => import('@/components/templates/BlueprintPremium').then(mod => mod.BlueprintPremium));

interface CVThumbnailProps {
  cv: CV;
  scale?: number;
}

export const CVThumbnail = memo(function CVThumbnail({ cv, scale = 0.15 }: CVThumbnailProps) {
  const renderTemplate = () => {
    switch (cv.templateId) {
      case 'modern': return <ModernSidebar cv={cv} />;
      case 'professional': return <ProfessionalClean cv={cv} />;
      case 'executive': return <ExecutiveCorporate cv={cv} />;
      case 'creative': return <CreativeGrid cv={cv} />;
      case 'tech': return <TechStack cv={cv} />;
      case 'minimalist': return <MinimalistTemplate cv={cv} />;
      case 'ats': return <ATSFriendlyTemplate cv={cv} />;
      case 'ats-glacier': return <ATSGlacier cv={cv} />;
      case 'ats-iron': return <ATSIron cv={cv} />;
      case 'elegant-photo': return <ElegantPhoto cv={cv} />;
      case 'corporate-blue': return <CorporateBlue cv={cv} />;
      case 'clean-grid': return <CleanGrid cv={cv} />;
      case 'swiss': return <Swiss cv={cv} />;
      case 'gradient': return <GradientHeader cv={cv} />;
      case 'timeline': return <TimelinePro cv={cv} />;
      case 'bold-header': return <BoldHeader cv={cv} />;
      case 'classic-serif': return <ClassicSerif cv={cv} />;
      case 'infographic': return <Infographic cv={cv} />;
      case 'pastel': return <PastelModern cv={cv} />;
      case 'blueprint-premium': return <BlueprintPremium cv={cv} />;
      default: return <ModernSidebar cv={cv} />;
    }
  };

  return (
    <div 
      className="bg-white origin-top-left pointer-events-none select-none shadow-sm relative overflow-hidden"
      style={{ 
        width: '210mm', 
        height: '297mm',
        transform: `scale(${scale})`,
        marginBottom: `-${(1 - scale) * 297}mm`,
        marginRight: `-${(1 - scale) * 210}mm`,
        contain: 'paint' // Paint containment prevents pixels from bleeding out
      }}
    >
      {renderTemplate()}
      
      {/* Gradient Fade Overlay at the bottom to resolve potential text cut-off gracefully */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}, (prev, next) => {
  // Uniquement re-rendre si les données pertinentes pour l'aperçu changent
  return (
    prev.cv.updatedAt === next.cv.updatedAt && 
    prev.cv.templateId === next.cv.templateId && 
    prev.scale === next.scale
  );
});
