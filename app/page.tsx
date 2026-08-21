"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BarChart2, Shield, TrendingDown, Zap, ExternalLink } from "lucide-react";
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Header } from "@/components/navigation/Header";
import { StatCounter } from "@/components/ui/StatCounter";
import { Badge } from "@/components/ui/Badge";

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-revealed"); }), { threshold: 0.15 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const SECTORS = [
  { name: "Cement", status: "final" as const, desc: "Phase 1 CCTS sector. GEI targets notified via G.S.R. 25(E).", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80&fit=crop" },
  { name: "Iron & Steel", status: "final" as const, desc: "Phase 1 CCTS sector. BEE GEI targets published.", img: "https://images.unsplash.com/photo-1518493563975-18adae87f1e4?w=400&q=80&fit=crop" },
  { name: "Aluminium", status: "final" as const, desc: "Phase 1 CCTS sector. GEI targets notified.", img: "https://images.unsplash.com/photo-1565793979927-4b57b571fc75?w=400&q=80&fit=crop" },
  { name: "Chlor-Alkali", status: "final" as const, desc: "Phase 1 CCTS sector. GEI targets notified.", img: "https://images.unsplash.com/photo-1581093458791-9d42cc050b0e?w=400&q=80&fit=crop" },
  { name: "Pulp & Paper", status: "draft" as const, desc: "Draft GEI targets. Final gazette notification pending.", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80&fit=crop" },
  { name: "Petrochemicals", status: "watchlist" as const, desc: "Under regulatory review for Phase 2 inclusion.", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80&fit=crop" },
  { name: "Refinery", status: "watchlist" as const, desc: "Under regulatory review for Phase 2 inclusion.", img: "https://images.unsplash.com/photo-1518704618243-b719e5d5f2b8?w=400&q=80&fit=crop" },
];

const FEATURES = [
  { icon: BarChart2, title: "Carbon Position", desc: "Calculate your GEI, Scope 1+2 emissions, and CCC surplus/deficit against CCTS targets." },
  { icon: TrendingDown, title: "Peer Benchmarking", desc: "Compare against sector peers using our ML model trained on BEE-aligned facility data." },
  { icon: Zap, title: "Opportunities", desc: "Ranked decarbonisation interventions by cost-effectiveness and abatement potential." },
  { icon: Shield, title: "Decision Intelligence", desc: "BUY vs BUILD vs HYBRID - least-cost compliance strategy with full calculation trace." },
];

export default function HomePage() {
  useRevealOnScroll();
  return (
    <div className="min-h-screen bg-white">
      <UtilityBar />
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#0B4A3D]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80&fit=crop)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B4A3D]/95 via-[#0B4A3D]/80 to-[#0B4A3D]/50" />
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-24 sm:py-32">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[#6EE7B7] animate-pulse" />
                India CCTS Phase 1 - 9 sectors notified, effective 01 Jan 2026
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight mb-6">
                Turn carbon compliance into{" "}
                <em className="not-italic" style={{ color: "#F0A875" }}>capital advantage</em>
              </h1>
              <p className="text-lg text-white/80 mb-10 max-w-xl leading-relaxed">
                Institutional-grade GEI analytics, peer benchmarking, and BUY/BUILD/HYBRID decision modelling - calibrated to BEE, MoEFCC, and CERC regulations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/industrial-intelligence" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C9622A] hover:bg-[#B5541F] text-white font-semibold text-sm shadow-lg transition-all hover:-translate-y-0.5">
                  Analyze Your Facility <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/sources" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition-all">
                  View Evidence Base <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F6F8F7] border-b border-[#E4E9E6] py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[{ value: 7, suffix: "", label: "CCTS sectors monitored", sub: "Phase 1 notified" }, { value: 20, suffix: "+", label: "Decarbonisation pathways", sub: "Cross-sector coverage" }, { value: 3, suffix: "", label: "Capital strategies modelled", sub: "BUY / BUILD / HYBRID" }, { value: 5, suffix: "", label: "Regulatory authorities", sub: "BEE / MoEFCC / CERC / CEA / CCI" }].map(({ value, suffix, label, sub }) => (
                <div key={label} className="text-center reveal-on-scroll">
                  <div className="text-4xl font-bold text-[#0B4A3D] tnum"><StatCounter value={value} suffix={suffix} /></div>
                  <div className="text-sm font-semibold text-[#10231C] mt-1">{label}</div>
                  <div className="text-xs text-[#6B7A72] mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 reveal-on-scroll">
              <h2 className="font-display text-3xl font-semibold text-[#10231C] mb-3">How CarbonAlpha Works</h2>
              <p className="text-lg text-[#4B5A54] max-w-2xl mx-auto">Four integrated analytical modules from facility data to boardroom-ready decision.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="reveal-on-scroll bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5F2] flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-[#0B4A3D]" /></div>
                  <h3 className="text-base font-semibold text-[#10231C] mb-2">{title}</h3>
                  <p className="text-sm text-[#4B5A54] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F6F8F7] py-20 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 reveal-on-scroll">
              <h2 className="font-display text-3xl font-semibold text-[#10231C] mb-3">From Data to Decision in 4 Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[{ n: 1, title: "Select Sector", desc: "Choose from 7 CCTS Phase 1 sectors" }, { n: 2, title: "Enter Facility Data", desc: "Fuel, electricity, production output" }, { n: 3, title: "Get Carbon Position", desc: "GEI vs target, peer percentile, surplus/deficit" }, { n: 4, title: "Compare Strategies", desc: "BUY vs BUILD vs HYBRID, cost-optimized" }].map(({ n, title, desc }) => (
                <div key={n} className="flex flex-col items-center text-center reveal-on-scroll">
                  <div className="w-12 h-12 rounded-full bg-[#0B4A3D] text-white flex items-center justify-center text-lg font-bold font-display mb-4 shadow-elevated">{n}</div>
                  <h3 className="text-sm font-semibold text-[#10231C] mb-1">{title}</h3>
                  <p className="text-xs text-[#4B5A54]">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 reveal-on-scroll">
              <Link href="/industrial-intelligence" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B4A3D] hover:bg-[#0E5C4C] text-white font-semibold text-sm shadow-resting hover:shadow-hover transition-all">
                Start Your Analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-10 reveal-on-scroll">
              <div>
                <h2 className="font-display text-3xl font-semibold text-[#10231C] mb-1">Monitored Sectors</h2>
                <p className="text-base text-[#4B5A54]">CCTS Phase 1 sectors with live regulatory status tracking</p>
              </div>
              <Link href="/overview" className="hidden sm:flex items-center gap-1.5 text-sm text-[#0B4A3D] hover:text-[#0E5C4C] font-medium transition-colors">View all <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {SECTORS.map(({ name, status, desc, img }) => (
                <div key={name} className="reveal-on-scroll bg-white border border-[#E4E9E6] rounded-xl overflow-hidden shadow-resting hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="h-36 overflow-hidden">
                    <img src={img} alt={`${name} industrial sector - illustrative`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-[#10231C]">{name}</h3>
                      <Badge variant={status} />
                    </div>
                    <p className="text-xs text-[#4B5A54]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0B4A3D] py-14 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-2">Regulatory Authorities</p>
            <h2 className="text-xl font-semibold text-white mb-8">Built on India's authoritative regulatory record</h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[["BEE", "Bureau of Energy Efficiency"], ["MoEFCC", "Min. of Env & Climate Change"], ["CERC", "Central Electricity Regulatory Commission"], ["CEA", "Central Electricity Authority"], ["CCI", "Carbon Credit Instruments"]].map(([abbr, name]) => (
                <div key={abbr} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm font-mono hover:bg-white/20 transition-colors">{abbr}</div>
                  <span className="text-[10px] text-white/50 text-center max-w-[80px] leading-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-[#F6F8F7] border-t border-[#E4E9E6] py-12 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0B4A3D] flex items-center justify-center"><span className="text-white font-bold text-xs font-mono">Ca</span></div>
                  <span className="text-sm font-semibold text-[#10231C]">CarbonAlpha India</span>
                </div>
                <p className="text-xs text-[#6B7A72] max-w-xs leading-relaxed">CCTS Decision Intelligence Platform. Analytical tool for India's industrial carbon market. Not affiliated with any government ministry.</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#10231C] uppercase tracking-wider mb-3">Platform</h4>
                <div className="flex flex-col gap-2">
                  {[["Facility Analysis", "/industrial-intelligence"], ["Decision Twin", "/decision"], ["Evidence Center", "/sources"], ["Trust Center", "/trust"]].map(([label, href]) => (
                    <Link key={href} href={href} className="text-xs text-[#4B5A54] hover:text-[#0B4A3D] transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#10231C] uppercase tracking-wider mb-3">Regulatory</h4>
                <div className="flex flex-col gap-2 text-xs text-[#6B7A72]">
                  <span>CCTS Phase 1: G.S.R. 25(E), Jan 2026</span>
                  <span>Data version: REG-2026-08</span>
                  <span>Grid EF: 0.716 tCO2e/MWh (CEA FY2024)</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-[#E4E9E6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B7A72]">
              <span>(c) 2026 CarbonAlpha India - Not a government entity</span>
              <span className="font-mono">SYNTHETIC DEMONSTRATION DATA</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}