import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allCompetitors } from '@/data/compare';
import { CompareTable } from '@/components/compare/CompareTable';
import {ArrowLeft, CheckCircle, PlusCircle, UserCircle, Star, Send, Wand2} from 'lucide-react';

export function generateStaticParams() {
  return allCompetitors.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const competitor = allCompetitors.find((c) => c.slug === slug);
  if (!competitor) return {};
  return {
    title: `Jobsira vs ${competitor.name} — Comparaison 2026`,
    description: competitor.description,
  };
}

export default async function CompetitorComparePage({ params }: Props) {
  const { slug } = await params;
  const comp = allCompetitors.find((c) => c.slug === slug);
  if (!comp) notFound();

  return (
    <div className="relative min-h-screen bg-bg-light overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Mesh Glows */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[40%] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <Link href="/compare" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour aux comparatifs
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <article className="lg:col-span-2 space-y-8">
            <header className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-lg">{comp.category}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 leading-tight">Jobsira vs {comp.name} : lequel choisir pour votre carrière en Afrique ?</h1>
              <p className="mt-2 text-slate-500 italic text-sm">&ldquo;{comp.tagline}&rdquo;</p>
              <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-sm text-slate-700 leading-relaxed"><strong className="text-primary font-bold">Notre verdict : </strong>{comp.verdict}</div>
            </header>
            <section className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><UserCircle className="w-5 h-5 text-slate-400" /> Pour qui est-ce fait ?</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{comp.targetAudience}</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Tableau comparatif des fonctionnalités</h2>
              <CompareTable features={comp.features} competitorName={comp.name} />
            </section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-slate-400" /> Ce que {comp.name} fait bien</h2>
                <ul className="space-y-2">{comp.competitorAdvantages.map((adv, i) => (<li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-slate-400 mt-1">•</span>{adv}</li>))}</ul>
              </section>
              <section className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Ce que Jobsira fait mieux</h2>
                <ul className="space-y-2">{comp.jobsiraAdvantages.map((adv, i) => (<li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-green-500 mt-1">✓</span>{adv}</li>))}</ul>
              </section>
            </div>
          </article>
          <aside className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-4"><Wand2 className="w-4 h-4" /> Pourquoi choisir Jobsira ?</div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-3">Prêt à propulser votre carrière ?</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">Bénéficiez de la puissance de l'intelligence artificielle couplée à des outils adaptés à la réalité du marché de l'emploi en Afrique francophone.</p>
                <ul className="space-y-3 mb-8">
                  {['CV certifié ATS-friendly', 'Lettre de motivation sur mesure', 'Simulateur vocal d\'entretiens', 'Paiement local sans carte Visa'].map((text, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {text}</li>
                  ))}
                </ul>
              </div>
              <Link href="/" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all"><Send className="w-4 h-4" /> {comp.cta}</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
