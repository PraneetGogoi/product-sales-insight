import { PrismaClient, Prisma } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: `file:${dbPath}`,
    log: (process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error']) as Prisma.LogLevel[],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
