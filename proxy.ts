import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // ✅ السماح الكامل للصفحات العامة
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/denied") ||
    pathname.startsWith("/request-pending") ||
    pathname === "/" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 🚫 لو مفيش تسجيل دخول
  if (!token) {
    console.log("⛔ No token found → redirect to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🚫 لو اليوزر لسه Pending → يروح صفحة الانتظار
  if (token.role === "PENDING") {
    console.log("🕓 Pending user tried to access dashboard → redirect");
    return NextResponse.redirect(new URL("/request-pending", request.url));
  }

  // ✅ المصرح لهم فقط يدخلوا
  console.log("✅ Access granted:", token.name, "| Role:", token.role);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/stats",
    "/protection",
    "/logs",
    "/requests",
  ],
};
