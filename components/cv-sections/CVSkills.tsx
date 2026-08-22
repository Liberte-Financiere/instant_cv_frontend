'use client';

import { Skill, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVSkillsProps {
  skills: Skill[];
  variant: CVVariant;
  title?: string;
  layout?: 'tags' | 'list' | 'bars';
  accentColor?: string;
}

export function CVSkills({ skills, variant, title = 'Compétences', layout = 'tags', accentColor }: CVSkillsProps) {
  const styles = variantStyles[variant];
  
  if (skills.length === 0) return null;

  // Grouping logic
  const hasCategories = skills.some(s => s.category?.trim());
  let groupedSkills: { category: string, items: Skill[] }[] = [];
  
  if (hasCategories) {
    const groups: Record<string, Skill[]> = {};
    const uncategorized: Skill[] = [];
    
    skills.forEach(skill => {
      const cat = skill.category?.trim();
      if (cat) {
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(skill);
      } else {
        uncategorized.push(skill);
      }
    });
    
    groupedSkills = Object.entries(groups).map(([category, items]) => ({ category, items }));
    
    // Put uncategorized at the end
    if (uncategorized.length > 0) {
      groupedSkills.push({ category: '', items: uncategorized });
    }
  } else {
    groupedSkills = [{ category: '', items: skills }];
  }

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      
      <div className="space-y-4">
        {groupedSkills.map((group, index) => (
          <div key={index} className="space-y-2">
            {group.category && (
              <h3 
                className={`text-xs font-bold uppercase tracking-wider ${variant === 'tech' ? 'text-gray-400' : 'text-slate-500'}`}
                style={accentColor ? { color: accentColor } : undefined}
              >
                {group.category}
              </h3>
            )}

            {layout === 'tags' && (
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span 
                    key={skill.id} 
                    className={`${styles.tagBg} ${styles.tagText} px-3 py-1.5 rounded text-xs font-medium`}
                    style={accentColor ? { backgroundColor: `${accentColor}20`, color: accentColor } : undefined}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}

            {layout === 'list' && (
              <ul className="space-y-1">
                {group.items.map((skill) => (
                  <li key={skill.id} className={`text-sm ${variant === 'tech' ? 'text-gray-300' : 'text-slate-600'}`}>
                    • {skill.name}
                  </li>
                ))}
              </ul>
            )}

            {layout === 'bars' && (
              <div className="space-y-3">
                {group.items.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={variant === 'tech' ? 'text-gray-300' : 'text-slate-700'}>{skill.name}</span>
                      <span className={variant === 'tech' ? 'text-gray-500' : 'text-slate-400'}>{skill.level}/5</span>
                    </div>
                    <div className={`h-2 ${variant === 'tech' ? 'bg-gray-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full ${styles.accentBg} rounded-full transition-all`}
                        style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: accentColor || undefined }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
