import { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import { Info, Database, Sparkles, Share2, ShieldCheck, Fingerprint, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: `Politique de Confidentialité | ${APP_CONFIG.name}`,
  description: `Politique de confidentialité et protection des données personnelles de la plateforme ${APP_CONFIG.name}`,
};

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction', icon: Info, colorClass: 'text-primary bg-primary/5 border-primary/10' },
  { id: 'donnees-collectees', title: '2. Données collectées', icon: Database, colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { id: 'ia-anonymisation', title: '3. IA et Anonymisation', icon: Sparkles, colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  { id: 'partage-stockage', title: '4. Partage et Stockage', icon: Share2, colorClass: 'text-violet-600 bg-violet-50 border-violet-100' },
  { id: 'securite', title: '5. Sécurité', icon: ShieldCheck, colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 'vos-droits', title: '6. Vos Droits', icon: Fingerprint, colorClass: 'text-amber-600 bg-amber-50 border-amber-100' },
  { id: 'contact', title: '7. Contact', icon: Mail, colorClass: 'text-rose-600 bg-rose-50 border-rose-100' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
      {/* Header Minimalist */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            {APP_CONFIG.name}
          </Link>
          <Link href="/terms" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Conditions d&apos;Utilisation
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Confidentialité & Sécurité
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-950">
            Politique de Confidentialité
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
            
            <section id="introduction" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-primary/5 border-primary/10 text-primary">
                  <Info className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">1. Introduction</h2>
              </div>
              <p>
                Chez {APP_CONFIG.name}, nous construisons l&apos;avenir du recrutement en mettant la confidentialité au centre de notre architecture. Cette politique explique en toute transparence comment nous collectons, utilisons, protégeons et partageons vos informations personnelles lorsque vous utilisez notre plateforme.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="donnees-collectees" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-indigo-50 border-indigo-100 text-indigo-600">
                  <Database className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">2. Données collectées</h2>
              </div>
              <p>
                Afin de vous fournir nos services d&apos;aide à la candidature propulsés par l&apos;Intelligence Artificielle, nous traitons un ensemble précis de données :
              </p>
              <ul>
                <li><strong>Données de compte :</strong> Nom, adresse e-mail, identifiants. <em>(Utilisées strictement pour vous identifier et sécuriser votre accès, elles ne sont jamais transmises à l&apos;IA)</em>.</li>
                <li><strong>Données professionnelles :</strong> Expériences, parcours académique, compétences, localisation, loisirs (ces données constituent le cœur de vos documents).</li>
                <li><strong>Données techniques :</strong> Adresse IP, type d&apos;appareil, métriques d&apos;utilisation essentielles.</li>
                <li><strong>Données de paiement :</strong> Gérées intégralement et exclusivement par nos prestataires certifiés (dont les solutions Mobile Money). Aucune information de carte bancaire ou de code secret n&apos;est conservée sur nos serveurs.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="ia-anonymisation" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-cyan-50 border-cyan-100 text-cyan-600">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">3. IA et Anonymisation</h2>
              </div>
              <p>
                L&apos;innovation de {APP_CONFIG.name} repose sur l&apos;exploitation de l&apos;IA (LLM). 
                Cependant, la puissance technologique ne doit jamais compromettre votre vie privée. 
                Lorsque vous utilisez nos outils (traduction, reformulation, génération de lettres, entretiens), vos données sont envoyées de manière sécurisée et éphémère à nos fournisseurs d&apos;Intelligence Artificielle.
              </p>
              <h4 className="text-slate-800 font-semibold mt-6 mb-2">Processus d&apos;Anonymisation Strict</h4>
              <p>
                Nous appliquons un principe de minimisation des données (Data Minimization). <strong>Votre nom, votre e-mail et votre numéro de téléphone ne sont jamais transmis à l&apos;Intelligence Artificielle.</strong> Le contenu génératif est isolé de votre contexte personnel identifiant. 
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="partage-stockage" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-violet-50 border-violet-100 text-violet-600">
                  <Share2 className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">4. Partage et Stockage des Données</h2>
              </div>
              <p>
                <strong>La vente de données ne fait pas partie de notre modèle économique.</strong> Nous ne vendons, ne louons, ni ne commercialisons vos CV.
              </p>
              <p>
                Vos informations sont hébergées sur des infrastructures cloud sécurisées de premier plan. Nous ne partageons des informations qu&apos;avec :
              </p>
              <ul>
                <li>Nos fournisseurs de services IA (textes stricts anonymisés uniquement, pour une durée de traitement éphémère).</li>
                <li>Nos partenaires d&apos;infrastructure technique (hébergement, bases de données).</li>
                <li>Les autorités compétentes, exclusivement si une procédure légale contraignante nous y oblige.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="securite" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-emerald-50 border-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">5. Sécurité</h2>
              </div>
              <p>
                Nous implémentons des standards de sécurité rigoureux pour protéger vos données contre les accès non autorisés, l&apos;altération ou la destruction. Cela inclut le chiffrement des données en transit (TLS/HTTPS), le stockage chiffré au repos, et des contrôles d&apos;accès stricts à nos systèmes.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="vos-droits" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-amber-50 border-amber-100 text-amber-600">
                  <Fingerprint className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">6. Vos Droits</h2>
              </div>
              <p>
                Vous restez maître de vos données à tout moment. Vous disposez des droits suivants concernant vos informations personnelles :
              </p>
              <ul>
                <li><strong>Accès et Portabilité :</strong> Exportez vos CV au format PDF à la demande.</li>
                <li><strong>Rectification :</strong> Mettez à jour vos informations directement depuis votre tableau de bord.</li>
                <li><strong>Droit à l&apos;effacement :</strong> Vous pouvez requérir la suppression complète et irréversible de votre compte et de toutes vos données.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="contact" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-rose-50 border-rose-100 text-rose-600">
                  <Mail className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-955">7. Contact</h2>
              </div>
              <p>
                La confiance se construit par le dialogue. Pour toute question relative à cette politique de confidentialité ou à vos données personnelles, notre équipe est à votre disposition.
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
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Conditions d&apos;Utilisation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
