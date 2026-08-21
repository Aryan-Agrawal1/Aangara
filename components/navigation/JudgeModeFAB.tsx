'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, FileText, Activity, X } from 'lucide-react';

export function JudgeModeFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start font-sans">
      {isOpen && (
        <div className="mb-4 bg-[#0B101A]/95 backdrop-blur-xl border border-emerald-900/50 p-2 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[240px] animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="px-3 py-2 border-b border-white/5 mb-1 flex justify-between items-center">
            <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">SIH Judge Mode</p>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              // Adding ?demo=true so the facility form knows to prefill
              router.push('/industrial-intelligence?demo=true');
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-slate-200 transition-colors text-left"
          >
            <div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <span>Pre-fill Facility Form</span>
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/decision');
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-slate-200 transition-colors text-left"
          >
            <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <span>Jump to Decision Twin</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#1E293B] to-[#0F172A] hover:from-[#334155] hover:to-[#1E293B] text-emerald-400 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all transform hover:scale-105 active:scale-95 border border-emerald-500/30 ring-2 ring-emerald-500/10"
        title="SIH Judge Mode Shortcuts"
      >
        {isOpen ? <X className="w-5 h-5 text-slate-300" /> : <Zap className="w-5 h-5 fill-emerald-500/20" />}
      </button>
    </div>
  );
}
