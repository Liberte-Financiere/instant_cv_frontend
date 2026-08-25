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

    // 1. Extraire et nettoyer les emails du CSV
    const incomingEmails = students
      .map((s: any) => (s.email || '').trim().toLowerCase())
      .filter((e: string) => e && e.includes('@'));

    // 2. Ne chercher que ces emails dans la base (Évite de charger 10 000 anciens emails en RAM)
    // On ne bloque l'import QUE si l'invitation est PENDING, ou si elle est ACCEPTED et que l'élève est toujours dans l'école.
    const existingInvitations = await prisma.schoolInvitation.findMany({
      where: {
        schoolId: user.schoolId,
        email: { in: incomingEmails },
        status: { in: ['PENDING', 'ACCEPTED'] }
      },
      include: {
        acceptedByUser: { select: { schoolId: true } }
      }
    });
    
    const activeEmails = new Set(
      existingInvitations
        .filter(inv => {
          if (inv.status === 'PENDING') return true;
          // Si ACCEPTED, on bloque uniquement si l'utilisateur est toujours rattaché à l'école.
          // S'il a été expulsé (schoolId !== user.schoolId), on permet la ré-invitation.
          if (inv.status === 'ACCEPTED' && inv.acceptedByUser?.schoolId === user.schoolId) return true;
          return false;
        })
        .map(inv => inv.email?.toLowerCase())
    );

    const invitationsToCreate = [];
    const csvRows = ['email,nom,prenom,code'];
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    let createdCount = 0;
    let ignoredCount = 0;

    for (const student of students) {
        const email = (student.email || '').trim().toLowerCase();
        const nom = (student.nom || '').trim();
        const prenom = (student.prenom || '').trim();

        if (!email || !email.includes('@')) {
             ignoredCount++;
             continue; 
        }

        if (activeEmails.has(email)) {
             ignoredCount++;
             continue; // Déjà invité ou actuellement dans l'école
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
        activeEmails.add(email); // prevent duplicates in the same file
        createdCount++;
    }

    if (invitationsToCreate.length > 0) {
        // Enregistrer en DB (sans skipDuplicates puisque l'on autorise l'historique multiple)
        await prisma.schoolInvitation.createMany({
            data: invitationsToCreate as any
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
