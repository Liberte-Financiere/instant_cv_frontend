import React from 'react';

interface CVDescriptionProps {
  description: string | null | undefined;
  className?: string;
}

export const CVDescription: React.FC<CVDescriptionProps> = ({ description, className = '' }) => {
  if (!description) return null;

  // Nettoyage des classes pour eviter les conflits
  const cleanClassName = className
    .replace(/whitespace-pre-line/g, '')
    .replace(/prose(\s|-[\w]+)*/g, '')
    .trim();

  // Sécurité Stricte : On supprime complètement le HTML
  // On convertit juste les <br> et </p> en sauts de ligne réels pour garder un peu de formatage
  let safeText = description.replace(/<br\s*\/?>/gi, '\n');
  safeText = safeText.replace(/<\/p>/gi, '\n');
  safeText = safeText.replace(/<[^>]*>?/gm, ''); // Retire toutes les autres balises

  // On nettoie les sauts de ligne multiples
  const cleanDescription = safeText.replace(/\n{2,}/g, '\n').trim();
  const lines = cleanDescription.split('\n');

  return (
    <div className={`cv-description flex flex-col gap-[0.7rem] ${cleanClassName}`}>
      {lines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </div>
  );
};
