'use client';

/**
 * InfoTooltip — Universal AANGARA tooltip component
 * Works on hover (desktop), click/touch (mobile), and keyboard (accessibility).
 * Positions above trigger by default; flips below if near top of viewport.
 */
import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  /** The definition or explanation text shown in the tooltip */
  content: string;
  /** Optional custom trigger element — defaults to a HelpCircle icon */
  children?: ReactNode;
  /** Extra classes on the outer wrapper span */
  className?: string;
  /** Icon size class (default: w-3.5 h-3.5) */
  iconSize?: string;
}

export function InfoTooltip({ content, children, className = '', iconSize = 'w-3.5 h-3.5' }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Determine if tooltip should appear above or below
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    // If trigger is in upper 35% of viewport, flip tooltip to below
    setFlipUp(rect.top < window.innerHeight * 0.35);
  }, []);

  const show = useCallback(() => {
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => setVisible(false), []);

  const toggle = useCallback(() => {
    if (visible) hide(); else show();
  }, [visible, show, hide]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    const handleOutside = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node)
      ) hide();
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [visible, hide]);

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      {/* Trigger */}
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-label="More information"
        aria-expanded={visible}
        className="inline-flex items-center cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D2E]/40 rounded"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={toggle}
        onTouchStart={(e) => { e.preventDefault(); toggle(); }}
      >
        {children ?? (
          <HelpCircle className={`${iconSize} text-[#6B7A72] hover:text-[#1F4D2E] transition-colors flex-shrink-0`} />
        )}
      </span>

      {/* Tooltip panel */}
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`
            absolute z-[9999] w-[260px] bg-white border border-[#E4E9E6]
            rounded-xl shadow-[0_8px_32px_rgba(26,28,24,0.16)]
            px-3.5 py-3 text-[11px] text-[#10231C] leading-relaxed
            animate-in fade-in zoom-in-95 duration-150
            left-1/2 -translate-x-1/2
            ${flipUp ? 'top-full mt-2' : 'bottom-full mb-2'}
          `}
          style={{ maxWidth: 'min(260px, calc(100vw - 32px))' }}
        >
          {/* Arrow */}
          <span
            className={`
              absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-[#E4E9E6]
              rotate-45
              ${flipUp ? '-top-1.5 border-b-0 border-r-0' : '-bottom-1.5 border-t-0 border-l-0'}
            `}
          />
          {content}
        </div>
      )}
    </span>
  );
}
