'use client';

import { UserCheck, Mail, Phone } from 'lucide-react';
import { Reference, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVReferencesProps {
  references: Reference[];
  variant: CVVariant;
  title?: string;
  accentColor?: string;
}

export function CVReferences({ references, variant, title = 'Références', accentColor }: CVReferencesProps) {
  const styles = variantStyles[variant];
  
  if (references.length === 0) return null;

  return (
    <section>
      <h2 
        className={`${styles.sectionTitle} mb-4`}
        style={accentColor ? { borderColor: accentColor } : undefined}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {references.map((ref) => (
          <div key={ref.id} className="cv-item flex gap-3">
            <UserCheck 
              className="w-5 h-5 shrink-0 mt-0.5" 
              style={accentColor ? { color: accentColor } : undefined}
            />
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${variant === 'tech' ? 'text-white' : 'text-slate-800'}`}>
                {ref.name}
              </h3>
              <div className={`text-sm ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}>
                {ref.position}{ref.company && ` chez ${ref.company}`}
              </div>
              {!ref.hideContact && (ref.email || ref.phone) && (
                <div className="flex gap-4 mt-1">
                  {ref.email && (
                    <span className={`flex items-center gap-1 text-xs ${variant === 'tech' ? 'text-gray-500' : 'text-slate-500'}`}>
                      <Mail className="w-3 h-3" /> {ref.email}
                    </span>
                  )}
                  {ref.phone && (
                    <span className={`flex items-center gap-1 text-xs ${variant === 'tech' ? 'text-gray-500' : 'text-slate-500'}`}>
                      <Phone className="w-3 h-3" /> {ref.phone}
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
