'use client';

import { Reference, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';
import { UserCheck, Mail, Phone } from 'lucide-react';

interface CVReferencesProps {
  references: Reference[];
  variant: CVVariant;
  title?: string;
  showContact?: boolean; // Option to hide contact info for privacy
}

export function CVReferences({ references, variant, title = 'Références', showContact = true }: CVReferencesProps) {
  const styles = variantStyles[variant];
  
  if (references.length === 0) return null;

  return (
    <section>
      <h2 className={`${styles.sectionTitle} mb-4`}>{title}</h2>
      <div className="space-y-4">
        {references.map((ref) => (
          <div key={ref.id} className="cv-item flex gap-3">
            <UserCheck className={`w-5 h-5 ${styles.accentText} shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {ref.name}
              </h3>
              <p className={`text-sm ${variant === 'tech' ? 'text-gray-400' : 'text-slate-500'}`}>
                {ref.position} — {ref.company}
              </p>
              {showContact && (ref.email || ref.phone) && (
                <div className="flex flex-wrap gap-4 mt-2 text-xs">
                  {ref.email && (
                    <span className={`flex items-center gap-1 ${styles.accentText}`}>
                      <Mail className="w-3 h-3" />
                      {ref.email}
                    </span>
                  )}
                  {ref.phone && (
                    <span className={`flex items-center gap-1 ${styles.accentText}`}>
                      <Phone className="w-3 h-3" />
                      {ref.phone}
                    </span>
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
