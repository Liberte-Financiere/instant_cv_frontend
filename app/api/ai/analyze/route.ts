import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
// @ts-ignore
// const pdf = require('pdf-parse');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
// Use a model capable of handling larger context if possible, but flash-lite is fast
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash', // Upgrading model for better extraction capabilities
  generationConfig: { responseMimeType: "application/json" }
});

export const dynamic = 'force-dynamic'; // Prevent static optimization
export const runtime = 'nodejs'; // Ensure Node.js runtime for pdf-parse

import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log('[API] Analyze Request Started');
  
  // Lazy load pdf-parse strictly inside handler
  let PDFParse;
  try {
    // @ts-ignore
    const pdfModule = require('pdf-parse');
    PDFParse = pdfModule.PDFParse || pdfModule.default?.PDFParse;
    
    if (!PDFParse) {
        throw new Error('PDFParse class not found in module');
    }
  } catch (e) {
    console.error('[API] Failed to load pdf-parse:', e);
    return NextResponse.json({ error: 'Server Configuration Error: PDF Parser missing' }, { status: 500 });
  }

  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Le fichier est trop volumineux (max 5MB)' }, { status: 400 });
    }

    let extractedText = '';

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      console.log('[API] Processing PDF with v2 Parser...');
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      let parser;
      try {
        // Initialize parser with buffer data
        // @ts-ignore
        parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        extractedText = data.text;
        await parser.destroy();
        
        console.log('[API] PDF extracted. Length:', extractedText.length);
      } catch (pdfError) {
        console.error('[API] PDF Parsing Error:', pdfError);
        if (parser) {
            try { await parser.destroy(); } catch(e) {}
        }
        return NextResponse.json({ error: 'Failed to read PDF file structure.' }, { status: 400 });
      }
    } else if (file.type === 'text/plain') {
      extractedText = await file.text();
    } else {
      // TODO: Add support for Docx if needed via mammoth
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or TXT.' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract enough text from file.' }, { status: 400 });
    }

    console.log('[API] Sending to Gemini...');

    // ... (Prompt definition kept same, assume it's fine) ...
    // Prepare Prompt for Detailed Analysis & Extraction
    const prompt = `
      You are an expert HR Recruiter and CV Analyzer.
      
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text();
    
    console.log('[API] Gemini Response received. Length:', jsonString.length);

    // Sanitize JSON string (remove markdown code blocks if present)
    const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        const parsedData = JSON.parse(cleanJson);
        return NextResponse.json(parsedData);
    } catch (parseError) {
        console.error('[API] JSON Parse Error. Raw string:', cleanJson);
        return NextResponse.json({ error: 'AI returned invalid format', details: cleanJson.slice(0, 100) }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[API] Global Catch Error:', error);
    
    // Handle Rate Limiting specifically
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
