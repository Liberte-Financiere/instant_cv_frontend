'use client';

import { motion } from 'framer-motion';
import { PlayCircle, Star, WifiOff, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { CVStackMockup } from './CVStackMockup';
import { AvatarGroup } from '@/components/ui/AvatarGroup';

export function Hero() {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-bg-dark">
      {/* Glowing mesh gradient effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start w-full lg:w-auto mx-auto lg:mx-0">
               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold shadow-sm">
                 ✅ Création et export PDF 100% gratuits
               </span>
            </div>            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Votre succès mérite plus qu&apos;un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">simple PDF</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Bien plus qu&apos;un simple éditeur. Notre IA <span className="text-blue-200 font-medium">analyse votre profil</span>, adapte votre CV à <span className="text-blue-200 font-medium">chaque offre d&apos;emploi</span>, rédige votre <span className="text-blue-200 font-medium">lettre de motivation</span> et vous entraîne avec des <span className="text-blue-200 font-medium">simulations d&apos;entretien</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/auth"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-primary hover:bg-primary-dark shadow-[0_0_20px_rgba(36,99,235,0.3)] text-white text-base font-bold transition-all hover:scale-105"
              >
                Commencer gratuitement
              </Link>
              <Link href="#features" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-bold transition-all">
                <PlayCircle className="w-5 h-5 mr-2" /> Démo
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start mt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold shadow-sm">
                🎁 <span className="text-white">15 crédits IA offerts</span> à l'inscription
              </span>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <AvatarGroup count={2} />
              <p className="text-sm text-slate-400">Rejoint par <span className="text-white font-bold">150+</span> personnes</p>
            </div>

            {/* PWA Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full" title="L'IA nécessite internet, mais vous pouvez consulter vos CVs existants, vos lettres de motivation et vos historiques d'analyse sans connexion.">
                <WifiOff className="w-3 h-3" /> CV accessibles hors-ligne
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                <Smartphone className="w-3 h-3" /> Installable sur mobile
              </span>
            </div>
          </div>

          {/* Right Mockup - Stacked CV Models */}
          <CVStackMockup />

        </div>
      </div>
    </div>
  );
}
