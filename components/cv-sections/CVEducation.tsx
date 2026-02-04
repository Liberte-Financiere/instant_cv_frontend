'use client';

import { Education, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVEducationProps {
  education: Education[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVEducation({ education, variant, title = 'Éducation', accentColor }: CVEducationProps) {
  const styles = variantStyles[variant];
  
  if (education.length === 0) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-6`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <div className="space-y-5">
        {education.map((edu) => (
          <div key={edu.id} className="cv-item">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h3 className={`font-bold text-base ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {edu.degree}{edu.field && ` — ${edu.field}`}
              </h3>
              {(edu.startDate || edu.endDate) && (
                <span className={`text-sm font-medium tabular-nums shrink-0 ${variant === 'tech' ? 'text-gray-500' : 'text-slate-500'}`}>
                  {edu.startDate} - {edu.endDate || 'Présent'}
                </span>
              )}
            </div>
            <div 
              className="font-medium text-sm"
              style={accentColor ? { color: accentColor } : undefined}
            >
              {edu.institution}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
