-- Criar trigger para automaticamente criar usuário na tabela usuarios quando se cadastra manualmente
CREATE OR REPLACE FUNCTION public.handle_manual_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o usuário tem dados completos no raw_user_meta_data (cadastro manual)
  IF NEW.raw_user_meta_data IS NOT NULL AND
     NEW.raw_user_meta_data->>'nome' IS NOT NULL AND
     NEW.raw_user_meta_data->>'whatsapp' IS NOT NULL AND
     NEW.email IS NOT NULL THEN
    
    -- Inserir na tabela usuarios
    INSERT INTO public.usuarios (id, email, nome, empresa, whatsapp)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'nome',
      COALESCE(NEW.raw_user_meta_data->>'empresa', ''),
      NEW.raw_user_meta_data->>'whatsapp'
    )
    ON CONFLICT (id) DO UPDATE SET
      nome = EXCLUDED.nome,
      empresa = EXCLUDED.empresa,
      whatsapp = EXCLUDED.whatsapp,
      email = EXCLUDED.email;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger que será executado quando um usuário é inserido na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_manual ON auth.users;
CREATE TRIGGER on_auth_user_created_manual
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_manual_user_signup();