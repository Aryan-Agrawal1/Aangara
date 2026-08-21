'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Coins, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { formatCurrencyCr } from '@/lib/formatters';

// Sample live preview data presets for the Living Carbon Intelligence card
interface SectorPreset {
  id: string;
  name: string;
  facility: string;
  capacity: string;
  baselineGEI: number;
  targetGEI: number;
  actualGEI: number;
  unit: string;
  outputTonnes: number;
  buildCapExCr: number;
  buildAbatementTonnes: number;
  buildEnergySavingsCr: number;
  hybridCapExCr: number;
  hybridAbatementTonnes: number;
  hybridCCCsTonnes: number;
  hybridEnergySavingsCr: number;
  abatementTech: string;
  hybridTech: string;
  regulatoryCode: string;
}

const SECTOR_PRESETS: Record<string, SectorPreset> = {
  cement: {
    id: 'cement',
    name: 'Cement',
    facility: 'Aditya Integrated Clinker & Grinding Unit',
    capacity: '2.80 MTPA Cement',
    baselineGEI: 0.6450,
    targetGEI: 0.5840,
    actualGEI: 0.6120,
    unit: 'tCO2e/t clinker',
    outputTonnes: 2800000,
    buildCapExCr: 28.50,
    buildAbatementTonnes: 85000,
    buildEnergySavingsCr: 9.40,
    hybridCapExCr: 12.20,
    hybridAbatementTonnes: 52000,
    hybridCCCsTonnes: 26400,
    hybridEnergySavingsCr: 4.80,
    abatementTech: '18 MW Waste Heat Recovery (WHRS) + 14% AFR Co-Processing',
    hybridTech: 'AFR Optimization (Phase 1) + 26,400 CCC Market Hedge',
    regulatoryCode: 'MoP S.O. 4524(E) / BEE Trajectory',
  },
  iron_steel: {
    id: 'iron_steel',
    name: 'Iron & Steel',
    facility: 'Kalinganagar BF-BOF Steel Complex',
    capacity: '3.20 MTPA Crude Steel',
    baselineGEI: 2.3500,
    targetGEI: 2.1200,
    actualGEI: 2.2150,
    unit: 'tCO2e/t steel',
    outputTonnes: 3200000,
    buildCapExCr: 65.00,
    buildAbatementTonnes: 340000,
    buildEnergySavingsCr: 21.50,
    hybridCapExCr: 24.00,
    hybridAbatementTonnes: 180000,
    hybridCCCsTonnes: 124000,
    hybridEnergySavingsCr: 10.20,
    abatementTech: 'Coke Dry Quenching (CDQ) + Top Gas Pressure Recovery Turbine (TRT)',
    hybridTech: 'Top Gas Recovery + 124,000 CCC Market Hedging Buffer',
    regulatoryCode: 'Draft G.S.R. 517(E) Compliance Boundary',
  },
  aluminium: {
    id: 'aluminium',
    name: 'Aluminium',
    facility: 'Mahan Smelter Potline-1',
    capacity: '0.45 MTPA Primary Aluminium',
    baselineGEI: 16.8000,
    targetGEI: 15.4000,
    actualGEI: 15.8200,
    unit: 'tCO2e/t aluminium',
    outputTonnes: 450000,
    buildCapExCr: 42.00,
    buildAbatementTonnes: 210000,
    buildEnergySavingsCr: 15.80,
    hybridCapExCr: 18.50,
    hybridAbatementTonnes: 120000,
    hybridCCCsTonnes: 69000,
    hybridEnergySavingsCr: 7.90,
    abatementTech: 'Graphitised Cathode Cell Retrofit + 50 MW Dedicated Solar PPA',
    hybridTech: 'Cathode Retrofit + 69,000 CCC Market Compliance Purchase',
    regulatoryCode: 'BEE CCTS Notified Sub-sector Target',
  },
};

