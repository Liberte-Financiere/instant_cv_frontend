import { allArticles } from '@/data/help';
import { HelpSearch } from '@/components/help/HelpSearch';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HelpHubPage() {
  return (
    <div className="min-h-screen bg-bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" /> Support & Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Retrouvez tous les guides, conseils et astuces pour tirer le meilleur parti de Jobsira et propulser votre carrière.
          </p>
        </div>

        {/* Client-side search and category grid container */}
        <HelpSearch articles={allArticles} />
      </div>
    </div>
  );
}
