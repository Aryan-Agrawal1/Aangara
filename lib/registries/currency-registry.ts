/**
 * AANGARA Currency Registry v3.0
 * ─────────────────────────────────────────────────────────
 * INR is the canonical currency for all calculations per spec §2.1.
 * All monetary outputs are stored and computed in INR.
 * Conversion to other currencies is a PRESENTATION-ONLY operation.
 *
 * Never feed a converted value back into a calculation.
 * FX rates must be tagged with source, date, and type.
 *
 * Sources:
 *   RBI Reference Rate: https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx
 *   For scenarios: use FX_rate_type = 'SCENARIO_ASSUMPTION'
 */

export type FXRateType =
  | 'RBI_REFERENCE'      // Official RBI reference rate
  | 'MARKET_INDICATIVE'  // Live market rate (indicative)
  | 'BUDGET_RATE'        // Internal company budget rate
  | 'SCENARIO_ASSUMPTION'; // Explicitly flagged scenario

export type SupportedCurrency =
  | 'INR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'SGD'
  | 'JPY'
  | 'AED'
  | 'SAR'
  | 'CNY';

export interface CurrencyDefinition {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  locale: string;
  decimal_places: number;
  region: string;
}

export interface FXRate {
  rate_id: string;
  from: 'INR';
  to: SupportedCurrency;
  /** Rate = how many [to] per 1 INR */
  rate_per_inr: number;
  /** Inverse: how many INR per 1 [to] */
  inr_per_unit: number;
  rate_type: FXRateType;
  source: string;
  effective_date: string;
  notes?: string;
}

// ─────────────────────────────────────────────
// Currency metadata
// ─────────────────────────────────────────────

export const CURRENCY_DEFINITIONS: Record<SupportedCurrency, CurrencyDefinition> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', decimal_places: 2, region: 'India' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', decimal_places: 2, region: 'USA' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', decimal_places: 2, region: 'Eurozone' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', decimal_places: 2, region: 'UK' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG', decimal_places: 2, region: 'Singapore' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP', decimal_places: 0, region: 'Japan' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', locale: 'ar-AE', decimal_places: 2, region: 'UAE' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', locale: 'ar-SA', decimal_places: 2, region: 'Saudi Arabia' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN', decimal_places: 2, region: 'China' },
};

// ─────────────────────────────────────────────
// Reference FX rates (as of Sep 2026 — must be updated regularly)
// These are MARKET_INDICATIVE defaults used when no live rate is supplied
// Source: RBI Reference Rate archive
// ─────────────────────────────────────────────

export const REFERENCE_FX_RATES: Record<SupportedCurrency, FXRate> = {
  INR: {
    rate_id: 'FX-INR-INR',
    from: 'INR', to: 'INR',
    rate_per_inr: 1.0,
    inr_per_unit: 1.0,
    rate_type: 'RBI_REFERENCE',
    source: 'Canonical base currency',
    effective_date: '2026-09-04',
  },
  USD: {
    rate_id: 'FX-INR-USD-2609',
    from: 'INR', to: 'USD',
    rate_per_inr: 0.01196,    // 1 INR = 0.01196 USD (1 USD ≈ ₹83.6)
    inr_per_unit: 83.6,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI Reference Rate',
    effective_date: '2026-09-04',
    notes: 'Update from RBI before each report generation.',
  },
  EUR: {
    rate_id: 'FX-INR-EUR-2609',
    from: 'INR', to: 'EUR',
    rate_per_inr: 0.01102,    // 1 EUR ≈ ₹90.8
    inr_per_unit: 90.8,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI Reference Rate / ECB',
    effective_date: '2026-09-04',
  },
  GBP: {
    rate_id: 'FX-INR-GBP-2609',
    from: 'INR', to: 'GBP',
    rate_per_inr: 0.00944,    // 1 GBP ≈ ₹105.9
    inr_per_unit: 105.9,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI Reference Rate / Bank of England',
    effective_date: '2026-09-04',
  },
  SGD: {
    rate_id: 'FX-INR-SGD-2609',
    from: 'INR', to: 'SGD',
    rate_per_inr: 0.01610,    // 1 SGD ≈ ₹62.1
    inr_per_unit: 62.1,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI / MAS indicative',
    effective_date: '2026-09-04',
  },
  JPY: {
    rate_id: 'FX-INR-JPY-2609',
    from: 'INR', to: 'JPY',
    rate_per_inr: 1.755,      // 1 JPY ≈ ₹0.570
    inr_per_unit: 0.570,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI / BOJ indicative',
    effective_date: '2026-09-04',
  },
  AED: {
    rate_id: 'FX-INR-AED-2609',
    from: 'INR', to: 'AED',
    rate_per_inr: 0.04394,    // 1 AED ≈ ₹22.76
    inr_per_unit: 22.76,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI / CBUAE indicative',
    effective_date: '2026-09-04',
  },
  SAR: {
    rate_id: 'FX-INR-SAR-2609',
    from: 'INR', to: 'SAR',
    rate_per_inr: 0.04489,    // 1 SAR ≈ ₹22.27
    inr_per_unit: 22.27,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI / SAMA indicative',
    effective_date: '2026-09-04',
  },
  CNY: {
    rate_id: 'FX-INR-CNY-2609',
    from: 'INR', to: 'CNY',
    rate_per_inr: 0.08668,    // 1 CNY ≈ ₹11.54
    inr_per_unit: 11.54,
    rate_type: 'MARKET_INDICATIVE',
    source: 'RBI / PBOC indicative',
    effective_date: '2026-09-04',
  },
};

