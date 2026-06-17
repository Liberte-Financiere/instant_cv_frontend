import { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: `Politique de Confidentialité | ${APP_CONFIG.name}`,
  description: `Politique de confidentialité et de gestion des données personnelles de ${APP_CONFIG.name}`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {APP_CONFIG.name}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Politique de Confidentialité
        </h1>

        <p className="text-slate-500 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-slate prose-lg max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Collecte des données
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Nous collectons les informations suivantes lorsque vous utilisez {APP_CONFIG.name} :
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Données d'identité (nom, prénom, email) lors de la création du compte.</li>
              <li>Données professionnelles saisies dans vos CV (expériences, compétences, formations).</li>
              <li>Données de connexion et d'utilisation de la plateforme.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Utilisation des données
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Générer et formater vos CV et lettres de motivation.</li>
              <li>Fournir des analyses intelligentes via l'Intelligence Artificielle.</li>
              <li>Permettre aux recruteurs de découvrir votre profil (uniquement si l'option "Recherchable" est activée).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Protection et Partage des données
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Vos données personnelles ne sont ni vendues, ni louées à des tiers. 
              Dans le cadre de l'Espace Recruteur, seuls les profils rendus expressément "Publics" et "Recherchables" sont indexés. 
              Même dans ce cas, vos données de contact (Nom, Prénom, Email, Téléphone) sont <strong>strictement anonymisées</strong> 
              lors de la recherche. Elles ne sont dévoilées qu'à un recruteur validé qui utilise ses crédits pour débloquer votre profil.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Intelligence Artificielle
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Pour vous fournir nos services avancés (rédaction automatique, vectorisation sémantique), certaines données textuelles 
              (sans informations de contact direct) sont transmises à nos partenaires d'IA (ex: Google Gemini). Ces partenaires ne sont 
              pas autorisés à utiliser vos données pour entraîner leurs propres modèles publics.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Vos Droits
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification, de suppression 
              et de portabilité de vos données. Vous pouvez supprimer votre CV et votre compte à tout moment depuis 
              les paramètres de votre tableau de bord.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Nous contacter
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Pour toute demande relative à vos données personnelles, veuillez nous écrire à :
              <a href="mailto:contact@jobsira.com" className="text-blue-600 hover:underline ml-1">
                contact@jobsira.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link 
            href="/terms" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Consulter les Conditions d'Utilisation
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} {APP_CONFIG.name}. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
