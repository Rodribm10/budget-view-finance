
// This file is kept for backwards compatibility
// It re-exports all WhatsApp service functions from their new modular structure

export * from './whatsApp/instanceManagement';
export * from './whatsApp/instanceActions';
export * from './whatsApp/localStorage';
export * from './whatsApp/webhookService';

// Export only the storage key that still exists in config
export { STORAGE_KEY } from './whatsApp/config';
