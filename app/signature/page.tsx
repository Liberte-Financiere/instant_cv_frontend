'use client';

import { useState, useEffect } from 'react';
import { PenTool, Trash2 } from 'lucide-react';
import { SignaturePad } from '@/components/signature/SignaturePad';
import { toast } from 'sonner';
import Image from 'next/image';

export default function SignaturePage() {
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('user_signature');
    if (saved) {
      setSignature(saved);
    }
  }, []);

  const handleSave = (dataUrl: string) => {
    setSignature(dataUrl);
    localStorage.setItem('user_signature', dataUrl);
    toast.success('Signature enregistrée avec succès !');
  };

  const handleDelete = () => {
    if (confirm('Voulez-vous supprimer votre signature ?')) {
      setSignature(null);
      localStorage.removeItem('user_signature');
      toast.info('Signature supprimée.');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PenTool className="w-8 h-8 text-blue-600" />
          </div>
          Ma Signature
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Cette signature sera automatiquement ajoutée à vos CVs lorsque vous activerez l&apos;option.
        </p>
      </div>

      {signature ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex flex-col items-center">
           <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-6">Signature Actuelle</h3>
           <div className="p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50 mb-6">
             <Image 
               src={signature} 
               alt="Signature" 
               width={300} 
               height={100} 
               className="max-h-32 object-contain" 
             />
           </div>
           
           <button 
             onClick={handleDelete}
             className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
           >
             <Trash2 className="w-4 h-4" />
             Supprimer et recommencer
           </button>
        </div>
      ) : (
        <SignaturePad onSave={handleSave} />
      )}
      
      {/* Tips */}
      <div className="mt-8 bg-blue-50/50 rounded-xl p-6 border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-2">Pourquoi ajouter une signature ?</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Authentifie vos documents et leur donne un aspect plus professionnel.</li>
          <li>Sera utilisée automatiquement lors de l&apos;exportation PDF.</li>
          <li>Stockée en locale sur votre appareil pour votre sécurité.</li>
        </ul>
      </div>
    </div>
  );
}
