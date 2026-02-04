'use client';

import { Quality, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVQualitiesProps {
  qualities: Quality[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVQualities({ qualities, variant, title = 'Qualités', accentColor }: CVQualitiesProps) {
  const styles = variantStyles[variant];
  
  if (!qualities || qualities.length === 0) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {qualities.map((quality) => (
          <span 
            key={quality.id} 
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              variant === 'tech' 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {quality.name}
          </span>
        ))}
      </div>
    </section>
  );
}
