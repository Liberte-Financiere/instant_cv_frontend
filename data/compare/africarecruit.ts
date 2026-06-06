import { Competitor } from './types';

export const africarecruitData: Competitor = {
  slug: 'africarecruit',
  name: 'Africarecruit',
  tagline: 'Cabinet de recrutement et plateforme d\'emploi panafricaine',
  category: 'Plateforme locale Afrique',
  description: 'Découvrez les différences entre Africarecruit et Jobsira pour booster votre employabilité en Afrique.',
  verdict: 'Africarecruit est un acteur établi pour la recherche de cadres en Afrique, mais il fonctionne comme un cabinet traditionnel sans proposer d\'outils modernes pour aider les candidats à rédiger ou simuler un entretien.',
  features: [
    {
      feature: 'Profils ciblés',
      jobsira: 'Cadres et techniciens en Afrique de l\'Ouest francophone.',
      competitor: 'Profils expérimentés et cadres supérieurs à l\'échelle du continent.',
      winner: 'draw'
    },
    {
      feature: 'Optimisation de candidature',
      jobsira: 'Analyse IA instantanée de compatibilité avec les fiches de poste.',
      competitor: 'Processus de sélection manuel par des consultants en recrutement.',
      winner: 'jobsira'
    },
    {
      feature: 'Constructeur de CV',
      jobsira: 'Outil de CV responsive et rapide, optimisé ATS.',
      competitor: 'Formulaires classiques de base de données à remplir.',
      winner: 'jobsira'
    },
    {
      feature: 'Moyens de paiement',
      jobsira: 'Paiements simplifiés en Mobile Money local.',
      competitor: 'Principalement gratuit pour les candidats (services payants pour entreprises).',
      winner: 'draw'
    }
  ],
  jobsiraAdvantages: [
    'Outils en libre-service IA pour améliorer son CV à n\'importe quelle heure',
    'Entraînement complet pour les entretiens d\'embauche des grandes entreprises africaines',
    'Exportation de CV et de lettres de motivation au format PDF moderne et soigné'
  ],
  competitorAdvantages: [
    'Relations directes avec les grandes institutions de développement en Afrique',
    'Offres d\'emploi souvent exclusives non publiées ailleurs'
  ],
  targetAudience: 'Les professionnels africains qualifiés postulant sur Africarecruit qui souhaitent maximiser leurs chances de passer la première sélection manuelle grâce à un CV impeccable.',
  cta: 'Optimiser mon CV pour postuler en Afrique'
};
