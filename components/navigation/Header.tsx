'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Layers, Sliders, FileText, Building2, Cpu, Sun, Moon, Menu, X, Shield, Type } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export function Header({ currentSector = 'cement', dataStatus = 'SYNTHETIC', onSectorChange }: any) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  const adjustFont = useCallback((delta: number) => {
    setFontSize(prev => {
      const next = Math.min(130, Math.max(90, prev + delta * 5));
      document.documentElement.style.fontSize = `${next}%`;
      return next;
    });
  }, []);

  const resetFont = useCallback(() => {
    setFontSize(100);
    document.documentElement.style.fontSize = '';
  }, []);

  const navLinks = [
    { href: '/industrial-intelligence', label: 'Industrial Intelligence', icon: Cpu, badge: 'ENTER DATA' },
    { href: '/decision', label: 'Decision Twin', icon: Layers },
    { href: '/overview', label: 'Sector Portfolio', icon: Building2 },
    { href: '/entity', label: 'Operational Input', icon: Activity },
    { href: '/scenarios', label: 'Stress Scenarios', icon: Sliders },
    { href: '/sources', label: 'Evidence Center', icon: FileText },
    { href: '/trust', label: 'Trust Center', icon: Shield },
  ];

  return (
    <>
      {/* Accessibility bar */}
      <div className="hidden md:flex items-center justify-end gap-3 px-6 py-1 border-b border-white/[0.04] bg-[#04060A] text-[10px] text-slate-600">
        <span>Accessibility:</span>
        <button onClick={() => adjustFont(-1)} className="hover:text-slate-400 transition-colors px-1" aria-label="Decrease text size">A−</button>
        <button onClick={resetFont} className="hover:text-slate-400 transition-colors px-1" aria-label="Reset text size">A</button>
        <button onClick={() => adjustFont(1)} className="hover:text-slate-400 transition-colors px-1" aria-label="Increase text size">A+</button>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => document.documentElement.setAttribute('data-reduced-motion', document.documentElement.getAttribute('data-reduced-motion') === 'true' ? 'false' : 'true')}
          className="hover:text-slate-400 transition-colors"
          aria-label="Toggle reduced motion"
        >
          Reduced Motion
        </button>
      </div>

      <header className="border-b border-white/[0.07] bg-[#06090E]/95 dark:bg-[#06090E]/95 light:bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-[#111827] border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40 relative overflow-hidden group-hover:border-emerald-400/60 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent" />
                <span className="text-emerald-400 font-bold text-xs relative z-10 font-mono">Cα</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-white leading-none tracking-tight">CarbonAlpha</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">Decision Intelligence</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Main">
              {navLinks.map(({ href, label, badge }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      active
                        ? 'text-white bg-white/[0.06] border border-white/[0.08]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{label}</span>
                    {badge && (
                      <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Data status badge */}
              <span className="hidden sm:inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                ● SYNTHETIC DEMONSTRATION
              </span>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-all border border-white/[0.06]"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/[0.06]"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/[0.07] bg-[#06090E] px-4 py-4">
            <nav className="flex flex-col gap-1" role="navigation" aria-label="Mobile">
              {navLinks.map(({ href, label, icon: Icon, badge }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active ? 'text-white bg-white/[0.08]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                    {badge && <span className="ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">{badge}</span>}
                  </Link>
                );
              })}
              {/* Accessibility controls in mobile */}
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-3">
                <span className="text-xs text-slate-600">Text:</span>
                <button onClick={() => adjustFont(-1)} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded bg-slate-800">A−</button>
                <button onClick={resetFont} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded bg-slate-800">Reset</button>
                <button onClick={() => adjustFont(1)} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded bg-slate-800">A+</button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
