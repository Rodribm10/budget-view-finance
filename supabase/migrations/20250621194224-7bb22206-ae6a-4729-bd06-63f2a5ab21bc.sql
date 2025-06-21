
-- Criar tabela para FAQs (Perguntas Frequentes)
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  imagem_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para feedback dos FAQs
CREATE TABLE public.faq_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para contatos/mensagens de suporte
CREATE TABLE public.contatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assunto TEXT NOT NULL,
  motivo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  anexo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar bucket para anexos de contato
INSERT INTO storage.buckets (id, name, public) 
VALUES ('anexos-contato', 'anexos-contato', true);

-- Política para permitir upload de anexos pelos usuários autenticados
CREATE POLICY "Usuarios podem fazer upload de anexos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'anexos-contato' AND auth.role() = 'authenticated');

-- Política para permitir visualização pública dos anexos
CREATE POLICY "Anexos são públicos para visualização" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'anexos-contato');

-- Habilitar RLS nas tabelas
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;

-- Políticas para FAQs (todos podem ver FAQs ativos)
CREATE POLICY "Qualquer um pode ver FAQs ativos" 
ON public.faqs FOR SELECT 
USING (ativo = true);

-- Políticas para feedback (usuários autenticados podem dar feedback)
CREATE POLICY "Usuarios autenticados podem dar feedback" 
ON public.faq_feedback FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios podem ver feedbacks" 
ON public.faq_feedback FOR SELECT 
USING (true);

-- Políticas para contatos (usuários podem criar e ver seus próprios contatos)
CREATE POLICY "Usuarios podem criar contatos" 
ON public.contatos FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuarios podem ver seus contatos" 
ON public.contatos FOR SELECT 
USING (user_id = auth.uid());
