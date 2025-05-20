
import { makeRequest } from './apiHelpers';

// Define proper types for API responses
interface InstanceConnectionState {
  instance?: {
    state: 'open' | 'closed' | 'connecting';
  };
}

/**
 * Creates a new WhatsApp instance
 */
export const createWhatsAppInstance = async (
  instanceName: string, 
  phoneNumber: string
): Promise<any> => {
  console.log(`Creating new WhatsApp instance: ${instanceName}, ${phoneNumber}`);
  
  const data = await makeRequest('/instance/create', 'POST', {
    instanceName: instanceName,
    number: phoneNumber,
    qrcode: true,
    integration: "WHATSAPP-BAILEYS"
  });
  
  console.log('Create instance API response:', data);
  return data;
};

/**
 * Fetches QR code for an instance
 */
export const fetchQrCode = async (instanceName: string): Promise<any> => {
  console.log(`Fetching QR code for instance: ${instanceName}`);
  
  const data = await makeRequest(`/instance/connect/${encodeURIComponent(instanceName)}`, 'GET');
  
  console.log('QR code fetch response:', data);
  return data;
};

/**
 * Fetches connection state for an instance
 */
export const fetchConnectionState = async (instanceName: string): Promise<'open' | 'closed' | 'connecting'> => {
  try {
    console.log(`Fetching connection state for: ${instanceName}`);
    
    const data = await makeRequest<InstanceConnectionState>(`/instance/connectionState/${encodeURIComponent(instanceName)}`, 'GET');
    
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

/**
 * Fetches all WhatsApp instances
 */
export const fetchAllInstances = async (): Promise<any> => {
  try {
    console.log('Fetching all instances');
    
    const data = await makeRequest('/fetch-instances', 'GET');
    
    console.log('All instances response:', data);
    return data;
  } catch (error) {
    console.error("Error fetching all instances:", error);
    throw error;
  }
};

/**
 * Fetches a specific WhatsApp instance by name
 */
export const fetchSpecificInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Fetching specific instance: ${instanceName}`);
    
    if (!instanceName) {
      throw new Error("Instance name cannot be empty");
    }
    
    const data = await makeRequest(`/instance/fetchInstances/${encodeURIComponent(instanceName)}`, 'GET');
    
    console.log(`Specific instance response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching specific instance ${instanceName}:`, error);
    throw error;
  }
};
