
// This is a temporary solution to update the database function
// You can run this SQL in the Supabase SQL Editor:
// 
// CREATE OR REPLACE FUNCTION public.registrar_usuario(
//   nome text,
//   empresa text,
//   email text,
//   senha text,
//   whatsapp text
// ) RETURNS uuid
// LANGUAGE plpgsql
// SECURITY DEFINER
// AS $function$
// DECLARE
//   novo_usuario_id UUID;
// BEGIN
//   -- Inserir novo usuário com senha hash
//   INSERT INTO public.usuarios (nome, empresa, email, senha, whatsapp)
//   VALUES (nome, empresa, email, crypt(senha, gen_salt('bf')), whatsapp)
//   RETURNING id INTO novo_usuario_id;
//   
//   -- Retorna o ID do usuário criado sem criar tabela individual
//   RETURN novo_usuario_id;
// END;
// $function$
