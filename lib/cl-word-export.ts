import { saveAs } from 'file-saver';
import type { CoverLetter } from '@/types/cover-letter';

/**
 * Export Cover Letter data to a Word document
 */
export async function exportCoverLetterToWord(cl: CoverLetter): Promise<void> {
  const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } = await import('docx');

  const { content } = cl;
  const { sender, recipient, details } = content;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Sender Info
        new Paragraph({
          children: [
            new TextRun({ text: `${sender.firstName} ${sender.lastName}`, bold: true, size: 28 }),
          ],
        }),
        new Paragraph({ text: sender.address }),
        new Paragraph({ text: sender.phone }),
        new Paragraph({ text: sender.email, spacing: { after: 400 } }),

        // Recipient Info
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: recipient.company, bold: true }),
          ],
        }),
        new Paragraph({ alignment: AlignmentType.RIGHT, text: recipient.name }),
        new Paragraph({ alignment: AlignmentType.RIGHT, text: recipient.address, spacing: { after: 400 } }),

        // Date
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          text: `Fait à ${details.location || '...'}, le ${details.date}`,
          spacing: { after: 400 },
        }),

        // Subject
        new Paragraph({
          children: [
            new TextRun({ text: `Objet : ${details.subject}`, bold: true }),
          ],
          spacing: { after: 400 },
        }),

        // Body
        new Paragraph({ text: details.salutation, spacing: { after: 200 } }),
        ...details.body.split('\n').map(line => new Paragraph({
          text: line,
          spacing: { after: 200 },
        })),
        new Paragraph({ text: details.closing, spacing: { before: 200, after: 800 } }),

        // Signature Name
        new Paragraph({
          children: [
            new TextRun({ text: `${sender.firstName} ${sender.lastName}`, bold: true }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${cl.title.replace(/\s+/g, '_')}.docx`);
}
