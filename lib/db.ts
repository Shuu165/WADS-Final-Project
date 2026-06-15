import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient | null = null;

function createPrismaClient() {
  if (prisma) return prisma;
  
  const adapter = new PrismaPg({ 
    connectionString: process.env.DIRECT_URL ?? "postgresql://placeholder",
  });
  prisma = new PrismaClient({ adapter });
  return prisma;
}

export const db = {
  get course() { return createPrismaClient().course; },
  get unit() { return createPrismaClient().unit; },
  get lesson() { return createPrismaClient().lesson; },
  get challenge() { return createPrismaClient().challenge; },
  get challengeOption() { return createPrismaClient().challengeOption; },
  get challengeProgress() { return createPrismaClient().challengeProgress; },
  get userProgress() { return createPrismaClient().userProgress; },
  get userSubscription() { return createPrismaClient().userSubscription; },
  $disconnect() { return createPrismaClient().$disconnect(); },
};