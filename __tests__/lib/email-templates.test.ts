import { describe, it, expect } from 'vitest';
import { getHtmlForTemplate, generateAnnouncementEmail, generatePromoEmail, generateMinimalEmail, generateDreamforceEmail } from '@/lib/email-templates';

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

    it('should parse bullet points starting with - or * into html list items', () => {
      const html = generateAnnouncementEmail({
        ...mockProps,
        message: "Intro paragraph\n- Point one\n- Point two\nOutro paragraph"
      });
      expect(html).toContain('Intro paragraph');
      expect(html).toContain('<ul style="margin: 0 0 16px 0; padding-left: 20px; list-style-type: disc;');
      expect(html).toContain('<li style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #334155;">Point one</li>');
      expect(html).toContain('<li style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #334155;">Point two</li>');
      expect(html).toContain('Outro paragraph');
    });
  });

  describe('generatePromoEmail', () => {
    it('should generate promo HTML containing proper styling and content', () => {
      const html = generatePromoEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain('OFFRE FLASH'); // Jobsira specific text
    });
  });

  describe('generateMinimalEmail', () => {
    it('should generate minimal transactional HTML', () => {
      const html = generateMinimalEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain("L'équipe JobSira");
    });
  });

  describe('generateDreamforceEmail', () => {
    it('should generate tech event HTML inspired by Dreamforce', () => {
      const html = generateDreamforceEmail(mockProps);
      expect(html).toContain(mockProps.subject);
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
