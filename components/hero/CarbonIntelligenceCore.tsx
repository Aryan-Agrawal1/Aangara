'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ExternalLink, ShieldCheck, Activity, TrendingUp, Layers, Sparkles } from 'lucide-react';

interface OrbitRingProps {
  width: number;
  height: number;
  rotation: number;
  colorClass: string;
  duration: number;
  reverse?: boolean;
  delay: number;
  labelTitle: string;
  labelValue: string;
  badgeType: 'emerald' | 'amber' | 'blue';
  icon: React.ElementType;
  labelOffsetPerc: number;
  isSettled: boolean;
}

function OrbitRing({
  width, height, rotation, colorClass, duration, reverse, delay,
  labelTitle, labelValue, badgeType, icon: Icon, labelOffsetPerc, isSettled
}: OrbitRingProps) {
  return (
    <div 
      className={`absolute top-1/2 left-1/2 rounded-[50%] border-[1.5px] border-dashed transition-all duration-1000 ease-out ${isSettled ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        borderColor: colorClass,
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Particle/Electron traveling along the ring */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          animation: `ca-spin ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
        }}
      >
        <div 
          className="absolute w-3 h-3 rounded-full shadow-[0_0_12px_currentColor] -ml-1.5 -mt-1.5"
          style={{
            top: '0%', left: '50%',
            backgroundColor: colorClass,
            color: colorClass
          }}
        />
      </div>

      {/* Label/Tag attached to the ring statically */}
      <div 
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
          width: '100%',
          height: '100%'
        }}
      >
        <div 
          className="absolute"
          style={{
            // Approximate ellipse placement using percentages.
            // labelOffsetPerc dictates where it sits along the ring.
            top: `${50 - Math.cos(labelOffsetPerc * Math.PI * 2) * 50}%`,
            left: `${50 + Math.sin(labelOffsetPerc * Math.PI * 2) * 50}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-105 ${
            badgeType === 'amber' ? 'bg-[#F3F9E6]/80 border-[#C6E385]/50' : 
            badgeType === 'blue' ? 'bg-[#EBF3FB]/80 border-[#2E6BA8]/30' : 
            'bg-white/80 border-brand-primary/20'
          }`}>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
              badgeType === 'amber' ? 'bg-[#C6E385]/20 text-[#8CA949]' : 
              badgeType === 'blue' ? 'bg-sky-100 text-sky-700' : 
              'bg-brand-primary/10 text-brand-primary'
            }`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5 whitespace-nowrap">{labelTitle}</div>
              <div className={`font-mono font-bold text-sm tracking-tight whitespace-nowrap ${
                badgeType === 'amber' ? 'text-[#8CA949]' : 
                badgeType === 'blue' ? 'text-[#2E6BA8]' : 
                'text-brand-primary'
              }`}>{labelValue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarbonIntelligenceCore() {
  const [isSettled, setIsSettled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reducedMotionAttr = document.documentElement.getAttribute('data-reduced-motion') === 'true';
    const hasAnimatedBefore = typeof window !== 'undefined' && sessionStorage.getItem('ca_hero_animated_v1');

    if (prefersReducedMotion || reducedMotionAttr || hasAnimatedBefore) {
      setIsSettled(true);
      return;
    }

    const timer = setTimeout(() => setIsSettled(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-[750px] mx-auto h-[480px] sm:h-[600px] flex flex-col md:flex-row items-center justify-center select-none overflow-hidden lg:overflow-visible">
      
      {/* Central Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent-fresh/20 blur-[80px] pointer-events-none" />

      {/* Orbit Rings & Data Labels */}
      <OrbitRing 
        width={700} height={260} rotation={-15} colorClass="#0B4A3D" duration={28} delay={400}
        labelTitle="National Grid Emission Factor" labelValue="0.716 tCO₂e/MWh" badgeType="emerald" icon={Activity}
        labelOffsetPerc={0.12} isSettled={isSettled}
      />
      
      <OrbitRing 
        width={580} height={200} rotation={25} colorClass="#8CA949" duration={22} reverse delay={600}
        labelTitle="Draft Consultation Scope" labelValue="Iron & Steel (255 Units)" badgeType="amber" icon={ShieldCheck}
        labelOffsetPerc={0.88} isSettled={isSettled}
      />

      <OrbitRing 
        width={460} height={380} rotation={-60} colorClass="#2E6BA8" duration={35} delay={800}
        labelTitle="Price Scenario Range" labelValue="₹500 – ₹2,500 / CCC" badgeType="blue" icon={TrendingUp}
        labelOffsetPerc={0.35} isSettled={isSettled}
      />

      <OrbitRing 
        width={340} height={140} rotation={10} colorClass="#0E5C4C" duration={18} reverse delay={1000}
        labelTitle="Monitored Sectors Active" labelValue="7 Sectors (490+ Units)" badgeType="emerald" icon={Layers}
        labelOffsetPerc={0.65} isSettled={isSettled}
      />

      {/* The Central "Carbon Core" Atom Intersection */}
      <div 
        className={`relative z-20 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-center p-4 shadow-[0_12px_40px_rgba(11,74,61,0.25)] border border-white backdrop-blur-xl transition-all duration-1000 ease-out ${
          isSettled ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(245,242,243,0.8) 40%, rgba(198,227,133,0.3) 100%)',
          boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.8), inset 0 -4px 12px rgba(11,74,61,0.1), 0 12px 32px rgba(11,74,61,0.15)',
        }}
      >
        <Sparkles className="w-5 h-5 text-accent-fresh-deep mb-1.5 animate-pulse" />
        <span className="font-mono font-extrabold text-brand-primary text-sm sm:text-base tracking-wider">Cα CORE</span>
        <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest leading-none mt-1">
          Verified Engine
        </span>
      </div>

      <style jsx>{`
        @keyframes ca-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition-duration: 0ms !important; }
        }
      `}</style>
    </div>
  );
}
