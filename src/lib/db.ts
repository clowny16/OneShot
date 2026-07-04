import { PrismaClient } from '@prisma/client'
import path from 'path'

// Dynamically resolve SQLite database path relative to process.cwd()
const dbPath = path.join(process.cwd(), 'prisma', 'custom.db')
const databaseUrl = `file:${dbPath}`

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db