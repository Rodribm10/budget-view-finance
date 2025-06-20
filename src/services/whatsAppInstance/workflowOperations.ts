
import { N8N_CONFIG } from './config';

/**
 * N8N workflow operations
 */

/**
 * Ativa um workflow específico no n8n via API direta
 */
export async function activateN8nWorkflow(workflowId: string): Promise<void> {
  try {
    console.log(`🔔 Ativando workflow no n8n: ${workflowId}`);
    
    const apiUrl = `${N8N_CONFIG.BASE_URL}/workflows/${workflowId}/activate`;
    console.log(`🔗 URL da API: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_CONFIG.API_KEY
      }
    });
    
    console.log(`📡 Status da resposta da API: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro ao ativar workflow: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao ativar workflow: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Workflow ativado com sucesso:', responseData);
    
  } catch (error) {
    console.error('💥 Erro crítico ao ativar workflow:', error);
    throw error;
  }
}

/**
 * Notifica o n8n para ativar o workflow do usuário via webhook
 */
export async function activateUserWorkflow(userEmail: string): Promise<void> {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    console.log(`🔔 Enviando webhook para ativar workflow do usuário: ${normalizedEmail}`);
    
    // Nova lógica: webhook simples para o n8n
    const webhookUrl = 'https://webhookn8n.innova1001.com.br/webhook/ativarworkflow';
    console.log(`🔗 URL do webhook: ${webhookUrl}`);
    
    const webhookBody = {
      email: normalizedEmail
    };
    
    console.log('📦 Dados do webhook:', JSON.stringify(webhookBody, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookBody)
    });
    
    console.log(`📡 Status da resposta do webhook: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro ao enviar webhook: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao notificar ativação do workflow: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.text();
    console.log('✅ Webhook enviado com sucesso:', responseData);
    
  } catch (error) {
    console.error('💥 Erro crítico ao enviar webhook de ativação:', error);
    throw error;
  }
}
