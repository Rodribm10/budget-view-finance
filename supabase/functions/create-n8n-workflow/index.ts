
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const N8N_API_URL = 'https://n8n.innova1001.com.br/api/v1/workflows';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmM4MjQxOS0zZTk1LTRiYmMtODMwMy0xODAzZjk4YmQ4YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3NzM0NzYyLCJleHAiOjE3NTAzMDIwMDB9.Evr_o42xLJPq1c2p5SUWo00IY85WXp8s_nqSy64V-is';

serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Parse the request body
    const requestData = await req.json();
    const { email, grupoId } = requestData;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { status: 400, headers }
      );
    }

    if (!grupoId) {
      return new Response(
        JSON.stringify({ error: 'ID do grupo é obrigatório' }),
        { status: 400, headers }
      );
    }

    console.log(`Creating workflow for email: ${email}, group ID: ${grupoId}`);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Create workflow in n8n
    const n8nResponse = await fetch(N8N_API_URL, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Workflow Home Finance - ${email}`,
        nodes: [],
        connections: {},
        settings: {}
      })
    });

    console.log(`N8N API response status: ${n8nResponse.status}`);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`N8N API error: ${errorText}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao criar workflow no n8n', 
          details: errorText,
          status: n8nResponse.status
        }),
        { status: 500, headers }
      );
    }

    const workflowData = await n8nResponse.json();
    console.log(`Workflow created successfully with ID: ${workflowData.id}`);

    // Update the workflow_id in grupos_whatsapp table
    const { data: updateData, error: updateError } = await supabase
      .from('grupos_whatsapp')
      .update({ workflow_id: workflowData.id })
      .eq('id', grupoId)
      .select();

    if (updateError) {
      console.error(`Error updating grupo_whatsapp: ${JSON.stringify(updateError)}`);
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao atualizar o grupo com o workflow ID', 
          details: updateError 
        }),
        { status: 500, headers }
      );
    }

    console.log(`Group ${grupoId} updated with workflow ID ${workflowData.id}`);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        workflow_id: workflowData.id,
        message: 'Workflow criado e associado ao grupo com sucesso'
      }),
      { headers }
    );
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor', 
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
});
