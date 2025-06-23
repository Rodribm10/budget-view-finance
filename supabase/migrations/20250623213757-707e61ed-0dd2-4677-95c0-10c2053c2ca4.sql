
-- Criar tabela para armazenar as contas recorrentes
CREATE TABLE public.contas_recorrentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_conta TEXT NOT NULL,
  descricao TEXT,
  valor DECIMAL(10,2),
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  hora_aviso TIME NOT NULL DEFAULT '09:00:00',
  dias_antecedencia INTEGER NOT NULL DEFAULT 1 CHECK (dias_antecedencia >= 1 AND dias_antecedencia <= 30),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para log dos avisos enviados
CREATE TABLE public.avisos_enviados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conta_id UUID NOT NULL REFERENCES public.contas_recorrentes(id) ON DELETE CASCADE,
  data_aviso DATE NOT NULL,
  hora_aviso TIME NOT NULL,
  dados_webhook JSONB,
  status_envio TEXT NOT NULL DEFAULT 'pendente',
  tentativas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security) para segurança
ALTER TABLE public.contas_recorrentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos_enviados ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para contas_recorrentes
CREATE POLICY "Users can view their own contas" 
  ON public.contas_recorrentes 
  FOR SELECT 
  USING (user_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', ''));

CREATE POLICY "Users can create their own contas" 
  ON public.contas_recorrentes 
  FOR INSERT 
  WITH CHECK (user_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', ''));

CREATE POLICY "Users can update their own contas" 
  ON public.contas_recorrentes 
  FOR UPDATE 
  USING (user_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', ''));

CREATE POLICY "Users can delete their own contas" 
  ON public.contas_recorrentes 
  FOR DELETE 
  USING (user_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', ''));

-- Políticas RLS para avisos_enviados
CREATE POLICY "Users can view avisos of their contas" 
  ON public.avisos_enviados 
  FOR SELECT 
  USING (conta_id IN (
    SELECT id FROM public.contas_recorrentes 
    WHERE user_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', '')
  ));

-- Índices para melhor performance
CREATE INDEX idx_contas_recorrentes_user_id ON public.contas_recorrentes(user_id);
CREATE INDEX idx_contas_recorrentes_ativo ON public.contas_recorrentes(ativo);
CREATE INDEX idx_avisos_enviados_conta_id ON public.avisos_enviados(conta_id);
CREATE INDEX idx_avisos_enviados_data_aviso ON public.avisos_enviados(data_aviso);
