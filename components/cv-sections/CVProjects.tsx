'use client';

import { Folder, ExternalLink, Github } from 'lucide-react';
import { Project, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVProjectsProps {
  projects: Project[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVProjects({ projects, variant, title = 'Projets', accentColor }: CVProjectsProps) {
  const styles = variantStyles[variant];
  
  if (projects.length === 0) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <div className="space-y-5">
        {projects.map((project) => (
          <div key={project.id} className="cv-item flex gap-3">
            <Folder 
              className="w-5 h-5 shrink-0 mt-0.5" 
              style={accentColor ? { color: accentColor } : undefined}
            />
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {project.name}
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
              {(project.url || project.github) && (
                <div className="flex gap-3 mt-2">
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={accentColor ? { color: accentColor } : undefined}
                    >
                      <ExternalLink className="w-3 h-3" /> Demo
                    </a>
                  )}
                  {project.github && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={accentColor ? { color: accentColor } : undefined}
                    >
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
