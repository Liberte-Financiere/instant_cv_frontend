'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function HobbiesForm() {
  const { currentCV, addHobby, removeHobby } = useCVStore();

  if (!currentCV) return null;
  const hobbies = currentCV.hobbies || [];

  return (
    <div className="flex flex-wrap gap-3">
      {hobbies.map((hobby) => (
        <div key={hobby.id} className="flex items-center gap-2 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg border border-pink-200 group">
          <span className="font-medium text-sm">{hobby.name}</span>
          <button onClick={() => removeHobby(hobby.id)} className="text-pink-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <div className="flex items-center gap-2 w-full max-w-xs mt-2">
        <Input placeholder="Ex: Lecture, Football, Voyage..." className="h-10 text-sm" onKeyDown={(e) => { if (e.key === 'Enter') { const target = e.target as HTMLInputElement; if (target.value.trim()) { addHobby({ name: target.value.trim() }); target.value = ''; } } }} />
        <button className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"><Plus className="w-5 h-5" /></button>
      </div>
      <p className="w-full text-xs text-slate-400 mt-1">Appuyez sur Entrée pour ajouter</p>
    </div>
  );
}
