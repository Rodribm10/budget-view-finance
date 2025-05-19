
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { restartInstance, logoutInstance } from '@/services/whatsAppService';

/**
 * Hook for handling WhatsApp instance connection actions like restart and logout
 */
export const useInstanceConnection = (
  updateInstance: (instance: WhatsAppInstance) => void,
  checkAllInstancesStatus: () => Promise<void>
) => {
  const { toast } = useToast();
  
  // Handler for when an instance is restarted
  const handleRestartInstance = async (instance: WhatsAppInstance) => {
    try {
      console.log(`Attempting to restart instance ${instance.instanceName}`);
      await restartInstance(instance.instanceName);
      
      // Update the instance state to "connecting"
      const updatedInstance = { 
        ...instance, 
        connectionState: 'connecting' as const 
      };
      console.log(`Instance ${instance.instanceName} restart initiated, setting state to connecting`, updatedInstance);
      updateInstance(updatedInstance);
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} reiniciada com sucesso`
      });
      
      // Check status after a brief delay to give time to update
      setTimeout(() => checkAllInstancesStatus(), 3000);
      
    } catch (error) {
      console.error(`Error restarting instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao reiniciar a instância ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };
  
  // Handler for when an instance is disconnected
  const handleLogoutInstance = async (instance: WhatsAppInstance) => {
    try {
      console.log(`Attempting to logout instance ${instance.instanceName}`);
      await logoutInstance(instance.instanceName);
      
      // Update the instance state to "closed"
      const updatedInstance = { 
        ...instance, 
        connectionState: 'closed' as const,
        status: 'disconnected'
      };
      console.log(`Instance ${instance.instanceName} logout successful, updating instance state`, updatedInstance);
      updateInstance(updatedInstance);
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} desconectada com sucesso`
      });
      
    } catch (error) {
      console.error(`Error logging out instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao desconectar a instância ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };

  return {
    handleRestartInstance,
    handleLogoutInstance
  };
};
