"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, BarChart2, Shield, TrendingDown, Zap, ExternalLink, CheckCircle2,
} from "lucide-react";
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Header } from "@/components/navigation/Header";
import { StatCounter } from "@/components/ui/StatCounter";
import { SectorCard, SHARED_SECTORS } from "@/components/ui/SectorCard";
import { AangaraHeroCore } from "@/components/hero/AangaraHeroCore";

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-revealed"); }),
      { threshold: 0.10 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const FEATURES = [
  {
    icon: BarChart2,
    title: "Statutory Carbon Position",
    desc: "Deterministic computation of Scope 1 fuel & process, Scope 2 grid emissions, and statutory CCC liability against gazetted baseline trajectories.",
  },
  {
    icon: TrendingDown,
    title: "Calibrated Peer Benchmarking",
    desc: "Rank your plant against 252,000+ calibrated facility baselines aligned to BEE PAT cycles and ASI manufacturing censuses.",
  },

  {
    icon: Zap,
    title: "Techno-Economic Opportunity Matrix",
    desc: "Evaluates WHRS, renewable PPAs, fuel switching, and motor retrofits with 10-year NPV, MAC (INR/tCO₂e), and BEE methodology codes.",
  },
  {
    icon: Shield,
    title: "BUY vs BUILD vs HYBRID Twin",
    desc: "Multi-criteria capital optimization comparing market certificate purchases vs capital project execution under operational delay risks.",
  },
];

export default function HomePage() {
  useRevealOnScroll();

  return (
    <div className="min-h-screen bg-[#F5F2F3]">
      {/* Accessible skip-link only */}
      <UtilityBar />
      <Header />

      <main id="main-content">
        {/* ═══════════════════════════════════════════════════════════════
            HERO — Full screen, integrated living flame atmosphere
            Left: Headline, explanation & CTAs enter immediately
            Right: Scaled-up Canvas Animated Fiery Eye + Logo + Persistent Flame
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#F5F2F3] min-h-[calc(100vh-4rem)] flex flex-col justify-center">
          <div className="relative max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

              {/* ── Left: Text Block — 5 columns ── */}
              <div className="lg:col-span-5 z-20 flex flex-col justify-center">
                {/* Headline */}
                <h1 className="font-display text-[2.6rem] sm:text-[3.2rem] lg:text-[3.8rem] xl:text-[4.2rem] font-bold leading-[1.06] tracking-tight mb-6 text-[#1F4D2E]">
                  <span className="block ca-title-line-1">
                    Turn statutory carbon
                  </span>
                  <span className="block ca-title-line-2">
                    compliance into{" "}
                    <span className="italic text-gradient-flame drop-shadow-sm">
                      capital advantage
                    </span>
                  </span>
                </h1>

                {/* Body copy */}
                <p className="text-base sm:text-lg text-[#4A5446] mb-8 max-w-xl leading-relaxed font-medium ca-hero-paragraph">
                  Deterministic GHG emission intensity accounting, empirical peer distributions,
                  and BUY / BUILD / HYBRID capital allocation for India&apos;s obligated industrial entities.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 ca-hero-cta">
                  <Link
                    href="/industrial-intelligence"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[8px] bg-[#1F4D2E] hover:bg-[#27643A] text-[#F5F2F3] font-semibold text-sm shadow-sm hover:shadow-[0_8px_24px_rgba(31,77,46,0.28)] transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span>Launch Facility Intelligence</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/decision"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[8px] bg-white hover:bg-[#F5F2F3] border border-[#CFC8C2] text-[#1F4D2E] font-semibold text-sm transition-all duration-200"
                  >
                    <span>View Decision Twin</span>
                  </Link>
                </div>

                {/* Trust line */}
                <div className="mt-8 flex items-center gap-2 text-[11px] text-[#6B7268] font-mono ca-hero-cta">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B8A4A]" />
                  <span>Verified against Gazette G.S.R. 25(E) · Jan 2026</span>
                </div>
              </div>

              {/* ── Right: Scaled-Up Persistent Flame Hero Core — 7 columns ── */}
              <div className="lg:col-span-7 flex items-center justify-center lg:justify-end mt-4 lg:mt-0 relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[620px] z-10">
                <AangaraHeroCore />
              </div>
            </div>
          </div>

          {/* Gradient transition into stats strip */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-[#EBE6E3]/60 pointer-events-none" />
        </section>


        {/* ═══════════════════════════════════════════════════════════════
            STAT COUNTERS — 4 headline numbers
        ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-[#EBE6E3] border-b border-[#E8E2DC] py-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { value: 7,   suffix: "",       label: "CCTS Sectors Active",   sub: "Phase 1 Binding Gazette" },
                { value: 490, suffix: "+",      label: "Obligated Facilities",  sub: "Under G.S.R. 25(E)" },
                { value: 252, suffix: "k",      label: "Calibrated Baselines",  sub: "BEE PAT Aligned Data" },
                { value: 3,   suffix: " Routes",label: "Capital Strategies",    sub: "BUY · BUILD · HYBRID" },
              ].map(({ value, suffix, label, sub }) => (
                <div key={label} className="text-center reveal-on-scroll">
                  <div className="text-3xl sm:text-4xl font-bold text-[#1F4D2E] tnum font-sans tracking-tight">
                    <StatCounter value={value} suffix={suffix} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1A1C18] mt-1">{label}</div>
                  <div className="text-[11px] text-[#6B7268] mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRECISION ENGINES — 4 feature cards
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
            <p className="text-xs font-mono font-bold text-[#D9531E] uppercase tracking-widest mb-3">
              Analytical Engines
            </p>
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
                className="reveal-on-scroll bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting hover:shadow-hover hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                <div className="w-11 h-11 rounded-lg bg-[#E8F2EB] flex items-center justify-center text-[#1F4D2E] mb-4 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#1A1C18] mb-2">{title}</h3>
                <p className="text-xs text-[#4B5A54] leading-relaxed flex-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CCTS SECTORS — 3×3 grid
        ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-[#F6F8F7] border-y border-[#E4E9E6] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 reveal-on-scroll">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1F4D2E] uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B8A4A]" />
                  <span>Statutory Coverage Register</span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#10231C]">
                  CCTS Industrial Sectors
                </h2>
                <p className="text-sm text-[#4B5A54] mt-1 max-w-lg">
                  Active statutory compliance trajectories and draft consultation scope verified against MoEFCC notifications.
                </p>
              </div>
              <Link
                href="/overview"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F4D2E] hover:text-[#27643A] px-3.5 py-2 rounded-lg bg-white border border-[#E4E9E6] shadow-resting transition-colors whitespace-nowrap"
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

        {/* ═══════════════════════════════════════════════════════════════
            AUTHORITY BANNER — regulatory provenance
        ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-[#1F4D2E] py-16 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#F2984A] mb-2">
              Authoritative Reference Base
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8">
              Calibrated to India&apos;s Statutory Gazette Architecture
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { abbr: "BEE",    title: "Bureau of Energy Efficiency",   note: "Methodologies & Baseline Targets" },
                { abbr: "MoEFCC", title: "Min. of Environment & Climate", note: "Gazette G.S.R. 25(E) & 517(E)" },
                { abbr: "CERC",   title: "Central Electricity Reg. Comm.",note: "CCC Certificate Market Rules" },
                { abbr: "CEA",    title: "Central Electricity Authority", note: "National Grid EF (0.716)" },
                { abbr: "ACVA",   title: "Accredited Carbon Verifiers",   note: "MRV Audit Criteria" },
              ].map(({ abbr, title, note }) => (
                <div key={abbr} className="bg-white/10 border border-white/15 rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                  <div className="font-mono font-bold text-lg text-[#6EE7B7] mb-1">{abbr}</div>
                  <div className="text-xs font-semibold text-white mb-0.5">{title}</div>
                  <div className="text-[10px] text-white/60">{note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════════ */}
        <footer className="bg-white border-t border-[#E8E2DC] py-14 px-4 sm:px-6 lg:px-8 text-sm">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image src="/aangara-icon.png" alt="AANGARA" fill className="object-contain" sizes="32px" />
                </div>
                <div>
                  <div className="font-bold text-[#1A1C18] leading-tight">AANGARA</div>
                  <div className="text-[9px] text-[#6B7268] uppercase tracking-widest leading-none mt-0.5">
                    CCTS Decision Intelligence Architecture
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#4A5446] leading-relaxed max-w-md mb-4">
                Independent analytical twin for India&apos;s Carbon Credit Trading Scheme (CCTS). Evaluates statutory
                obligations, peer distributions, and capital strategies. Not an official Government of India entity.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B7268]">
                <span className="w-2 h-2 rounded-full bg-[#5B8A4A]" />
                <span>Verified against Gazette G.S.R. 25(E) (Jan 2026)</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1C18] mb-3">Analytical Modules</h4>
              <ul className="space-y-2 text-xs text-[#4A5446]">
                <li><Link href="/industrial-intelligence" className="hover:text-[#1F4D2E] transition-colors">Facility Intelligence Wizard</Link></li>
                <li><Link href="/decision" className="hover:text-[#1F4D2E] transition-colors">BUY / BUILD / HYBRID Twin</Link></li>
                <li><Link href="/overview" className="hover:text-[#1F4D2E] transition-colors">National Sector Portfolio</Link></li>
                <li><Link href="/scenarios" className="hover:text-[#1F4D2E] transition-colors">Stress Scenario Modeling</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1C18] mb-3">Evidence & Trust</h4>
              <ul className="space-y-2 text-xs text-[#4A5446]">
                <li><Link href="/sources" className="hover:text-[#1F4D2E] transition-colors">Evidence Center & Gazette Log</Link></li>
                <li><Link href="/trust" className="hover:text-[#1F4D2E] transition-colors">Trust Center & Model Cards</Link></li>
                <li><span className="text-[#6B7268]">Model: AANGARA-MVP-1.0</span></li>
                <li><span className="text-[#6B7268]">Data Version: REG-2026-08</span></li>
              </ul>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto pt-6 border-t border-[#E8E2DC] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B7268]">
            <span>© 2026 AANGARA — Commercial Decision Support Platform.</span>
            <span className="font-mono text-[#1F4D2E] font-medium">
              India CCTS Statutory Intelligence Architecture
            </span>
          </div>

        </footer>
      </main>
    </div>
  );
}