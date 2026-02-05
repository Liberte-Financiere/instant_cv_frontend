'use client';

import { motion } from 'framer-motion';
import { PlayCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { CVStackMockup } from './CVStackMockup';
import { AvatarGroup } from '@/components/ui/AvatarGroup';

export function Hero() {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#0F172A]">
      {/* Glowing mesh gradient effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#2463eb]/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">


            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Votre succès mérite plus qu'un <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#2463eb]">simple PDF</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Bien plus qu'un simple éditeur. Notre IA <span className="text-blue-200 font-medium">analyse votre profil</span>, adapte votre CV à <span className="text-blue-200 font-medium">chaque offre d'emploi</span> et rédige votre <span className="text-blue-200 font-medium">lettre de motivation</span> en un clic.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/dashboard"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-[#2463eb] hover:bg-[#1d4ed8] shadow-[0_0_20px_rgba(36,99,235,0.3)] text-white text-base font-bold transition-all hover:scale-105"
              >
                Commencer gratuitement
              </Link>
              <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-bold transition-all">
                <PlayCircle className="w-5 h-5 mr-2" /> Démo
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <AvatarGroup count={3} />
              <p className="text-sm text-slate-400">Rejoint par <span className="text-white font-bold">500+</span> personnes</p>
            </div>
          </div>

          {/* Right Mockup - Stacked CV Models */}
          <CVStackMockup />

        </div>
      </div>
    </div>
  );
}
