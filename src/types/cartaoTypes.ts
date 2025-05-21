
export interface CartaoCredito {
  id: string;
  nome: string;
  bandeira?: string;
  banco?: string;
  cartao_codigo: string;
  user_id: string;
  login?: string;
  created_at: string;
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
}
