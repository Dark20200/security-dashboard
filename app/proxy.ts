export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { OWNERS } from "@/lib/authorizedUsers";


export async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  const PUBLIC_PATHS = ["/", "/api/login", "/api/auth", "/_next", "/favicon.ico", "/public"];

  // ✅ سيب الصفحات العامة
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    console.log("🧠 Decoded userId:", decoded.userId);

    const found = await prisma.token.findUnique({ where: { token } });
    if (!found || found.userId !== decoded.userId) {
      console.log("⛔ التوكن مش صالح");
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("auth");
      return res;
    }

    if (!OWNERS.includes(decoded.userId)) {
      console.log("⛔ المستخدم اتشال من authorizedUsers.ts");
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
