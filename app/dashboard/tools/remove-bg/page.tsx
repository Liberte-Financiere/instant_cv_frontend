'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Sparkles, AlertCircle, CheckCircle2, Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCreditStore } from '@/store/useCreditStore';
import { Button } from '@/components/ui/Button';

export default function RemoveBgToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { credits, fetchCredits } = useCreditStore();
  const cost = 1; // Coût en crédits pour le détourage (doit correspondre à CREDIT_COSTS.AI_REMOVE_BG)

  useEffect(() => {
    fetchCredits();
    
    // Cleanup de l'URL objet pour éviter les fuites mémoire
    return () => {
      if (resultImage) {
        URL.revokeObjectURL(resultImage);
      }
    };
  }, [fetchCredits]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Maximum 5 Mo.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    
    if (resultImage) {
      URL.revokeObjectURL(resultImage);
      setResultImage(null);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const generateRemoveBg = async () => {
    if (!file || !preview) return;

    if (credits < cost) {
      setError(`Crédits insuffisants. Il vous faut ${cost} crédit pour utiliser cet outil.`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Appel direct à l'API de détourage
      const aiRes = await fetch('/api/ai/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!aiRes.ok) {
        // Essayer de lire le JSON si présent, sinon texte brut
        let errorMsg = 'Erreur lors du détourage de l\'image.';
        try {
            const errorData = await aiRes.json();
            errorMsg = errorData.error || errorMsg;
        } catch(e) {
            const textData = await aiRes.text();
            errorMsg = textData || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // Le serveur renvoie directement le fichier binaire PNG
      const imageBlob = await aiRes.blob();
      const objectUrl = URL.createObjectURL(imageBlob);
      
      if (resultImage) {
          URL.revokeObjectURL(resultImage); // Nettoyage de l'ancienne image générée
      }
      setResultImage(objectUrl);
      
      // Rafraîchir les crédits
      await fetchCredits();

    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/tools"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la Boîte à Outils
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <ImageIcon className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Détourage Magique</h1>
            <p className="text-slate-500 mt-1">Supprimez l'arrière-plan de n'importe quelle photo instantanément.</p>
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Uploadez votre photo</h2>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !isGenerating && fileInputRef.current?.click()}
              className={`relative group border-2 border-dashed rounded-2xl transition-all duration-200 
                ${preview ? 'border-blue-200 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50'}
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileSelect}
                disabled={isGenerating}
              />

              {preview ? (
                <div className="aspect-square relative rounded-2xl overflow-hidden m-2 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  {!isGenerating && (
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Changer d'image
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 mb-1">Cliquez ou glissez-déposez</h3>
                  <p className="text-xs text-slate-500">JPG, PNG ou WebP. Max 5 Mo.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">Coût du détourage</span>
              <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {cost} crédit
              </span>
            </div>
            
            <Button
              onClick={generateRemoveBg}
              disabled={!file || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Détourage en cours...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Supprimer l'arrière-plan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            2. Résultat
            {resultImage && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </h2>

          <div className="flex-1 bg-[url('/checkered.png')] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center relative min-h-[400px]">
            {/* Si pas d'image de fond checkboard, on ajoute un motif CSS pour bien voir la transparence */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
            
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
                  </div>
                  <p className="text-slate-600 font-medium">Analyse visuelle en cours...</p>
                  <p className="text-slate-400 text-sm mt-2">Détourage pixel parfait par IA</p>
                </motion.div>
              ) : resultImage ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-10 flex items-center justify-center p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resultImage} alt="Résultat Détouré" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-6 z-10"
                >
                  <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">L'image détourée apparaîtra ici</p>
                  <p className="text-slate-400 text-sm mt-1">Le fond sera rendu 100% transparent</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {resultImage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <a 
                href={resultImage} 
                download="image-detouree.png"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                Télécharger (PNG Transparent)
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
