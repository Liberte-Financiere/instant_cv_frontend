import { describe, it, expect } from 'vitest';
import { 
  sanitizeRawText, 
  sanitizeStructuredCV, 
  BilanResultSchema, 
  stripMarkdownFences 
} from '../app/api/ai/bilan/route';

describe('Bilan de Compétences - Tests de Sécurité et de Validation', () => {

  describe('1. Anonymisation du Texte Brut (sanitizeRawText)', () => {
    it('doit masquer les adresses email', () => {
      const text = 'Contactez-moi à jean.dupont@gmail.com ou test@yahoo.fr.';
      const result = sanitizeRawText(text);
      expect(result).toContain('[EMAIL]');
      expect(result).not.toContain('jean.dupont@gmail.com');
      expect(result).not.toContain('test@yahoo.fr');
    });

    it('doit masquer les numéros de téléphone (internationaux et locaux)', () => {
      const text = 'Mon tel: +33 6 12 34 56 78. Autre: 0612345678. Fixe: (01) 23 45 67 89';
      const result = sanitizeRawText(text);
      expect(result).toContain('[TELEPHONE]');
      expect(result).not.toContain('+33 6 12 34 56 78');
      expect(result).not.toContain('0612345678');
      expect(result).not.toContain('(01) 23 45 67 89');
    });

    it('doit masquer les URLs', () => {
      const text = 'Mon portfolio: https://jeandupont.dev et http://test.com/cv';
      const result = sanitizeRawText(text);
      expect(result).toContain('[URL]');
      expect(result).not.toContain('https://jeandupont.dev');
      expect(result).not.toContain('http://test.com/cv');
    });
  });

  describe('2. Anonymisation du CV Structuré (sanitizeStructuredCV)', () => {
    it('doit supprimer les données PII sensibles mais conserver les champs utiles', () => {
      const cvMock = {
        personalInfo: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@test.com',
          phone: '0600000000',
          title: 'Développeur Fullstack',
          summary: 'Expert en React et Node.js',
        },
        projects: [
          { name: 'Mon Projet', url: 'https://monprojet.com', description: 'Une super app' }
        ],
        references: [
          { name: 'Boss', email: 'boss@entreprise.com', phone: '0100000000', company: 'Entreprise' }
        ],
        socialLinks: ['https://linkedin.com/in/jean'],
        settings: { theme: 'dark' },
        createdAt: '2023-01-01',
      };

      const result = sanitizeStructuredCV(cvMock);

      // personalInfo email & phone removed, title & summary kept
      expect(result.personalInfo.email).toBeUndefined();
      expect(result.personalInfo.phone).toBeUndefined();
      expect(result.personalInfo.title).toBe('Développeur Fullstack');
      expect(result.personalInfo.summary).toBe('Expert en React et Node.js');

      // project url removed
      expect(result.projects[0].url).toBeUndefined();
      expect(result.projects[0].description).toBe('Une super app');

      // references contact removed
      expect(result.references[0].email).toBeUndefined();
      expect(result.references[0].phone).toBeUndefined();
      expect(result.references[0].company).toBe('Entreprise');

      // completely removed sections
      expect(result.socialLinks).toBeUndefined();
      expect(result.settings).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
    });
  });

  describe('3. Validation du Schéma de Résultat IA (BilanResultSchema)', () => {
    it('doit accepter un résultat valide', () => {
      const validPayload = {
        strengths: ["React", "TypeScript", "Node.js"],
        areasForImprovement: ["Docker", "CI/CD"],
        compatibleCareers: [
          { title: "Senior Frontend Engineer", matchPercentage: 90, reason: "Maitrise de React" },
          { title: "Fullstack Developer", matchPercentage: 75, reason: "Connaissances Node" }
        ],
        recommendedTrainings: [
          { title: "Certification AWS", type: "Certificat", benefit: "Améliorer le CI/CD" }
        ]
      };

      const result = BilanResultSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('doit rejeter un résultat incomplet (déclenchera un remboursement ou retry en production)', () => {
      const invalidPayload = {
        strengths: ["React"], // Pas de "areasForImprovement"
        compatibleCareers: [] // Vide
      };

      const result = BilanResultSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('doit rejeter si matchPercentage est supérieur à 100', () => {
      const payload = {
        strengths: ["Test"],
        areasForImprovement: ["Test"],
        compatibleCareers: [
          { title: "Test", matchPercentage: 150, reason: "Test" }
        ],
        recommendedTrainings: [
          { title: "Test", type: "Test", benefit: "Test" }
        ]
      };
      
      const result = BilanResultSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('4. Nettoyage du Markdown LLM (stripMarkdownFences)', () => {
    it('doit enlever les balises ```json', () => {
      const raw = '```json\n{"test": true}\n```';
      expect(stripMarkdownFences(raw)).toBe('{"test": true}');
    });

    it('doit fonctionner sans balises', () => {
      const raw = '{"test": true}';
      expect(stripMarkdownFences(raw)).toBe('{"test": true}');
    });
  });
});
