'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim().length < 10) {
      toast.error('Votre avis doit contenir au moins 10 caractères.');
      return;
    }

    if (content.length > 1000) {
      toast.error('Votre avis est trop long (maximum 1000 caractères).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating || undefined,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission. Veuillez réessayer.');
      }

      toast.success('Merci pour votre retour !');
      setRating(0);
      setContent('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Aidez-nous à nous améliorer !
      </h3>
      <p className="text-slate-500 mb-6 text-sm">
        Votre avis est précieux. Dites-nous ce que vous pensez de JobSira.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Votre note (optionnelle)
          </label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
                aria-label={`Noter ${star} sur 5`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
            Votre commentaire <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-slate-900"
            placeholder="Qu'est-ce que vous avez apprécié ? Que devrions-nous améliorer ?"
            disabled={isSubmitting}
            required
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${content.length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
              {content.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || content.trim().length < 10}
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer mon avis'
          )}
        </button>
      </form>
    </div>
  );
}
