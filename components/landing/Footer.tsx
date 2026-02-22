'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-white/5 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-lg">JobSira</span>
        </div>
        <div className="flex gap-8">
          <Link className="hover:text-white transition-colors" href="/terms">Confidentialité</Link>
          <Link className="hover:text-white transition-colors" href="/terms">Conditions</Link>
          <a className="hover:text-white transition-colors" href="mailto:support@jobsira.com">Support</a>
        </div>
        <div>
           © 2026 JobSira. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
