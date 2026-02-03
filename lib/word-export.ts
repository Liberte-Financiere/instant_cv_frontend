import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import type { CV } from '@/types/cv';

/**
 * Export CV data to a Word document
 */
export async function exportToWord(cv: CV): Promise<void> {
  const { personalInfo, experiences, education, skills, languages, certifications, projects, references, hobbies, divers } = cv;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header - Name
        new Paragraph({
          text: `${personalInfo.firstName} ${personalInfo.lastName}`,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        
        // Title
        new Paragraph({
          text: personalInfo.title,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: personalInfo.title,
              italics: true,
              size: 24,
            }),
          ],
        }),

        // Contact Info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: personalInfo.email || '', size: 20 }),
            new TextRun({ text: personalInfo.email && personalInfo.phone ? ' | ' : '', size: 20 }),
            new TextRun({ text: personalInfo.phone || '', size: 20 }),
            new TextRun({ text: (personalInfo.email || personalInfo.phone) && personalInfo.address ? ' | ' : '', size: 20 }),
            new TextRun({ text: personalInfo.address || '', size: 20 }),
          ],
        }),

        // Summary
        ...(personalInfo.summary ? [
          new Paragraph({
            text: 'PROFIL',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: personalInfo.summary,
            spacing: { after: 300 },
          }),
        ] : []),

        // Experience
        ...(experiences.length > 0 ? [
          new Paragraph({
            text: 'EXPÉRIENCE PROFESSIONNELLE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...experiences.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true, size: 24 }),
                new TextRun({ text: ` - ${exp.company}`, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.startDate || ''} - ${exp.current ? 'Présent' : exp.endDate || ''}`, italics: true, size: 20 }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: exp.description || '',
              spacing: { after: 200 },
            }),
          ]),
        ] : []),

        // Education
        ...(education.length > 0 ? [
          new Paragraph({
            text: 'FORMATION',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...education.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.degree} - ${edu.field}`, bold: true, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution, size: 22 }),
                new TextRun({ text: ` | ${edu.startDate || ''} - ${edu.endDate || ''}`, italics: true, size: 20 }),
              ],
              spacing: { after: 200 },
            }),
          ]),
        ] : []),

        // Skills
        ...(skills.length > 0 ? [
          new Paragraph({
            text: 'COMPÉTENCES',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: skills.map(s => s.name).join(' • '),
            spacing: { after: 200 },
          }),
        ] : []),

        // Certifications
        ...((certifications || []).length > 0 ? [
          new Paragraph({
            text: 'CERTIFICATIONS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...(certifications || []).map((cert) => new Paragraph({
            children: [
              new TextRun({ text: cert.name, bold: true }),
              new TextRun({ text: ` - ${cert.organization}` }),
              new TextRun({ text: cert.date ? ` (${cert.date})` : '', italics: true }),
            ],
            spacing: { after: 100 },
          })),
        ] : []),

        // Projects
        ...((projects || []).length > 0 ? [
          new Paragraph({
            text: 'PROJETS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...(projects || []).flatMap((project) => [
            new Paragraph({
              children: [
                new TextRun({ text: project.name, bold: true }),
              ],
            }),
            new Paragraph({
              text: project.description || '',
              spacing: { after: 100 },
            }),
            ...(project.technologies ? [new Paragraph({
              children: [
                new TextRun({ text: 'Technologies: ', italics: true }),
                new TextRun({ text: project.technologies }),
              ],
              spacing: { after: 200 },
            })] : []),
          ]),
        ] : []),

        // Languages
        ...(languages.length > 0 ? [
          new Paragraph({
            text: 'LANGUES',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...languages.map((lang) => new Paragraph({
            text: `${lang.name} - ${lang.level}`,
            spacing: { after: 100 },
          })),
        ] : []),

        // Hobbies
        ...((hobbies || []).length > 0 ? [
          new Paragraph({
            text: "CENTRES D'INTÉRÊT",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: (hobbies || []).map(h => h.name).join(' • '),
            spacing: { after: 200 },
          }),
        ] : []),

        // References
        ...((references || []).length > 0 ? [
          new Paragraph({
            text: 'RÉFÉRENCES',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          ...(references || []).map((ref) => new Paragraph({
            children: [
              new TextRun({ text: ref.name, bold: true }),
              new TextRun({ text: ` - ${ref.position} chez ${ref.company}` }),
            ],
            spacing: { after: 100 },
          })),
        ] : []),

        // Divers
        ...(divers ? [
          new Paragraph({
            text: 'INFORMATIONS COMPLÉMENTAIRES',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: divers,
            spacing: { after: 200 },
          }),
        ] : []),
      ],
    }],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.firstName}_${personalInfo.lastName}_CV.docx`);
}
