'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';
import { MagicButton } from '../MagicButton';

export function ProjectsForm() {
  const { currentCV, addProject, updateProject, removeProject } = useCVStore();

  if (!currentCV) return null;
  const projects = currentCV.projects || [];

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="p-4 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
          <button onClick={() => removeProject(project.id)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Nom du projet" value={project.name} onChange={(e) => updateProject(project.id, { name: e.target.value })} placeholder="Ex: Application mobile de livraison" />
            <Input label="Lien (optionnel)" value={project.url || ''} onChange={(e) => updateProject(project.id, { url: e.target.value })} placeholder="https://..." />
            <div className="col-span-full">
              <Input label="Technologies utilisées" value={project.technologies || ''} onChange={(e) => updateProject(project.id, { technologies: e.target.value })} placeholder="Ex: React, Node.js, MongoDB" helpText="Séparées par des virgules" />
            </div>
            <div className="col-span-full">
              <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <MagicButton 
                    section="Project"
                    currentText={project.description}
                    onApply={(newText) => updateProject(project.id, { description: newText })}
                    compact
                  />
              </div>
              <textarea 
                rows={2} 
                value={project.description} 
                onChange={(e) => updateProject(project.id, { description: e.target.value })} 
                placeholder="Décrivez le projet..." 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
              />
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => addProject({ name: '', description: '', url: '', technologies: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter un projet</button>
    </div>
  );
}
