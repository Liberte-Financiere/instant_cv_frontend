'use client';

import { FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-white/5 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-lg">Optijob</span>
        </div>
        <div className="flex gap-8">
          <a className="hover:text-white transition-colors" href="#">Confidentialité</a>
          <a className="hover:text-white transition-colors" href="#">Conditions</a>
          <a className="hover:text-white transition-colors" href="#">Support</a>
        </div>
        <div>
           © 2026 Optijob Inc.
        </div>
      </div>
    </footer>
  );
}
