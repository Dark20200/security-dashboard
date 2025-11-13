import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/* ✅ GET: يرجّع كل المستخدمين (ماعدا الـ OWNER) */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== Role.OWNER) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { NOT: { role: Role.OWNER } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      lastLogin: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ users });
}

/* ✅ POST: تنفيذ ban / unban / revoke + تسجيل Log */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // تأكد إن اللي بيطلب OWNER فقط
  if (!session || (session.user as any).role !== Role.OWNER) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id, action } = await req.json();

  if (!id || !action) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const actorId = (session.user as any).id; // اللي نفّذ الأكشن

  try {
    if (action === "ban") {
      await prisma.user.update({
        where: { id },
        data: { banned: true },
      });
      await prisma.log.create({
        data: {
          userId: id,
          action: "User banned",
          performedBy: actorId,
        },
      });
    } else if (action === "unban") {
      await prisma.user.update({
        where: { id },
        data: { banned: false },
      });
      await prisma.log.create({
        data: {
          userId: id,
          action: "User unbanned",
          performedBy: actorId,
        },
      });
    } else if (action === "revoke") {
      await prisma.user.update({
        where: { id },
        data: { role: Role.PENDING },
      });
      await prisma.log.create({
        data: {
          userId: id,
          action: "Access revoked",
          performedBy: actorId,
        },
      });
    } else {
      return NextResponse.json({ error: "unknown_action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
