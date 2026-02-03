'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Save } from 'lucide-react';
import Link from 'next/link';
import { useCVStore } from '@/store/useCVStore';
import { Stepper } from '@/components/editor/Stepper';
import { FormSection } from '@/components/editor/FormSection';
import { CVPreview } from '@/components/editor/CVPreview';
import { EDITOR_STEPS, type EditorStep } from '@/types/cv';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { currentCV, currentStep, loadCV, setCurrentStep } = useCVStore();

  const id = params.id as string;

  useEffect(() => {
    if (id && id !== 'new') {
      loadCV(id);
    }
  }, [id, loadCV]);

  const handleNext = () => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex < EDITOR_STEPS.length - 1) {
      setCurrentStep(EDITOR_STEPS[currentIndex + 1].key);
    }
  };

  const handlePrev = () => {
    const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(EDITOR_STEPS[currentIndex - 1].key);
    }
  };

  if (!currentCV) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-100 sticky top-16 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900">{currentCV.title}</h1>
                <p className="text-xs text-gray-500">Édition en cours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Sauvegarder</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Split Screen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Form */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:w-3/5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            <Stepper
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
            <FormSection
              currentStep={currentStep}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-2/5 lg:sticky lg:top-[120px] self-start"
          >
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="text-center mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase">Aperçu</span>
              </div>
              <CVPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
