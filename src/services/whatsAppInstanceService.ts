
// Re-export all functions from the new modular structure
export * from './whatsAppInstance';

// For backwards compatibility, also export individual functions
export {
  updateUserWhatsAppInstance,
  getUserWhatsAppInstance,
  removeUserWhatsAppInstance,
  getUserDebugInfo,
  activateUserWorkflow,
  checkUserHasInstance
} from './whatsAppInstance';
