import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allArticles } from '@/data/help';
import { ArticlePage } from '@/components/help/ArticlePage';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Article non trouvé | Jobsira Help',
      description: 'Cet article n\'existe pas ou a été déplacé.',
    };
  }

  return {
    title: `${article.title} | Jobsira Help`,
    description: article.description,
  };
}

export default async function HelpArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Filter related articles in the same category
  const relatedArticles = allArticles.filter((a) => a.category === article.category);

  return <ArticlePage article={article} relatedArticles={relatedArticles} />;
}
