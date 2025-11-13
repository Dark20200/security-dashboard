"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;

      if (role === "OWNER" || role === "ADMIN") router.replace("/dashboard");
      else if (role === "PENDING") router.replace("/request-pending");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0b0d] text-purple-400">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0b0d] text-purple-400">
        Redirecting...
      </div>
    );
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#0b0b0d] text-[#e5e5e5]">
      {/* إضاءة بنفسجية ناعمة في الخلفية */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      {/* شعار أو اسم */}
      <div className="relative text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-400 drop-shadow-[0_0_10px_#7c3aedaa]">
          🛡️ 1.drk Security Dashboard
        </h1>
        <p className="mt-3 text-white/70">
          Secure access for authorized users only
        </p>
      </div>

      {/* زرار تسجيل الدخول */}
      <button
        onClick={async () => {
          setLoading(true);
          await signIn("discord", { callbackUrl: "/dashboard" });
        }}
        disabled={loading}
        className="relative flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-purple-900/30 transition disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Logging in...
          </>
        ) : (
          <>
            <DiscordIcon />
            Login with Discord
          </>
        )}
      </button>

      {/* تذييل بسيط */}
      <p className="mt-8 text-xs text-white/40">
        © {new Date().getFullYear()} Security Dashboard
      </p>
    </main>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-white">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.2.36-.43.85-.59 1.23a17.3 17.3 0 0 0-4.0 0c-.16-.38-.39-.87-.59-1.23-1.35.23-2.66.63-3.76 1.37C3.95 7.23 3.18 10 3.35 12.72c1.4 1.05 2.75 1.69 4.06 2.11.31-.43.58-.9.81-1.39-.45-.17-.88-.38-1.29-.62.11-.09.22-.18.33-.27 2.49 1.16 5.19 1.16 7.66 0 .11.09.22.18.33.27-.41.24-.84.45-1.29.62.23.49.5.96.81 1.39 1.31-.42 2.66-1.06 4.06-2.11.27-4.07-.7-6.79-2.69-8.35zM10.1 12.89c-.75 0-1.36-.7-1.36-1.56 0-.86.6-1.56 1.36-1.56.75 0 1.36.7 1.36 1.56 0 .86-.61 1.56-1.36 1.56zm3.8 0c-.75 0-1.36-.7-1.36-1.56 0-.86.61-1.56 1.36-1.56s1.36.7 1.36 1.56c0 .86-.61 1.56-1.36 1.56z" />
    </svg>
  );
}
