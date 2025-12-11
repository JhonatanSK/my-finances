/**
 * Format number as Brazilian currency (R$)
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Format number as compact currency (e.g., R$ 1,5M)
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1).replace('.', ',')}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1).replace('.', ',')}K`;
  }
  return formatCurrency(value);
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number | null, decimals: number = 2): string {
  if (value === null) return '-';
  return `${(value * 100).toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Format annual rate for display (e.g., 0.085 -> "8,5%")
 */
export function formatAnnualRate(rate: number): string {
  return formatPercent(rate, 1);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}

/**
 * Parse percentage string to decimal (e.g., "8,5%" -> 0.085)
 */
export function parsePercent(value: string): number {
  const cleaned = value.replace('%', '').replace(',', '.');
  return (parseFloat(cleaned) || 0) / 100;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
