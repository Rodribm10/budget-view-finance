
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, ScanQrCode } from 'lucide-react';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchQrCode, fetchConnectionState } from '@/services/whatsAppService';
import { useToast } from '@/hooks/use-toast';
import { useWebhookConnection } from '@/hooks/whatsApp/useWebhookConnection';

interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeInstance: WhatsAppInstance | null;
  onStatusCheck: () => void;
}

const QrCodeDialog = ({ 
  open, 
  onOpenChange, 
  activeInstance, 
  onStatusCheck 
}: QrCodeDialogProps) => {
  const { toast } = useToast();
  const { setupWebhookAfterConnection } = useWebhookConnection();
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionCheckInterval, setConnectionCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Auto-fetch QR code when dialog opens with an active instance
  useEffect(() => {
    if (open && activeInstance) {
      handleRefreshQrCode();
      startConnectionCheck();
    } else {
      // Clear QR code data when dialog closes
      setQrCodeData(null);
      setQrError(null);
      stopConnectionCheck();
    }

    return () => {
      stopConnectionCheck();
    };
  }, [open, activeInstance]);

  const startConnectionCheck = () => {
    if (!activeInstance) return;

    console.log('Iniciando verificação periódica de conexão...');
    setIsCheckingConnection(true);

    const interval = setInterval(async () => {
      try {
        const connectionState = await fetchConnectionState(activeInstance.instanceName);
        console.log(`Estado da conexão para ${activeInstance.instanceName}:`, connectionState);

        if (connectionState === 'open') {
          console.log('🎉 Conexão estabelecida com sucesso!');
          
          // Parar a verificação
          stopConnectionCheck();
          
          // Configurar webhook
          const userEmail = localStorage.getItem('userEmail');
          if (userEmail) {
            await setupWebhookAfterConnection(userEmail);
          }
          
          // Mostrar sucesso
          toast({
            title: "WhatsApp Conectado!",
            description: "Conexão estabelecida com sucesso. Webhook configurado automaticamente.",
          });
          
          // Fechar o dialog e atualizar status
          onOpenChange(false);
          onStatusCheck();
        }
      } catch (error) {
        console.error('Erro ao verificar estado da conexão:', error);
      }
    }, 3000); // Verifica a cada 3 segundos

    setConnectionCheckInterval(interval);
  };

  const stopConnectionCheck = () => {
    if (connectionCheckInterval) {
      console.log('Parando verificação de conexão...');
      clearInterval(connectionCheckInterval);
      setConnectionCheckInterval(null);
      setIsCheckingConnection(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    
    // After dialog closes, trigger status check to update connection state
    if (!newOpen) {
      stopConnectionCheck();
      onStatusCheck();
    }
  };

  const handleRefreshQrCode = async () => {
    if (!activeInstance) return;
    
    setLoadingQR(true);
    setQrError(null);

    try {
      const data = await fetchQrCode(activeInstance.instanceName);
      console.log('QR Code API response:', data);

      // Using the "base64" field from the response as the QR code data
      if (data && data.base64) {
        // Save the base64 image data directly - it already contains the data:image prefix
        setQrCodeData(data.base64);
        setQrError(null);
        
        // Iniciar verificação de conexão quando QR code é exibido
        if (!isCheckingConnection) {
          startConnectionCheck();
        }
      } else {
        setQrCodeData(null);
        setQrError("QR Code não disponível. A instância pode já estar conectada ou houve um erro na API.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setQrCodeData(null);
      setQrError("Falha ao obter QR Code. Verifique a conexão ou tente novamente mais tarde.");
      toast({
        title: "Erro ao obter QR Code",
        description: "Não foi possível obter o QR Code. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp - {activeInstance?.instanceName}</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code com seu WhatsApp para finalizar a conexão
            {isCheckingConnection && (
              <span className="block mt-1 text-blue-600 font-medium">
                ⏳ Aguardando conexão... (verificando automaticamente)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          {loadingQR && (
            <div className="text-center py-8 flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin mb-2 text-gray-500" />
              <p>Carregando QR Code...</p>
            </div>
          )}
          
          {qrCodeData && !loadingQR && (
            <div className="flex flex-col items-center space-y-4">
              <div className="border p-4 bg-white rounded-md">
                {qrCodeData.startsWith('data:image/') ? (
                  <img 
                    src={qrCodeData}
                    alt="QR Code WhatsApp" 
                    className="w-full h-auto max-w-[250px]" 
                  />
                ) : (
                  <div className="text-center text-red-500">Formato de QR Code inválido</div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-center text-gray-600">
                <ScanQrCode className="h-4 w-4" />
                <p>Escaneie este QR Code com seu WhatsApp para finalizar a conexão</p>
              </div>
              {isCheckingConnection && (
                <div className="text-center text-blue-600 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verificando conexão automaticamente...</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {qrError && !loadingQR && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{qrError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex space-x-2">
            {activeInstance && (
              <Button 
                variant="outline" 
                onClick={handleRefreshQrCode} 
                disabled={loadingQR}
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingQR ? 'animate-spin' : ''}`} />
                {loadingQR ? 'Atualizando...' : 'Atualizar QR Code'}
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeDialog;
