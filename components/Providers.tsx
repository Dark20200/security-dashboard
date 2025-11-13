"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // بس بيوفّر SessionProvider للتطبيق كله
  return <SessionProvider>{children}</SessionProvider>;
}
