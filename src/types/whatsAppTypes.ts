
export interface WhatsAppInstance {
  instanceName: string;
  instanceId: string;
  phoneNumber: string;
  userId: string;
  status?: string;
  qrcode?: string | null;
  connectionState?: 'open' | 'closed' | 'connecting' | string;
  presence?: 'online' | 'offline';
}
