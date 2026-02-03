'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useCVStore } from '@/store/cvStore';
import { formatDate } from '@/lib/utils';

export function CVPreview() {
  const { currentCV } = useCVStore();

  if (!currentCV) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>Chargement...</p>
      </div>
    );
  }

  const { personalInfo, experiences, education, skills, languages } = currentCV;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      style={{ 
        aspectRatio: '210/297',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      <div className="h-full overflow-y-auto p-6 text-sm">
        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-200 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
            {personalInfo.firstName?.[0] || ''}{personalInfo.lastName?.[0] || ''}
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
          </h1>
          <p className="text-indigo-600 font-medium mt-1">
            {personalInfo.title || 'Titre professionnel'}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {personalInfo.address}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-4">
            <h2 className="text-xs font-bold text-indigo-600 uppercase mb-2">Profil</h2>
            <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold text-indigo-600 uppercase mb-2">Expériences</h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position || 'Poste'}</h3>
                      <p className="text-gray-600">{exp.company || 'Entreprise'}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exp.startDate && formatDate(exp.startDate)} - {exp.current ? 'Présent' : (exp.endDate && formatDate(exp.endDate))}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold text-indigo-600 uppercase mb-2">Formation</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree || 'Diplôme'} - {edu.field || 'Domaine'}</h3>
                    <p className="text-gray-600">{edu.institution || 'Établissement'}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {edu.startDate && formatDate(edu.startDate)} - {edu.endDate && formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold text-indigo-600 uppercase mb-2">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs"
                >
                  {skill.name || 'Compétence'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-indigo-600 uppercase mb-2">Langues</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {lang.name || 'Langue'} - {lang.level}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
