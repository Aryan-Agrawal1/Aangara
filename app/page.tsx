"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart2, Shield, TrendingDown, Zap, ExternalLink, Factory, CheckCircle2 } from "lucide-react";
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Header } from "@/components/navigation/Header";
import { StatCounter } from "@/components/ui/StatCounter";
import { Badge } from "@/components/ui/Badge";
import { SectorCard, SHARED_SECTORS } from "@/components/ui/SectorCard";

import { CarbonIntelligenceCore } from "@/components/hero/CarbonIntelligenceCore";

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-revealed"); }), { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const FEATURES = [
  {
    icon: BarChart2,
    title: "Statutory Carbon Position",
    desc: "Deterministic computation of Scope 1 fuel & process, Scope 2 grid emissions, and statutory CCC liability against gazetted baseline trajectories."
  },
  {
    icon: TrendingDown,
    title: "Calibrated Peer Benchmarking",
    desc: "Rank your plant against 252,000+ synthetic facility baselines calibrated to BEE PAT cycles and ASI manufacturing censuses."
  },
  {
    icon: Zap,
    title: "Techno-Economic Opportunity Matrix",
    desc: "Evaluates WHRS, renewable PPAs, fuel switching, and motor retrofits with 10-year NPV, MAC (INR/tCO2e), and BEE methodology codes."
  },
  {
    icon: Shield,
    title: "BUY vs BUILD vs HYBRID Twin",
    desc: "Multi-criteria capital optimization comparing market certificate purchases vs capital project execution under operational delay risks."
  }
];

