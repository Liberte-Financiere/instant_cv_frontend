'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function CVStackMockup() {
  return (
    <div className="relative h-[500px] w-full flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2463eb]/20 to-purple-600/20 blur-3xl opacity-30 transform -rotate-12 rounded-full pointer-events-none" />

      {/* CV Model 3 (Bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -10, scale: 0.9 }}
        animate={{ opacity: 0.6, y: 0, rotate: -6, scale: 0.95 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-10 left-10 md:left-20 w-[300px] md:w-[380px] h-[450px] bg-slate-800 rounded-2xl shadow-2xl border border-white/5 p-6 transform origin-bottom-left"
      >
        <div className="h-6 w-1/2 bg-white/10 rounded mb-4" />
        <div className="space-y-3 opacity-50">
          <div className="h-2 w-full bg-white/10 rounded" />
          <div className="h-2 w-full bg-white/10 rounded" />
          <div className="h-2 w-2/3 bg-white/10 rounded" />
        </div>
      </motion.div>

      {/* CV Model 2 (Middle) */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: 10, scale: 0.9 }}
        animate={{ opacity: 0.8, y: 0, rotate: 6, scale: 0.98 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute top-6 right-10 md:right-20 w-[300px] md:w-[380px] h-[450px] bg-slate-700 rounded-2xl shadow-2xl border border-white/10 p-6 transform origin-bottom-right"
      >
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/20 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
        <div className="space-y-3 opacity-60">
          <div className="h-2 w-full bg-white/10 rounded" />
          <div className="h-2 w-full bg-white/10 rounded" />
          <div className="h-2 w-4/5 bg-white/10 rounded" />
        </div>
      </motion.div>

      {/* CV Model 1 (Top / Main) */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative w-[320px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 p-8 z-10"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg" />
            <div>
              <div className="h-5 w-32 bg-slate-800 rounded mb-2" />
              <div className="h-3 w-24 bg-slate-400 rounded" />
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
            98% Match
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="space-y-2">
             <div className="h-3 w-20 bg-blue-100 rounded" />
             <div className="h-2 w-full bg-slate-100 rounded" />
             <div className="h-2 w-full bg-slate-100 rounded" />
             <div className="h-2 w-3/4 bg-slate-100 rounded" />
          </div>
          
          {/* Section 2 */}
          <div className="space-y-2">
             <div className="h-3 w-20 bg-blue-100 rounded" />
             <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-slate-50 rounded-md border border-slate-100" />
                <div className="h-6 w-14 bg-slate-50 rounded-md border border-slate-100" />
                <div className="h-6 w-20 bg-slate-50 rounded-md border border-slate-100" />
             </div>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <Star className="w-4 h-4" />
             </div>
             <div className="flex-1">
                <div className="h-2 w-3/4 bg-blue-200 rounded mb-1" />
                <div className="h-2 w-1/2 bg-blue-200 rounded" />
             </div>
          </div>
        </div>

         {/* Floating Actions */}
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 1 }}
           className="absolute -right-6 bottom-12 bg-[#2463eb] text-white p-4 rounded-2xl shadow-xl border border-white/10"
         >
            <Star className="w-6 h-6 fill-white" />
         </motion.div>
      </motion.div>
    </div>
  );
}
