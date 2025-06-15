
-- Ativar Row Level Security na tabela transacoes
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

-- Excluir todas as policies antigas de insert para evitar conflito
DROP POLICY IF EXISTS "Permitir inserts apenas para assinantes ou trial" ON public.transacoes;

-- Policy permitindo insert apenas se o usuário está no trial de 30 dias
-- OU possui pagamento aprovado do mês vigente na pagamentos_mercadopago
CREATE POLICY "Permitir inserts apenas com trial ativo ou pagamento aprovado do mês"
ON public.transacoes
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.email = login)
  AND (
    -- Está dentro do período trial (primeiros 30 dias)
    (SELECT NOW() < u.created_at + INTERVAL '30 days' FROM public.usuarios u WHERE u.email = login)
    -- OU possui pagamento aprovado para o mês vigente
    OR EXISTS (
      SELECT 1 FROM public.pagamentos_mercadopago p
      WHERE p.payer_email = login
        AND p.status = 'approved'
        AND date_trunc('month', p.created_at) = date_trunc('month', NOW())
    )
  )
);

-- Permissão para os usuários autenticados continuarem acessando normalmente as outras operações
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transacoes TO authenticated;
