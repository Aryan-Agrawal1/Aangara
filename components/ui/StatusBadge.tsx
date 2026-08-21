import React from "react";
export type StatusType = "FACT" | "CALCULATION" | "MODEL" | "SCENARIO" | "SYNTHETIC";
const CONFIG: Record<StatusType, { label: string; style: string }> = {
  FACT: { label: "FACT", style: "bg-[#EBF3FB] text-[#2E6BA8] border-[#2E6BA8]/30" },
  CALCULATION: { label: "CALC", style: "bg-[#E8F5EE] text-[#1F8A5F] border-[#1F8A5F]/30" },
  MODEL: { label: "MODEL", style: "bg-purple-50 text-purple-700 border-purple-200" },
  SCENARIO: { label: "SCENARIO", style: "bg-[#FEF7E8] text-[#C98A1E] border-[#C98A1E]/30" },
  SYNTHETIC: { label: "SYNTHETIC", style: "bg-[#F6F8F7] text-[#6B7A72] border-[#E4E9E6]" },
};
export function StatusBadge({ type, size = "xs", className = "" }: { type: StatusType; size?: "xs" | "sm"; className?: string }) {
  const { label, style } = CONFIG[type];
  return <span title={`Data status: ${type}`} className={`inline-flex items-center font-mono font-bold tracking-wider border rounded px-1.5 py-0.5 ${size === "xs" ? "text-[9px]" : "text-[10px]"} ${style} ${className}`}>{label}</span>;
}