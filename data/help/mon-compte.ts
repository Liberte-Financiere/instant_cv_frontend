import { HelpArticle } from './types';

export const monCompteArticles: HelpArticle[] = [
  {
    slug: 'gerer-credits-abonnements',
    title: 'Gérer ses crédits et abonnements',
    category: 'Mon Compte',
    description: 'Comprenez comment fonctionne le système de crédits pour utiliser les outils IA et comment recharger votre compte.',
    content: `<p>Chaque action IA consomme des crédits (génération de CV, traduction, simulation d'entretien). Vous pouvez suivre et recharger vos crédits à tout moment.</p>
<h2>Acheter des crédits</h2>
<ol>
  <li>Allez dans <strong>Acheter des Crédits</strong> depuis le tableau de bord.</li>
  <li>Sélectionnez le pack qui correspond à vos besoins.</li>
  <li>Payez en toute sécurité via <strong>LigdiCash</strong> en utilisant les moyens de paiement locaux (Orange Money, Moov Money, Wave, etc.).</li>
  <li>Les crédits sont ajoutés instantanément à votre compte après confirmation de paiement.</li>
</ol>
<p><a href="/dashboard/pricing" class="text-primary font-bold hover:underline">Recharger mes crédits →</a></p>`,
    image: null,
    order: 1
  },
  {
    slug: 'parrainage-credits-gratuits',
    title: 'Le système de parrainage et bonus',
    category: 'Mon Compte',
    description: 'Partagez votre code de parrainage unique pour obtenir des crédits ou des accès premium gratuits pour chaque ami inscrit.',
    content: `<p>Gagnez des accès premium et des crédits en invitant vos amis et collègues à utiliser Jobsira.</p>
<h2>Comment parrainer ?</h2>
<ol>
  <li>Rendez-vous dans la section <strong>Parrainage</strong> de votre tableau de bord.</li>
  <li>Copiez votre lien ou code de parrainage unique.</li>
  <li>Partagez-le avec vos proches sur WhatsApp, LinkedIn ou par email.</li>
  <li>Dès qu'un ami s'inscrit avec votre code, vous recevez un bonus sous forme de crédits supplémentaires.</li>
</ol>
<p><a href="/dashboard" class="text-primary font-bold hover:underline">Voir mon code de parrainage →</a></p>`,
    image: null,
    order: 2
  }
];
