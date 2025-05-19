
import { WhatsAppInstance } from '@/types/whatsAppTypes';

export interface WhatsAppInstancesState {
  instances: WhatsAppInstance[];
  currentUserId: string;
  isRefreshing: boolean;
}

export interface WhatsAppInstancesActions {
  addInstance: (newInstance: WhatsAppInstance) => void;
  removeInstance: (instanceId: string) => void;
  updateInstance: (updatedInstance: WhatsAppInstance) => void;
  refreshInstances: () => Promise<void>;
  checkAllInstancesStatus: () => Promise<void>;
}

export type WhatsAppInstancesHookReturn = WhatsAppInstancesState & WhatsAppInstancesActions;
