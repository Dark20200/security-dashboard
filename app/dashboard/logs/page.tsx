"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-yellow-400 p-4">Loading logs...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🧾 Activity Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm md:text-base">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border border-gray-700">User</th>
              <th className="p-2 border border-gray-700">Action</th>
              <th className="p-2 border border-gray-700">Performed By</th>
              <th className="p-2 border border-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="text-center border border-gray-700">
                <td className="p-2">{log.user?.name || "—"}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.performedBy}</td>
                <td className="p-2 text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
