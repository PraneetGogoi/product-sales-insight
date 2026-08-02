import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: 'file:./dev.db',
  log: ['query', 'error', 'warn']
})
