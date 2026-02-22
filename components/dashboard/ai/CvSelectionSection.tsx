'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CV } from '@/types/cv';

type CVSourceMode = 'select' | 'upload';

interface CvSelectionSectionProps {
  cvSourceMode: CVSourceMode;
  setCvSourceMode: (mode: CVSourceMode) => void;
  selectedCVId: string;
  setSelectedCVId: (id: string) => void;
  cvList: CV[];
  cvFile: File | null;
  onFileSelected: (file: File) => void;
  acceptedFileTypes?: string; // e.g. ".pdf,.txt"
  maxSizeMb?: number;
  label?: string;
  stepNumber?: number;
}

export function CvSelectionSection({
  cvSourceMode,
  setCvSourceMode,
  selectedCVId,
  setSelectedCVId,
  cvList,
  cvFile,
  onFileSelected,
  acceptedFileTypes = ".pdf",
  maxSizeMb = 5,
  label = "CV Source",
  stepNumber = 1
}: CvSelectionSectionProps) {
  const cvFileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          {stepNumber > 0 && (
            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
              {stepNumber}
            </span>
          )}
          {label}
        </label>
        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setCvSourceMode('select')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              cvSourceMode === 'select' 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Mes CVs
          </button>
          <button
            onClick={() => setCvSourceMode('upload')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              cvSourceMode === 'upload' 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Importer PDF
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {cvSourceMode === 'select' ? (
          <motion.div key="cv-select" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="relative">
              <select
                value={selectedCVId}
                onChange={(e) => setSelectedCVId(e.target.value)}
                className="w-full pl-4 pr-10 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer text-sm"
              >
                <option value="">– Sélectionner –</option>
                {cvList.map(cv => (
                  <option key={cv.id} value={cv.id}>
                    {cv.title} — {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="cv-upload" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div
              onClick={() => cvFileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                cvFile
                  ? "border-emerald-300 bg-emerald-50/50"
                  : dragOver 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
              )}
            >
              {cvFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-800">{cvFile.name}</p>
                    <p className="text-xs text-slate-400">{(cvFile.size / 1024).toFixed(0)} Ko • Cliquer pour changer</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <p className="text-sm text-slate-500">
                    Glissez votre fichier ici ou <span className="font-semibold text-blue-600">parcourir</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {acceptedFileTypes.replace('.', '').toUpperCase()} • Max {maxSizeMb} Mo
                  </p>
                </div>
              )}
            </div>
            <input 
              ref={cvFileRef} 
              type="file" 
              accept={acceptedFileTypes} 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
