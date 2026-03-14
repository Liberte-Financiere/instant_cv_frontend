import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  photoUrl: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Entreprise requise'),
  position: z.string().min(1, 'Poste requis'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'École requise'),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Compétence requise'),
  level: z.number().min(1).max(5).optional(),
});

export const languageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Langue requise'),
  level: z.enum(['Débutant', 'Intermédiaire', 'Avancé', 'Natif']).optional(),
});

export const hobbySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Loisir requis'),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification requise'),
  organization: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Projet requis'),
  description: z.string().optional(),
  url: z.string().optional(),
  github: z.string().optional(),
  technologies: z.string().optional(),
});

export const qualitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Qualité requise'),
});

export const referenceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nom requis'),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  hideContact: z.boolean().optional(),
});

export const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.enum(['linkedin', 'github', 'portfolio', 'twitter', 'other']),
  url: z.string().url('URL invalide'),
  label: z.string().optional(),
});

export const footerSchema = z.object({
  showFooter: z.boolean(),
  madeAt: z.string().optional(),
  madeDate: z.string().optional(),
  signatureUrl: z.string().optional(),
});

export const settingsSchema = z.object({
  accentColor: z.string(),
  sidebarColor: z.string().optional(),
  fontFamily: z.enum(['sans', 'serif', 'mono']).optional(),
});

export const sectionIdSchema = z.enum([
  'summary', 'experience', 'education', 'skills', 'languages', 
  'hobbies', 'certifications', 'projects', 'references', 'qualities', 'divers'
]);

import { TEMPLATE_IDS } from '@/lib/templates';

// Derived automatically from TEMPLATES — no manual sync needed!
export const templateIdSchema = z.enum(TEMPLATE_IDS as unknown as [string, ...string[]]);

export const cvSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Titre requis'),
  templateId: templateIdSchema,
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  hobbies: z.array(hobbySchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  references: z.array(referenceSchema).optional(),
  qualities: z.array(qualitySchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  divers: z.string().optional(),
  footer: footerSchema,
  settings: settingsSchema,
  sectionOrder: z.array(sectionIdSchema),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  views: z.number().optional(),
  isPublic: z.boolean().optional(),
  publicLink: z.string().optional(),
});

// Cover Letter Schema
export const coverLetterContentSchema = z.object({
  sender: personalInfoSchema,
  recipient: z.object({
    name: z.string(),
    company: z.string(),
    address: z.string(),
    email: z.string().email().optional().or(z.literal('')),
  }),
  details: z.object({
    date: z.string(),
    location: z.string(),
    subject: z.string(),
    salutation: z.string(),
    body: z.string(),
    closing: z.string(),
  }),
});

export const coverLetterSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: coverLetterContentSchema,
});
