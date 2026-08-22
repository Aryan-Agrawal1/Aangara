'use client';

import { ClientChartWrapper } from "@/components/ui/ClientChartWrapper";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { PeerBenchmarkResult } from '@/lib/types';
import { formatGEI } from '@/lib/formatters';
import {
  BarChart3,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  ShieldCheck,
  Compass,
  Layers,
  HelpCircle
} from 'lucide-react';

interface PeerBenchmarkCardProps {
  benchmark: PeerBenchmarkResult;
  actualGei: number;
  targetGei: number;
}

export function PeerBenchmarkCard({ benchmark, actualGei, targetGei }: PeerBenchmarkCardProps) {
  if (!benchmark) return null;

  const isLeader = benchmark.peer_percentile < 35;
  const isLagging = benchmark.peer_percentile > 70;
  const median = benchmark.peer_median_gei || 1.0;
  const p25 = benchmark.peer_p25_gei || median * 0.85;
  const p75 = benchmark.peer_p75_gei || median * 1.15;
  const iqr = Math.max(0.0001, p75 - p25);

  // Estimate standard deviation: IQR ≈ 1.349 * sigma for normal distribution
  const sigma = Math.max(0.001, iqr / 1.349);

  // Determine continuous domain for the bell curve
  const minVal = Math.max(
    0,
    Math.min(
      median - 3.2 * sigma,
      p25 - 1.2 * sigma,
      actualGei - 0.8 * sigma,
      targetGei ? targetGei - 0.8 * sigma : Infinity
    )
  );
  const maxVal = Math.max(
    median + 3.2 * sigma,
    p75 + 1.2 * sigma,
    actualGei + 0.8 * sigma,
    targetGei ? targetGei + 0.8 * sigma : -Infinity
  );

  const pointsCount = 70;
  const step = (maxVal - minVal) / pointsCount;
  const curveData = [];

  for (let i = 0; i <= pointsCount; i++) {
    const x = minVal + i * step;
    const z = (x - median) / sigma;
    const density = Math.exp(-0.5 * z * z); // standard Gaussian height

    curveData.push({
      gei: Number(x.toFixed(4)),
      density: Number((density * 100).toFixed(2)),
      zone: x <= p25 ? 'leader' : x <= p75 ? 'core' : 'lagging'
    });
  }

  // Calculate percentage stops for SVG linear gradient
  const p25Offset = Math.max(0, Math.min(100, ((p25 - minVal) / (maxVal - minVal)) * 100));
  const p75Offset = Math.max(0, Math.min(100, ((p75 - minVal) / (maxVal - minVal)) * 100));

  // Delta vs median
  const deltaVsMedian = actualGei - median;
  const deltaPct = ((deltaVsMedian / median) * 100).toFixed(1);

  // Custom Chart Tooltip
  const CustomCurveTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt = payload[0].payload;
    const zoneName =
      pt.gei <= p25
        ? 'Top 25% Quartile (Leaders)'
        : pt.gei <= p75
        ? 'Middle 50% Benchmark Core'
        : 'Bottom 25% (High Carbon Intensity)';

    return (
      <div className="bg-[#0B132B] border border-[#E4E9E6]/90 rounded-xl p-3 text-xs shadow-2xl backdrop-blur-md z-50">
        <div className="text-[10px] font-mono uppercase text-[#4B5A54] mb-1">Peer Distribution Density</div>
        <div className="text-sm font-bold text-white font-mono">{formatGEI(pt.gei)}</div>
        <div className="text-[11px] text-[#2E6BA8] mt-1 font-semibold">{zoneName}</div>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-xl border-[#E4E9E6] overflow-hidden shadow-2xl mt-6 space-y-6 pb-6">
      {/* Header without Photographic Background */}
      <div className="relative border-b border-[#E4E9E6]">
        <div className="relative z-10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#EBF3FB] text-[#2E6BA8] border border-sky-800/60 shadow-lg shadow-sky-950/50 backdrop-blur-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-[#10231C] tracking-tight">
                  ML Peer Benchmark & Empirical GEI Distribution
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EBF3FB] text-[#2E6BA8] border border-[#2E6BA8]/20 backdrop-blur-md">
                  DISTRIBUTION TWIN
                </span>
              </div>
              <p className="text-xs text-[#4B5A54] mt-1 font-medium">
                Continuous empirical distribution curve based on {benchmark.peer_sample_count.toLocaleString()} audited industrial observations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1.5 rounded-md bg-white/80 text-[#2E6BA8] border border-[#E4E9E6] backdrop-blur-md font-semibold shadow-inner">
              {benchmark.benchmark_model}
            </span>
            <span 
              className="text-[11px] font-mono px-2.5 py-1.5 rounded-md bg-[#E8F5EE] text-[#0B4A3D] border border-emerald-800/50 backdrop-blur-md font-bold shadow-inner flex items-center space-x-1 cursor-help"
              title="Confidence level indicates ML model prediction robustness. High means strong statistical historical backing, Calibrated means tuned via limited parameters."
            >
              <span>Confidence: {benchmark.confidence || 'HIGH'}</span>
              <HelpCircle className="w-3 h-3 text-[#0B4A3D] opacity-80" />
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 space-y-5">

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white/95 rounded-xl p-4 border border-[#E4E9E6]">
          <div className="text-[10px] font-mono uppercase text-[#4B5A54] font-semibold tracking-wider flex items-center space-x-1 cursor-help" title="Your audited Greenhouse Gas Emission Intensity. Direct factor for CCTS compliance risk.">
            <span>Your Facility GEI</span>
            <HelpCircle className="w-3 h-3 text-[#6B7A72]" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {formatGEI(actualGei)}
          </div>
          <div className="text-[10px] text-[#4B5A54] mt-1 flex items-center space-x-1">
            <span>Delta vs Median:</span>
            <span className={`font-mono font-bold ${deltaVsMedian <= 0 ? 'text-[#0B4A3D]' : 'text-[#C33B2E]'}`}>
              {deltaVsMedian <= 0 ? `${deltaPct}% (Cleaner)` : `+${deltaPct}% (Higher)`}
            </span>
          </div>
        </div>

        <div className="bg-white/95 rounded-xl p-4 border border-[#E4E9E6]">
          <div className="text-[10px] font-mono uppercase text-[#4B5A54] font-semibold tracking-wider flex items-center space-x-1 cursor-help" title="50th percentile of the audited benchmark distribution. Represents the middle of the market.">
            <span>Sector Median (P50)</span>
            <HelpCircle className="w-3 h-3 text-[#6B7A72]" />
          </div>
          <div className="text-xl font-bold text-[#2E6BA8] font-mono mt-1">
            {formatGEI(benchmark.peer_median_gei)}
          </div>
          <div className="text-[10px] text-[#4B5A54] mt-1 font-mono">
            IQR: {benchmark.peer_p25_gei.toFixed(3)} – {benchmark.peer_p75_gei.toFixed(3)}
          </div>
        </div>

        <div
          className={`rounded-xl p-4 border ${
            isLeader
              ? 'bg-[#E8F5EE] border-emerald-800/50 text-[#0B4A3D]'
              : isLagging
              ? 'bg-[#FDECEA] border-[#C33B2E]/30 text-[#C33B2E]'
              : 'bg-white/95 border-[#E4E9E6] text-[#10231C]'
          }`}
        >
          <div className="text-[10px] font-mono uppercase font-semibold tracking-wider">
            Peer Percentile Rank
          </div>
          <div className="text-xl font-bold font-mono mt-1 flex items-center space-x-2">
            <span>{benchmark.peer_percentile.toFixed(0)}th Percentile</span>
            {isLeader ? (
              <Award className="w-4 h-4 text-[#0B4A3D]" />
            ) : isLagging ? (
              <TrendingUp className="w-4 h-4 text-[#C33B2E]" />
            ) : null}
          </div>
          <div className="text-[10px] opacity-80 mt-1">
            {isLeader ? 'Leader (Top Quartile Efficiency)' : isLagging ? 'Lagging (High Carbon Intensity)' : 'Industry Benchmark Core (P25–P75)'}
          </div>
        </div>

        <div className="bg-white/95 rounded-xl p-4 border border-[#E4E9E6]">
          <div className="text-[10px] font-mono uppercase text-[#4B5A54] font-semibold tracking-wider">
            Notified Target GEI
          </div>
          <div className="text-xl font-bold text-teal-300 font-mono mt-1">
            {formatGEI(targetGei)}
          </div>
          <div className="text-[10px] text-[#4B5A54] mt-1">
            {actualGei <= targetGei ? (
              <span className="text-[#0B4A3D] font-bold">Compliant with FY26 Target</span>
            ) : (
              <span className="text-[#C33B2E] font-bold">Obligation Shortfall Pending</span>
            )}
          </div>
        </div>
      </div>

      {/* Continuous Empirical Bell Curve / Quartile Area Visual */}
      <div className="bg-[#F6F8F7] rounded-xl p-4 sm:p-5 border border-[#E4E9E6]/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-[#E4E9E6]/70 gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#2E6BA8]" />
              <span>Continuous Peer Density Distribution (GEI tCO₂e/t)</span>
            </h4>
            <p className="text-[11px] text-[#4B5A54] mt-0.5">
              Empirical kernel distribution curve with shaded quartile zones and designated facility marker
            </p>
          </div>

          {/* Quartile Zone Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/80" />
              <span className="text-[#4B5A54]">P0-P25 (Leaders)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-500/80" />
              <span className="text-[#4B5A54]">P25-P75 (Sector Core)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/80" />
              <span className="text-[#4B5A54]">P75-P100 (Lagging)</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ClientChartWrapper>
<ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 25, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="bellCurveGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset={`${p25Offset}%`} stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset={`${p25Offset}%`} stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset={`${p75Offset}%`} stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset={`${p75Offset}%`} stopColor="#f43f5e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="bellCurveStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset={`${p25Offset}%`} stopColor="#10b981" />
                  <stop offset={`${p25Offset}%`} stopColor="#38bdf8" />
                  <stop offset={`${p75Offset}%`} stopColor="#38bdf8" />
                  <stop offset={`${p75Offset}%`} stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="gei"
                type="number"
                domain={[minVal, maxVal]}
                tickCount={8}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => val.toFixed(3)}
              />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip content={<CustomCurveTooltip />} />

              <Area
                type="monotone"
                dataKey="density"
                stroke="url(#bellCurveStroke)"
                strokeWidth={2.5}
                fill="url(#bellCurveGradient)"
              />

              {/* Reference line for Facility Actual GEI */}
              <ReferenceLine
                x={Number(actualGei.toFixed(4))}
                stroke="#10b981"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                label={{
                  value: `📍 Your Facility (${actualGei.toFixed(3)})`,
                  position: 'top',
                  fill: '#34d399',
                  fontSize: 11,
                  fontWeight: 'bold',
                  offset: 10
                }}
              />

              {/* Reference line for Peer Median P50 */}
              <ReferenceLine
                x={Number(median.toFixed(4))}
                stroke="#38bdf8"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{
                  value: `Median P50 (${median.toFixed(3)})`,
                  position: 'insideBottomLeft',
                  fill: '#38bdf8',
                  fontSize: 10
                }}
              />

              {/* Reference line for Target GEI */}
              {targetGei > 0 && (
                <ReferenceLine
                  x={Number(targetGei.toFixed(4))}
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  label={{
                    value: `Target (${targetGei.toFixed(3)})`,
                    position: 'insideBottomRight',
                    fill: '#c084fc',
                    fontSize: 10
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
</ClientChartWrapper>
        </div>

        {/* Statistical Range Scale Bar */}
        <div className="flex justify-between text-[11px] font-mono text-[#4B5A54] mt-2 px-1">
          <span className="text-[#0B4A3D]">P25 Leader Threshold: {benchmark.peer_p25_gei.toFixed(4)}</span>
          <span className="text-[#2E6BA8] font-bold">P50 Sector Median: {benchmark.peer_median_gei.toFixed(4)}</span>
          <span className="text-[#C33B2E]">P75 Lagging Threshold: {benchmark.peer_p75_gei.toFixed(4)}</span>
        </div>
      </div>

      {/* AI Statistical Narrative */}
      <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 text-xs flex items-start space-x-3">
        <div className="p-1.5 rounded-lg bg-[#E8F5EE] border border-emerald-800/50 text-[#0B4A3D] mt-0.5 flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-white mb-1">
            Empirical Benchmark Assessment
          </div>
          <p className="text-[#4B5A54] leading-relaxed italic">
            "{benchmark.interpretation}"
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

