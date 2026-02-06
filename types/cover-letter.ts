import { PersonalInfo } from "./cv";

export interface CoverLetterContent {
  sender: PersonalInfo;
  recipient: {
    name: string;
    company: string;
    address: string;
    email?: string;
  };
  details: {
    date: string;
    location: string;
    subject: string;
    salutation: string;
    body: string;
    closing: string;
  };
}

export interface CoverLetter {
  id: string;
  title: string;
  content: CoverLetterContent;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type CoverLetterStep = 'info' | 'recipient' | 'content' | 'preview';

export const COVER_LETTER_STEPS: { key: CoverLetterStep; label: string }[] = [
  { key: 'info', label: 'Vos Infos' },
  { key: 'recipient', label: 'Destinataire' },
  { key: 'content', label: 'Contenu' },
  { key: 'preview', label: 'Aperçu' },
];
