import { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: `Conditions d'Utilisation | ${APP_CONFIG.name}`,
  description: `Conditions générales d'utilisation de la plateforme ${APP_CONFIG.name}`,
};

export default function TermsPage() {
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
          Conditions Générales d&apos;Utilisation
        </h1>

        <p className="text-slate-500 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-slate prose-lg max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Acceptation des Conditions
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En accédant et en utilisant {APP_CONFIG.name}, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Description du Service
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              {APP_CONFIG.name} est une plateforme en ligne permettant de :
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Créer et personnaliser des CV professionnels</li>
              <li>Générer des lettres de motivation</li>
              <li>Analyser et optimiser vos documents avec l&apos;intelligence artificielle</li>
              <li>Permettre la mise en relation avec des recruteurs (Espace Recruteur)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Paiements et Crédits
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Certaines fonctionnalités avancées (génération IA, déblocage de profils par les recruteurs) nécessitent des crédits. 
              Les achats de crédits sont traités via nos prestataires de paiement sécurisés (ex: LigdiCash). 
              Une fois achetés, les crédits ne sont ni remboursables, ni transférables, sauf en cas de défaillance technique avérée de notre plateforme.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Utilisation de l&apos;Intelligence Artificielle
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Les fonctionnalités d&apos;assistance IA utilisent des modèles tiers (LLMs). Bien que nous mettions tout en œuvre pour 
              garantir des résultats pertinents, le contenu généré par l&apos;IA est fourni à titre indicatif. L&apos;utilisateur final 
              est seul responsable de la vérification, de l&apos;édition et de l&apos;utilisation du contenu (lettres de motivation, résumé de CV) produit.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Espace Recruteur et Anonymat
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En tant que candidat, si vous choisissez de rendre votre CV "Public" et "Recherchable", votre profil sera 
              indexé dans notre base de données recruteur. <strong>Votre identité (nom, contact) restera strictement anonyme</strong> 
              lors des recherches. Elle ne sera dévoilée qu&apos;à un recruteur validé ayant dépensé des crédits pour débloquer votre profil complet.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Protection des Données
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Nous nous engageons à protéger vos données personnelles. 
              Pour plus d&apos;informations, consultez notre <Link href="/privacy" className="text-blue-600 hover:underline">Politique de Confidentialité</Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              7. Limitation de Responsabilité
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {APP_CONFIG.name} est fourni &quot;tel quel&quot;. Nous ne garantissons pas que le service sera ininterrompu ou 
              exempt d&apos;erreurs. Nous ne sommes pas responsables des dommages indirects résultant de l&apos;utilisation du service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              8. Contact
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Pour toute question concernant ces conditions, contactez-nous à : 
              <a href="mailto:contact@jobsira.com" className="text-blue-600 hover:underline ml-1">
                contact@jobsira.com
              </a>
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Retour à l&apos;accueil
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
