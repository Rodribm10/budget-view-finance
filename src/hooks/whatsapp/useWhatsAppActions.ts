
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { useInstanceConnection } from './useInstanceConnection';
import { useInstancePresence } from './useInstancePresence';
import { useInstanceDeletion } from './useInstanceDeletion';
import { useQrCodeDialog } from './useQrCodeDialog';

/**
 * Main hook that combines all WhatsApp instance actions
 */
export const useWhatsAppActions = (
  updateInstance: (instance: WhatsAppInstance) => void,
  removeInstance: (instanceId: string) => void,
  checkAllInstancesStatus: () => Promise<void>
) => {
  // Combine all the action hooks
  const { handleRestartInstance, handleLogoutInstance } = 
    useInstanceConnection(updateInstance, checkAllInstancesStatus);
    
  const { handleSetPresence } = 
    useInstancePresence(updateInstance);
    
  const { handleDeleteInstance } = 
    useInstanceDeletion(removeInstance);
    
  const { activeInstance, qrDialogOpen, setQrDialogOpen, handleViewQrCode } = 
    useQrCodeDialog();

  return {
    // Re-export all actions and state from the specialized hooks
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
