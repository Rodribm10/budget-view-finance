
-- Criar função que será chamada pelo trigger
CREATE OR REPLACE FUNCTION notify_new_transaction()
RETURNS trigger AS $$
BEGIN
  -- Fazer a requisição HTTP para o webhook
  PERFORM net.http_post(
    url := 'https://webhookn8n.innova1001.com.br/webhook/baixacontas',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'id', NEW.id,
      'created_at', NEW.created_at,
      'user', NEW.user,
      'quando', NEW.quando,
      'estabelecimento', NEW.estabelecimento,
      'valor', NEW.valor,
      'detalhes', NEW.detalhes,
      'tipo', NEW.tipo,
      'categoria', NEW.categoria,
      'login', NEW.login,
      'grupo_id', NEW.grupo_id
    )
  );
  
  RETURN NEW;
END;
$$ language plpgsql;

-- Criar trigger que chama a função sempre que uma nova transação for inserida
CREATE TRIGGER trigger_new_transaction_webhook
  AFTER INSERT ON public.transacoes
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_transaction();
