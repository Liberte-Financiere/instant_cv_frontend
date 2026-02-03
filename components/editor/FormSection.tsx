'use client';

import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import type { EditorStep } from '@/types/cv';
import { EDITOR_STEPS, type Experience, type Education, type Skill, type Language } from '@/types/cv';
import { useState } from 'react';

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
      className="space-y-6"
    >
      {currentStep === 'personal' && <PersonalInfoForm />}
      {currentStep === 'experience' && <ExperienceForm />}
      {currentStep === 'education' && <EducationForm />}
      {currentStep === 'skills' && <SkillsForm />}
      {currentStep === 'languages' && <LanguagesForm />}
      {currentStep === 'preview' && <PreviewSection />}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-6">
        {!isFirst && (
          <button
            onClick={onPrev}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Précédent
          </button>
        )}
        {!isLast && (
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            Suivant
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Informations Personnelles</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            value={info.firstName}
            onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Jean"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={info.lastName}
            onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Dupont"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre professionnel</label>
        <input
          type="text"
          value={info.title}
          onChange={(e) => updatePersonalInfo({ title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Développeur Full Stack"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={info.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="jean@exemple.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            value={info.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input
          type="text"
          value={info.address}
          onChange={(e) => updatePersonalInfo({ address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Paris, France"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
        <textarea
          value={info.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Décrivez-vous en quelques phrases..."
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Expériences Professionnelles</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {experiences.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucune expérience ajoutée. Cliquez sur &quot;Ajouter&quot; pour commencer.
        </p>
      ) : (
        experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-50 rounded-xl space-y-4 relative group"
          >
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  placeholder="Entreprise SAS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  placeholder="Chef de projet"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  disabled={exp.current}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white disabled:bg-gray-100"
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">Poste actuel</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white resize-none"
                placeholder="Décrivez vos responsabilités et réalisations..."
              />
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

function EducationForm() {
  const { currentCV, addEducation, updateEducation, removeEducation } = useCVStore();
  const education = currentCV?.education || [];

  const handleAdd = () => {
    addEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Formation</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {education.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucune formation ajoutée. Cliquez sur &quot;Ajouter&quot; pour commencer.
        </p>
      ) : (
        education.map((edu) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-50 rounded-xl space-y-4 relative group"
          >
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                placeholder="Université de Paris"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  placeholder="Master"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  placeholder="Informatique"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

function SkillsForm() {
  const { currentCV, addSkill, updateSkill, removeSkill } = useCVStore();
  const skills = currentCV?.skills || [];

  const handleAdd = () => {
    addSkill({ name: '', level: 3 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Compétences</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucune compétence ajoutée. Cliquez sur &quot;Ajouter&quot; pour commencer.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gray-50 rounded-xl flex items-center gap-4 group"
            >
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                placeholder="Ex: React, Python..."
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
              >
                <option value={1}>Débutant</option>
                <option value={2}>Junior</option>
                <option value={3}>Intermédiaire</option>
                <option value={4}>Avancé</option>
                <option value={5}>Expert</option>
              </select>
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function LanguagesForm() {
  const { currentCV, addLanguage, updateLanguage, removeLanguage } = useCVStore();
  const languages = currentCV?.languages || [];

  const handleAdd = () => {
    addLanguage({ name: '', level: 'Intermédiaire' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Langues</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {languages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucune langue ajoutée. Cliquez sur &quot;Ajouter&quot; pour commencer.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languages.map((lang) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gray-50 rounded-xl flex items-center gap-4 group"
            >
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
                placeholder="Ex: Français, Anglais..."
              />
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, { level: e.target.value as any })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm"
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Natif">Natif</option>
              </select>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewSection() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu Final</h2>
      <p className="text-gray-600 mb-6">
        Votre CV est prêt ! Consultez l&apos;aperçu à droite et téléchargez-le au format PDF.
      </p>
      <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        Télécharger en PDF
      </button>
    </div>
  );
}
