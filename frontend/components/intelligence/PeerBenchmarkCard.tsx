'use client';

import React from 'react';
import { PeerBenchmarkResult } from '@/lib/types';
import { formatGEI } from '@/lib/formatters';
import { BarChart3, Award, Users, CheckCircle2, TrendingUp } from 'lucide-react';

interface PeerBenchmarkCardProps {
  benchmark: PeerBenchmarkResult;
  actualGei: number;
  targetGei: number;
}

export function PeerBenchmarkCard({ benchmark, actualGei, targetGei }: PeerBenchmarkCardProps) {
  if (!benchmark) return null;

  const isLeader = benchmark.peer_percentile < 35;
  const isLagging = benchmark.peer_percentile > 70;

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-sky-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">ML Peer Benchmark & Distribution</h3>
            <p className="text-xs text-slate-400">Benchmarked against {benchmark.peer_sample_count.toLocaleString()} comparable industrial observations</p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
          {benchmark.benchmark_model}
        </span>
      </div>

      {/* Main Percentile Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Your Facility GEI</div>
          <div className="text-xl font-bold text-white tnum mt-0.5">
            {formatGEI(actualGei)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Calculated from physical inputs</div>
        </div>

        <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Peer Median GEI (P50)</div>
          <div className="text-xl font-bold text-sky-400 tnum mt-0.5">
            {formatGEI(benchmark.peer_median_gei)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">IQR: {formatGEI(benchmark.peer_p25_gei)} ? {formatGEI(benchmark.peer_p75_gei)}</div>
        </div>

        <div className={`rounded-lg p-3.5 border ${
          isLeader ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400' : (isLagging ? 'bg-rose-950/30 border-rose-800/40 text-rose-400' : 'bg-slate-900/90 border-slate-800 text-slate-200')
        }`}>
          <div className="text-[11px] font-medium uppercase tracking-wider">Peer Standing</div>
          <div className="text-xl font-bold font-mono mt-0.5">
            {benchmark.peer_percentile.toFixed(0)}th Percentile
          </div>
          <div className="text-[10px] opacity-80 mt-1">
            {isLeader ? 'Top Tier Decarbonisation' : (isLagging ? 'Higher Intensity than Peers' : 'Sector Median Alignment')}
          </div>
        </div>
      </div>

      {/* Visual Percentile Bar */}
      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
          <span>Leader (P10)</span>
          <span>Median (P50)</span>
          <span>Lagging (P90)</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
            style={{ width: '100%' }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>P25: {benchmark.peer_p25_gei.toFixed(4)}</span>
          <span className="text-sky-400 font-bold">Median: {benchmark.peer_median_gei.toFixed(4)}</span>
          <span>P75: {benchmark.peer_p75_gei.toFixed(4)}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-3 italic leading-relaxed">
        "{benchmark.interpretation}"
      </p>
    </div>
  );
}
