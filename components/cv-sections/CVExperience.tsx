'use client';

import { Experience, CVVariant } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { getPresentLabel } from '@/constants/sections';
import { variantStyles } from './styles';
import { CVDescription } from './CVDescription';

interface CVExperienceProps {
  experiences: Experience[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
  lang?: string;
}

export function CVExperience({ experiences, variant, title = 'Expérience Professionnelle', accentColor, lang = 'fr' }: CVExperienceProps) {
  const styles = variantStyles[variant];
  
  if (experiences.length === 0) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-6`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={exp.id || index} className="cv-item relative pl-2 break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <h3 className={`font-bold text-lg ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {exp.position}
              </h3>
              <span className={`text-sm font-medium tabular-nums shrink-0 ${variant === 'tech' ? 'text-gray-500' : 'text-slate-500'}`}>
                {exp.startDate && formatDate(exp.startDate, lang)} — {exp.current ? getPresentLabel(lang) : (exp.endDate && formatDate(exp.endDate, lang))}
              </span>
            </div>
            <div 
              className="font-medium mb-3"
              style={accentColor ? { color: accentColor } : undefined}
            >
              {exp.company}
            </div>
            {exp.description && (
              <CVDescription 
                description={exp.description}
                className={`text-sm leading-relaxed break-words prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
