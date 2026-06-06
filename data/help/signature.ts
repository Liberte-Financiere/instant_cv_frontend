import { HelpArticle } from './types';

export const signatureArticles: HelpArticle[] = [
  {
    slug: 'ajouter-signature-cv',
    title: 'Ajouter une signature électronique à son CV',
    category: 'Signature',
    description: 'Personnalisez votre CV en y apposant une signature électronique dessinée à la main.',
    content: `<p>Ajouter une signature sur votre CV renforce son aspect officiel et professionnel, notamment pour les profils seniors ou de consultants.</p>
<h2>Créer et utiliser votre signature</h2>
<ol>
  <li>Allez dans le menu <strong>Préférences</strong> > <strong>Ma Signature</strong> (ou via les réglages de l'éditeur).</li>
  <li>Utilisez le pavé de signature (sur mobile avec le doigt, ou sur ordinateur avec la souris) pour dessiner votre signature.</li>
  <li>Cliquez sur <strong>Enregistrer</strong>.</li>
  <li>Dans l'éditeur de votre CV, activez l'option signature pour l'insérer automatiquement en bas de page.</li>
</ol>
<h2>Sécurité</h2>
<p>Votre signature est stockée localement sur votre navigateur (localStorage). Elle n'est jamais envoyée brute sur nos serveurs sans votre action d'exportation.</p>
<p><a href="/dashboard/signature" class="text-primary font-bold hover:underline">Dessiner ma signature →</a></p>`,
    image: null,
    order: 1
  }
];
