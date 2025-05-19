
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { STORAGE_KEY } from './config';

/**
 * Saves WhatsApp instances to localStorage
 */
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

/**
 * Loads WhatsApp instances from localStorage for a specific user
 */
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
