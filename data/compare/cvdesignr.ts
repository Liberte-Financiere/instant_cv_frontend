import { Competitor } from './types';

export const cvdesignrData: Competitor = {
  slug: 'cvdesignr',
  name: 'CVDesignr',
  tagline: 'Outil de CV en ligne gratuit et populaire en France',
  category: 'Outil CV',
  description: 'Découvrez les différences majeures entre CVDesignr et Jobsira pour postuler avec succès en Afrique francophone.',
  verdict: 'CVDesignr est un bon outil gratuit pour démarrer, mais sa mise en page manuelle est complexe à manipuler sur smartphone. De plus, il n\'offre pas de fonctionnalités IA avancées pour rédiger ou s\'entraîner aux entretiens.',
  features: [
    {
      feature: 'Éditeur Mobile',
      jobsira: 'Interface 100% responsive et fluide, facile à modifier sur smartphone.',
      competitor: 'Éditeur visuel complexe et difficile à manipuler sur les écrans mobiles.',
      winner: 'jobsira'
    },
    {
      feature: 'Rédaction Assistée par IA',
      jobsira: 'Génération de textes intelligents pour valoriser vos expériences en un clic.',
      competitor: 'Aide à la rédaction basique sans intelligence artificielle générative.',
      winner: 'jobsira'
    },
    {
      feature: 'Accompagnement Candidat',
      jobsira: 'Simulateur d\'entretien et notation ATS inclus pour booster vos chances.',
      competitor: 'Simple outil de mise en page graphique de CV.',
      winner: 'jobsira'
    },
    {
      feature: 'Formules d\'accès',
      jobsira: 'Crédits gratuits au départ, recharges abordables par Mobile Money.',
      competitor: 'Gratuit pour les fonctions de base, options premium par abonnement.',
      winner: 'draw'
    }
  ],
  jobsiraAdvantages: [
    'Une interface pensée pour les connexions mobiles courantes en Afrique',
    'Correction de CV assistée par l\'IA pour éviter les fautes éliminatoires',
    'Proposition de lettres de motivation adaptées au marché ouest-africain'
  ],
  competitorAdvantages: [
    'Gratuité sur plusieurs modèles de base sans limite de téléchargement',
    'Outil d\'hébergement de CV en ligne gratuit'
  ],
  targetAudience: 'Les jeunes diplômés et professionnels en Côte d\'Ivoire, au Burkina ou au Sénégal qui modifient principalement leur CV depuis leur smartphone.',
  cta: 'Créer un CV facilement sur mon mobile'
};
