import { Competitor } from './types';

export const canvaData: Competitor = {
  slug: 'canva',
  name: 'Canva',
  tagline: 'Le géant du design graphique grand public',
  category: 'Design CV',
  description: 'Comparez Jobsira et Canva pour savoir quel outil choisir pour concevoir un CV efficace et optimisé pour le marché africain.',
  verdict: 'Canva brille par ses capacités de design pur pour des profils créatifs. Cependant, il ne propose aucune intelligence artificielle d\'écriture, ne teste pas la compatibilité avec les robots de recrutement (ATS) et n\'intègre pas de paiement mobile money local.',
  features: [
    {
      feature: 'Modèles de CV',
      jobsira: 'Modèles épurés, professionnels et 100% compatibles ATS.',
      competitor: 'Milliers de modèles graphiques et colorés, souvent non ATS-friendly.',
      winner: 'draw'
    },
    {
      feature: 'Rédaction IA & Optimisation',
      jobsira: 'Génération de paragraphes, ajustement de ton et correction orthographique intégrée.',
      competitor: 'Aucune aide à la rédaction spécifique pour les CV.',
      winner: 'jobsira'
    },
    {
      feature: 'Analyse de compatibilité ATS',
      jobsira: 'Score de compatibilité par rapport à une offre d\'emploi avec recommandations.',
      competitor: 'Indisponible. Risque élevé de rejet par les robots de recrutement.',
      winner: 'jobsira'
    },
    {
      feature: 'Moyens de paiement en Afrique',
      jobsira: 'Paiement local par Orange Money, Moov Money, Wave via LigdiCash.',
      competitor: 'Uniquement cartes bancaires internationales (Visa/Mastercard) en devises étrangères.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Optimisation automatique pour passer les filtres des robots de recrutement (ATS)',
    'Génération IA de phrases d\'accroche et de descriptions de postes adaptées',
    'Achat de crédits par mobile money sans carte bancaire'
  ],
  competitorAdvantages: [
    'Variété infinie de styles graphiques, d\'illustrations et de couleurs',
    'Interface glisser-déposer ultra flexible pour la personnalisation visuelle'
  ],
  targetAudience: 'Les candidats à la recherche de postes administratifs, techniques ou managériaux en Afrique francophone, ayant besoin d\'un CV conforme aux normes des recruteurs.',
  cta: 'Créer mon CV optimisé ATS sur Jobsira'
};
