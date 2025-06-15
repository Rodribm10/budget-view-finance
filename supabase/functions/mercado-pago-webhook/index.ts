
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase env vars missing");
    return new Response(JSON.stringify({ error: "Config error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    console.error("Falha ao ler o JSON bruto do webhook", err);
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Prepare fields for insertion
  const event_type = body.type || body.event_type || null;
  const event_id = body["id"] || body["event_id"] || null;
  let payer_email = null;
  let user_id = null;
  let status_val = null;

  // Tenta extrair campos-padrão do webhook do Mercado Pago
  if (body.data && typeof body.data === "object") {
    if (body.data.user_id || body.data.userId) {
      user_id = body.data.user_id || body.data.userId;
    }
    if (body.data.payer && body.data.payer.email) {
      payer_email = body.data.payer.email;
    }
    if (body.data.status) {
      status_val = body.data.status;
    }
  }

  // For robustness, tenta extrair de níveis superiores também
  if (!payer_email && body.payer_email) payer_email = body.payer_email;
  if (!user_id && body.user_id) user_id = body.user_id;
  if (!status_val && body.status) status_val = body.status;

  // Log para debug
  console.log("Recebido Webhook MercadoPago:", { event_type, event_id, payer_email, user_id, status_val });

  // Salvar no banco de dados
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase.from("pagamentos_mercadopago").insert([
    {
      raw_body: body,
      event_type: event_type || "desconhecido",
      event_id,
      payer_email,
      user_id,
      status: status_val,
    }
  ]);

  if (error) {
    console.error("Erro ao salvar evento MercadoPago:", error);
    // Mesmo em erro, responde 200 para evitar retries do MercadoPago
    return new Response(JSON.stringify({ error: "Falha ao registrar evento" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  // Sempre responde status 200 OK (ou 204)
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
});
