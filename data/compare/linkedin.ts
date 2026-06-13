import { Competitor } from './types';

export const linkedinData: Competitor = {
  slug: 'linkedin',
  name: 'LinkedIn',
  tagline: 'Le plus grand réseau social professionnel au monde',
  category: 'Réseau professionnel',
  description: 'Comparez l\'outil de génération de CV de LinkedIn avec Jobsira pour créer un dossier de candidature percutant en Afrique.',
  verdict: 'LinkedIn est incontournable pour réseauter et trouver des offres, mais son outil d\'export de CV au format PDF génère des documents trop rigides, impersonnels et mal formatés pour le marché de l\'emploi local en Afrique.',
  features: [
    {
      feature: 'Exportation de CV',
      jobsira: 'Design soigné, formats élégants sur une ou deux pages optimisées.',
      competitor: 'Export brut du profil, très long et peu esthétique.',
      winner: 'jobsira'
    },
    {
      feature: 'Lettre de motivation',
      jobsira: 'Génération IA sur mesure en accord avec votre CV et l\'offre ciblée.',
      competitor: 'Non disponible nativement pour les candidatures.',
      winner: 'jobsira'
    },
    {
      feature: 'Préparation aux entretiens',
      jobsira: 'Simulateur d\'entretien en français avec retours IA sur vos réponses.',
      competitor: 'Module de questions d\'entretien standard, principalement en anglais.',
      winner: 'jobsira'
    },
    {
      feature: 'Recherche d\'emploi',
      jobsira: 'Focalisé sur les opportunités locales et la mise en relation recruteurs.',
      competitor: 'Base de données mondiale d\'offres d\'emploi inégalée.',
      winner: 'competitor'
    }
  ],
  jobsiraAdvantages: [
    'Mise en page de CV haut de gamme et personnalisable pour l\'Afrique francophone',
    'Simulateur d\'entretien interactif basé sur le profil du candidat',
    'Intégration d\'une IA de rédaction complète pour les lettres de motivation'
  ],
  competitorAdvantages: [
    'Réseautage direct avec des millions de recruteurs à l\'international',
    'Visibilité publique permanente de votre profil en ligne'
  ],
  targetAudience: 'Les professionnels africains cherchant à disposer d\'un CV impeccable à envoyer par email, tout en conservant leur compte LinkedIn pour le réseautage.',
  cta: 'Créer un CV professionnel pour l\'Afrique'
};
