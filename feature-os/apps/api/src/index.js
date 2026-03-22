/**
 * Phase 1 stub — wire Prisma client + CRUD routes here.
 * Prefer validation + storage before "magical" AI endpoints.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const n = await prisma.feature.count().catch(() => -1);
  console.log("[feature-os api] Feature count:", n, "(use prisma db push + seed)");
}

main().finally(() => prisma.$disconnect());