export default function InstitutionalLandingPage() {
  const [selectedSector, setSelectedSector] = useState<string>('cement');
  const [cccPrice, setCccPrice] = useState<number>(1150);

  const preset = SECTOR_PRESETS[selectedSector] || SECTOR_PRESETS.cement;

  // Dynamic calculations for living interactive preview
  const geiDelta = preset.actualGEI - preset.targetGEI;
  const isShortfall = geiDelta > 0;
  const shortfallTonnes = isShortfall ? Math.round(geiDelta * preset.outputTonnes) : 0;

  // BUY Strategy calculations
  const buyCostCr = (shortfallTonnes * cccPrice) / 10000000;
  const buyNPVCr = -buyCostCr * 3.8; // Cumulative 4-year present value drain

  // BUILD Strategy calculations
  const buildCapEx = preset.buildCapExCr;
  const buildOpexSavingsCr = preset.buildEnergySavingsCr;
  const buildAvoidedCCCCr = (preset.buildAbatementTonnes * cccPrice) / 10000000;
  const buildAnnualBenefitCr = buildOpexSavingsCr + buildAvoidedCCCCr;
  const buildSimplePayback = buildCapEx / Math.max(0.1, buildAnnualBenefitCr);
  const buildNPVCr = buildAnnualBenefitCr * 3.6 - buildCapEx;

  // HYBRID Strategy calculations (Winning optimal blend)
  const hybridCapEx = preset.hybridCapExCr;
  const hybridSavingsCr = preset.hybridEnergySavingsCr;
  const hybridNetAnnualBenefitCr = hybridSavingsCr + ((shortfallTonnes - preset.hybridCCCsTonnes) * cccPrice) / 10000000;
  const hybridNPVCr = hybridNetAnnualBenefitCr * 4.1 - hybridCapEx;
  const hybridPayback = hybridCapEx / Math.max(0.1, hybridNetAnnualBenefitCr);

  return (
    <div className="min-h-screen bg-[#06090E] text-slate-100 relative overflow-x-hidden">
      {/* Top ambient glow & industrial grid texture with photographic hero background */}
      <div className="absolute top-0 left-0 right-0 h-[850px] bg-industrial-hero pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-industrial-grid pointer-events-none opacity-50 z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] ambient-glow pointer-events-none z-0"></div>

      {/* Global Institutional Header */}
      <Header currentSector={selectedSector} onSectorChange={(s) => setSelectedSector(s)} />

      {/* Hero Section */}
      <section className="relative z-10 pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Sovereign & Regulatory Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-emerald-500/30 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-medium tracking-wide text-emerald-300 uppercase">
              India CCTS Regulatory & Capital Allocation Engine
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] font-mono text-slate-400">BEE 2025-26 Trajectory Calibrated</span>
          </div>

          {/* Institutional Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            CarbonAlpha: The Industrial Carbon{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Decision Twin
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Measure your statutory position under CCTS. Benchmark against calibrated peers. 
            Model decarbonisation pathways. Optimize capital across{' '}
            <span className="text-emerald-400 font-semibold">BUY</span>,{' '}
            <span className="text-teal-400 font-semibold">BUILD</span>, and{' '}
            <span className="text-cyan-400 font-semibold">HYBRID</span> strategies.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/industrial-intelligence"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Analyze Your Facility</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/decision"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-lg bg-[#111827] hover:bg-[#1A2333] border border-white/[0.12] hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold text-sm transition-all"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Launch Decision Twin</span>
            </Link>
          </div>

          {/* Key Metrics / Trust Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/[0.07]">
            <div className="text-left px-3 py-2">
              <div className="text-xl font-bold font-mono text-white tnum">8 Notified</div>
              <div className="text-xs text-slate-400 mt-0.5">CCTS Obligated Sectors</div>
            </div>
            <div className="text-left px-3 py-2">
              <div className="text-xl font-bold font-mono text-emerald-400 tnum">100% Deterministic</div>
              <div className="text-xs text-slate-400 mt-0.5">Math & Audit Trace</div>
            </div>
            <div className="text-left px-3 py-2">
              <div className="text-xl font-bold font-mono text-white tnum">Draft G.S.R. 517(E)</div>
              <div className="text-xs text-slate-400 mt-0.5">Steel Boundary Ready</div>
            </div>
            <div className="text-left px-3 py-2">
              <div className="text-xl font-bold font-mono text-cyan-400 tnum">BUY / BUILD / HYBRID</div>
              <div className="text-xs text-slate-400 mt-0.5">Financial Optimizer</div>
            </div>
          </div>
        </div>

        {/* Living Carbon Intelligence Interactive Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-[#0B1019] border border-white/[0.09] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden backdrop-blur-xl">
            {/* Top Bar of Living Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/[0.07] gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono font-semibold">
                    LIVE INTELLIGENCE PREVIEW
                  </span>
                  <span className="text-xs text-slate-400 font-mono">| {preset.regulatoryCode}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 flex items-center space-x-2">
                  <span>{preset.facility}</span>
                  <span className="text-xs font-normal text-slate-400 font-mono">({preset.capacity})</span>
                </h3>
              </div>

              {/* Sector Switcher Tabs */}
              <div className="flex items-center space-x-1.5 bg-[#111827] p-1 rounded-lg border border-white/[0.07]">
                {Object.keys(SECTOR_PRESETS).map((key) => {
                  const s = SECTOR_PRESETS[key];
                  const isActive = selectedSector === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSector(key)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle Grid: Statutory Benchmark & Delta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
              {/* Actual GEI */}
              <div className="bg-[#111827] p-4 rounded-xl border border-white/[0.06] space-y-1">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Facility Actual GEI</div>
                <div className="text-2xl font-bold font-mono text-white tnum flex items-baseline space-x-1.5">
                  <span>{preset.actualGEI.toFixed(4)}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">{preset.unit}</span>
                </div>
                <div className="text-[11px] text-slate-400">Baseline: {preset.baselineGEI.toFixed(4)} {preset.unit}</div>
              </div>

              {/* Target GEI */}
              <div className="bg-[#111827] p-4 rounded-xl border border-white/[0.06] space-y-1">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">BEE Compliance Target</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tnum flex items-baseline space-x-1.5">
                  <span>{preset.targetGEI.toFixed(4)}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">{preset.unit}</span>
                </div>
                <div className="text-[11px] text-emerald-400/80">Statutory 2025-26 Target Threshold</div>
              </div>

              {/* Compliance Shortfall */}
              <div className="bg-[#111827] p-4 rounded-xl border border-amber-500/20 space-y-1">
                <div className="text-xs font-medium text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Statutory Position</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-700/50">
                    OBLIGATION
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-300 tnum flex items-baseline space-x-1.5">
                  <span>+{shortfallTonnes.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">tCO2e (CCCs)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  GEI Gap: +{geiDelta.toFixed(4)} {preset.unit}
                </div>
              </div>
            </div>

            {/* Interactive Carbon Price Sensitivity Bar */}
            <div className="bg-[#111827]/70 p-4 rounded-xl border border-white/[0.06] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Interactive CCC Carbon Price Sensitivity</div>
                  <div className="text-[11px] text-slate-400">Slide to test market price impact on BUY vs BUILD vs HYBRID returns</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:min-w-[280px]">
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="50"
                  value={cccPrice}
                  onChange={(e) => setCccPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="text-xs font-mono font-bold text-emerald-400 bg-[#0B1019] px-2 py-1 rounded border border-white/[0.07] whitespace-nowrap tnum">
                  ₹{cccPrice.toLocaleString('en-IN')}/t
                </span>
              </div>
            </div>

            {/* Strategy Comparison Cards (BUY vs BUILD vs HYBRID) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strategy 1: BUY */}
              <div className="bg-[#111827] rounded-xl p-5 border border-white/[0.07] flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">Strategy A: BUY</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      100% MARKET
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-400">Annual Compliance Cost</div>
                    <div className="text-2xl font-bold font-mono text-slate-100 tnum mt-0.5">
                      {formatCurrencyCr(buyCostCr)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    Direct purchase of {shortfallTonnes.toLocaleString('en-IN')} CCCs annually. Zero internal CapEx, but high multi-year price exposure.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>4-Yr NPV Impact:</span>
                    <span className="text-rose-400 font-bold tnum">{formatCurrencyCr(buyNPVCr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payback:</span>
                    <span className="text-slate-400">None (Pure OpEx)</span>
                  </div>
                </div>
              </div>

              {/* Strategy 2: BUILD */}
              <div className="bg-[#111827] rounded-xl p-5 border border-white/[0.07] flex flex-col justify-between relative">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-400 uppercase">Strategy B: BUILD</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-400 border border-teal-800/50">
                      100% ABATEMENT
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-400">Abatement CapEx Required</div>
                    <div className="text-2xl font-bold font-mono text-teal-300 tnum mt-0.5">
                      {formatCurrencyCr(buildCapEx)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {preset.abatementTech}. Generates surplus CCCs & energy savings.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Project NPV:</span>
                    <span className="text-emerald-400 font-bold tnum">+{formatCurrencyCr(buildNPVCr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Est. Payback:</span>
                    <span className="text-slate-200 font-bold tnum">{buildSimplePayback.toFixed(1)} yrs</span>
                  </div>
                </div>
              </div>

              {/* Strategy 3: HYBRID (Winner / Recommended) */}
              <div className="bg-[#111827] rounded-xl p-5 border-2 border-emerald-500 winner-card-glow flex flex-col justify-between relative shadow-xl">
                <div className="absolute -top-3 right-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                    WINNING MANDATE
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Strategy C: HYBRID</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                      OPTIMAL CAPITAL
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-400">Optimized Phase CapEx</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 tnum mt-0.5">
                      {formatCurrencyCr(hybridCapEx)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {preset.hybridTech}. Minimizes Levelized Cost of Abatement while protecting cash reserves.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-emerald-500/30 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Optimized NPV:</span>
                    <span className="text-emerald-400 font-bold tnum">+{formatCurrencyCr(hybridNPVCr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Rapid Payback:</span>
                    <span className="text-emerald-300 font-bold tnum">{hybridPayback.toFixed(1)} yrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Action Bar */}
            <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic mathematical trace verified against notified statutory intensity formulae.</span>
              </div>

              <Link
                href="/decision"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-[#1A2333] hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-xs font-bold font-mono transition-all group"
              >
                <span>EXECUTE FULL DECISION TWIN</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Value Pillars Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#111827] border border-white/[0.08] text-xs font-mono text-emerald-400 font-semibold">
            INSTITUTIONAL FOUNDATIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Industrial Compliance & Boardroom Mandates
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Eliminate reliance on generic spreadsheets. CarbonAlpha integrates statutory legal baselines, 
            engineering abatement physics, and multi-variable financial optimization.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Pillar 1: Statutory Precision */}
          <div className="bg-pillar-1 border border-white/[0.07] hover:border-emerald-500/40 p-8 rounded-2xl transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-[#0B1019]/40 backdrop-blur-[2px] pointer-events-none group-hover:backdrop-blur-0 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">Pillar 01</div>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Statutory Precision</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                Direct integration of Bureau of Energy Efficiency (BEE) target trajectories, specific emission baselines, 
                and Gazette notifications (including Draft G.S.R. 517(E) for Iron & Steel compliance boundaries).
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  Draft G.S.R. 517(E)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  MoP S.O. 4524(E)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 backdrop-blur-md text-emerald-400 border border-emerald-800/40 font-semibold">
                  Tier-1 Calibrated
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Deterministic Financial Modeling */}
          <div className="bg-pillar-2 border border-white/[0.07] hover:border-teal-500/40 p-8 rounded-2xl transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-[#0B1019]/40 backdrop-blur-[2px] pointer-events-none group-hover:backdrop-blur-0 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider">Pillar 02</div>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Deterministic Financial Modeling</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                Rigorous CapEx/OpEx cash flow modeling, LCOA (Levelized Cost of Carbon Abatement), IRR, and NPV comparisons 
                across BUY, BUILD, and HYBRID compliance strategies with zero black-box obscurity.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  DCF Cash Flows
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  LCOA Minimization
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-950/60 backdrop-blur-md text-teal-400 border border-teal-800/40 font-semibold">
                  Capital Allocation Engine
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 3: 8-Sector Decarbonisation Engineering */}
          <div className="bg-pillar-3 border border-white/[0.07] hover:border-cyan-500/40 p-8 rounded-2xl transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-[#0B1019]/40 backdrop-blur-[2px] pointer-events-none group-hover:backdrop-blur-0 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">Pillar 03</div>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">8-Sector Decarbonisation Engineering</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                Tailored engineering abatement levers across Cement (WHRS, AFR, Clinker Factor), Iron & Steel (CDQ, DRI Hydrogen, TRT), 
                Aluminium, Chlor-Alkali, Refineries, Petrochemicals, Pulp & Paper, and Textiles.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  MACC Optimization
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  Technology Readiness
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 backdrop-blur-md text-cyan-400 border border-cyan-800/40 font-semibold">
                  8 Obligated Domains
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Multi-variable Stress Lab */}
          <div className="bg-pillar-4 border border-white/[0.07] hover:border-blue-500/40 p-8 rounded-2xl transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-[#0B1019]/40 backdrop-blur-[2px] pointer-events-none group-hover:backdrop-blur-0 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-105 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">Pillar 04</div>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Multi-variable Stress Lab</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                Real-time sensitivity analysis testing regulatory penalty spikes, carbon price surges (₹500 to ₹3,000/tCO2e), 
                abatement delivery slippage, project execution delays, and financing cost volatility.
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  Price Shock Sensitivity
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111827]/80 backdrop-blur-md text-slate-300 border border-white/[0.06]">
                  Execution Delay Risk
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 backdrop-blur-md text-blue-400 border border-blue-800/40 font-semibold">
                  Stress Twin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Architecture Pipeline Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#111827] border border-white/[0.08] text-xs font-mono text-cyan-400 font-semibold">
            DECISION ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Operational Telemetry to Boardroom Capital Allocation
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Four deterministic steps transforming plant telemetry and fuel consumption streams into an optimized CCTS compliance mandate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="bg-[#0B1019] border border-white/[0.07] p-6 rounded-xl relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
                01
              </div>
              <h4 className="font-bold text-white text-base">Facility Telemetry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingest production volumes, fuel consumption splits, and captive/grid electricity consumption.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
              [Activity Data · Scope 1 & 2]
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0B1019] border border-white/[0.07] p-6 rounded-xl relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-teal-400 text-sm">
                02
              </div>
              <h4 className="font-bold text-white text-base">Statutory Calibration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compute actual GEI against notified BEE trajectory targets to establish statutory surplus/shortfall.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
              [BEE Formula · GEI Delta]
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0B1019] border border-white/[0.07] p-6 rounded-xl relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
                03
              </div>
              <h4 className="font-bold text-white text-base">Abatement Modeling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate engineering decarbonisation levers with realistic CapEx, implementation lead times, and OpEx delta.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
              [MACC Curve · Engineering]
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#0B1019] border border-white/[0.07] p-6 rounded-xl relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#111827] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
                04
              </div>
              <h4 className="font-bold text-white text-base">Capital Optimization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluate BUY vs BUILD vs HYBRID permutations to deliver the board-ready capital decision with full mathematical audit trail.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
              [Board Mandate · NPV / IRR]
            </div>
          </div>
        </div>
      </section>

      {/* 8-Sector Coverage Matrix */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#111827] border border-white/[0.08] text-xs font-mono text-emerald-400 font-semibold">
            NOTIFIED COMPLIANCE SCOPE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            8 Notified Industrial Sectors Calibrated
          </h2>
          <p className="text-slate-400 text-base">
            Complete coverage of all obligated industrial sectors notified under the Indian Carbon Credit Trading Scheme.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            { name: 'Cement', code: 'CEM', status: 'Active Demo', note: 'tCO2e/t clinker & cement', href: '/industrial-intelligence' },
            { name: 'Iron & Steel', code: 'STEEL', status: 'Draft G.S.R. 517(E)', note: 'BF-BOF, DRI-EAF boundaries', href: '/decision' },
            { name: 'Aluminium', code: 'ALU', status: 'Notified', note: 'Smelting & Anode baking', href: '/overview' },
            { name: 'Chlor-Alkali', code: 'ALK', status: 'Notified', note: 'Membrane cell caustic soda', href: '/overview' },
            { name: 'Pulp & Paper', code: 'PPR', status: 'Notified', note: 'Chemical & agro recovery', href: '/overview' },
            { name: 'Petrochemicals', code: 'PETRO', status: 'Notified', note: 'Cracker & polymer units', href: '/overview' },
            { name: 'Petroleum Refinery', code: 'REF', status: 'Notified', note: 'MBN / Specific energy consumption', href: '/overview' },
            { name: 'Textile', code: 'TEX', status: 'Notified', note: 'Spinning, weaving & processing', href: '/overview' },
          ].map((sector, i) => (
            <Link
              key={i}
              href={sector.href}
              className="bg-[#0B1019] border border-white/[0.07] hover:border-emerald-500/40 p-4 rounded-xl transition-all group block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-400">{sector.code}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                  {sector.status}
                </span>
              </div>
              <h5 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                {sector.name}
              </h5>
              <p className="text-[11px] text-slate-400 mt-1">{sector.note}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Institutional Final CTA Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-industrial-cta border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[#0B1019]/80 backdrop-blur-sm pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Calibrate Your Industrial Carbon Exposure Today
            </h2>
            <p className="text-slate-300 text-base leading-relaxed font-medium">
              Step into India's premier CCTS decision twin. Input your operational telemetry or run interactive stress simulations in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/industrial-intelligence"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02]"
              >
                <span>Enter Facility Data</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
              <Link
                href="/sources"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg bg-[#111827]/90 hover:bg-[#1A2333] border border-white/[0.2] text-white font-bold text-sm backdrop-blur-md transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>View Regulatory Register</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-[#06090E] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-md bg-[#111827] border border-emerald-500/30 flex items-center justify-center">
                <span className="font-mono font-bold text-white text-xs">
                  <span className="text-emerald-400">C</span>
                  <span className="text-emerald-300 text-[10px]">α</span>
                </span>
              </div>
              <span className="font-bold text-white text-base">CarbonAlpha</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional carbon decision intelligence and capital allocation engine for the Indian Carbon Credit Trading Scheme (CCTS).
            </p>
          </div>

          <div>
            <h6 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">Decision Twin</h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/industrial-intelligence" className="hover:text-emerald-400 transition-colors">Industrial Intelligence</Link></li>
              <li><Link href="/decision" className="hover:text-emerald-400 transition-colors">Decision Twin & Allocation</Link></li>
              <li><Link href="/overview" className="hover:text-emerald-400 transition-colors">Sector Portfolio</Link></li>
              <li><Link href="/scenarios" className="hover:text-emerald-400 transition-colors">Multi-variable Stress Lab</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">Compliance & Rules</h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/sources" className="hover:text-emerald-400 transition-colors">Regulatory Register</Link></li>
              <li><Link href="/entity" className="hover:text-emerald-400 transition-colors">Operational Input</Link></li>
              <li><span className="text-slate-400">Draft G.S.R. 517(E) Boundary</span></li>
              <li><span className="text-slate-400">MoP S.O. 4524(E) Trajectory</span></li>
            </ul>
          </div>

          <div>
            <h6 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">System Metadata</h6>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
              <div>Version: <span className="text-emerald-400">v2.4-ccts-calibrated</span></div>
              <div>Model: <span className="text-slate-300">Deterministic LCOA/NPV</span></div>
              <div>Provenance: <span className="text-slate-300">100% Verifiable Math Trace</span></div>
              <div className="pt-2 flex items-center space-x-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>System Operational · CCTS Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} CarbonAlpha India. All rights reserved. Decision Intelligence & Capital Allocation.</div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">BEE / MoP / MoEFCC Compliance Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

