'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// EvilEye must be dynamically imported — OGL WebGL cannot run server-side
const EvilEye = dynamic(() => import('./EvilEye'), { ssr: false });

// ─── Phase timing constants (ms) ───────────────────────────────────────────
const PHASE_TIMINGS = {
  P0_ATMOSPHERE:  0,       // dark atmosphere
  P1_MATERIALIZE: 800,     // eye begins to form
  P2_ALIVE:       2500,    // iris pulsing, particles intensify
  P3_PEAK:        4000,    // contraction, gold sparks
  P4_EXPAND:      5200,    // radial energy bloom
  P5_LOGO:        6000,    // AANGARA logo emerges
  P6_SETTLE:      7000,    // everything settles
} as const;

// Gold spark directions (8 radial vectors)
const GOLD_SPARKS = [
  { angle: 0,   dist: 90 },  { angle: 45,  dist: 110 },
  { angle: 90,  dist: 95 },  { angle: 135, dist: 105 },
  { angle: 180, dist: 90 },  { angle: 225, dist: 115 },
  { angle: 270, dist: 100 }, { angle: 315, dist: 108 },
];

// Ember particle config (24 particles across phases)
function generateEmbers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + (i % 4),
    left: `${8 + (i * 3.7) % 84}%`,
    bottom: `${-6 + (i * 5.3) % 16}%`,
    color: i % 3 === 0 ? '#F2C94C' : i % 3 === 1 ? '#D9531E' : '#F2984A',
    opacity: 0.2 + (i % 5) * 0.12,
    duration: 2.8 + (i % 5) * 0.6,
    delay: (i * 0.28) % 4.5,
  }));
}

const EMBERS_PHASE1 = generateEmbers(8);
const EMBERS_PHASE2 = generateEmbers(14);
const EMBERS_PHASE3 = generateEmbers(22);

// ─── EvilEye props interpolated across phases ──────────────────────────────
interface EyeParams {
  glowIntensity: number;
  scale: number;
  flameSpeed: number;
  intensity: number;
  backgroundColor: string;
}

const EYE_PHASES: Record<string, EyeParams> = {
  p0: { glowIntensity: 0.04, scale: 0.42, flameSpeed: 0.6,  intensity: 0.5,  backgroundColor: '#0E0F0A' },
  p1: { glowIntensity: 0.20, scale: 0.58, flameSpeed: 0.9,  intensity: 1.0,  backgroundColor: '#0E0F0A' },
  p2: { glowIntensity: 0.40, scale: 0.68, flameSpeed: 1.2,  intensity: 1.4,  backgroundColor: '#0E0F0A' },
  p3: { glowIntensity: 0.65, scale: 0.60, flameSpeed: 1.6,  intensity: 1.8,  backgroundColor: '#0C100A' },
  p4: { glowIntensity: 0.72, scale: 0.75, flameSpeed: 1.8,  intensity: 1.9,  backgroundColor: '#12180E' },
  p5: { glowIntensity: 0.45, scale: 0.72, flameSpeed: 1.3,  intensity: 1.5,  backgroundColor: '#1E2614' },
  p6: { glowIntensity: 0.30, scale: 0.72, flameSpeed: 1.1,  intensity: 1.3,  backgroundColor: '#F5F2F3' },
};

type PhaseKey = keyof typeof EYE_PHASES;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

