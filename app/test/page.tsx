"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ShieldIcon({ size = 42 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="inline-block align-middle drop-shadow-[0_0_12px_rgba(124,58,237,0.55)]"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c5 4 12 6 20 7v16c0 12-8 22-20 29C20 51 12 41 12 29V13c8-1 15-3 20-7z"
        fill="url(#g1)"
      />
    </svg>
  );
}

function AnimatedBars() {
  return (
    <div className="flex items-end gap-[3px] mt-4 h-5">
      {[0.4, 0.7, 0.5, 0.8, 0.6].map((h, i) => (
        <motion.div
          key={i}
          animate={{
            height: [`${h * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8 + i * 0.2,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
          className="w-[6px] rounded-full bg-purple-400/70 shadow-[0_0_6px_rgba(168,85,247,0.6)]"
        />
      ))}
    </div>
  );
}

// ✅ الجمل المتبدلة هنا
function RotatingText() {
  const texts = [
    "Detecting potential intrusions...",
    "Scanning vulnerabilities...",
    "Monitoring live threats...",
    "Analyzing attack patterns...",
    "AI defense adapting...",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={texts[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-white/70 text-sm text-center"
        >
          {texts[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAnim, setActiveAnim] = useState(false);

  const role = (user as any)?.role || "USER";
  const roleLabel =
    role === "OWNER" ? "Owner" : role === "ADMIN" ? "Admin" : "Pending Access";

  return (
    <main
      className="relative min-h-screen text-[#e5e5e5] p-8 overflow-hidden font-[Inter]"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(124,58,237,0.1), transparent 70%), radial-gradient(circle at bottom right, rgba(88,28,135,0.2), #0b0b0d 70%)",
      }}
    >
      <div className="absolute inset-0 -z-10 animate-bg-move bg-[url('/grid.svg')] opacity-[0.05] bg-cover"></div>

      <section className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 relative">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => setTimeout(() => setActiveAnim(true), 400)}
            className={`flex items-center gap-3 text-4xl md:text-5xl font-extrabold mb-2 ${
              activeAnim ? "animated-gradient-text glow-text" : "static-gradient-text"
            }`}
          >
            Welcome back, {roleLabel}! <ShieldIcon size={44} />
          </motion.h1>

          <p className="text-white/70 max-w-xl font-medium text-[0.95rem] leading-relaxed">
            You’re in the{" "}
            <span className="text-purple-400 font-extrabold">
              Security Dashboard
            </span>{" "}
            — your central hub for <b>monitoring</b>, <b>analyzing</b>, and{" "}
            <b>managing</b> your entire system’s safety. Every detail matters
            here — logs, users, and protection layers are all under your control.
          </p>
        </div>

        {user?.image && (
          <div className="relative mt-6 md:mt-0 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full blur-xl bg-purple-600/40 ${
                menuOpen ? "" : "animate-pulse-glow"
              }`}
            />
            <img
              src={user.image}
              alt={roleLabel}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`h-16 w-16 rounded-full border-2 border-purple-500/40 shadow-lg shadow-purple-900/40 object-cover cursor-pointer transition-transform duration-500 ${
                menuOpen ? "rotate-0" : "animate-spin-slow"
              }`}
            />
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-20 right-0 bg-[#15151a]/95 border border-purple-500/30 rounded-2xl shadow-lg shadow-purple-900/40 py-3 px-4 w-44 text-sm z-20 backdrop-blur-md"
                >
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left py-1.5 px-2 rounded-md hover:bg-purple-600/20 transition text-red-400"
                  >
                    🔒 Logout
                  </button>
                  <button
                    onClick={() => alert('💡 Coming soon: User Settings')}
                    className="block w-full text-left py-1.5 px-2 rounded-md hover:bg-purple-600/20 transition text-purple-300"
                  >
                    ⚙️ Settings
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      <div className="h-px w-full bg-white/10 mb-10"></div>

      {/* Main Cards */}
      <section className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "🔒 System Status",
            body: (
              <>
                All core security modules are{" "}
                <span className="text-green-400 font-medium">active</span> and
                running flawlessly. No breaches detected in the last 24 hours.
              </>
            ),
          },
          {
            title: "👥 User Activity",
            body: (
              <>
                <span className="text-green-400 font-bold">3 Admins</span>,{" "}
                <span className="text-yellow-400 font-bold">1 Pending</span>,{" "}
                <span className="text-red-400 font-bold">0 Banned</span>.
              </>
            ),
          },
          {
            title: "📊 Last Activity",
            body: (
              <>
                Recent login via{" "}
                <span className="text-purple-300 font-medium">
                  Discord Auth
                </span>{" "}
                — IP: 192.168.1.12 · Region: Localhost 🖥️
              </>
            ),
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{
              y: -4,
              boxShadow:
                "0 0 20px rgba(124,58,237,0.3), 0 0 10px rgba(124,58,237,0.15)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-6 bg-[#15151a]/80 border border-white/10 rounded-2xl hover:border-purple-500/40 transition backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">
              {card.title}
            </h2>
            <p className="text-white/70 text-sm">{card.body}</p>
          </motion.div>
        ))}
      </section>

      {/* AI Threat Analysis Card */}
      <motion.div
        whileHover={{
          y: -4,
          boxShadow:
            "0 0 20px rgba(124,58,237,0.3), 0 0 10px rgba(124,58,237,0.15)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="p-6 bg-[#15151a]/80 border border-white/10 rounded-2xl hover:border-purple-500/40 transition backdrop-blur-sm max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold text-purple-400 mb-2">
          🧠 AI Threat Analysis
        </h2>
        {/* ✅ هنا الجملة بتتبدل */}
        <RotatingText />
        <AnimatedBars />
      </motion.div>

      <p className="mt-9 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} 1.drk Security — Stay protected, stay dark ⚡
      </p>
    </main>
  );
}
