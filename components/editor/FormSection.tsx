'use client';

import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import type { EditorStep } from '@/types/cv';
import { EDITOR_STEPS } from '@/types/cv';
import { Input } from '@/components/ui/Input';

interface FormSectionProps {
  currentStep: EditorStep;
  onNext: () => void;
  onPrev: () => void;
}

export function FormSection({ currentStep, onNext, onPrev }: FormSectionProps) {
  const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === EDITOR_STEPS.length - 1;

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {currentStep === 'personal' && <PersonalInfoForm />}
      {currentStep === 'experience' && <ExperienceForm />}
      {currentStep === 'education' && <EducationForm />}
      {currentStep === 'skills' && <SkillsForm />}
      {currentStep === 'languages' && <LanguagesForm />}
      {currentStep === 'preview' && <PreviewSection />}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
        {!isFirst ? (
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Précédent
          </button>
        ) : (
          <div /> // Spacer
        )}
        
        {!isLast ? (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 bg-[#2463eb] hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            Suivant
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
           <button
            onClick={() => {}} // Handle Final Save/Export
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105"
          >
            <Save className="w-5 h-5" />
            Terminer
          </button>
        )}
      </div>
    </motion.div>
  );
}

function PersonalInfoForm() {
  const { currentCV, updatePersonalInfo } = useCVStore();
  const info = currentCV?.personalInfo;

  if (!info) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="pb-4 border-b border-slate-100">
         <h2 className="text-2xl font-bold text-slate-900">Informations Personnelles</h2>
         <p className="text-slate-500 text-sm mt-1">Ces détails apparaîtront en tête de votre CV.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Prénom"
          value={info.firstName}
          onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
          placeholder="Jean"
        />
        <Input
          label="Nom"
          value={info.lastName}
          onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
          placeholder="Dupont"
        />
      </div>

      <Input
        label="Titre professionnel"
        value={info.title}
        onChange={(e) => updatePersonalInfo({ title: e.target.value })}
        placeholder="Développeur Full Stack"
        helpText="Le poste que vous visez ou votre titre actuel."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email"
          type="email"
          value={info.email}
          onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          placeholder="jean@exemple.com"
        />
        <Input
          label="Téléphone"
          type="tel"
          value={info.phone}
          onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <Input
        label="Adresse"
        value={info.address}
        onChange={(e) => updatePersonalInfo({ address: e.target.value })}
        placeholder="Paris, France"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Résumé Professionnel</label>
        <textarea
          value={info.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 text-sm leading-relaxed"
          placeholder="Décrivez votre parcours, vos objectifs et ce qui vous rend unique en quelques phrases..."
        />
      </div>
    </div>
  );
}

