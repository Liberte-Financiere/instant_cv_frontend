import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optijob | AI Resume Builder",
  description: "Créez des CV professionnels qui décrochent des entretiens. Simple, rapide et optimisé pour le succès.",
  keywords: ["CV", "créateur CV", "resume builder", "CV professionnel", "Optijob"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${manrope.variable} font-sans antialiased bg-[#0F172A] text-slate-900 dark:text-white`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
