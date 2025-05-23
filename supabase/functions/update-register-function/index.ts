
// This is an Edge Function that will update the registrar_usuario database function
// to include the WhatsApp parameter

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Execute the SQL to update the function
    const { data, error } = await supabaseClient.rpc('update_register_function', {
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
          
          -- Retorna o ID do usuário criado sem criar tabela individual
          RETURN novo_usuario_id;
        END;
        $function$
      `
    });
    
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
