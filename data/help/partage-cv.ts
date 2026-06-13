import { HelpArticle } from './types';

export const partageArticles: HelpArticle[] = [
  {
    slug: 'partager-cv-en-ligne',
    title: 'Partager son CV en ligne et suivre les vues',
    category: 'Partage en Ligne',
    description: 'Générez un lien de partage public pour votre CV et suivez en temps réel le nombre de consultations.',
    content: `<p>Partager votre CV via un lien unique facilite sa consultation par les recruteurs sur mobile ou ordinateur.</p>
<h2>Partager son CV</h2>
<ol>
  <li>Dans l'éditeur, cliquez sur le bouton <strong>Partager</strong> en haut à droite.</li>
  <li>Activez le partage public.</li>
  <li>Copiez le lien généré (ex: jobsira.com/share/xxxx).</li>
  <li>Partagez-le directement sur LinkedIn ou par message.</li>
</ol>
<h2>Suivi des statistiques</h2>
<p>Depuis votre tableau de bord, vous pourrez voir en temps réel combien de fois votre profil a été consulté par des recruteurs.</p>
<p><a href="/dashboard/list" class="text-primary font-bold hover:underline">Voir mes CVs →</a></p>`,
    image: null,
    order: 1
  },
  {
    slug: 'exporter-pdf-cv',
    title: 'Exporter et télécharger son CV en PDF HD',
    category: 'Partage en Ligne',
    description: 'Téléchargez un PDF vectoriel parfait pour postuler par email ou imprimer votre CV.',
    content: `<p>Jobsira garantit que vos CVs exportés conservent une qualité parfaite (HD vectoriel) et une compatibilité ATS complète.</p>
<h2>Comment exporter son CV ?</h2>
<ol>
  <li>Ouvrez votre CV dans l'éditeur.</li>
  <li>Cliquez sur le bouton de téléchargement en haut de la page.</li>
  <li>Le système prépare le rendu et télécharge le fichier PDF directement sur votre appareil.</li>
</ol>
<h2>Conseils pour l'impression</h2>
<p>Si vous devez imprimer votre CV, veillez à utiliser un papier de qualité pour conserver le professionnalisme du rendu graphique.</p>
<p><a href="/dashboard/list" class="text-primary font-bold hover:underline">Accéder à mes CVs →</a></p>`,
    image: null,
    order: 2
  }
];
