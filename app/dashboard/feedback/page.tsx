import FeedbackForm from '@/components/feedback/FeedbackForm';

export const metadata = {
  title: 'Laisser un avis | JobSira',
};

export default function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Votre avis compte
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Aidez-nous à rendre JobSira encore meilleur en partageant votre expérience.
        </p>
      </div>

      <FeedbackForm />
    </div>
  );
}
