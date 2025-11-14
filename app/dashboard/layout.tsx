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

  /* ================================
       🔥 Cyber Glow Loader
  ================================= */
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0b0d]">
        <div className="flex flex-col items-center">
          {/* النص المتوهّج */}
          <span
            className="
              text-purple-400
              text-xl
              font-semibold
              animate-pulse
              drop-shadow-[0_0_12px_rgba(124,58,237,0.75)]
            "
          >
            Initializing dashboard...
          </span>

          {/* اللودر الدائري */}
          <div
            className="
              mt-4 w-10 h-10 
              rounded-full 
              border-2 
              border-purple-500 
              border-t-transparent 
              animate-spin
              drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]
            "
          ></div>
        </div>
      </div>
    );
  }

  /* ================================
       🔥 Main Layout
  ================================= */
  return (
    <div className="flex min-h-screen w-full bg-[#0b0b0d] text-[#e5e5e5] overflow-hidden">
      {/* Sidebar ثابت */}
      <Sidebar />

      {/* محتوى رئيسي */}
      <main className="flex-1 min-h-screen w-full overflow-y-auto bg-transparent p-0 m-0">
        {children}
      </main>
    </div>
  );
}
