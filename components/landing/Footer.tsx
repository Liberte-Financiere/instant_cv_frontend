'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-lg">{APP_CONFIG.name}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link className="hover:text-white transition-colors" href="/compare">Comparer CV</Link>
          <Link className="hover:text-white transition-colors" href="/help">Astuces & Infos</Link>
          <Link className="hover:text-white transition-colors" href="/terms">Confidentialité</Link>
          <Link className="hover:text-white transition-colors" href="/terms">Conditions</Link>
          <a className="hover:text-white transition-colors" href="mailto:contact@jobsira.com">Contact</a>
        </div>
        <div>
           © 2026 {APP_CONFIG.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
