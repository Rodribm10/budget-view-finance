
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import StatusBadge from './StatusBadge';
import InstanceActions from './InstanceActions';
import ConfirmationDialog from './ConfirmationDialog';

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
              <StatusBadge connectionStatus={connectionStatus} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <InstanceActions
            instance={instance}
            loading={loading}
            onViewQrCode={onViewQrCode}
            onRestart={handleRestart}
            onLogout={handleLogout}
            onDelete={handleDelete}
            onSetOnline={handleSetOnline}
            onSetOffline={handleSetOffline}
          />
        </CardFooter>
      </Card>

      {confirmAction && (
        <ConfirmationDialog
          open={confirmAction.open}
          onOpenChange={(open) => !open && setConfirmAction(null)}
          title={confirmAction.title}
          description={confirmAction.description}
          actionLabel={confirmAction.actionLabel}
          onAction={executeAction}
          loading={loading !== null}
        />
      )}
    </>
  );
};

export default InstanceCard;
