import Image from "next/image";
import { CVFooter as CVFooterType, CVVariant } from '@/types/cv';
import { variantStyles } from './styles';

const LOCALE_MAP: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  zh: 'zh-CN',
};

const FOOTER_TEMPLATES: Record<string, { prefix: string; at: string; on: string }> = {
  fr: { prefix: 'Fait', at: 'à', on: 'le' },
  en: { prefix: 'Made', at: 'in', on: 'on' },
  zh: { prefix: '制作于', at: '', on: '' },
};

interface CVFooterProps {
  footer: CVFooterType;
  variant: CVVariant;
  lang?: string;
  accentColor?: string;
}

export function CVFooter({ footer, variant, lang = 'fr', accentColor }: CVFooterProps) {
  const styles = variantStyles[variant];
  
  if (!footer.showFooter || (!footer.madeAt && !footer.madeDate && !footer.signatureUrl)) return null;

  const locale = LOCALE_MAP[lang] || 'fr-FR';
  const t = FOOTER_TEMPLATES[lang] || FOOTER_TEMPLATES['fr'];

  const formattedDate = footer.madeDate 
    ? new Date(footer.madeDate).toLocaleDateString(locale, { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }) 
    : '';

  return (
    <div className={`mt-[15mm] border-t px-12 py-6 flex justify-end items-end ${
      variant === 'tech' ? 'border-gray-700 bg-zinc-900' : 'border-slate-200 bg-slate-50'
    }`}>
      <div className={`text-sm text-right ${variant === 'tech' ? 'text-gray-400' : 'text-slate-600'}`}>
        {t.prefix}{footer.madeAt && ` ${t.at} ${footer.madeAt}`}
        {footer.madeAt && footer.madeDate && ', '}
        {footer.madeDate && (t.on ? `${t.on} ${formattedDate}` : formattedDate)}
      </div>
      {footer.signatureUrl && (
        <Image
          src={footer.signatureUrl}
          alt="Signature"
          width={200}
          height={48}
          className="h-12 w-auto object-contain"
        />
      )}
    </div>
  );
}
