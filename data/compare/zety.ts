import { Competitor } from './types';

export const zetyData: Competitor = {
  slug: 'zety',
  name: 'Zety',
  tagline: 'Le constructeur de CV classique avec conseils de rédaction',
  category: 'Outil CV',
  description: 'Découvrez la comparaison entre Jobsira et Zety pour choisir le meilleur outil de CV en 2026.',
  verdict: 'Zety est réputé pour ses suggestions de phrases d\'accroche pré-rédigées, mais le téléchargement en PDF est payant sous forme d\'abonnement obligatoire, sans option de paiement par Mobile Money.',
  features: [
    {
      feature: 'Accès au PDF',
      jobsira: 'Téléchargement HD gratuit ou via crédits abordables.',
      competitor: 'Payant. Le téléchargement est bloqué sans abonnement actif.',
      winner: 'jobsira'
    },
    {
      feature: 'Assistance à la rédaction',
      jobsira: 'IA générative dynamique qui rédige vos expériences et compétences.',
      competitor: 'Suggestions de textes pré-rédigés par catégories de métiers.',
      winner: 'jobsira'
    },
    {
      feature: 'Intégration Mobile Money',
      jobsira: 'Paiement direct par Orange Money, Moov, Wave, etc.',
      competitor: 'Cartes bancaires internationales uniquement.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulateur d\'entretien',
      jobsira: 'Entraînement complet inclus dans la plateforme.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Une IA qui s\'adapte à vos tâches spécifiques plutôt que de simples textes à trous',
    'Pas de frais d\'abonnement récurrents cachés pour télécharger vos fichiers',
    'Un tableau de bord en français parfaitement adapté aux réalités ouest-africaines'
  ],
  competitorAdvantages: [
    'Base de données impressionnante de phrases clés par métier de type classique',
    'Nombreux modèles sobres et professionnels largement adoptés par les recruteurs'
  ],
  targetAudience: 'Les candidats qui veulent rédiger rapidement et télécharger leur CV sans risquer de voir leur carte bancaire débitée chaque mois.',
  cta: 'Essayer Jobsira gratuitement dès aujourd\'hui'
};
