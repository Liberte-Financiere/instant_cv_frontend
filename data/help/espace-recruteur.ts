import { HelpArticle } from './types';

export const recruiterArticles: HelpArticle[] = [
  {
    slug: 'recherche-candidats-recruteur',
    title: 'Rechercher et filtrer les candidats qualifiés',
    category: 'Espace Recruteur',
    description: 'Accédez à notre base de données de candidats pré-qualifiés et trouvez le profil idéal grâce aux filtres de recherche.',
    content: `<p>L'Espace Recruteur de Jobsira permet de trouver des talents techniques de haut niveau en Afrique francophone.</p>
<h2>Comment trouver un candidat ?</h2>
<ol>
  <li>Accédez à votre espace Recruteur via le menu dédié.</li>
  <li>Utilisez la barre de recherche pour chercher des compétences clés ou un titre de poste.</li>
  <li>Filtrez les profils par secteur d'activité, pays d'origine, ou années d'expérience.</li>
  <li>Parcourez les profils anonymisés montrant les compétences, les expériences et le résumé IA du candidat.</li>
</ol>
<p><a href="/recruiter/register" class="text-primary font-bold hover:underline">S'inscrire comme Recruteur →</a></p>`,
    image: null,
    order: 1
  },
  {
    slug: 'credits-recruteur-deverrouillage',
    title: 'Fonctionnement du système de crédits recruteur',
    category: 'Espace Recruteur',
    description: 'Découvrez comment utiliser vos crédits recruteur pour dévoiler les informations de contact des candidats.',
    content: `<p>Pour préserver la confidentialité des candidats, leurs coordonnées (nom, email, téléphone) sont masquées par défaut.</p>
<h2>Déverrouiller un profil</h2>
<ul>
  <li>Chaque déverrouillage de profil consomme <strong>1 crédit recruteur</strong>.</li>
  <li>Une fois le profil déverrouillé, les coordonnées complètes du candidat s'affichent et vous pouvez le contacter directement.</li>
  <li>Les nouveaux comptes recruteurs bénéficient de <strong>3 déverrouillages gratuits</strong> de bienvenue.</li>
</ul>
<p><a href="/recruiter/register" class="text-primary font-bold hover:underline">Accéder au portail recruteur →</a></p>`,
    image: null,
    order: 2
  }
];
