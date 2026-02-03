'use client';

import { Hobby, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVHobbiesProps {
  hobbies: Hobby[];
  variant: CVVariant;
  title?: string;
}

export function CVHobbies({ hobbies, variant, title = "Centres d'intérêt" }: CVHobbiesProps) {
  const styles = variantStyles[variant];
  
  if (hobbies.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-4`}>{title}</h2>
      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby) => (
          <span 
            key={hobby.id} 
            className={`${styles.tagBg} ${styles.tagText} px-3 py-1.5 rounded text-xs font-medium`}
          >
            {hobby.name}
          </span>
        ))}
      </div>
    </section>
  );
}
