'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { CVPreview } from '@/components/editor/CVPreview';
import { Button } from '@/components/ui/Button';
import {Check, Copy, Share2, Wand2} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/config';

const A4_WIDTH_PX = 794;

export function SharePageClient({ cv }: { cv: any }) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Responsive scaling
  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // minus padding
      const newScale = Math.min(containerWidth / A4_WIDTH_PX, 1);
      setScale(newScale);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Lien copié dans le presse-papier');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100/50 flex flex-col">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight text-slate-900">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                <Wand2 className="w-5 h-5" />
             </div>
             <span className="hidden sm:inline">{APP_CONFIG.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="hidden sm:flex">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copié !' : 'Partager'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="sm:hidden">
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
                Créer mon CV
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={containerRef} className="flex-1 p-4 md:p-8 flex flex-col items-center overflow-y-auto overflow-x-hidden pb-32 sm:pb-8">
        <div 
          className="bg-white shadow-2xl rounded-sm shrink-0 transition-transform duration-200"
          style={{
            width: `${A4_WIDTH_PX}px`,
            minHeight: '1123px', // Standard A4
            ...(isMounted ? {
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              marginBottom: scale < 1 ? `calc((${scale} - 1) * 1123px)` : undefined,
            } : {})
          }}
        >
          <CVPreview data={cv} hideToolbar />
        </div>
      </main>
      
      {/* Footer Banner */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-0 inset-x-0 bg-slate-900 text-white p-3 sm:p-4 z-40 text-center md:flex md:items-center md:justify-center md:gap-4 shadow-lg"
      >
        <span className="font-medium text-sm sm:text-base">Vous aimez ce CV ? Créez le vôtre gratuitement.</span>
        <Link href="/dashboard">
          <Button size="sm" variant="secondary" className="mt-2 md:mt-0 font-bold">
            Commencer maintenant
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
