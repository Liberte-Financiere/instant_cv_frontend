'use client';

import { Project, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';
import { Folder, ExternalLink } from 'lucide-react';

interface CVProjectsProps {
  projects: Project[];
  variant: CVVariant;
  title?: string;
}

export function CVProjects({ projects, variant, title = 'Projets' }: CVProjectsProps) {
  const styles = variantStyles[variant];
  
  if (projects.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-4`}>{title}</h2>
      <div className="space-y-5">
        {projects.map((project) => (
          <div key={project.id} className="cv-item flex gap-3">
            <Folder className={`w-5 h-5 ${styles.accentText} shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {project.name}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={`ml-2 ${styles.accentText} hover:underline inline-flex items-center`}>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </h3>
              {project.description && (
                <p className={`text-sm mt-1 ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}>
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.technologies.split(',').map((tech, idx) => (
                    <span 
                      key={idx} 
                      className={`text-xs px-2 py-0.5 rounded ${styles.tagBg} ${styles.tagText}`}
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
