'use client';

/**
 * AutopilotSpotlight — Smooth element highlight ring
 * Follows the currently-showcased element with a branded glow.
 * Absolutely non-blocking — transparent to all clicks.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useAutopilot } from '@/lib/autopilot/context';

interface Ring {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function AutopilotSpotlight() {
  const { status, spotlightSelector } = useAutopilot();
  const [ring, setRing] = useState<Ring | null>(null);
  const rafRef = useRef<number>(0);

  const updatePosition = () => {
    if (!spotlightSelector) { setRing(null); return; }
    const el = document.querySelector(spotlightSelector);
    if (!el) { setRing(null); return; }
    const rect = el.getBoundingClientRect();
    setRing({
      top: rect.top + window.scrollY - 6,
      left: rect.left + window.scrollX - 6,
      width: rect.width + 12,
      height: rect.height + 12,
    });
  };

  useEffect(() => {
    if (status === 'idle') { setRing(null); return; }

    // Initial position
    rafRef.current = requestAnimationFrame(updatePosition);

    const onScroll = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(updatePosition); };
    const onResize = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(updatePosition); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [spotlightSelector, status]);

  if (status === 'idle' || !ring) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: ring.top,
        left: ring.left,
        width: ring.width,
        height: ring.height,
        borderRadius: '14px',
        pointerEvents: 'none',
        transition: 'top 400ms cubic-bezier(0.4,0,0.2,1), left 400ms cubic-bezier(0.4,0,0.2,1), width 400ms, height 400ms',
        boxShadow: '0 0 0 3px #1F4D2E, 0 0 0 6px rgba(31,77,46,0.18), 0 0 24px rgba(31,77,46,0.12)',
        zIndex: 9998,
      }}
    />
  );
}
