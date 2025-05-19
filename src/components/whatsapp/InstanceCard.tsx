
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  X, 
  PowerOff,
  CircleDot,
  CircleOff
} from 'lucide-react';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InstanceCardProps {
  instance: WhatsAppInstance;
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
  onRestart: (instance: WhatsAppInstance) => Promise<void>;
  onLogout: (instance: WhatsAppInstance) => Promise<void>;
  onSetPresence: (instance: WhatsAppInstance, presence: 'online' | 'offline') => Promise<void>;
}

const InstanceCard = ({ 
  instance,
  onViewQrCode,
  onDelete,
  onRestart,
  onLogout,
  onSetPresence
}: InstanceCardProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    actionLabel: string;
  } | null>(null);

  // Função para processar uma ação com confirmação
  const handleConfirmAction = (
    title: string, 
    description: string, 
    action: () => Promise<void>,
    actionLabel: string = "Confirmar"
  ) => {
    setConfirmAction({
      open: true,
      title,
      description,
      action,
      actionLabel
    });
  };

  // Executa a ação após confirmação
  const executeAction = async () => {
    if (!confirmAction) return;
    
    try {
      setLoading(confirmAction.title);
      await confirmAction.action();
    } catch (error) {
      console.error("Error executing action:", error);
    } finally {
      setLoading(null);
      setConfirmAction(null);
    }
  };

  // Handler para reiniciar instância
  const handleRestart = () => {
    handleConfirmAction(
      "Reiniciar Instância",
      `Deseja realmente reiniciar a instância "${instance.instanceName}"? A conexão atual será fechada e restabelecida.`,
      async () => {
        await onRestart(instance);
      },
      "Reiniciar"
    );
  };

  // Handler para deslogar instância
  const handleLogout = () => {
    handleConfirmAction(
      "Desconectar Instância",
      `Deseja realmente desconectar a instância "${instance.instanceName}"? Você precisará escanear o QR Code novamente para reconectar.`,
      async () => {
        await onLogout(instance);
      },
      "Desconectar"
    );
  };

  // Handler para apagar instância
  const handleDelete = () => {
    handleConfirmAction(
      "Excluir Instância",
      `Deseja realmente excluir a instância "${instance.instanceName}"? Esta ação não pode ser desfeita.`,
      async () => {
        onDelete(instance.instanceId);
      },
      "Excluir"
    );
  };

  // Handler para definir presença online
  const handleSetOnline = () => {
    handleConfirmAction(
      "Definir Presença Online",
      `Deseja alterar o status da instância "${instance.instanceName}" para Online?`,
      async () => {
        await onSetPresence(instance, 'online');
      },
      "Definir Online"
    );
  };

  // Handler para definir presença offline
  const handleSetOffline = () => {
    handleConfirmAction(
      "Definir Presença Offline",
      `Deseja alterar o status da instância "${instance.instanceName}" para Offline?`,
      async () => {
        await onSetPresence(instance, 'offline');
      },
      "Definir Offline"
    );
  };

  // Determina o estado de conexão a ser exibido
  const getConnectionStatus = () => {
    // Se o status é 'disconnected', 'error', 'destroyed', ou não está definido, consideramos como desconectado
    if (instance.status === 'disconnected' || 
        instance.status === 'error' || 
        instance.status === 'destroyed' || 
        !instance.status) {
      return 'closed';
    }
    
    // Se o connectionState já está definido como 'open', manter
    if (instance.connectionState === 'open') {
      return 'open';
    }
    
    // Em outros casos, usar o valor atual do connectionState
    return instance.connectionState || 'closed';
  };

  const connectionStatus = getConnectionStatus();

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{instance.instanceName}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
              <span>{instance.phoneNumber}</span>
            </div>
            <div className="flex items-center text-sm">
              {connectionStatus === 'open' ? (
                <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-300">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Status: Conectado
                </Badge>
              ) : connectionStatus === 'connecting' ? (
                <Badge variant="outline" className="flex items-center gap-1 text-orange-500 border-orange-300">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                  Status: Conectando
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-300">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                  Status: Desconectado
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewQrCode(instance)}
              className="flex items-center"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Ver QR Code
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={loading !== null}
            >
              <X className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRestart}
              disabled={loading !== null}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reiniciar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              disabled={loading !== null}
            >
              <PowerOff className="h-4 w-4 mr-1" />
              Desconectar
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSetOnline}
              disabled={loading !== null}
              className="bg-green-50 hover:bg-green-100 text-green-700"
            >
              <CircleDot className="h-4 w-4 mr-1" />
              Definir Online
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSetOffline}
              disabled={loading !== null}
              className="bg-red-50 hover:bg-red-100 text-red-700"
            >
              <CircleOff className="h-4 w-4 mr-1" />
              Definir Offline
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={confirmAction?.open} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading !== null}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeAction}
              disabled={loading !== null}
              className={loading === confirmAction?.title ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading === confirmAction?.title ? "Processando..." : confirmAction?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InstanceCard;
