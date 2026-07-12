import { prisma } from './lib/prisma';
import { anonymizeProfile } from './lib/anonymize';

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
        isActive: true,
        cv: {
          select: { content: true },
        },
      },
    });
    console.timeEnd('fetchProfile');
    if (profile) {
      console.log(`Found profile: ${profile.anonymousName}, Title: ${profile.title}`);
      console.time('anonymize');
      const anonymized = anonymizeProfile(profile.cv?.content);
      console.timeEnd('anonymize');
      console.log('Anonymized keys:', Object.keys(anonymized));
    } else {
      console.log('Profile not found.');
    }
  } catch (e) {
    console.error('Prisma error:', e);
  } finally {
    process.exit(0);
  }
}

main();
