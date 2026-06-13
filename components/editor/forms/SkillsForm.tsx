'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function SkillsForm() {
  const { currentCV, updateSettings, addSkill, removeSkill, updateSkill } = useCVStore();

  if (!currentCV) return null;
  const { skills } = currentCV;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <Input 
          label="Titre de la section (Optionnel)" 
          value={currentCV.settings?.sectionTitles?.skills || ''} 
          onChange={(e) => updateSettings({ 
            sectionTitles: { 
              ...currentCV.settings?.sectionTitles,
              skills: e.target.value 
            } 
          })} 
          placeholder="Ex: Compétences Techniques" 
        />
        <p className="text-xs text-slate-500 mt-1">Laissez vide pour garder le titre par défaut.</p>
      </div>
      <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
          
          {/* Nom de la compétence */}
          <div className="flex-1">
            <Input 
              value={skill.name} 
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })} 
              placeholder="Ex: React, Gestion de projet..." 
              className="h-9 border-none bg-transparent shadow-none px-1 focus:ring-0 font-medium" 
            />
          </div>
          
          {/* Section Niveau */}
          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Niveau :</span>
              <select
                value={skill.level || 5}
                onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) })}
                className="h-9 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none px-2 bg-white text-slate-700"
              >
                <option value={1}>Notions (1/5)</option>
                <option value={2}>Débutant (2/5)</option>
                <option value={3}>Intermédiaire (3/5)</option>
                <option value={4}>Avancé (4/5)</option>
                <option value={5}>Expert (5/5)</option>
              </select>
            </div>

            {/* Bouton Supprimer */}
            <button 
              onClick={() => removeSkill(skill.id)} 
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
              title="Supprimer la compétence"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={() => addSkill({ name: '', level: 5 })} 
        className="w-full py-3 text-blue-600 text-sm font-bold border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 mt-4"
      >
        <Plus className="w-4 h-4" />
        Ajouter une compétence
      </button>
      </div>
    </div>
  );
}