export default function HomePage() {
  useRevealOnScroll();
  const [heroSettled, setHeroSettled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reducedMotionAttr = document.documentElement.getAttribute('data-reduced-motion') === 'true';
    const hasAnimated = typeof window !== 'undefined' && sessionStorage.getItem('ca_hero_animated_v1');

    if (prefersReducedMotion || reducedMotionAttr || hasAnimated) {
      setHeroSettled(true);
      return;
    }

    const timer = setTimeout(() => {
      setHeroSettled(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <UtilityBar />
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-surface-base text-brand-primary">
          {/* Subtle light background wash and texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none">
            <Image
              src="/images/hero/hero_industrial.jpg"
              alt="Industrial Carbon Facility"
              fill
              priority
              className="object-cover object-[center_40%] grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-surface-base via-surface-base/90 to-[#E2DFE1]/60" />
          
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
              
              {/* Text Block - 5 columns (approx 42%) */}
              <div className="lg:col-span-5 z-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-xs font-semibold mb-6 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-accent-fresh-deep animate-pulse shadow-[0_0_8px_rgba(140,169,73,0.6)]" />
                  <span>India CCTS Compliance Ready · BEE Gazette G.S.R. 25(E)</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6 text-brand-primary">
                  <span className={`block transition-all duration-700 ease-out ${heroSettled ? 'opacity-100 translate-y-0' : 'ca-title-line-1'}`}>
                    Turn statutory carbon
                  </span>
                  <span className={`block transition-all duration-700 ease-out ${heroSettled ? 'opacity-100 translate-y-0' : 'ca-title-line-2'}`}>
                    compliance into <span className="italic text-accent-fresh-deep drop-shadow-sm">capital advantage</span>
                  </span>
                </h1>

                <p className={`text-base sm:text-lg text-text-secondary mb-8 max-w-lg leading-relaxed font-medium transition-all duration-700 ease-out ${heroSettled ? 'opacity-100 translate-y-0' : 'ca-hero-paragraph'}`}>
                  Deterministic GHG emission intensity (GEI) accounting, empirical peer distributions, and BUY / BUILD / HYBRID capital allocation for India&apos;s obligated industrial entities.
                </p>

                <div className={`flex flex-wrap items-center gap-3.5 transition-all duration-700 ease-out ${heroSettled ? 'opacity-100 translate-y-0' : 'ca-hero-cta'}`}>
                  <Link
                    href="/industrial-intelligence"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-brand-primary hover:bg-brand-primary-hover text-surface-base font-semibold text-sm shadow-resting hover:shadow-[0_8px_24px_rgba(11,74,61,0.25)] transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span>Launch Facility Intelligence</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/decision"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-surface-base hover:bg-surface-subtle border border-surface-border-strong text-brand-primary font-semibold text-sm shadow-sm transition-all duration-200"
                  >
                    <span>View Decision Twin</span>
                  </Link>
                </div>
              </div>

              {/* Centerpiece: Carbon Intelligence Core Atom Graphic - 7 columns */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-end justify-center mt-8 lg:mt-0 relative w-full min-h-[450px] lg:min-h-[650px] z-10">
                <CarbonIntelligenceCore />
              </div>
            </div>
          </div>

          {/* Section Transition Divider Gradient */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-surface-subtle pointer-events-none" />

          {/* Staggered Line Keyframes */}
          <style jsx>{`
            @keyframes heroLineReveal {
              0% {
                opacity: 0;
                transform: translateY(18px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .ca-title-line-1 {
              animation: heroLineReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
            }
            .ca-title-line-2 {
              animation: heroLineReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.15s both;
            }
            .ca-hero-paragraph {
              animation: heroLineReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.35s both;
            }
            .ca-hero-cta {
              animation: heroLineReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) 1.8s both;
            }
            @media (prefers-reduced-motion: reduce) {
              .ca-title-line-1,
              .ca-title-line-2,
              .ca-hero-paragraph,
              .ca-hero-cta {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
              }
            }
          `}</style>
        </section>

        <section className="bg-[#F6F8F7] border-b border-[#E4E9E6] py-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { value: 7, suffix: "", label: "CCTS Sectors Active", sub: "Phase 1 Binding Gazette" },
                { value: 490, suffix: "+", label: "Obligated Facilities", sub: "Under G.S.R. 25(E)" },
                { value: 252, suffix: "k", label: "Calibrated Baselines", sub: "BEE PAT Aligned Data" },
                { value: 3, suffix: " Routes", label: "Capital Strategies", sub: "BUY · BUILD · HYBRID" }
              ].map(({ value, suffix, label, sub }) => (
                <div key={label} className="text-center reveal-on-scroll">
                  <div className="text-3xl sm:text-4xl font-bold text-[#0B4A3D] tnum font-sans tracking-tight">
                    <StatCounter value={value} suffix={suffix} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#10231C] mt-1">{label}</div>
                  <div className="text-[11px] text-[#6B7A72] mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#10231C] mb-3">
              Precision Engines for Industrial Carbon Strategy
            </h2>
            <p className="text-sm sm:text-base text-[#4B5A54] leading-relaxed">
              From plant-floor thermal streams to board-level capital allocation in four deterministic analytical steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="reveal-on-scroll bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting hover:shadow-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-lg bg-[#E8F5F2] flex items-center justify-center text-[#0B4A3D] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#10231C] mb-2">{title}</h3>
                  <p className="text-xs text-[#4B5A54] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#F6F8F7] border-y border-[#E4E9E6] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 reveal-on-scroll">
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#0B4A3D] uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F8A5F]" />
                  <span>Statutory Coverage Register</span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#10231C]">
                  CCTS Industrial Sectors
                </h2>
                <p className="text-sm text-[#4B5A54] mt-1">
                  Active statutory compliance trajectories and draft consultation scope verified against MoEFCC notifications.
                </p>
              </div>
              <Link
                href="/overview"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B4A3D] hover:text-[#0E5C4C] px-3.5 py-2 rounded-lg bg-white border border-[#E4E9E6] shadow-resting transition-colors"
              >
                <span>National Sector Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHARED_SECTORS.map((sector) => (
                <SectorCard key={sector.name} {...sector} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0B4A3D] py-16 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#6EE7B7] mb-2">
              Authoritative Reference Base
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8">
              Calibrated to India&apos;s Statutory Gazette Architecture
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { abbr: "BEE", title: "Bureau of Energy Efficiency", note: "Methodologies & Baseline Targets" },
                { abbr: "MoEFCC", title: "Min. of Environment & Climate", note: "Gazette G.S.R. 25(E) & 517(E)" },
                { abbr: "CERC", title: "Central Electricity Reg. Comm.", note: "CCC Certificate Market Rules" },
                { abbr: "CEA", title: "Central Electricity Authority", note: "National Grid EF (0.716)" },
                { abbr: "ACVA", title: "Accredited Carbon Verifiers", note: "MRV Audit Criteria" }
              ].map(({ abbr, title, note }) => (
                <div key={abbr} className="bg-white/10 border border-white/15 rounded-xl p-4 text-center">
                  <div className="font-mono font-bold text-lg text-[#6EE7B7] mb-1">{abbr}</div>
                  <div className="text-xs font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-[10px] text-white/60">{note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-white border-t border-[#E4E9E6] py-14 px-4 sm:px-6 lg:px-8 text-sm">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0B4A3D] flex items-center justify-center shadow-resting">
                  <span className="text-white font-bold text-xs font-mono">Ca</span>
                </div>
                <div>
                  <div className="font-semibold text-[#10231C] leading-tight">CarbonAlpha India</div>
                  <div className="text-[10px] text-[#6B7A72] uppercase tracking-widest leading-none mt-0.5">CCTS Decision Intelligence</div>
                </div>
              </div>
              <p className="text-xs text-[#4B5A54] leading-relaxed max-w-md mb-4">
                Independent analytical twin for India&apos;s Carbon Credit Trading Scheme (CCTS). Evaluates statutory obligations, peer distributions, and capital strategies. Not an official Government of India entity.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B7A72]">
                <span className="w-2 h-2 rounded-full bg-[#1F8A5F]" />
                <span>Verified against Gazette G.S.R. 25(E) (Jan 2026)</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#10231C] mb-3">Analytical Modules</h4>
              <ul className="space-y-2 text-xs text-[#4B5A54]">
                <li><Link href="/industrial-intelligence" className="hover:text-[#0B4A3D] transition-colors">Facility Intelligence Wizard</Link></li>
                <li><Link href="/decision" className="hover:text-[#0B4A3D] transition-colors">BUY / BUILD / HYBRID Twin</Link></li>
                <li><Link href="/overview" className="hover:text-[#0B4A3D] transition-colors">National Sector Portfolio</Link></li>
                <li><Link href="/scenarios" className="hover:text-[#0B4A3D] transition-colors">Stress Scenario Modeling</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#10231C] mb-3">Evidence &amp; Trust</h4>
              <ul className="space-y-2 text-xs text-[#4B5A54]">
                <li><Link href="/sources" className="hover:text-[#0B4A3D] transition-colors">Evidence Center &amp; Gazette Log</Link></li>
                <li><Link href="/trust" className="hover:text-[#0B4A3D] transition-colors">Trust Center &amp; Model Cards</Link></li>
                <li><span className="text-[#6B7A72]">Model: CA-MVP-1.0</span></li>
                <li><span className="text-[#6B7A72]">Data Version: REG-2026-08</span></li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto pt-6 border-t border-[#E4E9E6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B7A72]">
            <span>(c) 2026 CarbonAlpha India - Commercial Decision Support Platform.</span>
            <span className="font-mono bg-[#FEF7E8] text-[#C98A1E] px-2 py-0.5 rounded border border-[#C98A1E]/30">
              SYNTHETIC DEMONSTRATION ENVIRONMENT
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}