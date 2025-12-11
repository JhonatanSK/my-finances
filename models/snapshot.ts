import { MonthlyProjection } from './projections';

export interface HighlightedMonthValue {
  label: string; // ex.: "Setembro"
  date: string; // ISO
  amount: number;
}

export interface Snapshot {
  id: string;
  reportId: string;

  createdAt: string;

  // Parâmetros usados nessa visão
  initialAmountAtSnapshot: number;
  annualRateAtSnapshot: number;
  goalAmountAtSnapshot?: number;
  simulationYearsAtSnapshot: number;

  // Resultado da meta naquela visão
  goalHitMonthIndex?: number | null;
  goalHitDate?: string | null;

  finalAmountAtEnd: number;

  highlightedMonthValues?: HighlightedMonthValue[];

  notes?: string;

  // opcional: projeção completa
  projections?: MonthlyProjection[];
}
