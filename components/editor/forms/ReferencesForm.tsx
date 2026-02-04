'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function ReferencesForm() {
  const { currentCV, addReference, updateReference, removeReference } = useCVStore();

  if (!currentCV) return null;
  const references = currentCV.references || [];

  return (
    <div className="space-y-4">
      {references.map((ref) => (
        <div key={ref.id} className="p-4 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
          <button onClick={() => removeReference(ref.id)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Nom complet" value={ref.name} onChange={(e) => updateReference(ref.id, { name: e.target.value })} placeholder="Ex: Marie Martin" />
            <Input label="Poste" value={ref.position} onChange={(e) => updateReference(ref.id, { position: e.target.value })} placeholder="Ex: Directrice Marketing" />
            <Input label="Entreprise" value={ref.company} onChange={(e) => updateReference(ref.id, { company: e.target.value })} placeholder="Ex: Google France" />
            <Input label="Email (optionnel)" value={ref.email || ''} onChange={(e) => updateReference(ref.id, { email: e.target.value })} placeholder="marie@email.com" />
            <Input label="Téléphone (optionnel)" value={ref.phone || ''} onChange={(e) => updateReference(ref.id, { phone: e.target.value })} placeholder="+33 6 00 00 00 00" />
          </div>
        </div>
      ))}
      <button onClick={() => addReference({ name: '', position: '', company: '', email: '', phone: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter une référence</button>
    </div>
  );
}
