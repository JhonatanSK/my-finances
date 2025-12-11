export interface InflowItem {
  id: string;
  name: string;
  amount: number; // valor mensal
}

export interface OutflowItem {
  id: string;
  name: string;
  amount: number; // valor mensal
}

export interface HighlightMonth {
  id: string;
  label: string; // ex.: "Setembro de cada ano", "Mês 9"
  monthIndex: number; // 0 = primeiro mês da simulação
}

export interface Report {
  id: string;
  name: string;
  description?: string;

  startDate: string; // ISO 'YYYY-MM-DD'
  initialAmount: number;

  inflowItems: InflowItem[];
  outflowItems: OutflowItem[];

  annualRate: number; // ex.: 0.085 = 8,5% ao ano
  goalAmount?: number; // meta (opcional)

  simulationYears: number; // ex.: 10 anos

  highlightMonths: HighlightMonth[];

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
