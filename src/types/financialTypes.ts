
export interface Transaction {
  id: string;
  user: string;
  login?: string; // E-mail do usuário como identificador principal
  created_at: string;
  valor: number;
  quando: string;
  detalhes: string;
  estabelecimento: string;
  tipo: string;
  categoria: string;
  grupo_id?: string | null;
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

export interface Meta {
  id: string;
  user_id: string;
  mes: number;
  ano: number;
  valor_meta: number;
  created_at?: string;
}

export interface MetaFinanceira {
  id: string;
  user_id: string;
  mes: number;
  ano: number;
  valor_meta: number;
  created_at?: string;
}

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  totalCartoes?: number;
  saldo?: number;
}

export interface ResultadoMeta {
  mes: number;
  ano: number;
  valor_meta: number;
  economia_real: number;
  percentual_atingido: number;
  meta_batida: boolean;
}

export interface WhatsAppGroup {
  id: number;
  user_id: string | null; // Mantido apenas por compatibilidade
  remote_jid: string | null;
  nome_grupo: string | null;
  created_at: string;
  status: string;
  login: string; // E-mail do usuário como identificador principal
  workflow_id?: string | null; // ID do workflow no n8n
}
