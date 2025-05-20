
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import Layout from '@/components/layout/Layout';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import InstanceStats from '@/components/whatsapp/InstanceStats';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';
import LoadingState from '@/components/whatsapp/LoadingState';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';
import { useWhatsAppInstance, WHATSAPP_INSTANCE_KEY } from '@/hooks/whatsApp/useWhatsAppInstance';
import { usePeriodicStatusCheck } from '@/hooks/whatsApp/usePeriodicStatusCheck';

const WhatsApp = () => {
  const { 
    instances, 
    isRefreshing,
    addInstance, 
    removeInstance, 
    updateInstance, 
    refreshInstances, 
    checkAllInstancesStatus,
    currentUserId
  } = useWhatsAppInstances();

  const {
    activeInstance,
    qrDialogOpen,
    setQrDialogOpen,
    handleRestartInstance,
    handleLogoutInstance,
    handleSetPresence,
    handleDeleteInstance,
    handleViewQrCode
  } = useWhatsAppActions(updateInstance, removeInstance, checkAllInstancesStatus);
  
  // Custom hook for instance fetching and management
  const {
    instanceName,
    isLoading,
    instanceFound,
    setInstanceFound,
    saveInstanceName,
    clearInstanceName
  } = useWhatsAppInstance(currentUserId, addInstance);
  
  // Set up periodic status checking
  usePeriodicStatusCheck(instances.length, checkAllInstancesStatus);

  // Handler para quando o usuário cria uma nova instância
  const handleInstanceCreated = (newInstance: WhatsAppInstance) => {
    console.log('New instance to be added:', newInstance);
    addInstance(newInstance);
    setInstanceFound(true);
    
    // Salvar o nome da instância no localStorage para uso futuro
    saveInstanceName(newInstance.instanceName);
    
    // If there's a QR code in the response, show it
    if (newInstance.qrcode) {
      handleViewQrCode(newInstance);
    }

    // Trigger a status check for all instances with a delay
    setTimeout(async () => {
      try {
        await checkAllInstancesStatus();
      } catch (error) {
        console.error("Error checking status after instance creation:", error);
      }
    }, 2000);
  };

  // Handler for when an instance is deleted
  const handleDeleteInstanceWrapper = (instanceId: string) => {
    console.log(`Instance deletion requested for ID: ${instanceId}`);
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    if (instanceToDelete) {
      handleDeleteInstance(instanceId, instanceToDelete.instanceName);
      
      // Se a instância excluída for a atual, limpar o nome salvo
      if (instanceToDelete.instanceName === instanceName) {
        clearInstanceName();
      }
    } else {
      console.error(`Instance with ID ${instanceId} not found for deletion`);
    }
  };

  console.log('Current instances in WhatsApp component:', instances);
  console.log('Instance found status:', instanceFound);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
        {isLoading ? (
          <LoadingState />
        ) : !instanceFound ? (
          // Show create form if no instance found
          <CreateInstanceForm 
            onInstanceCreated={handleInstanceCreated} 
            initialInstanceName={instanceName}
          />
        ) : (
          // Only show stats and instance list if instance found
          <>
            {/* Stats component */}
            <InstanceStats instances={instances} />
            
            {/* List of created instances */}
            <InstanceList 
              instances={instances} 
              onViewQrCode={handleViewQrCode} 
              onDelete={handleDeleteInstanceWrapper}
              onRestart={handleRestartInstance}
              onLogout={handleLogoutInstance}
              onSetPresence={handleSetPresence}
              onRefreshInstances={refreshInstances}
              isRefreshing={isRefreshing}
            />
          </>
        )}
        
        {/* QR Code Dialog */}
        <QrCodeDialog 
          open={qrDialogOpen} 
          onOpenChange={setQrDialogOpen}
          activeInstance={activeInstance}
          onStatusCheck={checkAllInstancesStatus}
        />
      </div>
    </Layout>
  );
};

export default WhatsApp;
