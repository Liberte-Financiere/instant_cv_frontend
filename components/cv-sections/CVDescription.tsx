import React from 'react';

interface CVDescriptionProps {
  description: string | null | undefined;
  className?: string;
}

export const CVDescription: React.FC<CVDescriptionProps> = ({ description, className = '' }) => {
  if (!description) return null;

  // Detection basique de HTML (si l'IA ou un vieil éditeur a généré des balises)
  const hasHTML = /<[a-z][\s\S]*>/i.test(description);

  // Nettoyage des classes pour eviter les conflits (on enlève prose et whitespace-pre-line)
  const cleanClassName = className
    .replace(/whitespace-pre-line/g, '')
    .replace(/prose(\s|-[\w]+)*/g, '')
    .trim();

  if (hasHTML) {
    return (
      <div 
        className={`cv-description ${cleanClassName}`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  // Pour le texte brut (ce qui est tapé dans le textarea)
  // On remplace les sauts de ligne multiples par un seul pour éviter les grands espaces
  const cleanDescription = description.replace(/\n{2,}/g, '\n').trim();
  const lines = cleanDescription.split('\n');

  return (
    <div className={`cv-description flex flex-col gap-0.5 ${cleanClassName}`}>
      {lines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </div>
  );
};
