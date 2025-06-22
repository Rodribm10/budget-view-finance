
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Necessário para invocações a partir do navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, userId } = await req.json();
    
    if (!email || !userId) {
      return new Response(JSON.stringify({ error: 'E-mail ou ID do usuário não fornecido.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Cria um cliente Supabase com a service_role_key para verificar o usuário
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Verifica se o usuário existe no banco de dados
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('id', userId)
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('Falha na verificação do usuário:', userError);
      return new Response(JSON.stringify({ error: 'Usuário não autorizado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Chave de acesso do Mercado Pago não configurada no servidor.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const body = {
      reason: "Plano Mensal Finance Home",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 14.99,
        currency_id: "BRL"
      },
      back_url: req.headers.get("origin") || "http://localhost:5173/configuracoes",
      payer_email: email
    };

    console.log('Enviando requisição para MercadoPago:', JSON.stringify(body));

    const mpResponse = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const mpData = await mpResponse.json();
    console.log('Resposta do MercadoPago:', mpData);

    if (!mpResponse.ok) {
      console.error('Erro da API do Mercado Pago:', mpData);
      
      // Tratar erro específico de países diferentes
      if (mpData.message === "Cannot operate between different countries") {
        return new Response(JSON.stringify({ 
          error: 'Serviço temporariamente indisponível para sua região. Tente novamente mais tarde.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        });
      }
      
      throw new Error(mpData.message || "Erro ao criar a assinatura no Mercado Pago.");
    }
    
    if (!mpData.init_point) {
      throw new Error("URL de checkout não foi encontrada na resposta do Mercado Pago.");
    }

    return new Response(JSON.stringify({ init_point: mpData.init_point }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erro geral:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
