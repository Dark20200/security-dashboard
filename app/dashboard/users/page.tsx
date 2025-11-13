"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleAction = async (id: string, action: string) => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    location.reload();
  };

  if (loading) return <div className="text-yellow-400 p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">👥 Users Management</h1>
      <table className="min-w-full border border-gray-700 text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border border-gray-700">Name</th>
            <th className="p-2 border border-gray-700">Email</th>
            <th className="p-2 border border-gray-700">Role</th>
            <th className="p-2 border border-gray-700">Banned</th>
            <th className="p-2 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center border border-gray-700">
              <td className="p-2">{u.name || "—"}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.banned ? "✅ Yes" : "❌ No"}</td>
              <td className="p-2 space-x-2">
                {/* Ban */}
                <Button
                  onClick={() => handleAction(u.id, "ban")}
                  variant="danger"
                >
                  Ban
                </Button>

                {/* Unban */}
                <Button
                  onClick={() => handleAction(u.id, "unban")}
                  variant="primary"
                >
                  Unban
                </Button>

                {/* Revoke */}
                <Button
                  onClick={() => handleAction(u.id, "revoke")}
                  variant="ghost"
                >
                  Revoke
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
