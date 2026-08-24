'use client';

import { useEffect, useRef, useState } from 'react';
import './LogoLoop.css';

/**
 * LogoLoop — seamless horizontal marquee of tech stack tiles
 * Pure JS + CSS, zero npm dependencies beyond React.
 * Props:
 *   items      — array of { name, abbr?, color? }
 *   speed      — pixels per second (default 60)
 *   direction  — 'left' | 'right' (default 'left')
 *   pauseOnHover — pause on hover (default true)
 *   fadeOut    — fade edges (default true)
 *   fadeColor  — background color matching page bg for edge fade (default '#F5F2F3')
 *   gap        — gap between items in px (default 28)
 */
export default function LogoLoop({
  items = [],
  speed = 60,
  direction = 'left',
  pauseOnHover = true,
  fadeOut = true,
  fadeColor = '#F5F2F3',
  gap = 28,
}) {
  const trackRef = useRef(null);
  const rafRef   = useRef(null);
  const pos      = useRef(0);
  const paused   = useRef(false);
  const lastTime = useRef(null);
  const [clones, setClones] = useState(1); // number of duplicate sets

  // Measure track width and compute needed clones to fill viewport
  useEffect(() => {
    if (!trackRef.current) return;
    const obs = new ResizeObserver(() => {
      const trackW = trackRef.current?.scrollWidth || 0;
      const viewW  = window.innerWidth;
      if (trackW > 0) {
        setClones(Math.ceil((viewW * 2) / trackW) + 1);
      }
    });
    obs.observe(trackRef.current);
    return () => obs.disconnect();
  }, [items]);

  // RAF animation loop
  useEffect(() => {
    if (!trackRef.current) return;

    function tick(time) {
      if (lastTime.current === null) lastTime.current = time;
      const dt = (time - lastTime.current) / 1000; // seconds
      lastTime.current = time;

      if (!paused.current) {
        const sign = direction === 'left' ? -1 : 1;
        pos.current += sign * speed * dt;

        // Reset position when one full set has scrolled by
        const setWidth = trackRef.current?.children[0]?.offsetWidth ?? 0;
        if (setWidth > 0) {
          if (direction === 'left' && pos.current < -setWidth) {
            pos.current += setWidth + gap;
          } else if (direction === 'right' && pos.current > 0) {
            pos.current -= setWidth + gap;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${pos.current}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTime.current = null;
    };
  }, [speed, direction, gap, clones]);

  const handleMouseEnter = () => { if (pauseOnHover) paused.current = true; };
  const handleMouseLeave = () => { paused.current = false; };

  // Build item sets (original + clones for seamless loop)
  const sets = Array.from({ length: clones + 1 }, (_, i) => i);

  return (
    <div
      className="logo-loop-outer"
      style={{
        '--fade-color': fadeColor,
        '--gap': `${gap}px`,
      }}
      data-fade={fadeOut ? 'true' : 'false'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Technology stack marquee"
    >
      <div ref={trackRef} className="logo-loop-track">
        {sets.map((setIdx) => (
          <div key={setIdx} className="logo-loop-set" style={{ gap: `${gap}px` }}>
            {items.map((item, i) => (
              <div
                key={`${setIdx}-${i}`}
                className="logo-loop-item"
                style={{ '--item-color': item.color || '#1F4D2E' }}
                title={item.name}
                aria-label={item.name}
              >
                {item.icon ? (
                  <span className="logo-loop-icon">{item.icon}</span>
                ) : (
                  <span className="logo-loop-abbr">{item.abbr || item.name.slice(0, 2).toUpperCase()}</span>
                )}
                <span className="logo-loop-label">{item.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
