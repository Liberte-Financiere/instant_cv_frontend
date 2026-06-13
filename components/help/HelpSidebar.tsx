import Link from 'next/link';
import { HelpArticle } from '@/data/help';
import { BookOpen } from 'lucide-react';

interface HelpSidebarProps {
  article: HelpArticle;
  relatedArticles: HelpArticle[];
}

export function HelpSidebar({ article, relatedArticles }: HelpSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Dans la même catégorie
        </h3>
        <ul className="space-y-4">
          {relatedArticles.map((rel) => (
            <li key={rel.slug}>
              <Link 
                href={`/help/${rel.slug}`}
                className={`block text-sm font-semibold transition-colors ${
                  rel.slug === article.slug 
                    ? 'text-primary font-bold' 
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {rel.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA/Assistance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg shadow-black/20">
        <h4 className="font-bold text-lg mb-2">Besoin d'aide supplémentaire ?</h4>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          Notre équipe est à votre disposition pour vous accompagner dans la rédaction de votre CV.
        </p>
        <Link href="/dashboard/feedback" className="inline-block w-full">
          <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer">
            Nous contacter
          </button>
        </Link>
      </div>
    </aside>
  );
}
