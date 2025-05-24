
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchSpecificInstance } from '@/services/whatsApp/instanceManagement';
import { getUserWhatsAppInstance } from '@/services/whatsAppInstanceService';

// Key used for storing instance name in localStorage
export const WHATSAPP_INSTANCE_KEY = 'whatsapp_instance_name';

export const useWhatsAppInstance = (
  currentUserId: string,
  addInstance: (instance: WhatsAppInstance) => void
) => {
  const { toast } = useToast();
  const userEmail = localStorage.getItem('userEmail') || '';
  
  // Get instance name from database/localStorage
  const [instanceName, setInstanceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instanceFound, setInstanceFound] = useState(false);
  const [shouldShowToast, setShouldShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', variant: '' as any });

  // Load instance name from database on component mount
  useEffect(() => {
    const loadInstanceFromDatabase = async () => {
      if (!userEmail || !currentUserId) return;

      try {
        console.log('Carregando instância do banco de dados para:', userEmail);
        const instanceData = await getUserWhatsAppInstance(userEmail);
        
        if (instanceData && instanceData.instancia_zap) {
          console.log('Instância encontrada no banco:', instanceData.instancia_zap);
          setInstanceName(instanceData.instancia_zap);
          setInstanceFound(true);
          
          // Also save to localStorage for consistency
          localStorage.setItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`, instanceData.instancia_zap);
        } else {
          console.log('Nenhuma instância encontrada no banco');
          setInstanceFound(false);
          
          // Clear localStorage if no instance in database
          localStorage.removeItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`);
        }
      } catch (error) {
        console.error('Erro ao carregar instância do banco:', error);
        setInstanceFound(false);
      }
    };

    loadInstanceFromDatabase();
  }, [userEmail, currentUserId]);

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
      console.log(`Buscando instância específica: ${instanceName}`);
      const data = await fetchSpecificInstance(instanceName);
      console.log('Resposta da busca de instância específica:', data);
      
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
        
        console.log('Instância encontrada:', foundInstance);
        addInstance(foundInstance);
        setInstanceFound(true);
        
        // Set toast data instead of calling toast directly
        setToastMessage({
          title: "Instância encontrada",
          description: `A instância ${instanceName} foi localizada no servidor.`,
          variant: "default"
        });
        setShouldShowToast(true);
      } else {
        setInstanceFound(false);
        console.log(`Instância ${instanceName} não encontrada`);
      }
    } catch (error) {
      console.error('Erro ao buscar instância específica:', error);
      setInstanceFound(false);
      
      // Set toast data instead of calling toast directly
      setToastMessage({
        title: "Instância não encontrada",
        description: "Não foi possível encontrar a instância com este nome.",
        variant: "destructive"
      });
      setShouldShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast in a separate useEffect to avoid re-render loops
  useEffect(() => {
    if (shouldShowToast) {
      toast({
        title: toastMessage.title,
        description: toastMessage.description,
        variant: toastMessage.variant
      });
      setShouldShowToast(false);
    }
  }, [shouldShowToast, toastMessage, toast]);

  // Save instance name to localStorage and database
  const saveInstanceName = (name: string) => {
    if (currentUserId) {
      localStorage.setItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`, name);
      setInstanceName(name);
    }
  };

  // Clear instance name from localStorage and database
  const clearInstanceName = () => {
    if (currentUserId) {
      localStorage.removeItem(`${WHATSAPP_INSTANCE_KEY}_${currentUserId}`);
      setInstanceName('');
      setInstanceFound(false);
    }
  };

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
