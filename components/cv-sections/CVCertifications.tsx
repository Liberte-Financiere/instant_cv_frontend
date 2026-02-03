'use client';

import { Award, ExternalLink } from 'lucide-react';
import { Certification, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVCertificationsProps {
  certifications: Certification[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVCertifications({ certifications, variant, title = 'Certifications', accentColor }: CVCertificationsProps) {
  const styles = variantStyles[variant];
  
  if (certifications.length === 0) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="cv-item flex gap-3">
            <Award 
              className="w-5 h-5 shrink-0 mt-0.5" 
              style={accentColor ? { color: accentColor } : undefined}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold text-sm ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                  {cert.name}
                </h3>
                {cert.credentialUrl && (
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shrink-0"
                    style={accentColor ? { color: accentColor } : undefined}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className={`text-sm ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}>
                {cert.organization}
                {cert.date && ` • ${cert.date}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
