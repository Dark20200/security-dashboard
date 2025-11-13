"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, Activity, Settings, Lock, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: <Shield size={18} /> },
    { name: "Users", href: "/dashboard/users", icon: <Users size={18} /> },
    { name: "Logs", href: "/dashboard/logs", icon: <Activity size={18} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
    { name: "Access Requests", href: "/dashboard/requests", icon: <Lock size={18} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0e0e11] border-r border-white/10 text-[#e5e5e5] p-6 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center">
          <Shield className="text-purple-400" size={20} />
        </div>
        <h1 className="text-lg font-semibold text-purple-400">List Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                active
                  ? "bg-purple-600/30 text-purple-300 border border-purple-600/40 shadow-sm shadow-purple-800/40"
                  : "hover:bg-white/5 hover:text-purple-300"
              }`}
            >
              {link.icon}
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-8 border-t border-white/10 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-red-400 transition"
        >
          <LogOut size={16} />
          Logout
        </button>

        <p className="mt-4 text-xs text-white/30">© {new Date().getFullYear()} 1.drk Security</p>
      </div>
    </aside>
  );
}
