
import { useState, useEffect } from 'react';
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

  // Add a new instance
  const addInstance = (newInstance: WhatsAppInstance) => {
    console.log("New instance created, adding to instances list:", newInstance);
    setInstances(prevInstances => [...prevInstances, newInstance]);
  };

  // Remove an instance
  const removeInstance = (instanceId: string) => {
    setInstances(prevInstances => {
      const filtered = prevInstances.filter(instance => instance.instanceId !== instanceId);
      console.log("Updated instances after deletion:", filtered);
      return filtered;
    });
  };

  // Update an instance
  const updateInstance = (updatedInstance: WhatsAppInstance) => {
    setInstances(prevInstances => 
      prevInstances.map(instance => 
        instance.instanceId === updatedInstance.instanceId 
          ? updatedInstance 
          : instance
      )
    );
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
