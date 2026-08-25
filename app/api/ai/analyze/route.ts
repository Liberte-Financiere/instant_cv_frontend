import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@/lib/config';
import { logAIUsage } from '@/lib/ai/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { auth } from '@/auth';


export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });



  try {
    // Check and consume 2 credits
    const { checkAndConsumeCredits } = await import('@/lib/credits');
    try {
      await checkAndConsumeCredits(session.user.id, 'AI_ANALYZE', 'Analyse magique du CV par IA');
    } catch (e: any) {
      return NextResponse.json({ error: e.message || 'Crédits insuffisants' }, { status: 403 });
    }

    if (!process.env.MY_GEMINI_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    let extractedText = '';
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // JSON mode: CV data from the platform
      const { cvData } = await req.json();
      if (!cvData) {
        return NextResponse.json({ error: 'CV data is required' }, { status: 400 });
      }
      extractedText = typeof cvData === 'string' ? cvData : JSON.stringify(cvData);
    } else {
      // FormData mode: file upload (PDF/TXT)
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Le fichier est trop volumineux (max 5MB)' }, { status: 400 });
      }

      if (file.type === 'application/pdf') {
        const { extractText } = await import('unpdf');
        const arrayBuffer = await file.arrayBuffer();
        const { text } = await extractText(new Uint8Array(arrayBuffer));
        extractedText = text.join('\n');
      } else if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else {
        return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or TXT.' }, { status: 400 });
      }
    }

    if (!extractedText || extractedText.trim().length < 30) {
      return NextResponse.json({ error: 'Contenu du CV insuffisant.' }, { status: 400 });
    }

    const prompt = `
      You are an expert HR Recruiter and CV Analyzer.
      
      IMPORTANT: You must analyze the CV in its original language.
      If the CV is in French, ALL your feedback (reviews, strengths, improvements, recommendations) MUST be in French.
      If the CV is in English, answer in English.
      
      Tasks:
      1. ANALYZE (Detailed Audit):
         - Global Score (0-100).
         - Global Review (2-3 sentences).
         - Detect 5-10 important tech/soft skill keywords from the CV.
         - Recommend 3 specific Job Titles that fit this profile (with % match and brief reason).
         - Audit 4 specific sections: "Structure", "Experience", "Education", "Skills".
           For each, provide: score (0-100), 2 strengths, 2 specific improvements, and 1 general recommendation.

      2. EXTRACT DATA:
         - Extract structured data for importing (same as before).
         - "skills": [{ name: string, level: 1-5 }]
         - "languages": [{ name: string, level: "Intermédiaire"|"Avancé"|"Natif" }]

      Output JSON Schema:
      {
        "analysis": {
          "globalScore": number,
          "globalReview": string,
          "detectedKeywords": string[],
          "recommendedPositions": [
            { "title": string, "match": number, "reason": string }
          ],
          "sections": {
            "structure": { "score": number, "strengths": string[], "improvements": string[], "recommendations": string[] },
            "experience": { "score": number, "strengths": string[], "improvements": string[], "recommendations": string[] },
            "education": { "score": number, "strengths": string[], "improvements": string[], "recommendations": string[] },
            "skills": { "score": number, "strengths": string[], "improvements": string[], "recommendations": string[] }
          }
        },
        "cvData": {
          "personalInfo": { "firstName": string, "lastName": string, "email": string, "phone": string, "address": string, "title": string, "summary": string },
          "experiences": [{ "company": string, "position": string, "startDate": string, "endDate": string, "current": boolean, "description": string }],
          "education": [{ "institution": string, "degree": string, "field": string, "startDate": string, "endDate": string }],
          "skills": [{ "name": string, "level": number }],
          "languages": [{ "name": string, "level": string }],
          "hobbies": [{ "name": string }],
          "certifications": [{ "name": string, "organization": string, "date": string }],
          "projects": [{ "name": string, "description": string }],
          "references": [{ "name": string, "company": string, "contact": string }],
          "qualities": [{ "name": string }],
          "socialLinks": [{ "platform": string, "url": string }]
        }
      }

      CV TEXT:
      """
      ${extractedText.slice(0, 40000)} 
      """
    `;

    const apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json({ error: "Configuration IA manquante (OpenRouter)" }, { status: 500 });
    }
    const openrouter = createOpenRouter({ apiKey });

    const sectionSchema = z.object({
      score: z.number(),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      recommendations: z.array(z.string())
    });

    const analyzeSchema = z.object({
      analysis: z.object({
        globalScore: z.number(),
        globalReview: z.string(),
        detectedKeywords: z.array(z.string()),
        recommendedPositions: z.array(z.object({
          title: z.string(),
          match: z.number(),
          reason: z.string()
        })),
        sections: z.object({
          structure: sectionSchema,
          experience: sectionSchema,
          education: sectionSchema,
          skills: sectionSchema
        })
      }),
      cvData: z.object({
        personalInfo: z.object({
          firstName: z.string(), lastName: z.string(), email: z.string(), phone: z.string(), address: z.string(), title: z.string(), summary: z.string()
        }),
        experiences: z.array(z.object({
          company: z.string(), position: z.string(), startDate: z.string(), endDate: z.string(), current: z.boolean(), description: z.string()
        })),
        education: z.array(z.object({
          institution: z.string(), degree: z.string(), field: z.string(), startDate: z.string(), endDate: z.string()
        })),
        skills: z.array(z.object({ name: z.string(), level: z.number() })),
        languages: z.array(z.object({ name: z.string(), level: z.string() })),
        hobbies: z.array(z.object({ name: z.string() })),
        certifications: z.array(z.object({ name: z.string(), organization: z.string(), date: z.string() })),
        projects: z.array(z.object({ name: z.string(), description: z.string() })),
        references: z.array(z.object({ name: z.string(), company: z.string(), contact: z.string() })),
        qualities: z.array(z.object({ name: z.string() })),
        socialLinks: z.array(z.object({ platform: z.string(), url: z.string() }))
      })
    });

    const startTime = performance.now();
    const { object, usage } = await generateObject({
      model: openrouter(APP_CONFIG.ai.models.openrouter.fast),
      schema: analyzeSchema,
      prompt: prompt,
    });

    logAIUsage({
      type: 'analysis',
      model: APP_CONFIG.ai.models.fast,
      status: 'success',
      promptTokens: (usage as any)?.promptTokens || (usage as any)?.inputTokens || 0,
      completionTokens: (usage as any)?.completionTokens || (usage as any)?.outputTokens || 0,
      latencyMs: performance.now() - startTime,
      userId: session.user.id
    });

    return NextResponse.json(object);

  } catch (error: any) {
    console.error('[API] Global Catch Error:', error);
    
    logAIUsage({
      type: 'analysis',
      model: APP_CONFIG.ai.models.fast,
      status: 'error',
      errorMessage: error?.message || 'Erreur inconnue',
      userId: session?.user?.id
    });

    if (session?.user?.id) {
      const { refundCredits } = await import('@/lib/credits');
      await refundCredits(session.user.id, 'AI_ANALYZE', 'Remboursement suite à un échec technique de l\'analyse magique');
    }

    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
        return NextResponse.json({ 
            error: 'Le quota de l\'IA est dépassé. Veuillez réessayer dans une minute.', 
            details: 'API Rate Limit Exceeded' 
        }, { status: 429 });
    }

    return NextResponse.json({ 
      error: 'Analysis failed', 
      details: error.message 
    }, { status: 500 });
  }
}
