
import { useToast } from '@/hooks/use-toast';
import { deleteInstance } from '@/services/whatsAppService';

/**
 * Hook for handling WhatsApp instance deletion
 */
export const useInstanceDeletion = (
  removeInstance: (instanceId: string) => void
) => {
  const { toast } = useToast();

  // Handler for when an instance is deleted
  const handleDeleteInstance = async (instanceId: string, instanceName: string) => {
    console.log(`Deleting instance with ID: ${instanceId}, name: ${instanceName}`);
    
    try {
      // Call API to delete instance
      const response = await deleteInstance(instanceName);
      console.log(`Deletion API response for instance ${instanceName}:`, response);
      
      // Remove from local state
      removeInstance(instanceId);
      
      toast({
        title: "Instância removida",
        description: "A instância do WhatsApp foi removida com sucesso.",
      });
    } catch (error) {
      console.error(`Error deleting instance with ID ${instanceId}:`, error);
      
      // Even if the API call fails, we still want to remove the instance from local storage
      // This handles the case when instances are in inconsistent state with the server
      removeInstance(instanceId);
      
      toast({
        title: "Aviso",
        description: "Instância removida localmente, mas pode haver falha na comunicação com o servidor.",
        variant: "destructive",
      });
    }
  };

  return {
    handleDeleteInstance
  };
};
