import { Report } from '@/models/report';

export interface HealthSummary {
  monthlyInflow: number;
  monthlyOutflow: number;
  monthlyLeftover: number;

  percentOutflow: number | null; // ex.: 0.2184
  percentKept: number | null; // ex.: 0.7816

  monthlyLeftoverWithInvest: number;
  percentOutflowWithInvest: number | null;
  percentKeptWithInvest: number | null;
}

/**
 * Calculate monthly financial health summary for a report
 */
export function calculateHealthSummary(report: Report): HealthSummary {
  const monthlyInflow = report.inflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyOutflow = report.outflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyLeftover = monthlyInflow - monthlyOutflow;

  let percentOutflow: number | null = null;
  let percentKept: number | null = null;

  if (monthlyInflow > 0) {
    percentOutflow = monthlyOutflow / monthlyInflow;
    percentKept = monthlyLeftover / monthlyInflow;
  }

  const monthlyRate = report.annualRate / 12;
  
  // Rendimento sobre o patrimônio já investido (valor inicial)
  const yieldOnInitialAmount = report.initialAmount * monthlyRate;
  
  // Rendimento sobre o que sobra mensalmente (assumindo que é investido)
  const yieldOnLeftover = monthlyLeftover * monthlyRate;
  
  // Rendimento total = rendimento do patrimônio + rendimento do que sobra
  const totalMonthlyYield = yieldOnInitialAmount + yieldOnLeftover;
  
  // O que sobra + rendimento total (do patrimônio + do que sobra)
  const monthlyLeftoverWithInvest = monthlyLeftover + totalMonthlyYield;

  let percentOutflowWithInvest: number | null = null;
  let percentKeptWithInvest: number | null = null;

  if (monthlyInflow > 0) {
    percentKeptWithInvest = monthlyLeftoverWithInvest / monthlyInflow;
    percentOutflowWithInvest = 1 - percentKeptWithInvest;
  }

  return {
    monthlyInflow,
    monthlyOutflow,
    monthlyLeftover,
    percentOutflow,
    percentKept,
    monthlyLeftoverWithInvest,
    percentOutflowWithInvest,
    percentKeptWithInvest,
  };
}

/**
 * Get health status based on percentKept
 */
export function getHealthStatus(percentKept: number | null): 'excellent' | 'good' | 'warning' | 'critical' {
  if (percentKept === null) return 'critical';
  if (percentKept >= 0.5) return 'excellent';
  if (percentKept >= 0.3) return 'good';
  if (percentKept >= 0.1) return 'warning';
  return 'critical';
}
