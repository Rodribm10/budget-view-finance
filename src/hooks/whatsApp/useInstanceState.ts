
import { useState, useEffect } from 'react';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { 
  saveInstancesToLocalStorage, 
  loadInstancesFromLocalStorage 
} from '@/services/whatsApp/localStorage';

export const useInstanceState = () => {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Get current user ID and load instances on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId') || '';
    console.log("Current userId from localStorage:", userId);
    setCurrentUserId(userId);
    
    if (userId) {
      const userInstances = loadInstancesFromLocalStorage(userId);
      console.log('Loaded user instances:', userInstances);
      setInstances(userInstances);
    }
  }, []); // Only run once on mount

  // Save instances to localStorage whenever they change
  useEffect(() => {
    if (currentUserId && instances.length > 0) {
      console.log('Saving instances to localStorage:', instances);
      saveInstancesToLocalStorage(instances, currentUserId);
    }
  }, [instances, currentUserId]);

  return {
    instances,
    setInstances,
    currentUserId,
    isRefreshing,
    setIsRefreshing,
    isCheckingStatus,
    setIsCheckingStatus
  };
};
