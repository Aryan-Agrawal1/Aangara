'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import EvilEye to avoid SSR issues with WebGL
const EvilEye = dynamic(() => import('./EvilEye'), { ssr: false });

// Rising ember particle component (pure CSS, no deps)
function EmberParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
            left: `${10 + (i * 5.2) % 80}%`,
            bottom: `${-10 + (i * 7) % 20}%`,
            backgroundColor: i % 3 === 0 ? '#F2984A' : i % 3 === 1 ? '#D9531E' : '#FFC97A',
            opacity: 0.3 + (i % 5) * 0.1,
            animation: `emberRise ${3 + (i % 4)}s ease-in infinite`,
            animationDelay: `${(i * 0.37) % 4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function AangaraHeroCore() {
  const [burst, setBurst] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    // Burst fades after 1s, logo resolves in at 0.8s
    const logoTimer = setTimeout(() => setLogoVisible(true), 800);
    const burstTimer = setTimeout(() => setBurst(false), 1200);
    return () => { clearTimeout(logoTimer); clearTimeout(burstTimer); };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
      {/* Burst effect — radial expand from center */}
      {burst && (
        <div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="aangara-burst" />
        </div>
      )}

      {/* EvilEye flame — fills full container, WebGL shader */}
      <div className="absolute inset-0 z-0">
        <EvilEye
          eyeColor="#D9531E"
          intensity={1.6}
          pupilSize={0.25}
          irisWidth={0.22}
          glowIntensity={0.58}
          scale={0.72}
          noiseScale={1.1}
          pupilFollow={0.4}
          flameSpeed={1.3}
          backgroundColor="#F5F2F3"
        />
      </div>

      {/* Rising ember particles */}
      <EmberParticles />

      {/* AANGARA logo mark — composited over the flame */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 transition-all duration-700"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(12px)',
        }}
      >
        {/* Logo image */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 drop-shadow-2xl">
          <Image
            src="/aangara-logo-transparent.png"
            alt="AANGARA — Ember and Leaf"
            fill
            priority
            className="object-contain filter drop-shadow-[0_12px_24px_rgba(217,83,30,0.25)]"
            sizes="(max-width: 640px) 208px, 256px"
          />
        </div>
      </div>

      {/* Data chips — positioned around the graphic */}
      <div className="absolute top-4 right-0 sm:right-4 z-10 space-y-2 hidden sm:block">
        <div className="text-right">
          <div className="inline-flex flex-col items-end px-3 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E8E2DC] shadow-sm">
            <span className="text-[9px] font-mono font-bold text-[#5B8A4A] uppercase tracking-wider">National Grid EF</span>
            <span className="text-base font-bold text-[#1A1C18] font-mono tabular-nums">0.716</span>
            <span className="text-[9px] text-[#6B7A72] font-mono">tCO₂e/MWh</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 sm:left-4 z-10 hidden sm:block">
        <div className="inline-flex flex-col px-3 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E8E2DC] shadow-sm">
          <span className="text-[9px] font-mono font-bold text-[#5B8A4A] uppercase tracking-wider">Monitored Sectors</span>
          <span className="text-base font-bold text-[#1A1C18] font-mono tabular-nums">7 Active</span>
          <span className="text-[9px] text-[#6B7A72] font-mono">490+ Units</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-0 sm:right-4 z-10 hidden sm:block">
        <div className="inline-flex flex-col items-end px-3 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E8E2DC] shadow-sm">
          <span className="text-[9px] font-mono font-bold text-[#D9531E] uppercase tracking-wider">Price Scenario Range</span>
          <span className="text-base font-bold text-[#1A1C18] font-mono tabular-nums">₹500–₹2,500</span>
          <span className="text-[9px] text-[#6B7A72] font-mono">per CCC</span>
        </div>
      </div>

      <div className="absolute top-4 left-0 sm:left-4 z-10 hidden sm:block">
        <div className="inline-flex flex-col px-3 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E8E2DC] shadow-sm">
          <span className="text-[9px] font-mono font-bold text-[#6B7A72] uppercase tracking-wider">Draft Scope</span>
          <span className="text-sm font-bold text-[#1A1C18] leading-tight">Iron & Steel</span>
          <span className="text-[9px] text-[#6B7A72] font-mono">255 Units</span>
        </div>
      </div>
    </div>
  );
}
