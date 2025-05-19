
export interface WhatsAppInstance {
  instanceName: string;
  instanceId: string;
  phoneNumber: string;
  userId: string;
  status?: string;
  qrcode?: string;
  connectionState?: 'open' | 'closed' | 'connecting';
}
