import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🧠 تأكيد إن اللي بيطلب OWNER فقط
  if (!session || (session.user as any).role !== Role.OWNER) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 🔍 رجّع آخر 100 عملية من جدول Log
  const logs = await prisma.log.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ logs });
}