function ExperienceForm() {
  const { currentCV, addExperience, updateExperience, removeExperience } = useCVStore();
  const experiences = currentCV?.experiences || [];

  const handleAdd = () => {
    addExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Expériences</h2>
            <p className="text-slate-500 text-sm mt-1">Vos postes, stages et missions précédents.</p>
         </div>
         <button
           onClick={handleAdd}
           className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-semibold transition-colors text-sm"
         >
           <Plus className="w-4 h-4" />
           Ajouter
         </button>
      </div>

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-medium">Aucune expérience ajoutée pour le moment.</p>
             <button onClick={handleAdd} className="text-blue-600 font-bold hover:underline mt-2">Ajouter ma première expérience</button>
          </div>
        ) : (
          experiences.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white border border-slate-200 rounded-2xl space-y-6 relative group shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Supprimer"
      {/* 1. INFORMATIONS PERSONNELLES */}
      <Accordion 
        title="Informations Personnelles" 
        icon={<User className="w-5 h-5" />}
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Photo Upload Placeholder */}
           <div className="col-span-full flex items-center gap-4 mb-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                 <User className="w-8 h-8" />
              </div>
              <div>
                 <button className="text-sm font-bold text-blue-600 hover:underline">Ajouter une photo</button>
                 <p className="text-xs text-slate-500">Formats acceptés: JPG, PNG. Max 2MB.</p>
              </div>
           </div>

           <Input
             label="Prénom"
             value={personalInfo.firstName}
             onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
             placeholder="Ex: Jean"
           />
           <Input
             label="Nom"
             value={personalInfo.lastName}
             onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
             placeholder="Ex: Dupont"
           />
           <div className="col-span-full">
             <Input
               label="Titre du poste"
               value={personalInfo.title}
               onChange={(e) => updatePersonalInfo({ title: e.target.value })}
               placeholder="Ex: Développeur Fullstack Senior"
               helpText="Le poste que vous visez ou votre titre actuel."
             />
           </div>
           <Input
             label="Email"
             type="email"
             value={personalInfo.email}
             onChange={(e) => updatePersonalInfo({ email: e.target.value })}
             placeholder="jean.dupont@email.com"
           />
           <Input
             label="Téléphone"
             type="tel"
             value={personalInfo.phone}
             onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
             placeholder="+33 6 12 34 56 78"
           />
           <div className="col-span-full">
             <Input
               label="Adresse"
               value={personalInfo.address}
               onChange={(e) => updatePersonalInfo({ address: e.target.value })}
               placeholder="Ex: Paris, France"
             />
           </div>
        </div>
      </Accordion>

      {/* 2. RÉSUMÉ PROFESSIONNEL */}
      <Accordion 
        title="Résumé Professionnel" 
        icon={<User className="w-5 h-5" />}
      >
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">
             Bio / Résumé
           </label>
           <div className="relative">
             <textarea
               rows={5}
               className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
               placeholder="Décrivez brièvement votre parcours, vos points forts et vos objectifs..."
               value={personalInfo.summary}
               onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
             />
             <button className="absolute bottom-3 right-3 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200 transition-colors flex items-center gap-1 font-medium">
               ✨ Améliorer avec l&apos;IA
             </button>
           </div>
           <p className="mt-2 text-xs text-slate-500">
             Une bonne accroche augmente de 40% vos chances d&apos;être lu.
           </p>
        </div>
      </Accordion>

      {/* 3. EXPÉRIENCES */}
      <Accordion 
        title="Expériences" 
        icon={<Briefcase className="w-5 h-5" />}
      >
        <div className="space-y-6">
          {experiences.length === 0 ? (
             <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Aucune expérience ajoutée.</p>
                <button 
                  onClick={() => addExperience({
                    company: '', position: '', startDate: '', endDate: '', current: false, description: ''
                  })}
                  className="text-blue-600 font-bold hover:underline mt-2 text-sm"
                >
                  Ajouter ma première expérience
                </button>
             </div>
          ) : (
             experiences.map((exp) => (
               <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
                  <button 
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div className="col-span-full">
                        <Input
                          label="Poste occupé"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                          placeholder="Ex: Chef de projet marketing"
                        />
                     </div>
                     <Input
                       label="Entreprise"
                       value={exp.company}
                       onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                       placeholder="Ex: Google"
                     />
                     <div className="grid grid-cols-2 gap-2">
                       <Input
                         label="Début"
                         type="month"
                         value={exp.startDate}
                         onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                       />
                       <Input
                         label="Fin"
                         type="month"
                         value={exp.endDate}
                         onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                         disabled={exp.current}
                       />
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                     <textarea
                       rows={3}
                       value={exp.description}
                       onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                       placeholder="Détaillez vos missions et résultats..."
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                     />
                  </div>
               </div>
             ))
          )}

          {experiences.length > 0 && (
             <button
               onClick={() => addExperience({
                 company: '', position: '', startDate: '', endDate: '', current: false, description: ''
               })}
               className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
             >
               <Plus className="w-4 h-4" />
               Ajouter une expérience
             </button>
          )}
        </div>
      </Accordion>

      {/* 4. FORMATION */}
      <Accordion 
        title="Formation" 
        icon={<GraduationCap className="w-5 h-5" />}
      >
        <div className="space-y-6">
           {education.map((edu) => (
             <div key={edu.id} className="p-5 bg-white border border-slate-200 rounded-xl relative group hover:border-blue-300 transition-all">
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="col-span-full">
                      <Input
                        label="École / Université"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="Ex: HEC Paris"
                      />
                   </div>
                   <Input
                     label="Diplôme"
                     value={edu.degree}
                     onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                     placeholder="Ex: Master 2"
                   />
                   <Input
                     label="Domaine d'études"
                     value={edu.field}
                     onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                     placeholder="Ex: Marketing Digital"
                   />
                </div>
             </div>
           ))}

           <button
             onClick={() => addEducation({
               institution: '', degree: '', field: '', startDate: '', endDate: ''
             })}
             className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
           >
             <Plus className="w-4 h-4" />
             Ajouter une formation
           </button>
        </div>
      </Accordion>

      {/* 5. COMPÉTENCES */}
      <Accordion 
        title="Compétences" 
        icon={<Wrench className="w-5 h-5" />}
      >
        <div className="flex flex-wrap gap-3">
           {skills.map((skill) => (
             <div key={skill.id} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 group">
                <span className="font-medium text-sm">{skill.name}</span>
                <button 
                  onClick={() => removeSkill(skill.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
             </div>
           ))}
           
           <div className="flex items-center gap-2 w-full max-w-xs mt-2">
              <Input
                placeholder="Ex: React, Gestion de projet..."
                className="h-10 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      addSkill({ name: target.value.trim(), level: 5 });
                      target.value = '';
                    }
                  }
                }}
              />
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
              </button>
           </div>
           <p className="w-full text-xs text-slate-400 mt-1">Appuyez sur Entrée pour ajouter</p>
        </div>
      </Accordion>

      {/* 6. LANGUES */}
      <Accordion 
        title="Langues" 
        icon={<Languages className="w-5 h-5" />}
      >
        <div className="space-y-3">
           {languages.map((lang) => (
             <div key={lang.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white">
                <Input
                   value={lang.name}
                   onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                   placeholder="Langue"
                   className="h-9 border-none bg-transparent shadow-none px-0 focus:ring-0"
                />
                <select
                  value={lang.level}
                  onChange={(e) => updateLanguage(lang.id, { level: e.target.value as any })}
                  className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 text-slate-600 focus:ring-0 cursor-pointer"
                >
                   <option value="Débutant">Débutant</option>
                   <option value="Intermédiaire">Intermédiaire</option>
                   <option value="Avancé">Avancé</option>
                   <option value="Natif">Natif</option>
                </select>
                <button 
                  onClick={() => removeLanguage(lang.id)}
                  className="text-slate-400 hover:text-red-500 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
           ))}
           
           <button
             onClick={() => addLanguage({ name: '', level: 'Intermédiaire' })}
             className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 mt-2"
           >
             <Plus className="w-4 h-4" />
             Ajouter une langue
           </button>
        </div>
      </Accordion>

    </div>
  );
}
