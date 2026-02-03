'use client';

import { CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVDiversProps {
  divers: string;
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVDivers({ divers, variant, title = 'Informations Complémentaires', accentColor }: CVDiversProps) {
  const styles = variantStyles[variant];
  
  if (!divers) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
        variant === 'tech' ? 'text-gray-300' : 'text-slate-600'
      }`}>
        {divers}
      </p>
    </section>
  );
}
