
// Service dedicated to n8n workflow operations
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a workflow in the n8n system for a specific user
 * @param email User email to associate with the workflow
 * @returns The created workflow data or null if creation failed
 */
export async function createWorkflowInN8n(email: string): Promise<{ id: string } | null> {
  try {
    console.log(`Solicitando criação de workflow para o email: ${email}`);
    
    // Find or create WhatsApp group for the user to get the group ID
    const { data: grupos, error: gruposError } = await supabase
      .from('grupos_whatsapp')
      .select('*')
      .eq('login', email.trim().toLowerCase())
      .limit(1);
    
    if (gruposError) {
      console.error("Erro ao buscar grupo do WhatsApp:", gruposError);
      throw new Error("Não foi possível encontrar o grupo do WhatsApp associado ao usuário");
    }
    
    if (!grupos || grupos.length === 0) {
      console.error("Nenhum grupo encontrado para o usuário");
      throw new Error("Nenhum grupo do WhatsApp encontrado para o usuário");
    }
    
    const grupo = grupos[0];
    
    // If the group already has a workflow ID, return it
    if (grupo.workflow_id) {
      console.log(`Grupo já possui workflow ID: ${grupo.workflow_id}`);
      return { id: grupo.workflow_id };
    }
    
    // The API endpoint for the n8n workflow creation via Edge Function
    const edgeFunctionUrl = 'https://tnurlgbvfsxwqgwxamni.supabase.co/functions/v1/create-n8n-workflow';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YmM4MjQxOS0zZTk1LTRiYmMtODMwMy0xODAzZjk4YmQ4YjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3NzM0NzYyLCJleHAiOjE3NTAzMDIwMDB9.Evr_o42xLJPq1c2p5SUWo00IY85WXp8s_nqSy64V-is';
    
    // Create the workflow data
    const workflowData = {
      name: `Workflow Home Finance - ${email}`,
      nodes: [],
      connections: {},
      settings: {}
    };

    // Prepare the request payload
    const payload = {
      email: email,
      grupoId: grupo.id,
      apiKey: apiKey,
      workflowData: workflowData
    };
    
    console.log('Calling Edge Function to create workflow in n8n with payload:', payload);
    
    // Get Supabase anonymous key for authorization
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRudXJsZ2J2ZnN4d3Fnd3hhbW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTQ1OTksImV4cCI6MjA2MDQ5MDU5OX0.9__EQiZDJ954SmeeJIDTQjOYDjiiRcppai1e8UpuOl4';
    
    // Make the request to the Edge Function
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(payload)
    });
    
    // Log detailed response status
    console.log(`Status da resposta da Edge Function: ${response.status}`);
    
    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorBody = await response.json();
        errorDetails = JSON.stringify(errorBody);
        console.error(`Erro ao criar workflow através da Edge Function: Status ${response.status}`, errorBody);
      } catch (e) {
        console.error(`Não foi possível ler o corpo da resposta de erro: ${e}`);
      }
      throw new Error(`Erro ao criar workflow: Status ${response.status}. Detalhes: ${errorDetails}`);
    }

    const data = await response.json();
    console.log('Resposta da criação de workflow:', data);
    
    // After successful workflow creation, update the group record with the workflow ID
    if (data.workflow_id) {
      const { error: updateError } = await supabase
        .from('grupos_whatsapp')
        .update({ workflow_id: data.workflow_id })
        .eq('id', grupo.id);
        
      if (updateError) {
        console.error('Erro ao atualizar workflow_id no grupo:', updateError);
        // We still return the workflow ID even if there was an error updating the group
      }
      
      return { id: data.workflow_id };
    } else {
      console.error('Resposta não contém workflow_id válido:', data);
      throw new Error('A resposta da API não contém um workflow_id válido');
    }
  } catch (error) {
    console.error('Erro na requisição de criação de workflow:', error);
    throw error;
  }
}

/**
 * Clones an existing n8n workflow for a user
 * @param email User email 
 * @param grupoId Group ID to associate with cloned workflow
 * @returns The cloned workflow data or null if cloning failed
 */
export async function cloneN8nWorkflow(email: string, grupoId: string): Promise<{ workflow_id: string } | null> {
  try {
    console.log(`Clonando workflow para email: ${email}, grupoId: ${grupoId}`);
    
    const response = await fetch('https://n8n.innova1001.com.br/webhook/clone-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        grupo_id: grupoId
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao clonar workflow: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta da clonagem de workflow:', data);
    
    return data;
  } catch (error) {
    console.error('Erro na requisição de clonagem de workflow:', error);
    return null;
  }
}
