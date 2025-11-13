// app/requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Req = { id: string; userId: string; user: { name: string | null; image: string | null } };

export default function RequestsPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Req[]>([]);
  const isOwner = (session?.user as any)?.role === "OWNER";

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!isOwner) return;
    fetch("/api/access-requests").then(r => r.json()).then(setItems);
  }, [status, isOwner]);

  if (status === "loading") return null;
  if (!isOwner) return <div className="min-h-screen flex items-center justify-center text-red-400">غير مصرح</div>;

  const act = async (id: string, action: "approve" | "reject") => {
    await fetch("/api/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setItems(prev => prev.filter(x => x.id !== id));
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">طلبات الدخول</h1>
      <div className="space-y-4">
        {items.length === 0 && <div className="text-gray-400">لا توجد طلبات حالياً</div>}
        {items.map((r) => (
          <div key={r.id} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {r.user.image && <img src={r.user.image} className="w-10 h-10 rounded-full" />}
              <div>
                <div className="font-semibold">{r.user.name ?? r.userId}</div>
                <div className="text-xs text-gray-400">{r.userId}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => act(r.id, "approve")} className="px-3 py-2 rounded-lg bg-green-500 text-black">قبول</button>
              <button onClick={() => act(r.id, "reject")} className="px-3 py-2 rounded-lg bg-red-500 text-black">رفض</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
