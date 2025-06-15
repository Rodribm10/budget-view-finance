
-- Criação da tabela para registrar notificações de Webhook do Mercado Pago
create table public.pagamentos_mercadopago (
  id uuid not null default gen_random_uuid() primary key,
  raw_body jsonb not null,
  event_type text not null,
  event_id text,
  payer_email text,
  user_id uuid,
  status text,
  created_at timestamp with time zone not null default now()
);

-- Habilita Row Level Security
alter table public.pagamentos_mercadopago enable row level security;

-- Política de insert para funções autenticadas
create policy "Allow insert for authenticated functions" on public.pagamentos_mercadopago
  for insert
  to authenticated
  with check (true);

-- Política de select para usuários autenticados
create policy "Allow select for authenticated users" on public.pagamentos_mercadopago
  for select
  to authenticated
  using (true);
