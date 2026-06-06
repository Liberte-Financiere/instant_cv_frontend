import { HelpArticle } from './types';

export const simulationArticles: HelpArticle[] = [
  {
    slug: 'entrainement-entretien-ia',
    title: 'S\'entraîner à un entretien d\'embauche avec l\'IA',
    category: 'Simulation d\'Entretien',
    description: 'Simulez un entretien d\'embauche réaliste en mode vocal ou textuel avec notre recruteur virtuel.',
    content: `<p>La clé de la réussite d'un entretien est la préparation. Notre simulateur d'entretien IA vous pose des questions basées sur votre CV et le poste visé.</p>
<h2>Démarrer une session d'entraînement</h2>
<ol>
  <li>Rendez-vous dans <strong>Outils IA</strong> > <strong>Simulateur d'entretien</strong>.</li>
  <li>Choisissez le format de l'entretien : <strong>Vocal</strong> ou <strong>Textuel</strong>.</li>
  <li>Sélectionnez le CV à utiliser et renseignez le titre du poste préparé.</li>
  <li>Cliquez sur <strong>Démarrer la simulation</strong> et commencez à répondre aux questions.</li>
</ol>
<p><a href="/dashboard/ai/interview" class="text-primary font-bold hover:underline">Démarrer une simulation d'entretien →</a></p>`,
    image: null,
    order: 1
  },
  {
    slug: 'rapport-performance-entretien',
    title: 'Analyser son rapport de performance d\'entretien',
    category: 'Simulation d\'Entretien',
    description: 'Comprenez vos points forts et axes d\'amélioration grâce à l\'évaluation détaillée générée en fin de session.',
    content: `<p>À la fin de chaque entretien simulé, Jobsira produit un rapport complet pour vous aider à vous améliorer.</p>
<h2>Que contient le rapport ?</h2>
<ul>
  <li><strong>Un score global :</strong> Une note de performance globale sur 100.</li>
  <li><strong>L'évaluation par question :</strong> Des retours précis sur la pertinence et la clarté de vos réponses.</li>
  <li><strong>Des conseils personnalisés :</strong> Les points forts à conserver et les points faibles à corriger.</li>
</ul>
<p><a href="/dashboard/ai/interview" class="text-primary font-bold hover:underline">Accéder à mes entretiens →</a></p>`,
    image: null,
    order: 2
  }
];
