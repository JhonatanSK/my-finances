import { Report } from '@/models/report';
import { MonthlyProjection } from '@/models/projections';
import { findInvestmentCoverageDate } from './projections';

export interface HealthSummary {
  monthlyInflow: number;
  monthlyOutflow: number;
  monthlyLeftover: number;

  percentOutflow: number | null; // ex.: 0.2184
  percentKept: number | null; // ex.: 0.7816

  monthlyLeftoverWithInvest: number;
  percentOutflowWithInvest: number | null;
  percentKeptWithInvest: number | null;

  // Retorno mensal do investimento e cobertura de custos
  monthlyInvestmentYield: number; // Retorno mensal do patrimônio investido
  investmentCoveragePercent: number | null; // Porcentagem de cobertura dos custos (yield / outflow)
  investmentCoversOutflow: boolean; // Se o retorno cobre os custos mensais
  investmentCoverageDate: string | null; // Data quando o retorno vai cobrir todos os custos
  investmentCoverageIndex: number | null; // Índice do mês quando o retorno vai cobrir todos os custos
}

/**
 * Calculate monthly financial health summary for a report
 */
export function calculateHealthSummary(
  report: Report,
  projections?: MonthlyProjection[]
): HealthSummary {
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

  // Cálculo da cobertura de custos pelo retorno do investimento
  const monthlyInvestmentYield = yieldOnInitialAmount;
  let investmentCoveragePercent: number | null = null;
  if (monthlyOutflow > 0) {
    investmentCoveragePercent = monthlyInvestmentYield / monthlyOutflow;
  }
  const investmentCoversOutflow = monthlyInvestmentYield >= monthlyOutflow;

  // Calcular quando o retorno vai cobrir todos os custos (se houver projeções)
  let investmentCoverageDate: string | null = null;
  let investmentCoverageIndex: number | null = null;
  if (projections && projections.length > 0 && !investmentCoversOutflow) {
    const coverage = findInvestmentCoverageDate(projections, monthlyOutflow);
    investmentCoverageDate = coverage.coverageDate;
    investmentCoverageIndex = coverage.coverageIndex;
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
    monthlyInvestmentYield,
    investmentCoveragePercent,
    investmentCoversOutflow,
    investmentCoverageDate,
    investmentCoverageIndex,
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
