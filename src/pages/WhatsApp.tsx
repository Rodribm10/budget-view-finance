
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
import { useExistingInstanceCheck } from '@/hooks/whatsapp/useExistingInstanceCheck';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

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

  // Usar o hook centralizado para verificação de instância existente
  const {
    hasExistingInstance,
    checkingExistingInstance,
    existingInstanceData,
    setHasExistingInstance,
    setExistingInstanceData
  } = useExistingInstanceCheck(userEmail);
  
  usePeriodicStatusCheck(instances.length, checkAllInstancesStatus);

  const handleInstanceCreated = (newInstance: WhatsAppInstance) => {
    console.log('🎉 [WHATSAPP] Nova instância criada:', newInstance);
    addInstance(newInstance);
    setInstanceFound(true);
    setHasExistingInstance(true);
    setExistingInstanceData(newInstance);
    
    saveInstanceName(newInstance.instanceName);
    
    if (newInstance.qrcode) {
      handleViewQrCode(newInstance);
    }

    setTimeout(async () => {
      try {
        await checkAllInstancesStatus();
      } catch (error) {
        console.error("Error checking status after instance creation:", error);
      }
    }, 2000);
  };

  const handleDeleteInstanceWrapper = (instanceId: string) => {
    console.log(`🗑️ [WHATSAPP] Solicitação de exclusão da instância ID: ${instanceId}`);
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    if (instanceToDelete) {
      handleDeleteInstance(instanceId, instanceToDelete.instanceName);
      
      if (instanceToDelete.instanceName === instanceName) {
        clearInstanceName();
        setHasExistingInstance(false);
        setExistingInstanceData(null);
      }
    } else {
      console.error(`❌ [WHATSAPP] Instância com ID ${instanceId} não encontrada para exclusão`);
    }
  };

  const hasInstances = Array.isArray(instances) && instances.length > 0;

  // Mostrar loading enquanto verifica instância existente
  if (checkingExistingInstance || isLoading) {
    return (
      <Layout>
        <LoadingState message="Verificando suas instâncias..." />
      </Layout>
    );
  }

  console.log('🔍 [WHATSAPP] Estado atual da verificação:', {
    userEmail,
    hasExistingInstance,
    existingInstanceData,
    checkingExistingInstance
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
            {userEmail && (
              <p className="text-sm text-muted-foreground mt-1">
                Mostrando instâncias para: <strong>{userEmail}</strong>
              </p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={refreshInstances}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar Lista'}
          </Button>
        </div>
        
        {/* Mostra formulário APENAS se NÃO tiver instância conectada */}
        {!hasExistingInstance && (
          <CreateInstanceForm 
            onInstanceCreated={handleInstanceCreated} 
            initialInstanceName={instanceName}
          />
        )}
        
        {/* Mensagem informativa quando já possui instância conectada */}
        {hasExistingInstance && existingInstanceData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  WhatsApp Conectado
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Você já possui uma instância do WhatsApp conectada: <strong>{existingInstanceData.instancia_zap}</strong></p>
                  <p>Status: <strong>{existingInstanceData.status_instancia}</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {hasInstances && <InstanceStats instances={instances} />}
        
        <InstanceList 
          instances={instances} 
          onViewQrCode={handleViewQrCode} 
          onDelete={handleDeleteInstanceWrapper}
          onRestart={handleRestartInstance}
          onLogout={handleLogoutInstance}
          onDisconnect={handleDisconnectInstance}
          onSetPresence={handleSetPresence}
          onRefreshInstances={refreshInstances}
          isRefreshing={isRefreshing}
        />
        
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
