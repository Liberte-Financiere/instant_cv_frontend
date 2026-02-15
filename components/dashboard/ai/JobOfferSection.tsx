'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

type JobSourceMode = 'text' | 'pdf';

interface JobOfferSectionProps {
  jobSourceMode: JobSourceMode;
  setJobSourceMode: (mode: JobSourceMode) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  jobFile: File | null;
  onJobFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function JobOfferSection({
  jobSourceMode,
  setJobSourceMode,
  jobDescription,
  setJobDescription,
  jobFile,
  onJobFileChange
}: JobOfferSectionProps) {
  const jobFileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-indigo-600">2</span>
          Offre d&apos;emploi
        </label>
        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setJobSourceMode('text')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              jobSourceMode === 'text' 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Texte
          </button>
          <button
            onClick={() => setJobSourceMode('pdf')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              jobSourceMode === 'pdf' 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            PDF
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {jobSourceMode === 'text' ? (
          <motion.div key="job-text" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Collez la description ici..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none bg-slate-50/50 hover:bg-white transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div key="job-pdf" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div
              onClick={() => jobFileRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                jobFile
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30"
              )}
            >
              {jobFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-800">{jobFile.name}</p>
                    <p className="text-xs text-slate-400">{(jobFile.size / 1024).toFixed(0)} Ko • Cliquer pour changer</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <p className="text-sm text-slate-500">
                    Cliquer pour importer un <span className="font-semibold text-indigo-600">PDF</span>
                  </p>
                  <p className="text-xs text-slate-400">Max 5 Mo</p>
                </div>
              )}
            </div>
            <input ref={jobFileRef} type="file" accept=".pdf" className="hidden" onChange={onJobFileChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
