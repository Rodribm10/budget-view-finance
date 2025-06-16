
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import {
  restartInstance,
  logoutInstance,
  deleteInstance,
  setInstancePresence,
  disconnectInstance,
  fetchQrCode
} from '@/services/whatsAppService';

export const useWhatsAppActions = (
  updateInstance: (instance: WhatsAppInstance) => void,
  removeInstance: (instanceId: string) => void,
  checkAllInstancesStatus: () => Promise<void>
) => {
  const { toast } = useToast();
  const [activeInstance, setActiveInstance] = useState<WhatsAppInstance | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // Handler for quando uma instância é reiniciada
  const handleRestartInstance = async (instance: WhatsAppInstance) => {
    try {
      console.log(`Attempting to restart instance ${instance.instanceName}`);
      await restartInstance(instance.instanceName);
      
      // Atualiza o estado da instância para "connecting"
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
      
      // Verifica o status após um breve delay para dar tempo de atualizar
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
  
  // Handler for quando uma instância é desconectada
  const handleLogoutInstance = async (instance: WhatsAppInstance) => {
    try {
      console.log(`Attempting to logout instance ${instance.instanceName}`);
      await logoutInstance(instance.instanceName);
      
      // Atualiza o estado da instância para "closed"
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

  // Handler for quando uma instância é desconectada permanentemente
  const handleDisconnectInstance = async (instance: WhatsAppInstance) => {
    try {
      console.log(`Attempting to disconnect instance ${instance.instanceName} permanently`);
      
      // Pegar email do usuário
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('Email do usuário não encontrado');
      }
      
      await disconnectInstance(instance.instanceName, userEmail);
      
      // Atualiza o estado da instância para "closed"
      const updatedInstance = { 
        ...instance, 
        connectionState: 'closed' as const,
        status: 'disconnected'
      };
      console.log(`Instance ${instance.instanceName} disconnected permanently, updating instance state`, updatedInstance);
      updateInstance(updatedInstance);
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} desconectada permanentemente`
      });
      
    } catch (error) {
      console.error(`Error disconnecting instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao desconectar a instância ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };
  
  // Handler for quando a presença é alterada
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

  // Handler for when an instance is deleted
  const handleDeleteInstance = async (instanceId: string, instanceName: string) => {
    console.log(`Deleting instance with ID: ${instanceId}, name: ${instanceName}`);
    
    try {
      // Call API to delete instance
      const response = await deleteInstance(instanceName);
      console.log(`Deletion API response for instance ${instanceName}:`, response);
      
      // Remove from local state
      removeInstance(instanceId);
      
      // If we're viewing QR code for this instance, close the dialog
      if (activeInstance?.instanceId === instanceId) {
        setQrDialogOpen(false);
        setActiveInstance(null);
      }
      
      toast({
        title: "Instância removida",
        description: "A instância do WhatsApp foi removida com sucesso.",
      });
    } catch (error) {
      console.error(`Error deleting instance with ID ${instanceId}:`, error);
      
      // Even if the API call fails, we still want to remove the instance from local storage
      // This handles the case when instances are in inconsistent state with the server
      removeInstance(instanceId);
      
      if (activeInstance?.instanceId === instanceId) {
        setQrDialogOpen(false);
        setActiveInstance(null);
      }
      
      toast({
        title: "Aviso",
        description: "Instância removida localmente, mas pode haver falha na comunicação com o servidor.",
        variant: "destructive",
      });
    }
  };

  // Handler for when QR code dialog is requested
  const handleViewQrCode = async (instance: WhatsAppInstance) => {
    console.log(`Opening QR code dialog for instance: ${instance.instanceName}`);
    
    // First set the active instance and open dialog to show loading state
    setActiveInstance(instance);
    setQrDialogOpen(true);

    try {
      // Pre-fetch QR code data - this will be handled by the dialog itself now
      // with the useEffect in the dialog component 
      console.log('QR Code dialog opened, fetching will be handled by dialog component');
    } catch (error) {
      console.error("Error initiating QR code fetch:", error);
      toast({
        title: "Erro ao obter QR Code",
        description: "Falha ao iniciar obtenção de QR Code. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    activeInstance,
    qrDialogOpen,
    setQrDialogOpen,
    handleRestartInstance,
    handleLogoutInstance,
    handleDisconnectInstance,
    handleSetPresence,
    handleDeleteInstance,
    handleViewQrCode
  };
};
