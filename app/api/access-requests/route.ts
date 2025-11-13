import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role, RequestStatus } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🔒 السماح فقط للأونر
  if (!session || (session.user as any).role !== Role.OWNER)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // 📥 جلب كل الطلبات المعلقة
  const reqs = await prisma.accessRequest.findMany({
    where: { status: RequestStatus.PENDING },
    include: {
      user: { select: { id: true, name: true, image: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reqs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // 🔒 السماح فقط للأونر
  if (!session || (session.user as any).role !== Role.OWNER)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id, action } = await req.json();

  // 🔍 تأكد الطلب موجود
  const reqRow = await prisma.accessRequest.findUnique({ where: { id } });
  if (!reqRow)
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (action === "approve") {
    // ✅ الموافقة على المستخدم
    await prisma.user.update({
      where: { id: reqRow.userId },
      data: { role: Role.ADMIN }, // 🟡 بدل APPROVED بـ ADMIN
    });

    await prisma.accessRequest.update({
      where: { id },
      data: { status: RequestStatus.APPROVED },
    });
  } else {
    // ❌ الرفض
    await prisma.accessRequest.update({
      where: { id },
      data: { status: RequestStatus.REJECTED },
    });
  }

  return NextResponse.json({ ok: true });
}
