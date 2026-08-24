"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

// Primary navigation — 5 core product modules
const PRIMARY_NAV = [
  { href: "/industrial-intelligence", label: "Facility Analysis" },
  { href: "/decision",                label: "Decision Twin" },
  { href: "/overview",                label: "Portfolio" },
  { href: "/scenarios",               label: "Scenarios" },
  { href: "/sources",                 label: "Evidence" },
];

// Secondary navigation — in a subtle "More" dropdown
const SECONDARY_NAV = [
  { href: "/entity",    label: "Input Data" },
  { href: "/trust",     label: "Trust Center" },
  { href: "/about",     label: "About" },
];

export function Header({ currentSector, currentEntityId, reportingYear, onSectorChange, onEntityChange, onYearChange, sectorsList, entitiesList, dataStatus }: any) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Auto-close mobile drawer upon route change
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isSecondaryActive = SECONDARY_NAV.some(
    ({ href }) => pathname === href || pathname.startsWith(href)
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-xl shadow-[0_1px_0_rgba(26,28,24,0.08),0_4px_24px_rgba(26,28,24,0.06)]"
          : "bg-white/90 backdrop-blur-md border-b border-[#E8E2DC]/60"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand mark ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 mr-8">
            <div className="relative w-9 h-9 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/aangara-icon.png"
                alt="AANGARA"
                fill
                priority
                className="object-contain"
                sizes="36px"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[15px] font-bold text-[#1A1C18] leading-none tracking-tight">AANGARA</span>
              <span className="text-[9px] text-[#6B7268] uppercase tracking-[0.15em] leading-none mt-0.5 font-medium">
                CCTS Decision Intelligence
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            className="hidden lg:flex items-center gap-0.5 flex-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {PRIMARY_NAV.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    active
                      ? "text-[#1F4D2E] bg-[#E8F2EB]"
                      : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#F0EDE9]"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-[2px] bg-[#1F4D2E] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isSecondaryActive
                    ? "text-[#1F4D2E] bg-[#E8F2EB]"
                    : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#F0EDE9]"
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {moreOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-[#E8E2DC] rounded-xl shadow-[0_8px_32px_rgba(26,28,24,0.12)] py-1.5 z-50">
                  {SECONDARY_NAV.map(({ href, label }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2.5 text-[13px] font-medium transition-colors ${
                          active
                            ? "text-[#1F4D2E] bg-[#E8F2EB]"
                            : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#F0EDE9]"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* ── Right: CTA + Mobile trigger ── */}
          <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
            {/* Primary CTA — desktop only */}
            <Link
              href="/industrial-intelligence"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1F4D2E] hover:bg-[#27643A] text-white text-[13px] font-semibold transition-all duration-150 shadow-sm hover:shadow-[0_4px_12px_rgba(31,77,46,0.3)] transform hover:-translate-y-px"
            >
              Launch Platform
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F0EDE9] text-[#4A5446] border border-[#E8E2DC] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile nav panel ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E8E2DC] bg-white">
          <nav className="px-4 py-3 flex flex-col gap-0.5">
            {[...PRIMARY_NAV, ...SECONDARY_NAV].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#E8F2EB] text-[#1F4D2E]"
                    : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#F0EDE9]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-4">
            <Link
              href="/industrial-intelligence"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#1F4D2E] hover:bg-[#27643A] text-white text-sm font-semibold transition-colors"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="px-4 pb-3 text-[10px] text-[#6B7268] font-mono border-t border-[#E8E2DC] pt-3">
            Produced by Terranex · CCTS Decision Intelligence
          </div>
        </div>
      )}
    </header>
  );
}