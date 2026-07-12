import { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import { CheckCircle2, Globe, CreditCard, Sparkles, FileText, Lock, AlertTriangle, ShieldAlert, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: `Conditions d'Utilisation | ${APP_CONFIG.name}`,
  description: `Conditions générales d'utilisation de la plateforme ${APP_CONFIG.name}`,
};

const SECTIONS = [
  { id: 'acceptation', title: '1. Acceptation des Conditions', icon: CheckCircle2, colorClass: 'text-primary bg-primary/5 border-primary/10' },
  { id: 'description', title: '2. Description du Service', icon: Globe, colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { id: 'credits-paiements', title: '3. Crédits et Paiements', icon: CreditCard, colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  { id: 'contenu-ia', title: '4. Contenu Généré par l\'IA', icon: Sparkles, colorClass: 'text-violet-600 bg-violet-50 border-violet-100' },
  { id: 'propriete', title: '5. Propriété Intellectuelle', icon: FileText, colorClass: 'text-purple-600 bg-purple-50 border-purple-100' },
  { id: 'confidentialite', title: '6. Confidentialité', icon: Lock, colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 'utilisation', title: '7. Utilisation Acceptable', icon: AlertTriangle, colorClass: 'text-amber-600 bg-amber-50 border-amber-100' },
  { id: 'limitation', title: '8. Responsabilité', icon: ShieldAlert, colorClass: 'text-red-600 bg-red-50 border-red-100' },
  { id: 'contact', title: '9. Contact', icon: Mail, colorClass: 'text-rose-600 bg-rose-50 border-rose-100' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      {/* Header Minimalist */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            {APP_CONFIG.name}
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Politique de Confidentialité
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Règles & Conditions
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-955">
            Conditions d&apos;Utilisation
          </h1>
          <p className="text-lg md:text-xl text-slate-500">
            Dernière mise à jour : 12 Juillet 2026
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-32">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Sommaire</h4>
              <nav className="flex flex-col gap-3">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a 
                      key={section.id} 
                      href={`#${section.id}`} 
                      className="group flex items-center gap-3 text-sm text-slate-500 hover:text-slate-900 transition-all py-1"
                    >
                      <span className={`p-1.5 rounded-lg border transition-colors ${section.colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span>{section.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="prose prose-slate max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:text-slate-600">
            
            <section id="acceptation" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-primary/5 border-primary/10 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">1. Acceptation des Conditions</h2>
              </div>
              <p>
                En accédant et en utilisant {APP_CONFIG.name}, vous acceptez d&apos;être lié par ces Conditions Générales d&apos;Utilisation (CGU) et nos Conditions Générales de Vente (CGV). 
                Si vous n&apos;acceptez pas ces termes, nous vous invitons à cesser toute utilisation de nos services.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="description" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-indigo-50 border-indigo-100 text-indigo-600">
                  <Globe className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">2. Description du Service et Accès</h2>
              </div>
              <p>
                {APP_CONFIG.name} est une plateforme de nouvelle génération en mode SaaS (Software as a Service), optimisée par l&apos;Intelligence Artificielle. Notre technologie permet de :
              </p>
              <ul>
                <li>Générer, formater et traduire des CV avec une mise en page de qualité professionnelle.</li>
                <li>Rédiger des lettres de motivation contextuelles et ciblées.</li>
                <li>Réaliser des évaluations de correspondance entre un profil et une offre d&apos;emploi.</li>
                <li>Mener des simulations d&apos;entretiens préparatoires assistés par l&apos;IA.</li>
              </ul>
              <p>
                L&apos;utilisation des fonctionnalités avancées nécessite la création d&apos;un compte et requiert des crédits prépayés.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="credits-paiements" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-cyan-50 border-cyan-100 text-cyan-600">
                  <CreditCard className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">3. Système de Crédits et Paiements</h2>
              </div>
              <h4 className="text-slate-800 font-semibold mt-6 mb-2">Modèle Économique</h4>
              <p>
                L&apos;écosystème {APP_CONFIG.name} repose sur une facturation à l&apos;usage via des crédits virtuels. Chaque requête traitée par nos modèles d&apos;intelligence artificielle (génération, analyse, etc.) consomme un montant défini de crédits de votre solde.
              </p>
              <h4 className="text-slate-800 font-semibold mt-6 mb-2">Règle de Non-Remboursement</h4>
              <p>
                De par la nature numérique et de mise à disposition instantanée de nos algorithmes coûteux, <strong>les achats de crédits ou de forfaits sont définitifs</strong>. Le droit de rétractation ne s&apos;applique pas aux ressources informatiques immédiatement consommables. Aucun remboursement ne pourra être exigé, excepté en cas de défaillance avérée de nos systèmes.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="contenu-ia" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-violet-50 border-violet-100 text-violet-600">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">4. Contenu Généré par l&apos;Intelligence Artificielle</h2>
              </div>
              <p>
                L&apos;innovation comporte des spécificités. Nos outils emploient des modèles de traitement du langage naturel (LLM) avancés :
              </p>
              <ul>
                <li>Les systèmes d&apos;IA peuvent occasionnellement produire des incohérences ou des formulations imparfaites (phénomène dit « d&apos;hallucination »).</li>
                <li>Il est de <strong>votre responsabilité exclusive</strong> d&apos;examiner, de valider et, au besoin, de corriger l&apos;exactitude des informations figurant sur vos CV et lettres générés.</li>
                <li>{APP_CONFIG.name} ne saurait être tenu responsable du résultat d&apos;une candidature basée sur nos documents générés.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="propriete" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-purple-50 border-purple-100 text-purple-600">
                  <FileText className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">5. Propriété Intellectuelle</h2>
              </div>
              <p>
                Le code, le design, l&apos;interface utilisateur et les algorithmes internes de {APP_CONFIG.name} demeurent notre propriété exclusive. 
                À l&apos;inverse, vous conservez la pleine propriété de vos informations professionnelles, et vous bénéficiez du droit d&apos;utiliser et de diffuser sans limite les fichiers PDF que vous avez exportés.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="confidentialite" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-emerald-50 border-emerald-100 text-emerald-600">
                  <Lock className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">6. Protection des Données</h2>
              </div>
              <p>
                La sécurité de vos parcours professionnels est primordiale. Nous traitons vos données personnelles dans le plus strict respect de la confidentialité. Pour comprendre en détail nos mécanismes d&apos;anonymisation vis-à-vis des IA tierces, nous vous invitons à lire notre <Link href="/privacy">Politique de Confidentialité</Link>.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="utilisation" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-amber-50 border-amber-100 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">7. Utilisation Acceptable</h2>
              </div>
              <p>
                La plateforme est destinée à un usage professionnel légitime. Il est formellement interdit de :
              </p>
              <ul>
                <li>Générer des documents visant à usurper l&apos;identité d&apos;autrui ou falsifier des diplômes.</li>
                <li>Fournir à nos modèles des requêtes au contenu illégal ou discriminatoire.</li>
                <li>Mener des attaques techniques, du scraping automatisé, ou abuser de l&apos;architecture de nos API.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="limitation" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-red-50 border-red-100 text-red-600">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">8. Limitation de Responsabilité</h2>
              </div>
              <p>
                {APP_CONFIG.name} est fourni en mode &quot;best effort&quot;. Nous déclinons toute responsabilité pour d&apos;éventuelles interruptions de service, pertes de données ou latences, souvent liées aux fournisseurs technologiques sous-jacents. La plateforme ne garantit pas l&apos;obtention d&apos;un emploi.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="contact" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-rose-50 border-rose-100 text-rose-600">
                  <Mail className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">9. Contact et Droit Applicable</h2>
              </div>
              <p>
                Les présentes conditions sont régies par la juridiction du siège social de JobSira. Pour tout litige ou réclamation, le dialogue prévaut.
              </p>
              <p className="mt-6 text-xl font-medium">
                <a href="mailto:contact@jobsira.com" className="text-slate-900 hover:text-primary transition-colors">contact@jobsira.com</a>
              </p>
            </section>

          </article>
        </div>
      </main>

      <footer className="border-t border-slate-100 bg-white py-12 mt-24">
        <div className="max-w-6xl mx-auto px-6 text-slate-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Politique de Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
