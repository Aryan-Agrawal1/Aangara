"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Activity, Layers, Sliders, FileText, Building2, Cpu, Sun, Moon, Menu, X, Shield, Info } from "lucide-react";
import { useTheme } from "@/lib/theme";

const NAV_LINKS = [
  { href: "/industrial-intelligence", label: "Facility Analysis", icon: Cpu },
  { href: "/decision",                label: "Decision Twin",   icon: Layers },
  { href: "/overview",                label: "Portfolio",       icon: Building2 },
  { href: "/entity",                  label: "Input Data",      icon: Activity },
  { href: "/scenarios",               label: "Scenarios",       icon: Sliders },
  { href: "/sources",                 label: "Evidence",        icon: FileText },
  { href: "/trust",                   label: "Trust Center",    icon: Shield },
  { href: "/about",                   label: "About",           icon: Info },
];

export function Header({ currentSector, currentEntityId, reportingYear, onSectorChange, onEntityChange, onYearChange, sectorsList, entitiesList, dataStatus }: any) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-resting border-b border-[#E8E2DC]" : "bg-white border-b border-[#E8E2DC]"}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between transition-all duration-200 ${scrolled ? "h-12" : "h-14"}`}>

          {/* ── Brand mark ── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {/* Logo icon mark */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image
                src="/aangara-logo.jpg"
                alt="AANGARA"
                fill
                priority
                className="object-cover rounded-lg"
                sizes="36px"
              />
            </div>
            {/* Wordmark */}
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-[#1A1C18] leading-none tracking-tight">AANGARA</div>
              <div className="text-[9px] text-[#6B7268] uppercase tracking-widest leading-none mt-0.5">CCTS Decision Intelligence</div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-[#E8F2EB] text-[#1F4D2E]"
                      : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#EBE6E3]"
                  }`}
                >
                  {label}
                  {active && <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-[#1F4D2E] rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FEF0E6] text-[#D9531E] border border-[#D9531E]/25">
              ⚠ SYNTHETIC DATA
            </span>
            <button
              onClick={toggle}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#EBE6E3] text-[#4A5446] hover:text-[#1A1C18] transition-colors border border-[#E8E2DC]"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#EBE6E3] text-[#4A5446] border border-[#E8E2DC]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile nav ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E8E2DC] bg-white px-4 py-3">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#E8F2EB] text-[#1F4D2E]"
                    : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#EBE6E3]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />{label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-[#E8E2DC] text-[10px] text-[#6B7268] font-mono">
            Produced by Terranex
          </div>
        </div>
      )}
    </header>
  );
}