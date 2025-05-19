
// This file is kept for backwards compatibility
// It re-exports all WhatsApp service functions from their new modular structure

export * from './whatsApp/instanceManagement';
export * from './whatsApp/instanceActions';
export * from './whatsApp/localStorage';

// Export config values if needed by other parts of the app
export { SERVER_URL, API_KEY, STORAGE_KEY } from './whatsApp/config';
