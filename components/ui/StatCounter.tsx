"use client";
import React, { useEffect, useRef, useState } from "react";
interface StatCounterProps { value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number; className?: string; }
export function StatCounter({ value, prefix = "", suffix = "", decimals = 0, duration = 1000, className = "" }: StatCounterProps) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-reduced-motion") === "true";
    if (prefersReduced) { setDisplay(value); setHasAnimated(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        const start = Date.now();
        const animate = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          setDisplay((1 - Math.pow(1 - progress, 3)) * value);
          if (progress < 1) requestAnimationFrame(animate); else setDisplay(value);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);
  return <span ref={ref} className={`tnum ${className}`}>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}