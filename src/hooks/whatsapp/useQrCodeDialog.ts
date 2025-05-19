
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchQrCode } from '@/services/whatsAppService';

/**
 * Hook for handling WhatsApp QR code dialog functionality
 */
export const useQrCodeDialog = () => {
  const { toast } = useToast();
  const [activeInstance, setActiveInstance] = useState<WhatsAppInstance | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // Handler for when QR code dialog is requested
  const handleViewQrCode = async (instance: WhatsAppInstance) => {
    console.log(`Opening QR code dialog for instance: ${instance.instanceName}`);
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
    handleViewQrCode
  };
};
