'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CVPreview } from './CVPreview';

interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobilePreviewModal({ isOpen, onClose }: MobilePreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-100 w-full h-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
          >
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
              <h3 className="font-bold text-slate-900">Aperçu du CV</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                title="Fermer"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-slate-200 flex justify-center">
              <div className="w-full max-w-[210mm] bg-white shadow-lg min-h-[297mm]">
                 <CVPreview />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
