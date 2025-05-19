
import { useInstanceState } from './whatsApp/useInstanceState';
import { useInstanceOperations } from './whatsApp/useInstanceOperations';
import { useInstanceStatusCheck } from './whatsApp/useInstanceStatusCheck';
import { useInstanceRefresh } from './whatsApp/useInstanceRefresh';

export const useWhatsAppInstances = () => {
  const {
    instances,
    setInstances,
    currentUserId,
    isRefreshing,
    setIsRefreshing,
    isCheckingStatus,
    setIsCheckingStatus
  } = useInstanceState();

  const { addInstance, removeInstance, updateInstance } = useInstanceOperations(
    instances,
    setInstances
  );

  const { checkAllInstancesStatus } = useInstanceStatusCheck(
    instances,
    setInstances,
    isCheckingStatus,
    setIsCheckingStatus
  );

  const { refreshInstances } = useInstanceRefresh(
    instances,
    setInstances,
    currentUserId,
    setIsRefreshing
  );

  return {
    instances,
    isRefreshing,
    currentUserId,
    addInstance,
    removeInstance,
    updateInstance,
    refreshInstances,
    checkAllInstancesStatus
  };
};
