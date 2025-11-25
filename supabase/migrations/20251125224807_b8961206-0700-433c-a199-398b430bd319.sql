-- Criar tabela de contas bancárias
CREATE TABLE IF NOT EXISTS public.contas_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  login TEXT,
  nome TEXT NOT NULL,
  banco TEXT,
  tipo TEXT DEFAULT 'corrente',
  saldo_inicial NUMERIC DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de logs de importação
CREATE TABLE IF NOT EXISTS public.logs_importacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  login TEXT,
  conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL,
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processando',
  total_registros INTEGER DEFAULT 0,
  importados INTEGER DEFAULT 0,
  duplicados INTEGER DEFAULT 0,
  erros INTEGER DEFAULT 0,
  valor_total NUMERIC DEFAULT 0,
  detalhes_erro TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar coluna de origem e hash nas transações (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='transacoes' AND column_name='origem') THEN
    ALTER TABLE public.transacoes ADD COLUMN origem TEXT DEFAULT 'manual';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='transacoes' AND column_name='hash_unico') THEN
    ALTER TABLE public.transacoes ADD COLUMN hash_unico TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='transacoes' AND column_name='conta_bancaria_id') THEN
    ALTER TABLE public.transacoes ADD COLUMN conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_transacoes_hash_unico ON public.transacoes(hash_unico) WHERE hash_unico IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transacoes_conta_bancaria ON public.transacoes(conta_bancaria_id) WHERE conta_bancaria_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contas_bancarias_user ON public.contas_bancarias(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_importacao_user ON public.logs_importacao(user_id);

-- RLS policies para contas_bancarias
ALTER TABLE public.contas_bancarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contas" ON public.contas_bancarias
  FOR SELECT USING (user_id::text = COALESCE((current_setting('request.jwt.claims'::text, true)::json->>'sub')::text, ''));

CREATE POLICY "Users can create their own contas" ON public.contas_bancarias
  FOR INSERT WITH CHECK (user_id::text = COALESCE((current_setting('request.jwt.claims'::text, true)::json->>'sub')::text, ''));

CREATE POLICY "Users can update their own contas" ON public.contas_bancarias
  FOR UPDATE USING (user_id::text = COALESCE((current_setting('request.jwt.claims'::text, true)::json->>'sub')::text, ''));

CREATE POLICY "Users can delete their own contas" ON public.contas_bancarias
  FOR DELETE USING (user_id::text = COALESCE((current_setting('request.jwt.claims'::text, true)::json->>'sub')::text, ''));

-- RLS policies para logs_importacao
ALTER TABLE public.logs_importacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own logs" ON public.logs_importacao
  FOR SELECT USING (user_id::text = COALESCE((current_setting('request.jwt.claims'::text, true)::json->>'sub')::text, ''));

CREATE POLICY "Users can create their own logs" ON public.logs_importacao
  FOR INSERT WITH CHECK (user_id::text = COALESCE((current_setting('request.jwt.claims'::text, true)::json->>'sub')::text, ''));