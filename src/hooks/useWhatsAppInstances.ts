
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { 
  saveInstancesToLocalStorage, 
  loadInstancesFromLocalStorage,
  fetchAllInstances,
  fetchConnectionState
} from '@/services/whatsAppService';

export const useWhatsAppInstances = () => {
  const { toast } = useToast();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

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
    if (currentUserId && instances.length > 0) {
      console.log('Saving instances to localStorage:', instances);
      saveInstancesToLocalStorage(instances, currentUserId);
    }
  }, [instances, currentUserId]);
  
  // Function to check connection status for all instances
  const checkAllInstancesStatus = useCallback(async () => {
    if (instances.length === 0 || isCheckingStatus) return;
    
    console.log(`Checking connection status for ${instances.length} instances`);
    setIsCheckingStatus(true);
    
    try {
      const updatedInstances = await Promise.all(
        instances.map(async (instance) => {
          try {
            console.log(`Checking status for ${instance.instanceName}`);
            const state = await fetchConnectionState(instance.instanceName);
            console.log(`Status for ${instance.instanceName}: ${state}`);
            
            // Only update connectionState if it's different
            if (instance.connectionState !== state) {
              // Ensure the state is one of the valid values or treat as 'closed'
              let validState: 'open' | 'closed' | 'connecting';
              if (state === 'open' || state === 'connecting') {
                validState = state;
              } else {
                validState = 'closed';
              }
              
              return { 
                ...instance, 
                connectionState: validState,
                status: state === 'open' ? 'connected' : 
                       state === 'connecting' ? 'connecting' : 'disconnected'
              };
            }
            return instance;
          } catch (error) {
            console.error(`Error checking status for ${instance.instanceName}:`, error);
            
            // If the instance doesn't exist on the server, mark it as closed
            if (error instanceof Error && error.message.includes("does not exist")) {
              return { 
                ...instance, 
                connectionState: 'closed' as const, 
                status: 'disconnected' 
              };
            }
            
            // Keep the current state in case of other errors
            return instance;
          }
        })
      );
      
      // Only update state if there are actual changes
      const hasChanges = JSON.stringify(updatedInstances) !== JSON.stringify(instances);
      if (hasChanges) {
        console.log('Updated instances after status check:', updatedInstances);
        setInstances(updatedInstances);
      } else {
        console.log('No changes in instance status');
      }
    } catch (error) {
      console.error("Error checking instances status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [instances, isCheckingStatus]);

  // Handler para atualizar a lista de instâncias do servidor
  const refreshInstances = async () => {
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
      console.log("Fetching instances from server...");
      const response = await fetchAllInstances();
      console.log("Fetched instances from server:", response);
      
      if (response.instances && Array.isArray(response.instances)) {
        // Mapeia as instâncias do servidor para o formato correto com userId
        const serverInstances: WhatsAppInstance[] = response.instances
          .map(serverInstance => {
            // Ensure we convert server state to valid connectionState
            let connectionState: 'open' | 'closed' | 'connecting';
            const state = serverInstance.state || 'closed';
            
            if (state === 'open' || state === 'connecting') {
              connectionState = state;
            } else {
              connectionState = 'closed';
            }
            
            return {
              instanceName: serverInstance.instanceName,
              instanceId: serverInstance.instanceName, // Using instanceName as the ID for consistency
              phoneNumber: serverInstance.number || 'Desconhecido',
              userId: currentUserId,
              connectionState: connectionState,
              status: connectionState === 'open' ? 'connected' : 
                     connectionState === 'connecting' ? 'connecting' : 'disconnected'
            };
          });
        
        console.log("Mapped server instances:", serverInstances);
        
        // Identifica instâncias novas que não existem localmente
        const localInstanceIds = new Set(instances.map(i => i.instanceId));
        const newServerInstances = serverInstances.filter(i => !localInstanceIds.has(i.instanceId));
        
        // Atualiza instâncias existentes com dados do servidor
        const updatedExistingInstances = instances.map(localInstance => {
          const serverMatch = serverInstances.find(si => si.instanceId === localInstance.instanceId);
          if (serverMatch) {
            return {
              ...localInstance,
              connectionState: serverMatch.connectionState,
              status: serverMatch.status
            };
          }
          return localInstance;
        });
        
        // Combina tudo
        const allInstances = [...updatedExistingInstances, ...newServerInstances];
        
        console.log("Combined instances after refresh:", allInstances);
        setInstances(allInstances);
        
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
    }
  };

  // Add a new instance
  const addInstance = (newInstance: WhatsAppInstance) => {
    console.log("New instance created, adding to instances list:", newInstance);
    
    // Verifica se já existe uma instância com o mesmo ID
    const existingIndex = instances.findIndex(inst => inst.instanceId === newInstance.instanceId);
    
    if (existingIndex >= 0) {
      // Atualiza a instância existente
      console.log(`Instance with ID ${newInstance.instanceId} already exists, updating it`);
      setInstances(prevInstances => 
        prevInstances.map((instance, index) => 
          index === existingIndex ? newInstance : instance
        )
      );
    } else {
      // Adiciona nova instância
      setInstances(prevInstances => [...prevInstances, newInstance]);
    }
  };

  // Remove an instance
  const removeInstance = (instanceId: string) => {
    console.log(`Removing instance with ID: ${instanceId}`);
    setInstances(prevInstances => {
      const filtered = prevInstances.filter(instance => instance.instanceId !== instanceId);
      console.log("Updated instances after deletion:", filtered);
      return filtered;
    });
  };

  // Update an instance
  const updateInstance = (updatedInstance: WhatsAppInstance) => {
    console.log(`Updating instance: ${updatedInstance.instanceName}`, updatedInstance);
    setInstances(prevInstances => {
      const newInstances = prevInstances.map(instance => 
        instance.instanceId === updatedInstance.instanceId 
          ? updatedInstance 
          : instance
      );
      
      console.log("Updated instances:", newInstances);
      return newInstances;
    });
  };

  return {
    instances,
    isRefreshing,
    currentUserId,
    addInstance,
    removeInstance,
    updateInstance,
    refreshInstances,
    checkAllInstancesStatus
  };
};
