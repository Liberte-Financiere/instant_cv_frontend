import { describe, it, expect } from 'vitest';
import { getHtmlForTemplate, generateAnnouncementEmail, generatePromoEmail, generateMinimalEmail } from '../lib/email-templates';

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
      expect(html).toContain('Propulsé par l\'IA'); // Jobsira specific text
      expect(html).toContain('01.'); // Advantage list
    });
  });

  describe('generateMinimalEmail', () => {
    it('should generate minimal transactional HTML', () => {
      const html = generateMinimalEmail(mockProps);
      expect(html).toContain(mockProps.subject);
      expect(html).toContain('Le Support Jobsira');
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

    it('should return announcement template as default', () => {
      const annHtml = generateAnnouncementEmail(mockProps);
      const result1 = getHtmlForTemplate('annonce', mockProps);
      const result2 = getHtmlForTemplate('invalid_template', mockProps);
      
      expect(result1).toEqual(annHtml);
      expect(result2).toEqual(annHtml);
    });
  });
});
