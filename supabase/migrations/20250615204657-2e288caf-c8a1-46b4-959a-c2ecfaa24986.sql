
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  nome_val TEXT;
  empresa_val TEXT;
  whatsapp_val TEXT;
BEGIN
  -- Extract values from metadata, providing default placeholders if they are missing
  nome_val := COALESCE(new.raw_user_meta_data->>'nome', 'Nome não informado');
  empresa_val := new.raw_user_meta_data->>'empresa'; -- This field can be null
  whatsapp_val := COALESCE(new.raw_user_meta_data->>'whatsapp', '00000000000');

  -- This logic attempts to update an existing user record found by email.
  -- This is key to reconnecting your old data to your new login.
  UPDATE public.usuarios
  SET 
    id = new.id,
    nome = nome_val,
    empresa = empresa_val,
    whatsapp = whatsapp_val
  WHERE email = new.email;
  
  -- If no record was updated (because the email wasn't found),
  -- it means this is a completely new user, so we insert a new record.
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
