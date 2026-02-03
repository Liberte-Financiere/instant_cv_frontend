'use client';

import { 
  User, Briefcase, GraduationCap, Wrench, Languages, 
  Plus, Trash2, Heart, FileText, PenTool, Award, 
  FolderOpen, UserCheck, Link2
} from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { Input } from '@/components/ui/Input';
import { Accordion } from '@/components/ui/Accordion';
import { PhotoUpload } from './PhotoUpload';
import { EditorStep } from '@/types/cv';

interface FormSectionProps {
  currentStep: EditorStep;
  onNext: () => void;
  onPrev: () => void;
}

type SectionKey = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'hobbies' | 'certifications' | 'projects' | 'references' | 'divers';

const stepToSection: Record<EditorStep, SectionKey> = {
  personal: 'personal',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  languages: 'languages',
  hobbies: 'hobbies',
  certifications: 'certifications',
  projects: 'projects',
  references: 'references',
  divers: 'divers',
  preview: 'personal',
};

export function FormSection({ currentStep }: FormSectionProps) {
  const { 
    currentCV, 
    updatePersonalInfo, 
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
    addHobby, removeHobby,
    addCertification, updateCertification, removeCertification,
    addProject, updateProject, removeProject,
    addReference, updateReference, removeReference,
    addSocialLink, updateSocialLink, removeSocialLink,
    updateDivers,
    updateFooter,
    setCurrentStep
  } = useCVStore();

  if (!currentCV) return null;

  const { personalInfo, experiences, education, skills, languages } = currentCV;
  const hobbies = currentCV.hobbies || [];
  const certifications = currentCV.certifications || [];
  const projects = currentCV.projects || [];
  const references = currentCV.references || [];
  const socialLinks = currentCV.socialLinks || [];
  const divers = currentCV.divers || '';
  const footer = currentCV.footer || { showFooter: false, madeAt: '', madeDate: '', signatureUrl: '' };

  const openSection = stepToSection[currentStep] || 'personal';

  const handleToggle = (key: SectionKey) => {
    setCurrentStep(key as EditorStep);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. INFORMATIONS PERSONNELLES */}
      <Accordion 
        title="Informations Personnelles" 
        icon={<User className="w-5 h-5" />}
        isOpen={openSection === 'personal'}
        onToggle={() => handleToggle('personal')}
      >
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
              <label className="block text-sm font-bold text-slate-700 mb-3">Réseaux sociaux</label>
              <div className="space-y-2">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <select 
                      value={link.platform} 
                      onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as any })}
                      className="text-sm border border-slate-200 rounded-lg px-2 py-2 bg-white"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="twitter">Twitter</option>
                      <option value="other">Autre</option>
                    </select>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Résumé Professionnel</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Décrivez brièvement votre parcours..."
                value={personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              />
           </div>
        </div>
      </Accordion>

      {/* 2. EXPÉRIENCES */}
      <Accordion 
        title="Expériences" 
        icon={<Briefcase className="w-5 h-5" />}
        isOpen={openSection === 'experience'}
        onToggle={() => handleToggle('experience')}
      >
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
      </Accordion>

      {/* 3. FORMATION */}
      <Accordion 
        title="Formation" 
        icon={<GraduationCap className="w-5 h-5" />}
        isOpen={openSection === 'education'}
        onToggle={() => handleToggle('education')}
      >
        <div className="space-y-6">
           {education.map((edu) => (
             <div key={edu.id} className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="col-span-full"><Input label="École / Université" value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} placeholder="Ex: HEC Paris" /></div>
                   <Input label="Diplôme" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} placeholder="Ex: Master 2" />
                   <Input label="Domaine d'études" value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} placeholder="Ex: Marketing Digital" />
                   <Input label="Date de début" type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} />
                   <Input label="Date de fin" type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} />
                </div>
             </div>
           ))}
           <button onClick={() => addEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter une formation</button>
        </div>
      </Accordion>

      {/* 4. COMPÉTENCES */}
      <Accordion 
        title="Compétences" 
        icon={<Wrench className="w-5 h-5" />}
        isOpen={openSection === 'skills'}
        onToggle={() => handleToggle('skills')}
      >
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
      </Accordion>

      {/* 5. CERTIFICATIONS */}
      <Accordion 
        title="Certifications" 
        icon={<Award className="w-5 h-5" />}
        isOpen={openSection === 'certifications'}
        onToggle={() => handleToggle('certifications')}
      >
        <div className="space-y-4">
           {certifications.map((cert) => (
             <div key={cert.id} className="p-4 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
                <button onClick={() => removeCertification(cert.id)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <Input label="Nom de la certification" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} placeholder="Ex: AWS Certified Developer" />
                   <Input label="Organisme" value={cert.organization} onChange={(e) => updateCertification(cert.id, { organization: e.target.value })} placeholder="Ex: Amazon Web Services" />
                   <Input label="Date d'obtention" type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
                   <Input label="Lien (optionnel)" value={cert.url || ''} onChange={(e) => updateCertification(cert.id, { url: e.target.value })} placeholder="https://..." />
                </div>
             </div>
           ))}
           <button onClick={() => addCertification({ name: '', organization: '', date: '', url: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter une certification</button>
        </div>
      </Accordion>

      {/* 6. PROJETS */}
      <Accordion 
        title="Projets" 
        icon={<FolderOpen className="w-5 h-5" />}
        isOpen={openSection === 'projects'}
        onToggle={() => handleToggle('projects')}
      >
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
                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                     <textarea rows={2} value={project.description} onChange={(e) => updateProject(project.id, { description: e.target.value })} placeholder="Décrivez le projet..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                   </div>
                </div>
             </div>
           ))}
           <button onClick={() => addProject({ name: '', description: '', url: '', technologies: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Ajouter un projet</button>
        </div>
      </Accordion>

      {/* 7. LANGUES */}
      <Accordion 
        title="Langues" 
        icon={<Languages className="w-5 h-5" />}
        isOpen={openSection === 'languages'}
        onToggle={() => handleToggle('languages')}
      >
        <div className="space-y-3">
           {languages.map((lang) => (
             <div key={lang.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white">
                <Input value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} placeholder="Langue" className="h-9 border-none bg-transparent shadow-none px-0 focus:ring-0" />
                <select value={lang.level} onChange={(e) => updateLanguage(lang.id, { level: e.target.value as any })} className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer">
                   <option value="Débutant">Débutant</option>
                   <option value="Intermédiaire">Intermédiaire</option>
                   <option value="Avancé">Avancé</option>
                   <option value="Natif">Natif</option>
                </select>
                <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-red-500 ml-auto"><Trash2 className="w-4 h-4" /></button>
             </div>
           ))}
           <button onClick={() => addLanguage({ name: '', level: 'Intermédiaire' })} className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 mt-2"><Plus className="w-4 h-4" />Ajouter une langue</button>
        </div>
      </Accordion>

      {/* 8. CENTRES D'INTÉRÊT */}
      <Accordion 
        title="Centres d'intérêt" 
        icon={<Heart className="w-5 h-5" />}
        isOpen={openSection === 'hobbies'}
        onToggle={() => handleToggle('hobbies')}
      >
        <div className="flex flex-wrap gap-3">
           {hobbies.map((hobby) => (
             <div key={hobby.id} className="flex items-center gap-2 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg border border-pink-200 group">
                <span className="font-medium text-sm">{hobby.name}</span>
                <button onClick={() => removeHobby(hobby.id)} className="text-pink-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
             </div>
           ))}
           <div className="flex items-center gap-2 w-full max-w-xs mt-2">
              <Input placeholder="Ex: Lecture, Football, Voyage..." className="h-10 text-sm" onKeyDown={(e) => { if (e.key === 'Enter') { const target = e.target as HTMLInputElement; if (target.value.trim()) { addHobby({ name: target.value.trim() }); target.value = ''; } } }} />
              <button className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"><Plus className="w-5 h-5" /></button>
           </div>
           <p className="w-full text-xs text-slate-400 mt-1">Appuyez sur Entrée pour ajouter</p>
        </div>
      </Accordion>

      {/* 9. RÉFÉRENCES */}
      <Accordion 
        title="Références" 
        icon={<UserCheck className="w-5 h-5" />}
        isOpen={openSection === 'references'}
        onToggle={() => handleToggle('references')}
      >
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
      </Accordion>

      {/* 10. DIVERS & SIGNATURE */}
      <Accordion 
        title="Divers & Signature" 
        icon={<FileText className="w-5 h-5" />}
        isOpen={openSection === 'divers'}
        onToggle={() => handleToggle('divers')}
      >
        <div className="space-y-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Informations complémentaires</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Permis de conduire, disponibilité, mobilité géographique..."
                value={divers}
                onChange={(e) => updateDivers(e.target.value)}
              />
           </div>

           <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                 <input 
                   type="checkbox" 
                   id="showFooter"
                   checked={footer.showFooter}
                   onChange={(e) => updateFooter({ showFooter: e.target.checked })}
                   className="w-4 h-4 text-blue-600 rounded border-slate-300"
                 />
                 <label htmlFor="showFooter" className="text-sm font-bold text-slate-700">
                   Afficher &quot;Fait le ... à ...&quot; en bas du CV
                 </label>
              </div>

              {footer.showFooter && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                   <Input 
                     label="Fait à (ville)" 
                     value={footer.madeAt} 
                     onChange={(e) => updateFooter({ madeAt: e.target.value })} 
                     placeholder="Ex: Ouagadougou" 
                   />
                   <Input 
                     label="Le (date)" 
                     type="date"
                     value={footer.madeDate} 
                     onChange={(e) => updateFooter({ madeDate: e.target.value })} 
                   />
                   
                   <div className="col-span-full mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Signature</label>
                      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-dashed border-slate-300">
                         {footer.signatureUrl ? (
                           <img src={footer.signatureUrl} alt="Signature" className="h-16 object-contain" />
                         ) : (
                           <div className="w-24 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                              <PenTool className="w-6 h-6" />
                           </div>
                         )}
                         <div>
                            <button className="text-sm font-bold text-blue-600 hover:underline">
                              Choisir une signature
                            </button>
                            <p className="text-xs text-slate-500">Gérez vos signatures dans l&apos;onglet Signature</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </Accordion>
    </div>
  );
}
