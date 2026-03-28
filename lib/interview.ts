import { GoogleGenerativeAI, SchemaType, Schema, Content } from '@google/generative-ai';
import { APP_CONFIG } from '@/lib/config';

const MAX_QUESTIONS = APP_CONFIG.ai.interview.maxQuestions;

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

function getModel(schemaType: 'first' | 'response' | 'summary', systemInstruction?: string) {
  const schemaMap = {
    first: FIRST_QUESTION_SCHEMA,
    response: RESPONSE_SCHEMA,
    summary: SUMMARY_SCHEMA
  };

  return genAI.getGenerativeModel({
    model: APP_CONFIG.ai.models.fast,
    systemInstruction,
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

export function buildFirstQuestionSystemInstruction(
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

export function buildResponseSystemInstruction(
  cvSummary: string,
  jobTitle: string,
  questionNumber: number,
  jobContext?: string | null
): string {
  const isLastQuestion = questionNumber >= MAX_QUESTIONS;

  return `Tu es un recruteur professionnel expérimenté.
Tu évalues les réponses d'un candidat lors d'un entretien simulé.

PROFIL DU CANDIDAT :
${cvSummary}

POSTE VISÉ : ${jobTitle}
${jobContext ? `CONTEXTE DE L'OFFRE :\n${jobContext}` : ''}

RÈGLES :
1. Évalue la réponse sur 10.
2. Donne un feedback constructif et spécifique (2-3 phrases max).
3. ${isLastQuestion
      ? "C'est la DERNIÈRE question. Ne pose PAS de nouvelle question. Assigne null au champ nextQuestion."
      : "PROCHAINE QUESTION (Règle d'or) : Si la réponse du candidat est courte, floue ou théorique, NE PASSE PAS à un autre sujet. Pose une sous-question incisive (méthode STAR : Situation, Tâche, Action, Résultat) pour le forcer à donner un exemple concret. Si sa réponse était déjà parfaite et détaillée, passe à un nouveau sujet pertinent."}
4. Le feedback doit être bienveillant mais honnête, n'hésite pas à le challenger s'il survole un point technique.`;
}

export function buildSummarySystemInstruction(
  cvSummary: string,
  jobTitle: string
): string {
  return `Tu es un coach carrière expert.
Analyse l'ensemble de cet entretien simulé et donne un bilan complet.

PROFIL DU CANDIDAT :
${cvSummary}

POSTE VISÉ : ${jobTitle}

RÈGLES :
1. Donne un score global sur 100.
2. Identifie 3 points forts du candidat.
3. Identifie 3 axes d'amélioration concrets.
4. Rédige des recommandations spécifiques pour le poste visé.`;
}

export function formatHistoryForGemini(
  conversationHistory: { role: string; content: string; score?: number | null }[]
): Content[] {
  const history: Content[] = [];

  for (const msg of conversationHistory) {
    if (msg.role === 'candidate') {
      history.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'interviewer' || msg.role === 'feedback') {
      const last = history[history.length - 1];
      const textToAppend = msg.role === 'feedback' 
        ? `[ÉVALUATION INTERNE : ${msg.score}/10] ${msg.content}` 
        : msg.content;
        
      if (last && last.role === 'model') {
        last.parts[0].text += `\n\n${textToAppend}`;
      } else {
        history.push({ role: 'model', parts: [{ text: textToAppend }] });
      }
    }
  }

  // L'API de Chat de Gemini préfère généralement commencer par un user.
  if (history.length > 0 && history[0].role === 'model') {
    history.unshift({ role: 'user', parts: [{ text: "Bonjour, je suis prêt pour l'entretien." }] });
  }

  return history;
}

export async function generateInterviewResponse(
  schemaType: 'first' | 'response' | 'summary',
  systemInstruction: string,
  message: string,
  history: Content[] = []
) {
  const model = getModel(schemaType, systemInstruction);
  
  const cleanJson = (text: string) => text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

  let text = '';
  try {
    if (schemaType === 'first') {
      const result = await model.generateContent(message);
      text = result.response.text();
    } else {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(message);
      text = result.response.text();
    }
  } catch (error) {
    console.error(`[INTERVIEW_GENERATE_ERROR]`, error);
    throw new Error("L'IA n'a pas pu générer la réponse. Veuillez réessayer.");
  }

  try {
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error(`[INTERVIEW_JSON_PARSE_ERROR] Schema: ${schemaType} Failed for text:`, text.substring(0, 500));
    throw new Error("L'IA n'a pas pu formatter la réponse au format requis. Veuillez réessayer.");
  }
}
