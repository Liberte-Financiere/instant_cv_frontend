import { prisma } from './lib/prisma';
import { generateEmbedding } from './lib/ai/embeddings';

async function checkDistance() {
  const query = "architecte cloud";
  const vector = await generateEmbedding(query);
  const vectorString = `[${vector.join(',')}]`;

  const results = await prisma.$queryRawUnsafe<Array<{id: string, distance: number}>>(
    `SELECT "id", ("embedding" <=> '${vectorString}'::vector) as distance FROM "CandidateProfile" WHERE "isActive" = true`
  );
  console.log("Distance for 'architecte cloud':", results);
}

checkDistance().finally(() => prisma.$disconnect());
