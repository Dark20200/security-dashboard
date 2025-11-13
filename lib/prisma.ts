import { PrismaClient } from "@prisma/client";

declare global {
  // 👇 كده بنمنع TypeScript error
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
