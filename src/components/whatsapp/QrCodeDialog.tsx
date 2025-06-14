
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
import { fetchQrCode } from '@/services/whatsAppService';
import { useToast } from '@/hooks/use-toast';

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
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  // Auto-fetch QR code when dialog opens with an active instance
  useEffect(() => {
    if (open && activeInstance) {
      handleRefreshQrCode();
    } else {
      // Clear QR code data when dialog closes
      setQrCodeData(null);
      setQrError(null);
    }
  }, [open, activeInstance]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    
    // After dialog closes, trigger status check to update connection state
    if (!newOpen) {
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
