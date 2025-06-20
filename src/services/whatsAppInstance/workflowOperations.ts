
import { N8N_CONFIG } from './config';

/**
 * N8N workflow operations
 */

/**
 * Notifica o n8n para ativar o workflow do usuário via webhook
 */
export async function activateUserWorkflow(userEmail: string): Promise<void> {
  try {
    console.log(`🔔 Enviando webhook para ativar workflow do usuário: ${userEmail}`);
    
    // Nova lógica: webhook simples para o n8n
    const webhookUrl = 'https://webhookn8n.innova1001.com.br/webhook/ativarworkflow';
    console.log(`🔗 URL do webhook: ${webhookUrl}`);
    
    const webhookBody = {
      email: userEmail
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
