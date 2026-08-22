'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Activity, TrendingUp, Layers, Sparkles } from 'lucide-react';

interface DataChip {
  id: string;
  title: string;
  value: string;
  unit?: string;
  badge: string;
  badgeType: 'emerald' | 'amber' | 'blue';
  icon: React.ElementType;
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  delayMs: number;
  floatDelay: string;
}

const DATA_CHIPS: DataChip[] = [
  {
    id: 'grid-ef',
    title: 'National Grid Emission Factor',
    value: '0.716',
    unit: 'tCO₂e/MWh',
    badge: 'CEA v20.0 Baseline',
    badgeType: 'emerald',
    icon: Activity,
    initialX: 160,
    initialY: -80,
    targetX: 140,
    targetY: -115,
    delayMs: 800,
    floatDelay: '0s',
  },
  {
    id: 'sectors-active',
    title: 'Monitored Sectors Active',
    value: '7 Sectors (490+ Units)',
    badge: 'MoEFCC Phase 1',
    badgeType: 'emerald',
    icon: Layers,
    initialX: 180,
    initialY: 90,
    targetX: 150,
    targetY: 105,
    delayMs: 950,
    floatDelay: '1.4s',
  },
  {
    id: 'draft-scope',
    title: 'Draft Consultation Scope',
    value: 'Iron & Steel (255 Units)',
    badge: 'G.S.R. 517(E)',
    badgeType: 'amber',
    icon: ShieldCheck,
    initialX: -160,
    initialY: -70,
    targetX: -145,
    targetY: -105,
    delayMs: 1100,
    floatDelay: '2.8s',
  },
  {
    id: 'price-band',
    title: 'Carbon Price Scenario Range',
    value: '₹500 – ₹2,500',
    unit: '/ CCC',
    badge: 'CCTS Market Band',
    badgeType: 'blue',
    icon: TrendingUp,
    initialX: -170,
    initialY: 100,
    targetX: -140,
    targetY: 115,
    delayMs: 1250,
    floatDelay: '4.2s',
  },
];

