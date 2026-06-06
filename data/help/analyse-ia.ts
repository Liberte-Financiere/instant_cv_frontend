import { HelpArticle } from './types';

export const analyseArticles: HelpArticle[] = [
  {
    slug: 'analyse-compatibilite-cv',
    title: 'Analyser la compatibilité de mon CV avec un poste',
    category: 'Analyse & Scoring IA',
    description: 'Découvrez comment utiliser notre outil de matching pour savoir si votre CV correspond à une offre d\'emploi.',
    content: `<p>Ne postulez plus au hasard. Notre outil de matching IA analyse votre CV par rapport à une offre d'emploi spécifique pour évaluer vos chances d'être sélectionné.</p>
<h2>Comment utiliser l'outil de matching ?</h2>
<ol>
  <li>Allez dans le menu <strong>Outils IA</strong> > <strong>Matcher une offre</strong>.</li>
  <li>Sélectionnez le CV que vous souhaitez tester.</li>
  <li>Copiez et collez la description de l'offre d'emploi dans le champ prévu à cet effet.</li>
  <li>Cliquez sur <strong>Lancer l'analyse</strong>.</li>
</ol>
<h2>Conseil pratique local</h2>
<p>Pour de meilleurs résultats, incluez toute la description de poste, y compris les compétences requises, les diplômes exigés et les missions clés.</p>
<p><a href="/dashboard/ai/match" class="text-primary font-bold hover:underline">Tester la compatibilité de mon CV →</a></p>`,
    image: null,
    order: 1
  },
  {
    slug: 'optimiser-score-ats',
    title: 'Optimiser son score de compatibilité ATS',
    category: 'Analyse & Scoring IA',
    description: 'Comprenez le fonctionnement des systèmes ATS et apprenez à formater votre CV pour ne plus être rejeté automatiquement.',
    content: `<p>Les systèmes de gestion des candidatures (ATS) filtrent les CV avant même qu'un humain ne les lise. Un CV mal structuré peut être rejeté automatiquement.</p>
<h2>Nos recommandations pour maximiser votre score ATS</h2>
<ul>
  <li><strong>Utilisez des mots-clés de l'offre :</strong> Adaptez votre CV en reprenant les termes exacts utilisés par le recruteur.</li>
  <li><strong>Structure claire :</strong> Utilisez des titres de section standard (Expériences, Formations, Compétences).</li>
  <li><strong>Format propre :</strong> Évitez les graphiques complexes, les tableaux imbriqués ou les images contenant du texte.</li>
</ul>
<p><a href="/dashboard/ai/analyze" class="text-primary font-bold hover:underline">Analyser mon CV maintenant →</a></p>`,
    image: null,
    order: 2
  }
];
