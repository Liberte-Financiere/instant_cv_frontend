import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/ai/match/route';
import { auth } from '@/auth';
import { generateObject } from 'ai';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock credits check
vi.mock('@/lib/credits', () => ({
  checkAndConsumeCredits: vi.fn().mockResolvedValue(true),
}));

// Mock Next.js NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => {
      return { body, status: init?.status || 200 };
    }
  }
}));

describe('Match API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MY_GEMINI_KEY = 'mocked-key';
    process.env.OPENROUTER_API_KEY = 'mocked-openrouter-key';
  });

  it('devrait retourner 401 si non authentifié', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any);
    const req = new Request('http://localhost/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvText: 'test', jobDescription: 'test' })
    });
    
    const response = await POST(req) as any;
    expect(response.status).toBe(401);
  });

  it('devrait gérer les erreurs de l\'IA sans crasher et retourner 500', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'test-user' } } as any);
    vi.mocked(generateObject).mockRejectedValueOnce(new Error('AI Quota Exceeded'));
    
    const req = new Request('http://localhost/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        cvData: 'Ceci est un CV de test suffisamment long pour passer la validation', 
        jobDescription: 'test de description assez longue pour que cela passe' 
      })
    });
    
    const response = await POST(req) as any;
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('AI Quota Exceeded');
  });

  it('devrait réussir et retourner le résultat IA (0 token dépensé)', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'test-user' } } as any);
    
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: { compatibilityScore: 95, recommendations: [] },
      usage: { promptTokens: 10, completionTokens: 20 }
    } as any);
    
    const req = new Request('http://localhost/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        cvData: 'Ceci est un CV de test très long pour passer la validation de la taille minimale qui est de 30 caracteres', 
        jobDescription: 'Ceci est une description de poste très longue pour passer la validation de taille minimale' 
      })
    });
    
    const response = await POST(req) as any;
    expect(response.status).toBe(200);
    expect(response.body.compatibilityScore).toBe(95);
  });
});
