'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { PenTool } from 'lucide-react';

export function DiversForm() {
  const { currentCV, updateDivers, updateFooter } = useCVStore();

  if (!currentCV) return null;
  const divers = currentCV.divers || '';
  const footer = currentCV.footer || { showFooter: false, madeAt: '', madeDate: '', signatureUrl: '' };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Informations complémentaires</label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Permis de conduire, disponibilité, mobilité géographique..."
          value={divers}
          onChange={(e) => updateDivers(e.target.value)}
        />
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <input 
            type="checkbox" 
            id="showFooter"
            checked={footer.showFooter}
            onChange={(e) => updateFooter({ showFooter: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-slate-300"
          />
          <label htmlFor="showFooter" className="text-sm font-bold text-slate-700">
            Afficher &quot;Fait le ... à ...&quot; en bas du CV
          </label>
        </div>

        {footer.showFooter && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <Input 
              label="Fait à (ville)" 
              value={footer.madeAt} 
              onChange={(e) => updateFooter({ madeAt: e.target.value })} 
              placeholder="Ex: Ouagadougou" 
            />
            <Input 
              label="Le (date)" 
              type="date"
              value={footer.madeDate} 
              onChange={(e) => updateFooter({ madeDate: e.target.value })} 
            />
            
            <div className="col-span-full mt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Signature</label>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-dashed border-slate-300">
                {footer.signatureUrl ? (
                  <img src={footer.signatureUrl} alt="Signature" className="h-16 object-contain" />
                ) : (
                  <div className="w-24 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <PenTool className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <button className="text-sm font-bold text-blue-600 hover:underline">
                    Choisir une signature
                  </button>
                  <p className="text-xs text-slate-500">Gérez vos signatures dans l&apos;onglet Signature</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
