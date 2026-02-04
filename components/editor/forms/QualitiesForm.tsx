'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, Sparkles } from 'lucide-react';

export function QualitiesForm() {
  const { currentCV, addQuality, updateQuality, removeQuality } = useCVStore();

  if (!currentCV) return null;
  const qualities = currentCV.qualities || [];

  return (
    <div className="space-y-6">
      {qualities.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucune qualité ajoutée.</p>
          <button onClick={() => addQuality({ name: '' })} className="text-blue-600 font-bold hover:underline mt-2 text-sm">
            Ajouter ma première qualité
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qualities.map((quality) => (
            <div key={quality.id} className="flex gap-2">
              <Input 
                value={quality.name} 
                onChange={(e) => updateQuality(quality.id, { name: e.target.value })} 
                placeholder="Ex: Rigoureux, Esprit d'équipe..." 
                className="flex-1"
              />
              <button 
                onClick={() => removeQuality(quality.id)} 
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {qualities.length > 0 && (
        <button onClick={() => addQuality({ name: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter une qualité
        </button>
      )}
    </div>
  );
}
