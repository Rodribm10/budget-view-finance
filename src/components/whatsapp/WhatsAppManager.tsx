
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import InstanceStats from '@/components/whatsapp/InstanceStats';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';
import ConnectedInstanceMessage from './ConnectedInstanceMessage';

interface WhatsAppManagerProps {
  hasExistingInstance: boolean;
  existingInstanceData: any;
  instances: WhatsAppInstance[];
  isRefreshing: boolean;
  activeInstance: WhatsAppInstance | null;
  qrDialogOpen: boolean;
  onInstanceCreated: (instance: WhatsAppInstance) => void;
  onViewQrCode: (instance: WhatsAppInstance) => void;
  onDelete: (instanceId: string) => void;
  onRestart: (instance: WhatsAppInstance) => Promise<void>;
  onLogout: (instance: WhatsAppInstance) => Promise<void>;
  onDisconnect: (instance: WhatsAppInstance) => Promise<void>;
  onSetPresence: (instance: WhatsAppInstance, presence: 'online' | 'offline') => Promise<void>;
  onRefreshInstances: () => void;
  onStatusCheck: () => Promise<void>;
  setQrDialogOpen: (open: boolean) => void;
}

const WhatsAppManager = ({
  hasExistingInstance,
  existingInstanceData,
  instances,
  isRefreshing,
  activeInstance,
  qrDialogOpen,
  onInstanceCreated,
  onViewQrCode,
  onDelete,
  onRestart,
  onLogout,
  onDisconnect,
  onSetPresence,
  onRefreshInstances,
  onStatusCheck,
  setQrDialogOpen
}: WhatsAppManagerProps) => {
  const hasInstances = Array.isArray(instances) && instances.length > 0;

  return (
    <>
      {/* Formulário de criação - APENAS se NÃO tiver instância conectada */}
      {!hasExistingInstance && (
        <CreateInstanceForm onInstanceCreated={onInstanceCreated} />
      )}
      
      {/* Mensagem quando já tem instância conectada */}
      {hasExistingInstance && existingInstanceData && (
        <ConnectedInstanceMessage instanceData={existingInstanceData} />
      )}
      
      {hasInstances && <InstanceStats instances={instances} />}
      
      <InstanceList 
        instances={instances} 
        onViewQrCode={onViewQrCode} 
        onDelete={onDelete}
        onRestart={onRestart}
        onLogout={onLogout}
        onDisconnect={onDisconnect}
        onSetPresence={onSetPresence}
        onRefreshInstances={onRefreshInstances}
        isRefreshing={isRefreshing}
      />
      
      <QrCodeDialog 
        open={qrDialogOpen} 
        onOpenChange={setQrDialogOpen}
        activeInstance={activeInstance}
        onStatusCheck={onStatusCheck}
      />
    </>
  );
};

export default WhatsAppManager;
