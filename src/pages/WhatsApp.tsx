
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { 
  fetchQrCode, 
  fetchConnectionState, 
  saveInstancesToLocalStorage, 
  loadInstancesFromLocalStorage,
  fetchAllInstances,
  restartInstance,
  logoutInstance,
  deleteInstance,
  setInstancePresence
} from '@/services/whatsAppService';
import CreateInstanceForm from '@/components/whatsapp/CreateInstanceForm';
import InstanceList from '@/components/whatsapp/InstanceList';
import QrCodeDialog from '@/components/whatsapp/QrCodeDialog';

const WhatsApp = () => {
  const { toast } = useToast();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [activeInstance, setActiveInstance] = useState<WhatsAppInstance | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get current user ID and load instances on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId') || '';
    console.log("Current userId from localStorage:", userId);
    setCurrentUserId(userId);
    
    if (userId) {
      const userInstances = loadInstancesFromLocalStorage(userId);
      console.log('Loaded user instances:', userInstances);
      setInstances(userInstances);
    }
  }, []); // Only run once on mount

  // Save instances to localStorage whenever they change
  useEffect(() => {
    if (currentUserId) {
      console.log('Saving instances to localStorage:', instances);
      saveInstancesToLocalStorage(instances, currentUserId);
    }
  }, [instances, currentUserId]);

  // Handle user logout event to clear instances display
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'autenticado' && e.newValue === null) {
        // User logged out, clear instances from display
        setInstances([]);
        setCurrentUserId('');
      } else if (e.key === 'userId') {
        // User ID changed (new login)
        const newUserId = localStorage.getItem('userId') || '';
        setCurrentUserId(newUserId);
        
        // Load instances for the new user
        if (newUserId) {
          const userInstances = loadInstancesFromLocalStorage(newUserId);
          setInstances(userInstances);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

    setStatusCheckInterval(interval);

    // Clean up interval when component unmounts
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [instances.length]);

  // Function to check connection status for all instances
  const checkAllInstancesStatus = async () => {
    try {
      const updatedInstances = await Promise.all(
        instances.map(async (instance) => {
          try {
            const state = await fetchConnectionState(instance.instanceName);
            return { ...instance, connectionState: state };
          } catch (error) {
            console.error(`Error checking status for ${instance.instanceName}:`, error);
            return { ...instance, connectionState: 'closed' as const };
          }
        })
      );
      setInstances(updatedInstances);
    } catch (error) {
      console.error("Error checking instances status:", error);
    }
  };

  // Handler para atualizar a lista de instâncias do servidor
  const handleRefreshInstances = async () => {
    if (!currentUserId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para atualizar as instâncias",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      const response = await fetchAllInstances();
      console.log("Fetched instances from server:", response);
      
      if (response.instances && Array.isArray(response.instances)) {
        // Filtra instâncias para mostrar apenas as do usuário atual
        // E mapeia para o formato correto com userId
        const serverInstances: WhatsAppInstance[] = response.instances
          .filter(serverInstance => {
            // Implemente sua lógica de filtro para o usuário atual (se necessário)
            // Por padrão, vamos assumir que todas as instâncias são do usuário atual
            return true;
          })
          .map(serverInstance => ({
            instanceName: serverInstance.instanceName,
            instanceId: serverInstance.instanceName,
            phoneNumber: serverInstance.number || 'Desconhecido',
            userId: currentUserId,
            connectionState: serverInstance.state || 'closed',
            status: serverInstance.status || 'unknown'
          }));
        
        // Mesclando instâncias do servidor com as locais (para não perder dados locais)
        const localInstanceIds = new Set(instances.map(i => i.instanceId));
        const newInstances = [
          ...instances,
          ...serverInstances.filter(i => !localInstanceIds.has(i.instanceId))
        ];
        
        setInstances(newInstances);
        toast({
          title: "Sucesso",
          description: `${serverInstances.length} instâncias encontradas no servidor`,
        });
      } else {
        toast({
          title: "Aviso",
          description: "Nenhuma instância encontrada no servidor",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar instâncias:", error);
      toast({
        title: "Erro",
        description: "Falha ao buscar instâncias do servidor",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
      // Verificar status após atualizar a lista
      checkAllInstancesStatus();
    }
  };

  // Handler for quando uma instância é reiniciada
  const handleRestartInstance = async (instance: WhatsAppInstance) => {
    try {
      await restartInstance(instance.instanceName);
      
      // Atualiza o estado da instância para "connecting"
      setInstances(prev => 
        prev.map(i => 
          i.instanceId === instance.instanceId 
            ? { ...i, connectionState: 'connecting' as const } 
            : i
        )
      );
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} reiniciada com sucesso`
      });
      
      // Verifica o status após um breve delay para dar tempo de atualizar
      setTimeout(() => checkAllInstancesStatus(), 3000);
      
    } catch (error) {
      console.error(`Error restarting instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao reiniciar a instância ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };
  
  // Handler for quando uma instância é desconectada
  const handleLogoutInstance = async (instance: WhatsAppInstance) => {
    try {
      await logoutInstance(instance.instanceName);
      
      // Atualiza o estado da instância para "closed"
      setInstances(prev => 
        prev.map(i => 
          i.instanceId === instance.instanceId 
            ? { ...i, connectionState: 'closed' as const } 
            : i
        )
      );
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} desconectada com sucesso`
      });
      
    } catch (error) {
      console.error(`Error logging out instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao desconectar a instância ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };
  
  // Handler for quando a presença é alterada
  const handleSetPresence = async (instance: WhatsAppInstance, presence: 'online' | 'offline') => {
    try {
      await setInstancePresence(instance.instanceName, presence);
      
      toast({
        title: "Sucesso",
        description: `Instância ${instance.instanceName} agora está ${presence === 'online' ? 'Online' : 'Offline'}`
      });
      
      // Não precisamos alterar o estado da instância aqui, pois isso não afeta o connectionState
      
    } catch (error) {
      console.error(`Error setting presence to ${presence} for instance ${instance.instanceName}:`, error);
      toast({
        title: "Erro",
        description: `Falha ao definir presença ${presence} para ${instance.instanceName}`,
        variant: "destructive",
      });
    }
  };

  // Handler for when a new instance is created
  const handleInstanceCreated = async (newInstance: WhatsAppInstance) => {
    console.log("New instance created, adding to instances list:", newInstance);
    
    // Add new instance to the list - use the function form to guarantee correct state update
    setInstances(prevInstances => [...prevInstances, newInstance]);
    
    // If there's a QR code in the response, show it
    if (newInstance.qrcode) {
      setActiveInstance(newInstance);
      setQrDialogOpen(true);
    }

    // Trigger a status check for all instances
    await checkAllInstancesStatus();
  };

  // Handler for when QR code dialog is requested
  const handleViewQrCode = async (instance: WhatsAppInstance) => {
    setActiveInstance(instance);
    setQrDialogOpen(true);

    try {
      const data = await fetchQrCode(instance.instanceName);
      console.log('QR Code API response:', data);
      
      // If the fetchQrCode call was successful, QrCodeDialog will handle showing the QR code
    } catch (error) {
      console.error("Error initiating QR code fetch:", error);
      toast({
        title: "Erro ao obter QR Code",
        description: "Falha ao iniciar obtenção de QR Code. Tente novamente.",
        variant: "destructive",
      });
      setQrDialogOpen(false);
    }
  };

  // Handler for when an instance is deleted
  const handleDeleteInstance = async (instanceId: string) => {
    console.log(`Deleting instance with ID: ${instanceId}`);
    
    // Find the instance before deleting it
    const instanceToDelete = instances.find(i => i.instanceId === instanceId);
    
    if (!instanceToDelete) {
      toast({
        title: "Erro",
        description: "Instância não encontrada",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Call API to delete instance
      await deleteInstance(instanceToDelete.instanceName);
      
      // Remove from local state if API call was successful
      setInstances(prevInstances => {
        const filtered = prevInstances.filter(instance => instance.instanceId !== instanceId);
        console.log("Updated instances after deletion:", filtered);
        return filtered;
      });
      
      // If we're viewing QR code for this instance, close the dialog
      if (activeInstance?.instanceId === instanceId) {
        setQrDialogOpen(false);
      }
      
      toast({
        title: "Instância removida",
        description: "A instância do WhatsApp foi removida com sucesso.",
      });
    } catch (error) {
      console.error(`Error deleting instance with ID ${instanceId}:`, error);
      toast({
        title: "Erro",
        description: "Falha ao excluir a instância. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Conectar WhatsApp</h1>
        </div>
        
        {/* Form to create a new instance */}
        <CreateInstanceForm onInstanceCreated={handleInstanceCreated} />
        
        {/* List of created instances */}
        <InstanceList 
          instances={instances} 
          onViewQrCode={handleViewQrCode} 
          onDelete={handleDeleteInstance}
          onRestart={handleRestartInstance}
          onLogout={handleLogoutInstance}
          onSetPresence={handleSetPresence}
          onRefreshInstances={handleRefreshInstances}
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
