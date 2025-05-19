
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import InstanceStats from '@/components/whatsapp/InstanceStats';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';

const WhatsApp = () => {
  const { 
    instances, 
    isRefreshing,
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

  // Set up periodic status checks
  useEffect(() => {
    // Check status initially
    if (instances.length > 0) {
      checkAllInstancesStatus();
    }

    // Set up interval for periodic checks (every 60 seconds)
    const interval = setInterval(() => {
      if (instances.length > 0) {
        checkAllInstancesStatus();
      }
    }, 60000); // 60 seconds

    // Clean up interval when component unmounts
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [instances.length, checkAllInstancesStatus]);

  // Handler for when a new instance is created
  const handleInstanceCreated = async (newInstance: WhatsAppInstance) => {
    console.log('New instance to be added:', newInstance);
    addInstance(newInstance);
    
    // If there's a QR code in the response, show it
    if (newInstance.qrcode) {
      handleViewQrCode(newInstance);
    }

    // Trigger a status check for all instances
    await checkAllInstancesStatus();
  };

  // Handler for when an instance is deleted
  const handleDeleteInstanceWrapper = (instanceId: string) => {
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    if (instanceToDelete) {
      handleDeleteInstance(instanceId, instanceToDelete.instanceName);
    }
  };

  console.log('Current instances in WhatsApp component:', instances);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
        {/* Form to create a new instance */}
        <CreateInstanceForm onInstanceCreated={handleInstanceCreated} />
        
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
