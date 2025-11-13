// components/ui/DashboardTable.tsx
import React from "react";

export default function DashboardTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#15151a] rounded-2xl shadow-lg border border-white/10 p-4 md:p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-[#1d1d23] text-[#c7a8ff] uppercase text-xs md:text-sm tracking-wider">
              <th className="px-4 py-3 text-left font-semibold">👤 Name</th>
              <th className="px-4 py-3 text-left font-semibold">📧 Email</th>
              <th className="px-4 py-3 text-left font-semibold">🧩 Role</th>
              <th className="px-4 py-3 text-center font-semibold">🚫 Banned</th>
              <th className="px-4 py-3 text-center font-semibold">⚙ Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
