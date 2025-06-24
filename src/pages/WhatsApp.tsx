
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import LoadingState from '@/components/whatsapp/LoadingState';
import WhatsAppHeader from '@/components/whatsapp/WhatsAppHeader';
import WhatsAppManager from '@/components/whatsapp/WhatsAppManager';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';
import { useWhatsAppInstance, WHATSAPP_INSTANCE_KEY } from '@/hooks/whatsApp/useWhatsAppInstance';
import { usePeriodicStatusCheck } from '@/hooks/whatsApp/usePeriodicStatusCheck';
import { useExistingInstanceCheck } from '@/hooks/whatsapp/useExistingInstanceCheck';

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
    handleDisconnectInstance,
    handleSetPresence,
    handleDeleteInstance,
    handleViewQrCode
  } = useWhatsAppActions(updateInstance, removeInstance, checkAllInstancesStatus);
  
  const {
    instanceName,
    isLoading,
    instanceFound,
    setInstanceFound,
    fetchInstanceByName,
    saveInstanceName,
    clearInstanceName
  } = useWhatsAppInstance(currentUserId, addInstance);
  
  const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase();

  const {
    hasExistingInstance,
    checkingExistingInstance,
    existingInstanceData,
    recheckInstance
  } = useExistingInstanceCheck(userEmail);
  
  usePeriodicStatusCheck(instances.length, checkAllInstancesStatus);

  const handleInstanceCreated = async (newInstance: WhatsAppInstance) => {
    console.log('🎉 [WHATSAPP_PAGE] Nova instância criada, acionando re-verificação.');
    addInstance(newInstance);
    setInstanceFound(true);
    saveInstanceName(newInstance.instanceName);
    
    if (newInstance.qrcode) {
      handleViewQrCode(newInstance);
    }

    setTimeout(() => {
      recheckInstance();
      checkAllInstancesStatus();
    }, 2000);
  };

  const handleDeleteInstanceWrapper = (instanceId: string) => {
    console.log(`🗑️ [WHATSAPP] Excluindo instância ID: ${instanceId}`);
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    if (instanceToDelete) {
      handleDeleteInstance(instanceId, instanceToDelete.instanceName);
      
      if (instanceToDelete.instanceName === instanceName) {
        clearInstanceName();
      }
    }
  };

  if (checkingExistingInstance || isLoading) {
    return (
      <LoadingState message="Verificando suas instâncias..." />
    );
  }

  return (
    <div className="space-y-6">
      <WhatsAppHeader 
        userEmail={userEmail}
        onRefresh={recheckInstance}
        isRefreshing={checkingExistingInstance}
      />
      
      <WhatsAppManager
        hasExistingInstance={hasExistingInstance}
        existingInstanceData={existingInstanceData}
        instances={instances}
        isRefreshing={isRefreshing}
        activeInstance={activeInstance}
        qrDialogOpen={qrDialogOpen}
        onInstanceCreated={handleInstanceCreated}
        onViewQrCode={handleViewQrCode}
        onDelete={handleDeleteInstanceWrapper}
        onRestart={handleRestartInstance}
        onLogout={handleLogoutInstance}
        onDisconnect={handleDisconnectInstance}
        onSetPresence={handleSetPresence}
        onRefreshInstances={refreshInstances}
        onStatusCheck={checkAllInstancesStatus}
        setQrDialogOpen={setQrDialogOpen}
      />
    </div>
  );
};

export default WhatsApp;
