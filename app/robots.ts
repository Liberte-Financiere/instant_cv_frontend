import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://optijob.com'; // À remplacer par le vrai domaine

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/editor/', '/dashboard/'], // On ne veut pas indexer les pages privées
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
