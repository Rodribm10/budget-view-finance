
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
    
    // Get the URL from an environment variable or build it
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tnurlgbvfsxwqgwxamni.supabase.co";
    
    // Call our edge function to create the workflow
    const response = await fetch(`${supabaseUrl}/functions/v1/create-n8n-workflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Use getSession() to get the current session
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
      },
      body: JSON.stringify({
        email: email,
        grupoId: grupo.id
      })
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
    
    return { id: data.workflow_id };
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
