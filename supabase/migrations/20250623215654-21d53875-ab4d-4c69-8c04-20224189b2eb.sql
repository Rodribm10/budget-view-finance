
-- Adicionar colunas para email e whatsapp do usuário na tabela contas_recorrentes
ALTER TABLE public.contas_recorrentes 
ADD COLUMN email_usuario TEXT,
ADD COLUMN whatsapp_usuario TEXT;

-- Atualizar os registros existentes com os dados dos usuários
UPDATE public.contas_recorrentes cr
SET 
  email_usuario = u.email,
  whatsapp_usuario = u.whatsapp
FROM public.usuarios u
WHERE cr.user_id::text = u.id::text;

-- Adicionar políticas RLS para as novas colunas (as políticas existentes já cobrem essas colunas)
-- As políticas já existentes continuarão funcionando pois filtram por user_id
