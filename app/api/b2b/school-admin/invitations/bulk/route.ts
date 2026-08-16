import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 9; i++) {
    if (i > 0 && i % 3 === 0) result += '-';
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    });

    if (!user || user.role !== 'SCHOOL_ADMIN' || !user.schoolId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { students } = await req.json();

    if (!Array.isArray(students)) {
      return NextResponse.json({ error: 'Invalid payload, expected array of students' }, { status: 400 });
    }

    if (students.length === 0) {
      return NextResponse.json({ error: 'No students provided' }, { status: 400 });
    }

    if (students.length > 500) {
      return NextResponse.json({ error: 'Maximum 500 students per import' }, { status: 400 });
    }

    // Rate Limiting : Check if last import was < 5 mins ago
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentImportsCount = await prisma.schoolInvitation.count({
      where: {
        schoolId: user.schoolId,
        createdAt: { gte: fiveMinsAgo }
      }
    });

    if (recentImportsCount > 1000) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    // Fetch existing invitations to prevent duplicates
    const existingInvitations = await prisma.schoolInvitation.findMany({
      where: {
        schoolId: user.schoolId,
      },
      select: { email: true }
    });
    const existingEmails = new Set(existingInvitations.map(inv => inv.email?.toLowerCase()));

    const invitationsToCreate = [];
    const csvRows = ['email,nom,prenom,code'];
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    let createdCount = 0;
    let ignoredCount = 0;

    for (const student of students) {
        const email = (student.email || '').trim();
        const nom = (student.nom || '').trim();
        const prenom = (student.prenom || '').trim();

        if (!email || !email.includes('@')) {
             ignoredCount++;
             continue; 
        }

        if (existingEmails.has(email.toLowerCase())) {
             ignoredCount++;
             continue; // Already invited
        }

        const rawCode = generateRandomCode();
        const hashedCode = hashString(rawCode);

        invitationsToCreate.push({
            schoolId: user.schoolId,
            email: email,
            firstName: prenom,
            lastName: nom,
            codeHash: hashedCode,
            emailCode: rawCode, // Temporaire pour l'envoi de mail
            status: 'PENDING',
            emailStatus: 'QUEUED',
            expiresAt: expiresAt
        });

        // Add to return CSV (plaintext code!)
        csvRows.push(`"${email}","${nom}","${prenom}","${rawCode}"`);
        existingEmails.add(email.toLowerCase()); // prevent duplicates in the same file
        createdCount++;
    }

    if (invitationsToCreate.length > 0) {
        // Enregistrer en DB
        await prisma.schoolInvitation.createMany({
            data: invitationsToCreate as any,
            skipDuplicates: true
        });
    }

    // Return the generated CSV content
    const csvContent = csvRows.join('\n');
    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="invitations_result.csv"',
            'X-Created-Count': createdCount.toString(),
            'X-Ignored-Count': ignoredCount.toString()
        }
    });

  } catch (error) {
    console.error('Bulk invitation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
