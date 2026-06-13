import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    // Vérification stricte du rôle ADMIN
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // 1. Récupérer les vrais paiements (Mobile Money via LigdiCash)
    const realPayments = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // 2. Récupérer les rechargements manuels (Cadeaux/Admin)
    const manualRecharges = await prisma.creditTransaction.findMany({
      where: {
        description: { startsWith: 'Recharge Manuelle' }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      realPayments,
      manualRecharges
    });

  } catch (error) {
    console.error('Erreur API Transactions HQ Ops:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
