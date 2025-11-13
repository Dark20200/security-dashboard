import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/* ✅ إحصائيات المستخدمين */
export async function GET() {
  const total = await prisma.user.count();
  const admins = await prisma.user.count({ where: { role: Role.ADMIN } });
  const pending = await prisma.user.count({ where: { role: Role.PENDING } });
  const banned = await prisma.user.count({ where: { banned: true } });

  return NextResponse.json({ total, admins, pending, banned });
}
