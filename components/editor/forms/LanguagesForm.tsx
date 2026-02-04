'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function LanguagesForm() {
  const { currentCV, addLanguage, updateLanguage, removeLanguage } = useCVStore();

  if (!currentCV) return null;
  const { languages } = currentCV;

  return (
    <div className="space-y-3">
      {languages.map((lang) => (
        <div key={lang.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white">
          <Input value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} placeholder="Langue" className="h-9 border-none bg-transparent shadow-none px-0 focus:ring-0" />
          <select value={lang.level} onChange={(e) => updateLanguage(lang.id, { level: e.target.value as any })} className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer">
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
            <option value="Natif">Natif</option>
          </select>
          <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-red-500 ml-auto"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button onClick={() => addLanguage({ name: '', level: 'Intermédiaire' })} className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 mt-2"><Plus className="w-4 h-4" />Ajouter une langue</button>
    </div>
  );
}
