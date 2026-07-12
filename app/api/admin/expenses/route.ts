import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const VALID_CATEGORIES = ['SERVER', 'SUBSCRIPTION', 'DOMAIN', 'API', 'OTHER'] as const;
const VALID_CURRENCIES = ['FCFA', 'EUR', 'USD'] as const;
const VALID_FREQUENCIES = ['MONTHLY', 'YEARLY', 'ONE_TIME'] as const;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const expenses = await prisma.businessExpense.findMany({
      orderBy: [
        { isActive: 'desc' },
        { category: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        category: true,
        amount: true,
        currency: true,
        frequency: true,
        isActive: true,
        startDate: true,
        endDate: true,
        notes: true,
        createdAt: true
      }
    });

    // Calcul du burn mensuel par devise (côté serveur pour ne pas surcharger le front)
    const burnByDevise: Record<string, number> = { FCFA: 0, EUR: 0, USD: 0 };

    for (const expense of expenses) {
      if (!expense.isActive) continue;

      let monthly = 0;
      switch (expense.frequency) {
        case 'MONTHLY':
          monthly = expense.amount;
          break;
        case 'YEARLY':
          monthly = expense.amount / 12;
          break;
        case 'ONE_TIME':
          // Les achats ponctuels ne comptent pas dans le burn mensuel récurrent
          break;
      }

      burnByDevise[expense.currency] = (burnByDevise[expense.currency] || 0) + monthly;
    }

    // Ventilation par catégorie (dépenses actives uniquement)
    const byCategory: Record<string, number> = {};
    for (const expense of expenses) {
      if (!expense.isActive) continue;
      byCategory[expense.category] = (byCategory[expense.category] || 0) + 1;
    }

    return NextResponse.json({
      expenses,
      kpis: {
        burnMonthly: burnByDevise,
        activeCount: expenses.filter(e => e.isActive).length,
        totalCount: expenses.length,
        byCategory
      }
    });
  } catch (error) {
    console.error('[ADMIN_EXPENSES_GET]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, amount, currency, frequency, startDate, notes } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Catégorie invalide. Valeurs acceptées : ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Le montant doit être un nombre positif.' }, { status: 400 });
    }
    if (!VALID_CURRENCIES.includes(currency)) {
      return NextResponse.json({ error: `Devise invalide. Valeurs acceptées : ${VALID_CURRENCIES.join(', ')}` }, { status: 400 });
    }
    if (!VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json({ error: `Fréquence invalide. Valeurs acceptées : ${VALID_FREQUENCIES.join(', ')}` }, { status: 400 });
    }

    const expense = await prisma.businessExpense.create({
      data: {
        name: name.trim(),
        category,
        amount,
        currency,
        frequency,
        startDate: startDate ? new Date(startDate) : new Date(),
        notes: notes?.trim() || null
      }
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_EXPENSES_POST]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
