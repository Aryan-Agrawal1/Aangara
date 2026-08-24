"use client";
import React from "react";

// UtilityBar — visual strip removed per AANGARA 2.0 design spec.
// Skip-to-content link preserved as screen-reader-only for accessibility.
// Font size and reduced-motion controls are handled internally via CSS media queries.
export function UtilityBar() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1F4D2E] focus:text-white focus:text-sm focus:font-semibold focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}