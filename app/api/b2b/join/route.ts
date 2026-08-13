import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: "Code d'invitation requis" }, { status: 400 });
    }

    // 1. Hasher le code fourni par l'utilisateur pour le comparer avec la base
    const codeHash = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    // 2. Vérifier si l'utilisateur est déjà dans une école
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    
    if (user?.schoolId) {
      return NextResponse.json({ 
        error: "Votre compte est déjà rattaché à un établissement." 
      }, { status: 403 });
    }

    // 3. Mise à jour transactionnelle stricte pour prévenir les conditions de course (Race Conditions)
    const result = await prisma.$transaction(async (tx) => {
      // On cherche l'invitation avec le hash, et qui est strictement PENDING
      const invitation = await tx.schoolInvitation.findFirst({
        where: { 
          codeHash: codeHash,
          status: 'PENDING'
        },
        include: { school: true }
      });

      if (!invitation) {
        throw new Error("INVALID_CODE"); // Code invalide, expiré, révoqué ou déjà utilisé
      }

      if (!invitation.school.isActive) {
        throw new Error("SCHOOL_INACTIVE");
      }

      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        // Optionnel: on pourrait marquer le status à EXPIRED ici
        throw new Error("CODE_EXPIRED");
      }

      // Mise à jour de l'invitation de manière atomique
      // Le fait de filtrer par 'PENDING' dans le findFirst + la transaction 
      // assure qu'on est le seul à accepter ce code.
      await tx.schoolInvitation.update({
        where: { id: invitation.id },
        data: { 
          status: 'ACCEPTED',
          usedAt: new Date(),
          acceptedByUserId: session.user.id
        }
      });

      // On lie l'utilisateur à l'école
      await tx.user.update({
        where: { id: session.user.id },
        data: { 
          schoolId: invitation.schoolId
        }
      });

      return invitation.school.name;
    });

    return NextResponse.json({ 
      success: true, 
      message: `Bienvenue ! Vous êtes maintenant rattaché à ${result}.`
    });

  } catch (error: any) {
    console.error("[JOIN_SCHOOL_ERROR]", error);
    
    if (error.message === "INVALID_CODE") {
      return NextResponse.json({ error: "Code d'invitation invalide, déjà utilisé ou révoqué." }, { status: 404 });
    }
    if (error.message === "CODE_EXPIRED") {
      return NextResponse.json({ error: "Ce code d'invitation a expiré." }, { status: 403 });
    }
    if (error.message === "SCHOOL_INACTIVE") {
      return NextResponse.json({ error: "L'établissement associé est inactif." }, { status: 403 });
    }

    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
