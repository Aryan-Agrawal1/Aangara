"use client";
import React from "react";
import { useTheme } from "@/lib/theme";

export function UtilityBar() {
  const { theme, toggle } = useTheme();
  const [fontSize, setFontSize] = React.useState(100);
  const adjustFont = (delta: number) => {
    setFontSize((prev) => {
      const next = Math.max(90, Math.min(130, prev + delta * 10));
      document.documentElement.style.fontSize = `${next}%`;
      return next;
    });
  };
  return (
    <>
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #FF9933 33%, #FFFFFF 33% 66%, #138808 66%)" }} aria-hidden="true" />
      <div className="bg-[#F6F8F7] border-b border-[#E4E9E6] py-1 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-[11px] text-[#4B5A54]">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-3 focus:py-1 focus:bg-[#C9622A] focus:text-white focus:rounded">Skip to main content</a>
          <span className="font-medium text-[#10231C] hidden sm:block">CarbonAlpha India — CCTS Decision Intelligence Platform</span>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[#6B7A72] hidden sm:block">Accessibility:</span>
            <button onClick={() => adjustFont(-1)} className="w-5 h-5 flex items-center justify-center hover:bg-[#E4E9E6] rounded text-[10px] font-bold transition-colors" aria-label="Decrease text size">A−</button>
            <button onClick={() => { setFontSize(100); document.documentElement.style.fontSize = ""; }} className="w-5 h-5 flex items-center justify-center hover:bg-[#E4E9E6] rounded text-[10px] font-bold transition-colors" aria-label="Reset text size">A</button>
            <button onClick={() => adjustFont(1)} className="w-5 h-5 flex items-center justify-center hover:bg-[#E4E9E6] rounded text-[10px] font-bold transition-colors" aria-label="Increase text size">A+</button>
            <span className="text-[#E4E9E6]">|</span>
            <button onClick={() => { const el = document.documentElement; el.setAttribute("data-reduced-motion", el.getAttribute("data-reduced-motion") === "true" ? "false" : "true"); }} className="hover:bg-[#E4E9E6] px-1.5 py-0.5 rounded transition-colors hidden sm:block" aria-label="Toggle reduced motion">Reduced Motion</button>
          </div>
        </div>
      </div>
    </>
  );
}