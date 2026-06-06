import { allCompetitors } from '@/data/compare';
import { CompareSearch } from '@/components/compare/CompareSearch';
import { Sparkles, CheckCircle2, ShieldCheck, Wallet, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Jobsira vs les autres outils — Comparaison complète 2026",
  description: "Comparez Jobsira avec Canva, LinkedIn, Resume.io et les plateformes locales en Afrique pour créer un CV optimisé ATS.",
};

const differences = [
  { icon: CheckCircle2, bg: 'bg-green-50 text-green-600', title: '100% Optimisé ATS', desc: 'Nos modèles et notre IA sont conçus pour passer les filtres des robots de recrutement.' },
  { icon: Wallet, bg: 'bg-blue-50 text-blue-600', title: 'Paiement Mobile Money', desc: 'Payez en toute simplicité avec Orange Money, Wave ou Moov en Francs CFA (XOF).' },
  { icon: ShieldCheck, bg: 'bg-purple-50 text-purple-600', title: 'Accompagnement de A à Z', desc: 'Nous générons vos lettres de motivation et vous entraînent aux entretiens d\'embauche.' }
];

export default function CompareHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/help" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour au centre d'aide
        </Link>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" /> Comparatif Solutions CV
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Jobsira vs les autres outils — Comparaison complète
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre comparatif honnête face aux solutions de CV internationales et aux plateformes d'emploi traditionnelles en Afrique francophone.
          </p>
        </div>
        <div className="mb-16">
          <CompareSearch competitors={allCompetitors} />
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 text-center">Pourquoi Jobsira est-il différent ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {differences.map((diff, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl ${diff.bg} flex items-center justify-center mb-4`}>
                  <diff.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{diff.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
