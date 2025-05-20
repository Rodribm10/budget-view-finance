
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import InstanceStats from '@/components/whatsapp/InstanceStats';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useWhatsAppActions } from '@/hooks/useWhatsAppActions';
import { useToast } from '@/hooks/use-toast';
import { fetchSpecificInstance } from '@/services/whatsApp/instanceManagement';

const WHATSAPP_INSTANCE_KEY = 'whatsapp_instance_name';

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
  
  // Obter o nome da instância salvo no localStorage
  const [instanceName, setInstanceName] = useState(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return localStorage.getItem(`${WHATSAPP_INSTANCE_KEY}_${userId}`) || '';
    }
    return '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [instanceFound, setInstanceFound] = useState(false);
  const currentUserId = localStorage.getItem('userId') || '';

  // Function to fetch specific instance by name
  const fetchInstanceByName = async () => {
    // Skip if user not logged in or no instance name
    if (!currentUserId || !instanceName.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`Fetching specific instance: ${instanceName}`);
      const data = await fetchSpecificInstance(instanceName);
      console.log('Fetch specific instance response:', data);
      
      if (data && data.instance) {
        // Instance found, create or update instance object
        const foundInstance: WhatsAppInstance = {
          instanceName,
          instanceId: instanceName,
          phoneNumber: data.instance.number || '',
          userId: currentUserId,
          status: data.instance.status || 'unknown',
          connectionState: data.instance.state || 'closed',
          qrcode: data.qrcode?.base64 || null
        };
        
        console.log('Found instance:', foundInstance);
        addInstance(foundInstance);
        setInstanceFound(true);
        toast({
          title: "Instância encontrada",
          description: `A instância ${instanceName} foi localizada no servidor.`
        });
      } else {
        setInstanceFound(false);
        console.log(`Instance ${instanceName} not found`);
      }
    } catch (error) {
      console.error('Error fetching specific instance:', error);
      setInstanceFound(false);
      toast({
        title: "Instância não encontrada",
        description: "Não foi possível encontrar a instância com este nome.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  // Fetch the specific instance when the component mounts (não a cada digitação)
  useEffect(() => {
    if (currentUserId) {
      fetchInstanceByName();
    } else {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para ver suas instâncias do WhatsApp.",
        variant: "destructive"
      });
    }
  }, [currentUserId]);

  // Handler para quando o usuário cria uma nova instância
  const handleInstanceCreated = (newInstance: WhatsAppInstance) => {
    console.log('New instance to be added:', newInstance);
    addInstance(newInstance);
    setInstanceFound(true);
    
    // Salvar o nome da instância no localStorage para uso futuro
    if (currentUserId) {
      localStorage.setItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`, newInstance.instanceName);
      setInstanceName(newInstance.instanceName);
    }
    
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
      
      // Se a instância excluída for a atual, limpar o nome salvo
      if (instanceToDelete.instanceName === instanceName && currentUserId) {
        localStorage.removeItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`);
        setInstanceName('');
        setInstanceFound(false);
      }
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
  console.log('Instance found status:', instanceFound);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-3">Buscando instância...</p>
          </div>
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
