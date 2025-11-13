import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/* ✅ عرض الـ Logs للـ OWNER فقط */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== Role.OWNER) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const logs = await prisma.log.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100, // آخر 100 عملية
  });

  return NextResponse.json({ logs });
}
