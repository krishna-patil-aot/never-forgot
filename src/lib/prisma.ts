import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

function cleanConnectionString(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function createPrismaClient(): PrismaClient {
  const rawConnectionString =
    process.env.DATABASE_URL || process.env.DIRECT_URL || "";

  const connectionString = cleanConnectionString(rawConnectionString);

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
