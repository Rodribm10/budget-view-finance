
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchAllInstances } from '@/services/whatsApp/instanceManagement';

export const useInstanceRefresh = (
  instances: WhatsAppInstance[],
  setInstances: React.Dispatch<React.SetStateAction<WhatsAppInstance[]>>,
  currentUserId: string,
  setIsRefreshing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

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

  return { refreshInstances };
};
