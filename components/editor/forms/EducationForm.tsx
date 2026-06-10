'use client';

import { useCallback } from 'react';
import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function EducationForm() {
  const { currentCV, updateSettings, addEducation, updateEducation, removeEducation } = useCVStore();

  const handleAdd = useCallback(() => {
    addEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '' });
  }, [addEducation]);

  const handleUpdate = useCallback((id: string, field: string, value: string) => {
    updateEducation(id, { [field]: value });
  }, [updateEducation]);

  const handleRemove = useCallback((id: string) => {
    removeEducation(id);
  }, [removeEducation]);

  if (!currentCV) return null;
  const { education } = currentCV;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
        <Input 
          label="Titre de la section (Optionnel)" 
          value={currentCV.settings?.sectionTitles?.education || ''} 
          onChange={(e) => updateSettings({ 
            sectionTitles: { 
              ...currentCV.settings?.sectionTitles,
              education: e.target.value 
            } 
          })} 
          placeholder="Ex: Formations" 
        />
        <p className="text-xs text-slate-500 mt-1">Laissez vide pour garder le titre par défaut.</p>
      </div>
      {education.map((edu) => (
        <div key={edu.id} className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
          <button onClick={() => handleRemove(edu.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full"><Input label="École / Université" value={edu.institution} onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)} placeholder="Ex: HEC Paris" /></div>
            <Input label="Diplôme" value={edu.degree} onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)} placeholder="Ex: Master 2" />
            <Input label="Domaine d'études" value={edu.field} onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)} placeholder="Ex: Marketing Digital" />
            <Input label="Date de début" type="date" value={edu.startDate} onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)} />
            <Input label="Date de fin" type="date" value={edu.endDate} onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={handleAdd} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter un diplôme</button>
    </div>
  );
}

