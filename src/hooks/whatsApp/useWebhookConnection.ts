
import { useToast } from '@/hooks/use-toast';
import { createEvolutionWebhook } from '@/services/whatsApp/webhookService';

export const useWebhookConnection = () => {
  const { toast } = useToast();

  const setupWebhookAfterConnection = async (userEmail: string) => {
    try {
      console.log('🔗 Configurando webhook após conexão bem-sucedida...');
      
      await createEvolutionWebhook(userEmail);
      
      console.log('✅ Webhook configurado com sucesso');
      
      toast({
        title: "Webhook Configurado",
        description: "Webhook foi configurado automaticamente para receber mensagens.",
      });
      
    } catch (error) {
      console.error('❌ Erro ao configurar webhook:', error);
      
      toast({
        title: "Aviso: Webhook",
        description: "WhatsApp conectado, mas houve falha na configuração do webhook.",
        variant: "destructive",
      });
    }
  };

  return {
    setupWebhookAfterConnection
  };
};
