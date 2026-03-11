'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, X, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LinkedInImportModal({ isOpen, onClose }: LinkedInImportModalProps) {
  const router = useRouter();
  const { createImportedCV } = useCVStore();
  
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!linkedInUrl.trim()) {
      setError('Veuillez entrer une URL LinkedIn');
      return;
    }

    // Basic URL validation
    if (!linkedInUrl.includes('linkedin.com/in/') && !linkedInUrl.match(/^[a-zA-Z0-9\-]+$/)) {
      setError('URL invalide. Format attendu: https://linkedin.com/in/username ou juste le username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/import/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedInUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'import');
      }

      if (!data.success || !data.data) {
        throw new Error('Données invalides reçues');
      }

      // Create CV from imported data
      const cvTitle = `CV ${data.data.personalInfo?.firstName || ''} ${data.data.personalInfo?.lastName || ''} - LinkedIn Import`.trim();
      
      createImportedCV({
        title: cvTitle,
        templateId: 'modern',
        personalInfo: data.data.personalInfo || {},
        experiences: data.data.experiences || [],
        education: data.data.education || [],
        skills: data.data.skills || [],
        languages: data.data.languages || [],
        certifications: data.data.certifications || [],
        projects: data.data.projects || [],
        socialLinks: data.data.socialLinks || [],
      });

      toast.success('Profil LinkedIn importé avec succès !');
      onClose();
      
      // Redirect to editor with the new CV
      // The createImportedCV returns the CV object, but we can use the cvList to get the latest
      const { cvList } = useCVStore.getState();
      const newCvId = cvList[cvList.length - 1]?.id;
      if (newCvId) {
        router.push(`/editor/${newCvId}`);
      }

    } catch (err: any) {
      console.error('[LinkedIn Import] Error:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setLinkedInUrl('');
      setError(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-linkedin to-linkedin-dark p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Linkedin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Importer depuis LinkedIn</h2>
                    <p className="text-white/80 text-sm">Collez votre URL de profil</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Comment ça marche ?
                </h3>
                <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
                  <li>Copiez l&apos;URL de votre profil LinkedIn</li>
                  <li>Collez-la dans le champ ci-dessous</li>
                  <li>Cliquez sur &quot;Importer&quot; et voilà !</li>
                </ol>
              </div>

              {/* Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL du profil LinkedIn
                </label>
                <input
                  type="text"
                  value={linkedInUrl}
                  onChange={(e) => {
                    setLinkedInUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://linkedin.com/in/votre-profil ou votre-profil"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-linkedin focus:border-linkedin outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Privacy Note */}
              <p className="text-xs text-slate-500 mb-6 flex items-start gap-1.5">
                <span className="shrink-0">🔒</span>
                Seules les informations publiques de votre profil seront importées. Vos données restent confidentielles.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleImport}
                  disabled={isLoading || !linkedInUrl.trim()}
                  className="flex-1 py-3 font-bold text-white bg-linkedin rounded-xl hover:bg-linkedin-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Linkedin className="w-5 h-5" />
                      Importer
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
