import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const VALID_CATEGORIES = ['SERVER', 'SUBSCRIPTION', 'DOMAIN', 'API', 'OTHER'] as const;
const VALID_CURRENCIES = ['FCFA', 'EUR', 'USD'] as const;
const VALID_FREQUENCIES = ['MONTHLY', 'YEARLY', 'ONE_TIME'] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, category, amount, currency, frequency, isActive, startDate, endDate, notes } = body;

    // Construire uniquement les champs modifiés
    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Le nom ne peut pas être vide.' }, { status: 400 });
      }
      data.name = name.trim();
    }
    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json({ error: 'Catégorie invalide.' }, { status: 400 });
      }
      data.category = category;
    }
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json({ error: 'Montant invalide.' }, { status: 400 });
      }
      data.amount = amount;
    }
    if (currency !== undefined) {
      if (!VALID_CURRENCIES.includes(currency)) {
        return NextResponse.json({ error: 'Devise invalide.' }, { status: 400 });
      }
      data.currency = currency;
    }
    if (frequency !== undefined) {
      if (!VALID_FREQUENCIES.includes(frequency)) {
        return NextResponse.json({ error: 'Fréquence invalide.' }, { status: 400 });
      }
      data.frequency = frequency;
    }
    if (typeof isActive === 'boolean') {
      data.isActive = isActive;
      if (!isActive && !endDate) {
        data.endDate = new Date();
      }
    }
    if (startDate !== undefined) {
      data.startDate = new Date(startDate);
    }
    if (endDate !== undefined) {
      data.endDate = endDate ? new Date(endDate) : null;
    }
    if (notes !== undefined) {
      data.notes = notes?.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucun champ à modifier.' }, { status: 400 });
    }

    const updated = await prisma.businessExpense.update({
      where: { id },
      data,
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
        notes: true
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Dépense introuvable.' }, { status: 404 });
    }
    console.error('[ADMIN_EXPENSES_PATCH]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.businessExpense.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Dépense introuvable.' }, { status: 404 });
    }
    console.error('[ADMIN_EXPENSES_DELETE]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
