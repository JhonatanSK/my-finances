import { Report } from '@/models/report';
import { MonthlyProjection } from '@/models/projections';
import { addMonths } from '@/utils/date';

export interface GoalHitResult {
  goalHitIndex: number | null;
  goalHitDate: string | null;
}

/**
 * Generate monthly projections for a report
 */
export function generateProjections(report: Report): MonthlyProjection[] {
  const months = report.simulationYears * 12;
  const monthlyInflow = report.inflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyOutflow = report.outflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyRate = report.annualRate / 12;

  const projections: MonthlyProjection[] = [];
  let totalPrevious = report.initialAmount;

  // Set of highlighted month indices for quick lookup
  const highlightedIndices = new Set(report.highlightMonths.map((h) => h.monthIndex));

  for (let monthIndex = 0; monthIndex < months; monthIndex++) {
    const date = addMonths(report.startDate, monthIndex);

    const inflow = monthlyInflow;
    const outflow = monthlyOutflow;

    const totalBeforeYield = totalPrevious + inflow - outflow;
    const yieldAmount = totalPrevious * monthlyRate;
    const finalAmount = totalBeforeYield + yieldAmount;

    const markers: string[] = [];

    // Check if this is a highlighted month
    if (highlightedIndices.has(monthIndex)) {
      markers.push('HighlightedMonth');
    }

    // Check if goal is hit this month
    if (report.goalAmount && finalAmount >= report.goalAmount && totalPrevious < report.goalAmount) {
      markers.push('GoalHit');
    }

    const entry: MonthlyProjection = {
      monthIndex,
      date,
      inflow,
      outflow,
      totalPrevious,
      totalBeforeYield,
      yieldAmount,
      finalAmount,
      markers: markers.length > 0 ? markers : undefined,
    };

    projections.push(entry);
    totalPrevious = finalAmount;
  }

  return projections;
}

/**
 * Find when the goal is hit in the projections
 */
export function findGoalHit(
  projections: MonthlyProjection[],
  goalAmount?: number
): GoalHitResult {
  if (!goalAmount) {
    return { goalHitIndex: null, goalHitDate: null };
  }

  for (const p of projections) {
    if (p.finalAmount >= goalAmount) {
      return { goalHitIndex: p.monthIndex, goalHitDate: p.date };
    }
  }

  return { goalHitIndex: null, goalHitDate: null };
}

/**
 * Get the final amount at the end of simulation
 */
export function getFinalAmount(projections: MonthlyProjection[]): number {
  if (projections.length === 0) return 0;
  return projections[projections.length - 1].finalAmount;
}

/**
 * Get values at highlighted months
 */
export function getHighlightedMonthValues(
  projections: MonthlyProjection[],
  highlightMonths: Report['highlightMonths']
): Array<{ label: string; date: string; amount: number }> {
  return highlightMonths
    .map((highlight) => {
      const projection = projections.find((p) => p.monthIndex === highlight.monthIndex);
      if (!projection) return null;
      return {
        label: highlight.label,
        date: projection.date,
        amount: projection.finalAmount,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
}
