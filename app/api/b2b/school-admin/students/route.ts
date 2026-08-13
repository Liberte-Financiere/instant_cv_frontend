import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'SCHOOL_ADMIN' || !session.user.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schoolId = session.user.schoolId;

    const students = await prisma.user.findMany({
      where: { schoolId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        // Calculate consumed credits on the fly or fetch transactions if needed
        schoolCreditTransactions: {
          select: {
            amount: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const studentsWithConsumption = students.map(student => {
      const consumedCredits = student.schoolCreditTransactions.reduce((acc, tx) => {
        // Only count negative amounts as consumption
        return acc + (tx.amount.toNumber() < 0 ? Math.abs(tx.amount.toNumber()) : 0);
      }, 0);

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        joinedAt: student.createdAt,
        consumedCredits
      };
    });

    return NextResponse.json({ students: studentsWithConsumption });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_STUDENTS_GET]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'SCHOOL_ADMIN' || !session.user.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
       return NextResponse.json({ error: 'ID de l\'étudiant manquant' }, { status: 400 });
    }

    const schoolId = session.user.schoolId;

    // Verify the student belongs to this school
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student || student.schoolId !== schoolId) {
      return NextResponse.json({ error: 'Étudiant introuvable dans votre établissement' }, { status: 404 });
    }

    // Detach student
    await prisma.user.update({
      where: { id: studentId },
      data: { schoolId: null }
    });

    return NextResponse.json({ message: 'Étudiant retiré avec succès' });

  } catch (error) {
    console.error('[SCHOOL_ADMIN_STUDENTS_DELETE]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
