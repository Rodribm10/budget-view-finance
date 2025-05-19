
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { 
  fetchQrCode, 
  fetchConnectionState, 
  saveInstancesToLocalStorage, 
  loadInstancesFromLocalStorage 
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
  const handleDeleteInstance = (instanceId: string) => {
    console.log(`Deleting instance with ID: ${instanceId}`);
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
