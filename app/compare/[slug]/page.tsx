import { notFound } from 'next/navigation';
import Link from 'next/link';
import { allCompetitors } from '@/data/compare';
import { CompareTable } from '@/components/compare/CompareTable';
import { ArrowLeft, CheckCircle, PlusCircle, UserCircle, Star } from 'lucide-react';

export function generateStaticParams() {
  return allCompetitors.map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/compare" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour aux comparatifs
        </Link>
        <article className="space-y-8">
          <header className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded-lg">{comp.category}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">Jobsira vs {comp.name} : lequel choisir pour votre carrière en Afrique ?</h1>
            <p className="mt-2 text-slate-500 italic text-sm">&ldquo;{comp.tagline}&rdquo;</p>
            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-sm text-slate-700 leading-relaxed"><strong className="text-primary font-bold">Notre verdict : </strong>{comp.verdict}</div>
          </header>
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><UserCircle className="w-5 h-5 text-slate-500" /> Pour qui est-ce fait ?</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{comp.targetAudience}</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Tableau comparatif des fonctionnalités</h2>
            <CompareTable features={comp.features} competitorName={comp.name} />
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-slate-400" /> Ce que {comp.name} fait bien</h2>
              <ul className="space-y-2">{comp.competitorAdvantages.map((adv, idx) => (<li key={idx} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-slate-400 mt-1">•</span>{adv}</li>))}</ul>
            </section>
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Ce que Jobsira fait mieux</h2>
              <ul className="space-y-2">{comp.jobsiraAdvantages.map((adv, idx) => (<li key={idx} className="text-sm text-slate-700 flex items-start gap-2"><span className="text-green-500 mt-1">✓</span>{adv}</li>))}</ul>
            </section>
          </div>
          <footer className="text-center py-8">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base uppercase tracking-wider">{comp.cta}</Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
