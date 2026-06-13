import { Competitor } from './types';

export const indeedData: Competitor = {
  slug: 'indeed',
  name: 'Indeed',
  tagline: 'Le plus grand agrégateur d\'offres d\'emploi au monde',
  category: 'Plateforme emploi',
  description: 'Découvrez la comparaison entre Indeed et Jobsira pour optimiser vos candidatures et trouver du travail.',
  verdict: 'Indeed est idéal pour rechercher des offres d\'emploi à grande échelle. Toutefois, son CV builder génère des documents très basiques et peu esthétiques, et la plateforme n\'offre aucune préparation IA aux entretiens.',
  features: [
    {
      feature: 'Volume d\'offres',
      jobsira: 'Offres qualifiées et ciblées sur l\'Afrique de l\'Ouest.',
      competitor: 'Des millions d\'offres d\'emploi agrégées mondialement.',
      winner: 'competitor'
    },
    {
      feature: 'Créateur de CV',
      jobsira: 'Modèles premium et personnalisables orientés réussite ATS.',
      competitor: 'Générateur de CV basique et uniforme.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulateur d\'entretien',
      jobsira: 'Entraînement complet inclus en français pour les entretiens.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    },
    {
      feature: 'Assistance IA',
      jobsira: 'Génération de lettres de motivation et CV optimisés en 1 clic.',
      competitor: 'Non disponible pour la création ou l\'optimisation de documents.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Esthétique soignée des CV pour capter immédiatement l\'attention des recruteurs',
    'Module de préparation aux entretiens interactif pour lever le stress',
    'Recommandations basées sur l\'IA pour adapter son CV à chaque fiche de poste'
  ],
  competitorAdvantages: [
    'Moteur de recherche d\'offres d\'emploi extrêmement puissant et mondial',
    'Possibilité de postuler en un clic directement depuis la plateforme'
  ],
  targetAudience: 'Les professionnels africains qui recherchent des postes sur Indeed mais souhaitent postuler avec un CV professionnel mieux rédigé et optimisé par Jobsira.',
  cta: 'Créer mon CV pour postuler sur Indeed'
};
