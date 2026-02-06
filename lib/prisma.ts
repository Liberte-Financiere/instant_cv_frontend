import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

import { cvSchema } from './schemas';

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  const client = new PrismaClient({ adapter });
  
  return client.$extends({
    result: {
      cV: {
        content: {
          needs: { content: true },
          compute(cv) {
            // Automatically validate and type the content JSON on read
            const validation = cvSchema.safeParse(cv.content);
            if (validation.success) {
              return validation.data;
            }
            // If validation fails, return raw content cast as any (or handling error)
            // This ensures TypeScript sees it as 'CV' but runtime keeps data intact
            console.error(`[Prisma Extension] Invalid CV content for ID ${cv.id}`);
            return cv.content as any; 
          },
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma_new: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma_new ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new = prisma;
