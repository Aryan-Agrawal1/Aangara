'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Header } from '@/components/navigation/Header';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { TeamSection } from '@/components/about/TeamSection';
import { SHARED_SECTORS } from "@/components/ui/SectorCard";
import { 
  Building2, LineChart, Sliders, ShieldCheck, 
  ArrowRight, Activity, Zap, Factory, CheckCircle2,
  Database, Network, Scale
} from 'lucide-react';

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-revealed"); }), { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Sector Card with NO images (clean text box per user request) ── */
function SectorBoxCard({
  name,
  status,
  statusText,
  subSector,
  desc,
}: {
  name: string;
  status: 'final' | 'draft' | 'watchlist';
  statusText: string;
  subSector: string;
  desc: string;
}) {
  const isFinal = status === 'final';
  const isDraft = status === 'draft';

  return (
    <div className="card-glass rounded-xl p-5 border-[#E8E2DC] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-hover hover:border-[#1F4D2E]/40 group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#5B8A4A] uppercase">
            {subSector}
          </span>
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              isFinal
                ? 'bg-[#E8F2EB] text-[#1F4D2E] border-[#1F4D2E]/25'
                : isDraft
                ? 'bg-[#FEF0E6] text-[#D9531E] border-[#D9531E]/30'
                : 'bg-[#FEF7E8] text-[#C98A1E] border-[#C98A1E]/30'
            }`}
          >
            {statusText}
          </span>
        </div>

        <h3 className="text-base font-bold text-[#1A1C18] mb-2 group-hover:text-[#1F4D2E] transition-colors">
          {name}
        </h3>

        <p className="text-xs text-[#4A5446] leading-relaxed line-clamp-3 mb-4">
          {desc}
        </p>
      </div>

      <div className="pt-3 border-t border-[#E8E2DC]">
        <Link
          href={`/industrial-intelligence?sector=${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F4D2E] group-hover:text-[#D9531E] transition-colors"
        >
          <span>Analyse Facility</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';

const LogoLoop = dynamic(() => import('@/components/ui/LogoLoop'), { ssr: false });

/* ── Tech Stack items for LogoLoop ── */
const TECH_STACK_ITEMS = [
  { name: 'Next.js',      abbr: 'NX',  color: '#000000' },
  { name: 'React 19',     abbr: '⚛',   color: '#61DAFB' },
  { name: 'TypeScript',   abbr: 'TS',  color: '#3178C6' },
  { name: 'Tailwind CSS', abbr: 'TW',  color: '#06B6D4' },
  { name: 'Recharts',     abbr: 'RC',  color: '#3B82F6' },
  { name: 'Zustand',      abbr: 'ZS',  color: '#F97316' },
  { name: 'FastAPI',      abbr: 'FA',  color: '#059669' },
  { name: 'Pydantic',     abbr: 'Py',  color: '#E92063' },
  { name: 'scikit-learn', abbr: 'sk',  color: '#F97316' },
  { name: 'Pandas',       abbr: 'pd',  color: '#150458' },
  { name: 'NumPy',        abbr: 'np',  color: '#4D77CF' },
  { name: 'OGL / WebGL',  abbr: 'GL',  color: '#D9531E' },
  { name: 'Vitest',       abbr: 'Vi',  color: '#6E40C9' },
  { name: 'Playwright',   abbr: 'PW',  color: '#45BA4B' },
];


export default function AboutPage() {
  useRevealOnScroll();

  return (
    <div className="min-h-screen bg-[#F5F2F3] flex flex-col">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ── Page Hero ── */}
        <div className="mb-12 max-w-4xl reveal-on-scroll">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/20">
              ABOUT THE PLATFORM
            </span>
            <span className="text-[10px] font-mono text-[#6B7268]">Produced by Terranex</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1C18] tracking-tight mb-4">
            AANGARA — CCTS Decision Intelligence
          </h1>
          <p className="text-base text-[#4A5446] leading-relaxed">
            AANGARA is a carbon-market decision-intelligence platform for Indian industrial facilities operating under the Carbon Credit Trading Scheme (CCTS). It connects a facility's production and emissions data, the current Indian regulatory framework, decarbonisation project economics, and financial scenario modelling into one transparent decision workflow — so an industrial operator can understand where they stand, what their options cost, and why a given strategy is recommended, before committing capital.
          </p>
        </div>

        {/* ── What AANGARA Does ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-6 border-b border-[#E8E2DC] pb-3">
            What AANGARA Does
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: LineChart, title: 'Statutory Carbon Position', desc: 'Computes Scope 1 fuel & process, Scope 2 grid emissions, and CCC liability against gazetted GEI baseline trajectories.' },
              { icon: Building2, title: 'Peer Benchmarking', desc: 'Ranks your plant against 252,000+ calibrated facility baselines aligned to BEE PAT cycles and ASI manufacturing censuses.' },
              { icon: Activity, title: 'Opportunity Matrix', desc: 'Evaluates WHRS, renewable PPAs, fuel switching, and motor retrofits with 10-year NPV, MAC (INR/tCO₂e), and BEE methodology codes.' },
              { icon: ShieldCheck, title: 'Risk & Consequence', desc: 'Decomposes the recommendation into financial, environmental, regulatory, and execution risk components — the "why" is always visible.' },
            ].map((feat) => (
              <div key={feat.title} className="card-glass p-5 rounded-xl border-[#E8E2DC] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#E8F2EB] text-[#1F4D2E] flex items-center justify-center mb-4">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1C18] mb-2">{feat.title}</h3>
                  <p className="text-xs text-[#4A5446] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-6 border-b border-[#E8E2DC] pb-3">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-xl border-[#E8E2DC] overflow-x-auto">
            {['Select Sector', 'Enter Facility Data', 'Engine Calculates Position', 'Compare Strategies', 'Stress-Test Scenarios'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#1A1C18] whitespace-nowrap">
                  <span className="w-6 h-6 rounded-full bg-[#1F4D2E] text-white flex items-center justify-center text-[10px]">{i + 1}</span>
                  <span>{step}</span>
                </div>
                {i < 4 && <ArrowRight className="w-4 h-4 text-[#E8E2DC] hidden md:block flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ── Built on India's Actual Regulatory Framework ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-6 border-b border-[#E8E2DC] pb-3">
            Built on India&apos;s Actual Regulatory Framework
          </h2>
          <div className="glass-panel p-6 rounded-xl border-[#E8E2DC] text-sm text-[#4A5446] leading-relaxed space-y-3">
            <p>
              AANGARA&apos;s calculations are grounded in the actual Indian regulatory architecture governing industrial carbon compliance — not a generic global carbon-accounting model.
            </p>
            <p>
              The platform tracks the <strong className="text-[#1A1C18]">Carbon Credit Trading Scheme (CCTS)</strong>, notified under the Energy Conservation Act, 2001 (as amended in 2022), which established India&apos;s compliance mechanism for <strong className="text-[#1A1C18]">Greenhouse Gas Emission Intensity (GEI)</strong> targets across energy-intensive industrial sectors.
            </p>
            <p>
              AANGARA references primary sources including <strong className="text-[#1A1C18]">Bureau of Energy Efficiency (BEE)</strong>, <strong className="text-[#1A1C18]">Ministry of Environment, Forest and Climate Change (MoEFCC)</strong>, and <strong className="text-[#1A1C18]">Central Electricity Regulatory Commission (CERC)</strong> for regulatory targets, emission factors, and methodology structure — every regulatory figure is versioned and dated back to its official gazette source.
            </p>
          </div>
        </section>

        {/* ── Sectors Covered (Clean Text Cards — No Images per User Instruction) ── */}
        <section className="mb-12 reveal-on-scroll">
          <div className="flex items-center justify-between mb-6 border-b border-[#E8E2DC] pb-3">
            <div>
              <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight">
                Sectors Covered
              </h2>
              <p className="text-xs text-[#6B7268] mt-0.5">
                Obligated industrial sectors with gazetted CCTS trajectories and draft scopes.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/20">
              9 SECTORS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHARED_SECTORS.map((sector) => (
              <SectorBoxCard
                key={sector.name}
                name={sector.name}
                status={sector.status}
                statusText={sector.statusText}
                subSector={sector.subSector}
                desc={sector.desc}
              />
            ))}
          </div>
        </section>

        {/* ── Data Treatment ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-6 border-b border-[#E8E2DC] pb-3">
            How AANGARA Treats Data
          </h2>
          <div className="bg-[#1A1C18] p-6 rounded-xl border border-[#1F4D2E]">
            <p className="text-sm text-[#E8E2DC] leading-relaxed mb-6">
              AANGARA draws a hard line between what is <strong>real</strong> and what is <strong>modelled</strong>. Every figure is labelled as one of:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'FACT',        desc: 'Sourced from an official regulatory document.', color: '#2E6BA8' },
                { label: 'CALCULATION', desc: 'Deterministically derived from entered data.',  color: '#1F8A5F' },
                { label: 'MODEL',       desc: 'Output from a validated ML benchmark.',         color: '#7C3AED' },
                { label: 'SCENARIO',    desc: 'Assumption chosen for stress-testing.',          color: '#C98A1E' },
                { label: 'BENCHMARK',   desc: 'Calibrated industrial baseline distribution.',   color: '#6B7268' },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.label}</div>
                  <div className="text-[10px] text-[#A3B3AB] leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Engine Underneath ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-6 border-b border-[#E8E2DC] pb-3">
            The Engine Underneath
          </h2>
          <div className="card-glass p-6 rounded-xl border-[#E8E2DC] flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-[#1F4D2E] text-white flex flex-shrink-0 items-center justify-center shadow-lg">
              <Database className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#4A5446] leading-relaxed">
              A deterministic calculation core (carbon/GEI/financial engines) that never has its arithmetic overridden by AI; specialized machine-learning models (peer benchmarking, anomaly detection) trained and evaluated with reported accuracy and honest confidence levels; and an AI explanation layer that turns the calculated results into plain-language reasoning without ever being allowed to invent a number.
            </p>
          </div>
        </section>

        {/* ── Technology & Intelligence Stack — LogoLoop Marquee ── */}
        <section className="mb-12 reveal-on-scroll">
          <div className="border-b border-[#E8E2DC] pb-3 mb-6">
            <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight">
              Technology &amp; Intelligence Stack
            </h2>
            <p className="text-xs text-[#6B7268] mt-1">
              Actual project dependencies — not partnerships or affiliations.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E8E2DC] py-5 overflow-hidden">
            <LogoLoop
              items={TECH_STACK_ITEMS}
              speed={55}
              direction="left"
              pauseOnHover={true}
              fadeOut={true}
              fadeColor="#ffffff"
              gap={20}
            />
          </div>
        </section>

        {/* ── Team Section (Exact 6 Members & Socials Preserved) ── */}
        <TeamSection />

        {/* ── CTA ── */}
        <section className="mb-12 reveal-on-scroll">
          <div className="bg-gradient-to-br from-[#1F4D2E] to-[#1A1C18] p-8 sm:p-12 rounded-xl border border-[#1F4D2E] text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to evaluate your carbon position?</h2>
            <p className="text-sm text-[#E8E2DC] mb-8 max-w-xl mx-auto">
              Calculate your facility&apos;s baseline, benchmark against peers, and find the optimal capital allocation strategy under CCTS.
            </p>
            <Link
              href="/industrial-intelligence"
              className="inline-flex items-center gap-2 bg-white text-[#1A1C18] hover:bg-[#F5F2F3] px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-lg"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── Terranex Attribution ── */}
        <div className="text-center py-6 border-t border-[#E8E2DC]">
          <p className="text-xs text-[#6B7268] font-mono">
            Produced by <span className="font-bold text-[#1F4D2E]">Terranex</span>
          </p>
        </div>

      </main>
      <ProvenanceFooter verifiedDate="2026-08-24" />
    </div>
  );
}
