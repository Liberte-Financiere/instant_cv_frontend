import { prisma } from '@/lib/prisma';
import { TestimonialsClient } from './TestimonialsClient';
import { APP_CONFIG } from '@/lib/config';

// Fallback static testimonials to ensure the section is never completely empty
const fallbackTestimonials = [
  {
    id: 'static-1',
    name: 'Hassan BIKIENGA',
    role: 'Développeur Fullstack',
    quote: `Avant, je passais des heures à ajuster la mise en page de mon CV sur Word. Avec ${APP_CONFIG.name}, je choisis un template professionnel, l'IA m'aide à reformuler mes expériences, et j'exporte un PDF propre en quelques minutes. C'est un vrai gain de temps.`,
    rating: 5,
    image: null,
    gradient: 'from-blue-500 to-indigo-400',
  },
  {
    id: 'static-2',
    name: 'Traore Adama',
    role: 'Entrepreneur',
    quote: "Ce que j'apprécie le plus, c'est la lettre de motivation générée pour chaque offre. Au lieu de repartir de zéro à chaque candidature, l'IA me propose un texte adapté au poste que je peux personnaliser. C'est simple et efficace.",
    rating: 5,
    image: null,
    gradient: 'from-amber-500 to-orange-400',
  },
];

const gradients = [
  'from-blue-500 to-indigo-400',
  'from-amber-500 to-orange-400',
  'from-emerald-500 to-teal-400',
  'from-purple-500 to-pink-400',
  'from-rose-500 to-red-400'
];

import { unstable_noStore as noStore } from 'next/cache';

export async function Testimonials() {
  noStore();
  let mappedFeedbacks: any[] = [];
  try {
    // Fetch approved feedback, max 6 for the landing page
    const dbFeedbacks = await prisma.platformFeedback.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        user: {
          select: {
            name: true,
            image: true,
            jobTitle: true,
          },
        },
      },
    });

    // Map DB data to the format expected by the client component
    mappedFeedbacks = dbFeedbacks.map((f, i) => ({
      id: f.id,
      name: f.user.name || 'Anonyme',
      role: f.user.jobTitle || 'Utilisateur',
      quote: f.content,
      rating: f.rating || 5, // Default to 5 if no rating
      image: f.user.image,
      gradient: gradients[i % gradients.length],
    }));
  } catch (error) {
    console.warn('Failed to fetch testimonials from database, using fallbacks:', error);
    mappedFeedbacks = [];
  }

  // If we have DB feedbacks, use them. Otherwise, use fallbacks.
  const finalTestimonials = mappedFeedbacks.length > 0 ? mappedFeedbacks : fallbackTestimonials;

  return <TestimonialsClient testimonials={finalTestimonials} />;
}
