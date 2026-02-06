import React from 'react';
import { CoverLetter } from '@/store/useCoverLetterStore';

interface LetterPreviewProps {
  coverLetter: CoverLetter;
  className?: string; // Allow passing external styles (shadows, margins, etc.)
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ coverLetter, className }) => {
  return (
    <div 
      className={`bg-white p-[16mm] flex flex-col font-serif text-slate-800 text-[11pt] leading-relaxed relative z-10 ${className || ''}`}
    >
      {/* Header Info */}
      <div className="flex justify-between mb-6">
          <div className="text-sm space-y-1">
             <p className="font-bold text-lg text-slate-900 tracking-tight">{coverLetter.content.sender.firstName} {coverLetter.content.sender.lastName}</p>
             <p className="text-slate-600 whitespace-pre-line">{coverLetter.content.sender.address}</p>
             <p className="text-slate-600">{coverLetter.content.sender.phone}</p>
             <p className="text-slate-600">{coverLetter.content.sender.email}</p>
          </div>
          <div className="text-sm text-right mt-26 space-y-1">
             <p className="font-bold text-slate-900">{coverLetter.content.recipient.company}</p>
             <p className="text-slate-600">{coverLetter.content.recipient.name}</p>
             <p className="whitespace-pre-line text-slate-600">{coverLetter.content.recipient.address}</p>
          </div>
      </div>

      {/* Date & Location */}
      <p className="text-right text-sm mb-8 text-slate-600">
         Fait à <span className="font-medium text-slate-900">{coverLetter.content.details.location || '...'}</span>, le {coverLetter.content.details.date}
      </p>

      {/* Subject */}
      {coverLetter.content.details.subject && (
         <div className="mb-8  ">
             <p className="font-bold text-slate-900">Objet : {coverLetter.content.details.subject}</p>
         </div>
      )}

      {/* Body */}
      <div className="space-y-6 text-justify">
         <p>{coverLetter.content.details.salutation}</p>
         <div className="text-slate-700">
           {coverLetter.content.details.body ? (
             coverLetter.content.details.body.split(/\n+/).map((paragraph, index) => (
               <p key={index} className="mb-4 last:mb-0 min-h-[1rem]">
                 {paragraph}
               </p>
             ))
           ) : (
             <span className="text-slate-300 italic">Le contenu de votre lettre apparaîtra ici au fur et à mesure que vous écrivez ou que l'IA le génère...</span>
           )}
         </div>
         <p>{coverLetter.content.details.closing}</p>
      </div>

      {/* Signature */}
      <div className="mt-8">
         <p className="font-bold text-slate-900">{coverLetter.content.sender.firstName} {coverLetter.content.sender.lastName}</p>
      </div>
    </div>
  );
};
