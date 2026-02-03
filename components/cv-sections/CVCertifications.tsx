'use client';

import { Certification, CVVariant } from '@/types/cv';
import { formatDate } from '@/lib/utils';
import { variantStyles } from './styles';
import { Award, ExternalLink } from 'lucide-react';

interface CVCertificationsProps {
  certifications: Certification[];
  variant: CVVariant;
  title?: string;
}

export function CVCertifications({ certifications, variant, title = 'Certifications' }: CVCertificationsProps) {
  const styles = variantStyles[variant];
  
  if (certifications.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-4`}>{title}</h2>
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="cv-item flex gap-3">
            <Award className={`w-5 h-5 ${styles.accentText} shrink-0 mt-0.5`} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold text-sm ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                  {cert.name}
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className={`ml-2 ${styles.accentText} hover:underline inline-flex items-center`}>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </h3>
                {cert.date && (
                  <span className={`text-xs shrink-0 ${variant === 'tech' ? 'text-gray-500' : 'text-slate-400'}`}>
                    {formatDate(cert.date)}
                  </span>
                )}
              </div>
              <p className={`text-sm ${variant === 'tech' ? 'text-gray-400' : 'text-slate-500'}`}>
                {cert.organization}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
