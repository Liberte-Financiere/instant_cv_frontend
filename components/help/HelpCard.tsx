import Link from 'next/link';
import { HelpArticle } from '@/data/help';
import { LayoutTemplate, FileText, Brain, Mic, Building2, User, PenTool, Languages, Share2, LucideIcon } from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'CV Builder': LayoutTemplate,
  'Lettre de Motivation': FileText,
  'Analyse & Scoring IA': Brain,
  "Simulation d'Entretien": Mic,
  'Espace Recruteur': Building2,
  'Mon Compte': User,
  'Signature': PenTool,
  'Traduction de CV': Languages,
  'Partage en Ligne': Share2,
};

interface HelpCardProps {
  category: string;
  articles: HelpArticle[];
}

export function HelpCard({ category, articles }: HelpCardProps) {
  const Icon = CATEGORY_ICONS[category] || FileText;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 text-primary rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg text-slate-900">{category}</h3>
      </div>
      
      <ul className="space-y-4 flex-1">
        {articles.map((article) => (
          <li key={article.slug} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
            <Link 
              href={`/help/${article.slug}`}
              className="group flex flex-col"
            >
              <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                {article.title}
              </span>
              <span className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {article.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
