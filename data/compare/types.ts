export type ComparisonFeature = {
  feature: string;          // nom de la feature comparée
  jobsira: string;          // ce que Jobsira offre
  competitor: string;       // ce que le concurrent offre
  winner: 'jobsira' | 'competitor' | 'draw';
};

export type Competitor = {
  slug: string;             // ex: "canva", "linkedin"
  name: string;             // ex: "Canva", "LinkedIn"
  tagline: string;          // positionnement du concurrent en 1 phrase
  category: 'Design CV' | 'Réseau professionnel' | 'Plateforme emploi' | 'Outil CV' | 'Plateforme locale Afrique';
  description: string;      // résumé court pour le hub et meta SEO
  verdict: string;          // conclusion en 2-3 phrases (pourquoi Jobsira)
  features: ComparisonFeature[];
  jobsiraAdvantages: string[];   // points forts Jobsira vs ce concurrent
  competitorAdvantages: string[]; // points forts concurrent
  targetAudience: string;   // pour qui Jobsira est meilleur dans ce contexte
  cta: string;              // appel à l'action final
};
