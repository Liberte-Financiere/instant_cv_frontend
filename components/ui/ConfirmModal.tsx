'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isLoading = false,
  variant = 'danger'
}: ConfirmModalProps) {
  const isDanger = variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden z-10"
          >
            {!isLoading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center">{title}</h2>
              <p className="text-slate-500 mt-2 text-center text-sm px-2">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-8">
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                className={`w-full text-white gap-2 shadow-lg ${isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
