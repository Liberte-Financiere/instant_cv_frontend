import { Competitor } from './types';

export const emploiburkinaData: Competitor = {
  slug: 'emploiburkina',
  name: 'Emploi Burkina',
  tagline: 'Le portail d\'emploi historique au Burkina Faso',
  category: 'Plateforme locale Afrique',
  description: 'Découvrez pourquoi associer Jobsira et Emploi Burkina maximisera vos chances d\'être recruté au Burkina Faso.',
  verdict: 'Emploi Burkina est un excellent site d\'affichage d\'offres locales, mais il ne propose aucun outil pour concevoir son CV ou sa lettre de motivation, ni d\'IA pour analyser ses chances de sélection par les recruteurs.',
  features: [
    {
      feature: 'Offres d\'emploi locales',
      jobsira: 'Offres ciblées avec mise en avant des profils locaux.',
      competitor: 'Grand volume d\'offres publiques et privées au Burkina Faso.',
      winner: 'competitor'
    },
    {
      feature: 'Créateur de CV & Modèles',
      jobsira: 'Outil de CV moderne avec designs professionnels.',
      competitor: 'Non disponible. Vous devez téléverser votre propre fichier Word ou PDF.',
      winner: 'jobsira'
    },
    {
      feature: 'Correction de CV par IA',
      jobsira: 'Analyse et réécriture de vos expériences professionnelles.',
      competitor: 'Aucune aide à la correction ou relecture.',
      winner: 'jobsira'
    },
    {
      feature: 'Préparation entretien d\'embauche',
      jobsira: 'Simulation d\'entretien avec questions basées sur l\'offre d\'emploi.',
      competitor: 'Non disponible.',
      winner: 'jobsira'
    }
  ],
  jobsiraAdvantages: [
    'Conception d\'un CV au format moderne qui se démarque des modèles classiques en noir et blanc',
    'Génération IA de lettres de motivation pour chaque annonce d\'Emploi Burkina',
    'Entraînement aux questions posées par les entreprises burkinabè'
  ],
  competitorAdvantages: [
    'Forte notoriété locale auprès des institutions et des grandes entreprises burkinabè',
    'Publication quotidienne d\'avis de recrutement officiels'
  ],
  targetAudience: 'Les chercheurs d\'emploi au Burkina Faso qui consultent les annonces sur Emploi Burkina mais veulent postuler avec le meilleur dossier de candidature grâce à Jobsira.',
  cta: 'Préparer mon CV pour Emploi Burkina'
};
