
export interface Transaction {
  id: string;
  user: string;
  created_at: string;
  valor: number;
  quando: string;
  detalhes: string;
  estabelecimento: string;
  tipo: string;
  categoria: string;
}

export interface TransactionSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface CategorySummary {
  categoria: string;
  valor: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

export interface TransactionFilters {
  search: string;
  startDate: Date | null;
  endDate: Date | null;
  tipo: string;
  categoria: string;
}
