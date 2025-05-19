
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchAllInstances } from '@/services/whatsAppService';
import { 
  loadInstancesFromLocalStorage,
  saveInstancesToLocalStorage
} from './instanceStorageUtils';
import { 
  checkInstanceStatus,
  mapServerInstancesToLocal
} from './instanceStatusUtils';
import { WhatsAppInstancesHookReturn } from './types';

/**
 * Hook for managing WhatsApp instances
 */
export const useWhatsAppInstances = (): WhatsAppInstancesHookReturn => {
  const { toast } = useToast();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
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
  }, []); 

  // Save instances to localStorage whenever they change
  useEffect(() => {
    if (currentUserId && instances.length > 0) {
      console.log('Saving instances to localStorage:', instances);
      saveInstancesToLocalStorage(instances, currentUserId);
    }
  }, [instances, currentUserId]);
  
  // Check connection status for all instances
  const checkAllInstancesStatus = useCallback(async () => {
    if (instances.length === 0) return;
    
    console.log(`Checking connection status for ${instances.length} instances`);
    
    try {
      const updatedInstances = await Promise.all(
        instances.map(async (instance) => checkInstanceStatus(instance))
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
    }
  }, [instances]);

  // Refresh instances from the server
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
        // Map server instances to local format
        const serverInstances = mapServerInstancesToLocal(response.instances, currentUserId);
        
        console.log("Mapped server instances:", serverInstances);
        
        // Find new instances that don't exist locally
        const localInstanceIds = new Set(instances.map(i => i.instanceId));
        const newServerInstances = serverInstances.filter(i => !localInstanceIds.has(i.instanceId));
        
        // Update existing instances with server data
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
        
        // Combine everything
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
      // Check status after updating the list
      await checkAllInstancesStatus();
    }
  };

  // Add a new instance
  const addInstance = (newInstance: WhatsAppInstance) => {
    console.log("New instance created, adding to instances list:", newInstance);
    
    // Check if instance with same ID already exists
    const existingIndex = instances.findIndex(inst => inst.instanceId === newInstance.instanceId);
    
    if (existingIndex >= 0) {
      // Update existing instance
      console.log(`Instance with ID ${newInstance.instanceId} already exists, updating it`);
      setInstances(prevInstances => 
        prevInstances.map((instance, index) => 
          index === existingIndex ? newInstance : instance
        )
      );
    } else {
      // Add new instance
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
