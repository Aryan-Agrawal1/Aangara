'use client';

import React from 'react';
import Link from 'next/link';
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Header } from '@/components/navigation/Header';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { TeamSection } from '@/components/about/TeamSection';
import { 
  Building2, LineChart, Sliders, ShieldCheck, 
  ArrowRight, Activity, Zap, Factory, CheckCircle2,
  Database, Network, Scale
} from 'lucide-react';

const SECTORS = [
  { id: 'aluminium', label: 'Aluminium', draft: false },
  { id: 'cement', label: 'Cement', draft: false },
  { id: 'chlor_alkali', label: 'Chlor-Alkali', draft: false },
  { id: 'fertiliser', label: 'Fertiliser', draft: true },
  { id: 'iron_steel', label: 'Iron & Steel', draft: true },
  { id: 'paper', label: 'Pulp & Paper', draft: false },
  { id: 'petrochemicals', label: 'Petrochem', draft: false },
  { id: 'petroleum_refinery', label: 'Refinery', draft: false },
  { id: 'textile', label: 'Textile', draft: false },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Hero */}
        <div className="mb-12 max-w-4xl">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F5EE] text-[#0B4A3D] border border-[#0B4A3D]/20">
              ABOUT THE PLATFORM
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10231C] tracking-tight mb-4">
            CarbonAlpha India
          </h1>
          <p className="text-base text-[#4B5A54] leading-relaxed">
            CarbonAlpha India is a carbon-market decision-intelligence platform for Indian industrial facilities operating under the Carbon Credit Trading Scheme (CCTS). It connects a facility's production and emissions data, the current Indian regulatory framework, decarbonisation project economics, and financial scenario modelling into one transparent decision workflow — so an industrial operator can understand where they stand, what their options cost, and why a given strategy is recommended, before committing capital.
          </p>
        </div>

        {/* Section: What CarbonAlpha Does */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight mb-6 border-b border-[#E4E9E6] pb-3">
            What CarbonAlpha Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-xl border-[#E4E9E6]">
              <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] text-[#2E6BA8] flex items-center justify-center mb-4 border border-sky-800/30">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#10231C] mb-2">Carbon Position Analysis</h3>
              <p className="text-xs text-[#4B5A54] leading-relaxed">
                Calculates a facility's GHG Emission Intensity (GEI) from its actual production, energy, and process data, and compares it against its applicable regulatory target to determine a modelled compliance surplus or shortfall.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border-[#E4E9E6]">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] text-[#0B4A3D] flex items-center justify-center mb-4 border border-[#0B4A3D]/30">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#10231C] mb-2">Build vs. Buy vs. Hybrid</h3>
              <p className="text-xs text-[#4B5A54] leading-relaxed">
                Compares three concrete strategies for closing that gap: investing in an internal decarbonisation project (Build), acquiring Carbon Credit Certificates under a scenario price (Buy), or combining both (Hybrid) — each scored on cost, timeline, emissions impact, and risk.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border-[#E4E9E6]">
              <div className="w-10 h-10 rounded-lg bg-[#FEF7E8] text-[#C98A1E] flex items-center justify-center mb-4 border border-[#C98A1E]/30">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#10231C] mb-2">Scenario Simulation</h3>
              <p className="text-xs text-[#4B5A54] leading-relaxed">
                Lets a user stress-test the recommendation against changing assumptions (CCC price, project delay, project output, financing rate) and see every downstream number update in real time.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border-[#E4E9E6]">
              <div className="w-10 h-10 rounded-lg bg-[#F6F8F7] text-[#10231C] flex items-center justify-center mb-4 border border-[#E4E9E6]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#10231C] mb-2">Risk & Consequence Analysis</h3>
              <p className="text-xs text-[#4B5A54] leading-relaxed">
                Decomposes the recommendation into its financial, environmental, regulatory, and execution risk components, so the "why" behind a recommendation is always visible, not a black box.
              </p>
            </div>
          </div>
        </section>

        {/* Section: How It Works */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight mb-6 border-b border-[#E4E9E6] pb-3">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-xl border-[#E4E9E6] overflow-x-auto">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#10231C] whitespace-nowrap">
              <span className="w-6 h-6 rounded-full bg-[#0B4A3D] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Select Sector</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#E4E9E6] hidden md:block flex-shrink-0" />
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#10231C] whitespace-nowrap">
              <span className="w-6 h-6 rounded-full bg-[#0B4A3D] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Enter Facility Data</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#E4E9E6] hidden md:block flex-shrink-0" />
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#10231C] whitespace-nowrap">
              <span className="w-6 h-6 rounded-full bg-[#0B4A3D] text-white flex items-center justify-center text-[10px]">3</span>
              <span>Engine Calculates Position</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#E4E9E6] hidden md:block flex-shrink-0" />
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#10231C] whitespace-nowrap">
              <span className="w-6 h-6 rounded-full bg-[#0B4A3D] text-white flex items-center justify-center text-[10px]">4</span>
              <span>Compare Strategies</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#E4E9E6] hidden md:block flex-shrink-0" />
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#10231C] whitespace-nowrap">
              <span className="w-6 h-6 rounded-full bg-[#0B4A3D] text-white flex items-center justify-center text-[10px]">5</span>
              <span>Stress-Test Scenarios</span>
            </div>
          </div>
        </section>

        {/* Section: Regulatory Framework */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight mb-6 border-b border-[#E4E9E6] pb-3">
            Built on India's Actual Regulatory Framework
          </h2>
          <div className="glass-panel p-6 rounded-xl border-[#E4E9E6] prose prose-sm max-w-none text-[#4B5A54] leading-relaxed">
            <p>
              CarbonAlpha's calculations are grounded in the actual Indian regulatory architecture governing industrial carbon compliance — not a generic global carbon-accounting model.
            </p>
            <p className="mt-3">
              The platform tracks the <strong>Carbon Credit Trading Scheme (CCTS)</strong>, notified under the Energy Conservation Act, 2001 (as amended in 2022), which established India's compliance mechanism for <strong>Greenhouse Gas Emission Intensity (GEI)</strong> targets across energy-intensive industrial sectors.
            </p>
            <p className="mt-3">
              CarbonAlpha references primary sources including the <strong>Bureau of Energy Efficiency (BEE)</strong>, the <strong>Ministry of Environment, Forest and Climate Change (MoEFCC)</strong>, and the <strong>Central Electricity Regulatory Commission (CERC)</strong> for regulatory targets, emission factors, and methodology structure — and every regulatory figure shown in the platform is versioned and dated back to its source, so it can be re-verified rather than taken on faith.
            </p>
          </div>
        </section>

        {/* Section: Sectors Covered */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight mb-6 border-b border-[#E4E9E6] pb-3">
            Sectors Covered
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SECTORS.map((sector) => (
              <div 
                key={sector.id} 
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  sector.draft 
                  ? 'bg-[#FEF7E8]/50 border-amber-200' 
                  : 'bg-[#F6F8F7] border-[#E4E9E6]'
                }`}
              >
                <Factory className={`w-6 h-6 mb-2 ${sector.draft ? 'text-[#C98A1E]' : 'text-[#4B5A54]'}`} />
                <span className={`text-xs font-bold ${sector.draft ? 'text-[#C98A1E]' : 'text-[#10231C]'}`}>
                  {sector.label}
                </span>
                {sector.draft && (
                  <span className="text-[9px] font-mono mt-1 text-[#C98A1E] bg-[#FEF7E8] px-1.5 py-0.5 rounded border border-[#C98A1E]/30">
                    DRAFT
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section: Data Treatment */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight mb-6 border-b border-[#E4E9E6] pb-3">
            How CarbonAlpha Treats Data
          </h2>
          <div className="bg-[#10231C] p-6 rounded-xl border border-[#0B4A3D]">
            <p className="text-sm text-[#E4E9E6] leading-relaxed mb-6">
              CarbonAlpha draws a hard line between what is <strong>real</strong> and what is <strong>modelled</strong>. Every figure in the platform is labelled as one of:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs font-bold text-white mb-1">FACT</div>
                <div className="text-[10px] text-[#A3B3AB] leading-relaxed">Sourced from an official regulatory document.</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs font-bold text-white mb-1">CALCULATION</div>
                <div className="text-[10px] text-[#A3B3AB] leading-relaxed">Deterministically derived from entered data.</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs font-bold text-white mb-1">MODEL</div>
                <div className="text-[10px] text-[#A3B3AB] leading-relaxed">Output from a validated machine-learning benchmark.</div>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs font-bold text-white mb-1">SCENARIO</div>
                <div className="text-[10px] text-[#A3B3AB] leading-relaxed">Assumption chosen for stress-testing.</div>
              </div>
              <div className="p-3 bg-[#FEF7E8]/10 border border-[#C98A1E]/30 rounded-lg">
                <div className="text-xs font-bold text-[#C98A1E] mb-1">SYNTHETIC</div>
                <div className="text-[10px] text-[#A3B3AB] leading-relaxed">Demonstration data where a real facility hasn't yet been onboarded.</div>
              </div>
            </div>
            <p className="text-sm text-[#E4E9E6] leading-relaxed mt-6 italic">
              "Nothing is presented with more certainty than it has actually earned — a design principle carried through every screen, not just a footnote."
            </p>
          </div>
        </section>

        {/* Section: The Engine */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight mb-6 border-b border-[#E4E9E6] pb-3">
            The Engine Underneath
          </h2>
          <div className="glass-panel p-6 rounded-xl border-[#E4E9E6] flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-[#0B4A3D] text-white flex flex-shrink-0 items-center justify-center shadow-lg shadow-emerald-950/20">
              <Database className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#4B5A54] leading-relaxed">
              A deterministic calculation core (carbon/GEI/financial engines) that never has its arithmetic overridden by AI; specialized machine-learning models (peer benchmarking, anomaly detection) trained and evaluated with reported accuracy and honest confidence levels rather than presented as infallible; and an AI explanation layer that turns the calculated results into plain-language reasoning without ever being allowed to invent a number.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#0B4A3D] to-[#10231C] p-8 sm:p-12 rounded-xl border border-[#0B4A3D] text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to evaluate your carbon position?</h2>
            <p className="text-sm text-[#E4E9E6] mb-8 max-w-xl mx-auto">
              Calculate your facility's baseline, benchmark against peers, and find the optimal capital allocation strategy under CCTS.
            </p>
            <Link 
              href="/industrial-intelligence"
              className="inline-flex items-center space-x-2 bg-white text-[#10231C] hover:bg-[#F6F8F7] px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-lg"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
      <ProvenanceFooter />
    </div>
  );
}
