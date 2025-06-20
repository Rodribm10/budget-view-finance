
import { makeRequest } from './apiHelpers';

/**
 * Cria um webhook na Evolution API para o usuário
 */
export const createEvolutionWebhook = async (userEmail: string): Promise<any> => {
  try {
    // ⚠️ PADRONIZAÇÃO CRÍTICA: Converter email para lowercase
    const normalizedEmail = userEmail.trim().toLowerCase();
    
    console.log(`Criando webhook para o usuário: ${normalizedEmail}`);
    
    // URL do endpoint - mantém o @ normal no email
    const endpoint = `/webhook/set/${normalizedEmail}`;
    
    // Agora mantemos o email original com @ também na URL do webhook
    const webhookBody = {
      webhook: {
        enabled: true,
        url: `https://webhookn8n.innova1001.com.br/webhook/${normalizedEmail}`,
        webhookByEvents: true,
        webhookBase64: true,
        events: [
          "MESSAGES_UPSERT"
        ]
      }
    };
    
    console.log('Dados do webhook:', {
      endpoint,
      emailOriginal: normalizedEmail,
      webhookUrl: webhookBody.webhook.url
    });
    
    const response = await makeRequest(endpoint, 'POST', webhookBody);
    
    console.log(`✅ Webhook criado com sucesso para ${normalizedEmail}:`, response);
    return response;
    
  } catch (error) {
    console.error(`❌ Erro ao criar webhook for ${userEmail}:`, error);
    throw error;
  }
};
