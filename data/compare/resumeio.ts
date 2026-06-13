import { Competitor } from './types';

export const resumeioData: Competitor = {
  slug: 'resumeio',
  name: 'Resume.io',
  tagline: 'Créateur de CV en ligne par abonnement international',
  category: 'Outil CV',
  description: 'Découvrez pourquoi Jobsira est l\'alternative idéale à Resume.io pour les candidats en Afrique de l\'Ouest.',
  verdict: 'Resume.io offre une interface de création de CV très propre, mais son modèle de tarification par abonnement récurrent en devises étrangères (EUR/USD) exclut les candidats africains sans carte bancaire internationale.',
  features: [
    {
      feature: 'Modes de paiement',
      jobsira: 'Paiement à la carte ou pack de crédits sans abonnement via Mobile Money.',
      competitor: 'Abonnement récurrent mensuel obligatoire par carte bancaire.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulateur d\'entretien',
      jobsira: 'Entraînement vocal et textuel aux questions de recrutement courantes.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    },
    {
      feature: 'Traduction IA de CV',
      jobsira: 'Traduction automatique en anglais/chinois optimisant le jargon métier.',
      competitor: 'Traduction manuelle par le candidat uniquement.',
      winner: 'jobsira'
    },
    {
      feature: 'Qualité des modèles',
      jobsira: 'Modèles conçus avec des recruteurs africains et conformes aux ATS.',
      competitor: 'Excellents modèles modernes et esthétiques.',
      winner: 'draw'
    }
  ],
  jobsiraAdvantages: [
    'Pas d\'abonnement caché : vous ne payez que ce que vous consommez',
    'Intègre des simulations d\'entretien pour vous préparer au recrutement',
    'Paiement en Francs CFA (XOF) par Wave, Orange Money, Moov, etc.'
  ],
  competitorAdvantages: [
    'Grande variété de modèles de CV testés sur le marché européen et américain',
    'Outil d\'écriture de lettres de motivation classique bien intégré'
  ],
  targetAudience: 'Les diplômés et cadres africains voulant un constructeur de CV moderne sans s\'engager dans un abonnement mensuel prélevé en devises.',
  cta: 'Créer mon CV sans abonnement sur Jobsira'
};
