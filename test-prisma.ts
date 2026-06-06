import { prisma } from './lib/prisma';

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('Prisma connected successfully! User count:', userCount);
  } catch (e) {
    console.error('Error connecting to Prisma:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
