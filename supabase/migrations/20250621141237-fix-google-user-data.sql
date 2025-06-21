
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  nome_val TEXT;
  empresa_val TEXT;
  whatsapp_val TEXT;
BEGIN
  -- Extrair nome do Google (full_name ou name dos metadados)
  nome_val := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'nome',
    'Nome não informado'
  );
  
  -- Extrair empresa (se fornecida)
  empresa_val := new.raw_user_meta_data->>'empresa';
  
  -- WhatsApp padrão (será preenchido no complete-profile)
  whatsapp_val := COALESCE(new.raw_user_meta_data->>'whatsapp', '00000000000');

  -- Log dos dados recebidos para debug
  RAISE LOG 'Processando novo usuário: email=%, nome=%, metadados=%', 
    new.email, nome_val, new.raw_user_meta_data;

  -- Tentar atualizar usuário existente primeiro
  UPDATE public.usuarios
  SET 
    id = new.id,
    nome = nome_val,
    empresa = empresa_val,
    whatsapp = whatsapp_val
  WHERE email = new.email;
  
  -- Se não encontrou, inserir novo usuário
  IF NOT FOUND THEN
    INSERT INTO public.usuarios (id, email, nome, empresa, whatsapp)
    VALUES (
      new.id, 
      new.email,
      nome_val,
      empresa_val,
      whatsapp_val
    );
  END IF;

  RETURN new;
END;
$$;
