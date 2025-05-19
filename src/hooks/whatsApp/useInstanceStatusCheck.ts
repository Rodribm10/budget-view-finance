import { useCallback } from 'react';
import { WhatsAppInstance } from '@/types/whatsAppTypes';
import { fetchConnectionState } from '@/services/whatsApp/instanceManagement';

export const useInstanceStatusCheck = (
  instances: WhatsAppInstance[],
  setInstances: React.Dispatch<React.SetStateAction<WhatsAppInstance[]>>,
  isCheckingStatus: boolean,
  setIsCheckingStatus: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Function to check connection status for all instances
  const checkAllInstancesStatus = useCallback(async () => {
    if (instances.length === 0 || isCheckingStatus) return;
    
    console.log(`Checking connection status for ${instances.length} instances`);
    setIsCheckingStatus(true);
    
    try {
      const updatedInstances = await Promise.all(
        instances.map(async (instance) => {
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
        })
      );
      
      // Only update state if there are actual changes
      const hasChanges = JSON.stringify(updatedInstances) !== JSON.stringify(instances);
      if (hasChanges) {
        console.log('Updated instances after status check:', updatedInstances);
        setInstances(updatedInstances);
      } else {
        console.log('No changes in instance status');
      }
    } catch (error) {
      console.error("Error checking instances status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [instances, isCheckingStatus, setInstances, setIsCheckingStatus]);

  return { checkAllInstancesStatus };
};
