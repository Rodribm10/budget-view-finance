
// Service to send webhook to n8n when a new user registers
import { supabase } from "@/integrations/supabase/client";

interface NewUserWebhookData {
  email: string;
  userId: string;
}

/**
 * Sends a webhook to the n8n workflow manager when a new user registers
 * @param email User's email
 * @param userId User's ID from Supabase Auth
 * @returns Success status
 */
export async function sendNewUserWebhook(
  email: string, 
  userId: string
): Promise<boolean> {
  try {
    console.log(`📡 Enviando webhook para n8n - Usuário: ${email}, ID: ${userId}`);
    
    const webhookData: NewUserWebhookData = {
      email: email,
      userId: userId
    };
    
    console.log('📋 Dados do webhook:', JSON.stringify(webhookData, null, 2));
    
    // Send webhook to n8n workflow manager
    const response = await fetch('https://webhookn8n.innova1001.com.br/webhook/workflow_financehome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log(`📡 Status da resposta do webhook: ${response.status}`);
    console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro no webhook n8n: ${response.status} - ${errorText}`);
      return false;
    }
    
    const responseData = await response.text();
    console.log('✅ Webhook enviado com sucesso:', responseData);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao enviar webhook para n8n:', error);
    return false;
  }
}
