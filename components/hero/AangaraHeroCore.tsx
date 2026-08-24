'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TOTAL_FRAMES = 50;
const INTRO_DURATION_MS = 6500; // 0s - 6.5s plays full intro frames 1-50
const LOGO_EMERGE_TIME_MS = 5200; // Logo starts emerging
const SETTLE_TIME_MS = 6800; // Animation enters continuous living state

// Continuous loop frames: oscillate between frame 20 and 28 for subtle breathing eye
const LOOP_START_FRAME = 20;
const LOOP_END_FRAME = 28;

export function AangaraHeroCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [settled, setSettled] = useState(false);
  const animFrameIdRef = useRef<number | null>(null);

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
        if (loadedCount >= Math.min(TOTAL_FRAMES, 25)) {
          // As soon as first half is loaded, allow rendering to start immediately
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

  // Coordinated animation sequence & continuous living eye loop
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
        // Settled continuous phase: breathe gently between frames 20 and 28
        const loopDt = now - lastLoopTick;
        if (loopDt > 110) { // ~9 fps for gentle, unhurried breathing
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
        
        // Draw frame centered with high quality
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
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
    <div className="relative w-full flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]">
      {/* ── Layer 1: Ambient Atmospheric Radial Glow (no box, soft blur) ── */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className={`w-[320px] sm:w-[460px] lg:w-[540px] h-[320px] sm:h-[460px] lg:h-[540px] rounded-full transition-opacity duration-1000 ${
            settled ? 'opacity-70' : 'opacity-90'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(242,152,74,0.22) 0%, rgba(217,83,30,0.12) 35%, rgba(31,77,46,0.06) 60%, transparent 75%)',
            filter: 'blur(32px)',
          }}
        />
      </div>

      {/* ── Layer 2: Transparent Canvas Eye Animation (zero black box) ── */}
      <div className="relative z-10 w-full max-w-[580px] aspect-[16/9] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_36px_rgba(217,83,30,0.18)]"
          aria-label="AANGARA Fiery Eye Carbon Intelligence Visual"
        />
      </div>

      {/* ── Layer 3: High-Resolution AANGARA Logo Reveal ── */}
      <div
        className="absolute z-20 flex flex-col items-center pointer-events-none"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible
            ? 'scale(1) translateY(0)'
            : 'scale(1.12) translateY(8px)',
          transition:
            'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
          <Image
            src="/aangara-logo-transparent.png"
            alt="AANGARA Logo"
            fill
            priority
            className="object-contain filter drop-shadow-[0_10px_24px_rgba(217,83,30,0.25)]"
            sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
          />
        </div>
      </div>
    </div>
  );
}
