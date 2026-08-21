"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart2, Shield, TrendingDown, Zap, ExternalLink, Factory, CheckCircle2 } from "lucide-react";
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Header } from "@/components/navigation/Header";
import { StatCounter } from "@/components/ui/StatCounter";
import { Badge } from "@/components/ui/Badge";

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) en.target.classList.add("is-revealed"); }), { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

interface SectorCardProps {
  name: string;
  status: "final" | "draft" | "watchlist";
  statusText: string;
  desc: string;
  img: string;
  subSector: string;
}

function SectorCard({ name, status, statusText, desc, img, subSector }: SectorCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="reveal-on-scroll bg-white border border-[#E4E9E6] rounded-xl overflow-hidden shadow-resting hover:shadow-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="h-40 relative bg-[#F6F8F7] overflow-hidden border-b border-[#E4E9E6]">
          {!imgFailed ? (
            <img
              src={img}
              alt={`${name} industrial sector`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#E8F5F2] text-[#0B4A3D] p-4 text-center">
              <Factory className="w-8 h-8 mb-1.5 opacity-80" />
              <span className="text-xs font-semibold">{name} Sector</span>
            </div>
          )}
          <div className="absolute top-2.5 right-2.5">
            <Badge variant={status} label={statusText} />
          </div>
        </div>
        <div className="p-4">
          <div className="text-[11px] font-mono font-medium text-[#2E6BA8] uppercase tracking-wider mb-1">{subSector}</div>
          <h3 className="text-base font-semibold text-[#10231C] mb-1.5">{name}</h3>
          <p className="text-xs text-[#4B5A54] leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <Link
          href={`/industrial-intelligence?sector=${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B4A3D] group-hover:text-[#C9622A] transition-colors mt-2"
        >
          <span>Analyse Sector Facility</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

const SECTORS: SectorCardProps[] = [
  {
    name: "Cement",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Binding GEI targets notified via MoEFCC G.S.R. 25(E) on per tonne cement equivalent basis.",
    img: "/images/sectors/cement.jpg"
  },
  {
    name: "Iron & Steel",
    status: "draft",
    statusText: "DRAFT",
    subSector: "Phase 2 Consultation",
    desc: "MoEFCC revised draft notification G.S.R. 517(E) covering 255 integrated and sponge-iron units.",
    img: "/images/sectors/iron_steel.jpg"
  },
  {
    name: "Aluminium",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Binding GEI benchmarks for primary smelters and alumina refineries (tCO2e/t primary metal).",
    img: "/images/sectors/aluminium.jpg"
  },
  {
    name: "Chlor-Alkali",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Statutory specific power consumption and GEI caps per tonne caustic soda (100% NaOH equivalent).",
    img: "/images/sectors/chlor_alkali.jpg"
  },
  {
    name: "Pulp & Paper",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Statutory intensity standards for agro, wood, and recycled fiber-based paper manufacturing.",
    img: "/images/sectors/pulp_paper.jpg"
  },
  {
    name: "Petrochemicals",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Standardized specific emission trajectories across naphtha/gas crackers and downstream polymer units.",
    img: "/images/sectors/petrochemicals.jpg"
  },
  {
    name: "Petroleum Refinery",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Complexity-weighted GEI targets calibrated against composite MBN (Million Barrel Number) indices.",
    img: "/images/sectors/petroleum_refinery.jpg"
  },
  {
    name: "Textile",
    status: "final",
    statusText: "FINAL",
    subSector: "Phase 1 Monitored",
    desc: "Statutory thermal and electricity benchmarks for composite mills and processing clusters.",
    img: "/images/sectors/textile.jpg"
  },
  {
    name: "Fertiliser",
    status: "watchlist",
    statusText: "WATCHLIST",
    subSector: "Phase 2 Roadmap",
    desc: "Transition roadmap aligning with National Green Hydrogen Mission and ammonia decarbonisation.",
    img: "/images/sectors/fertiliser.jpg"
  }
];

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

  return (
    <div className="min-h-screen bg-white">
      <UtilityBar />
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#0B4A3D] text-white">
          <div
            className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none"
            style={{
              backgroundImage: "url(/images/hero/hero_industrial.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center 40%"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B4A3D] via-[#0B4A3D]/90 to-[#0B4A3D]/60" />
          
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium mb-6 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-[#6EE7B7] animate-pulse" />
                  <span>India CCTS Compliance Ready · BEE Gazette G.S.R. 25(E)</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight mb-6">
                  Turn statutory carbon compliance into{" "}
                  <span className="italic text-[#F0A875]">capital advantage</span>
                </h1>

                <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl leading-relaxed font-normal">
                  Deterministic GHG emission intensity (GEI) accounting, empirical peer distributions, and BUY / BUILD / HYBRID capital allocation for India&apos;s obligated industrial entities.
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/industrial-intelligence"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-[#C9622A] hover:bg-[#B5541F] text-white font-semibold text-sm shadow-resting hover:shadow-hover transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span>Launch Facility Intelligence</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/decision"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm transition-all duration-200"
                  >
                    <span>View Decision Twin</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6EE7B7]">Statutory Matrix Snapshot</span>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">CCTS Phase 1</span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-white/70">National Grid Emission Factor</span>
                      <span className="font-mono font-bold text-white tnum">0.716 tCO2e/MWh</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-white/70">Monitored Sectors Active</span>
                      <span className="font-mono font-bold text-[#6EE7B7] tnum">7 Sectors (490+ Units)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-white/70">Draft Consultation Scope</span>
                      <span className="font-mono font-bold text-[#F0A875] tnum">Iron & Steel (255 Units)</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-white/70">Carbon Price Scenario Range</span>
                      <span className="font-mono font-bold text-white tnum">INR 500 - 2,500 / CCC</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/15">
                    <Link
                      href="/sources"
                      className="inline-flex items-center gap-1.5 text-xs text-[#6EE7B7] hover:text-white transition-colors font-medium"
                    >
                      <span>Explore verified gazette register</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              {SECTORS.map((sector) => (
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