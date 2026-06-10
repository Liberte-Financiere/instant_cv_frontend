import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        jobTitle: true,
        sector: true,
        acceptsMarketing: true,
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { firstName, lastName, phone, jobTitle, sector, acceptsMarketing } = await req.json();

    // Prepare update data
    const updateData: any = {};
    if (firstName || lastName) {
        updateData.name = `${firstName || ''} ${lastName || ''}`.trim();
    }
    
    // Validate length to avoid saving empty strings as valid data if preferred
    if (phone !== undefined) updateData.phone = phone;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (sector !== undefined) updateData.sector = sector;
    if (acceptsMarketing !== undefined) updateData.acceptsMarketing = acceptsMarketing;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        jobTitle: updatedUser.jobTitle,
        sector: updatedUser.sector,
        acceptsMarketing: updatedUser.acceptsMarketing,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}
