
import { WhatsAppInstance } from '@/types/whatsAppTypes';

const SERVER_URL = "evolutionapi2.innova1001.com.br";
const API_KEY = "beeb77fbd7f48f91db2cd539a573c130";

// Local storage key
const STORAGE_KEY = 'whatsappInstances';

export const createWhatsAppInstance = async (
  instanceName: string, 
  phoneNumber: string
): Promise<any> => {
  const response = await fetch(`https://${SERVER_URL}/instance/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: JSON.stringify({
      instanceName: instanceName,
      number: phoneNumber,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS"
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao criar instância');
  }

  return response.json();
};

export const fetchQrCode = async (instanceName: string): Promise<any> => {
  const response = await fetch(`https://${SERVER_URL}/instance/connect/${encodeURIComponent(instanceName)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao obter QR Code');
  }

  return response.json();
};

export const fetchConnectionState = async (instanceName: string): Promise<'open' | 'closed' | 'connecting'> => {
  try {
    const response = await fetch(`https://${SERVER_URL}/instance/connectionState/${encodeURIComponent(instanceName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      return 'closed';
    }

    const data = await response.json();
    return data.instance?.state || 'closed';
  } catch (error) {
    console.error("Error fetching connection state:", error);
    return 'closed';
  }
};

// Nova função para listar todas as instâncias
export const fetchAllInstances = async (): Promise<any> => {
  try {
    const response = await fetch(`https://${SERVER_URL}/fetch-instances`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar instâncias');
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching all instances:", error);
    throw error;
  }
};

// Função para reiniciar uma instância
export const restartInstance = async (instanceName: string): Promise<any> => {
  try {
    const response = await fetch(`https://${SERVER_URL}/instance/restart/${encodeURIComponent(instanceName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao reiniciar instância');
    }

    return response.json();
  } catch (error) {
    console.error(`Error restarting instance ${instanceName}:`, error);
    throw error;
  }
};

// Função para desconectar (logout) uma instância
export const logoutInstance = async (instanceName: string): Promise<any> => {
  try {
    const response = await fetch(`https://${SERVER_URL}/instance/logout/${encodeURIComponent(instanceName)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao desconectar instância');
    }

    return response.json();
  } catch (error) {
    console.error(`Error logging out instance ${instanceName}:`, error);
    throw error;
  }
};

// Função para excluir uma instância
export const deleteInstance = async (instanceName: string): Promise<any> => {
  try {
    const response = await fetch(`https://${SERVER_URL}/instance/${encodeURIComponent(instanceName)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir instância');
    }

    return response.json();
  } catch (error) {
    console.error(`Error deleting instance ${instanceName}:`, error);
    throw error;
  }
};

// Função para definir presença online/offline
export const setInstancePresence = async (instanceName: string, presence: 'online' | 'offline'): Promise<any> => {
  try {
    const response = await fetch(`https://${SERVER_URL}/instance/setPresence/${encodeURIComponent(instanceName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      },
      body: JSON.stringify({ presence })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro ao definir presença para ${presence}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error setting presence to ${presence} for instance ${instanceName}:`, error);
    throw error;
  }
};

export const saveInstancesToLocalStorage = (
  instances: WhatsAppInstance[], 
  currentUserId: string
): void => {
  try {
    // Get existing instances from localStorage
    const savedInstancesStr = localStorage.getItem(STORAGE_KEY);
    let allInstances: WhatsAppInstance[] = [];
    
    if (savedInstancesStr) {
      // Parse saved instances
      const savedInstances = JSON.parse(savedInstancesStr);
      
      // If it's an array, filter out current user's old instances
      if (Array.isArray(savedInstances)) {
        allInstances = savedInstances.filter(
          (instance: WhatsAppInstance) => instance.userId !== currentUserId
        );
      }
    }
    
    // Add current user's instances to the array
    const updatedInstances = [...allInstances, ...instances];
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInstances));
    console.log('All WhatsApp instances saved to localStorage:', updatedInstances);
  } catch (error) {
    console.error('Error saving instances to localStorage:', error);
  }
};

export const loadInstancesFromLocalStorage = (
  userId: string
): WhatsAppInstance[] => {
  try {
    const savedInstancesStr = localStorage.getItem(STORAGE_KEY);
    console.log('Raw saved instances from localStorage:', savedInstancesStr);
    
    if (savedInstancesStr && userId) {
      // Parse saved instances
      const allInstances = JSON.parse(savedInstancesStr);
      
      // If it's an array, filter by user ID
      if (Array.isArray(allInstances)) {
        // Filter instances to only show those belonging to the current user
        const userInstances = allInstances.filter(
          (instance: WhatsAppInstance) => instance.userId === userId
        );
        console.log(`Found ${userInstances.length} instances for user ${userId}:`, userInstances);
        return userInstances;
      }
    }
    console.log(`No instances found for user ${userId}`);
    return [];
  } catch (error) {
    console.error("Error loading instances from localStorage:", error);
    return [];
  }
};
