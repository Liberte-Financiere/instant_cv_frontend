import { Competitor } from './types';

export const rekruteData: Competitor = {
  slug: 'rekrute',
  name: 'ReKrute',
  tagline: 'Le portail d\'emploi leader au Maghreb et en Afrique francophone',
  category: 'Plateforme locale Afrique',
  description: 'Découvrez la comparaison entre ReKrute et Jobsira pour optimiser vos dossiers de candidature.',
  verdict: 'ReKrute propose des tests de personnalité et des offres de qualité pour le Maroc et la Tunisie, mais manque d\'outils d\'IA générative pour accompagner les candidats dans la rédaction de leurs CV ou la préparation d\'entretiens.',
  features: [
    {
      feature: 'Tests de personnalité',
      jobsira: 'Analyse IA de compatibilité avec les fiches de poste.',
      competitor: 'Tests psychométriques reconnus intégrés à la plateforme.',
      winner: 'competitor'
    },
    {
      feature: 'CV IA & Lettres de motivation',
      jobsira: 'Rédaction automatique sur mesure adaptée au marché ouest-africain.',
      competitor: 'Dépôt simple de CV PDF standard sans assistant IA.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulateur d\'entretien',
      jobsira: 'Entraînement complet (vocal et texte) avec retours constructifs.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    },
    {
      feature: 'Moyens de paiement',
      jobsira: 'Mobile Money local de l\'UEMOA pris en charge.',
      competitor: 'Paiement en ligne par carte bancaire marocaine/internationale.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'IA de création de CV qui rédige les compétences clés pour vous en français',
    'Simulateur d\'entretien personnalisé selon le poste convoité',
    'Pas d\'obligation de passer de longs tests de personnalité pour candidater'
  ],
  competitorAdvantages: [
    'Excellente insertion auprès des multinationales basées au Maroc et en Tunisie',
    'Tests de personnalité de niveau professionnel très appréciés des recruteurs'
  ],
  targetAudience: 'Les professionnels en recherche de mobilité au sein de l\'Afrique francophone qui souhaitent soumettre une candidature claire et percutante.',
  cta: 'Préparer ma candidature sur Jobsira'
};
