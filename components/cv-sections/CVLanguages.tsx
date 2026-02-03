'use client';

import { Language, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVLanguagesProps {
  languages: Language[];
  variant: CVVariant;
  title?: string;
}

const levelBars: Record<string, number> = {
  'Débutant': 1,
  'Intermédiaire': 2,
  'Avancé': 3,
  'Natif': 4,
};

export function CVLanguages({ languages, variant, title = 'Langues' }: CVLanguagesProps) {
  const styles = variantStyles[variant];
  
  if (languages.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-4`}>{title}</h2>
      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="flex justify-between items-center text-sm">
            <span className={variant === 'tech' ? 'text-gray-300' : 'text-slate-700'}>{lang.name}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${variant === 'tech' ? 'text-gray-500' : 'text-slate-400'}`}>
                {lang.level}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= levelBars[lang.level]
                        ? styles.accentBg
                        : variant === 'tech' ? 'bg-gray-700' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
