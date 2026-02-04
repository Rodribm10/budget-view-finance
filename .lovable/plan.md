
# Plano: Corrigir Avisos de Contas

## Visão Geral
O sistema de avisos de contas não está funcionando porque falta o **cron job** no Supabase que deveria chamar a edge function `avisos-financeiros` periodicamente. A função existe e está bem implementada, mas nunca é executada automaticamente.

---

## O que será feito

### 1. Configurar Edge Function
Adicionar a função `avisos-financeiros` no `supabase/config.toml` com `verify_jwt = false` para permitir chamadas do cron.

### 2. Corrigir a Edge Function
- Corrigir a comparação de horário (a função compara "09:00" com "09:00:00")
- Melhorar a lógica para executar a cada minuto e verificar se é hora de enviar avisos

### 3. Criar o Cron Job
Executar SQL no Supabase para criar um cron job que execute a cada minuto:
- O job chamará a edge function via HTTP POST
- Usará as extensões `pg_cron` e `pg_net`

---

## Detalhes Técnicos

### Arquivo: `supabase/config.toml`
Adicionar configuração:
```toml
[functions.avisos-financeiros]
verify_jwt = false
```

### Arquivo: `supabase/functions/avisos-financeiros/index.ts`
Corrigir a comparação de horário:
```typescript
// ANTES (não funciona):
horaAtualBrasilia === conta.hora_aviso  // "09:00" vs "09:00:00"

// DEPOIS (corrigido):
const horaAvisoNormalizada = conta.hora_aviso.substring(0, 5); // "09:00:00" -> "09:00"
horaAtualBrasilia === horaAvisoNormalizada
```

### SQL para criar o Cron Job
Este SQL precisa ser executado no Cloud View > Run SQL:
```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar cron job para executar a cada minuto
SELECT cron.schedule(
  'avisos-financeiros-minuto',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tnurlgbvfsxwqgwxamni.supabase.co/functions/v1/avisos-financeiros',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudXJsZ2J2ZnN4d3Fnd3hhbW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTQ1OTksImV4cCI6MjA2MDQ5MDU5OX0.9__EQiZDJ954SmeeJIDTQjOYDjiiRcppai1e8UpuOl4"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
```

---

## Sequência de Implementação

1. Atualizar `supabase/config.toml`
2. Corrigir `supabase/functions/avisos-financeiros/index.ts`
3. Executar SQL para criar o cron job (você precisará fazer isso manualmente no painel do Supabase)

---

## Resultado Esperado
- A edge function será chamada a cada minuto
- A função verificará se há contas com avisos a enviar no horário configurado
- Os avisos serão enviados via webhook para o n8n
- O histórico de avisos enviados será registrado na tabela `avisos_enviados`
