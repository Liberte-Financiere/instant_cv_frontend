'use client';

import { CVFooter as CVFooterType, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

interface CVFooterProps {
  footer: CVFooterType;
  variant: CVVariant;
}

export function CVFooter({ footer, variant }: CVFooterProps) {
  const styles = variantStyles[variant];
  
  if (!footer.showFooter || (!footer.madeAt && !footer.madeDate)) return null;

  const formattedDate = footer.madeDate 
    ? new Date(footer.madeDate).toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }) 
    : '';

  return (
    <div className={`border-t px-12 py-6 flex justify-end items-end ${
      variant === 'tech' ? 'border-gray-700 bg-[#1a1a1a]' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className={`text-sm text-right ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}>
        Fait{footer.madeAt && ` à ${footer.madeAt}`}
        {footer.madeAt && footer.madeDate && ', '}
        {footer.madeDate && `le ${formattedDate}`}
      </div>
      {footer.signatureUrl && (
        <img 
          src={footer.signatureUrl} 
          alt="Signature" 
          className="h-12 object-contain" 
        />
      )}
    </div>
  );
}
