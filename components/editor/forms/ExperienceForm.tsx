'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, Briefcase } from 'lucide-react';

export function ExperienceForm() {
  const { currentCV, addExperience, updateExperience, removeExperience } = useCVStore();

  if (!currentCV) return null;
  const { experiences } = currentCV;

  return (
    <div className="space-y-6">
      {experiences.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucune expérience ajoutée.</p>
          <button onClick={() => addExperience({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' })} className="text-blue-600 font-bold hover:underline mt-2 text-sm">
            Ajouter ma première expérience
          </button>
        </div>
      ) : (
        experiences.map((exp) => (
          <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
            <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-full"><Input label="Poste occupé" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} placeholder="Ex: Chef de projet marketing" /></div>
              <Input label="Entreprise" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} placeholder="Ex: Google" />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Début" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                <Input label="Fin" type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} disabled={exp.current} />
              </div>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label><textarea rows={3} value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} placeholder="Détaillez vos missions et résultats..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" /></div>
          </div>
        ))
      )}
      {experiences.length > 0 && (
        <button onClick={() => addExperience({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter une expérience</button>
      )}
    </div>
  );
}
