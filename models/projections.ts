export interface MonthlyProjection {
  monthIndex: number; // 0, 1, 2...
  date: string; // ISO date da competência

  inflow: number; // soma inflowItems
  outflow: number; // soma outflowItems

  totalPrevious: number; // patrimônio no fim do mês anterior
  totalBeforeYield: number; // totalPrevious + inflow - outflow
  yieldAmount: number; // lucro dos investimentos no mês
  finalAmount: number; // totalBeforeYield + yieldAmount

  markers?: string[]; // ex.: ['GoalHit', 'HighlightedMonth']
}
