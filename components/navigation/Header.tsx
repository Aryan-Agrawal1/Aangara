"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Layers, Sliders, FileText, Building2, Cpu, Sun, Moon, Menu, X, Shield } from "lucide-react";
import { useTheme } from "@/lib/theme";

const NAV_LINKS = [
  { href: "/industrial-intelligence", label: "Facility Analysis", icon: Cpu },
  { href: "/decision", label: "Decision Twin", icon: Layers },
  { href: "/overview", label: "Portfolio", icon: Building2 },
  { href: "/entity", label: "Input Data", icon: Activity },
  { href: "/scenarios", label: "Scenarios", icon: Sliders },
  { href: "/sources", label: "Evidence", icon: FileText },
  { href: "/trust", label: "Trust Center", icon: Shield },
];

export function Header({ currentSector, currentEntityId, reportingYear, onSectorChange, onEntityChange, onYearChange, sectorsList, entitiesList, dataStatus }: any) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-resting border-b border-[#E4E9E6]" : "bg-white border-b border-[#E4E9E6]"}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between transition-all duration-200 ${scrolled ? "h-12" : "h-14"}`}>
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#0B4A3D] flex items-center justify-center shadow-resting group-hover:bg-[#0E5C4C] transition-colors">
              <span className="text-white font-bold text-xs font-mono">Cα</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-[#10231C] leading-none">CarbonAlpha India</div>
              <div className="text-[9px] text-[#6B7A72] uppercase tracking-widest leading-none mt-0.5">CCTS Decision Intelligence</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? "bg-[#E8F5F2] text-[#0B4A3D]" : "text-[#4B5A54] hover:text-[#10231C] hover:bg-[#F6F8F7]"}`}
                >
                  {label}
                  {active && <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-[#0B4A3D] rounded-full" />}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FEF7E8] text-[#C98A1E] border border-[#C98A1E]/30">
              ● SYNTHETIC DATA
            </span>
            <button onClick={toggle} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F6F8F7] text-[#4B5A54] hover:text-[#10231C] transition-colors border border-[#E4E9E6]" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F6F8F7] text-[#4B5A54] border border-[#E4E9E6]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E4E9E6] bg-white px-4 py-3">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === href ? "bg-[#E8F5F2] text-[#0B4A3D]" : "text-[#4B5A54] hover:text-[#10231C] hover:bg-[#F6F8F7]"}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />{label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}