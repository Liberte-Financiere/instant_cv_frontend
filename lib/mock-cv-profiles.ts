import { CV, DEFAULT_SECTION_ORDER } from "@/types/cv";

// ─── CATÉGORIE : ÉTUDIANT ────────────────────────────────────────────────────

export const MOCK_ETUDIANT: CV = {
  id: "mock-etudiant",
  title: "Stage L3 - Génie Logiciel",
  templateId: "modern",
  personalInfo: {
    firstName: "Amadou",
    lastName: "Sawadogo",
    email: "amadou.sawadogo@univ-ouaga.bf",
    phone: "+226 70 12 34 56",
    address: "Ouagadougou, Burkina Faso",
    title: "Étudiant en Génie Logiciel – L3",
    summary:
      "Étudiant passionné en 3e année de Génie Logiciel, à la recherche d'un stage de fin d'études. Solides bases en développement web (React, Node.js) et en algorithmique. Expérience pratique à travers des projets académiques et un hackathon national. Motivé, rigoureux et prêt à contribuer à des projets concrets.",
  },
  experiences: [
    {
      id: "e1",
      company: "Faso Digital Lab",
      position: "Stagiaire Développeur Web",
      startDate: "Juil 2025",
      endDate: "Sep 2025",
      current: false,
      description:
        "Développement d'une application de gestion de stocks pour une coopérative agricole. Utilisation de React et Firebase. Participation aux sprints Agile hebdomadaires.",
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "Université Joseph Ki-Zerbo",
      degree: "Licence Génie Logiciel",
      field: "Informatique",
      startDate: "2023",
      endDate: "2026",
    },
    {
      id: "ed2",
      institution: "Lycée Philippe Zinda Kaboré",
      degree: "Baccalauréat Série C",
      field: "Mathématiques & Sciences Physiques",
      startDate: "2020",
      endDate: "2023",
    },
  ],
  skills: [
    { id: "s1", name: "HTML / CSS", level: 4 },
    { id: "s2", name: "JavaScript", level: 4 },
    { id: "s3", name: "React", level: 3 },
    { id: "s4", name: "Node.js", level: 3 },
    { id: "s5", name: "Python", level: 3 },
    { id: "s6", name: "Git / GitHub", level: 4 },
  ],
  languages: [
    { id: "l1", name: "Français", level: "Natif" },
    { id: "l2", name: "Anglais", level: "Intermédiaire" },
  ],
  hobbies: [
    { id: "h1", name: "Hackathons" },
    { id: "h2", name: "Football" },
    { id: "h3", name: "Lecture tech" },
  ],
  certifications: [
    {
      id: "c1",
      name: "Responsive Web Design",
      organization: "freeCodeCamp",
      date: "2025",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Gestion de bibliothèque",
      description: "Application web permettant de gérer les emprunts d'une bibliothèque universitaire. Projet de groupe (4 personnes).",
      technologies: "React, Express, MongoDB",
    },
  ],
  references: [],
  qualities: [
    { id: "q1", name: "Curiosité" },
    { id: "q2", name: "Travail d'équipe" },
    { id: "q3", name: "Autonomie" },
  ],
  socialLinks: [
    { id: "sl1", platform: "github", url: "github.com/amadou-sawadogo" },
    { id: "sl2", platform: "linkedin", url: "linkedin.com/in/amadou-sawadogo" },
  ],
  divers: "",
  footer: { showFooter: false, madeAt: "", madeDate: "" },
  settings: { accentColor: "#2563eb", fontFamily: "sans" },
  sectionOrder: DEFAULT_SECTION_ORDER,
  views: 0,
  isPublic: false,
  isSearchable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── CATÉGORIE : PROFESSIONNEL ───────────────────────────────────────────────

export const MOCK_PROFESSIONNEL: CV = {
  id: "mock-professionnel",
  title: "Développeur Full-Stack Senior",
  templateId: "modern",
  personalInfo: {
    firstName: "Fatou",
    lastName: "Diallo",
    email: "fatou.diallo@tech-lead.com",
    phone: "+33 6 45 78 12 90",
    address: "75011 Paris, France",
    title: "Développeur Full-Stack Senior",
    summary:
      "Ingénieure logiciel avec 8 ans d'expérience en développement full-stack. Experte en React, Node.js et architectures cloud. J'ai dirigé des équipes techniques de 6 à 10 personnes et livré des plateformes SaaS utilisées par 100k+ utilisateurs. Passionnée par le clean code, le mentoring et l'innovation produit.",
  },
  experiences: [
    {
      id: "e1",
      company: "DataScale Solutions",
      position: "Lead Developer",
      startDate: "Jan 2022",
      endDate: "Présent",
      current: true,
      description:
        "Direction technique d'une équipe de 8 développeurs. Architecture d'une plateforme data utilisée par 50k+ entreprises. Réduction de la dette technique de 35% et amélioration des temps de réponse API de 60%.",
    },
    {
      id: "e2",
      company: "Creative Digital Agency",
      position: "Senior Frontend Developer",
      startDate: "Mar 2019",
      endDate: "Déc 2021",
      current: false,
      description:
        "Développement d'interfaces pour des clients grands comptes (Luxe, Automobile). Mise en place d'un Design System utilisé par 3 équipes. Mentoring de 4 développeurs juniors.",
    },
    {
      id: "e3",
      company: "StartUp Innovation",
      position: "Full Stack Developer",
      startDate: "Sep 2017",
      endDate: "Fév 2019",
      current: false,
      description:
        "Premier développeur recruté. Création du MVP (Node.js/React). Mise en place CI/CD sur AWS. Croissance de 0 à 10k utilisateurs en 18 mois.",
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "EPITECH Paris",
      degree: "Expert en Technologies de l'Information",
      field: "Informatique",
      startDate: "2012",
      endDate: "2017",
    },
  ],
  skills: [
    { id: "s1", name: "React / Next.js", level: 5 },
    { id: "s2", name: "TypeScript", level: 5 },
    { id: "s3", name: "Node.js / NestJS", level: 4 },
    { id: "s4", name: "PostgreSQL / Prisma", level: 4 },
    { id: "s5", name: "Docker / K8s", level: 3 },
    { id: "s6", name: "AWS / Vercel", level: 4 },
  ],
  languages: [
    { id: "l1", name: "Français", level: "Natif" },
    { id: "l2", name: "Anglais", level: "Avancé" },
    { id: "l3", name: "Espagnol", level: "Intermédiaire" },
  ],
  hobbies: [
    { id: "h1", name: "Open Source" },
    { id: "h2", name: "Conférences Tech" },
    { id: "h3", name: "Course à pied" },
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Solutions Architect",
      organization: "Amazon Web Services",
      date: "2023",
    },
    {
      id: "c2",
      name: "Meta Frontend Developer",
      organization: "Coursera",
      date: "2021",
    },
  ],
  projects: [],
  references: [],
  qualities: [
    { id: "q1", name: "Leadership" },
    { id: "q2", name: "Rigueur" },
    { id: "q3", name: "Communication" },
  ],
  socialLinks: [
    { id: "sl1", platform: "linkedin", url: "linkedin.com/in/fatou-diallo" },
    { id: "sl2", platform: "github", url: "github.com/fatoudiallo" },
    { id: "sl3", platform: "portfolio", url: "fatoudiallo.dev" },
  ],
  divers: "",
  footer: { showFooter: false, madeAt: "", madeDate: "" },
  settings: { accentColor: "#2563eb", fontFamily: "sans" },
  sectionOrder: DEFAULT_SECTION_ORDER,
  views: 0,
  isPublic: false,
  isSearchable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── CATÉGORIE : RECONVERSION ────────────────────────────────────────────────

export const MOCK_RECONVERSION: CV = {
  id: "mock-reconversion",
  title: "Transition Tech - Support",
  templateId: "modern",
  personalInfo: {
    firstName: "Isabelle",
    lastName: "Konaté",
    email: "isabelle.konate@mail.com",
    phone: "+33 7 89 01 23 45",
    address: "Lyon, France",
    title: "En reconversion — Support IT & Helpdesk",
    summary:
      "Après 10 ans dans la gestion administrative, j'ai entamé une reconversion vers l'IT. Diplômée d'une formation intensive en support informatique (Technicien Helpdesk), je combine expertise organisationnelle, sens du service client et nouvelles compétences techniques. Motivée à intégrer une équipe IT dynamique pour apporter ma rigueur et ma capacité d'adaptation.",
  },
  experiences: [
    {
      id: "e1",
      company: "Cabinet Juridique Martin & Associés",
      position: "Assistante de Direction",
      startDate: "Sep 2015",
      endDate: "Juin 2025",
      current: false,
      description:
        "Gestion de l'agenda de 3 avocats associés. Administration du parc informatique du cabinet (15 postes). Formation des nouveaux collaborateurs aux outils internes. Mise en place d'un système de classement numérique réduisant le temps de recherche de dossiers de 50%.",
    },
    {
      id: "e2",
      company: "Mairie de Villeurbanne",
      position: "Agent Administratif",
      startDate: "Mar 2013",
      endDate: "Août 2015",
      current: false,
      description:
        "Accueil du public et traitement des demandes. Utilisation quotidienne des logiciels métier. Gestion de bases de données et reporting.",
    },
  ],
  education: [
    {
      id: "ed1",
      institution: "OpenClassrooms",
      degree: "Technicien Informatique Helpdesk",
      field: "Support IT — Titre RNCP Niv. 5",
      startDate: "2025",
      endDate: "2026",
    },
    {
      id: "ed2",
      institution: "Université Lyon 2",
      degree: "Licence AES",
      field: "Administration Économique et Sociale",
      startDate: "2010",
      endDate: "2013",
    },
  ],
  skills: [
    { id: "s1", name: "Windows / Linux", level: 3 },
    { id: "s2", name: "Active Directory", level: 3 },
    { id: "s3", name: "Réseau (TCP/IP)", level: 2 },
    { id: "s4", name: "GLPI / Ticketing", level: 4 },
    { id: "s5", name: "Suite Office 365", level: 5 },
    { id: "s6", name: "Gestion de projet", level: 4 },
  ],
  languages: [
    { id: "l1", name: "Français", level: "Natif" },
    { id: "l2", name: "Anglais", level: "Intermédiaire" },
  ],
  hobbies: [
    { id: "h1", name: "Randonnée" },
    { id: "h2", name: "Bénévolat associatif" },
    { id: "h3", name: "Veille technologique" },
  ],
  certifications: [
    {
      id: "c1",
      name: "Google IT Support Professional",
      organization: "Google / Coursera",
      date: "2025",
    },
    {
      id: "c2",
      name: "TOSA — Excel Avancé",
      organization: "ISOGRAD",
      date: "2024",
    },
  ],
  projects: [],
  references: [],
  qualities: [
    { id: "q1", name: "Adaptabilité" },
    { id: "q2", name: "Sens du service" },
    { id: "q3", name: "Organisation" },
    { id: "q4", name: "Persévérance" },
  ],
  socialLinks: [
    { id: "sl1", platform: "linkedin", url: "linkedin.com/in/isabelle-konate" },
  ],
  divers: "Permis B — Véhicule personnel",
  footer: { showFooter: false, madeAt: "", madeDate: "" },
  settings: { accentColor: "#2563eb", fontFamily: "sans" },
  sectionOrder: DEFAULT_SECTION_ORDER,
  views: 0,
  isPublic: false,
  isSearchable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── MAP DES PROFILS PAR CATÉGORIE ──────────────────────────────────────────

export type CategoryId = 'etudiant' | 'professionnel' | 'reconversion';

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  mockCV: CV;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'etudiant', label: 'Étudiant', mockCV: MOCK_ETUDIANT },
  { id: 'professionnel', label: 'Professionnel', mockCV: MOCK_PROFESSIONNEL },
  { id: 'reconversion', label: 'Reconversion', mockCV: MOCK_RECONVERSION },
];
