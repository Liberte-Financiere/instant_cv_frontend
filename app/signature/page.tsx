'use client';

import { PenTool } from 'lucide-react';

export default function SignaturePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PenTool className="w-8 h-8 text-blue-600" />
          </div>
          Ma Signature
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Gérez votre signature électronique pour vos documents.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PenTool className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Ajouter une signature</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Téléversez une image de votre signature ou dessinez-la directement à l&apos;écran.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
          Créer ma signature
        </button>
      </div>
    </div>
  );
}
