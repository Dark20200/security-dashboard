export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { OWNERS } from "@/lib/authorizedUsers";

export async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  const PUBLIC_PATHS = [
    "/",
    "/api/login",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/public",
  ];

  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const cookies = req.headers.get("cookie") || "";
  const token = cookies.match(/auth=([^;]+)/)?.[1];

  if (!token) {
    console.log("❌ مفيش توكن");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };

    // تأكيد وجود اليوزر
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.log("⛔ اليوزر مش موجود");
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("auth");
      return res;
    }

    // تأكيد إن اليوزر لسه Owner
    if (!OWNERS.includes(decoded.userId)) {
      console.log("⛔ اليوزر مش Owner");
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("auth");
      return res;
    }

    return NextResponse.next();
  } catch (err) {
    console.log("JWT Error ❌", err);
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("auth");
    return res;
  }
}
