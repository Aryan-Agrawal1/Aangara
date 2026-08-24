'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 50;
const INTRO_DURATION_MS = 6000; // 0s - 6.0s plays full intro frames 1-50
const LOGO_EMERGE_TIME_MS = 4800; // Logo starts emerging
const SETTLE_TIME_MS = 6200; // Animation enters continuous living flame state

// Continuous flame loop: oscillate between frame 18 and 36 for rich, persistent burning flame
const LOOP_START_FRAME = 18;
const LOOP_END_FRAME = 36;

export function AangaraHeroCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [settled, setSettled] = useState(false);
  
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const isIntersectingRef = useRef(true);

  // Preload all 50 transparent WebP frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const frameNum = i < 10 ? `0${i}` : `${i}`;
      img.src = `/images/hero_frames/frame_${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= Math.min(TOTAL_FRAMES, 20)) {
          setFramesLoaded(true);
        }
      };
      images.push(img);
    }
    framesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
      });
    };
  }, []);

  // Performance: Pause when tab is hidden or hero is scrolled out of viewport
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // Coordinated animation sequence & continuous living flame loop
  useEffect(() => {
    if (!framesLoaded) return;

    const startTime = performance.now();
    let isLoopingReverse = false;
    let currentLoopFrame = LOOP_START_FRAME;
    let lastLoopTick = performance.now();

    // Trigger logo emergence and settle timers
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, LOGO_EMERGE_TIME_MS);

    const settleTimer = setTimeout(() => {
      setSettled(true);
    }, SETTLE_TIME_MS);

    const render = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      // Performance guard: Skip drawing if tab hidden or off-screen
      if (!isVisibleRef.current || !isIntersectingRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const elapsed = now - startTime;
      let frameIndex = 0;

      if (elapsed < INTRO_DURATION_MS) {
        // Intro phase: progress smoothly through all 50 frames
        const progress = Math.min(1, elapsed / INTRO_DURATION_MS);
        frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * TOTAL_FRAMES)
        );
      } else {
        // Settled continuous phase: keep the flame actively burning indefinitely
        const loopDt = now - lastLoopTick;
        if (loopDt > 85) { // ~12 fps for organic, living flame flicker
          lastLoopTick = now;
          if (!isLoopingReverse) {
            currentLoopFrame++;
            if (currentLoopFrame >= LOOP_END_FRAME) {
              isLoopingReverse = true;
            }
          } else {
            currentLoopFrame--;
            if (currentLoopFrame <= LOOP_START_FRAME) {
              isLoopingReverse = false;
            }
          }
        }
        frameIndex = currentLoopFrame;
      }

      const img = framesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      clearTimeout(logoTimer);
      clearTimeout(settleTimer);
    };
  }, [framesLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] select-none"
    >
      {/* ── Layer 1: Rich Atmospheric Background Wash Filling the Entire Right Half ── */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        {/* Core primary flame radiant wash */}
        <div
          className={`w-[450px] sm:w-[620px] lg:w-[780px] h-[450px] sm:h-[620px] lg:h-[780px] rounded-full transition-all duration-1000 ${
            settled ? 'opacity-85 scale-100' : 'opacity-95 scale-105'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(217,83,30,0.30) 0%, rgba(242,152,74,0.22) 32%, rgba(31,77,46,0.14) 58%, rgba(245,242,243,0) 78%)',
            filter: 'blur(42px)',
          }}
        />

        {/* Secondary ambient green-gold corona wash */}
        <div
          className="absolute w-[360px] sm:w-[500px] lg:w-[640px] h-[360px] sm:h-[500px] lg:h-[640px] rounded-full opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(242,201,76,0.25) 0%, rgba(31,77,46,0.18) 45%, transparent 72%)',
            filter: 'blur(54px)',
          }}
        />
      </div>

      {/* ── Layer 2: Scaled-Up Transparent Canvas Eye Animation (Zero Black Box) ── */}
      <div className="relative z-10 w-full max-w-[720px] lg:max-w-[840px] aspect-[16/9] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_16px_48px_rgba(217,83,30,0.22)]"
          aria-label="AANGARA Fiery Eye Carbon Intelligence Visual"
        />
      </div>

      {/* ── Layer 3: High-Resolution AANGARA Logo Reveal (Static, Crisp, Centered) ── */}
      <div
        className="absolute z-20 flex flex-col items-center pointer-events-none"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible
            ? 'scale(1) translateY(0)'
            : 'scale(1.10) translateY(10px)',
          transition:
            'opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative w-52 h-52 sm:w-68 sm:h-68 lg:w-80 lg:h-80 xl:w-92 xl:h-92">
          <Image
            src="/aangara-logo-transparent.png"
            alt="AANGARA Logo"
            fill
            priority
            className="object-contain filter drop-shadow-[0_12px_32px_rgba(217,83,30,0.30)]"
            sizes="(max-width: 640px) 208px, (max-width: 1024px) 280px, 360px"
          />
        </div>
      </div>
    </div>
  );
}
