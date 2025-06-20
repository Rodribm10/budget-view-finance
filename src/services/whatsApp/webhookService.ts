
import { makeRequest } from './apiHelpers';

/**
 * Cria um webhook na Evolution API para o usuário
 */
export const createEvolutionWebhook = async (userEmail: string): Promise<any> => {
  try {
    console.log(`Criando webhook para o usuário: ${userEmail}`);
    
    // URL do endpoint - mantém o @ normal no email
    const endpoint = `/webhook/set/${userEmail}`;
    
    // Agora mantemos o email original com @ também na URL do webhook
    const webhookBody = {
      webhook: {
        enabled: true,
        url: `https://webhookn8n.innova1001.com.br/webhook/${userEmail}`,
        webhookByEvents: true,
        webhookBase64: true,
        events: [
          "MESSAGES_UPSERT"
        ]
      }
    };
    
    console.log('Dados do webhook:', {
      endpoint,
      emailOriginal: userEmail,
      webhookUrl: webhookBody.webhook.url
    });
    
    const response = await makeRequest(endpoint, 'POST', webhookBody);
    
    console.log(`✅ Webhook criado com sucesso para ${userEmail}:`, response);
    return response;
    
  } catch (error) {
    console.error(`❌ Erro ao criar webhook for ${userEmail}:`, error);
    throw error;
  }
};
