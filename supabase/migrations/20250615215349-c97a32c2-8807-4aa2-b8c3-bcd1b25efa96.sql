
-- Adiciona campo para liberar acesso vitalício/manual pelo admin
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS liberado_permanente boolean DEFAULT false;

-- Atualiza a policy de insert em transacoes para aceitar "liberado_permanente"
DROP POLICY IF EXISTS "Permitir inserts apenas com trial ativo ou pagamento aprovado do mês" ON public.transacoes;

CREATE POLICY "Permitir inserts apenas com trial/pagamento ou liberar permanente"
ON public.transacoes
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.email = login)
  AND (
    -- Caso o admin tenha liberado o usuário permanentemente
    (SELECT u.liberado_permanente FROM public.usuarios u WHERE u.email = login) = true
    -- Ou está dentro do período trial (primeiros 30 dias)
    OR (SELECT NOW() < u.created_at + INTERVAL '30 days' FROM public.usuarios u WHERE u.email = login)
    -- Ou possui pagamento aprovado para o mês vigente
    OR EXISTS (
      SELECT 1 FROM public.pagamentos_mercadopago p
      WHERE p.payer_email = login
        AND p.status = 'approved'
        AND date_trunc('month', p.created_at) = date_trunc('month', NOW())
    )
  )
);

-- Mantém permissões normais nas outras operações
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transacoes TO authenticated;
