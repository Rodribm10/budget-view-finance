
import { WhatsAppInstance } from '@/types/whatsAppTypes';

const SERVER_URL = "evolutionapi2.innova1001.com.br";
const API_KEY = "beeb77fbd7f48f91db2cd539a573c130";

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

export const saveInstancesToLocalStorage = (
  instances: WhatsAppInstance[], 
  currentUserId: string
): void => {
  // We need to save ALL instances (not just current user's) to maintain everyone's data
  const savedInstances = localStorage.getItem('whatsappInstances');
  let allInstances: WhatsAppInstance[] = [];
  
  if (savedInstances) {
    try {
      const parsedInstances = JSON.parse(savedInstances);
      // Filter out current user's instances from saved data (we'll add updated ones)
      allInstances = parsedInstances.filter(
        (instance: WhatsAppInstance) => instance.userId !== currentUserId
      );
    } catch (error) {
      console.error("Error parsing saved instances:", error);
    }
  }
  
  // Add current user's instances to the array
  const updatedInstances = [...allInstances, ...instances];
  localStorage.setItem('whatsappInstances', JSON.stringify(updatedInstances));
  console.log('All WhatsApp instances saved to localStorage:', updatedInstances);
};

export const loadInstancesFromLocalStorage = (
  userId: string
): WhatsAppInstance[] => {
  const savedInstances = localStorage.getItem('whatsappInstances');
  console.log('Raw saved instances from localStorage:', savedInstances);
  
  if (savedInstances && userId) {
    try {
      const allInstances = JSON.parse(savedInstances);
      // Filter instances to only show those belonging to the current user
      const userInstances = allInstances.filter(
        (instance: WhatsAppInstance) => instance.userId === userId
      );
      console.log(`Found ${userInstances.length} instances for user ${userId}:`, userInstances);
      return userInstances;
    } catch (error) {
      console.error("Error parsing saved instances:", error);
      return [];
    }
  }
  console.log(`No instances found for user ${userId}`);
  return [];
};
