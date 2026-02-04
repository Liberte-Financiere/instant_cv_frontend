'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCVStore } from '@/store/useCVStore';
import { CVPreview } from '@/components/editor/CVPreview';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check, Copy, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PublicCVPage() {
  const params = useParams();
  const id = params.id as string;
  const { cvList, incrementViews } = useCVStore();
  
  const [cv, setCv] = useState(cvList.find((c) => c.id === id));
  const [copied, setCopied] = useState(false);

  // Increment views on mount if CV exists
  useEffect(() => {
    if (cv) {
      // Simulate a small delay to not count "editor" switches as views immediately in a real app
      // But here we just increment
      incrementViews(id);
    }
  }, [id, incrementViews, cv]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Lien copié dans le presse-papier');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!cv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">CV introuvable</h1>
        <p className="text-slate-500 mb-6">Ce CV n'existe pas ou a été supprimé.</p>
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/50 flex flex-col">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
             </div>
             Instant CV
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="hidden sm:flex">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copié !' : 'Partager'}
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Créer mon CV
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-[210mm] mx-auto shadow-2xl rounded-sm overflow-hidden bg-white">
          {/* We reuse the CVPreview component but force a wrapper to ensure it renders correctly */}
          <CVPreview data={cv} />
        </div>
      </main>
      
      {/* Footer Banner */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-0 inset-x-0 bg-slate-900 text-white p-4 z-40 text-center md:flex md:items-center md:justify-center md:gap-4 shadow-lg"
      >
        <span className="font-medium">Vous aimez ce CV ? Créez le vôtre gratuitement en quelques minutes.</span>
        <Link href="/dashboard">
          <Button size="sm" variant="secondary" className="mt-2 md:mt-0 font-bold">
            Commencer maintenant
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
