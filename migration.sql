-- 1. Create missing Enums if they don't exist
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the AnalysisHistory table if it doesn't exist
CREATE TABLE IF NOT EXISTS "AnalysisHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisHistory_pkey" PRIMARY KEY ("id")
);

-- Add index and foreign key for AnalysisHistory
CREATE INDEX IF NOT EXISTS "AnalysisHistory_userId_idx" ON "AnalysisHistory"("userId");
DO $$ BEGIN
    ALTER TABLE "AnalysisHistory" ADD CONSTRAINT "AnalysisHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 3. Add all missing columns to User table
ALTER TABLE "User" 
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "jobTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "sector" TEXT,
  ADD COLUMN IF NOT EXISTS "referralCode" TEXT,
  ADD COLUMN IF NOT EXISTS "referredById" TEXT,
  ADD COLUMN IF NOT EXISTS "referralCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "premiumUntil" TIMESTAMP(3);

-- Add Unique index for User referralCode
DO $$ BEGIN
    CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- Add foreign key for referredById
DO $$ BEGIN
    ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 4. Create CreditTransaction Table if it doesn't exist
CREATE TABLE IF NOT EXISTS "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- Add index and foreign key for CreditTransaction
CREATE INDEX IF NOT EXISTS "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");
DO $$ BEGIN
    ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
