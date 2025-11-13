"use client";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export default function Input({ label, hint, className="", ...props }: Props) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm text-[#cfcfe1]">{label}</span>}
      <input
        className={`w-full rounded-xl bg-[#0f0f13] border border-white/10 px-3 py-2 text-[#e5e5e5] placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-600/50 ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-white/40">{hint}</span>}
    </label>
  );
}
