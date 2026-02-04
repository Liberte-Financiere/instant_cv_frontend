'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus } from 'lucide-react';

export function CertificationsForm() {
  const { currentCV, addCertification, updateCertification, removeCertification } = useCVStore();

  if (!currentCV) return null;
  const certifications = currentCV.certifications || [];

  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <div key={cert.id} className="p-4 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
          <button onClick={() => removeCertification(cert.id)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Intitulé de la formation" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} placeholder="Ex: Bootcamp Fullstack, Certification AWS..." />
            <Input label="Organisme" value={cert.organization} onChange={(e) => updateCertification(cert.id, { organization: e.target.value })} placeholder="Ex: OpenClassrooms, Amazon..." />
            <Input label="Date" type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
            <Input label="Lien / Identifiant (optionnel)" value={cert.url || ''} onChange={(e) => updateCertification(cert.id, { url: e.target.value })} placeholder="https://..." />
          </div>
        </div>
      ))}
      <button onClick={() => addCertification({ name: '', organization: '', date: '', url: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter une formation</button>
    </div>
  );
}
