
import { makeRequest } from './apiHelpers';

/**
 * Envia o email do usuário para o N8N configurar o webhook
 */
export const createEvolutionWebhook = async (userEmail: string): Promise<any> => {
  try {
    console.log(`Enviando email do usuário para N8N configurar webhook: ${userEmail}`);
    
    const webhookUrl = 'https://webhookn8n.innova1001.com.br/webhook/hook';
    
    const webhookBody = {
      email: userEmail
    };
    
    console.log('Enviando dados para N8N:', {
      webhookUrl,
      email: userEmail
    });
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao enviar webhook para N8N: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao notificar N8N: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.text();
    console.log('✅ Email enviado com sucesso para N8N:', responseData);
    
    return { success: true, message: 'Email enviado para N8N configurar webhook' };
    
  } catch (error) {
    console.error('❌ Erro ao enviar email para N8N:', error);
    throw error;
  }
};
