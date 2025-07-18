
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
    console.log('🚀 Iniciando processamento da assinatura MercadoPago');
    console.log('📋 Método da requisição:', req.method);
    console.log('📋 Headers da requisição:', Object.fromEntries(req.headers.entries()));
    
    // Verificar se há dados no corpo da requisição
    let requestBody;
    try {
      const text = await req.text();
      console.log('📦 Texto bruto recebido:', text);
      
      if (!text || text.trim() === '') {
        console.error('❌ Corpo da requisição está vazio');
        return new Response(JSON.stringify({ error: 'Dados da requisição não fornecidos.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      requestBody = JSON.parse(text);
      console.log('📦 Corpo da requisição parseado:', requestBody);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return new Response(JSON.stringify({ error: 'Formato de dados inválido.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Extrair email e userId do corpo da requisição
    const { email, userId } = requestBody;
    
    console.log('📧 Dados extraídos:', { email, userId });
    
    if (!email || !userId) {
      console.error('❌ Email ou ID do usuário não fornecido');
      console.error('❌ Dados recebidos:', { email, userId });
      return new Response(JSON.stringify({ error: 'E-mail ou ID do usuário não fornecido.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('📧 Dados validados com sucesso:', { email, userId });

    // Cria um cliente Supabase com a service_role_key para verificar o usuário
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Verifica se o usuário existe no banco de dados
    console.log('🔍 Verificando usuário no banco de dados...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return new Response(JSON.stringify({ error: 'Usuário não encontrado no sistema.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    if (!userData) {
      console.error('❌ Usuário não encontrado no banco');
      return new Response(JSON.stringify({ error: 'Usuário não encontrado no sistema.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    console.log('✅ Usuário verificado com sucesso:', userData);

    const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
      console.error('❌ Token do MercadoPago não configurado');
      return new Response(JSON.stringify({ error: 'Configuração do servidor incompleta.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Pegar a URL de origem para o back_url
    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://lovableproject.com';
    console.log('🌐 Origin detectado:', origin);

    const body = {
      reason: "Plano Mensal Finance Home",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 14.99,
        currency_id: "BRL"
      },
      back_url: `${origin}/configuracoes`,
      payer_email: email
    };

    console.log('📦 Enviando requisição para MercadoPago:', JSON.stringify(body));

    const mpResponse = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const mpData = await mpResponse.json();
    console.log('📨 Resposta do MercadoPago:', { status: mpResponse.status, data: mpData });

    if (!mpResponse.ok) {
      console.error('❌ Erro da API do Mercado Pago:', mpData);
      
      // Tratar erro específico de países diferentes
      if (mpData.message === "Cannot operate between different countries") {
        console.log('🌍 Erro de país detectado');
        return new Response(JSON.stringify({ 
          error: 'Serviço temporariamente indisponível para sua região. Entre em contato conosco para mais informações.' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        });
      }
      
      // Outros erros do MercadoPago
      const errorMessage = mpData.message || `Erro no MercadoPago (${mpResponse.status})`;
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 422,
      });
    }
    
    if (!mpData.init_point) {
      console.error('❌ URL de checkout não encontrada na resposta');
      return new Response(JSON.stringify({ 
        error: "Não foi possível gerar o link de pagamento. Tente novamente." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('✅ Assinatura criada com sucesso:', mpData.init_point);
    return new Response(JSON.stringify({ init_point: mpData.init_point }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('💥 Erro geral na função:', error);
    
    // Erro de parsing do JSON
    if (error instanceof SyntaxError) {
      return new Response(JSON.stringify({ error: 'Dados de entrada inválidos.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Erro de conexão
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new Response(JSON.stringify({ error: 'Erro de comunicação com o MercadoPago. Tente novamente.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503,
      });
    }
    
    // Erro genérico
    return new Response(JSON.stringify({ error: 'Erro interno do servidor. Tente novamente mais tarde.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
