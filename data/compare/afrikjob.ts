import { Competitor } from './types';

export const afrikjobData: Competitor = {
  slug: 'afrikjob',
  name: 'Afrikjob',
  tagline: 'Portail de recrutement et d\'offres d\'emploi en Afrique de l\'Ouest',
  category: 'Plateforme locale Afrique',
  description: 'Découvrez pourquoi utiliser Jobsira pour vos candidatures sur Afrikjob multiplie vos chances de succès.',
  verdict: 'Afrikjob répertorie de nombreuses opportunités en Afrique francophone, mais reste une plateforme d\'affichage statique d\'annonces qui ne propose aucun outil de rédaction IA ou de préparation orale d\'entretien.',
  features: [
    {
      feature: 'Offres d\'emploi',
      jobsira: 'Offres qualifiées et modérées pour éviter les arnaques.',
      competitor: 'Grand catalogue d\'offres d\'emploi du secteur privé et public.',
      winner: 'competitor'
    },
    {
      feature: 'CV Builder IA',
      jobsira: 'Génération de paragraphes et optimisation ATS automatique.',
      competitor: 'Téléversement simple d\'un CV pré-existant.',
      winner: 'jobsira'
    },
    {
      feature: 'Simulation d\'entretien',
      jobsira: 'Entraînement immersif avec retour instantané de l\'IA.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    },
    {
      feature: 'Paiement',
      jobsira: 'Intégration Mobile Money native (Orange, Wave, Moov).',
      competitor: 'Gratuit pour le dépôt de CV classique (pas de services IA payants).',
      winner: 'draw'
    }
  ],
  jobsiraAdvantages: [
    'Obtention d\'un score de compatibilité ATS pour chaque offre ciblée sur Afrikjob',
    'Simulations d\'entretien en français adaptées aux entreprises ouest-africaines',
    'Conception visuelle moderne de CV exportable en PDF HD vectoriel'
  ],
  competitorAdvantages: [
    'Nombre important d\'offres d\'emploi publiées pour le Togo, le Bénin et le Sénégal',
    'Processus d\'inscription simple et rapide pour postuler'
  ],
  targetAudience: 'Les candidats du Togo, Bénin, Côte d\'Ivoire et Sénégal cherchant à soumettre des dossiers de candidature optimisés et bien rédigés.',
  cta: 'Créer mon CV optimisé sur Jobsira'
};
