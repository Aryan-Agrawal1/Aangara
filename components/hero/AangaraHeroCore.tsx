'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 50;
const INTRO_DURATION_MS = 4200; // 0s - 4.2s plays smooth intro sequence frames 1-50
const LOGO_EMERGE_TIME_MS = 3000; // Logo emerges smoothly
const LOOP_START_FRAME = 16; // Start of living flame loop
const LOOP_END_FRAME = 38; // End of living flame loop

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

  // Coordinated intro animation followed by an infinite, smooth continuous flame loop
  useEffect(() => {
    if (!framesLoaded) return;

    const startTime = performance.now();
    let isLoopingReverse = false;
    let currentLoopFrame = LOOP_START_FRAME;
    let lastLoopTick = performance.now();

    // Trigger logo emergence
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, LOGO_EMERGE_TIME_MS);

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
          Math.floor(progress * (TOTAL_FRAMES - 1))
        );
      } else {
        // Infinite continuous flame loop: oscillate between frame 16 and 38
        const loopDt = now - lastLoopTick;
        if (loopDt > 70) { // ~14 fps for organic, living flame flicker
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
    };
  }, [framesLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] select-none"
    >
      {/* ── Transparent Canvas Eye Animation (Unified background, continuous living flame) ── */}
      <div className="relative z-10 w-full max-w-[680px] lg:max-w-[760px] aspect-[16/9] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain pointer-events-none"
          aria-label="AANGARA Fiery Eye Carbon Intelligence Visual"
        />
      </div>


    </div>
  );
}
