"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, FileText, Activity, X, ShieldCheck } from "lucide-react";

export function JudgeModeFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <aside aria-label="Demo shortcuts" className="fixed bottom-8 right-6 z-40 flex flex-col items-end font-sans pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 bg-white border border-[#E4E9E6] p-3 rounded-xl shadow-elevated flex flex-col gap-1.5 min-w-[260px] animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="px-2 py-1.5 border-b border-[#E4E9E6] mb-1 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4A3D]" />
              <p className="text-[11px] font-bold text-[#0B4A3D] tracking-wider uppercase">Demo Shortcuts</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#6B7A72] hover:text-[#10231C] p-1 rounded hover:bg-[#F6F8F7]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/industrial-intelligence?demo=true");
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F6F8F7] text-xs font-medium text-[#10231C] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-[#E8F5F2] flex items-center justify-center text-[#0B4A3D] flex-shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold">Pre-fill Facility Form</div>
              <div className="text-[10px] text-[#6B7A72]">Cement Works 1.2 Mt/yr</div>
            </div>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/decision");
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F6F8F7] text-xs font-medium text-[#10231C] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-[#EBF3FB] flex items-center justify-center text-[#2E6BA8] flex-shrink-0">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold">Jump to Decision Twin</div>
              <div className="text-[10px] text-[#6B7A72]">BUY vs BUILD vs HYBRID</div>
            </div>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-[#1F4D2E] hover:bg-[#27643A] text-white rounded-full shadow-hover hover:shadow-elevated transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-white/20 text-xs font-semibold"
        title="Demo Quick-Launch Menu"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            <span>Close</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Quick Demo</span>
          </>
        )}
      </button>
      </div>
    </aside>
  );
}