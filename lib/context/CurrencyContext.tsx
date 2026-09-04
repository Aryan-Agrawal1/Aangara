"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SupportedCurrency,
  CURRENCY_DEFINITIONS,
  convertFromINR,
  formatCurrency,
  formatCrore,
} from "@/lib/registries/currency-registry";

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  format: (inrAmount: number, compact?: boolean) => string;
  formatCr: (inrCrAmount: number) => string;
  convert: (inrAmount: number) => { value: number; symbol: string; formatted: string };
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  setCurrency: () => {},
  format: (val) => formatCurrency(val, "INR"),
  formatCr: (cr) => formatCrore(cr, "INR"),
  convert: (val) => ({ value: val, symbol: "₹", formatted: formatCurrency(val, "INR") }),
  symbol: "₹",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<SupportedCurrency>("INR");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aangara_preferred_currency");
      if (saved && saved in CURRENCY_DEFINITIONS) {
        setCurrencyState(saved as SupportedCurrency);
      }
    } catch {
      // ignore in SSR
    }
  }, []);

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("aangara_preferred_currency", c);
    } catch {
      // ignore
    }
  };

  const format = (inrAmount: number, compact = false) => {
    if (currency === "INR") {
      return formatCurrency(inrAmount, "INR", compact);
    }
    const conv = convertFromINR(inrAmount, currency);
    return conv.formatted;
  };

  const formatCr = (inrCrAmount: number) => {
    return formatCrore(inrCrAmount, currency);
  };

  const convert = (inrAmount: number) => {
    const conv = convertFromINR(inrAmount, currency);
    return {
      value: conv.value,
      symbol: conv.symbol,
      formatted: conv.formatted,
    };
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        formatCr,
        convert,
        symbol: CURRENCY_DEFINITIONS[currency]?.symbol || "₹",
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
