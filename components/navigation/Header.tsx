'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Layers, Sliders, FileText, Building2, Cpu } from 'lucide-react';

interface HeaderProps {
  currentSector?: string;
  currentEntityId?: string;
  reportingYear?: string;
  dataStatus?: string;
  onSectorChange?: (sector: string) => void;
  onEntityChange?: (entityId: string) => void;
  onYearChange?: (year: string) => void;
  sectorsList?: any[];
  entitiesList?: any[];
}

export function Header({
  currentSector = 'cement',
  currentEntityId = 'SYN-CEM-001',
  reportingYear = '2025-26',
  dataStatus = 'SYNTHETIC',
  onSectorChange,
  onEntityChange,
  onYearChange,
  sectorsList = [],
  entitiesList = []
}: HeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/industrial-intelligence', label: 'Industrial Intelligence', icon: Cpu, badge: 'ENTER DATA' },
    { href: '/decision', label: 'Decision Twin', icon: Layers },
    { href: '/overview', label: 'Sector Portfolio', icon: Building2 },
    { href: '/entity', label: 'Operational Input', icon: Activity },
    { href: '/scenarios', label: 'Stress Scenarios', icon: Sliders },
    { href: '/sources', label: 'Regulatory Register', icon: FileText },
    { href: '/trust', label: 'Trust Center', icon: FileText },
  ];

  return (
    <header className="border-b border-white/[0.07] bg-[#06090E]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 rounded-lg bg-[#111827] border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40 relative overflow-hidden group-hover:border-emerald-400/60 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent" />
              <span className="font-mono font-bold text-white text-base tracking-tighter relative z-10 flex items-baseline select-none">
                <span className="text-emerald-400">C</span>
                <span className="text-emerald-300 font-sans text-xs ml-0.5 font-semibold">α</span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                  CarbonAlpha
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  INDIA CCTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Decision Intelligence & Capital Allocation</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#111827] text-emerald-400 border border-white/[0.1] shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B1019]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold ml-1">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Context Selectors & Status Badges */}
          <div className="flex items-center space-x-3">
            {/* Sector Selector */}
            <div className="flex items-center space-x-1.5 bg-[#0B1019] px-2.5 py-1.5 rounded-md border border-white/[0.07] text-xs">
              <span className="text-slate-500 font-medium">Sector:</span>
              <select
                value={currentSector}
                onChange={(e) => onSectorChange && onSectorChange(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <optgroup label="8 Notified CCTS Compliance Sectors" className="bg-[#0B1019] text-slate-400">
                  <option value="cement" className="bg-[#0B1019] text-slate-200">Cement (Core Demo)</option>
                  <option value="iron_steel" className="bg-[#0B1019] text-slate-200">Iron & Steel (Draft G.S.R. 517(E))</option>
                  <option value="aluminium" className="bg-[#0B1019] text-slate-200">Aluminium</option>
                  <option value="chlor_alkali" className="bg-[#0B1019] text-slate-200">Chlor-Alkali</option>
                  <option value="pulp_paper" className="bg-[#0B1019] text-slate-200">Pulp & Paper</option>
                  <option value="petrochemicals" className="bg-[#0B1019] text-slate-200">Petrochemicals</option>
                  <option value="petroleum_refinery" className="bg-[#0B1019] text-slate-200">Petroleum Refinery</option>
                  <option value="textile" className="bg-[#0B1019] text-slate-200">Textile</option>
                </optgroup>
                <optgroup label="Watchlist Scope" className="bg-[#0B1019] text-slate-400">
                  <option value="fertiliser" className="bg-[#0B1019] text-slate-200">Fertiliser (Watchlist)</option>
                </optgroup>
              </select>
            </div>

            {/* Data Status Pill */}
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>{dataStatus}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

