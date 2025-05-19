
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  CreateInstanceForm,
  InstanceList,
  InstanceStats,
  QrCodeDialog
} from '@/components/whatsapp';
import { Button } from '@/components/ui/button';
import UsersDialog from '@/components/usuarios/UsersDialog';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';

const WhatsApp = () => {
  const { 
    instances, 
    isRefreshing, 
    currentUserId,
    addInstance, 
    removeInstance, 
    updateInstance, 
    refreshInstances,
    checkAllInstancesStatus
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

  // Poll for status updates every 30 seconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    const startPolling = () => {
      interval = setInterval(() => {
        console.log("Polling for WhatsApp instance status updates");
        checkAllInstancesStatus();
      }, 30000); // Check every 30 seconds
    };

    // Start polling
    startPolling();
    
    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [checkAllInstancesStatus]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">WhatsApp Instances</h1>
          <div className="flex gap-2 items-center">
            <UsersDialog />
            <Button 
              onClick={refreshInstances}
              disabled={isRefreshing}
              variant="outline"
            >
              {isRefreshing ? 'Atualizando...' : 'Atualizar Instâncias'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <CreateInstanceForm onInstanceCreated={addInstance} />
            <div className="mt-8">
              <InstanceList 
                instances={instances}
                onRestartInstance={handleRestartInstance}
                onLogoutInstance={handleLogoutInstance} 
                onSetPresence={handleSetPresence}
                onDeleteInstance={handleDeleteInstance}
                onViewQrCode={handleViewQrCode}
                onRefreshInstances={refreshInstances}
                isRefreshing={isRefreshing}
              />
            </div>
          </div>
          <div>
            <InstanceStats instances={instances} />
          </div>
        </div>

        {activeInstance && (
          <QrCodeDialog 
            open={qrDialogOpen} 
            setOpen={setQrDialogOpen} 
            instanceName={activeInstance.instanceName}
            phoneNumber={activeInstance.phoneNumber}
            onStatusCheck={checkAllInstancesStatus}
          />
        )}
      </div>
    </Layout>
  );
};

export default WhatsApp;
