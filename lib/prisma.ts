import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("La variable d'environnement DATABASE_URL est manquante.");
  }

  // 1. On crée un pool de connexion Node-Postgres natif adapté pour un VPS persistant
  const pool = new Pool({ 
    connectionString,
    max: process.env.NODE_ENV === 'production' ? 20 : 2, // Partagé entre toutes les requêtes du process (limité en dev pour éviter la saturation)
    idleTimeoutMillis: 30000,   // Ferme les connexions inactives après 30s
    connectionTimeoutMillis: 10000, // Timeout de connexion après 10s
  });
  // 2. On crée l'adaptateur requis par Prisma 7
  const adapter = new PrismaPg(pool);

  // 3. On injecte l'adaptateur dans le constructeur
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma_new: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma_new ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new = prisma;
