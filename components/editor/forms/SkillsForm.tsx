'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function SkillsForm() {
  const { currentCV, addSkill, removeSkill } = useCVStore();

  if (!currentCV) return null;
  const { skills } = currentCV;

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 group">
          <span className="font-medium text-sm">{skill.name}</span>
          <button onClick={() => removeSkill(skill.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <div className="flex items-center gap-2 w-full max-w-xs mt-2">
        <Input placeholder="Ex: React, Gestion de projet..." className="h-10 text-sm" onKeyDown={(e) => { if (e.key === 'Enter') { const target = e.target as HTMLInputElement; if (target.value.trim()) { addSkill({ name: target.value.trim(), level: 5 }); target.value = ''; } } }} />
        <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /></button>
      </div>
      <p className="w-full text-xs text-slate-400 mt-1">Appuyez sur Entrée pour ajouter</p>
    </div>
  );
}
