'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, CheckCircle2, Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCreditStore } from '@/store/useCreditStore';
import { Button } from '@/components/ui/Button';

export default function PhotoProToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { credits, fetchCredits } = useCreditStore();
  const cost = 20; // Coût en crédits pour une génération (doit correspondre à CREDIT_COSTS.AI_PHOTO)

  useEffect(() => {
    fetchCredits();
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
    setResultImage(null);

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
      
      // Simuler l'événement onchange
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const generatePhoto = async () => {
    if (!file || !preview) return;

    if (credits < cost) {
      setError(`Crédits insuffisants. Il vous faut ${cost} crédits pour utiliser cet outil.`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Upload de l'image source sur Cloudinary
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image.');
      }

      const { url: sourceUrl } = await uploadRes.json();
      setIsUploading(false);

      // 2. Appel à l'API IA (Mock pour l'instant avec déduction des crédits)
      const aiRes = await fetch('/api/ai/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl }),
      });

      if (!aiRes.ok) {
        const errorData = await aiRes.json();
        throw new Error(errorData.error || 'Erreur lors de la génération IA.');
      }

      const { resultUrl } = await aiRes.json();
      setResultImage(resultUrl);
      
      // Rafraîchir les crédits
      await fetchCredits();

    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsGenerating(false);
      setIsUploading(false);
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
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
            <Camera className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Photo Pro IA</h1>
            <p className="text-slate-500 mt-1">Transformez un simple selfie en portrait professionnel de qualité studio.</p>
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
                ${preview ? 'border-purple-200 bg-purple-50/30' : 'border-slate-300 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50'}
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
                <div className="aspect-square relative rounded-2xl overflow-hidden m-2">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
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
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 mb-1">Cliquez ou glissez-déposez</h3>
                  <p className="text-xs text-slate-500">JPG, PNG ou WebP. Max 5 Mo.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">Coût de la génération</span>
              <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {cost} crédits
              </span>
            </div>
            
            <Button
              onClick={generatePhoto}
              disabled={!file || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Upload de l'image...
                </>
              ) : isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Génération Gemini IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Générer ma photo pro
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            2. Résultat Studio
            {resultImage && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </h2>

          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-500 animate-pulse" />
                  </div>
                  <p className="text-slate-600 font-medium">Traitement Gemini 3 Pro en cours...</p>
                  <p className="text-slate-400 text-sm mt-2">Détourage et amélioration studio</p>
                </motion.div>
              ) : resultImage ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0"
                >
                  <Image src={resultImage} alt="Résultat Pro" fill className="object-cover" />
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-6"
                >
                  <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Votre portrait apparaîtra ici</p>
                  <p className="text-slate-400 text-sm mt-1">L'IA améliorera l'éclairage et l'arrière-plan</p>
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
                download="photo-pro-jobsira.jpg"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                Télécharger la photo
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
