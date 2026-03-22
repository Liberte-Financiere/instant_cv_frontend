import { GoogleGenerativeAI } from '@google/generative-ai';
import { APP_CONFIG } from '@/lib/config';

const MAX_QUESTIONS = 6;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

function getModel() {
  return genAI.getGenerativeModel({
    model: APP_CONFIG.ai.models.fast,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });
}

export const INTERVIEW_CONFIG = {
  maxQuestions: MAX_QUESTIONS,
  questionTypes: [
    'comportementale',
    'technique',
    'situationnelle',
    'motivation',
    'culture fit',
  ],
} as const;

export function buildCVSummary(cvData: Record<string, any>): string {
  const parts: string[] = [];

  const info = cvData.personalInfo;
  if (info) {
    if (info.title) parts.push(`Poste actuel : ${info.title}`);
    if (info.summary) parts.push(`Profil : ${info.summary}`);
  }

  if (cvData.experiences?.length) {
    const expLines = cvData.experiences.map((e: any) =>
      `${e.position} chez ${e.company} (${e.startDate || ''}–${e.current ? 'Présent' : e.endDate || ''})`
    );
    parts.push(`Expériences :\n${expLines.join('\n')}`);
  }

  if (cvData.education?.length) {
    const eduLines = cvData.education.map((e: any) =>
      `${e.degree} ${e.field ? `en ${e.field}` : ''} — ${e.institution}`
    );
    parts.push(`Formation :\n${eduLines.join('\n')}`);
  }

  if (cvData.skills?.length) {
    const skillNames = cvData.skills.map((s: any) => s.name).join(', ');
    parts.push(`Compétences : ${skillNames}`);
  }

  if (cvData.languages?.length) {
    const langNames = cvData.languages.map((l: any) => `${l.name} (${l.level})`).join(', ');
    parts.push(`Langues : ${langNames}`);
  }

  return parts.join('\n\n');
}

export function buildFirstQuestionPrompt(
  cvSummary: string,
  jobTitle: string,
  jobContext?: string | null
): string {
  return `Tu es un recruteur professionnel expérimenté.
Tu fais passer un entretien d'embauche simulé à un candidat.

PROFIL DU CANDIDAT :
${cvSummary}

POSTE VISÉ : ${jobTitle}
${jobContext ? `CONTEXTE DE L'OFFRE :\n${jobContext}` : ''}

RÈGLES :
1. Pose UNE SEULE question pertinente pour commencer l'entretien.
2. La question doit être adaptée au profil et au poste visé.
3. Commence par une question d'introduction (motivation, parcours) avant d'aller vers le technique.
4. Sois professionnel mais bienveillant.
5. Réponds en JSON.

FORMAT JSON :
{
  "question": "Votre question ici",
  "questionType": "motivation|comportementale|technique|situationnelle|culture_fit",
  "questionNumber": 1
}`;
}

export function buildResponsePrompt(
  cvSummary: string,
  jobTitle: string,
  conversationHistory: { role: string; content: string }[],
  candidateAnswer: string,
  questionNumber: number,
  jobContext?: string | null
): string {
  const isLastQuestion = questionNumber >= MAX_QUESTIONS;

  const historyText = conversationHistory.map((m) => {
    if (m.role === 'interviewer') return `RECRUTEUR : ${m.content}`;
    if (m.role === 'candidate') return `CANDIDAT : ${m.content}`;
    return '';
  }).filter(Boolean).join('\n\n');

  return `Tu es un recruteur professionnel expérimenté.
Tu évalues les réponses d'un candidat lors d'un entretien simulé.

PROFIL DU CANDIDAT :
${cvSummary}

POSTE VISÉ : ${jobTitle}
${jobContext ? `CONTEXTE DE L'OFFRE :\n${jobContext}` : ''}

HISTORIQUE DE L'ENTRETIEN :
${historyText}

DERNIÈRE RÉPONSE DU CANDIDAT :
"${candidateAnswer}"

RÈGLES :
1. Évalue la réponse sur 10 (score).
2. Donne un feedback constructif et spécifique (2-3 phrases max).
3. ${isLastQuestion
      ? 'C\'est la DERNIÈRE question. Ne pose PAS de nouvelle question. Mets "nextQuestion" à null.'
      : 'Pose la PROCHAINE question adaptée au contexte de l\'entretien. Varie les types de questions.'}
4. Le feedback doit être bienveillant mais honnête.
5. Réponds en JSON.

FORMAT JSON :
{
  "feedback": "Votre feedback sur la réponse",
  "score": 7,
  ${isLastQuestion ? '"nextQuestion": null,' : '"nextQuestion": "Votre prochaine question",'}
  "questionType": "motivation|comportementale|technique|situationnelle|culture_fit"
}`;
}

export function buildSummaryPrompt(
  cvSummary: string,
  jobTitle: string,
  conversationHistory: { role: string; content: string; score?: number | null }[]
): string {
  const historyText = conversationHistory.map((m) => {
    if (m.role === 'interviewer') return `RECRUTEUR : ${m.content}`;
    if (m.role === 'candidate') return `CANDIDAT : ${m.content}`;
    if (m.role === 'feedback') return `ÉVALUATION (${m.score}/10) : ${m.content}`;
    return '';
  }).filter(Boolean).join('\n\n');

  return `Tu es un coach carrière expert.
Analyse l'ensemble de cet entretien simulé et donne un bilan complet.

PROFIL DU CANDIDAT :
${cvSummary}

POSTE VISÉ : ${jobTitle}

ENTRETIEN COMPLET :
${historyText}

RÈGLES :
1. Score global sur 100.
2. 3 points forts du candidat.
3. 3 axes d'amélioration concrets.
4. Recommandations spécifiques pour le poste visé.
5. Réponds en JSON.

FORMAT JSON :
{
  "totalScore": 72,
  "globalFeedback": "Résumé en 2-3 phrases de la performance globale",
  "strengths": ["Force 1", "Force 2", "Force 3"],
  "improvements": ["Amélioration 1", "Amélioration 2", "Amélioration 3"],
  "recommendations": ["Recommandation 1", "Recommandation 2"]
}`;
}

export async function generateInterviewResponse(prompt: string) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}
