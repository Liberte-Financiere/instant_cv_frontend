import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Providers } from '@/components/Providers';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { SpeedInsights } from '@vercel/speed-insights/next';


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Optijob | Le Coach CV par l'IA",
  description: "Créez un CV pro compatible ATS et une lettre de motivation en 2 minutes. Rejoignez 10,000+ candidats qui ont décroché leur job de rêve.",
  keywords: ["CV", "créateur CV", "resume builder", "IA", "ATS", "emploi", "lettre de motivation"],
  openGraph: {
    title: "Optijob - Décrochez votre job de rêve",
    description: "L'IA qui optimise votre CV pour les recruteurs. Essai gratuit, sans carte bancaire.",
    type: "website",
    locale: "fr_FR",
    siteName: "OptiJob",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optijob - Votre Coach Carrière IA",
    description: "Créez un CV parfait en quelques clics.",
  },
  other: {
    'theme-color': '#0f172a',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${manrope.variable} font-sans antialiased bg-bg-dark text-slate-900 dark:text-white`}
        suppressHydrationWarning
      >
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Aller au contenu principal
          </a>
          <main id="main-content">
            {children}
          </main>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "OptiJob",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "description": "Créez un CV pro compatible ATS en 2 minutes avec l'IA."
            })
          }}
        />
        <Toaster position="bottom-center" />
        <ServiceWorkerRegister />
        <SpeedInsights />
      </body>
    </html>
  );
}

