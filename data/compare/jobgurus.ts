import { Competitor } from './types';

export const jobgurusData: Competitor = {
  slug: 'jobgurus',
  name: 'JobGurus Afrique',
  tagline: 'Portail d\'emploi et de recrutement en Afrique de l\'Ouest',
  category: 'Plateforme locale Afrique',
  description: 'Découvrez la comparaison entre Jobsira et JobGurus pour accélérer votre recherche d\'emploi en Côte d\'Ivoire et région.',
  verdict: 'JobGurus Afrique est un babillard d\'offres d\'emploi dynamique en Afrique francophone, mais il ne fournit pas de constructeur de CV moderne ni de module intelligent de simulation d\'entretien.',
  features: [
    {
      feature: 'Base d\'offres régionales',
      jobsira: 'Offres locales triées et adaptées aux profils qualifiés.',
      competitor: 'Nombreux postes répertoriés en Côte d\'Ivoire, Sénégal et Mali.',
      winner: 'competitor'
    },
    {
      feature: 'CV Builder intelligent',
      jobsira: 'Création guidée avec suggestions IA et formatage optimal.',
      competitor: 'Dépôt simple de CV existant au format PDF.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulation d\'entretien d\'embauche',
      jobsira: 'Entraînement immersif en ligne pour vaincre le trac.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    },
    {
      feature: 'Optimisation de CV',
      jobsira: 'IA qui adapte le CV à chaque offre pour passer les filtres ATS.',
      competitor: 'Aucune aide à la réécriture.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Obtention d\'un score de compatibilité de votre CV avant d\'envoyer votre candidature',
    'Conception d\'un CV esthétique et lisible sur les écrans mobiles des recruteurs',
    'Simulateur d\'entretien calqué sur le contexte professionnel africain'
  ],
  competitorAdvantages: [
    'Grande visibilité sur les offres de stages et de premiers emplois dans la sous-région',
    'Alertes email régulières par rapport aux catégories de métiers recherchées'
  ],
  targetAudience: 'Les candidats ouest-africains souhaitant optimiser la qualité de leur CV pour se démarquer sur la plateforme JobGurus Afrique.',
  cta: 'Rédiger un CV percutant pour JobGurus'
};
