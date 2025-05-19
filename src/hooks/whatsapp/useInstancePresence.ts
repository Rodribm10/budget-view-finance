
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { setInstancePresence } from '@/services/whatsAppService';

/**
 * Hook for handling WhatsApp instance presence (online/offline)
 */
export const useInstancePresence = (
  updateInstance: (instance: WhatsAppInstance) => void
) => {
  const { toast } = useToast();
  
  // Handler for when presence is changed
  const handleSetPresence = async (instance: WhatsAppInstance, presence: 'online' | 'offline') => {
    try {
      console.log(`Setting presence to ${presence} for instance ${instance.instanceName}`);
      await setInstancePresence(instance.instanceName, presence);
      
      const updatedInstance = {
        ...instance,
        presence: presence
      };
      console.log(`Updated instance with new presence status`, updatedInstance);
      updateInstance(updatedInstance);
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} agora está ${presence === 'online' ? 'Online' : 'Offline'}`
      });
      
    } catch (error) {
      console.error(`Error setting presence to ${presence} for instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao definir presença ${presence} para ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };

  return {
    handleSetPresence
  };
};
