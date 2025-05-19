
import { makeRequest } from './apiHelpers';

/**
 * Restarts a WhatsApp instance
 */
export const restartInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Restarting instance: ${instanceName}`);
    
    const data = await makeRequest(`/instance/restart/${encodeURIComponent(instanceName)}`, 'PUT');
    
    console.log(`Restart response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error restarting instance ${instanceName}:`, error);
    throw error;
  }
};

/**
 * Logs out (disconnects) a WhatsApp instance
 */
export const logoutInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Logging out instance: ${instanceName}`);
    
    const data = await makeRequest(`/instance/logout/${encodeURIComponent(instanceName)}`, 'DELETE');
    
    console.log(`Logout response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error logging out instance ${instanceName}:`, error);
    throw error;
  }
};

/**
 * Deletes a WhatsApp instance
 */
export const deleteInstance = async (instanceName: string): Promise<any> => {
  try {
    console.log(`Deleting instance: ${instanceName}`);
    
    const data = await makeRequest(`/instance/${encodeURIComponent(instanceName)}`, 'DELETE');
    
    console.log(`Delete response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error deleting instance ${instanceName}:`, error);
    throw error;
  }
};

/**
 * Sets the online/offline presence status for an instance
 */
export const setInstancePresence = async (instanceName: string, presence: 'online' | 'offline'): Promise<any> => {
  try {
    console.log(`Setting presence to ${presence} for: ${instanceName}`);
    
    const data = await makeRequest(`/instance/setPresence/${encodeURIComponent(instanceName)}`, 'POST', { presence });
    
    console.log(`Set presence response for ${instanceName}:`, data);
    return data;
  } catch (error) {
    console.error(`Error setting presence to ${presence} for instance ${instanceName}:`, error);
    throw error;
  }
};
