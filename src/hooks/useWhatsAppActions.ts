
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import {
  restartInstance,
  logoutInstance,
  deleteInstance,
  setInstancePresence,
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
      await restartInstance(instance.instanceName);
      
      // Atualiza o estado da instância para "connecting"
      const updatedInstance = { 
        ...instance, 
        connectionState: 'connecting' as const 
      };
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
      await logoutInstance(instance.instanceName);
      
      // Atualiza o estado da instância para "closed"
      const updatedInstance = { 
        ...instance, 
        connectionState: 'closed' as const 
      };
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
  
  // Handler for quando a presença é alterada
  const handleSetPresence = async (instance: WhatsAppInstance, presence: 'online' | 'offline') => {
    try {
      await setInstancePresence(instance.instanceName, presence);
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} agora está ${presence === 'online' ? 'Online' : 'Offline'}`
      });
      
      // Não precisamos alterar o estado da instância aqui, pois isso não afeta o connectionState
      
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
    console.log(`Deleting instance with ID: ${instanceId}`);
    
    try {
      // Call API to delete instance
      await deleteInstance(instanceName);
      
      // Remove from local state
      removeInstance(instanceId);
      
      // If we're viewing QR code for this instance, close the dialog
      if (activeInstance?.instanceId === instanceId) {
        setQrDialogOpen(false);
      }
      
      toast({
        title: "Instância removida",
        description: "A instância do WhatsApp foi removida com sucesso.",
      });
    } catch (error) {
      console.error(`Error deleting instance with ID ${instanceId}:`, error);
      toast({
        title: "Erro",
        description: "Falha ao excluir a instância. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Handler for when QR code dialog is requested
  const handleViewQrCode = async (instance: WhatsAppInstance) => {
    setActiveInstance(instance);
    setQrDialogOpen(true);

    try {
      const data = await fetchQrCode(instance.instanceName);
      console.log('QR Code API response:', data);
      
      // If the fetchQrCode call was successful, QrCodeDialog will handle showing the QR code
    } catch (error) {
      console.error("Error initiating QR code fetch:", error);
      toast({
        title: "Erro ao obter QR Code",
        description: "Falha ao iniciar obtenção de QR Code. Tente novamente.",
        variant: "destructive",
      });
      setQrDialogOpen(false);
    }
  };

  return {
    activeInstance,
    qrDialogOpen,
    setQrDialogOpen,
    handleRestartInstance,
    handleLogoutInstance,
    handleSetPresence,
    handleDeleteInstance,
    handleViewQrCode
  };
};
