'use client';

import { Education, CVVariant } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { variantStyles } from './styles';

interface CVEducationProps {
  education: Education[];
  variant: CVVariant;
  title?: string;
}

export function CVEducation({ education, variant, title = 'Formation' }: CVEducationProps) {
  const styles = variantStyles[variant];
  
  if (education.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-6`}>{title}</h2>
      <div className="space-y-5">
        {education.map((edu) => (
          <div key={edu.id} className="cv-item">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
              <h3 className={`font-bold text-base ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {edu.degree}{edu.field && ` — ${edu.field}`}
              </h3>
              <span className={`text-sm tabular-nums ${variant === 'tech' ? 'text-gray-500' : 'text-slate-500'}`}>
                {edu.startDate && formatDate(edu.startDate)}{edu.endDate && ` — ${formatDate(edu.endDate)}`}
              </span>
            </div>
            <div className={variant === 'tech' ? 'text-gray-400' : 'text-slate-500'}>{edu.institution}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
