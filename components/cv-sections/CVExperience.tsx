'use client';

import { Experience, CVVariant } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { variantStyles } from './styles';

interface CVExperienceProps {
  experiences: Experience[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVExperience({ experiences, variant, title = 'Expérience Professionnelle', accentColor }: CVExperienceProps) {
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
          <div key={exp.id || index} className="cv-item relative pl-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <h3 className={`font-bold text-lg ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {exp.position}
              </h3>
              <span className={`text-sm font-medium tabular-nums shrink-0 ${variant === 'tech' ? 'text-gray-500' : 'text-slate-500'}`}>
                {exp.startDate && formatDate(exp.startDate)} — {exp.current ? 'Présent' : (exp.endDate && formatDate(exp.endDate))}
              </span>
            </div>
            <div 
              className="font-medium mb-3"
              style={accentColor ? { color: accentColor } : undefined}
            >
              {exp.company}
            </div>
            {exp.description && (
              <div className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}>
                {exp.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
