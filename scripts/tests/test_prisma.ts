const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const id = 'cmpsort2m000003iwaj4k7tfs';
  console.log(`Fetching profile ${id}...`);
  try {
    console.time('fetchProfile');
    const profile = await prisma.candidateProfile.findUnique({
      where: { id },
      select: {
        id: true,
        anonymousName: true,
        title: true,
        cv: {
          select: { content: true },
        },
      },
    });
    console.timeEnd('fetchProfile');
    if (profile) {
      console.log(`Found profile: ${profile.anonymousName}, Title: ${profile.title}`);
      console.log(`CV Content size:`, JSON.stringify(profile.cv?.content || {}).length, 'bytes');
    } else {
      console.log('Profile not found.');
    }
  } catch (e) {
    console.error('Prisma error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
