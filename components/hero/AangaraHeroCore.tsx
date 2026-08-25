'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 50;
const INTRO_DURATION_MS = 4500; // 0s - 4.5s plays smooth intro frames 1-50
const LOGO_EMERGE_TIME_MS = 3200; // Logo starts emerging smoothly
const SETTLED_HOLD_FRAME = 28; // The centered, well-composed flame & eye frame

export function AangaraHeroCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const isIntersectingRef = useRef(true);

  // Preload all 50 transparent WebP frames for 60fps smoothness
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const frameNum = i < 10 ? `0${i}` : `${i}`;
      img.src = `/images/hero_frames/frame_${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= Math.min(TOTAL_FRAMES, 25)) {
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

  // Play entry animation once, then hold at the optimal settled position (no continuous looping)
  useEffect(() => {
    if (!framesLoaded) return;

    const startTime = performance.now();

    // Trigger logo emergence
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, LOGO_EMERGE_TIME_MS);

    const render = (now: number) => {
      // Performance guard: Skip drawing if tab hidden or off-screen
      if (!isVisibleRef.current || !isIntersectingRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const elapsed = now - startTime;

      if (elapsed < INTRO_DURATION_MS) {
        // Intro phase: progress smoothly through frames towards settled position
        const progress = Math.min(1, elapsed / INTRO_DURATION_MS);
        // Easing out so the animation slows down gracefully into the settled frame
        const easeOutProgress = 1 - Math.pow(1 - progress, 2.5);
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(easeOutProgress * (TOTAL_FRAMES - 1))
        );

        const img = framesRef.current[frameIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        // Settled state: draw the final centered hold frame once, then stop RAF
        const settledImg = framesRef.current[SETTLED_HOLD_FRAME] || framesRef.current[TOTAL_FRAMES - 1];
        if (settledImg && settledImg.complete && settledImg.naturalWidth > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(settledImg, 0, 0, canvas.width, canvas.height);
        }
        // Stop the animation loop — holds steady indefinitely with 0 CPU usage
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      clearTimeout(logoTimer);
    };
  }, [framesLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] select-none"
    >
      {/* ── Transparent Canvas Eye Animation (Unified background — zero isolated boxes or blur rings) ── */}
      <div className="relative z-10 w-full max-w-[680px] lg:max-w-[760px] aspect-[16/9] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain pointer-events-none"
          aria-label="AANGARA Fiery Eye Carbon Intelligence Visual"
        />
      </div>

      {/* ── High-Resolution AANGARA Logo Reveal (Centered and settled) ── */}
      <div
        className="absolute z-20 flex flex-col items-center pointer-events-none"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible
            ? 'scale(1) translateY(0)'
            : 'scale(1.08) translateY(8px)',
          transition:
            'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
          <Image
            src="/aangara-logo-transparent.png"
            alt="AANGARA Logo"
            fill
            priority
            className="object-contain filter drop-shadow-[0_10px_24px_rgba(217,83,30,0.22)]"
            sizes="(max-width: 640px) 192px, (max-width: 1024px) 240px, 320px"
          />
        </div>
      </div>
    </div>
  );
}
