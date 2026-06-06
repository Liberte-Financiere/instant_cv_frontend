import { HelpArticle } from './types';

export const lettresArticles: HelpArticle[] = [
  {
    slug: 'generer-lettre-motivation-ia',
    title: 'Générer une lettre de motivation avec l\'IA',
    category: 'Lettre de Motivation',
    description: 'Rédigez une lettre de motivation sur-mesure pour chaque offre d\'emploi en moins de 2 minutes.',
    content: `<p>La lettre de motivation reste un document indispensable pour accompagner votre candidature en Afrique francophone. Jobsira utilise l'intelligence artificielle pour générer des lettres ciblées.</p>
<h2>Comment faire ?</h2>
<ol>
  <li>Accédez à la section <strong>Mes lettres</strong> depuis le tableau de bord.</li>
  <li>Cliquez sur <strong>Créer une lettre</strong>.</li>
  <li>Renseignez le titre du poste, copiez-collez l'offre d'emploi, et associez votre CV si vous le souhaitez.</li>
  <li>L'IA rédigera une lettre convaincante faisant le pont entre votre profil et l'offre d'emploi.</li>
</ol>
<h2>Conseil pratique local</h2>
<p>N'hésitez pas à demander à l'IA d'insister sur les aspects d'adaptation locale ou vos connaissances sectorielles régionales lors de la génération.</p>
<p><a href="/dashboard/cover-letters" class="text-primary font-bold hover:underline">Générer ma lettre →</a></p>`,
    image: null,
    order: 1
  },
  {
    slug: 'personnaliser-exporter-lettre',
    title: 'Personnaliser et exporter sa lettre',
    category: 'Lettre de Motivation',
    description: 'Modifiez manuellement votre lettre et téléchargez-la au format PDF ou Word.',
    content: `<p>Toutes les lettres générées par Jobsira sont entièrement modifiables pour correspondre parfaitement à votre style et vos objectifs.</p>
<h2>Personnaliser et télécharger</h2>
<ol>
  <li>Ouvrez votre lettre dans l'éditeur.</li>
  <li>Modifiez le texte directement : ajoutez vos salutations personnalisées, changez l'objet ou le corps du message.</li>
  <li>Une fois satisfait, cliquez sur <strong>Exporter</strong> en haut à droite.</li>
  <li>Choisissez le format d'export de votre choix (PDF ou Word).</li>
</ol>
<h2>Conseil pratique local</h2>
<p>Vérifiez toujours les formules de politesse pour qu'elles correspondent aux usages administratifs du pays de destination (Burkina Faso, Sénégal, Côte d'Ivoire).</p>
<p><a href="/dashboard/cover-letters" class="text-primary font-bold hover:underline">Accéder à mes lettres →</a></p>`,
    image: null,
    order: 2
  }
];
