
-- Corrige a policy de insert na tabela transacoes para usar WITH CHECK
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserts apenas para assinantes ou trial" ON public.transacoes;

CREATE POLICY "Permitir inserts apenas para assinantes ou trial"
ON public.transacoes
FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.usuarios u WHERE u.email = login)
    AND (
        (SELECT NOW() < u.created_at + INTERVAL '30 days' FROM public.usuarios u WHERE u.email = login)
        OR EXISTS (
            SELECT 1 FROM public.pagamentos_mercadopago p
            WHERE p.payer_email = login
              AND p.status = 'approved'
        )
    )
);

-- Permissão para os usuários autenticados continuarem acessando normalmente as outras operações
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transacoes TO authenticated;
