-- Contas a pagar (fase 2). Uma linha por conta e mês quando a conta foi paga.
-- Substitui status_pagamento_mensal, que o n8n antigo enchia com associações erradas e sem FK
-- (fica no banco só como histórico).
create table if not exists public.contas_pagamentos (
  id bigint generated always as identity primary key,
  conta_id uuid not null references public.contas_recorrentes(id) on delete cascade,
  login text not null,
  ano int not null,
  mes int not null check (mes between 1 and 12),
  pago_em date not null,
  valor numeric,
  transacao_id bigint references public.transacoes(id) on delete set null,
  origem text not null check (origem in ('auto', 'grupo', 'app')),
  created_at timestamptz not null default now(),
  unique (conta_id, ano, mes)
);
-- Um lançamento do banco só pode pagar uma conta.
create unique index if not exists contas_pagamentos_transacao_uidx on public.contas_pagamentos (transacao_id) where transacao_id is not null;

alter table public.contas_pagamentos enable row level security;
drop policy if exists "dono pelo email" on public.contas_pagamentos;
create policy "dono pelo email" on public.contas_pagamentos for all to authenticated
  using (lower(login) = lower(auth.jwt() ->> 'email'))
  with check (lower(login) = lower(auth.jwt() ->> 'email'));

-- Vencimento de uma conta num mês, sem estourar fevereiro (dia 30 → 28/29).
create or replace function public.vencimento_conta(dia int, ano int, mes int) returns date
language sql immutable as $$
  select make_date(ano, mes, least(dia, extract(day from (make_date(ano, mes, 1) + interval '1 month - 1 day'))::int))
$$;

-- Palavras como a conta aparece no extrato (ex.: "adventista", "lima dos campos"). Usadas na baixa automática.
alter table public.contas_recorrentes add column if not exists apelido_extrato text;

-- Agendamentos (reaproveitam o header de auth do job do Finance Hub):
-- 9h BRT: baixa automática + aviso no grupo; 20h10 BRT: só baixa, depois do sync do banco.
select cron.schedule('financas-pessoais-contas-9h', '0 12 * * *',
  (select replace(command, 'cron-sync-banco-mcp', 'pessoal-contas') from cron.job where jobname = 'banco-mcp-sync-daily'));
select cron.schedule('financas-pessoais-contas-baixa-20h10', '10 23 * * *',
  (select replace(replace(command, 'cron-sync-banco-mcp', 'pessoal-contas'), 'body:=''{}''', 'body:=''{"so_baixa":true}''') from cron.job where jobname = 'banco-mcp-sync-daily'));
