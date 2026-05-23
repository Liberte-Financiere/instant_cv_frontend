'use client';

import { useCallback } from 'react';
import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, Briefcase } from 'lucide-react';
import { MagicButton } from '../MagicButton';

export function ExperienceForm() {
  const { currentCV, addExperience, updateExperience, removeExperience } = useCVStore();

  const handleAdd = useCallback(() => {
    addExperience({ company: '', position: '', startDate: '', endDate: '', current: false, description: '' });
  }, [addExperience]);

  const handleUpdate = useCallback((id: string, field: string, value: string | boolean) => {
    updateExperience(id, { [field]: value });
  }, [updateExperience]);

  const handleRemove = useCallback((id: string) => {
    removeExperience(id);
  }, [removeExperience]);

  if (!currentCV) return null;
  const { experiences } = currentCV;

  return (
    <div className="space-y-6">
      {experiences.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Aucune expérience ajoutée.</p>
          <button onClick={handleAdd} className="text-blue-600 font-bold hover:underline mt-2 text-sm">
            Ajouter ma première expérience
          </button>
        </div>
      ) : (
        experiences.map((exp) => (
          <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
            <button onClick={() => handleRemove(exp.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-full"><Input label="Poste occupé" value={exp.position} onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)} placeholder="Ex: Chef de projet marketing" /></div>
              <Input label="Entreprise" value={exp.company} onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)} placeholder="Ex: Google" />
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  label="Début" 
                  type="date" 
                  value={exp.startDate} 
                  onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)} 
                />
                <div className="relative">
                  <Input 
                    label="Fin" 
                    type="date" 
                    value={exp.endDate} 
                    onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)} 
                    disabled={exp.current} 
                  />
                </div>
              </div>
              <div className="col-span-full flex items-center gap-2 -mt-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => {
                    const isCurrent = e.target.checked;
                    updateExperience(exp.id, { 
                      current: isCurrent,
                      endDate: isCurrent ? '' : exp.endDate 
                    });
                  }}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-500 cursor-pointer select-none">
                  Poste actuel
                </label>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <MagicButton 
                    section="Experience"
                    currentText={exp.description}
                    onApply={(newText) => handleUpdate(exp.id, 'description', newText)}
                    compact
                  />
              </div>
              <textarea 
                rows={3} 
                value={exp.description} 
                onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)} 
                placeholder="Détaillez vos missions et résultats..." 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
              />
            </div>
          </div>
        ))
      )}
      {experiences.length > 0 && (
        <button onClick={handleAdd} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter une expérience</button>
      )}
    </div>
  );
}

