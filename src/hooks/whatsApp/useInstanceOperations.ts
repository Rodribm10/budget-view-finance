
import { WhatsAppInstance } from '@/types/whatsAppTypes';

export const useInstanceOperations = (
  instances: WhatsAppInstance[],
  setInstances: React.Dispatch<React.SetStateAction<WhatsAppInstance[]>>
) => {
  // Add a new instance
  const addInstance = (newInstance: WhatsAppInstance) => {
    console.log("New instance created, adding to instances list:", newInstance);
    
    // Verifica se já existe uma instância com o mesmo ID
    const existingIndex = instances.findIndex(inst => inst.instanceId === newInstance.instanceId);
    
    if (existingIndex >= 0) {
      // Atualiza a instância existente
      console.log(`Instance with ID ${newInstance.instanceId} already exists, updating it`);
      setInstances(prevInstances => 
        prevInstances.map((instance, index) => 
          index === existingIndex ? newInstance : instance
        )
      );
    } else {
      // Adiciona nova instância
      setInstances(prevInstances => [...prevInstances, newInstance]);
    }
  };

  // Remove an instance
  const removeInstance = (instanceId: string) => {
    console.log(`Removing instance with ID: ${instanceId}`);
    setInstances(prevInstances => {
      const filtered = prevInstances.filter(instance => instance.instanceId !== instanceId);
      console.log("Updated instances after deletion:", filtered);
      return filtered;
    });
  };

  // Update an instance
  const updateInstance = (updatedInstance: WhatsAppInstance) => {
    console.log(`Updating instance: ${updatedInstance.instanceName}`, updatedInstance);
    setInstances(prevInstances => {
      const newInstances = prevInstances.map(instance => 
        instance.instanceId === updatedInstance.instanceId 
          ? updatedInstance 
          : instance
      );
      
      console.log("Updated instances:", newInstances);
      return newInstances;
    });
  };

  return {
    addInstance,
    removeInstance,
    updateInstance
  };
};
