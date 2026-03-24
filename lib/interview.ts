import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { APP_CONFIG } from '@/lib/config';

const MAX_QUESTIONS = 6;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const FIRST_QUESTION_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    question: { type: SchemaType.STRING, description: "La première question posée" },
    questionType: { type: SchemaType.STRING, description: "Type de question (motivation, comportementale, etc.)" },
    questionNumber: { type: SchemaType.INTEGER, description: "Toujours 1" }
  },
  required: ["question", "questionType", "questionNumber"]
};

const RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    feedback: { type: SchemaType.STRING, description: "Feedback constructif et spécifique (2-3 phrases max)" },
    score: { type: SchemaType.INTEGER, description: "Note sur 10 de la réponse" },
    nextQuestion: { type: SchemaType.STRING, nullable: true, description: "La prochaine question à poser. Null si c'est la fin de l'entretien." },
    questionType: { type: SchemaType.STRING, description: "Le type de la prochaine question" }
  },
  required: ["feedback", "score"]
};

const SUMMARY_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    totalScore: { type: SchemaType.INTEGER, description: "Score global sur 100" },
    globalFeedback: { type: SchemaType.STRING, description: "Résumé en 2-3 phrases de la performance globale" },
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "3 points forts" },
    improvements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "3 axes d'amélioration concrets" },
    recommendations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Recommandations spécifiques pour le poste" }
  },
  required: ["totalScore", "globalFeedback", "strengths", "improvements", "recommendations"]
};

function getModel(schemaType: 'first' | 'response' | 'summary') {
  const schemaMap = {
    first: FIRST_QUESTION_SCHEMA,
    response: RESPONSE_SCHEMA,
    summary: SUMMARY_SCHEMA
  };

  return genAI.getGenerativeModel({
    model: APP_CONFIG.ai.models.fast,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schemaMap[schemaType],
      temperature: 0.7,
      maxOutputTokens: 8192,
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
4. Sois professionnel mais bienveillant.`;
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
1. Évalue la réponse sur 10.
2. Donne un feedback constructif et spécifique (2-3 phrases max).
3. ${isLastQuestion
      ? "C'est la DERNIÈRE question. Ne pose PAS de nouvelle question. Assigne null au champ nextQuestion."
      : "PROCHAINE QUESTION (Règle d'or) : Si la réponse du candidat est courte, floue ou théorique, NE PASSE PAS à un autre sujet. Pose une sous-question incisive (méthode STAR : Situation, Tâche, Action, Résultat) pour le forcer à donner un exemple concret. Si sa réponse était déjà parfaite et détaillée, passe à un nouveau sujet pertinent."}
4. Le feedback doit être bienveillant mais honnête, n'hésite pas à le challenger s'il survole un point technique.`;
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
1. Donne un score global sur 100.
2. Identifie 3 points forts du candidat.
3. Identifie 3 axes d'amélioration concrets.
4. Rédige des recommandations spécifiques pour le poste visé.`;
}

export async function generateInterviewResponse(prompt: string, schemaType: 'first' | 'response' | 'summary') {
  const model = getModel(schemaType);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`[INTERVIEW_JSON_PARSE_ERROR] Schema: ${schemaType} Failed:`, text.slice(-500));
    throw new Error("L'IA n'a pas pu formatter la réponse selon le schéma attendu. Veuillez réessayer.");
  }
}
