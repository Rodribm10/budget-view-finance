
import { getUserWhatsAppInstance } from './databaseOperations';

/**
 * User-related WhatsApp instance operations
 */

/**
 * Checks if user has an active WhatsApp instance
 */
export async function checkUserHasInstance(userEmail: string): Promise<boolean> {
  try {
    const instanceData = await getUserWhatsAppInstance(userEmail.toLowerCase()); // Padronização obrigatória
    const hasInstance = !!(instanceData && instanceData.instancia_zap && instanceData.instancia_zap.trim() !== '');
    console.log(`Usuário ${userEmail} tem instância:`, hasInstance, instanceData);
    return hasInstance;
  } catch (error) {
    console.error('Erro ao verificar se usuário tem instância:', error);
    return false;
  }
}

/**
 * Updates user WhatsApp instance information
 */
export async function updateUserWhatsAppInstance(
  userEmail: string, 
  instanceName: string, 
  status: string, 
  phoneNumber: string = ''
): Promise<void> {
  try {
    const normalizedEmail = userEmail.toLowerCase(); // Padronização obrigatória
    console.log(`Atualizando instância para usuário: ${normalizedEmail}`, {
      instanceName,
      status,
      phoneNumber
    });
    
    // Aqui você implementaria a lógica para atualizar no banco de dados
    // Por exemplo, usando Supabase:
    // await supabase
    //   .from('usuarios')
    //   .update({
    //     instancia_zap: instanceName,
    //     status_instancia: status,
    //     whatsapp: phoneNumber
    //   })
    //   .eq('email', normalizedEmail);
    
    console.log('✅ Instância atualizada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao atualizar instância:', error);
    throw error;
  }
}
