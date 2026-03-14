import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

import { cvSchema } from './schemas';

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  const client = new PrismaClient({ adapter });
  
  return client;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma_new: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma_new ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new = prisma;
