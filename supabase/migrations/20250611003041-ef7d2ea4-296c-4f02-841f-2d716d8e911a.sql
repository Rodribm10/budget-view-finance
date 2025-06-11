
-- Adicionar campos à tabela de cartões de crédito
ALTER TABLE cartoes_credito 
ADD COLUMN IF NOT EXISTS limite_total DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dia_vencimento INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS melhor_dia_compra INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS bandeira TEXT,
ADD COLUMN IF NOT EXISTS banco TEXT;

-- Criar tabela para faturas dos cartões
CREATE TABLE IF NOT EXISTS faturas_cartao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartao_id UUID REFERENCES cartoes_credito(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  valor_total DECIMAL(10,2) DEFAULT 0,
  data_vencimento DATE,
  status_pagamento TEXT DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago', 'vencido')),
  data_pagamento DATE,
  login TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(cartao_id, mes, ano)
);

-- Atualizar tabela de despesas para incluir parcelas
ALTER TABLE despesas_cartao 
ADD COLUMN IF NOT EXISTS parcela_atual INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_parcelas INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS valor_original DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS despesa_pai_id UUID REFERENCES despesas_cartao(id),
ADD COLUMN IF NOT EXISTS status_conciliacao TEXT DEFAULT 'pendente' CHECK (status_conciliacao IN ('pendente', 'conciliado', 'divergente')),
ADD COLUMN IF NOT EXISTS mes_fatura INTEGER,
ADD COLUMN IF NOT EXISTS ano_fatura INTEGER,
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_faturas_cartao_mes_ano ON faturas_cartao(cartao_id, mes, ano);
CREATE INDEX IF NOT EXISTS idx_despesas_cartao_fatura ON despesas_cartao(cartao_id, mes_fatura, ano_fatura);
CREATE INDEX IF NOT EXISTS idx_despesas_cartao_pai ON despesas_cartao(despesa_pai_id);
