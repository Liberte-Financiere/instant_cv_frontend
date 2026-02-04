'use client';

import { useState, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, Wrench, Languages, 
  Heart, FileText, Award, FolderOpen, UserCheck
} from 'lucide-react';
import { useCVStore } from '@/store/useCVStore';
import { Accordion } from '@/components/ui/Accordion';
import { EditorStep } from '@/types/cv';

// Import sub-forms
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { HobbiesForm } from './forms/HobbiesForm';
import { ReferencesForm } from './forms/ReferencesForm';
import { DiversForm } from './forms/DiversForm';

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
  const { currentCV, setCurrentStep } = useCVStore();

  if (!currentCV) return null;

  const [isExpanded, setIsExpanded] = useState(true);
  const openSection = stepToSection[currentStep] || 'personal';

  // Sync expansion when step changes from outside (e.g. Stepper)
  useEffect(() => {
    setIsExpanded(true);
  }, [currentStep]);

  const handleToggle = (key: SectionKey) => {
    if (stepToSection[currentStep] === key) {
      setIsExpanded(!isExpanded);
    } else {
      setCurrentStep(key as EditorStep);
      setIsExpanded(true);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. INFORMATIONS PERSONNELLES */}
      <Accordion 
        title="Informations Personnelles" 
        icon={<User className="w-5 h-5" />}
        isOpen={openSection === 'personal' && isExpanded}
        onToggle={() => handleToggle('personal')}
      >
        <PersonalInfoForm />
      </Accordion>

      {/* 2. EXPÉRIENCES */}
      <Accordion 
        title="Expériences" 
        icon={<Briefcase className="w-5 h-5" />}
        isOpen={openSection === 'experience' && isExpanded}
        onToggle={() => handleToggle('experience')}
      >
        <ExperienceForm />
      </Accordion>

      {/* 3. FORMATION (Renamed to Éducation) */}
      <Accordion 
        title="Éducation" 
        icon={<GraduationCap className="w-5 h-5" />}
        isOpen={openSection === 'education' && isExpanded}
        onToggle={() => handleToggle('education')}
      >
        <EducationForm />
      </Accordion>

      {/* 4. COMPÉTENCES */}
      <Accordion 
        title="Compétences" 
        icon={<Wrench className="w-5 h-5" />}
        isOpen={openSection === 'skills' && isExpanded}
        onToggle={() => handleToggle('skills')}
      >
        <SkillsForm />
      </Accordion>

      {/* 5. CERTIFICATIONS (Renamed to Formations) */}
      <Accordion 
        title="Formations" 
        icon={<Award className="w-5 h-5" />}
        isOpen={openSection === 'certifications' && isExpanded}
        onToggle={() => handleToggle('certifications')}
      >
        <CertificationsForm />
      </Accordion>

      {/* 6. PROJETS */}
      <Accordion 
        title="Projets" 
        icon={<FolderOpen className="w-5 h-5" />}
        isOpen={openSection === 'projects' && isExpanded}
        onToggle={() => handleToggle('projects')}
      >
        <ProjectsForm />
      </Accordion>

      {/* 7. LANGUES */}
      <Accordion 
        title="Langues" 
        icon={<Languages className="w-5 h-5" />}
        isOpen={openSection === 'languages' && isExpanded}
        onToggle={() => handleToggle('languages')}
      >
        <LanguagesForm />
      </Accordion>

      {/* 8. CENTRES D'INTÉRÊT */}
      <Accordion 
        title="Centres d'intérêt" 
        icon={<Heart className="w-5 h-5" />}
        isOpen={openSection === 'hobbies' && isExpanded}
        onToggle={() => handleToggle('hobbies')}
      >
        <HobbiesForm />
      </Accordion>

      {/* 9. RÉFÉRENCES */}
      <Accordion 
        title="Références" 
        icon={<UserCheck className="w-5 h-5" />}
        isOpen={openSection === 'references' && isExpanded}
        onToggle={() => handleToggle('references')}
      >
        <ReferencesForm />
      </Accordion>

      {/* 10. DIVERS & SIGNATURE */}
      <Accordion 
        title="Divers & Signature" 
        icon={<FileText className="w-5 h-5" />}
        isOpen={openSection === 'divers' && isExpanded}
        onToggle={() => handleToggle('divers')}
      >
        <DiversForm />
      </Accordion>
    </div>
  );
}
