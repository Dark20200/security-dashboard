"use client";

import { useState } from "react";

export default function ProtectionPage() {
  const [protections, setProtections] = useState({
    antiRaid: true,
    antiBot: true,
    antiLink: false,
    antiSpam: true,
  });

  const toggle = (key: keyof typeof protections) => {
    setProtections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        ⚙️ Protection Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Anti-Raid */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-yellow-300">Anti-Raid</h2>
          <p className="text-gray-400 mt-2">Blocks mass-join raids</p>
          <button
            onClick={() => toggle("antiRaid")}
            className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
              protections.antiRaid
                ? "bg-green-500 hover:bg-green-400 text-black"
                : "bg-red-500 hover:bg-red-400 text-black"
            }`}
          >
            {protections.antiRaid ? "Enabled ✅" : "Disabled ❌"}
          </button>
        </div>

        {/* Anti-Bot */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-yellow-300">Anti-Bot</h2>
          <p className="text-gray-400 mt-2">Prevents unapproved bots</p>
          <button
            onClick={() => toggle("antiBot")}
            className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
              protections.antiBot
                ? "bg-green-500 hover:bg-green-400 text-black"
                : "bg-red-500 hover:bg-red-400 text-black"
            }`}
          >
            {protections.antiBot ? "Enabled ✅" : "Disabled ❌"}
          </button>
        </div>

        {/* Anti-Link */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-yellow-300">Anti-Link</h2>
          <p className="text-gray-400 mt-2">Blocks unwanted links</p>
          <button
            onClick={() => toggle("antiLink")}
            className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
              protections.antiLink
                ? "bg-green-500 hover:bg-green-400 text-black"
                : "bg-red-500 hover:bg-red-400 text-black"
            }`}
          >
            {protections.antiLink ? "Enabled ✅" : "Disabled ❌"}
          </button>
        </div>

        {/* Anti-Spam */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-yellow-300">Anti-Spam</h2>
          <p className="text-gray-400 mt-2">Detects spam messages</p>
          <button
            onClick={() => toggle("antiSpam")}
            className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
              protections.antiSpam
                ? "bg-green-500 hover:bg-green-400 text-black"
                : "bg-red-500 hover:bg-red-400 text-black"
            }`}
          >
            {protections.antiSpam ? "Enabled ✅" : "Disabled ❌"}
          </button>
        </div>
      </div>

      <a
        href="/"
        className="mt-10 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        ⬅️ Back to Dashboard
      </a>
    </main>
  );
}
