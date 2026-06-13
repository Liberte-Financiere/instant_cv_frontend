import Link from 'next/link';
import { HelpArticle } from '@/data/help';
import { HelpSidebar } from './HelpSidebar';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface ArticlePageProps {
  article: HelpArticle;
  relatedArticles: HelpArticle[];
}

export function ArticlePage({ article, relatedArticles }: ArticlePageProps) {
  return (
    <div className="min-h-screen bg-bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/help" className="hover:text-primary font-medium transition-colors">
            Centre d'aide
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-600 shrink-0">{article.category}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
        </nav>

        {/* Back Link */}
        <Link 
          href="/help" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au centre d'aide
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <header className="mb-8 pb-6 border-b border-slate-100">
              <span className="inline-block px-3 py-1 bg-blue-50 text-primary rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
                {article.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {article.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                {article.description}
              </p>
            </header>

            {/* Render HTML content safely */}
            <div 
              className="space-y-6 text-slate-700 text-base leading-relaxed
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:pt-4 [&_h2]:pb-1
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:pt-3 [&_h3]:pb-1
                [&_p]:leading-relaxed [&_p]:mb-4
                [&_strong]:font-bold [&_strong]:text-slate-900
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-4
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-4
                [&_li]:text-slate-700
                [&_a]:text-primary [&_a]:font-bold [&_a]:underline hover:[&_a]:text-primary-dark"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Sidebar */}
          <HelpSidebar article={article} relatedArticles={relatedArticles} />
        </div>
      </div>
    </div>
  );
}