export function CarbonIntelligenceCore() {
  const [isSettled, setIsSettled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reducedMotionAttr = document.documentElement.getAttribute('data-reduced-motion') === 'true';
    const hasAnimatedBefore = typeof window !== 'undefined' && sessionStorage.getItem('ca_hero_animated_v1');

    if (prefersReducedMotion || reducedMotionAttr || hasAnimatedBefore) {
      setIsSettled(true);
      return;
    }

    // Run first-time choreography
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsSettled(true);
      setIsAnimating(false);
      try {
        sessionStorage.setItem('ca_hero_animated_v1', 'true');
      } catch (e) {
        // ignore quota errors
      }
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  // Pause animations when scrolled out of view to preserve GPU
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[560px] mx-auto h-[480px] sm:h-[520px] flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 1. Ambient Background Halo & Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#10B981]/25 via-[#0B4A3D]/40 to-[#C9622A]/25 blur-3xl opacity-70 animate-pulse duration-[4000ms]" />
        <div className="absolute w-[220px] h-[220px] rounded-full bg-[#6EE7B7]/15 blur-2xl" />
      </div>

      {/* 2. Micro Ambient Floating Particle Dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '20%', left: '25%', size: 'w-1.5 h-1.5', delay: '0s', dur: '6s' },
          { top: '35%', left: '75%', size: 'w-1 h-1', delay: '2s', dur: '8s' },
          { top: '65%', left: '15%', size: 'w-1.5 h-1.5', delay: '1s', dur: '7s' },
          { top: '75%', left: '80%', size: 'w-1 h-1', delay: '3.5s', dur: '5s' },
          { top: '15%', left: '60%', size: 'w-2 h-2', delay: '4s', dur: '9s' },
        ].map((pt, i) => (
          <span
            key={i}
            className={`absolute rounded-full bg-[#6EE7B7]/40 blur-[0.5px] ${pt.size} animate-float-slow`}
            style={{
              top: pt.top,
              left: pt.left,
              animationDelay: pt.delay,
              animationDuration: pt.dur,
              animationPlayState: isVisible ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      {/* 3. Central "Carbon Intelligence Core" 3D Molecule / Ring */}
      <div
        className={`relative z-10 w-[240px] h-[240px] sm:w-[270px] sm:h-[270px] flex items-center justify-center transition-all duration-1000 ease-out ${
          isSettled || isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-85'
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Continuous Rotating 3D Rings Container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            animation: isVisible ? 'ca-slow-orbit 26s linear infinite' : 'none',
            animationPlayState: isVisible ? 'running' : 'paused',
          }}
        >
          {/* Primary Glass Outer Ring with Dual Gradient Rim */}
          <div
            className="absolute inset-0 rounded-full border-[10px] sm:border-[12px] border-transparent"
            style={{
              background: 'linear-gradient(135deg, rgba(110, 231, 183, 0.45) 0%, rgba(11, 74, 61, 0.8) 45%, rgba(201, 98, 42, 0.75) 100%) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
              filter: 'drop-shadow(0 0 16px rgba(110, 231, 183, 0.35)) drop-shadow(0 0 24px rgba(201, 98, 42, 0.25))',
              transform: 'rotateX(55deg) rotateY(15deg)',
            }}
          />

          {/* Secondary Interlocking Offset Arc (The "Reduction Molecule" Vector) */}
          <div
            className="absolute inset-2 sm:inset-3 rounded-full border-[6px] sm:border-[8px] border-transparent"
            style={{
              background: 'linear-gradient(225deg, rgba(240, 168, 117, 0.6) 0%, rgba(16, 185, 129, 0.5) 60%, rgba(11, 74, 61, 0.2) 100%) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
              filter: 'drop-shadow(0 0 12px rgba(201, 98, 42, 0.3))',
              transform: 'rotateX(-45deg) rotateY(35deg)',
            }}
          />

          {/* Third Delicate Inner Gauge Ring */}
          <svg
            className="absolute w-[80%] h-[80%] opacity-80"
            viewBox="0 0 100 100"
            fill="none"
            style={{ transform: 'rotateZ(45deg)' }}
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <circle
              cx="50"
              cy="50"
              r="36"
              stroke="rgba(110, 231, 183, 0.3)"
              strokeWidth="2"
              strokeDasharray="18 4"
            />
          </svg>

          {/* Centerpiece Translucent Glass Sphere / Core Badge */}
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center p-3 shadow-2xl border border-white/30 backdrop-blur-xl"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4) 0%, rgba(11,74,61,0.85) 50%, rgba(6,35,28,0.95) 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.6), 0 12px 32px rgba(0,0,0,0.4)',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#6EE7B7] mb-1 animate-pulse" />
            <span className="font-mono font-bold text-white text-xs sm:text-sm tracking-wider">Cα CORE</span>
            <span className="text-[9px] font-mono text-[#6EE7B7] uppercase tracking-widest leading-none mt-0.5">
              Verified CCTS
            </span>
          </div>
        </div>
      </div>

      {/* 4. The 4 Orbiting Real Data Chips (Fanning In on Reveal, Staggered Ambient Float on Idle) */}
      <div className="absolute inset-0 pointer-events-none">
        {DATA_CHIPS.map((chip) => {
          const Icon = chip.icon;
          const isHovered = hoveredChip === chip.id;

          // Animation calculation:
          // In settled mode, chip sits at (targetX, targetY).
          // In animating mode, transition from initialX, initialY to targetX, targetY with delay.
          return (
            <div
              key={chip.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-700 ease-out"
              style={{
                transform: isSettled
                  ? `translate(calc(-50% + ${chip.targetX}px), calc(-50% + ${chip.targetY}px))`
                  : isAnimating
                  ? `translate(calc(-50% + ${chip.targetX}px), calc(-50% + ${chip.targetY}px))`
                  : `translate(calc(-50% + ${chip.initialX}px), calc(-50% + ${chip.initialY}px)) scale(0.6)`,
                opacity: isSettled ? 1 : isAnimating ? 1 : 0,
                transitionDelay: isSettled ? '0ms' : `${chip.delayMs}ms`,
                zIndex: isHovered ? 30 : 20,
              }}
              onMouseEnter={() => setHoveredChip(chip.id)}
              onMouseLeave={() => setHoveredChip(null)}
            >
              {/* Subtle sine float container during idle ambient mode */}
              <div
                className="relative group transition-transform duration-300"
                style={{
                  animation: isSettled && isVisible ? 'ca-chip-float 5s ease-in-out infinite' : 'none',
                  animationDelay: chip.floatDelay,
                  animationPlayState: isVisible ? 'running' : 'paused',
                }}
              >
                {/* Chip Glass Surface */}
                <div
                  className={`w-[200px] sm:w-[220px] p-3 rounded-xl backdrop-blur-xl border transition-all duration-200 shadow-lg ${
                    isHovered
                      ? 'bg-white/20 border-white/40 shadow-2xl shadow-[#10B981]/20 -translate-y-1'
                      : 'bg-[#06231C]/65 border-white/20 hover:border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                  }`}
                  style={{
                    boxShadow: isHovered
                      ? '0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(110,231,183,0.25), inset 0 1px 1px rgba(255,255,255,0.4)'
                      : '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[#6EE7B7]">
                        <Icon className="w-3 h-3" />
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          chip.badgeType === 'amber'
                            ? 'bg-[#FEF7E8]/20 text-[#F0A875] border-[#F0A875]/40'
                            : chip.badgeType === 'blue'
                            ? 'bg-sky-950/40 text-sky-300 border-sky-500/40'
                            : 'bg-[#0B4A3D]/80 text-[#6EE7B7] border-[#6EE7B7]/40'
                        }`}
                      >
                        {chip.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-white/75 leading-tight font-medium mb-1 truncate">
                    {chip.title}
                  </div>

                  <div className="flex items-baseline gap-1 font-mono font-bold text-white text-sm sm:text-base tracking-tight tnum">
                    <span>{chip.value}</span>
                    {chip.unit && <span className="text-[10px] text-white/60 font-sans font-normal">{chip.unit}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Interactive Link */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
        <Link
          href="/sources"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white text-[11px] font-medium backdrop-blur-md transition-all duration-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7] animate-ping" />
          <span>Explore Verified Gazette Registry</span>
          <ExternalLink className="w-3 h-3 text-[#6EE7B7]" />
        </Link>
      </div>

      {/* Inline styles for custom GPU keyframe animations */}
      <style jsx>{`
        @keyframes ca-slow-orbit {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }
        @keyframes ca-chip-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-12px) scale(1.2);
            opacity: 0.8;
          }
        }
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0ms !important;
          }
        }
      `}</style>
    </div>
  );
}
