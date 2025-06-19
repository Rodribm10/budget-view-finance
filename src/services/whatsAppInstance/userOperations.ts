
import { getUserWhatsAppInstance } from './databaseOperations';

/**
 * User-related WhatsApp instance operations
 */

/**
 * Checks if user has an active WhatsApp instance
 */
export async function checkUserHasInstance(userEmail: string): Promise<boolean> {
  try {
    const instanceData = await getUserWhatsAppInstance(userEmail);
    const hasInstance = !!(instanceData && instanceData.instancia_zap && instanceData.instancia_zap.trim() !== '');
    console.log(`Usuário ${userEmail} tem instância:`, hasInstance, instanceData);
    return hasInstance;
  } catch (error) {
    console.error('Erro ao verificar se usuário tem instância:', error);
    return false;
  }
}
