
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchSpecificInstance } from '@/services/whatsApp/instanceManagement';

// Key used for storing instance name in localStorage
export const WHATSAPP_INSTANCE_KEY = 'whatsapp_instance_name';

export const useWhatsAppInstance = (
  currentUserId: string,
  addInstance: (instance: WhatsAppInstance) => void
) => {
  const { toast } = useToast();
  // Get instance name from localStorage
  const [instanceName, setInstanceName] = useState(() => {
    if (currentUserId) {
      return localStorage.getItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`) || '';
    }
    return '';
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [instanceFound, setInstanceFound] = useState(false);

  // Function to fetch specific instance by name
  const fetchInstanceByName = async () => {
    // Skip if no instance name
    if (!instanceName.trim()) {
      return;
    }

    // Verificar se o usuário está autenticado
    if (!currentUserId) {
      console.log('Usuário não autenticado, pulando busca de instância');
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

  // Save instance name to localStorage
  const saveInstanceName = (name: string) => {
    if (currentUserId) {
      localStorage.setItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`, name);
      setInstanceName(name);
    }
  };

  // Clear instance name from localStorage
  const clearInstanceName = () => {
    if (currentUserId) {
      localStorage.removeItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`);
      setInstanceName('');
      setInstanceFound(false);
    }
  };

  // Run once when component mounts or currentUserId changes
  useEffect(() => {
    if (instanceName && currentUserId) {
      fetchInstanceByName();
    }
  }, [currentUserId]); // Only depend on userId changes

  return {
    instanceName,
    isLoading,
    instanceFound,
    setInstanceFound,
    fetchInstanceByName,
    saveInstanceName,
    clearInstanceName
  };
};
