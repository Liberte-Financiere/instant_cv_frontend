'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export function SkillsForm() {
  const { currentCV, updateSettings, addSkill, removeSkill, updateSkill } = useCVStore();
  const [lastUsedCategory, setLastUsedCategory] = useState<string>('');

  if (!currentCV) return null;
  const { skills } = currentCV;

  const handleAddSkill = () => {
    addSkill({ name: '', level: 5, category: lastUsedCategory });
  };

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
        <div key={skill.id} className="flex flex-col gap-3 p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
          
          {/* Nom de la compétence et Catégorie sur la même ligne si possible */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <Input 
                value={skill.name} 
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })} 
                placeholder="Ex: React, Gestion de projet..." 
                className="h-9 border-none bg-transparent shadow-none px-1 focus:ring-0 font-medium" 
              />
            </div>
            
            <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-3">
              <select
                value={skill.category || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateSkill(skill.id, { category: val });
                  setLastUsedCategory(val);
                }}
                className="w-full h-9 border border-slate-200 rounded-lg bg-transparent text-sm focus:ring-2 focus:ring-blue-500 text-slate-600 px-2 outline-none"
                title="Catégorie de la compétence"
              >
                <option value="">Aucune catégorie</option>
                <option value="Compétences Techniques">Compétences Techniques</option>
                <option value="Compétences Numériques">Compétences Numériques</option>
              </select>
            </div>
          </div>
          
          {/* Section Niveau et Actions */}
          <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
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
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
              title="Supprimer la compétence"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={handleAddSkill} 
        className="w-full py-3 text-blue-600 text-sm font-bold border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 mt-4"
      >
        <Plus className="w-4 h-4" />
        Ajouter une compétence
      </button>
      </div>
    </div>
  );
}
