
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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Updating registrar_usuario function...')

    // Update the registrar_usuario function to include whatsapp parameter
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        CREATE OR REPLACE FUNCTION public.registrar_usuario(
          nome text,
          empresa text,
          email text,
          senha text,
          whatsapp text
        ) RETURNS uuid
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $function$
        DECLARE
          novo_usuario_id UUID;
        BEGIN
          -- Inserir novo usuário com senha hash
          INSERT INTO public.usuarios (nome, empresa, email, senha, whatsapp)
          VALUES (nome, empresa, email, crypt(senha, gen_salt('bf')), whatsapp)
          RETURNING id INTO novo_usuario_id;
          
          -- Retorna o ID do usuário criado
          RETURN novo_usuario_id;
        END;
        $function$
      `
    })

    if (error) {
      console.error('Error updating function:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Function updated successfully')
    
    return new Response(JSON.stringify({ 
      message: 'registrar_usuario function updated successfully',
      data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
