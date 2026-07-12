import { describe, it, expect } from 'vitest';
import { getHtmlForTemplate, generateAnnouncementEmail, generatePromoEmail, generateMinimalEmail, generateArtlistEmail, generateDreamforceEmail } from '@/lib/email-templates';

describe('Email Templates Generator', () => {
  const mockProps = {
    subject: 'Test Subject 123',
    message: 'Hello World\nLine 2',
    buttonText: 'Click Me',
    buttonUrl: 'https://jobsira.com/test'
  };

  describe('generateAnnouncementEmail', () => {
    it('should generate valid HTML containing the subject and message', () => {
      const html = generateAnnouncementEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain('Hello World');
      expect(html).toContain('Line 2');
      expect(html).toContain(mockProps.buttonText);
      expect(html).toContain(mockProps.buttonUrl);
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should not render a button if buttonText is missing', () => {
      const html = generateAnnouncementEmail({ ...mockProps, buttonText: undefined });
      expect(html).not.toContain('Click Me');
      expect(html).not.toContain(mockProps.buttonUrl);
    });
  });

  describe('generatePromoEmail', () => {
    it('should generate promo HTML containing proper styling and content', () => {
      const html = generatePromoEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain('Offre Spéciale'); // Jobsira specific text
      expect(html).toContain('Pourquoi en profiter maintenant ?'); // Advantage list
    });
  });

  describe('generateMinimalEmail', () => {
    it('should generate minimal transactional HTML', () => {
      const html = generateMinimalEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain("L'équipe JobSira");
    });
  });

  describe('generateArtlistEmail', () => {
    it('should generate dark premium HTML inspired by Artlist', () => {
      const html = generateArtlistEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain('Nouveauté Live');
      expect(html).toContain('L\'Innovateur 3.0');
    });
  });

  describe('generateDreamforceEmail', () => {
    it('should generate tech event HTML inspired by Dreamforce', () => {
      const html = generateDreamforceEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain('Édition Spéciale');
      expect(html).toContain('Tout Jobsira. Sans compromis.');
    });
  });

  describe('getHtmlForTemplate (Switch)', () => {
    it('should return promo template when templateId is "promo"', () => {
      const promoHtml = generatePromoEmail(mockProps);
      const result = getHtmlForTemplate('promo', mockProps);
      expect(result).toEqual(promoHtml);
    });

    it('should return minimal template when templateId is "minimal"', () => {
      const minHtml = generateMinimalEmail(mockProps);
      const result = getHtmlForTemplate('minimal', mockProps);
      expect(result).toEqual(minHtml);
    });

    it('should return artlist template when templateId is "artlist"', () => {
      const artlistHtml = generateArtlistEmail(mockProps);
      const result = getHtmlForTemplate('artlist', mockProps);
      expect(result).toEqual(artlistHtml);
    });

    it('should return dreamforce template when templateId is "dreamforce"', () => {
      const dreamHtml = generateDreamforceEmail(mockProps);
      const result = getHtmlForTemplate('dreamforce', mockProps);
      expect(result).toEqual(dreamHtml);
    });

    it('should return announcement template as default', () => {
      const annHtml = generateAnnouncementEmail(mockProps);
      const result1 = getHtmlForTemplate('annonce', mockProps);
      const result2 = getHtmlForTemplate('invalid_template', mockProps);
      
      expect(result1).toEqual(annHtml);
      expect(result2).toEqual(annHtml);
    });
  });
});
