import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://jobsira.com'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/editor/', '/dashboard/'], // On ne veut pas indexer les pages privées
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
