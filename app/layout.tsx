import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Providers } from '@/components/Providers';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { APP_CONFIG } from '@/lib/config';



const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jobsira.com'),
  title: `${APP_CONFIG.name} | Le Coach CV par l\`IA`,
  description: "Créez un CV pro compatible ATS et une lettre de motivation en 2 minutes. Rejoignez 150+ candidats qui ont décroché leur job de rêve.",
  keywords: ["JobSira", "CV", "créateur CV", "resume builder", "IA", "ATS", "emploi", "lettre de motivation", "coach carrière", "CV en ligne"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${APP_CONFIG.name} - Décrochez votre job de rêve`,
    description: "L\`IA qui optimise votre CV pour les recruteurs. Essai gratuit, sans carte bancaire.",
    type: "website",
    locale: "fr_FR",
    siteName: `${APP_CONFIG.name}`,
    url: 'https://jobsira.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${APP_CONFIG.name} - Le Coach CV par l'IA`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.name} - Votre Coach Carrière IA`,
    description: "Créez un CV parfait en quelques clics.",
    images: ['/og-image.png'],
  },
  other: {
    'theme-color': '#0f172a',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
  },
  verification: {
    google: 'Zom0o3y5NATbqECHnN9eT9TXGaR-QWSAYwOrtrcHVPQ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="Zom0o3y5NATbqECHnN9eT9TXGaR-QWSAYwOrtrcHVPQ" />
      </head>
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
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": APP_CONFIG.name,
                "url": "https://jobsira.com",
                "logo": "https://jobsira.com/icons/icon-512x512.png",
                "sameAs": [],
                "description": "JobSira est une plateforme de coaching carrière par IA pour la creation de CV et lettres de motivation."
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": APP_CONFIG.name,
                "url": "https://jobsira.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://jobsira.com/templates?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": APP_CONFIG.name,
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "XOF"
                },
                "description": "Creez un CV pro compatible ATS en 2 minutes avec l'IA.",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "150"
                }
              }
            ])
          }}
        />
        <Toaster position="bottom-center" />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

