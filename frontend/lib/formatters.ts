export function formatCurrencyCr(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '\u20B90.00 Cr';
  return `\u20B9${val.toFixed(2)} Cr`;
}

export function formatPricePerTonne(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '\u20B90/tCO2e';
  return `\u20B9${Math.round(val).toLocaleString('en-IN')}/tCO2e`;
}

export function formatTonnes(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '0 t';
  return `${Math.round(val).toLocaleString('en-IN')} t`;
}

export function formatEmissions(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '0 tCO2e';
  return `${Math.round(val).toLocaleString('en-IN')} tCO2e`;
}

export function formatGEI(val: number | null | undefined, unit: string = 'tCO2e/t'): string {
  if (val === null || val === undefined || isNaN(val)) return `0.0000 ${unit}`;
  return `${val.toFixed(4)} ${unit}`;
}

export function formatPercent(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${val.toFixed(1)}%`;
}

export function formatYears(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${val.toFixed(1)} yrs`;
}
