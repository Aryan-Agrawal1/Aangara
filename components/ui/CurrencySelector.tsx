"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";
import {
  SupportedCurrency,
  CURRENCY_DEFINITIONS,
} from "@/lib/registries/currency-registry";

export function CurrencySelector({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const curDef = CURRENCY_DEFINITIONS[currency];
  const list = Object.values(CURRENCY_DEFINITIONS);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E8E2DC] bg-[#FDFCFA] hover:bg-[#F0EDE9] text-[#1A1C18] text-xs font-semibold transition-all duration-150 shadow-sm"
        aria-label="Select Currency"
        title="Change display currency (Canonical backend is INR)"
      >
        <Globe className="w-3.5 h-3.5 text-[#1F4D2E]" />
        <span className="font-mono text-[#1F4D2E] font-bold">{curDef.symbol}</span>
        <span className="font-medium text-[#4A5446]">{currency}</span>
        <ChevronDown className={`w-3 h-3 text-[#6B7268] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E8E2DC] rounded-xl shadow-[0_8px_32px_rgba(26,28,24,0.14)] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-[#F0EDE9] text-[10px] uppercase font-bold tracking-wider text-[#6B7268]">
            Display Currency
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {list.map((c) => {
              const active = c.code === currency;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left font-medium transition-colors ${
                    active
                      ? "bg-[#E8F2EB] text-[#1F4D2E] font-semibold"
                      : "text-[#4A5446] hover:text-[#1A1C18] hover:bg-[#F7F5F2]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono font-bold text-[#1F4D2E]">{c.symbol}</span>
                    <span>{c.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6B7268] uppercase">{c.code}</span>
                </button>
              );
            })}
          </div>
          <div className="px-3 py-1.5 border-t border-[#F0EDE9] text-[9px] text-[#6B7268] bg-[#FDFCFA]">
            Backend canonical: INR (RBI reference rate)
          </div>
        </div>
      )}
    </div>
  );
}
