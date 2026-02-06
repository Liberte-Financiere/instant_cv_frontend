import { CV, DEFAULT_SECTION_ORDER } from '@/types/cv';

export const DUMMY_CV: CV = {
  id: 'preview',
  title: 'Preview',
  templateId: 'modern',
  isPublic: false,
  views: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  sectionOrder: DEFAULT_SECTION_ORDER,
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    address: 'Paris, France',
    title: 'Développeur Fullstack',
    summary: 'Développeur passionné avec 5 ans d\'expérience dans la création d\'applications web modernes. Expert en React et Node.js.',
  },
  skills: [
    { id: '1', name: 'React', level: 5 },
    { id: '2', name: 'Node.js', level: 4 },
    { id: '3', name: 'TypeScript', level: 4 },
    { id: '4', name: 'Tailwind CSS', level: 5 },
  ],
  experiences: [
    {
      id: '1',
      company: 'Tech Solutions',
      position: 'Senior Developer',
      // location experienced removed as per interface
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Développement d\'une plateforme SaaS utilisée par 10k+ utilisateurs. Leadership technique et code review.',
    },
    {
      id: '2',
      company: 'Web Agency',
      position: 'Frontend Dev',
      // location removed
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: 'Intégration de maquettes complexes et optimisation des performances web.',
    }
  ],
  education: [
    {
      id: '1',
      institution: 'École 42', // Changed from school to institution
      degree: 'Architecte Logiciel',
      field: 'Informatique', // Added field
      startDate: '2015',
      endDate: '2018',
    }
  ],
  languages: [
    { id: '1', name: 'Français', level: 'Natif' },
    { id: '2', name: 'Anglais', level: 'Avancé' }, // 'C1' -> 'Avancé'
  ],
  hobbies: [
    { id: '1', name: 'Open Source' },
    { id: '2', name: 'Photographie' },
  ],
  certifications: [],
  projects: [],
  references: [],
  qualities: [],
  divers: '',
  socialLinks: [
    { id: '1', platform: 'linkedin', url: 'linkedin.com/in/johndoe' }, // Lowercase platform
    { id: '2', platform: 'github', url: 'github.com/johndoe' },
  ],
  footer: {
    showFooter: false,
    madeAt: '',
    madeDate: ''
  },
  settings: {
     accentColor: '#2563eb', // changed from themeColor
     fontFamily: 'sans', // changed from 'Inter'
  }
};
