
// Re-export all functions from the new modular structure
export * from './databaseOperations';
export * from './workflowOperations';
export * from './config';

// For backwards compatibility, also export individual functions specifically
export {
  updateUserWhatsAppInstance,
  getUserWhatsAppInstance,
  removeUserWhatsAppInstance,
  getUserDebugInfo
} from './databaseOperations';

export {
  activateUserWorkflow
} from './workflowOperations';

// Export a helper function to check if user has instance
export async function checkUserHasInstance(userEmail: string): Promise<boolean> {
  try {
    const { getUserWhatsAppInstance } = await import('./databaseOperations');
    const instanceData = await getUserWhatsAppInstance(userEmail.trim().toLowerCase());
    
    return !!(instanceData && instanceData.instancia_zap && instanceData.instancia_zap.trim() !== '');
  } catch (error) {
    console.error('Erro ao verificar se usuário tem instância:', error);
    return false;
  }
}
