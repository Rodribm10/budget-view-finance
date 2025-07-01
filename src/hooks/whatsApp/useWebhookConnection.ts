
import { useToast } from '@/hooks/use-toast';
import { createEvolutionWebhook } from '@/services/whatsApp/webhookService';

// Controle global para evitar múltiplos webhooks
const webhooksSentGlobal = new Set<string>();

export const useWebhookConnection = () => {
  const { toast } = useToast();

  const setupWebhookAfterConnection = async (userEmail: string) => {
    try {
      // Verificar se já enviamos webhook para este usuário
      if (webhooksSentGlobal.has(userEmail)) {
        console.log(`🚫 Webhook já foi enviado para ${userEmail}, pulando...`);
        return;
      }
      
      console.log('🔗 Configurando webhook após conexão bem-sucedida...');
      
      // Marcar como enviado ANTES de enviar para evitar race conditions
      webhooksSentGlobal.add(userEmail);
      
      await createEvolutionWebhook(userEmail);
      
      console.log('✅ Webhook configurado com sucesso');
      
      toast({
        title: "Webhook Configurado",
        description: "Webhook foi configurado automaticamente para receber mensagens.",
      });
      
    } catch (error) {
      console.error('❌ Erro ao configurar webhook:', error);
      
      // Remover da lista em caso de erro para permitir nova tentativa
      webhooksSentGlobal.delete(userEmail);
      
      toast({
        title: "Aviso: Webhook",
        description: "WhatsApp conectado, mas houve falha na configuração do webhook.",
        variant: "destructive",
      });
    }
  };

  const resetWebhookStatus = (userEmail: string) => {
    webhooksSentGlobal.delete(userEmail);
    console.log(`🔄 Status do webhook resetado para ${userEmail}`);
  };

  return {
    setupWebhookAfterConnection,
    resetWebhookStatus
  };
};
