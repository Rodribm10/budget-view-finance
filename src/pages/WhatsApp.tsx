
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import Layout from '@/components/layout/Layout';
import LoadingState from '@/components/whatsapp/LoadingState';
import WhatsAppHeader from '@/components/whatsapp/WhatsAppHeader';
import WhatsAppManager from '@/components/whatsapp/WhatsAppManager';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';
import { useWhatsAppInstance, WHATSAPP_INSTANCE_KEY } from '@/hooks/whatsApp/useWhatsAppInstance';
import { usePeriodicStatusCheck } from '@/hooks/whatsApp/usePeriodicStatusCheck';
import { useExistingInstanceCheck } from '@/hooks/whatsapp/useExistingInstanceCheck';
import { Button } from '@/components/ui/button';

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

  // Função para resetar o tour (apenas para debug)
  const resetTour = () => {
    sessionStorage.removeItem('onboarding_tour_shown');
    window.location.reload();
  };

  if (checkingExistingInstance || isLoading) {
    return (
      <Layout>
        <LoadingState message="Verificando suas instâncias..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <WhatsAppHeader 
          userEmail={userEmail}
          onRefresh={recheckInstance}
          isRefreshing={checkingExistingInstance}
        />
        
        {/* Botão temporário para debug do tour */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700 mb-2">Debug do Tour:</p>
            <Button 
              onClick={resetTour} 
              variant="outline" 
              size="sm"
              className="mr-2"
            >
              Resetar Tour
            </Button>
            <span className="text-xs text-gray-500">
              (Este botão só aparece em desenvolvimento)
            </span>
          </div>
        )}
        
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
    </Layout>
  );
};

export default WhatsApp;
