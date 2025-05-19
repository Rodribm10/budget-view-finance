
import { WhatsAppInstance } from '@/types/whatsAppTypes';

/**
 * Load WhatsApp instances from localStorage for a specific user
 */
export const loadInstancesFromLocalStorage = (userId: string): WhatsAppInstance[] => {
  try {
    const storedData = localStorage.getItem(`whatsAppInstances_${userId}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log(`Loaded ${parsedData.length} instances from localStorage for user ${userId}`);
      return parsedData;
    }
  } catch (error) {
    console.error('Error loading WhatsApp instances from localStorage:', error);
  }
  return [];
};

/**
 * Save WhatsApp instances to localStorage for a specific user
 */
export const saveInstancesToLocalStorage = (instances: WhatsAppInstance[], userId: string): void => {
  try {
    console.log(`Saving ${instances.length} instances to localStorage for user ${userId}`);
    localStorage.setItem(`whatsAppInstances_${userId}`, JSON.stringify(instances));
  } catch (error) {
    console.error('Error saving WhatsApp instances to localStorage:', error);
  }
};
