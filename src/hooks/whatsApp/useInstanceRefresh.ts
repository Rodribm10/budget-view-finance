
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
      
      if (response && response.instances && Array.isArray(response.instances)) {
        // Busca o nome da instância salvo para o usuário atual
        const savedInstanceName = localStorage.getItem(`whatsapp_instance_name_${currentUserId}`);
        console.log("Saved instance name for current user:", savedInstanceName);
        
        // Filtra as instâncias pelo nome criado pelo usuário
        const filteredInstances = savedInstanceName 
          ? response.instances.filter(instance => instance.instanceName === savedInstanceName)
          : response.instances;
          
        // Mapeia as instâncias do servidor para o formato correto com userId
        const serverInstances: WhatsAppInstance[] = filteredInstances
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
        
        console.log("Filtered server instances for this user:", serverInstances);
        
        if (serverInstances.length > 0) {
          setInstances(serverInstances);
          
          toast({
            title: "Sucesso",
            description: `${serverInstances.length} instância(s) encontrada(s) para este usuário`,
          });
        } else {
          // Clear instances if none found for this user
          setInstances([]);
          
          toast({
            title: "Aviso",
            description: "Nenhuma instância encontrada para este usuário",
          });
        }
      } else {
        // Handle empty or invalid response
        setInstances([]);
        
        toast({
          title: "Aviso",
          description: "Nenhuma instância encontrada no servidor",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar instâncias:", error);
      // Ensure we don't leave instances in an undefined state
      setInstances([]);
      
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