// ─────────────────────────────────────────────
// Conversion Helpers
// ─────────────────────────────────────────────

/**
 * Convert an INR value to another currency.
 * PRESENTATION ONLY — never feed result back into a calculation.
 *
 * @param inr_value - Value in INR (canonical)
 * @param to - Target currency
 * @param custom_rate - Override rate (e.g. from live API or user input)
 */
export function convertFromINR(
  inr_value: number,
  to: SupportedCurrency,
  custom_rate?: Partial<FXRate>
): {
  value: number;
  currency: SupportedCurrency;
  symbol: string;
  fx_rate: number;
  rate_type: FXRateType;
  effective_date: string;
  formatted: string;
  inr_canonical: number;
  rate_applied: number;
} {
  if (to === 'INR') {
    return {
      value: inr_value,
      currency: 'INR',
      symbol: '₹',
      fx_rate: 1.0,
      rate_type: 'RBI_REFERENCE',
      effective_date: new Date().toISOString().slice(0, 10),
      formatted: formatCurrency(inr_value, 'INR'),
      inr_canonical: inr_value,
      rate_applied: 1.0,
    };
  }

  const base = REFERENCE_FX_RATES[to];
  const rate = custom_rate?.rate_per_inr ?? base.rate_per_inr;
  const rate_type = custom_rate?.rate_type ?? base.rate_type;
  const effective_date = custom_rate?.effective_date ?? base.effective_date;
  const converted = inr_value * rate;
  const def = CURRENCY_DEFINITIONS[to];

  return {
    value: converted,
    currency: to,
    symbol: def.symbol,
    fx_rate: rate,
    rate_type,
    effective_date,
    formatted: formatCurrency(converted, to),
    inr_canonical: inr_value,
    rate_applied: rate,
  };
}

/**
 * Convert a foreign currency amount to INR.
 * Used for importing USD-priced items (crude oil, imported coal, equipment).
 */
export function convertToINR(
  foreign_value: number,
  from: SupportedCurrency,
  custom_rate?: Partial<FXRate>
): number {
  if (from === 'INR') return foreign_value;
  const base = REFERENCE_FX_RATES[from];
  const inr_per_unit = custom_rate?.inr_per_unit ?? base.inr_per_unit;
  return foreign_value * inr_per_unit;
}

/**
 * Format a currency value for display.
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
export function formatCurrency(
  value: number,
  currency: SupportedCurrency,
  compact = false
): string {
  const def = CURRENCY_DEFINITIONS[currency];
  // INR: use crore/lakh notation for large numbers
  if (currency === 'INR') {
    if (compact) {
      if (Math.abs(value) >= 1e7) return `${def.symbol}${(value / 1e7).toFixed(2)} Cr`;
      if (Math.abs(value) >= 1e5) return `${def.symbol}${(value / 1e5).toFixed(2)} L`;
    }
    return new Intl.NumberFormat(def.locale, {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: def.decimal_places,
    }).format(value);
  }
  return new Intl.NumberFormat(def.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: def.decimal_places,
  }).format(value);
}

/**
 * Format INR crore value for compact display (e.g. "₹48.5 Cr").
 */
export function formatCrore(value_cr: number, to?: SupportedCurrency, rate?: Partial<FXRate>): string {
  if (!to || to === 'INR') {
    return `₹${value_cr.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
  }
  const inr = value_cr * 1e7;
  const conv = convertFromINR(inr, to, rate);
  return `${conv.symbol}${(conv.value / 1e6).toFixed(2)}M`;
}

/** List all supported currencies for UI selector */
export const SUPPORTED_CURRENCIES = Object.values(CURRENCY_DEFINITIONS);

/** Default display currency */
export const DEFAULT_CURRENCY: SupportedCurrency = 'INR';
