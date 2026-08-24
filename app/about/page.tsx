'use client';

import React from 'react';
import Image from 'next/image';
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
import { useEffect } from 'react';

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-revealed"); }), { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── ChromaGrid — grayscale→color hover tiles for About page sectors ── */
function SectorChromaTile({ name, imagePath, status }: { name: string; imagePath: string; status: string }) {
  const isFinal = status === 'FINAL';
  return (
    <div className="chroma-tile aspect-[4/3] group cursor-pointer">
      <Image
        src={imagePath}
        alt={name}
        fill
        className="object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 280px"
      />
      <div className="chroma-tile-overlay" />
      {/* Status badge */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
          isFinal
            ? 'bg-[#1F4D2E] text-white'
            : 'bg-[#D9531E]/90 text-white'
        }`}>
          {isFinal ? 'FINAL' : 'DRAFT'}
        </span>
      </div>
      {/* Name label — always visible */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-3">
        <div className="text-white text-sm font-bold leading-tight drop-shadow-lg">{name}</div>
      </div>
    </div>
  );
}

/* ── Tech stack logo loop marquee ── */
const TECH_STACK = [
  { label: 'Next.js',       icon: 'N',  color: '#000000', bg: '#000' },
  { label: 'React',         icon: '⚛',  color: '#61DAFB', bg: '#222' },
  { label: 'Tailwind CSS',  icon: '~',  color: '#06B6D4', bg: '#F0FDFE' },
  { label: 'Recharts',      icon: 'Re', color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Zustand',       icon: '🐻', color: '#F97316', bg: '#FFF7ED' },
  { label: 'TypeScript',    icon: 'TS', color: '#3178C6', bg: '#EFF6FF' },
  { label: 'FastAPI',       icon: '⚡', color: '#059669', bg: '#ECFDF5' },
  { label: 'Pydantic',      icon: 'Py', color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'scikit-learn',  icon: 'sk', color: '#F97316', bg: '#FFF7ED' },
  { label: 'Pandas',        icon: 'pd', color: '#150458', bg: '#F5F3FF' },
  { label: 'NumPy',         icon: 'np', color: '#4F8CE2', bg: '#EFF6FF' },
  { label: 'OGL',           icon: '◼',  color: '#D9531E', bg: '#FEF0E6' },
];

function LogoLoopMarquee() {
  const doubled = [...TECH_STACK, ...TECH_STACK]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E2DC] bg-white py-4 relative">
      {/* fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <div className="flex gap-6 animate-[logoScroll_28s_linear_infinite] hover:[animation-play-state:paused]">
        {doubled.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-lg border border-[#E8E2DC] shadow-sm flex-shrink-0"
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: tech.bg, color: tech.color }}
            >
              {tech.icon}
            </div>
            <span className="text-xs font-semibold text-[#1A1C18] whitespace-nowrap">{tech.label}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes logoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ── ProfileCard — team member card with glare-on-hover effect ── */
function ProfileCard({
  name, initials, role, linkedin, github, email
}: {
  name: string; initials: string; role?: string;
  linkedin?: string; github?: string; email?: string;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--glare-x', `${x}%`);
    card.style.setProperty('--glare-y', `${y}%`);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--glare-x', '50%');
    card.style.setProperty('--glare-y', '50%');
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="profile-card relative bg-white rounded-xl border border-[#E8E2DC] overflow-hidden shadow-resting hover:shadow-hover transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col items-center text-center"
      style={{ '--glare-x': '50%', '--glare-y': '50%' } as React.CSSProperties}
    >
      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 opacity-0 hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.22) 0%, transparent 70%)',
        }}
      />
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1F4D2E] to-[#5B8A4A] flex items-center justify-center text-white font-bold text-lg mb-4 shadow-md ring-4 ring-[#E8F2EB]">
        {initials}
      </div>
      {/* Info */}
      <div className="font-bold text-[#1A1C18] text-sm mb-0.5">{name}</div>
      {role && <div className="text-[10px] text-[#6B7268] uppercase tracking-wider mb-4">{role}</div>}
      {/* Social links */}
      <div className="flex items-center gap-3 mt-auto">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#0A66C2] bg-[#0A66C2]/10 hover:bg-[#0A66C2] hover:text-white transition-colors"
            aria-label={`${name} LinkedIn`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1C18] bg-[#1A1C18]/8 hover:bg-[#1A1C18] hover:text-white transition-colors"
            aria-label={`${name} GitHub`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#D9531E] bg-[#D9531E]/10 hover:bg-[#D9531E] hover:text-white transition-colors"
            aria-label={`Email ${name}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function AboutPage() {
  useRevealOnScroll();

  const sectors = SHARED_SECTORS ?? [];
  const sectorImageMap: Record<string, string> = {
    'Cement':                '/images/sectors/cement.jpg',
    'Iron & Steel':          '/images/sectors/iron_steel.jpg',
    'Aluminium':             '/images/sectors/aluminium.jpg',
    'Chlor-Alkali':          '/images/sectors/chlor_alkali.jpg',
    'Fertiliser':            '/images/sectors/fertiliser.jpg',
    'Petrochemicals':        '/images/sectors/petrochemicals.jpg',
    'Petroleum Refinery':    '/images/sectors/petroleum_refinery.jpg',
    'Pulp & Paper':          '/images/sectors/pulp_paper.jpg',
    'Textile':               '/images/sectors/textile.jpg',
  };

  const teamMembers = [
    { name: 'Aryan Agrawal',        initials: 'AA', role: 'Co-Founder', linkedin: 'https://www.linkedin.com/in/aryan-agrawal-286685371', github: 'https://github.com/Aryan-Agrawal1', email: 'aryanagrawal458@gmail.com' },
    { name: 'Arko Roy Chowdhury',   initials: 'AR', role: 'Co-Founder', linkedin: 'https://www.linkedin.com/in/arkoroychowdhury/', github: 'https://github.com/MaxFrostbyte', email: 'arkoroychowdhury78@gmail.com' },
    { name: 'Aarav Madan',          initials: 'AM', role: 'Co-Founder', linkedin: 'https://www.linkedin.com/in/aarav-madan-7296b2371/', github: 'https://github.com/aarav-madan', email: 'aaravmadan5@gmail.com' },
    { name: 'Kanishk Agrawal',      initials: 'KA', role: 'Co-Founder', linkedin: 'https://www.linkedin.com/in/kanishk-agrawal-a8b2552ab/', github: 'https://github.com/Kanishk-Agrawal1', email: 'kanishkagrawal1208@gmail.com' },
    { name: 'Vibha Sharma',         initials: 'VS', role: 'Co-Founder', linkedin: 'https://www.linkedin.com/in/vibha-sharma-7aa6572ab/', github: 'https://github.com/Vibha-Sharma1', email: 'vibhasharma18082007@gmail.com' },
    { name: 'Vishant Parmar',       initials: 'VP', role: 'Co-Founder', linkedin: 'https://www.linkedin.com/in/vishant-parmar/', github: 'https://github.com/vishant-parmar', email: 'vishantparmar2007@gmail.com' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2F3] flex flex-col">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* ── Page Hero ── */}
        <div className="mb-12 max-w-4xl reveal-on-scroll">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/20">
              ABOUT THE PLATFORM
            </span>
            <span className="text-[10px] font-mono text-[#6B7268]">by Terranex</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1C18] tracking-tight mb-4">
            AANGARA — Carbon Intelligence Platform
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
              { icon: Building2, title: 'Peer Benchmarking', desc: 'Ranks your plant against 252,000+ synthetic facility baselines calibrated to BEE PAT cycles and ASI manufacturing censuses.' },
              { icon: Activity, title: 'Opportunity Matrix', desc: 'Evaluates WHRS, renewable PPAs, fuel switching, and motor retrofits with 10-year NPV, MAC (INR/tCO₂e), and BEE methodology codes.' },
              { icon: ShieldCheck, title: 'Risk & Consequence', desc: 'Decomposes the recommendation into financial, environmental, regulatory, and execution risk components — the "why" is always visible.' },
            ].map((feat) => (
              <div key={feat.title} className="card-glass p-5 rounded-xl border-[#E8E2DC]">
                <div className="w-10 h-10 rounded-lg bg-[#E8F2EB] text-[#1F4D2E] flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1C18] mb-2">{feat.title}</h3>
                <p className="text-xs text-[#4A5446] leading-relaxed">{feat.desc}</p>
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

        {/* ── Regulatory Framework ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-6 border-b border-[#E8E2DC] pb-3">
            Built on India's Actual Regulatory Framework
          </h2>
          <div className="glass-panel p-6 rounded-xl border-[#E8E2DC] text-sm text-[#4A5446] leading-relaxed space-y-3">
            <p>AANGARA's calculations are grounded in the actual Indian regulatory architecture governing industrial carbon compliance — not a generic global carbon-accounting model.</p>
            <p>The platform tracks the <strong className="text-[#1A1C18]">Carbon Credit Trading Scheme (CCTS)</strong>, notified under the Energy Conservation Act, 2001 (as amended in 2022), which established India's compliance mechanism for <strong className="text-[#1A1C18]">Greenhouse Gas Emission Intensity (GEI)</strong> targets across energy-intensive industrial sectors.</p>
            <p>AANGARA references primary sources including <strong className="text-[#1A1C18]">BEE</strong>, <strong className="text-[#1A1C18]">MoEFCC</strong>, and <strong className="text-[#1A1C18]">CERC</strong> for regulatory targets, emission factors, and methodology structure — every regulatory figure is versioned and dated back to its source.</p>
          </div>
        </section>

        {/* ── Sectors Covered — ChromaGrid ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-2 border-b border-[#E8E2DC] pb-3">
            Sectors Covered
          </h2>
          <p className="text-xs text-[#6B7268] mb-6">Hover each tile to reveal the sector. Greyscale → colour on interaction.</p>
          {sectors.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <SectorChromaTile
                  key={sector.name}
                  name={sector.name}
                  imagePath={sectorImageMap[sector.name] ?? `/images/sectors/${sector.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`}
                  status={sector.status ?? 'FINAL'}
                />
              ))}
            </div>
          ) : (
            <div className="card-glass p-8 rounded-xl text-center">
              <Factory className="w-8 h-8 text-[#6B7268] mx-auto mb-3" />
              <p className="text-[#4A5446] text-sm">Sector data unavailable.</p>
            </div>
          )}
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
                { label: 'SYNTHETIC',   desc: 'Demonstration data only.',                       color: '#6B7268' },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.label}</div>
                  <div className="text-[10px] text-[#A3B3AB] leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Engine ── */}
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

        {/* ── Built With — LogoLoop marquee ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-2 border-b border-[#E8E2DC] pb-3">
            Built With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="text-[11px] font-mono font-bold text-[#5B8A4A] uppercase tracking-wider px-1">Interface & Data</div>
            <div className="text-[11px] font-mono font-bold text-[#D9531E] uppercase tracking-wider px-1">Platform Intelligence</div>
          </div>
          <LogoLoopMarquee />
        </section>

        {/* ── Team — ProfileCards ── */}
        <section className="mb-12 reveal-on-scroll">
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight mb-2 border-b border-[#E8E2DC] pb-3">
            The Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembers.map((member) => (
              <ProfileCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mb-12 reveal-on-scroll">
          <div className="bg-gradient-to-br from-[#1F4D2E] to-[#1A1C18] p-8 sm:p-12 rounded-xl border border-[#1F4D2E] text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to evaluate your carbon position?</h2>
            <p className="text-sm text-[#E8E2DC] mb-8 max-w-xl mx-auto">
              Calculate your facility's baseline, benchmark against peers, and find the optimal capital allocation strategy under CCTS.
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
