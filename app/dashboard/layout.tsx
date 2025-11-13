"use client";

import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !session) router.replace("/");
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0b0d] text-purple-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0b0b0d] text-[#e5e5e5] overflow-hidden">
      {/* Sidebar ثابت */}
      <Sidebar />

      {/* محتوى رئيسي بيمتد على الشاشة كلها */}
      <main className="flex-1 min-h-screen w-full overflow-y-auto bg-transparent p-0 m-0">
        {children}
      </main>
    </div>
  );
}
