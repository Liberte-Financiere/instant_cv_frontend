'use client';

import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { PhotoUpload } from '../PhotoUpload';
import { Trash2, Plus } from 'lucide-react';
import { MagicButton } from '../MagicButton';


export function PersonalInfoForm() {
  const { 
    currentCV, 
    updatePersonalInfo, 
    addSocialLink, 
    updateSocialLink, 
    removeSocialLink 
  } = useCVStore();

  if (!currentCV) return null;

  const { personalInfo, socialLinks = [] } = currentCV;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-full flex justify-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <PhotoUpload 
          currentUrl={personalInfo.photoUrl}
          onPhotoChange={(url) => updatePersonalInfo({ photoUrl: url })}
          onRemove={() => updatePersonalInfo({ photoUrl: undefined })}
        />
      </div>

      <Input label="Prénom" value={personalInfo.firstName} onChange={(e) => updatePersonalInfo({ firstName: e.target.value })} placeholder="Ex: Jean" />
      <Input label="Nom" value={personalInfo.lastName} onChange={(e) => updatePersonalInfo({ lastName: e.target.value })} placeholder="Ex: Dupont" />
      <div className="col-span-full">
        <Input label="Titre du poste" value={personalInfo.title} onChange={(e) => updatePersonalInfo({ title: e.target.value })} placeholder="Ex: Développeur Fullstack Senior" helpText="Le poste que vous visez ou votre titre actuel." />
      </div>
      <Input label="Email" type="email" value={personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} placeholder="jean.dupont@email.com" />
      <Input label="Téléphone" type="tel" value={personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} placeholder="+33 6 12 34 56 78" />
      <div className="col-span-full">
        <Input label="Adresse" value={personalInfo.address} onChange={(e) => updatePersonalInfo({ address: e.target.value })} placeholder="Ex: Paris, France" />
      </div>

      {/* Social Links */}
      <div className="col-span-full mt-4 pt-4 border-t border-slate-100">
        <Label className="mb-3">Réseaux sociaux</Label>
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <Select 
                value={link.platform} 
                onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as any })}
                className="w-32"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="portfolio">Portfolio</option>
                <option value="twitter">Twitter</option>
                <option value="other">Autre</option>
              </Select>
              <Input 
                placeholder="https://..." 
                value={link.url} 
                onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                className="flex-1"
              />
              <button onClick={() => removeSocialLink(link.id)} className="text-slate-400 hover:text-red-500 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => addSocialLink({ platform: 'linkedin', url: '' })}
            className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 mt-2"
          >
            <Plus className="w-4 h-4" />Ajouter un lien
          </button>
        </div>
      </div>
      
      {/* Summary */}
      <div className="col-span-full mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center mb-2">
            <Label>Résumé Professionnel</Label>
            <MagicButton 
              section="Summary"
              currentText={personalInfo.summary}
              onApply={(newText) => updatePersonalInfo({ summary: newText })}
              compact
            />
        </div>
        <Textarea
          rows={4}
          placeholder="Décrivez brièvement votre parcours..."
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
        />
      </div>
    </div>
  );
}
