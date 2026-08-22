import { PrismaClient } from '../node_modules/@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Début du nettoyage des données de test...");

  try {
    // 1. Supprimer l'école de test (cela va supprimer en cascade tout ce qui est lié à cette école,
    // MAIS on le fait via Prisma pour être super safe).
    // On cherche les écoles dont le slug commence par "ecole-test-k6"
    const testSchools = await prisma.school.findMany({
      where: {
        slug: {
          startsWith: 'ecole-test-k6'
        }
      }
    });

    const testSchoolIds = testSchools.map(s => s.id);

    if (testSchoolIds.length > 0) {
      // 1. Supprimer manuellement les transactions (car pas de onDelete: Cascade)
      const deletedTxs = await prisma.schoolCreditTransaction.deleteMany({
        where: { schoolId: { in: testSchoolIds } }
      });
      console.log(`✅ ${deletedTxs.count} transactions supprimées.`);
    }

    // 2. Supprimer les utilisateurs de test
    const emailsToDelete = [
      'loadtest-student@ecole.fr',
      'loadtest-admin@ecole.fr'
    ];

    for (const email of emailsToDelete) {
      try {
        await prisma.user.delete({
          where: { email }
        });
        console.log(`✅ Utilisateur supprimé : ${email}`);
      } catch (e) {
        // Ignorer si n'existe pas
      }
    }

    // 3. Enfin, on peut supprimer l'école (le wallet, memberships, invitations seront supprimés en cascade)
    for (const school of testSchools) {
      await prisma.school.delete({
        where: { id: school.id }
      });
      console.log(`✅ École supprimée : ${school.slug}`);
    }

    console.log("🎉 Nettoyage terminé avec succès ! Ta base de données de production est propre.");

  } catch (error) {
    console.error("❌ Erreur pendant le nettoyage :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
