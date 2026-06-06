import { Competitor } from './types';

export const novoresumeData: Competitor = {
  slug: 'novoresume',
  name: 'Novorésumé',
  tagline: 'Le constructeur de CV à grille rigide et structurée',
  category: 'Outil CV',
  description: 'Comparez Jobsira et Novorésumé pour choisir la meilleure plateforme de création de CV.',
  verdict: 'Novorésumé excelle dans le respect des règles de mise en page (comme le CV sur une seule page). Cependant, il ne propose pas d\'IA pour analyser votre CV par rapport à une offre ou de simulateur d\'entretien, et n\'accepte pas le paiement Mobile Money.',
  features: [
    {
      feature: 'Grille de mise en page',
      jobsira: 'Placement dynamique fluide des sections.',
      competitor: 'Grille stricte très propre, empêchant les débordements.',
      winner: 'draw'
    },
    {
      feature: 'Analyse IA',
      jobsira: 'Notation de compatibilité ATS avec recommandations d\'amélioration.',
      competitor: 'Optimiseur de CV sous forme de conseils statiques uniquement.',
      winner: 'jobsira'
    },
    {
      feature: 'Paiement Mobile Money',
      jobsira: 'Intégration locale complète (Wave, Orange, Moov, etc.).',
      competitor: 'Non disponible. Cartes bancaires ou PayPal uniquement.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulateur d\'entretien',
      jobsira: 'Entraînement vocal/textuel pour les entretiens en Afrique.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Aide à l\'écriture par IA pour générer des CV riches et professionnels',
    'Permet de s\'entraîner à l\'oral et à l\'écrit pour ses futurs entretiens d\'embauche',
    'Parfaitement adapté aux modes de paiement de l\'Afrique de l\'Ouest'
  ],
  competitorAdvantages: [
    'Système intelligent d\'avertissement en cas de dépassement d\'une seule page',
    'Designs élégants avec polices et mises en page prêtes à l\'emploi'
  ],
  targetAudience: 'Les candidats à la recherche d\'un outil de CV structuré sans contraintes bancaires de paiement à l\'international.',
  cta: 'Créer mon CV structuré sur Jobsira'
};
