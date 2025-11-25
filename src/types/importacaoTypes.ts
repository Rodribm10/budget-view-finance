export interface ContaBancaria {
  id: string;
  user_id: string;
  login?: string;
  nome: string;
  banco?: string;
  tipo: string;
  saldo_inicial: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TransacaoImportada {
  data: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria?: string;
  hash_unico: string;
  isDuplicada?: boolean;
}

export interface LogImportacao {
  id?: string;
  user_id: string;
  login?: string;
  conta_bancaria_id?: string;
  nome_arquivo: string;
  tipo_arquivo: string;
  status: 'processando' | 'sucesso' | 'erro' | 'parcial';
  total_registros: number;
  importados: number;
  duplicados: number;
  erros: number;
  valor_total: number;
  detalhes_erro?: string;
  created_at?: string;
}

export interface ResultadoImportacao {
  sucesso: boolean;
  transacoes: TransacaoImportada[];
  log: LogImportacao;
  mensagem: string;
}

export type TipoArquivo = 'ofx' | 'csv' | 'xlsx' | 'xls';
