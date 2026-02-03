'use client';

import { CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVSummaryProps {
  summary: string;
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVSummary({ summary, variant, title = 'Profil Professionnel', accentColor }: CVSummaryProps) {
  const styles = variantStyles[variant];
  
  if (!summary) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <p className={`leading-relaxed text-justify break-words ${
        variant === 'tech' ? 'text-gray-300' : 'text-slate-600'
      }`}>
        {summary}
      </p>
    </section>
  );
}
