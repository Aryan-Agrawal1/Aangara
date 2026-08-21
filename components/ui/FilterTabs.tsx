"use client";
import React from "react";
interface FilterTabItem { id: string; label: string; count?: number; }
interface FilterTabsProps { items: FilterTabItem[]; active: string; onChange: (id: string) => void; className?: string; }
export function FilterTabs({ items, active, onChange, className = "" }: FilterTabsProps) {
  return (
    <div role="tablist" className={`flex items-center gap-1 flex-wrap ${className}`}>
      {items.map((item) => (
        <button key={item.id} role="tab" aria-selected={active === item.id} onClick={() => onChange(item.id)} className={`filter-tab flex items-center gap-1.5 ${active === item.id ? "is-active" : ""}`}>
          <span>{item.label}</span>
          {item.count !== undefined && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active === item.id ? "bg-[#0B4A3D] text-white" : "bg-[#E4E9E6] text-[#6B7A72]"}`}>{item.count}</span>}
        </button>
      ))}
    </div>
  );
}