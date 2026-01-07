import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize PrismaClient only if DATABASE_URL is set
// This prevents build errors on Vercel when DATABASE_URL is not available during static generation
export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL ? new PrismaClient() : ({} as PrismaClient))

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

