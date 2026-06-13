import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Centre d'aide Jobsira — CV, lettres de motivation, recrutement Afrique francophone",
  description: "Trouvez des guides pas à pas et conseils pratiques pour optimiser vos CV, passer les filtres ATS, générer vos lettres de motivation et réussir vos entretiens d'embauche sur Jobsira en Afrique francophone (Burkina Faso, Côte d'Ivoire, Sénégal, etc.).",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
