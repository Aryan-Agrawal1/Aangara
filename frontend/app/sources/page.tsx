'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { getSources, getMethodologies } from '@/lib/api';
import { RegulatorySourceItem, MethodologyItem } from '@/lib/types';
import { FileText, ExternalLink, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = useState<RegulatorySourceItem[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyItem[]>([]);

  useEffect(() => {
    async function load() {
      const [s, m] = await Promise.all([getSources(), getMethodologies()]);
      setSources(s);
      setMethodologies(m);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Regulatory Source & Methodology Register</h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete inventory of Indian Gazette notifications, Energy Conservation Act mandates, CERC trading rules, and BEE methodologies.
          </p>
        </div>

        {/* Primary Legal Sources */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Tier-1 Statutory & Regulatory Authorities</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div key={src.source_id} className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
                      TIER {src.tier} ? {src.authority}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{src.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{src.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{src.notes}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">{src.source_id}</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
                  >
                    <span>View Gazette Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BEE 12 Methodologies */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span>12 Approved BEE Offset Methodologies (Updated 07 July 2026)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methodologies.map((m) => (
              <div key={m.code} className="glass-panel rounded-xl p-4 border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {m.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{m.sector}</span>
                </div>
                <h4 className="font-bold text-white mb-2 leading-snug">{m.title}</h4>
                <div className="text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Applicable Tech:</span> {m.applicable_technologies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