// ─── Component ─────────────────────────────────────────────────────────────
export function AangaraHeroCore() {
  const [phase, setPhase]           = useState<PhaseKey>('p0');
  const [eyeParams, setEyeParams]   = useState<EyeParams>(EYE_PHASES.p0);
  const [showBurst, setShowBurst]   = useState(false);
  const [showRing, setShowRing]     = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const [showLogo, setShowLogo]     = useState(false);
  const [emberCount, setEmberCount] = useState(0);
  const [bgStyle, setBgStyle]       = useState<React.CSSProperties>({
    background: 'radial-gradient(ellipse at 65% 50%, #1A1F12 0%, #0E0F0A 60%, #080908 100%)',
  });

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const reducedMotion = useRef(false);

  // Smooth eye param interpolation via RAF
  const targetParams = useRef<EyeParams>(EYE_PHASES.p0);
  const currentParams = useRef<EyeParams>({ ...EYE_PHASES.p0 });

  const animateParams = useCallback(() => {
    const speed = 0.025; // interpolation speed per frame
    const cur = currentParams.current;
    const tgt = targetParams.current;
    let changed = false;

    const next: EyeParams = {
      glowIntensity: lerp(cur.glowIntensity, tgt.glowIntensity, speed),
      scale:         lerp(cur.scale,         tgt.scale,         speed),
      flameSpeed:    lerp(cur.flameSpeed,    tgt.flameSpeed,    speed),
      intensity:     lerp(cur.intensity,     tgt.intensity,     speed),
      backgroundColor: tgt.backgroundColor,
    };

    if (Math.abs(next.glowIntensity - cur.glowIntensity) > 0.001) changed = true;
    currentParams.current = next;
    if (changed) setEyeParams({ ...next });

    rafRef.current = requestAnimationFrame(animateParams);
  }, []);

  const transitionTo = useCallback((key: PhaseKey) => {
    targetParams.current = EYE_PHASES[key];
    setPhase(key);
  }, []);

  useEffect(() => {
    // Check reduced motion preference
    reducedMotion.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
      !!sessionStorage.getItem('ca_hero_animated_v2');

    // Skip to settled state immediately for reduced motion
    if (reducedMotion.current) {
      currentParams.current = { ...EYE_PHASES.p6 };
      targetParams.current  = { ...EYE_PHASES.p6 };
      setEyeParams({ ...EYE_PHASES.p6 });
      setPhase('p6');
      setShowLogo(true);
      setEmberCount(8);
      setBgStyle({ background: '#F5F2F3' });
      return;
    }

    // Start smooth param interpolation
    rafRef.current = requestAnimationFrame(animateParams);
    startTimeRef.current = Date.now();

    // ── Phase timeline ──────────────────────────────────────────────────────

    // P0 → P1: eye materializes
    const t1 = setTimeout(() => {
      transitionTo('p1');
      setEmberCount(8);
    }, PHASE_TIMINGS.P1_MATERIALIZE);

    // P1 → P2: alive — iris breathes, particles up
    const t2 = setTimeout(() => {
      transitionTo('p2');
      setEmberCount(14);
    }, PHASE_TIMINGS.P2_ALIVE);

    // P2 → P3: peak energy contraction + gold sparks
    const t3 = setTimeout(() => {
      transitionTo('p3');
      setEmberCount(22);
      setShowSparks(true);
      // Burst fires at P3
      setTimeout(() => setShowBurst(true), 200);
      // Sparks clear after animation
      setTimeout(() => setShowSparks(false), 1200);
    }, PHASE_TIMINGS.P3_PEAK);

    // P3 → P4: radial energy expansion
    const t4 = setTimeout(() => {
      transitionTo('p4');
      setShowRing(true);
      // Background starts warming
      setBgStyle({
        background: 'radial-gradient(ellipse at 60% 50%, #2B3520 0%, #1A1F12 50%, #0E0F0A 100%)',
        transition: 'background 1.2s ease-out',
      });
      setTimeout(() => setShowBurst(false), 500);
      setTimeout(() => setShowRing(false), 1600);
    }, PHASE_TIMINGS.P4_EXPAND);

    // P4 → P5: logo emerges, background transitions to parchment
    const t5 = setTimeout(() => {
      transitionTo('p5');
      setShowLogo(true);
      // Background transitions through deep forest to parchment
      setBgStyle({
        background: 'radial-gradient(ellipse at 55% 45%, #2D4A3D 0%, #1F4D2E 35%, #1A2B1E 70%, #0E0F0A 100%)',
        transition: 'background 1.4s cubic-bezier(0.25, 1, 0.5, 1)',
      });
    }, PHASE_TIMINGS.P5_LOGO);

    // P5 → P6: fully settled — parchment background, logo at rest
    const t6 = setTimeout(() => {
      transitionTo('p6');
      setBgStyle({
        background: '#F5F2F3',
        transition: 'background 1.0s ease-out',
      });
      // Mark as animated so subsequent visits skip the sequence
      sessionStorage.setItem('ca_hero_animated_v2', '1');
    }, PHASE_TIMINGS.P6_SETTLE);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
    };
  }, [animateParams, transitionTo]);

  const embers = emberCount === 8 ? EMBERS_PHASE1 : emberCount === 14 ? EMBERS_PHASE2 : EMBERS_PHASE3;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] rounded-2xl overflow-hidden transition-all duration-500"
      style={bgStyle}
      aria-hidden="false"
    >
      {/* ── EvilEye WebGL flame — fills full container ── */}
      <div className={`absolute inset-0 z-0 ${phase !== 'p0' ? 'aangara-eye-iris-breathe' : ''}`}>
        <EvilEye
          eyeColor="#D9531E"
          intensity={eyeParams.intensity}
          pupilSize={0.22}
          irisWidth={0.22}
          glowIntensity={eyeParams.glowIntensity}
          scale={eyeParams.scale}
          noiseScale={1.15}
          pupilFollow={0.35}
          flameSpeed={eyeParams.flameSpeed}
          backgroundColor={eyeParams.backgroundColor}
        />
      </div>

      {/* ── Ember particles — ramp up across phases ── */}
      {emberCount > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-1" aria-hidden="true">
          {embers.map((e) => (
            <div
              key={e.id}
              className="absolute rounded-full"
              style={{
                width: `${e.size}px`,
                height: `${e.size}px`,
                left: e.left,
                bottom: e.bottom,
                backgroundColor: e.color,
                opacity: e.opacity,
                animation: `emberRise ${e.duration}s ease-in infinite`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Phase 3: Gold spark burst (8 radial particles) ── */}
      {showSparks && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center" aria-hidden="true">
          {GOLD_SPARKS.map((spark, i) => {
            const rad = (spark.angle * Math.PI) / 180;
            const sx = `${Math.cos(rad) * spark.dist}px`;
            const sy = `${-Math.sin(rad) * spark.dist}px`;
            return (
              <div
                key={i}
                className="aangara-gold-spark"
                style={{ '--sx': sx, '--sy': sy } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* ── Phase 4: Radial energy burst ── */}
      {showBurst && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" aria-hidden="true">
          <div className="aangara-burst" />
        </div>
      )}

      {/* ── Phase 4: Energy ring ── */}
      {showRing && (
        <div className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center" aria-hidden="true">
          <div
            className="aangara-energy-ring"
            style={{ width: '240px', height: '120px' }}
          />
        </div>
      )}

      {/* ── Phase 5-6: AANGARA Logo emerges ── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          opacity: showLogo ? 1 : 0,
          transform: showLogo ? 'scale(1) translateY(0)' : 'scale(1.15) translateY(10px)',
          transition: 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
          <Image
            src="/aangara-logo-transparent.png"
            alt="AANGARA — Carbon Intelligence"
            fill
            priority
            className="object-contain drop-shadow-[0_16px_40px_rgba(217,83,30,0.30)]"
            sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 320px"
          />
        </div>
        {/* Wordmark below logo — appears only in settled state */}
        <p
          style={{
            opacity: phase === 'p6' ? 1 : 0,
            transform: phase === 'p6' ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
          }}
          className="mt-2 text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-[#4A5446]/70 select-none"
        >
          Carbon Intelligence
        </p>
      </div>
    </div>
  );
}
