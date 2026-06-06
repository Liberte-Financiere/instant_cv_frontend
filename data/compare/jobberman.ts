import { Competitor } from './types';

export const jobbermanData: Competitor = {
  slug: 'jobberman',
  name: 'Jobberman',
  tagline: 'Le leader incontesté du recrutement en Afrique anglophone',
  category: 'Plateforme locale Afrique',
  description: 'Découvrez comment Jobsira s\'adapte spécifiquement à l\'Afrique francophone comparé à Jobberman.',
  verdict: 'Jobberman est une référence en Afrique de l\'Est et de l\'Ouest anglophone (Nigéria, Ghana). Pour les candidats francophones au Burkina Faso, en Côte d\'Ivoire ou au Sénégal, Jobsira offre des outils IA nativement en français et des options de paiement adaptées.',
  features: [
    {
      feature: 'Marché cible',
      jobsira: 'Afrique de l\'Ouest francophone (Burkina Faso, Côte d\'Ivoire, Sénégal, etc.).',
      competitor: 'Afrique anglophone principalement (Nigéria, Ghana).',
      winner: 'draw'
    },
    {
      feature: 'Outils IA en français',
      jobsira: 'CV, lettres de motivation et simulateur d\'entretien 100% en français.',
      competitor: 'Outils et support quasi exclusivement en anglais.',
      winner: 'jobsira'
    },
    {
      feature: 'Moyens de paiement locaux',
      jobsira: 'Orange Money, Wave, Moov via LigdiCash.',
      competitor: 'Cartes bancaires ou virement bancaire local nigérian/ghanéen.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulateur d\'entretien',
      jobsira: 'Entraînement interactif pour passer les recruteurs locaux.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Parfaite maîtrise des spécificités du marché de l\'emploi francophone',
    'Aide à la traduction automatique pour postuler à des offres anglophones',
    'Support client local réactif et accessible'
  ],
  competitorAdvantages: [
    'Immense réseau d\'entreprises partenaires au Nigéria et au Ghana',
    'Base de données de candidats qualifiés très importante pour l\'Afrique anglophone'
  ],
  targetAudience: 'Les candidats basés en Afrique francophone qui postulent localement ou recherchent une transition vers des entreprises internationales.',
  cta: 'Créer mon CV en français sur Jobsira'
};
