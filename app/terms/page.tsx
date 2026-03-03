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
          Dernière mise à jour : Février 2026
        </p>

        <div className="prose prose-slate prose-lg max-w-none">
          
          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Acceptation des Conditions
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En accédant et en utilisant {APP_CONFIG.name}, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          {/* Section 2 */}
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
              <li>Importer des données depuis LinkedIn</li>
              <li>Exporter vos documents en PDF</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Inscription et Compte
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de 
              maintenir la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Propriété Intellectuelle
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Vous conservez tous les droits sur le contenu que vous créez sur {APP_CONFIG.name}. Cependant, vous nous 
              accordez une licence limitée pour stocker et afficher ce contenu dans le cadre de la fourniture du service.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Protection des Données
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Nous nous engageons à protéger vos données personnelles conformément au RGPD. 
              Pour plus d&apos;informations, consultez notre <Link href="/privacy" className="text-blue-600 hover:underline">Politique de Confidentialité</Link>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Utilisation Acceptable
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Vous vous engagez à ne pas utiliser le service pour :
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Créer du contenu illégal, offensant ou frauduleux</li>
              <li>Usurper l&apos;identité d&apos;une autre personne</li>
              <li>Tenter de compromettre la sécurité du service</li>
              <li>Utiliser des systèmes automatisés sans autorisation</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              7. Limitation de Responsabilité
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {APP_CONFIG.name} est fourni &quot;tel quel&quot;. Nous ne garantissons pas que le service sera ininterrompu ou 
              exempt d&apos;erreurs. Nous ne sommes pas responsables des dommages indirects résultant de l&apos;utilisation du service.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              8. Modifications des Conditions
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
              prendront effet dès leur publication sur cette page. Votre utilisation continue du service 
              après modification constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              9. Contact
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
          © 2026 {APP_CONFIG.name}. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
