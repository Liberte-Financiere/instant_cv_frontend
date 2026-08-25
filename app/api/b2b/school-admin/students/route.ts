import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, schoolId: true }
    });

    if (!adminUser || adminUser.role !== 'SCHOOL_ADMIN' || !adminUser.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const schoolId = adminUser.schoolId;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const whereClause = {
      schoolId,
      role: { not: 'SCHOOL_ADMIN' as const }
    };

    const [total, students] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              cvs: true,
              coverLetters: true,
              interviewSessions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ]);

    // Fast calculation: Only load grouped sums for the students in this page
    const studentIds = students.map(s => s.id);
    let aggregations: any[] = [];
    
    if (studentIds.length > 0) {
      aggregations = await (prisma.schoolCreditTransaction as any).groupBy({
        by: ['userId'],
        where: {
          schoolId,
          userId: { in: studentIds },
          amount: { lt: 0 } // Only negative amounts are considered consumption
        },
        _sum: { amount: true }
      });
    }

    const consumptionMap = new Map(
      aggregations
        .filter(agg => agg.userId) // Ensure userId is not null
        .map(agg => [agg.userId as string, Math.abs(agg._sum.amount?.toNumber() || 0)])
    );

    const studentsWithConsumption = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,
      joinedAt: student.createdAt,
      consumedCredits: consumptionMap.get(student.id) || 0,
      cvCount: student._count.cvs,
      coverLetterCount: student._count.coverLetters,
      interviewCount: student._count.interviewSessions
    }));

    return NextResponse.json({
      students: studentsWithConsumption,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

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
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, schoolId: true }
    });

    if (!adminUser || adminUser.role !== 'SCHOOL_ADMIN' || !adminUser.schoolId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
       return NextResponse.json({ error: 'ID de l\'étudiant manquant' }, { status: 400 });
    }

    const schoolId = adminUser.schoolId;

    // Verify the student belongs to this school
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student || student.schoolId !== schoolId) {
      return NextResponse.json({ error: 'Étudiant introuvable dans votre établissement' }, { status: 404 });
    }

    if (student.role === 'SCHOOL_ADMIN') {
      return NextResponse.json({ error: 'Impossible de retirer un administrateur via cette interface' }, { status: 403 });
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
