'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { CV } from '@/types/cv';

interface TemplateProps {
  cv: CV;
}

export function ModernSidebar({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = cv;

  return (
    <div className="w-full h-full bg-white text-slate-800 font-sans text-sm leading-relaxed flex flex-col sm:flex-row min-h-[297mm]">
      {/* Sidebar (Left Column) */}
      <div className="w-[32%] bg-slate-900 text-white p-8 space-y-8 flex-shrink-0 print:bg-slate-900 print:text-white">
        {/* Avatar & Name */}
        <div className="text-center sm:text-left">
           {/* Initials Avatar fallback */}
           <div className="w-24 h-24 mx-auto sm:mx-0 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold mb-6 text-blue-400 ring-4 ring-slate-800 ring-offset-2 ring-offset-slate-900">
             {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
           </div>
           
           <h1 className="text-2xl font-bold leading-tight mb-2">
             {personalInfo.firstName} <br /> {personalInfo.lastName}
           </h1>
           <p className="text-blue-400 font-medium text-sm uppercase tracking-wider">
             {personalInfo.title}
           </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Contact</h3>
           <div className="space-y-3 text-sm text-slate-300">
             {personalInfo.email && (
               <div className="flex items-center gap-3">
                 <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                 <span className="break-all">{personalInfo.email}</span>
               </div>
             )}
             {personalInfo.phone && (
               <div className="flex items-center gap-3">
                 <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                 <span>{personalInfo.phone}</span>
               </div>
             )}
             {personalInfo.address && (
               <div className="flex items-start gap-3">
                 <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                 <span>{personalInfo.address}</span>
               </div>
             )}
           </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Langues</h3>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{lang.name}</span>
                  <span className="text-xs text-slate-500 font-medium">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right Column) */}
      <div className="flex-1 p-8 sm:p-12 space-y-8 bg-white">
         {/* Profile Summary */}
         {personalInfo.summary && (
           <section>
             <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-4 mb-4 uppercase tracking-wide">
               Profil Professionnel
             </h2>
             <p className="text-slate-600 leading-relaxed text-justify">
               {personalInfo.summary}
             </p>
           </section>
         )}

         {/* Experience */}
         {experiences.length > 0 && (
           <section>
             <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-4 mb-6 uppercase tracking-wide">
               Expérience Professionnelle
             </h2>
             <div className="space-y-8">
               {experiences.map((exp) => (
                 <div key={exp.id} className="relative pl-2 group">
                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                     <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                       {exp.position}
                     </h3>
                     <span className="text-sm font-medium text-slate-500 tabular-nums shrink-0">
                       {exp.startDate && formatDate(exp.startDate)} — {exp.current ? 'Présent' : (exp.endDate && formatDate(exp.endDate))}
                     </span>
                   </div>
                   <div className="text-blue-600 font-medium mb-3">{exp.company}</div>
                   {exp.description && (
                     <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                       {exp.description}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </section>
         )}

         {/* Education */}
         {education.length > 0 && (
           <section>
             <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-4 mb-6 uppercase tracking-wide">
               Formation
             </h2>
             <div className="space-y-6">
               {education.map((edu) => (
                 <div key={edu.id}>
                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                      <h3 className="font-bold text-slate-800 text-base">
                        {edu.degree} — {edu.field}
                      </h3>
                      <span className="text-sm text-slate-500 tabular-nums">
                        {edu.startDate && formatDate(edu.startDate)} — {edu.endDate && formatDate(edu.endDate)}
                      </span>
                   </div>
                   <div className="text-slate-500">{edu.institution}</div>
                 </div>
               ))}
             </div>
           </section>
         )}
      </div>
    </div>
  );
}
