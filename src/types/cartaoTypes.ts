
export interface CartaoCredito {
  id: string;
  nome: string;
  bandeira: string;
  banco: string;
  cartao_codigo: string;
  user_id: string;
  login?: string;
  created_at: string;
  limite_total?: number;
  dia_vencimento?: number;
  melhor_dia_compra?: number;
  total_despesas?: number;
}

export interface DespesaCartao {
  id: string;
  cartao_id: string;
  cartao_codigo: string;
  user_id?: string;
  login?: string;
  valor: number;
  data_despesa: string;
  descricao: string;
  created_at: string;
  parcela_atual?: number;
  total_parcelas?: number;
  valor_original?: number;
  despesa_pai_id?: string;
  status_conciliacao?: 'pendente' | 'conciliado' | 'divergente';
  mes_fatura?: number;
  ano_fatura?: number;
  observacoes?: string;
}

export interface FaturaCartao {
  id: string;
  cartao_id: string;
  mes: number;
  ano: number;
  valor_total: number;
  data_vencimento?: string;
  status_pagamento: 'pendente' | 'pago' | 'vencido';
  data_pagamento?: string;
  login?: string;
  created_at: string;
}
