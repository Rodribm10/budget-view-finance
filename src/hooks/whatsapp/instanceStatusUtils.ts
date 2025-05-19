import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchConnectionState } from '@/services/whatsAppService';

/**
 * Checks the connection status for a single WhatsApp instance
 */
export const checkInstanceStatus = async (instance: WhatsAppInstance): Promise<WhatsAppInstance> => {
  try {
    console.log(`Checking status for ${instance.instanceName}`);
    const state = await fetchConnectionState(instance.instanceName);
    console.log(`Status for ${instance.instanceName}: ${state}`);
    
    // Only update connectionState if it's different
    if (instance.connectionState !== state) {
      // Ensure the state is one of the valid values or treat as 'closed'
      let validState: 'open' | 'closed' | 'connecting';
      if (state === 'open' || state === 'connecting') {
        validState = state;
      } else {
        validState = 'closed';
      }
      
      return { 
        ...instance, 
        connectionState: validState,
        status: state === 'open' ? 'connected' : 
               state === 'connecting' ? 'connecting' : 'disconnected'
      };
    }
    return instance;
  } catch (error) {
    console.error(`Error checking status for ${instance.instanceName}:`, error);
    
    // If the instance doesn't exist on the server, mark it as closed
    if (error instanceof Error && error.message.includes("does not exist")) {
      return { 
        ...instance, 
        connectionState: 'closed' as const, 
        status: 'disconnected' 
      };
    }
    
    // Keep the current state in case of other errors
    return instance;
  }
};

/**
 * Maps server instances to the local WhatsAppInstance format
 */
export const mapServerInstancesToLocal = (
  serverInstances: any[], 
  currentUserId: string
): WhatsAppInstance[] => {
  return serverInstances.map(serverInstance => {
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
};
