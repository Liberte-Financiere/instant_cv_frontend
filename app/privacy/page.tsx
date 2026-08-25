import { Metadata } from 'next';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import {Info, Database, Share2, ShieldCheck, Fingerprint, Mail, Wand2} from 'lucide-react';

export const metadata: Metadata = {
  title: `Politique de Confidentialité | ${APP_CONFIG.name}`,
  description: `Politique de confidentialité et protection des données personnelles de la plateforme ${APP_CONFIG.name}`,
};

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction', icon: Info, colorClass: 'text-primary bg-primary/5 border-primary/10' },
  { id: 'donnees-collectees', title: '2. Données collectées', icon: Database, colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { id: 'ia-anonymisation', title: '3. IA et Anonymisation', icon: Wand2, colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
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
            Dernière mise à jour : 25 Août 2026
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
                <h2 className="!my-0 text-slate-950">1. Introduction & Bases Légales</h2>
              </div>
              <p>
                Chez {APP_CONFIG.name}, nous construisons une plateforme de recrutement et de valorisation professionnelle moderne en plaçant la protection de votre vie privée et la conformité au Règlement Général sur la Protection des Données (RGPD / GDPR) au cœur de nos priorités.
              </p>
              <p>
                Nous traitons vos données personnelles uniquement sur les bases légales reconnues :
              </p>
              <ul>
                <li><strong>Exécution du contrat (Art. 6.1.b RGPD) :</strong> Fourniture des outils de création de CV, rédaction de lettres de motivation, optimisation IA et gestion des comptes.</li>
                <li><strong>Consentement explicite (Art. 6.1.a RGPD) :</strong> Publication éventuelle de profil candidat dans la CVthèque recruteurs ou traitement de photos de profil.</li>
                <li><strong>Intérêt légitime & Sécurité (Art. 6.1.f RGPD) :</strong> Prévention des fraudes, sécurisation des serveurs et limitation des abus de requêtes (rate limiting).</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="donnees-collectees" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-indigo-50 border-indigo-100 text-indigo-600">
                  <Database className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-950">2. Données collectées</h2>
              </div>
              <p>
                Dans le cadre de l&apos;utilisation de {APP_CONFIG.name}, nous collectons exclusivement les données strictement nécessaires au fonctionnement des services :
              </p>
              <ul>
                <li><strong>Données d&apos;authentification :</strong> Nom, prénom, adresse e-mail et photo de profil transmis via Google OAuth.</li>
                <li><strong>Données de candidature & CV :</strong> Formations, expériences professionnelles, compétences, langues, loisirs et coordonnées saisies dans l&apos;éditeur.</li>
                <li><strong>Photos & Médias :</strong> Photos de profil téléversées pour intégration sur les CVs (traitement de détourage local et stockage cloud sécurisé).</li>
                <li><strong>Portails B2B Écoles & Recruteurs :</strong> Dans le cadre des partenariats écoles, adresses e-mails d&apos;invitation et état de complétion des documents des étudiants. Côté recruteurs, profils de candidats anonymisés présentés uniquement après consentement.</li>
                <li><strong>Données de transaction :</strong> Historique et soldes de crédits. Les paiements par Mobile Money sont traités directement par notre passerelle certifiée (LigdiCash) ; aucune coordonnée bancaire sensible ou code PIN ne transite sur nos serveurs.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="ia-anonymisation" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-cyan-50 border-cyan-100 text-cyan-600">
                  <Wand2 className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-950">3. IA et Anonymisation</h2>
              </div>
              <p>
                L&apos;IA de {APP_CONFIG.name} intervient pour la reformulation, la traduction, l&apos;analyse de CV et l&apos;assistance à la rédaction.
              </p>
              <h4 className="text-slate-800 font-semibold mt-6 mb-2">Principe de Minimisation & Anonymisation Préalable</h4>
              <p>
                Avant tout traitement impliquant l&apos;utilisation de nos modèles d&apos;IA, vos informations directement identifiantes (nom, prénom, e-mail, numéro de téléphone) sont systématiquement expurgées ou anonymisées. Les modèles d&apos;IA ne traitent que le contexte textuel brut strictement nécessaire à l&apos;analyse et vos données ne sont jamais utilisées pour l&apos;entraînement de modèles.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="partage-stockage" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-violet-50 border-violet-100 text-violet-600">
                  <Share2 className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-950">4. Sous-traitants & Stockage des Données</h2>
              </div>
              <p>
                <strong>Nous ne commercialisons et ne vendons jamais vos données personnelles à des tiers publicitaires.</strong>
              </p>
              <p>
                Pour opérer la plateforme, nous faisons appel à des prestataires techniques rigoureusement sélectionnés :
              </p>
              <ul>
                <li><strong>Hébergement & Base de données :</strong> Serveurs sécurisés avec base de données chiffrée.</li>
                <li><strong>Traitement IA :</strong> Modules d&apos;intelligence artificielle sécurisés (traitement éphémère de texte anonymisé, sans conservation).</li>
                <li><strong>Hébergement média :</strong> Stockage cloud sécurisé pour les photos de profil.</li>
                <li><strong>Passerelle de paiement :</strong> Solutions certifiées de paiement électronique et Mobile Money.</li>
                <li><strong>Emails transactionnels :</strong> Service d&apos;expédition d&apos;e-mails sécurisé (invitations et notifications).</li>
                <li><strong>Surveillance applicative :</strong> Diagnostic et monitoring technique d&apos;erreurs sans données personnelles.</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="securite" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-emerald-50 border-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-950">5. Sécurité & Durée de Conservation</h2>
              </div>
              <p>
                Nous appliquons des mesures de sécurité conformes à l&apos;état de l&apos;art : chiffrement des communications en transit (HTTPS / TLS 1.3), hachage des données sensibles, isolation des microservices et contrôle d&apos;accès par jeton de session.
              </p>
              <h4 className="text-slate-800 font-semibold mt-6 mb-2">Durée de conservation</h4>
              <p>
                Vos CVs, lettres et données de profil sont conservés tant que votre compte reste actif. En cas d&apos;inactivité prolongée ou sur simple demande de votre part, l&apos;ensemble de vos données associées est intégralement purgé de nos bases de données.
              </p>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="vos-droits" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-amber-50 border-amber-100 text-amber-600">
                  <Fingerprint className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-950">6. Vos Droits (RGPD / GDPR)</h2>
              </div>
              <p>
                Conformément à la réglementation sur la protection des données personnelles, vous bénéficiez des droits suivants :
              </p>
              <ul>
                <li><strong>Droit d&apos;accès (Art. 15 RGPD) :</strong> Obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
                <li><strong>Droit de rectification (Art. 16 RGPD) :</strong> Corriger directement vos informations inexactes ou incomplètes depuis votre éditeur de CV.</li>
                <li><strong>Droit à l&apos;effacement (Art. 17 RGPD) :</strong> Demander la suppression totale et définitive de votre compte et de vos documents.</li>
                <li><strong>Droit à la limitation du traitement (Art. 18 RGPD) :</strong> Geler temporairement l&apos;utilisation de certaines données.</li>
                <li><strong>Droit à la portabilité (Art. 20 RGPD) :</strong> Télécharger vos documents au format PDF ou exporter vos données.</li>
                <li><strong>Droit d&apos;opposition (Art. 21 RGPD) :</strong> Vous opposer à tout moment au traitement de vos données (ex : désactivation du profil recruteur).</li>
              </ul>
            </section>

            <hr className="my-12 border-slate-100" />

            <section id="contact" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl border bg-rose-50 border-rose-100 text-rose-600">
                  <Mail className="w-5 h-5" />
                </span>
                <h2 className="!my-0 text-slate-950">7. Délégué à la Protection des Données & Contact</h2>
              </div>
              <p>
                Pour exercer l&apos;un de vos droits ou pour toute question relative à la gestion de vos données personnelles, vous pouvez contacter notre équipe directement à l&apos;adresse suivante :
              </p>
              <p className="mt-6 text-xl font-medium">
                <a href={`mailto:${APP_CONFIG.email}`} className="text-slate-900 hover:text-primary transition-colors">{APP_CONFIG.email}</a>
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
