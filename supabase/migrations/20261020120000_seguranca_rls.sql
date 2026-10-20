-- Fase 0 de segurança (20/10/2026). Estas tabelas estavam sem RLS e com leitura/escrita
-- para anônimo; a chave anon vai no site, então qualquer pessoa lia e alterava.
-- Agora cada usuário só enxerga as próprias linhas (pelo e-mail do login). As edge
-- functions usam a service role e não são afetadas. O Finance Hub não lê nenhuma delas.

do $$
declare
  t text;
begin
  -- tabelas com a coluna login (e-mail)
  foreach t in array array['cartoes_credito','despesas_cartao','faturas_cartao','grupos_whatsapp','status_pagamento_mensal','conversas_zap'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "dono pelo email" on public.%I', t);
    execute format($p$create policy "dono pelo email" on public.%I for all to authenticated
      using (lower(login) = lower(auth.jwt() ->> 'email'))
      with check (lower(login) = lower(auth.jwt() ->> 'email'))$p$, t);
  end loop;
end $$;

-- metas guarda o e-mail em user_id
alter table public.metas enable row level security;
drop policy if exists "dono pelo email" on public.metas;
create policy "dono pelo email" on public.metas for all to authenticated
  using (lower(user_id::text) = lower(auth.jwt() ->> 'email'))
  with check (lower(user_id::text) = lower(auth.jwt() ->> 'email'));

-- usuarios: o app procura o perfil pelo e-mail; as políticas antigas (auth.uid() = id) nunca valeram.
alter table public.usuarios enable row level security;
drop policy if exists "Usuários podem atualizar apenas seus próprios dados" on public.usuarios;
drop policy if exists "Usuários podem ver apenas seus próprios dados" on public.usuarios;
drop policy if exists "dono pelo email" on public.usuarios;
create policy "dono pelo email" on public.usuarios for all to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

-- Cada lançamento era postado num webhook do n8n que não existe mais.
drop trigger if exists trigger_new_transaction_webhook on public.transacoes;
drop function if exists public.notify_new_transaction();
