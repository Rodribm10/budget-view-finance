
// Re-export all WhatsApp instance service functions
export * from './databaseOperations';
export * from './workflowOperations';
export * from './config';

// Import and re-export specific functions from userOperations to avoid conflicts
export { 
  checkUserHasInstance,
  updateUserWhatsAppInstance as updateUserWhatsAppInstanceWithPhone
} from './userOperations';
