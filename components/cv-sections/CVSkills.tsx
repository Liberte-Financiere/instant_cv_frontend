'use client';

import { Skill, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVSkillsProps {
  skills: Skill[];
  variant: CVVariant;
  title?: string;
  layout?: 'tags' | 'list' | 'bars';
}

export function CVSkills({ skills, variant, title = 'Compétences', layout = 'tags' }: CVSkillsProps) {
  const styles = variantStyles[variant];
  
  if (skills.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-4`}>{title}</h2>
      
      {layout === 'tags' && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span 
              key={skill.id} 
              className={`${styles.tagBg} ${styles.tagText} px-3 py-1.5 rounded text-xs font-medium`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}

      {layout === 'list' && (
        <ul className="space-y-1">
          {skills.map((skill) => (
            <li key={skill.id} className={`text-sm ${variant === 'tech' ? 'text-gray-300' : 'text-slate-600'}`}>
              • {skill.name}
            </li>
          ))}
        </ul>
      )}

      {layout === 'bars' && (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className={variant === 'tech' ? 'text-gray-300' : 'text-slate-700'}>{skill.name}</span>
                <span className={variant === 'tech' ? 'text-gray-500' : 'text-slate-400'}>{skill.level}/5</span>
              </div>
              <div className={`h-2 ${variant === 'tech' ? 'bg-gray-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                <div 
                  className={`h-full ${styles.accentBg} rounded-full transition-all`}
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
