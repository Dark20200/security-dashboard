"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session) {
      router.replace("/");
      return;
    }

    const role = (session.user as any)?.role;
    if (role === "PENDING") router.replace("/request-pending");

    setName(session.user?.name || "");
    setImage(session.user?.image || "");
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="text-yellow-400 p-4">Loading...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      if (!res.ok) throw new Error("Failed");
      // حدّث session عشان ينعكس الاسم/الصورة فورًا
      await update();
      setMsg("✅ Saved successfully");
    } catch (e) {
      setMsg("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Name</label>
          <input
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Avatar URL</label>
          <input
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 outline-none"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
          {image ? (
            <img
              src={image}
              alt="avatar"
              className="mt-3 h-16 w-16 rounded-full border border-gray-700 object-cover"
              onError={(e) => ((e.currentTarget as any).style.display = "none")}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded ${
              saving ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Logout
          </button>
        </div>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  );
}
