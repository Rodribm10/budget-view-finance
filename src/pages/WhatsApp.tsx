
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import InstanceStats from '@/components/whatsapp/InstanceStats';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';
import { useToast } from '@/hooks/use-toast';

const WhatsApp = () => {
  const { toast } = useToast();
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
    console.log("Setting up periodic status checks, current instances:", instances.length);
    
    // Check status initially after a short delay to prevent immediate execution
    let initialCheck: NodeJS.Timeout;
    if (instances.length > 0) {
      initialCheck = setTimeout(() => {
        console.log("Running initial status check");
        checkAllInstancesStatus();
      }, 1000);
    }

    // Set up interval for periodic checks (every 30 seconds)
    const interval = setInterval(() => {
      if (instances.length > 0) {
        console.log("Running periodic status check");
        checkAllInstancesStatus();
      }
    }, 30000); // 30 seconds

    // Clean up interval and timeout when component unmounts
    return () => {
      clearInterval(interval);
      if (initialCheck) {
        clearTimeout(initialCheck);
      }
    };
  }, [instances.length, checkAllInstancesStatus]);

  // Run refresh instances on initial load to get server instances
  useEffect(() => {
    // Only run on first render
    const initialLoad = async () => {
      if (instances.length === 0) {
        try {
          await refreshInstances();
        } catch (error) {
          console.error("Error on initial instance refresh:", error);
        }
      }
    };
    
    initialLoad();
    // This effect should only run once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for when a new instance is created
  const handleInstanceCreated = async (newInstance: WhatsAppInstance) => {
    console.log('New instance to be added:', newInstance);
    addInstance(newInstance);
    
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
        toast({
          title: "Aviso",
          description: "Instância criada, mas não foi possível verificar o status. Tente atualizar a lista manualmente.",
          variant: "default",
        });
      }
    }, 2000);
  };

  // Handler for when an instance is deleted
  const handleDeleteInstanceWrapper = (instanceId: string) => {
    console.log(`Instance deletion requested for ID: ${instanceId}`);
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    if (instanceToDelete) {
      handleDeleteInstance(instanceId, instanceToDelete.instanceName);
    } else {
      console.error(`Instance with ID ${instanceId} not found for deletion`);
      toast({
        title: "Erro",
        description: "Instância não encontrada para exclusão",
        variant: "destructive",
      });
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
