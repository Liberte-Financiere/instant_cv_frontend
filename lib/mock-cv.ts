import { CV, DEFAULT_SECTION_ORDER } from "@/types/cv";

export const MOCK_PREVIEW_CV: CV = {
  id: "preview",
  title: "Aperçu",
  templateId: "modern",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@tech-lead.com",
    phone: "+33 6 12 34 56 78",
    address: "75011 Paris, France",
    title: "Senior Full Stack Engineer",
    summary: "Ingénieur logiciel passionné avec plus de 7 ans d'expérience dans la conception d'architectures scalables et le leadership technique. Expert en écosystème JavaScript (React, Node.js, TypeScript), j'ai guidé plusieurs équipes vers le succès en adoptant les meilleures pratiques DevOps et Agile. Toujours à l'affût des dernières innovations technologiques pour résoudre des problèmes complexes.",
  },
  experiences: [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Lead Developer",
      startDate: "Jan 2021",
      endDate: "Présent",
      current: true,
      description: "Direction technique d'une équipe de 8 développeurs. Architecture d'une plateforme SaaS utilisée par 50k+ utilisateurs quotidiens. Réduction de la dette technique de 40% et amélioration des performances de chargement de 60% via l'adoption de Next.js et Vercel.",
    },
    {
      id: "2",
      company: "Creative Digital Agency",
      position: "Senior Frontend Developer",
      startDate: "Mar 2018",
      endDate: "Déc 2020",
      current: false,
      description: "Développement d'interfaces utilisateurs complexes pour des clients grands comptes (Luxe, Automobile). Implémentation de Design Systems robustes et accessibles. Mentoring de 3 développeurs juniors et mise en place de processus de Code Review rigoureux.",
    },
    {
      id: "3",
      company: "StartUp Nation",
      position: "Full Stack Developer",
      startDate: "Sep 2015",
      endDate: "Fév 2018",
      current: false,
      description: "Premier développeur recruté. Création du MVP de zéro (Node.js/React). Mise en place de l'infrastructure CI/CD sur AWS. Participation active à la définition du produit avec les fondateurs.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "École 42",
      degree: "Architecte Logiciel",
      field: "Informatique & Réseaux",
      startDate: "2012",
      endDate: "2015",
    },
    {
      id: "2",
      institution: "Université Paris-Saclay",
      degree: "Licence Mathématiques",
      field: "Mathématiques Appliquées",
      startDate: "2010",
      endDate: "2012",
    },
  ],
  skills: [
    { id: "1", name: "React / Next.js", level: 5 },
    { id: "2", name: "TypeScript", level: 5 },
    { id: "3", name: "Node.js / NestJS", level: 4 },
    { id: "4", name: "PostgreSQL / Prisma", level: 4 },
    { id: "5", name: "Docker / Kubernetes", level: 3 },
    { id: "6", name: "AWS / Vercel", level: 4 },
  ],
  languages: [
    { id: "1", name: "Français", level: "Natif" },
    { id: "2", name: "Anglais", level: "Avancé (C1)" },
    { id: "3", name: "Espagnol", level: "Intermédiaire" },
  ],
  hobbies: [
    { id: "1", name: "Contributions Open Source" },
    { id: "2", name: "Hackathons (Mentor)" },
    { id: "3", name: "Photographie Urbaine" },
    { id: "4", name: "Marathon" },
  ],
  certifications: [
    {
       id: "1",
       name: "AWS Certified Solutions Architect",
       organization: "Amazon Web Services",
       date: "2022"
    },
    {
       id: "2",
       name: "Meta Frontend Developer",
       organization: "Coursera",
       date: "2020"
    }
  ],
  projects: [],
  references: [],
  socialLinks: [
    { id: "1", platform: "linkedin", url: "linkedin.com/in/johndoe" },
    { id: "2", platform: "github", url: "github.com/johndoe" },
    { id: "3", platform: "portfolio", url: "johndoe.dev" }
  ],
  divers: "",
  footer: {
    showFooter: false,
    madeAt: "",
    madeDate: "",
  },
  settings: {
    accentColor: "#2563eb",
    fontFamily: "sans",
  },
  sectionOrder: DEFAULT_SECTION_ORDER,
  createdAt: new Date(),
  updatedAt: new Date(),
};
