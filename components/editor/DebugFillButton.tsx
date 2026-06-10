'use client';

import { useCVStore } from '@/store/useCVStore';
import { BugPlay } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DebugFillButton() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const fillDummyData = () => {
    useCVStore.setState((state) => {
      if (!state.currentCV) return state;
      return {
        ...state,
        currentCV: {
          ...state.currentCV,
          personalInfo: {
            ...state.currentCV.personalInfo,
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '+33 6 12 34 56 78',
            address: 'Paris, France',
            title: 'Développeur Fullstack Sénior',
            summary: 'Développeur passionné avec plus de 10 ans d\'expérience dans la création d\'applications web performantes. Expert en React, Node.js et architecture cloud. Toujours à la recherche de nouveaux défis techniques.',
          },
          experiences: [
            {
              id: 'exp1',
              title: 'Tech Lead / Architecte Web',
              company: 'TechCorp Innovation',
              location: 'Paris (Hybride)',
              position: 'Tech Lead',
              startDate: '2020-01-01',
              endDate: '',
              current: true,
              description: '<ul><li>Direction technique d\'une équipe de 8 développeurs sur la refonte du SI principal.</li><li>Mise en place d\'une architecture micro-services en Node.js et Docker.</li><li>Amélioration des performances de 40% sur les temps de réponse.</li></ul>',
            },
            {
              id: 'exp2',
              title: 'Développeur Fullstack React/Node',
              company: 'StartUp Studio',
              location: 'Lyon',
              position: 'Développeur Fullstack',
              startDate: '2016-09-01',
              endDate: '2019-12-31',
              current: false,
              description: '<ul><li>Développement from scratch d\'applications SaaS B2B.</li><li>Intégration continue avec GitLab CI et déploiement automatisé.</li><li>Participation active aux rituels agiles (Scrum).</li></ul>',
            },
            {
              id: 'exp3',
              title: 'Développeur Front-End Junior',
              company: 'WebAgency',
              location: 'Bordeaux',
              position: 'Développeur Front-End',
              startDate: '2014-06-01',
              endDate: '2016-08-31',
              current: false,
              description: '<ul><li>Intégration de maquettes Figma en HTML/CSS/JS.</li><li>Optimisation SEO technique et accessibilité pour des sites e-commerce.</li></ul>',
            }
          ],
          education: [
            {
              id: 'edu1',
              degree: 'Master Expert en Ingénierie Informatique',
              school: 'Epitech',
              institution: 'Epitech',
              field: 'Informatique',
              location: 'Paris',
              startDate: '2011-09-01',
              endDate: '2016-06-30',
              current: false,
              description: 'Spécialisation en architecture logicielle et sécurité.',
            },
            {
              id: 'edu2',
              degree: 'Licence Informatique de Gestion',
              school: 'Université Paris 8',
              institution: 'Université Paris 8',
              field: 'Informatique',
              location: 'Saint-Denis',
              startDate: '2008-09-01',
              endDate: '2011-06-30',
              current: false,
              description: 'Option bases de données et développement web.',
            }
          ],
          skills: [
            { id: 'sk1', name: 'React / Next.js', level: 5 },
            { id: 'sk2', name: 'Node.js / Express', level: 5 },
            { id: 'sk3', name: 'TypeScript', level: 4 },
            { id: 'sk4', name: 'Docker / Kubernetes', level: 3 },
            { id: 'sk5', name: 'PostgreSQL / MongoDB', level: 4 },
            { id: 'sk6', name: 'TailwindCSS / SASS', level: 5 },
            { id: 'sk7', name: 'CI/CD (GitLab, GitHub Actions)', level: 4 }
          ],
          languages: [
            { id: 'lang1', name: 'Français', level: 'Natif' },
            { id: 'lang2', name: 'Anglais', level: 'Avancé' },
            { id: 'lang3', name: 'Espagnol', level: 'Intermédiaire' },
          ],
          projects: [
            {
              id: 'proj1',
              name: 'Application de Gestion RH (SaaS)',
              description: 'Création d\'un portail employé avec gestion des congés et notes de frais. Utilisé par plus de 50 entreprises.',
              technologies: 'React, Node.js, PostgreSQL',
              url: 'https://example.com',
              github: 'https://github.com/example/rh-app'
            },
            {
              id: 'proj2',
              name: 'Plateforme E-commerce B2C',
              description: 'Développement complet d\'une boutique en ligne avec paiement Stripe et tableau de bord d\'administration complet.',
              technologies: 'Next.js, TailwindCSS, Stripe API',
              url: 'https://shop.example.com',
              github: ''
            },
            {
              id: 'proj3',
              name: 'Outil de Monitoring Open Source',
              description: 'Bibliothèque NPM de monitoring des performances web (Web Vitals) avec dashboard de visualisation en temps réel.',
              technologies: 'TypeScript, WebSocket, D3.js',
              url: '',
              github: 'https://github.com/example/monitoring'
            }
          ],
          certifications: [
            {
              id: 'cert1',
              name: 'AWS Certified Solutions Architect',
              organization: 'Amazon Web Services',
              date: '2022-05-15',
              url: 'https://aws.amazon.com',
              credentialUrl: 'https://aws.amazon.com/certification'
            },
            {
              id: 'cert2',
              name: 'Google Cloud Professional Developer',
              organization: 'Google Cloud',
              date: '2023-10-20',
              url: 'https://cloud.google.com/certification',
              credentialUrl: 'https://google.com'
            },
            {
              id: 'cert3',
              name: 'Certified Kubernetes Administrator (CKA)',
              organization: 'Cloud Native Computing Foundation',
              date: '2021-08-10',
              url: 'https://cncf.io',
              credentialUrl: 'https://cncf.io/certification'
            }
          ],
          qualities: [
            { id: 'qual1', name: 'Leadership' },
            { id: 'qual2', name: 'Résolution de problèmes complexes' },
            { id: 'qual3', name: 'Communication fluide' },
            { id: 'qual4', name: 'Pédagogie et mentorat' }
          ],
          hobbies: [
            { id: 'hob1', name: 'Photographie argentique' },
            { id: 'hob2', name: 'Alpinisme et escalade' },
            { id: 'hob3', name: 'Création de jeux vidéos indés' }
          ],
          socialLinks: [
            { id: 'soc1', platform: 'linkedin', url: 'https://linkedin.com/in/jeandupont', label: 'jeandupont' },
            { id: 'soc2', platform: 'github', url: 'https://github.com/jeandupont', label: '@jeandupont' }
          ],
          references: [
            {
              id: 'ref1',
              name: 'Marie Curie',
              position: 'CTO',
              company: 'TechCorp Innovation',
              email: 'marie.curie@techcorp.com',
              phone: '+33 6 00 00 00 00',
              hideContact: false
            },
            {
              id: 'ref2',
              name: 'Alan Turing',
              position: 'Lead Developer',
              company: 'StartUp Studio',
              email: 'alan.turing@startup.io',
              phone: '',
              hideContact: false
            }
          ],
          divers: 'Permis B, Véhiculé. Mobile dans toute la France. Possibilité de télétravail à 100%.',
          footer: {
            showFooter: true,
            madeAt: 'Fait à Paris',
            madeDate: 'Le ' + new Date().toLocaleDateString('fr-FR'),
            signatureUrl: ''
          }
        }
      };
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={fillDummyData}
      title="[DEV] Remplir avec données de test"
      className="text-orange-500 border-orange-200 bg-orange-50 hover:bg-orange-100"
    >
      <BugPlay className="w-4 h-4" />
    </Button>
  );
}
