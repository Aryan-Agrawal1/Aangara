"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Factory, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";

export interface SectorCardProps {
  name: string;
  status: "final" | "draft" | "watchlist";
  statusText: string;
  desc: string;
  img: string;
  subSector: string;
}

export function SectorCard({ name, status, statusText, desc, img, subSector }: SectorCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="reveal-on-scroll bg-white border border-[#E4E9E6] hover:border-emerald-600/30 rounded-xl overflow-hidden shadow-resting hover:shadow-[0_8px_24px_-4px_rgba(11,74,61,0.14),0_0_14px_rgba(201,98,42,0.10)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="h-40 relative bg-[#F6F8F7] overflow-hidden border-b border-[#E4E9E6]">
          {!imgFailed ? (
            <div className="w-full h-full relative">
              <Image
                src={img}
                alt={`${name} industrial sector`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 group-hover:brightness-95 transition-all duration-300 ease-out"
                onError={() => setImgFailed(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#E8F5F2] text-[#0B4A3D] p-4 text-center">
              <Factory className="w-8 h-8 mb-1.5 opacity-80" />
              <span className="text-xs font-semibold">{name} Sector</span>
            </div>
          )}
          {/* Subtle dark overlay for better badge contrast if needed, but badge has solid bg */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge variant={status} label={statusText} />
          </div>
        </div>
        <div className="p-4">
          <div className="text-[11px] font-mono font-medium text-[#2E6BA8] uppercase tracking-wider mb-1">{subSector}</div>
          <h3 className="text-base font-semibold text-[#10231C] mb-1.5">{name}</h3>
          <p className="text-xs text-[#4B5A54] leading-relaxed line-clamp-3">{desc}</p>
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

export const SHARED_SECTORS: SectorCardProps[] = [
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
    status: "draft",
    statusText: "WATCHLIST",
    subSector: "Phase 2 Roadmap",
    desc: "Transition roadmap aligning with National Green Hydrogen Mission and ammonia decarbonisation.",
    img: "/images/sectors/fertiliser.jpg"
  }
];
