-- Automação de finanças pessoais do Rodrigo:
--  * banco (Inter Hotel Rio's via Banco MCP) lançado todo dia às 20h, marcado "a revisar";
--  * gastos em dinheiro mandados num grupo de WhatsApp (GOWA), lidos a cada 15 min.

alter table public.transacoes add column if not exists revisar boolean not null default false;

-- hash_unico = 'pluggy:<id>' (banco) ou 'wa:<message_id>' (WhatsApp): impede lançar duas vezes.
create unique index if not exists transacoes_hash_unico_uidx
  on public.transacoes (hash_unico) where hash_unico is not null;

-- Uma linha por dono. Só a service role lê/escreve (RLS ligado, sem policy).
create table if not exists public.automacao_financas (
  login text primary key,
  conta_banco_id uuid references public.contas_bancarias(id),
  pluggy_account_id text not null,
  conta_dinheiro_id uuid references public.contas_bancarias(id),
  grupo_nome text not null,
  grupo_jid text,
  gowa_device text not null,
  lido_ate timestamptz not null default now(),
  resumo jsonb not null default '{}'::jsonb, -- {"1": <transacoes.id>, ...} do último resumo das 20h
  atualizado_em timestamptz not null default now()
);
alter table public.automacao_financas enable row level security;

-- Conta "Dinheiro" (gastos em espécie que chegam pelo WhatsApp).
insert into public.contas_bancarias (user_id, login, nome, banco, tipo)
select user_id, login, 'Dinheiro', 'Espécie', 'dinheiro'
from public.contas_bancarias
where id = '4cba065f-7419-4114-a445-a65f5e01ffdb'
  and not exists (select 1 from public.contas_bancarias where login = 'rodrigobm10@gmail.com' and tipo = 'dinheiro');

insert into public.automacao_financas (login, conta_banco_id, pluggy_account_id, conta_dinheiro_id, grupo_nome, gowa_device)
select 'rodrigobm10@gmail.com',
       '4cba065f-7419-4114-a445-a65f5e01ffdb',          -- Banco Inter PJ Hotel Rio's (CNPJ 01.645.930/0001-65)
       '13663b59-3e0e-437a-a616-e55cef7a82f3',          -- conta 20762030-0 no Banco MCP
       (select id from public.contas_bancarias where login = 'rodrigobm10@gmail.com' and tipo = 'dinheiro' limit 1),
       'Finance - Dinheiro',
       'Rodrigo-leo-auditoria'
on conflict (login) do nothing;

-- Agendamentos: reaproveita o header de auth do job do Finance Hub em vez de colar a chave aqui.
select cron.schedule('financas-pessoais-banco-20h', '0 23 * * *',
  (select replace(command, 'cron-sync-banco-mcp', 'pessoal-sync-banco') from cron.job where jobname = 'banco-mcp-sync-daily'));
select cron.schedule('financas-pessoais-grupo-15min', '*/15 * * * *',
  (select replace(command, 'cron-sync-banco-mcp', 'pessoal-grupo-gastos') from cron.job where jobname = 'banco-mcp-sync-daily'));
