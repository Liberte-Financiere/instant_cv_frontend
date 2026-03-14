import { prisma } from '@/lib/prisma';
import { Star } from 'lucide-react';
import Image from 'next/image';

export default async function TestimonialsWidget({ limit = 3 }: { limit?: number }) {
  // Fetch only approved feedback, ordered by newest
  const feedbacks = await prisma.platformFeedback.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
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

  if (!feedbacks || feedbacks.length === 0) {
    return null; // Don't render anything if no testimonials are available to show
  }

  return (
    <div className="py-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Ce que disent nos utilisateurs
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Découvrez comment JobSira a aidé d'autres professionnels à booster leur carrière.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between"
            >
              <div>
                {/* Stars if rating exists */}
                {feedback.rating ? (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < feedback.rating!
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                ) : null}

                <blockquote className="text-slate-700 italic mb-6">
                  "{feedback.content}"
                </blockquote>
              </div>

              {/* User Profile Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  {feedback.user.image ? (
                    <Image
                      src={feedback.user.image}
                      alt={feedback.user.name || 'Utilisateur'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                      {(feedback.user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {feedback.user.name || 'Utilisateur Anonyme'}
                  </h4>
                  {feedback.user.jobTitle && (
                    <p className="text-sm text-slate-500">{feedback.user.jobTitle}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
