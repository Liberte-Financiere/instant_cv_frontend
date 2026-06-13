import Link from 'next/link';
import { HelpArticle } from '@/data/help';
import { FileText, ArrowRight } from 'lucide-react';

interface HelpSearchResultsProps {
  searchQuery: string;
  filteredArticles: HelpArticle[];
  onClear: () => void;
}

export function HelpSearchResults({ searchQuery, filteredArticles, onClear }: HelpSearchResultsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-12 animate-in fade-in slide-in-from-top-2 duration-200">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        Résultats pour &ldquo;{searchQuery}&rdquo;
        <span className="text-sm font-normal text-slate-500">
          ({filteredArticles.length} {filteredArticles.length > 1 ? 'articles trouvés' : 'article trouvé'})
        </span>
      </h2>

      {filteredArticles.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {filteredArticles.map((article) => (
            <div key={article.slug} className="py-4 first:pt-0 last:pb-0">
              <Link
                href={`/help/${article.slug}`}
                className="group flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-extrabold text-primary bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors shrink-0 mt-2" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucun article ne correspond à votre recherche.</p>
          <button
            onClick={onClear}
            className="text-primary font-bold text-sm mt-2 hover:underline cursor-pointer"
          >
            Effacer la recherche
          </button>
        </div>
      )}
    </div>
  );
}
