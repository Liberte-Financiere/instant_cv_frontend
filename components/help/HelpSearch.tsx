'use client';

import { useState } from 'react';
import { HelpArticle } from '@/data/help';
import { HelpCard } from '@/components/help/HelpCard';
import { HelpSearchResults } from './HelpSearchResults';
import { Search } from 'lucide-react';

interface HelpSearchProps {
  articles: HelpArticle[];
}

export function HelpSearch({ articles }: HelpSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group all articles by category
  const categories = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, HelpArticle[]>);

  // Filter articles for search results
  const filteredArticles = searchQuery.trim()
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      {/* Search Bar */}
      <div className="mt-8 max-w-xl mx-auto relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher un article, un guide (ex: CV, ATS, entretien...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {searchQuery.trim() !== '' ? (
        <HelpSearchResults
          searchQuery={searchQuery}
          filteredArticles={filteredArticles}
          onClear={() => setSearchQuery('')}
        />
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {Object.entries(categories).map(([category, categoryArticles]) => (
            <div key={category}>
              <HelpCard category={category} articles={categoryArticles} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
