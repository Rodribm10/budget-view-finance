
import { WhatsAppInstance } from '@/types/whatsAppTypes';

const SERVER_URL = "evolutionapi2.innova1001.com.br";
const API_KEY = "beeb77fbd7f48f91db2cd539a573c130";

// Local storage key
const STORAGE_KEY = 'whatsappInstances';

export const createWhatsAppInstance = async (
  instanceName: string, 
  phoneNumber: string
): Promise<any> => {
  console.log(`Creating new WhatsApp instance: ${instanceName}, ${phoneNumber}`);
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
    console.error('Error creating instance:', errorData);
    throw new Error(errorData.message || 'Erro ao criar instância');
  }

  const data = await response.json();
  console.log('Create instance API response:', data);
  return data;
};

export const fetchQrCode = async (instanceName: string): Promise<any> => {
  console.log(`Fetching QR code for instance: ${instanceName}`);
  const response = await fetch(`https://${SERVER_URL}/instance/connect/${encodeURIComponent(instanceName)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error fetching QR code:', errorData);
    throw new Error(errorData.message || 'Erro ao obter QR Code');
  }

  const data = await response.json();
  console.log('QR code fetch response:', data);
  return data;
};

export const fetchConnectionState = async (instanceName: string): Promise<'open' | 'closed' | 'connecting'> => {
  try {
    console.log(`Fetching connection state for: ${instanceName}`);
    const response = await fetch(`https://${SERVER_URL}/instance/connectionState/${encodeURIComponent(instanceName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Connection state error for ${instanceName}:`, errorData);
      
      // If instance doesn't exist, throw a specific error
      if (response.status === 404) {
        throw new Error(`The "${instanceName}" instance does not exist`);
      }
      
      return 'closed';
    }

    const data = await response.json();
    console.log(`Connection state for ${instanceName}:`, data);
    return data.instance?.state || 'closed';
  } catch (error) {
    console.error(`Error fetching connection state for ${instanceName}:`, error);
    if (error instanceof Error && error.message.includes("does not exist")) {
      throw error; // Rethrow specific "does not exist" errors
    }
    return 'closed';
  }
};

// Nova função para listar todas as instâncias
export const fetchAllInstances = async (): Promise<any> => {
  try {
    console.log('Fetching all instances');
    const response = await fetch(`https://${SERVER_URL}/fetch-instances`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching instances:', errorData);
      throw new Error(errorData.message || 'Erro ao buscar instâncias');
    }

    const data = await response.json();
    console.log('All instances response:', data);
    return data;
  } catch (error) {
    console.error("Error fetching all instances:", error);
    throw error;
  }
};

// Função para reiniciar uma instância
export const restartInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Restarting instance: ${instanceName}`);
    const response = await fetch(`https://${SERVER_URL}/instance/restart/${encodeURIComponent(instanceName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error restarting instance ${instanceName}:`, errorData);
      throw new Error(errorData.message || 'Erro ao reiniciar instância');
    }

    const data = await response.json();
    console.log(`Restart response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error restarting instance ${instanceName}:`, error);
    throw error;
  }
};

// Função para desconectar (logout) uma instância
export const logoutInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Logging out instance: ${instanceName}`);
    const response = await fetch(`https://${SERVER_URL}/instance/logout/${encodeURIComponent(instanceName)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error logging out instance ${instanceName}:`, errorData);
      throw new Error(errorData.message || 'Erro ao desconectar instância');
    }

    const data = await response.json();
    console.log(`Logout response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error logging out instance ${instanceName}:`, error);
    throw error;
  }
};

// Função para excluir uma instância
export const deleteInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Deleting instance: ${instanceName}`);
    const response = await fetch(`https://${SERVER_URL}/instance/${encodeURIComponent(instanceName)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting instance ${instanceName}:`, errorData);
      throw new Error(errorData.message || 'Erro ao excluir instância');
    }

    const data = await response.json();
    console.log(`Delete response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error deleting instance ${instanceName}:`, error);
    throw error;
  }
};

// Função para definir presença online/offline
export const setInstancePresence = async (instanceName: string, presence: 'online' | 'offline'): Promise<any> => {
  try {
    console.log(`Setting presence to ${presence} for: ${instanceName}`);
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
      console.error(`Error setting presence for ${instanceName}:`, errorData);
      throw new Error(errorData.message || `Erro ao definir presença para ${presence}`);
    }

    const data = await response.json();
    console.log(`Set presence response for ${instanceName}:`, data);
    return data;
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
    console.log(`Saving ${instances.length} instances for user ${currentUserId}`);
    // Get existing instances from localStorage
    const savedInstancesStr = localStorage.getItem(STORAGE_KEY);
    let allInstances: WhatsAppInstance[] = [];
    
    if (savedInstancesStr) {
      try {
        // Parse saved instances
        const savedInstances = JSON.parse(savedInstancesStr);
        
        // If it's an array, filter out current user's old instances
        if (Array.isArray(savedInstances)) {
          allInstances = savedInstances.filter(
            (instance: WhatsAppInstance) => instance.userId !== currentUserId
          );
        }
      } catch (parseError) {
        console.error('Error parsing stored instances, resetting:', parseError);
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
    console.log(`Loading instances for user: ${userId}`);
    const savedInstancesStr = localStorage.getItem(STORAGE_KEY);
    console.log('Raw saved instances from localStorage:', savedInstancesStr);
    
    if (savedInstancesStr && userId) {
      try {
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
      } catch (parseError) {
        console.error('Error parsing stored instances:', parseError);
      }
    }
    console.log(`No instances found for user ${userId}`);
    return [];
  } catch (error) {
    console.error("Error loading instances from localStorage:", error);
    return [];
  }
};
