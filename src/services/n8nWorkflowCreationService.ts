
import { supabase } from "@/integrations/supabase/client";

interface N8nWorkflowPayload {
  name: string;
  nodes: any[];
  connections: any;
  settings: any;
}

interface N8nWorkflowResponse {
  id: string;
  name: string;
  nodes: Array<{
    webhookUrls?: string[];
  }>;
}

/**
 * Creates a workflow in n8n for a new user - NOW SECURE
 * @param userEmail The email of the user who just registered
 * @param workflowTemplate The JSON template for the workflow
 * @returns The created workflow data
 */
export async function createN8nWorkflowForUser(
  userEmail: string, 
  workflowTemplate: N8nWorkflowPayload
): Promise<{ workflowId: string; webhookUrl: string } | null> {
  try {
    console.log(`🚀 Criando workflow n8n para usuário: ${userEmail}`);
    
    // Extract the username from email (part before @)
    const username = userEmail.split('@')[0];
    
    // Clone the template to avoid modifying the original
    const modifiedTemplate = JSON.parse(JSON.stringify(workflowTemplate));
    
    // 1. Modify the workflow name to include user email
    modifiedTemplate.name = modifiedTemplate.name.replace('rodrigobm10@gmail.com', userEmail);
    
    // 2. Modify webhook path in the first node to use username
    if (modifiedTemplate.nodes && modifiedTemplate.nodes.length > 0) {
      const firstNode = modifiedTemplate.nodes[0];
      if (firstNode.parameters && firstNode.parameters.path) {
        firstNode.parameters.path = username;
      }
    }
    
    // 3. Replace all occurrences of rodrigobm10@gmail.com with user email
    const templateString = JSON.stringify(modifiedTemplate);
    const updatedTemplateString = templateString.replace(/rodrigobm10@gmail\.com/g, userEmail);
    const finalTemplate = JSON.parse(updatedTemplateString);
    
    console.log('📝 Template modificado para usuário:', finalTemplate.name);
    console.log('🔧 Webhook path configurado como:', username);
    
    // Make secure API request through Edge Function
    console.log('📡 Fazendo requisição segura para n8n via Edge Function');
    
    const { data, error } = await supabase.functions.invoke('n8n-api', {
      body: {
        endpoint: '/workflows',
        method: 'POST',
        body: finalTemplate
      }
    });
    
    if (error) {
      console.error('❌ Erro na Edge Function:', error);
      throw new Error(error.message || 'Edge Function request failed');
    }
    
    if (data.error) {
      console.error('❌ Erro da API n8n:', data.error);
      throw new Error(data.error);
    }
    
    const workflowData: N8nWorkflowResponse = data;
    console.log('✅ Workflow criado com sucesso:', workflowData);
    
    // Extract workflow ID and webhook URL
    const workflowId = workflowData.id;
    // Try to get webhook URL from response, fallback to constructed URL
    let webhookUrl = '';
    
    if (workflowData.nodes && workflowData.nodes[0] && workflowData.nodes[0].webhookUrls && workflowData.nodes[0].webhookUrls[0]) {
      webhookUrl = workflowData.nodes[0].webhookUrls[0];
    } else {
      // Fallback: construct the webhook URL
      webhookUrl = `https://n8n.innova1001.com.br/webhook/${username}`;
    }
    
    console.log(`📊 Dados extraídos - ID: ${workflowId}, Webhook: ${webhookUrl}`);
    
    // Save the workflow info to the user's profile
    await saveWorkflowInfoToUser(userEmail, workflowId, webhookUrl);
    
    return {
      workflowId,
      webhookUrl
    };
    
  } catch (error) {
    console.error('❌ Erro na criação do workflow n8n:', error);
    // Log additional error details
    if (error instanceof Error) {
      console.error('❌ Detalhes do erro:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
}

/**
 * Saves workflow information to the user's profile
 * @param userEmail User's email
 * @param workflowId The n8n workflow ID
 * @param webhookUrl The webhook URL
 */
async function saveWorkflowInfoToUser(
  userEmail: string, 
  workflowId: string, 
  webhookUrl: string
): Promise<void> {
  try {
    console.log(`💾 Salvando informações do workflow para: ${userEmail}`);
    console.log(`💾 Dados a salvar - Workflow ID: ${workflowId}, Webhook URL: ${webhookUrl}`);
    
    // Update the user's profile with workflow information
    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        webhook: webhookUrl,
        n8n_workflow_id: workflowId
      })
      .eq('email', userEmail.trim().toLowerCase())
      .select();
    
    if (error) {
      console.error('❌ Erro ao salvar info do workflow no usuário:', error);
      throw error;
    }
    
    console.log(`✅ Informações do workflow salvas com sucesso:`, data);
    console.log(`✅ Workflow ID: ${workflowId}, URL: ${webhookUrl}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário com info do workflow:', error);
    throw error;
  }
}
