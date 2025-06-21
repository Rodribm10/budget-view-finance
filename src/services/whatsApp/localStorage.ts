
/**
 * Local storage utilities for WhatsApp instances
 */

export const WHATSAPP_STORAGE_KEYS = {
  INSTANCES: 'whatsappInstances',
  USER_INSTANCE: 'userWhatsAppInstance',
  LAST_STATUS_CHECK: 'lastStatusCheck'
} as const;

/**
 * Saves WhatsApp instances to localStorage
 */
export const saveInstancesToStorage = (instances: any[]): void => {
  try {
    localStorage.setItem(WHATSAPP_STORAGE_KEYS.INSTANCES, JSON.stringify(instances));
    console.log('Instances saved to localStorage:', instances.length);
  } catch (error) {
    console.error('Error saving instances to localStorage:', error);
  }
};

/**
 * Loads WhatsApp instances from localStorage
 */
export const loadInstancesFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(WHATSAPP_STORAGE_KEYS.INSTANCES);
    if (stored) {
      const instances = JSON.parse(stored);
      console.log('Instances loaded from localStorage:', instances.length);
      return instances;
    }
  } catch (error) {
    console.error('Error loading instances from localStorage:', error);
  }
  return [];
};

/**
 * Saves user instance name to localStorage
 */
export const saveUserInstanceName = (instanceName: string): void => {
  try {
    localStorage.setItem(WHATSAPP_STORAGE_KEYS.USER_INSTANCE, instanceName);
    console.log('User instance name saved:', instanceName);
  } catch (error) {
    console.error('Error saving user instance name:', error);
  }
};

/**
 * Loads user instance name from localStorage
 */
export const loadUserInstanceName = (): string | null => {
  try {
    const instanceName = localStorage.getItem(WHATSAPP_STORAGE_KEYS.USER_INSTANCE);
    console.log('User instance name loaded:', instanceName);
    return instanceName;
  } catch (error) {
    console.error('Error loading user instance name:', error);
    return null;
  }
};

/**
 * Clears user instance name from localStorage
 */
export const clearUserInstanceName = (): void => {
  try {
    localStorage.removeItem(WHATSAPP_STORAGE_KEYS.USER_INSTANCE);
    console.log('User instance name cleared from localStorage');
  } catch (error) {
    console.error('Error clearing user instance name:', error);
  }
};

/**
 * Saves last status check timestamp
 */
export const saveLastStatusCheck = (timestamp: number): void => {
  try {
    localStorage.setItem(WHATSAPP_STORAGE_KEYS.LAST_STATUS_CHECK, timestamp.toString());
  } catch (error) {
    console.error('Error saving last status check:', error);
  }
};

/**
 * Gets last status check timestamp
 */
export const getLastStatusCheck = (): number => {
  try {
    const stored = localStorage.getItem(WHATSAPP_STORAGE_KEYS.LAST_STATUS_CHECK);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Error getting last status check:', error);
    return 0;
  }
};
