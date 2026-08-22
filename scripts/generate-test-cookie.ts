import { encode } from 'next-auth/jwt';
import * as dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

function getArgValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return undefined;
}

async function main() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error('Erreur: AUTH_SECRET ou NEXTAUTH_SECRET manquant dans les variables d\'environnement.');
    process.exit(1);
  }

  const args = process.argv.slice(2);

  const { prisma } = await import('../lib/prisma');

  const isProd = args.includes('--prod') || process.env.NODE_ENV === 'production';
  const emailArg = getArgValue(args, '--email') || args.find(a => a.includes('@')) || 'test-school@jobsira.com';
  const userIdArg = getArgValue(args, '--userId') || `test-user-${Date.now()}`;
  const schoolIdArg = getArgValue(args, '--schoolId') || 'test-school-id';
  
  let role = 'USER';
  if (args.includes('--admin')) role = 'ADMIN';
  else if (args.includes('--school') || args.includes('--school-admin')) role = 'SCHOOL_ADMIN';
  const customRole = getArgValue(args, '--role');
  if (customRole) role = customRole;

  const actualSchoolId = role === 'SCHOOL_ADMIN' || args.includes('--with-school') ? schoolIdArg : undefined;

  // 1. Inserer l'utilisateur dans la base de données pour que les API ne renvoient pas 403
  console.log('Synchronisation de l\'utilisateur dans la base de données...');
  try {
    // Si c'est une école, s'assurer que l'école existe pour éviter une erreur de clé étrangère
    if (actualSchoolId) {
      await prisma.school.upsert({
        where: { id: actualSchoolId },
        update: {},
        create: {
          id: actualSchoolId,
          name: 'École Test K6',
          slug: `ecole-test-k6-${Date.now()}`,
          isActive: true
        }
      });
      
      // Assurer qu'il y a un wallet
      await prisma.schoolCreditWallet.upsert({
        where: { schoolId: actualSchoolId },
        update: {},
        create: {
          schoolId: actualSchoolId,
          balance: 10000,
          totalBought: 10000,
          totalUsed: 0
        }
      });
    }

    await prisma.user.upsert({
      where: { id: userIdArg },
      update: {
        role: role as any,
        schoolId: actualSchoolId,
        email: emailArg,
      },
      create: {
        id: userIdArg,
        name: 'Utilisateur Test Charge',
        email: emailArg,
        role: role as any,
        schoolId: actualSchoolId,
      }
    });
    console.log('✅ Utilisateur synchronisé en base de données.');
  } catch (dbError) {
    console.error('⚠️ Attention: Impossible de créer l\'utilisateur en base de données. Les requêtes pourraient échouer avec 403/404.', dbError);
  }

  const tokenPayload = {
    sub: userIdArg,
    email: emailArg,
    role,
    schoolId: actualSchoolId,
    name: 'Utilisateur Test Charge',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
  };

  const salt = isProd ? '__Secure-authjs.session-token' : 'authjs.session-token';

  try {
    const token = await encode({
      token: tokenPayload,
      secret,
      salt,
    });

    console.log('\n--- Cookie de session NextAuth généré ---');
    console.log(`User ID  : ${userIdArg}`);
    console.log(`Email    : ${emailArg}`);
    console.log(`Rôle     : ${role}`);
    console.log(`SchoolId : ${tokenPayload.schoolId || 'N/A'}`);
    console.log(`Mode     : ${isProd ? 'Production / HTTPS (__Secure-)' : 'Local / HTTP'}`);
    console.log('-----------------------------------------');
    console.log(`\nFormat pour variable d'environnement k6 :`);
    console.log(`${salt}=${token}\n`);

  } catch (error) {
    console.error('Erreur lors de la génération du cookie:', error);
    process.exit(1);
  }
}

main();
